const express = require('express');
const router = express.Router();
const drawingController = require('../controllers/drawingController');
const { authenticateToken } = require('../middleware/authMiddleware');

// POST /api/drawing - save a drawing
router.post('/', authenticateToken, drawingController.saveDrawing);

// GET /api/drawing - retrieve drawings for the user
router.get('/', authenticateToken, drawingController.getDrawings);

// DELETE /api/drawing/:id - delete a specific drawing
router.delete('/:id', authenticateToken, drawingController.deleteDrawing);

module.exports = router;
