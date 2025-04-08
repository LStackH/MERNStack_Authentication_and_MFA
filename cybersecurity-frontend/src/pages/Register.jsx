import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authApi';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    mfaEnabled: false,
  });
  const [qrCode, setQrCode] = useState(null);
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const response = await registerUser(formData);
      if (response.data.mfaEnabled && response.data.qrCodeData) {
        setQrCode(response.data.qrCodeData);
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration error');
      console.error('Registration error:', err.response?.data || err.message);
    }
  };

  return (
    <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
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
          type="email"
          name="email"
          placeholder="Email"
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
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            name="mfaEnabled"
            onChange={handleChange}
            className="mr-2"
          />
          Enable MFA
        </label>
        <button type="submit" className="w-full py-2 bg-[#5e435d] text-white rounded hover:bg-[#a4c6b8]">
          Register
        </button>
      </form>
      {qrCode && (
        <div className="mt-6 text-center">
          <h3 className="mb-2 font-bold">Scan this QR code with your authenticator app</h3>
          <img src={qrCode} alt="MFA QR Code" className="mx-auto" style={{ maxWidth: '200px' }} />
          <p className="mt-2">After scanning, proceed to login.</p>
        </div>
      )}
    </div>
  );
}

export default Register;
