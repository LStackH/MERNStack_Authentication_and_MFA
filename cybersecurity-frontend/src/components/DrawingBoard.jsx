import React, { useRef, useState, useEffect } from 'react';
import { saveDrawing } from '../api/drawingApi';

const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];

function DrawingBoard({ onDrawingSaved }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [lineWidth, setLineWidth] = useState(2);

  // Initialize canvas with white background
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.8; // 80% of window width
    canvas.height = 400; // fixed height
    const context = canvas.getContext('2d');
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Start drawing on mousedown
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.strokeStyle = selectedColor;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  // Draw on mousemove if drawing is active
  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  // End drawing on mouseup or mouse leave
  const endDrawing = () => {
    setIsDrawing(false);
  };

  // Clear the canvas and refill with white
  const clearBoard = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Save the drawing by sending the canvas image data to the backend
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const imageData = canvasRef.current.toDataURL('image/png');
      const response = await saveDrawing(imageData, token);
      console.log('Drawing saved:', response.data);
      alert('Drawing saved successfully!');
      if (onDrawingSaved) onDrawingSaved();
    } catch (error) {
      console.error('Error saving drawing:', error.response?.data || error.message);
      alert('Error saving drawing.');
    }
  };

  return (
    <div className="bg-gray-500 bg-opacity-90 rounded-lg shadow-lg p-4 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Drawing Board</h2>
      <div className="flex justify-center items-center mb-4 space-x-2">
        {colors.map((color) => (
          <button 
            key={color} 
            className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-black' : 'border-transparent'}`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
          ></button>
        ))}
        <div className="flex items-center">
          <label className="mr-2 text-white">Custom:</label>
          <input 
            type="color" 
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-8 h-8 p-0 border-2 rounded-full"
          />
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="border border-gray-300 w-full"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
      />
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={clearBoard}
          className="px-4 py-2 bg-[#A11919] text-white rounded hover:bg-[#FF0000] transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#1AA125] text-white rounded hover:bg-[#59FF00] transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default DrawingBoard;
