import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Grid, BarChart2, Users as UsersIcon, Settings as SettingsIcon, Plus, Search, Bell, HelpCircle } from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import NewReport from './pages/NewReport';
import Users from './pages/Users';
import Settings from './pages/Settings';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('adminToken');
  const user = JSON.parse(localStorage.getItem('adminUser'));

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  if (!token) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          NagarSetu
          <span className="subtitle">ADMIN CONSOLE</span>
        </Link>
      </div>

      <nav className="nav-menu">
        <Link to="/dashboard" className={`menu-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <Grid size={20} /> Overview
        </Link>
        <Link to="/reports" className={`menu-item ${location.pathname === '/reports' ? 'active' : ''}`}>
          <BarChart2 size={20} /> Reports
        </Link>
        <Link to="/users" className={`menu-item ${location.pathname === '/users' ? 'active' : ''}`}>
          <UsersIcon size={20} /> Users
        </Link>
        <Link to="/settings" className={`menu-item ${location.pathname === '/settings' ? 'active' : ''}`}>
          <SettingsIcon size={20} /> Settings
        </Link>
      </nav>

      <div className="sidebar-bottom">
        <Link to="/new-report" className="btn btn-primary" style={{ width: '100%', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
          <Plus size={18} /> New Report
        </Link>
        <div className="user-profile" onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <div className="avatar">
           <img src="https://ui-avatars.com/api/?name=Admin+User&background=334155&color=fff" alt="Admin" style={{width: '100%', height: '100%', borderRadius: '8px'}} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name || 'Admin User'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Super Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={
          <PrivateRoute>
            <div className="admin-layout">
              <Sidebar />
              <div className="main-wrapper">
                <header className="topbar">
                  <div className="search-bar">
                    <Search size={18} />
                    <input type="text" placeholder="Search complaints, IDs or citizens..." />
                  </div>
                  <div className="topbar-actions">
                    <Bell size={20} />
                    <HelpCircle size={20} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Overview</span>
                  </div>
                </header>
                <div className="content-area">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/new-report" element={<NewReport />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </div>
                <footer className="admin-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: '#3b82f6' }}></div>
                    <span style={{ fontWeight: 600 }}>SYSTEM ONLINE</span>
                    <span style={{ marginLeft: '16px' }}>Last Refreshed: 2 minutes ago</span>
                  </div>
                  <div>© 2026 Municipal Administration Systems. NagarSetu V2.4.0</div>
                </footer>
              </div>
            </div>
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
