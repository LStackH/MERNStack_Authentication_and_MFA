import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/login', credentials);
      if (response.data.mfaRequired) {
        navigate(`/mfa/${response.data.userId}`);
      } else if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/welcome');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login error');
      console.error('Login error:', err.response?.data || err.message);
    }
  };

  return (
    <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <button 
          type="submit" 
          className="w-full py-2 bg-[#5e435d] text-white rounded hover:bg-[#a4c6b8] transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
