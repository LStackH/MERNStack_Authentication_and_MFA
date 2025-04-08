const Drawing = require('../models/Drawing');

// @desc    Save a drawing
// @route   POST /api/drawing
// @access  Private (user)
exports.saveDrawing = async (req, res) => {
  const { imageData } = req.body;
  if (!imageData) return res.status(400).json({ message: 'No image data provided' });

  try {
    const drawing = new Drawing({ userId: req.user.id, imageData });
    await drawing.save();
    res.json({ success: true, drawingId: drawing._id });
  } catch (err) {
    res.status(500).json({ message: 'Error saving drawing', error: err });
  }
};

// @desc    Get all the drawings for the user
// @route   GET /api/drawing
// @access  Private (user)
exports.getDrawings = async (req, res) => {
  try {
    const drawings = await Drawing.find({ userId: req.user.id });
    res.json({ drawings });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving drawings', error: err });
  }
};

// @desc    Delete a drawing
// @route   DELETE /api/drawing/:id
// @access  Private (user)
exports.deleteDrawing = async (req, res) => {
  const drawingId = req.params.id;
  try {
    const drawing = await Drawing.findOne({ _id: drawingId, userId: req.user.id });
    if (!drawing) return res.status(404).json({ message: 'Drawing not found' });
    await drawing.deleteOne();
    res.json({ success: true, message: 'Drawing deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting drawing', error: err });
  }
};
