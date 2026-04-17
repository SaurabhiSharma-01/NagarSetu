import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Compass, ShieldAlert, Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}/api/auth/login`, { email, password });
      
      if (res.data.user.role === 'admin') {
        localStorage.setItem('adminToken', res.data.token);
        localStorage.setItem('adminUser', JSON.stringify(res.data.user));
        navigate('/dashboard');
      } else {
        alert('Unauthorized. Admin access only.');
      }
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
          <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '8px', color: 'white', display: 'flex' }}>
            <Compass size={24} />
          </div>
          NagarSetu
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '8px' }}>
          Admin Console
        </div>
      </div>

      <div className="auth-box">
        <div className="auth-warn">
          <ShieldAlert size={18} />
          AUTHORIZED PERSONNEL ONLY
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>Official Email</div>
          <div className="auth-input-group">
            <Mail className="auth-icon" size={18} />
            <input 
              type="email" 
              className="auth-input" 
              placeholder="admin@nagarsetu.gov.in" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            <div>Password</div>
            <div style={{ color: 'var(--primary)', cursor: 'pointer' }}>Forgot Access?</div>
          </div>
          <div className="auth-input-group" style={{ marginBottom: '32px' }}>
            <Lock className="auth-icon" size={18} />
            <input 
              type="password" 
              className="auth-input" 
              placeholder="••••••••" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', justifyContent: 'center' }}>
            Authenticate Access <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Technical difficulties? <span style={{ color: '#b91c1c', fontWeight: 600, cursor: 'pointer' }}>Contact System Architecture</span>
        </div>
      </div>

      <div style={{ marginTop: '48px', textAlign: 'center', color: 'var(--text-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
          <Shield size={20} /> <Shield size={20} /> <Shield size={20} />
        </div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em' }}>GOVERNMENT OF NAGARSETU • SECURE PORTAL</div>
      </div>
    </div>
  );
};

export default Login;
