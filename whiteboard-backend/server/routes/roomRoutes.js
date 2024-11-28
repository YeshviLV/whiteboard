const express = require('express');
const Room = require('../models/Room');
const User = require('../models/User');
const { default: mongoose } = require('mongoose');

const router = express.Router();

// Create Room
router.post('/create', async (req, res) => {
  try {
    const { roomName } = req.body;
    const existingRoom = await Room.findOne({ roomName });
    if (existingRoom) return res.status(400).json({ message: 'Room already exists' });

    const newRoom = new Room({ roomName });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Join Room
router.post('/join', async (req, res) => {
  try {
    const { roomName, userId } = req.body;
    const room = await Room.findOne({ roomName });
    if (!room) return res.status(404).json({ message: 'Room not found' });

    if (room.users.includes(userId)) {
      return res.status(400).json({ message: 'User already in the room' });
    }

    room.users.push(userId);
    await room.save();
    res.status(200).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
