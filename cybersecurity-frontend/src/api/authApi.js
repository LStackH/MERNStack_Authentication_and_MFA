import apiClient from './apiClient';

export function registerUser(formData) {
  // POST /api/auth/register
  return apiClient.post('/auth/register', formData);
}

export function loginUser(credentials) {
  // POST /api/auth/login
  return apiClient.post('/auth/login', credentials);
}

export function verifyMFA({ userId, token }) {
  // POST /api/auth/mfa/verify
  return apiClient.post('/auth/mfa/verify', { userId, token });
}
