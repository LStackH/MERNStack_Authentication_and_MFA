import apiClient from './apiClient';

export function getUser(token) {
  // GET /api/user
  return apiClient.get('/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
