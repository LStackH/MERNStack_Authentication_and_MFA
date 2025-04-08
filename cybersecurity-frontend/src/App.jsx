import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MFA from './pages/MFA';
import Welcome from './pages/Welcome';

// Layout for pages that should be centered
function CenteredLayout() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
      <nav className="mb-6">
        <Link to="/login" className="text-white mx-2">Login</Link>
        <Link to="/register" className="text-white mx-2">Register</Link>
      </nav>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        {/* Radiant background with a radial gradient */}
        <div 
          className="absolute inset-0 filter blur-3xl opacity-70" 
          style={{ 
            background: "radial-gradient(circle, #a4c6b8 0%, #5e435d 70%, #d1d5db 100%)" 
          }}
        ></div>
        <Routes>
          {/* Routes that use the centered layout */}
          <Route element={<CenteredLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/mfa/:userId" element={<MFA />} />
            <Route path="*" element={<Login />} />
          </Route>
          {/* Welcome page */}
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
