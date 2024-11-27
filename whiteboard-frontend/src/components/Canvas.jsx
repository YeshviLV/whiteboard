import React, { useRef, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Connect to the backend server
const socket = io('http://localhost:5000');

const Canvas = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pencil'); // State for tool selection
  const [pointerSize, setPointerSize] = useState(5); // State for pointer size
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 }); // Cursor position for custom cursor
  const [canvasOffset, setCanvasOffset] = useState({ top: 0, left: 0 }); // Canvas offset in the document

  // Setup canvas and Socket.IO listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = 'black';
    contextRef.current = context;

    // Calculate canvas position relative to the viewport
    const { top, left } = canvas.getBoundingClientRect();
    setCanvasOffset({ top, left });

    // Listen for drawing events
    socket.on('draw', ({ prevX, prevY, x, y, size }) => {
      context.lineWidth = size;
      context.beginPath();
      context.moveTo(prevX, prevY);
      context.lineTo(x, y);
      context.stroke();
      context.closePath();
    });

    socket.on('clear', () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    });
  }, []);

  // Start drawing or erasing
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = getAdjustedCoordinates(nativeEvent);

    if (tool === 'erase') {
      contextRef.current.clearRect(
        offsetX - pointerSize / 2,
        offsetY - pointerSize / 2,
        pointerSize,
        pointerSize
      );
    } else {
      contextRef.current.lineWidth = pointerSize; // Update line width only when starting to draw
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  // Finish drawing or erasing
  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  // Draw or erase depending on the tool
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = getAdjustedCoordinates(nativeEvent);
    const context = contextRef.current;
    const prevX = context.currentX || offsetX;
    const prevY = context.currentY || offsetY;

    if (tool === 'pencil') {
      context.lineWidth = pointerSize;
      context.lineTo(offsetX, offsetY);
      context.stroke();
      socket.emit('draw', {
        prevX,
        prevY,
        x: offsetX,
        y: offsetY,
        size: pointerSize,
      });
    } else if (tool === 'erase') {
      context.clearRect(
        offsetX - pointerSize / 2,
        offsetY - pointerSize / 2,
        pointerSize,
        pointerSize
      );
    }

    context.currentX = offsetX;
    context.currentY = offsetY;
  };

  // Adjust cursor position to account for canvas offset
  const updateCursor = ({ nativeEvent }) => {
    const { offsetX, offsetY } = getAdjustedCoordinates(nativeEvent);
    setCursorPosition({ x: offsetX, y: offsetY });
  };

  // Clear the canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clear');
  };

  // Adjust event coordinates to account for canvas offset
  const getAdjustedCoordinates = (nativeEvent) => {
    const { clientX, clientY } = nativeEvent;
    return {
      offsetX: clientX - canvasOffset.left,
      offsetY: clientY - canvasOffset.top,
    };
  };

  return (
    <div className="relative h-screen bg-gray-100">
      {/* Tool Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-4 p-4 bg-white shadow-lg rounded-md">
        <button
          className={`px-4 py-2 rounded ${
            tool === 'pencil' ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-600'
          }`}
          onClick={() => setTool('pencil')}
        >
          ✏️ Pencil
        </button>
        <button
          className={`px-4 py-2 rounded ${
            tool === 'erase' ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}
          onClick={() => setTool('erase')}
        >
          🧹 Eraser
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={clearCanvas}
        >
          🗑️ Clear
        </button>
        <div className="flex items-center space-x-2">
          <label className="text-gray-700 font-medium">Pointer Size:</label>
          <input
            type="range"
            min="2"
            max="20"
            value={pointerSize}
            onChange={(e) => setPointerSize(Number(e.target.value))}
            className="w-24"
          />
        </div>
      </div>

      {/* Custom Cursor */}
      <div
        style={{
          position: 'absolute',
          left: cursorPosition.x - pointerSize / 2,
          top: cursorPosition.y - pointerSize / 2,
          width: pointerSize,
          height: pointerSize,
          backgroundColor: tool === 'erase' ? 'white' : 'black',
          border:
            tool === 'erase'
              ? '1px solid gray'
              : `1px solid ${tool === 'pencil' ? 'black' : 'transparent'}`,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
        onMouseMove={(e) => {
          updateCursor(e);
          draw(e);
        }}
        className="w-full h-full bg-white shadow-lg"
      />
    </div>
  );
};

export default Canvas;





// import React, { useRef, useEffect, useState } from 'react';
// import { io } from 'socket.io-client';

// // Connect to the backend server
// const socket = io('http://localhost:5000');

// const Canvas = () => {
//   const canvasRef = useRef(null);
//   const contextRef = useRef(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [tool, setTool] = useState('pencil'); // State to track the selected tool (pencil, eraser, trash)

//   // Setup canvas and Socket.IO listeners
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     canvas.style.border = '1px solid #ccc';

//     const context = canvas.getContext('2d');
//     context.lineCap = 'round';
//     context.strokeStyle = 'black';
//     context.lineWidth = 2;
//     contextRef.current = context;

//     // Listen for drawing events
//     socket.on('draw', ({ prevX, prevY, x, y }) => {
//       context.beginPath();
//       context.moveTo(prevX, prevY);
//       context.lineTo(x, y);
//       context.stroke();
//       context.closePath();
//     });
//   }, []);

//   // Start drawing or erasing
//   const startDrawing = ({ nativeEvent }) => {
//     const { offsetX, offsetY } = nativeEvent;

//     if (tool === 'erase') {
//       // Eraser tool: clear small parts on click
//       contextRef.current.clearRect(offsetX - 10, offsetY - 10, 20, 20);
//     } else {
//       // Pencil tool: draw a line
//       contextRef.current.beginPath();
//       contextRef.current.moveTo(offsetX, offsetY);
//       setIsDrawing(true);
//     }
//   };

//   // Finish drawing or erasing
//   const finishDrawing = () => {
//     contextRef.current.closePath();
//     setIsDrawing(false);
//   };

//   // Draw or erase depending on the tool
//   const draw = ({ nativeEvent }) => {
//     if (!isDrawing) return;

//     const { offsetX, offsetY } = nativeEvent;
//     const context = contextRef.current;
//     const prevX = context.currentX || offsetX;
//     const prevY = context.currentY || offsetY;

//     // If the tool is pencil, draw a line
//     if (tool === 'pencil') {
//       context.lineTo(offsetX, offsetY);
//       context.stroke();
//       socket.emit('draw', { prevX, prevY, x: offsetX, y: offsetY });
//     }

//     // Update current position for next draw
//     context.currentX = offsetX;
//     context.currentY = offsetY;
//   };

//   // Clear the canvas (triggered by the trash icon)
//   const clearCanvas = () => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     socket.emit('clear'); // Optionally send clear event to other users
//   };

//   return (
//     <div className="relative">
//       <div className="absolute top-0 left-0 z-10 p-4 space-x-4">
//         {/* Pencil Button */}
//         <button
//           className="p-2 bg-blue-500 text-white rounded"
//           onClick={() => setTool('pencil')}
//         >
//           ✏️ Pencil
//         </button>
//         {/* Eraser Button */}
//         <button
//           className="p-2 bg-gray-500 text-white rounded"
//           onClick={() => setTool('erase')}
//         >
//           🧹 Eraser
//         </button>
//         {/* Clear Canvas Button */}
//         <button
//           className="p-2 bg-red-500 text-white rounded"
//           onClick={clearCanvas}
//         >
//           🗑️ Clear
//         </button>
//       </div>

//       <canvas
//         ref={canvasRef}
//         onMouseDown={startDrawing}
//         onMouseUp={finishDrawing}
//         onMouseLeave={finishDrawing}
//         onMouseMove={draw}
//         className="w-full h-full"
//       />
//     </div>
//   );
// };

// export default Canvas;

// import React, { useRef, useEffect, useState } from 'react';
// import { io } from 'socket.io-client';

// // Connect to the backend server
// const socket = io('http://localhost:5000'); // Replace with your backend URL if needed

// const Canvas = () => {
//   const canvasRef = useRef(null);
//   const contextRef = useRef(null);
//   const [isDrawing, setIsDrawing] = useState(false);

//   // Setup canvas and Socket.IO listeners
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     canvas.style.border = '1px solid #ccc';

//     const context = canvas.getContext('2d');
//     context.lineCap = 'round';
//     context.strokeStyle = 'black';
//     context.lineWidth = 2;
//     contextRef.current = context;

//     // Listen for drawing events
//     socket.on('draw', ({ prevX, prevY, x, y }) => {
//       context.beginPath();
//       context.moveTo(prevX, prevY);
//       context.lineTo(x, y);
//       context.stroke();
//       context.closePath();
//     });
//   }, []);

//   // Start drawing
//   const startDrawing = ({ nativeEvent }) => {
//     const { offsetX, offsetY } = nativeEvent;
//     contextRef.current.beginPath();
//     contextRef.current.moveTo(offsetX, offsetY);
//     setIsDrawing(true);
//   };

//   // Finish drawing
//   const finishDrawing = () => {
//     contextRef.current.closePath();
//     setIsDrawing(false);
//   };

//   // Draw on canvas and emit events
//   const draw = ({ nativeEvent }) => {
//     if (!isDrawing) return;

//     const { offsetX, offsetY } = nativeEvent;
//     const context = contextRef.current;
//     const prevX = context.currentX || offsetX;
//     const prevY = context.currentY || offsetY;

//     // Draw line on canvas
//     context.lineTo(offsetX, offsetY);
//     context.stroke();

//     // Emit drawing data
//     socket.emit('draw', { prevX, prevY, x: offsetX, y: offsetY });

//     context.currentX = offsetX;
//     context.currentY = offsetY;
//   };

//   return (
//     <canvas
//       ref={canvasRef}
//       onMouseDown={startDrawing}
//       onMouseUp={finishDrawing}
//       onMouseLeave={finishDrawing}
//       onMouseMove={draw}
//       className="w-full h-full"
//     />
//   );
// };

// export default Canvas;
