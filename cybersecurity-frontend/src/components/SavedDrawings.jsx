import React, { useEffect, useState } from 'react';
import { getDrawings, deleteDrawing } from '../api/drawingApi';

function SavedDrawings() {
  const [drawings, setDrawings] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchDrawings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await getDrawings(token);
      setDrawings(response.data.drawings);
    } catch (err) {
      console.error('Error fetching drawings:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchDrawings();
  }, []);

  const removeDrawing = async (drawingId) => {
    try {
      const token = localStorage.getItem('token');
      await deleteDrawing(drawingId, token);
      // Update state by removing the deleted drawing
      setDrawings((prev) => prev.filter((d) => d._id !== drawingId));
    } catch (err) {
      console.error('Error deleting drawing:', err.response?.data || err.message);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Your Saved Drawings</h3>
      <div className="flex flex-wrap justify-center gap-4">
        {drawings.length > 0 ? (
          drawings.map((drawing) => (
            <div key={drawing._id} className="relative group">
              <button
                onClick={() => removeDrawing(drawing._id)}
                className="absolute top-0 right-0 m-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
              <img
                src={drawing.imageData}
                alt="User drawing"
                className="w-48 h-48 object-cover rounded shadow cursor-pointer"
                onClick={() => setSelectedImage(drawing.imageData)}
              />
            </div>
          ))
        ) : (
          <p className="text-white">No drawings saved yet.</p>
        )}
      </div>
      {/* Modal for full-size image preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-0 right-0 m-2 text-white text-2xl font-bold"
            >
              ×
            </button>
            <img src={selectedImage} alt="Full size drawing" className="max-w-full max-h-screen rounded shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
}

export default SavedDrawings;
