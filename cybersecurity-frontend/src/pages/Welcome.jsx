import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import DrawingBoard from '../components/DrawingBoard';
import SavedDrawings from '../components/SavedDrawings';

function Welcome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      axios.get('http://localhost:3000/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setUser(response.data.user);
      })
      .catch(err => {
        console.error("Error fetching user info:", err.response?.data || err.message);
        navigate('/login');
      });
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Navbar />
      <div className="pt-16">
        {/* SECTION 1 */}
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center text-white">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 max-w-3xl p-12 text-center">
            <h1 className="text-5xl font-bold mb-4">Welcome, {user.username}!</h1>
            <p className="text-xl mb-6">This is a website made to showcase authentication with MFA integration! Below you will find a drawing board for your enjoyment!</p>
          </div>
        </section>

        {/* SECTION 2 */}
        <section className="relative min-h-screen w-full flex flex-col items-center justify-center text-white">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10 max-w-3xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Drawing Board</h2>
            <p className="text-lg mb-6">
              You can choose from six pre-picked colors, or choose your own custom by clicking on them, and then drawin on the white canvas. Clicking clear will reset the canvas back to original state. Clicking Save will save the image as a PNG file to the database
            </p>
          </div>
        </section>

        <section className="relative min-h-screen w-full flex flex-col items-center justify-center text-white">
          <SavedDrawings></SavedDrawings>
        </section>

        <section className="relative min-h-screen w-full flex flex-col items-center justify-center text-white">
          <DrawingBoard />
        </section>
      </div>
    </div>
  );
}

export default Welcome;
