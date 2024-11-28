const mongoose = require('mongoose');

// Define the drawing schema
const drawingSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,  // Every drawing is associated with a room
  },
  userId: {
    type: String,
    required: true,  // User who created the drawing
  },
  drawingData: {
    type: Array,
    required: true,  // Array of drawing data (like strokes, coordinates, color, etc.)
  },
  createdAt: {
    type: Date,
    default: Date.now,  // Timestamp when the drawing was created
  },
});

// Create the model from the schema
const Drawing = mongoose.model('Drawing', drawingSchema);

module.exports = Drawing;
