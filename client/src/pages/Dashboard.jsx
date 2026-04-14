import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Wrench, Trash2, PlusCircle, Building } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchComplaints();
  }, [token, navigate]);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/complaints', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Road': return <Wrench size={14} />;
      case 'Waste': return <Trash2 size={14} />;
      default: return <MapPin size={14} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'pending';
      case 'In Progress': return 'in-progress';
      case 'Resolved': return 'resolved';
      default: return 'pending';
    }
  };

  return (
    <div>
      <header className="header" style={{ padding: '0 0 24px 0' }}>
        <div className="logo">
          <MapPin className="icon" size={24} />
          NagarSetu
        </div>
        <div style={{ background: '#1e293b', color: '#f8fafc', width: '36px', height: '36px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          {user?.name?.charAt(0) || 'U'}
        </div>
      </header>

      <span className="caption">WELCOME BACK, {user?.name?.split(' ')[0].toUpperCase() || 'CITIZEN'}</span>
      <h1 style={{ marginBottom: '24px' }}>Activity Summary</h1>

      <div className="grid-2 mb-6">
        <div className="card-stat">
          <span className="value">{complaints.length}</span>
          <span className="label">ISSUES<br/>REPORTED</span>
        </div>
        <div className="card-stat">
          <span className="value" style={{ color: 'var(--text-dark)' }}>{resolvedCount}</span>
          <span className="label">RESOLVED</span>
        </div>
      </div>

      <button className="btn btn-primary" style={{ marginBottom: '40px' }} onClick={() => navigate('/submit')}>
        <PlusCircle size={20} /> Submit New Complaint
      </button>

      <div className="flex justify-between items-center mb-6">
        <h2 style={{ margin: 0 }}>Your Recent Reports</h2>
        <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>View All</span>
      </div>

      {complaints.length === 0 ? (
        <p>No reports filed yet. Help your city by reporting an issue!</p>
      ) : (
        complaints.map(comp => (
          <div key={comp._id} className={`report-card ${getStatusClass(comp.status)}`}>
            <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                {new Date(comp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className={`badge badge-${comp.status.replace(' ', '-')}`}>{comp.status}</span>
            </div>
            <h3 style={{ marginBottom: '12px' }}>{comp.title}</h3>
            <div className="flex items-center gap-2" style={{ color: 'var(--text-gray)', fontSize: '0.8rem' }}>
              {getCategoryIcon(comp.category)}
              <span>{comp.category}</span>
            </div>
          </div>
        ))
      )}

      {/* Hero graphic at the bottom */}
      <div style={{ marginTop: '32px', position: 'relative', borderRadius: 'var(--rounded-md)', overflow: 'hidden', height: '140px', background: 'linear-gradient(to right, #1e3a8a, #0f172a)' }}>
        <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', color: 'white', zIndex: 2 }}>
          <h3 style={{ fontSize: '1rem', lineHeight: 1.3 }}>Building a better future for our city, together.</h3>
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.2, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
           <Building size={120} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
