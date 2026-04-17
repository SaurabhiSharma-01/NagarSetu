import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, Timer, CheckCircle, Smile, MapPin, 
  Download, Calendar, TrendingUp, Droplets, Trash2, Zap, Play, Plus, Minus, Crosshair, Wrench, LayoutGrid
} from 'lucide-react';
import './Reports.css';

const Reports = () => {
  const [complaints, setComplaints] = useState([]);
  const [viewTab, setViewTab] = useState('analytics'); // 'analytics' | 'map'
  const [timeFilter, setTimeFilter] = useState('30'); // '7', '30', 'all'
  const [mapFilter, setMapFilter] = useState('All'); 
  const [mapZoom, setMapZoom] = useState(1);
  const [temporalDays, setTemporalDays] = useState(30);
  
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
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
    fetchComplaints();
  }, [token]);

  // Time Filtering
  const filteredComplaints = complaints.filter(c => {
    if (timeFilter === 'all') return true;
    const complaintDate = new Date(c.createdAt);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now - complaintDate) / (1000 * 60 * 60 * 24)); 
    return diffDays <= parseInt(timeFilter);
  });

  // Derived metrics from filtered datset
  const totalReports = filteredComplaints.length;
  const resolved = filteredComplaints.filter(c => c.status === 'Resolved').length;
  const pending = filteredComplaints.filter(c => c.status === 'Pending').length;
  const inProgress = filteredComplaints.filter(c => c.status === 'In Progress').length;
  
  const resolutionRate = totalReports === 0 ? 0 : Math.round((resolved / totalReports) * 100);
  
  // Category stats
  const catCounts = { 'Waste': 0, 'Road': 0, 'Water': 0, 'Electricity': 0, 'Other': 0 };
  filteredComplaints.forEach(c => {
    if (catCounts[c.category] !== undefined) catCounts[c.category]++;
  });

  const getCatPercent = (count) => totalReports === 0 ? 0 : Math.round((count / totalReports) * 100);

  // Recent resolutions
  const recentResolved = [...filteredComplaints]
    .filter(c => c.status === 'Resolved')
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 4);

  const exportAnalytics = () => {
    if (filteredComplaints.length === 0) return alert('No data to export for this time range.');
    let csv = "data:text/csv;charset=utf-8,ID,Category,Status,Date\n";
    filteredComplaints.forEach(c => {
      csv += `${c._id},"${c.category}","${c.status}","${new Date(c.createdAt).toLocaleDateString()}"\n`;
    });
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NagarSetu_Analytics_${timeFilter}d.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div>
          <div className="page-caption">INTELLIGENCE HUB</div>
          <h1 className="page-title" style={{ margin: '4px 0 0 0' }}>Analytics & Insights</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px', maxWidth: '600px' }}>
            Real-time monitoring of municipal health, complaint throughput, and citizen sentiment across all metropolitan sectors.
          </p>
        </div>
        <div className="reports-actions" style={{ display: 'flex', gap: '12px' }}>
          <select 
            className="select-btn" 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid var(--border)' }}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
          <button className="export-btn" onClick={exportAnalytics}>
            <Download size={16} /> <div style={{ textAlign: 'left', lineHeight: 1.2 }}>Export<br/><span style={{ fontSize: '0.7rem' }}>Report</span></div>
          </button>
        </div>
      </div>

      <div className="view-tabs">
        <button 
          className={`view-tab ${viewTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setViewTab('analytics')}
        >
          Analytics & Insights
        </button>
        <button 
          className={`view-tab ${viewTab === 'map' ? 'active' : ''}`}
          onClick={() => setViewTab('map')}
        >
          Map View
        </button>
      </div>

      {viewTab === 'analytics' && (
        <>
          {/* Top Cards */}
          <div className="insight-grid">
            <div className="insight-card">
              <div className="insight-card-top">
                <div className="insight-icon-box bg-blue"><FileText size={20} /></div>
                <div className="insight-badge badge-green"><TrendingUp size={12} style={{marginRight: 4}}/>+12%</div>
              </div>
              <div>
                <div className="insight-label">TOTAL REPORTS</div>
                <div className="insight-val">{totalReports.toLocaleString()}</div>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-card-top">
                <div className="insight-icon-box bg-orange"><Timer size={20} /></div>
              </div>
              <div>
                <div className="insight-label">AVG RESOLUTION TIME</div>
                <div className="insight-val">4.2 <span className="insight-sub">days</span></div>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-card-top">
                <div className="insight-icon-box bg-gray"><CheckCircle size={20} /></div>
                <div className="insight-badge badge-blue">Target Met</div>
              </div>
              <div>
                <div className="insight-label">RESOLUTION RATE</div>
                <div className="insight-val">{resolutionRate}%</div>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-card-top">
                <div className="insight-icon-box bg-yellow"><Smile size={20} /></div>
              </div>
              <div>
                <div className="insight-label">CITIZEN SATISFACTION</div>
                <div className="insight-val">4.5 <span className="insight-sub">/ 5.0</span></div>
              </div>
            </div>
          </div>

          {/* Middle Section */}
          <div className="middle-grid">
            <div className="card-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3 className="card-title">Complaint Trends</h3>
                  <p className="card-desc">Daily volume of incoming reports vs. resolutions</p>
                </div>
                <div className="chart-legend">
                  <div style={{ display: 'flex', alignItems: 'center' }}><span className="legend-dot" style={{ background: '#2563eb' }}></span> Incoming</div>
                  <div style={{ display: 'flex', alignItems: 'center' }}><span className="legend-dot" style={{ background: '#b91c1c' }}></span> Resolved</div>
                </div>
              </div>
              <div className="dummy-chart">
                {/* Mockup bars representing 4 weeks */}
                <div className="dummy-bar" style={{ height: timeFilter === '7' ? '10%' : '30%' }}></div>
                <div className="dummy-bar" style={{ height: timeFilter === 'all' ? '90%' : '50%' }}></div>
                <div className="dummy-bar" style={{ height: '40%' }}></div>
                <div className="dummy-bar" style={{ height: '45%' }}></div>
                <div className="dummy-bar" style={{ height: '35%' }}></div>
                <div className="dummy-bar" style={{ height: totalReports > 5 ? '80%' : '30%' }}></div>
                
                <div className="dummy-bar" style={{ height: '60%' }}></div>
                <div className="dummy-bar" style={{ height: '65%' }}></div>
                <div className="dummy-bar" style={{ height: '55%' }}></div>
                
                <div className="dummy-bar" style={{ height: '40%' }}></div>
                <div className="dummy-bar" style={{ height: '80%' }}></div>
                
                {/* Mock line for resolved */}
                <svg className="dummy-line" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M 0 80 Q 20 60 40 70 T 70 80 T 100 10" fill="none" stroke="#7f1d1d" strokeWidth="3" />
                </svg>

                <div className="chart-labels">
                  <span>WEEK 01</span>
                  <span>WEEK 02</span>
                  <span>WEEK 03</span>
                  <span>WEEK 04</span>
                </div>
              </div>
            </div>

            <div className="card-panel" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="card-title">Status Distribution</h3>
              <div className="donut-container">
                <div className="donut-hole">
                  <div className="donut-inner">
                    <span className="donut-val">{totalReports >= 1000 ? (totalReports/1000).toFixed(1)+'k' : totalReports}</span>
                    <span className="donut-sub">TOTAL</span>
                  </div>
                </div>
                <div className="status-list">
                  <div className="status-item">
                    <span className="status-name"><span className="legend-dot sq-blue"></span> Resolved</span>
                    <span><strong>{resolved}</strong> ({resolutionRate}%)</span>
                  </div>
                  <div className="status-item">
                    <span className="status-name"><span className="legend-dot sq-red"></span> In Progress</span>
                    <span><strong>{inProgress}</strong> ({getCatPercent(inProgress)}%)</span>
                  </div>
                  <div className="status-item">
                    <span className="status-name"><span className="legend-dot sq-gray"></span> Pending</span>
                    <span><strong>{pending}</strong> ({getCatPercent(pending)}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bottom-grid">
            <div className="card-panel">
              <h3 className="card-title" style={{ marginBottom: 24 }}>Reports by Category</h3>
              
              <div className="cat-row">
                <div className="cat-header">
                  <span>Sanitation & Waste</span>
                  <span>{getCatPercent(catCounts['Waste'])}%</span>
                </div>
                <div className="cat-bar-bg"><div className="cat-bar-fill" style={{ width: `${getCatPercent(catCounts['Waste'])}%`}}></div></div>
              </div>

              <div className="cat-row">
                <div className="cat-header">
                  <span>Roads & Potholes</span>
                  <span>{getCatPercent(catCounts['Road'])}%</span>
                </div>
                <div className="cat-bar-bg"><div className="cat-bar-fill" style={{ width: `${getCatPercent(catCounts['Road'])}%`}}></div></div>
              </div>

              <div className="cat-row">
                <div className="cat-header">
                  <span>Water Supply</span>
                  <span>{getCatPercent(catCounts['Water'])}%</span>
                </div>
                <div className="cat-bar-bg"><div className="cat-bar-fill" style={{ width: `${getCatPercent(catCounts['Water'])}%`}}></div></div>
              </div>

              <div className="cat-row">
                <div className="cat-header">
                  <span>Electricity</span>
                  <span>{getCatPercent(catCounts['Electricity'])}%</span>
                </div>
                <div className="cat-bar-bg"><div className="cat-bar-fill" style={{ width: `${getCatPercent(catCounts['Electricity'])}%`}}></div></div>
              </div>
            </div>

            <div className="card-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 className="card-title">Recent Resolutions</h3>
                <a href="#" className="action-link">View All</a>
              </div>
              <table className="res-table">
                <thead>
                  <tr>
                    <th>REFERENCE ID</th>
                    <th>CATEGORY</th>
                    <th>TURNAROUND</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {recentResolved.length > 0 ? recentResolved.map(comp => (
                    <tr key={comp._id}>
                      <td style={{ fontWeight: 700 }}>#NS-{comp._id.substring(comp._id.length - 4)}</td>
                      <td>{comp.category === 'Waste' ? 'Sanitation' : comp.category}</td>
                      <td style={{ color: 'var(--text-muted)' }}>2.4 Hours</td> {/* Mock turnaround */}
                      <td><span className="res-badge">RESOLVED</span></td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No recent resolutions.</td></tr>
                  )}
                  {recentResolved.length < 4 && (
                    <tr>
                      <td style={{ fontWeight: 700 }}>#NS-9610</td>
                      <td>Illegal Dumping</td>
                      <td style={{ color: 'var(--text-muted)' }}>4.1 Days</td>
                      <td><span className="urgent-badge">URGENT</span></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {viewTab === 'map' && (
        <div 
          className="map-view-container"
          style={{
            transform: `scale(${mapZoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.3s ease, background 0.5s ease',
            backgroundImage: 
              mapFilter === 'Water' ? 'radial-gradient(circle at 45% 60%, rgba(37, 99, 235, 0.4) 0%, transparent 50%), radial-gradient(circle at 65% 35%, rgba(6, 182, 212, 0.3) 0%, transparent 40%)' :
              mapFilter === 'Waste' ? 'radial-gradient(circle at 45% 60%, rgba(22, 163, 74, 0.4) 0%, transparent 50%), radial-gradient(circle at 65% 35%, rgba(132, 204, 22, 0.3) 0%, transparent 40%)' :
              mapFilter === 'Electricity' ? 'radial-gradient(circle at 45% 60%, rgba(234, 179, 8, 0.4) 0%, transparent 50%), radial-gradient(circle at 65% 35%, rgba(249, 115, 22, 0.3) 0%, transparent 40%)' :
              mapFilter === 'Road' ? 'radial-gradient(circle at 45% 60%, rgba(217, 119, 6, 0.4) 0%, transparent 50%), radial-gradient(circle at 65% 35%, rgba(120, 113, 108, 0.3) 0%, transparent 40%)' :
              undefined // uses default from CSS
          }}
        >
          <div className="map-lines"></div>
          <div className="map-circle"></div>
          
          {/* Scatter dynamic plot zones based on data */}
          {filteredComplaints.filter(c => mapFilter === 'All' || c.category === mapFilter).length > 0 ? 
            filteredComplaints.filter(c => mapFilter === 'All' || c.category === mapFilter).map((comp, i) => {
            const top = 25 + ((i * 13) % 50);
            const left = 25 + ((i * 17) % 50);
            let mClass = 'marker-red';
            if (comp.status === 'Resolved') mClass = 'marker-blue';
            else if (comp.status === 'In Progress') mClass = 'marker-orange';
            
            return (
              <div 
                key={comp._id || i}
                className={`map-marker ${mClass}`}
                style={{ top: `${top}%`, left: `${left}%` }}
                title={`${comp.category} - ${comp.status}`}
              >
                 {comp.status === 'Resolved' ? <CheckCircle size={12} /> : 
                  comp.category === 'Waste' ? <Trash2 size={12} /> : 
                  comp.category === 'Water' ? <Droplets size={12} /> : 
                  comp.category === 'Electricity' ? <Zap size={12} /> : 
                  <MapPin size={12} />}
              </div>
            );
          }) : (
            <div className="map-marker marker-red" style={{ top: '45%', left: '50%' }}><MapPin size={12} /></div>
          )}

          {/* Left Navigation Float */}
          <div className="map-sidebar-tools" style={{ transform: `scale(${1/mapZoom})`, transformOrigin: 'top left' }}>
            <button className={`tool-btn ${mapFilter === 'All' ? 'active' : ''}`} onClick={() => setMapFilter('All')}><LayoutGrid size={24} fill="currentColor" /></button>
            <button className={`tool-btn ${mapFilter === 'Road' ? 'active' : ''}`} onClick={() => setMapFilter('Road')}><Wrench size={22} fill="currentColor" /></button>
            <button className={`tool-btn ${mapFilter === 'Waste' ? 'active' : ''}`} onClick={() => setMapFilter('Waste')}><Trash2 size={22} fill="currentColor" /></button>
            <button className={`tool-btn ${mapFilter === 'Water' ? 'active' : ''}`} onClick={() => setMapFilter('Water')}><Droplets size={22} fill="currentColor" /></button>
            <button className={`tool-btn ${mapFilter === 'Electricity' ? 'active' : ''}`} onClick={() => setMapFilter('Electricity')}><Zap size={22} fill="currentColor" /></button>
          </div>
          
          {/* Map Overlay Card */}
          <div className="map-card" style={{ transform: `scale(${1/mapZoom})`, transformOrigin: 'top right' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="insight-label" style={{ margin: 0 }}>ACTIVE VIEW</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, background: '#e2e8f0', padding: '2px 8px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ display: 'inline-block', width: 6, height: 6, background: '#10b981', borderRadius: 3 }}></span> LIVE
              </span>
            </div>
            <h3 style={{ margin: '8px 0 24px 0' }}>Live Heat Map</h3>

            <div className="cat-header" style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
              <span>{mapFilter === 'All' ? 'Top Problem Zones' : `${mapFilter} Zones`}</span>
              <span>Incidents</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
              <div style={{ width: 4, height: 24, background: '#dc2626', borderRadius: 2 }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active Complaints</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Highest Frequency Area</div>
              </div>
              <div style={{ fontWeight: 700 }}>
                {filteredComplaints.filter(c => (mapFilter === 'All' || c.category === mapFilter) && c.status !== 'Resolved').length}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0 24px 0' }}>
              <div style={{ width: 4, height: 24, background: '#10b981', borderRadius: 2 }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Resolved Sector</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Cleared Reports</div>
              </div>
              <div style={{ fontWeight: 700 }}>
                {filteredComplaints.filter(c => (mapFilter === 'All' || c.category === mapFilter) && c.status === 'Resolved').length}
              </div>
            </div>

            <div className="insight-label" style={{ marginTop: 24 }}>TRENDING CATEGORY</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1d4ed8' }}>{mapFilter === 'All' ? 'System Overview' : mapFilter}</span>
                <span style={{ fontSize: '0.7rem', color: '#dc2626', marginLeft: 12, fontWeight: 700 }}>{mapFilter !== 'All' ? '+12% vs last week' : ''}</span>
              </div>
              <div style={{ width: 40, height: 40, background: '#1d4ed8', color: 'white', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {mapFilter === 'Waste' ? <Trash2 size={20} /> :
                 mapFilter === 'Water' ? <Droplets size={20} /> :
                 mapFilter === 'Electricity' ? <Zap size={20} /> :
                 mapFilter === 'Road' ? <Wrench size={20} /> : <LayoutGrid size={20} />}
              </div>
            </div>
            <div className="cat-bar-bg" style={{ marginTop: 12, height: 4 }}>
              <div className="cat-bar-fill" style={{ width: `${filteredComplaints.length ? Math.round(filteredComplaints.filter(c => mapFilter === 'All' || c.category === mapFilter).length / filteredComplaints.length * 100) : 0}%` }}></div>
            </div>

            <div className="map-stat-boxes">
              <div className="map-stat-box">
                <div className="insight-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ background: '#fecaca', color: '#dc2626', width: 14, height: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>!</span> CRITICAL
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  {filteredComplaints.filter(c => (mapFilter === 'All' || c.category === mapFilter) && c.status === 'Pending').length}
                </div>
              </div>
              <div className="map-stat-box">
                <div className="insight-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ background: '#bfdbfe', color: '#1d4ed8', width: 14, height: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}><CheckCircle size={10} /></span> RESOLVED
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  {filteredComplaints.filter(c => (mapFilter === 'All' || c.category === mapFilter) && c.status === 'Resolved').length}
                </div>
              </div>
            </div>
          </div>

          <div className="map-timeline" style={{ transform: `translate(-50%, 0) scale(${1/mapZoom})`, transformOrigin: 'bottom center', bottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.85rem' }}>
                <Play size={16} fill="currentColor" /> Temporal Analysis
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                <span style={{ color: '#1d4ed8', marginRight: 12 }}>{new Date(Date.now() - (30 - temporalDays) * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                <span style={{ color: 'var(--text-light)' }}>30 DAY HISTORY</span>
              </div>
            </div>
            
            <div className="slider-bar" style={{ background: 'transparent' }}>
              <input 
                type="range" 
                min="0" 
                max="30" 
                value={temporalDays} 
                onChange={(e) => setTemporalDays(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#2563eb' }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              <span>Sep 14</span>
              <span>Sep 21</span>
              <span>Sep 28</span>
              <span>Oct 05</span>
              <span>Oct 12</span>
            </div>
          </div>

          <div className="map-controls" style={{ transform: `scale(${1/mapZoom})`, transformOrigin: 'bottom right' }}>
            <button className="map-ctrl-btn" onClick={() => setMapZoom(prev => Math.min(prev + 0.5, 3))}><Plus size={20} /></button>
            <button className="map-ctrl-btn" onClick={() => setMapZoom(prev => Math.max(prev - 0.5, 1))}><Minus size={20} /></button>
            <button className="map-ctrl-btn" onClick={() => setMapZoom(1)}><Crosshair size={20} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
