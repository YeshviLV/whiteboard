const mongoose = require('mongoose');

const drawingSchema = new mongoose.Schema({
  path: {
    type: Array, // Store an array of points (x, y)
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Drawing', drawingSchema);
