const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

// @desc    Register User
// @route   POST /api/auth/register
// @access  public
exports.register = async (req, res) => {
  const { username, email, password, mfaEnabled } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let mfaSecret = null;
    let qrCodeData = null;
    if (mfaEnabled) {
      const secret = speakeasy.generateSecret({ length: 20 });
      mfaSecret = secret.base32;
      try {
        qrCodeData = await qrcode.toDataURL(secret.otpauth_url);
      } catch (err) {
        return res.status(500).json({ message: 'Error generating QR code' });
      }
    }
    const user = new User({ username, email, password: hashedPassword, mfaSecret });
    await user.save();
    res.json({ success: true, mfaEnabled, qrCodeData });
  } catch (err) {
    res.status(500).json({ message: 'Error saving user', error: err });
  }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  public
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    if (user.mfaSecret) {
      return res.json({ mfaRequired: true, userId: user._id });
    }
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};


// @desc    Login User
// @route   POST /api/auth/mfa/verify
// @access  public
exports.mfaVerify = async (req, res) => {
  const { userId, token: mfaToken } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user || !user.mfaSecret) return res.status(401).json({ message: 'MFA not set up' });

    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token: mfaToken,
      window: 1
    });

    if (verified) {
      const jwtToken = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token: jwtToken });
    } else {
      res.status(401).json({ message: 'Invalid MFA token' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
