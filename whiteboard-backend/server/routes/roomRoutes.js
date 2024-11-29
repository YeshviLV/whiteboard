const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Room = require('../models/Room');

const router = express.Router();

// Create Room
router.post('/create', async (req, res) => {
  try {
    const { userId } = req.body; // Assuming userId is passed in the body
    const roomId = uuidv4();

    const newRoom = new Room({ roomId, createdBy: userId });
    await newRoom.save();

    res.status(201).json({ roomId, message: 'Room created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate Room
router.post('/validate', async (req, res) => {
  try {
    const { roomId } = req.body;

    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ message: 'Room not found' });

    res.status(200).json({ message: 'Room exists' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
