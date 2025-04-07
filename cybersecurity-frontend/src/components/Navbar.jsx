import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token and navigate to login
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="w-full flex justify-between items-center p-4 bg-black bg-opacity-80 fixed top-0 left-0 z-20">
      <div className="text-white font-bold text-lg">Home</div>
      <button 
        onClick={handleLogout} 
        className="px-4 py-2 bg-[#5e435d] hover:bg-[#a4c6b8] text-white rounded transition-colors"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
