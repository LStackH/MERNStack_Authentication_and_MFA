const User = require('../models/User');

// @desc    Get a single users data
// @route   GET /api/user
// @access  Private (user)
exports.getUser = async (req, res) => {
  try {
    const userData = await User.findById(req.user.id).select('-password -mfaSecret');
    if (!userData) return res.status(404).json({ message: 'User not found' });
    res.json({ user: userData });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
