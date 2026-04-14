import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, LayoutDashboard } from 'lucide-react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SubmitComplaint from './pages/SubmitComplaint';

function BottomNav() {
  const location = useLocation();
  // Hide bottom nav on login/register pages
  if (['/login', '/register'].includes(location.pathname)) return null;

  return (
    <div className="bottom-nav">
      <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        <HomeIcon size={24} />
        <span>HOME</span>
      </Link>
      <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
        <LayoutDashboard size={24} />
        <span>DASHBOARD</span>
      </Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/submit" element={<SubmitComplaint />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
