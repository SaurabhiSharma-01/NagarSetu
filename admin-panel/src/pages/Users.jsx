import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Filter, Search, Edit2, Ban, ShieldCheck, History, MoreVertical, TrendingUp, Shield } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const token = localStorage.getItem('adminToken');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleBanUser = async (id, role) => {
    if (role === 'admin') return alert('Administrative accounts cannot be banned from this interface.');
    
    if (window.confirm("Are you sure you want to permanently ban this user? They will lose all portal access.")) {
      try {
        await axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Refresh the list after successful ban
        fetchUsers();
      } catch (err) {
        console.error("Failed to ban user", err);
        alert('Failed to ban user');
      }
    }
  };

  const totalUsers = users.length;
  // Mock some metrics that aren't native in simple DB
  const staffAccounts = users.filter(u => u.role === 'admin').length;
  const pendingCount = 43; 

  const filteredUsers = users.filter(u => {
    if (roleFilter !== 'all') {
      if (roleFilter === 'citizen' && u.role !== 'user') return false;
      if (roleFilter === 'admin' && u.role !== 'admin') return false;
    }
    if (statusFilter !== 'all') {
      // Dummy check since DB doesn't have status yet, assume all are 'active'
      if (statusFilter === 'suspended') return false; 
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 className="page-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          User Management 
          <span className="page-caption" style={{ color: 'var(--primary)' }}>ADMINISTRATIVE CONSOLE</span>
        </h1>
        <p className="card-desc" style={{ marginTop: '8px', maxWidth: '800px', fontSize: '0.9rem' }}>
          Overview and control of the NagarSetu ecosystem participants. Manage permissions, audit activities, and ensure civic accountability across all account tiers.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Metric Cards */}
        <div style={{ display: 'flex', gap: '24px', background: 'var(--surface)', padding: '24px 32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="insight-label">TOTAL ACTIVE USERS</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{totalUsers.toLocaleString()}</div>
          </div>
          <div style={{ width: '1px', height: '40px', background: 'var(--border)' }}></div>
          <div>
            <div className="insight-label">PENDING VERIFICATION</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c2410c' }}>{pendingCount}</div>
          </div>
          <div style={{ width: '1px', height: '40px', background: 'var(--border)' }}></div>
          <div>
            <div className="insight-label">STAFF ACCOUNTS</div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{staffAccounts}</div>
          </div>
          <button className="btn btn-secondary" style={{ marginLeft: '16px', background: '#f8fafc', fontWeight: 600 }}>
            <Download size={16} /> Export CSV
          </button>
        </div>

        {/* Filters Panel */}
        <div style={{ background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', padding: '24px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em' }}>QUICK FILTERS</span>
            <Filter size={20} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ flex: 1, padding: '10px 12px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: 'var(--radius-sm)', outline: 'none', cursor: 'pointer' }}>
              <option value="all" style={{ color: '#0f172a' }}>All Roles</option>
              <option value="citizen" style={{ color: '#0f172a' }}>Citizen</option>
              <option value="admin" style={{ color: '#0f172a' }}>System Admin</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ flex: 1, padding: '10px 12px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: 'var(--radius-sm)', outline: 'none', cursor: 'pointer' }}>
              <option value="all" style={{ color: '#0f172a' }}>Any Status</option>
              <option value="active" style={{ color: '#0f172a' }}>Active</option>
              <option value="suspended" style={{ color: '#0f172a' }}>Suspended</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>USER IDENTITY</th>
              <th>ROLE</th>
              <th>JOINED DATE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>Loading identities...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No users match the selected filters.</td></tr>
            ) : filteredUsers.map(user => (
              <tr key={user._id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>
                     {user.name.charAt(0).toUpperCase()}
                   </div>
                   <div>
                     <div style={{ fontWeight: 700 }}>{user.name}</div>
                     <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</div>
                   </div>
                </td>
                <td>
                  <span style={{ background: user.role === 'admin' ? '#e2e8f0' : '#ffedd5', padding: '4px 12px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600, color: user.role==='admin'?'#475569':'#c2410c' }}>
                    {user.role === 'admin' ? 'System Admin' : 'Citizen'}
                  </span>
                </td>
                <td style={{ fontSize: '0.85rem' }}>{new Date(user.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</td>
                <td>
                  <span style={{ background: '#e0e7ff', color: '#1d4ed8', padding: '4px 12px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: 3, background: '#1d4ed8' }}></span> Active
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)' }}>
                    <Edit2 size={16} cursor="pointer" title="Edit Profile" />
                    <Ban 
                      size={16} 
                      cursor="pointer" 
                      onClick={() => handleBanUser(user._id, user.role)} 
                      color={user.role === 'admin' ? "var(--border)" : "var(--text-muted)"}
                      title="Ban & Remove Scope"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
          <span>Showing {filteredUsers.length} members</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" style={{ padding: '6px 12px' }}>&lt;</button>
            <button className="btn btn-primary" style={{ padding: '6px 16px' }}>1</button>
            <button className="btn btn-secondary" style={{ padding: '6px 12px' }}>&gt;</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Trend Info Box */}
        <div style={{ background: '#f1f5f9', borderRadius: 'var(--radius-md)', padding: '32px' }}>
          <div style={{ width: 40, height: 40, background: '#1d4ed8', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', marginBottom: '24px' }}>
            <TrendingUp size={20} />
          </div>
          <h3 style={{ fontSize: '1.4rem', margin: '0 0 12px 0' }}>Registration Trends</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px' }}>
            Citizen enrollment has increased by 12% following the 'Green City' initiative launch. Continued engagement monitoring is advised.
          </p>
          <a href="#" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.05em' }}>
            VIEW AUDIT LOG →
          </a>
        </div>

        {/* Visual Banner */}
        <div style={{ background: 'linear-gradient(to right, #0f172a, #1e293b, #0f172a)', borderRadius: 'var(--radius-md)', padding: '40px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: '240px' }}>
          {/* Abstract background buildings element could go here via CSS or just pure color gradient is fine for functional replication */}
          <div style={{ zIndex: 10 }}>
            <div className="insight-label" style={{ color: '#60a5fa' }}>SYSTEM INTEGRITY</div>
            <h2 style={{ color: 'white', margin: '8px 0 0 0', fontSize: '2rem', maxWidth: '500px', lineHeight: 1.2 }}>
              Securing the Civic Core through Transparent Governance.
            </h2>
          </div>
          <div style={{ position: 'absolute', right: 32, top: 32, width: 48, height: 48, background: '#1d4ed8', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)' }}>
             <Shield size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
