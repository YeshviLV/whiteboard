import React from 'react';
import { useParams } from 'react-router-dom';
import Canvas from '../components/Canvas';

const Room = () => {
  const { roomId } = useParams();

  return (
    <div className="h-screen">
      <h1 className="text-center text-2xl font-bold py-4">
        Welcome to Room: {roomId}
      </h1>
      <Canvas />
    </div>
  );
};

export default Room;
