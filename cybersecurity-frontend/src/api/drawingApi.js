import apiClient from './apiClient';

export function getDrawings(token) {
  // GET /api/drawing
  return apiClient.get('/drawing', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function saveDrawing(imageData, token) {
  // POST /api/drawing
  return apiClient.post(
    '/drawing',
    { imageData },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export function deleteDrawing(drawingId, token) {
  // DELETE /api/drawing/:id
  return apiClient.delete(`/drawing/${drawingId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
