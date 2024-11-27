import React, { useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Connect to the backend server
const socket = io('http://localhost:5000'); // Replace with your backend URL if needed

const Canvas = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Setup canvas and Socket.IO listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.border = '1px solid #ccc';

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    contextRef.current = context;

    // Listen for drawing events
    socket.on('draw', ({ prevX, prevY, x, y }) => {
      context.beginPath();
      context.moveTo(prevX, prevY);
      context.lineTo(x, y);
      context.stroke();
      context.closePath();
    });
  }, []);

  // Start drawing
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  // Finish drawing
  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  // Draw on canvas and emit events
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;
    const context = contextRef.current;
    const prevX = context.currentX || offsetX;
    const prevY = context.currentY || offsetY;

    // Draw line on canvas
    context.lineTo(offsetX, offsetY);
    context.stroke();

    // Emit drawing data
    socket.emit('draw', { prevX, prevY, x: offsetX, y: offsetY });

    context.currentX = offsetX;
    context.currentY = offsetY;
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseLeave={finishDrawing}
      onMouseMove={draw}
      className="w-full h-full"
    />
  );
};

export default Canvas;
