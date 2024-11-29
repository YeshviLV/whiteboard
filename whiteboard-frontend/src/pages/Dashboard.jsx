import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [roomId, setRoomId] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login'); // If no user, redirect to login
    }
  }, [navigate]);

  const createRoom = async () => {
    if (!user) {
      alert('User not found. Please log in again.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Room Created! ID: ${data.roomId}`);
        navigate(`/room/${data.roomId}`);
      } else {
        alert(data.error || 'Error creating room');
      }
    } catch (error) {
      console.error(error);
      alert('Error creating room');
    }
  };

  const joinRoom = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/rooms/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate(`/room/${roomId}`);
      } else {
        alert(data.message || 'Room not found');
      }
    } catch (error) {
      console.error(error);
      alert('Error joining room');
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <button
        onClick={createRoom}
        className="px-4 py-2 mb-4 bg-blue-500 text-white rounded"
      >
        Create Room
      </button>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={joinRoom}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
