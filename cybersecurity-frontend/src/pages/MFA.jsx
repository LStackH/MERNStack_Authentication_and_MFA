import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function MFA() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/mfa/verify', { userId, token });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/welcome');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'MFA verification error');
      console.error('MFA verification error:', err.response?.data || err.message);
    }
  };

  return (
    <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-4 text-center">MFA Verification</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter MFA token"
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="w-full py-2 bg-[#5e435d] text-white rounded hover:bg-[#a4c6b8]">
          Verify
        </button>
      </form>
    </div>
  );
}

export default MFA;
