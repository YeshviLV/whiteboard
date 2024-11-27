const express = require('express');
const Drawing = require('../models/Drawing');

const router = express.Router();

// Save a drawing
router.post('/', async (req, res) => {
  try {
    const newDrawing = new Drawing(req.body);
    const savedDrawing = await newDrawing.save();
    res.status(201).json(savedDrawing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all drawings
router.get('/', async (req, res) => {
  try {
    const drawings = await Drawing.find();
    res.status(200).json(drawings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
