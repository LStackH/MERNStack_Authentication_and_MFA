const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET /api/user (protected)
router.get('/', authenticateToken, userController.getUser);

module.exports = router;
