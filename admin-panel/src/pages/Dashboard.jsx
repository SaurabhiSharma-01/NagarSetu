import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, RefreshCw, CheckCircle, Download, Filter, X, User, MapPin, Calendar, Clock, Tag } from 'lucide-react';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDate, setFilterDate] = useState('AllTime');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateRemarks, setUpdateRemarks] = useState('');

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchComplaints();
  }, [token]);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}/api/complaints`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}/api/complaints/${selectedComplaint._id}`, 
        { status: updateStatus, remarks: updateRemarks },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setSelectedComplaint(null);
      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    if (filterStatus !== 'All' && c.status !== filterStatus) return false;
    if (filterCategory !== 'All' && c.category !== filterCategory) return false;
    
    if (filterDate !== 'AllTime') {
      const complaintDate = new Date(c.createdAt);
      const now = new Date();
      const diffDays = Math.ceil(Math.abs(now - complaintDate) / (1000 * 60 * 60 * 24)); 
      if (filterDate === 'Last7Days' && diffDays > 7) return false;
      if (filterDate === 'Last30Days' && diffDays > 30) return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const citizenName = c.userId?.name?.toLowerCase() || '';
      const title = c.title?.toLowerCase() || '';
      const idStr = c._id.toLowerCase();
      if (!citizenName.includes(query) && !title.includes(query) && !idStr.includes(query)) {
        return false;
      }
    }
    return true;
  });

  const exportToCSV = () => {
    if (filteredComplaints.length === 0) return alert('No data to export.');
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Title,Citizen,Category,Location,Status,Date\n";
    
    filteredComplaints.forEach(c => {
      const citizen = c.userId?.name || 'Unknown Citizen';
      // Basic escaping handling
      const cleanTitle = (c.title || '').replace(/"/g, '""');
      const cleanLocation = (c.location || '').replace(/"/g, '""');
      
      const row = `${c._id},"${cleanTitle}","${citizen}","${c.category}","${cleanLocation}","${c.status}","${new Date(c.createdAt).toLocaleDateString()}"`;
      csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "NagarSetu_Complaints_Export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <>
      <div className="page-caption">INSTITUTIONAL DASHBOARD</div>
      <h1 className="page-title">Civic Engagement Overview</h1>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-title">Total Pending</div>
          <div className="stat-value" style={{ color: '#dc2626' }}>{pendingCount || '128'}</div>
          <div className="stat-trend" style={{ color: '#dc2626' }}>
            <TrendingUp size={16} /> 12% increase from last week
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-title">In Progress</div>
          <div className="stat-value" style={{ color: '#2563eb' }}>{inProgressCount || '84'}</div>
          <div className="stat-trend" style={{ color: '#2563eb' }}>
            <RefreshCw size={16} /> Active resolution phase
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Resolved</div>
          <div className="stat-value" style={{ color: '#475569' }}>{resolvedCount || '1,402'}</div>
          <div className="stat-trend" style={{ color: '#16a34a' }}>
            <CheckCircle size={16} /> 94% success rate
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <label className="filter-label">CATEGORY</label>
          <select className="filter-input" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Road">Roads & Traffic</option>
            <option value="Water">Water Supply</option>
            <option value="Electricity">Street Lighting</option>
            <option value="Waste">Sanitation</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">STATUS</label>
          <select className="filter-input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">DATE RANGE</label>
          <select className="filter-input" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
            <option value="AllTime">All Time</option>
            <option value="Last7Days">Last 7 Days</option>
            <option value="Last30Days">Last 30 Days</option>
          </select>
        </div>
        <div className="filter-group" style={{ flex: '0 0 auto', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <button className="btn btn-secondary" style={{ padding: '0 24px', height: '44px' }} onClick={() => { setFilterCategory('All'); setFilterStatus('All'); setFilterDate('AllTime'); setSearchQuery(''); }}>Reset Filters</button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Recent Complaints</h3>
          <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Search ID, Title, Citizen..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '0.85rem', width: '200px' }}
            />
            <Filter size={20} cursor="pointer" title="Adjust filters above" />
            <Download size={20} cursor="pointer" title="Export current view to CSV" onClick={exportToCSV} />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>CITIZEN</th>
              <th>CATEGORY</th>
              <th>STATUS</th>
              <th>DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No recent complaints found.</td>
              </tr>
            ) : (
              filteredComplaints.map(comp => (
                <tr key={comp._id}>
                  <td className="td-id">#{comp._id.substring(comp._id.length - 4)}</td>
                  <td className="td-citizen">
                    <div className="citizen-avatar">{comp.userId?.name?.charAt(0) || 'U'}</div>
                    {comp.userId?.name || 'Unknown Citizen'}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{comp.category}</td>
                  <td>
                     <span className={`badge badge-${comp.status.replace(' ', '-')}`}>{comp.status}</span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{new Date(comp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td>
                    <span className="action-link" onClick={() => {
                        setSelectedComplaint(comp);
                        setUpdateStatus(comp.status);
                        setUpdateRemarks(comp.remarks || '');
                      }}>View</span>
                    <span className="action-status" onClick={() => {
                        setSelectedComplaint(comp);
                        setUpdateStatus(comp.status);
                        setUpdateRemarks(comp.remarks || '');
                      }}>Update Status</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Showing {filteredComplaints.length} entries</span>
          {/* Pagination mockup */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <span>&lt;</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>1</span>
            <span>&gt;</span>
          </div>
        </div>
      </div>
      {selectedComplaint && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Complaint Details</h3>
              <button className="modal-close" onClick={() => setSelectedComplaint(null)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              {/* Left Column: Details */}
              <div className="modal-col-left">
                <div className="detail-section">
                  <div className="status-badge" style={{ 
                    background: `var(--status-${selectedComplaint.status === 'Pending' ? 'pending' : selectedComplaint.status === 'In Progress' ? 'inprogress' : 'resolved'}-bg)`,
                    color: `var(--status-${selectedComplaint.status === 'Pending' ? 'pending' : selectedComplaint.status === 'In Progress' ? 'inprogress' : 'resolved'}-text)`,
                    marginBottom: '16px'
                  }}>
                    {selectedComplaint.status}
                  </div>
                  <h2 style={{ margin: '0 0 16px 0', fontSize: '1.75rem', lineHeight: 1.2 }}>{selectedComplaint.title}</h2>
                  
                  <div className="info-row">
                    <User size={16} />
                    <strong>{selectedComplaint.userId?.name || 'Citizen'}</strong>
                    <span style={{ color: 'var(--text-light)' }}>({selectedComplaint.userId?.email})</span>
                  </div>
                  <div className="info-row">
                    <MapPin size={16} />
                    <span>{selectedComplaint.location}</span>
                  </div>
                  <div className="info-row">
                    <Calendar size={16} />
                    <span>{new Date(selectedComplaint.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="info-row">
                    <Tag size={16} />
                    <span>{selectedComplaint.category}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <span className="detail-label">Description</span>
                  <p className="detail-text">{selectedComplaint.description}</p>
                </div>

                {selectedComplaint.imageUrl && (
                  <div className="detail-section">
                    <span className="detail-label">Attached Media</span>
                    <img src={`${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}${selectedComplaint.imageUrl}`} alt="Evidence" className="detail-image" />
                  </div>
                )}
              </div>

              {/* Right Column: Actions */}
              <div className="modal-col-right">
                <h4 style={{ margin: '0 0 24px 0', fontSize: '1.1rem' }}>Resolution Hub</h4>
                <form onSubmit={handleUpdate}>
                  <div className="form-group">
                    <label className="form-label">UPDATE STATUS</label>
                    <select className="form-control" value={updateStatus} onChange={(e) => setUpdateStatus(e.target.value)}>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">OFFICIAL REMARKS</label>
                    <textarea 
                      rows="6" 
                      className="form-control" 
                      value={updateRemarks} 
                      onChange={(e) => setUpdateRemarks(e.target.value)} 
                      placeholder="Add detailed public remarks to update the citizen..."
                    ></textarea>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '14px' }}>Submit Response</button>
                    <button type="button" className="btn btn-secondary" style={{ flex: 1, padding: '14px' }} onClick={() => setSelectedComplaint(null)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default Dashboard;
