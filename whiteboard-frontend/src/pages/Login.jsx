import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();
  const { setRoom } = useAuth();

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      setRoom(roomId);
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Join a Room</h2>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={handleJoinRoom}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Join
        </button>
      </div>
    </div>
  );
};

export default Login;
