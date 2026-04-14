import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, TrendingUp, CheckCircle, Plus } from 'lucide-react';
import { MapPin } from 'lucide-react'; // Fallback logo icon

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      <header className="header" style={{ padding: '0 0 24px 0' }}>
        <Link to="/" className="logo">
          <MapPin className="icon" size={24} />
          NagarSetu
        </Link>
        {token ? (
          <div style={{ background: '#e2e8f0', color: '#1e293b', width: '32px', height: '32px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
        ) : (
          <Link to="/login" style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary)' }}>Login</Link>
        )}
      </header>

      <span className="caption" style={{ color: '#b91c1c' }}>CIVIC ACTION PORTAL</span>
      <h1 style={{ marginBottom: '16px' }}>Better Cities,<br/>Together</h1>
      <p style={{ marginBottom: '24px', fontSize: '0.95rem' }}>
        Empower your community by reporting local issues. Transparent tracking from report to resolution.
      </p>

      <div className="flex gap-2 mb-6">
        <Link to="/submit" className="btn btn-primary" style={{ flex: 1, padding: '12px' }}>
          <span style={{ fontSize: '1rem' }}>📢 Report an Issue</span>
        </Link>
        <Link to="/register" className="btn btn-secondary" style={{ flex: 1, padding: '12px' }}>
          Get Started
        </Link>
      </div>

      <div style={{ position: 'relative', marginBottom: '40px' }}>
        <div style={{ background: 'linear-gradient(to bottom, #7dd3fc, #bae6fd)', height: '160px', borderRadius: 'var(--rounded-lg)', overflow: 'hidden' }}>
          {/* Simulation of the house vector graphic */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: '100%' }}>
            <div style={{ paddingBottom: '16px', fontWeight: '600', color: '#0369a1' }}>Visual of community homes</div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '-20px', left: '20px', background: 'white', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div style={{ background: '#e0e7ff', color: '#3730a3', padding: '6px', borderRadius: '8px' }}>
            <CheckCircle size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Recent Resolution</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Pothole fixed in Sector 4</div>
          </div>
        </div>
      </div>

      <h2 style={{ marginTop: '48px', marginBottom: '8px' }}>How it works</h2>
      <p style={{ fontSize: '0.85rem', marginBottom: '24px' }}>Simplifying civic engagement in three steps.</p>

      <div className="work-step flex-row">
        <div className="step-icon"><Camera size={24} /></div>
        <div>
          <h3>1. Report</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '8px', marginBottom: 0 }}>Snap a photo and pinpoint the location of the issue on our map.</p>
        </div>
      </div>

      <div className="work-step flex-row">
        <div className="step-icon" style={{ background: '#fce7f3', color: '#be185d' }}><TrendingUp size={24} /></div>
        <div>
          <h3>2. Track</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '8px', marginBottom: 0 }}>Get real-time updates as city officials review and assign your report.</p>
        </div>
      </div>

      <div className="work-step flex-row">
        <div className="step-icon" style={{ background: '#f1f5f9', color: '#475569' }}><CheckCircle size={24} /></div>
        <div>
          <h3>3. Resolve</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '8px', marginBottom: 0 }}>Confirm the fix once it's done. Together, we keep the city beautiful.</p>
        </div>
      </div>

      <div className="impact-card" style={{ marginTop: '32px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Our Impact</span>
        <div className="flex gap-4 mt-4">
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>12k+</div>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em' }}>ISSUES FIXED</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>45</div>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em' }}>ACTIVE ZONES</div>
          </div>
        </div>
        <div className="fab" onClick={() => navigate('/submit')}>
          <Plus size={32} color="white" />
        </div>
      </div>

    </div>
  );
};

export default Home;
