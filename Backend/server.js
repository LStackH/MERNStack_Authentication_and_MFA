require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const cors = require('cors');

const User = require('./models/User');
const Drawing = require('./models/Drawing');
const { authenticateToken } = require('./middleware/authMiddleware');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/cybersecurity_project', {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('Error: JWT_SECRET is not defined!');
  process.exit(1);
}

// =======================
// Registration Endpoint
// =======================
app.post('/register', async (req, res) => {
  const { username, email, password, mfaEnabled } = req.body;

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  let mfaSecret = null;
  let qrCodeData = null;

  // If user opts for MFA, generate a secret and QR code
  if (mfaEnabled) {
    const secret = speakeasy.generateSecret({ length: 20 });
    mfaSecret = secret.base32;
    try {
      qrCodeData = await qrcode.toDataURL(secret.otpauth_url);
    } catch (err) {
      return res.status(500).json({ message: 'Error generating QR code' });
    }
  }

  // Create and save the new user
  const user = new User({
    username,
    email,
    password: hashedPassword,
    mfaSecret
  });

  try {
    await user.save();
    res.json({ success: true, mfaEnabled, qrCodeData });
  } catch (err) {
    res.status(500).json({ message: 'Error saving user', error: err });
  }
});

// =======================
// Login Endpoint
// =======================
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user in the database
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: 'User not found' });

  // Verify the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

  // If MFA is enabled, require the MFA step
  if (user.mfaSecret) {
    return res.json({ mfaRequired: true, userId: user._id });
  }

  // If MFA is not enabled, issue JWT immediately
  const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// =======================
// MFA Verification Endpoint
// =======================
app.post('/mfa/verify', async (req, res) => {
  const { userId, token: mfaToken } = req.body;

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user || !user.mfaSecret) return res.status(401).json({ message: 'MFA not set up' });

  // Verify the provided TOTP token using speakeasy
  const verified = speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: 'base32',
    token: mfaToken,
    window: 1
  });

  if (verified) {
    // Issue JWT token after successful MFA verification
    const jwtToken = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: jwtToken });
  } else {
    res.status(401).json({ message: 'Invalid MFA token' });
  }
});

// =======================
// Protected User Info Endpoint
// =======================
app.get('/user', authenticateToken, async (req, res) => {
  try {
    // Exclude sensitive information like password and mfaSecret
    const userData = await User.findById(req.user.id).select('-password -mfaSecret');
    if (!userData) return res.status(404).json({ message: 'User not found' });
    res.json({ user: userData });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// =======================
// Protected Drawing Save Endpoint
// =======================
app.post('/drawing', authenticateToken, async (req, res) => {
  const { imageData } = req.body;
  if (!imageData) return res.status(400).json({ message: 'No image data provided' });

  try {
    const drawing = new Drawing({ userId: req.user.id, imageData });
    await drawing.save();
    res.json({ success: true, drawingId: drawing._id });
  } catch (err) {
    res.status(500).json({ message: 'Error saving drawing', error: err });
  }
});

// =======================
// Protected Get Drawings Endpoint
// =======================
app.get('/drawings', authenticateToken, async (req, res) => {
  try {
    const drawings = await Drawing.find({ userId: req.user.id });
    res.json({ drawings });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving drawings', error: err });
  }
});

// =======================
// Protected Delete Drawing Endpoint
// =======================
app.delete('/drawing/:id', authenticateToken, async (req, res) => {
  const drawingId = req.params.id;
  try {
    // Check if the drawing exists and belongs to the user
    const drawing = await Drawing.findOne({ _id: drawingId, userId: req.user.id });
    if (!drawing) {
      return res.status(404).json({ message: 'Drawing not found' });
    }
    await drawing.deleteOne();
    res.json({ success: true, message: 'Drawing deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting drawing', error: err });
  }
});

// =======================
// Start the Server
// =======================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
