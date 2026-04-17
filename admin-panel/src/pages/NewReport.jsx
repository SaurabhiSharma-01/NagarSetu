import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, UploadCloud, CheckCircle } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '160px',
  borderRadius: '8px'
};
const defaultCenter = { lat: 28.6139, lng: 77.2090 };

const NewReport = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const [formData, setFormData] = useState({
    submitterName: '',
    submitterPhone: '',
    title: '',
    category: 'Waste',
    priority: 'Normal',
    description: '',
    location: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [markerPos, setMarkerPos] = useState(defaultCenter);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE"
  });

  const onMapClick = (e) => {
    const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPos(coords);
    setFormData(prev => ({ ...prev, location: `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        const fileData = new FormData();
        fileData.append('image', imageFile);
        const uploadRes = await axios.post(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}/api/upload`, fileData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        imageUrl = uploadRes.data.imageUrl;
      }

      // Combine submitter info into description since our schema is simpler
      const fullDescription = `[Submitted by: ${formData.submitterName || 'Anonymous'} - ${formData.submitterPhone || 'N/A'}] (Priority: ${formData.priority})\n\n${formData.description}`;

      await axios.post(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}/api/complaints`, {
        title: formData.title,
        description: fullDescription,
        category: formData.category,
        location: formData.location || 'Unknown Location',
        imageUrl: imageUrl
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit report. Please check required fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-main)' }}>
        <CheckCircle size={64} style={{ color: '#16a34a', marginBottom: '24px' }} />
        <h2 style={{ margin: '0 0 8px 0', fontSize: '2rem' }}>Report Logged Successfully</h2>
        <p style={{ color: 'var(--text-muted)' }}>The municipal feed has been updated.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '20px', backgroundColor: '#f1f5f9' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>New Report Entry</h2>
        </div>
      </div>

      <div>
        <div className="page-caption" style={{ color: 'var(--primary)' }}>INTERNAL DOCUMENTATION</div>
        <h1 className="page-title" style={{ margin: '8px 0', fontSize: '2.5rem' }}>Civic Incident Report</h1>
        <p className="card-desc" style={{ fontSize: '1rem', maxWidth: '700px' }}>
          Log new issues reported through official channels or direct citizen walk-ins. Ensure all data is verified before submission to the municipal feed.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Submitter Identity */}
          <div style={{ background: '#f8fafc', padding: '32px', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em', margin: '0 0 24px 0', textTransform: 'uppercase' }}>01. Submitter Identity</h3>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>CITIZEN FULL NAME</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Rahul Sharma" 
                  style={{ background: '#e2e8f0', border: 'none' }}
                  value={formData.submitterName}
                  onChange={(e) => setFormData({...formData, submitterName: e.target.value})}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>CONTACT PHONE</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="+91 00000 00000" 
                  style={{ background: '#e2e8f0', border: 'none' }}
                  value={formData.submitterPhone}
                  onChange={(e) => setFormData({...formData, submitterPhone: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Issue Details */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '32px', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em', margin: '0 0 24px 0', textTransform: 'uppercase' }}>02. Issue Details</h3>
            
            <div style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>REPORT TITLE</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Summarize the core problem" 
                style={{ background: '#f8fafc', border: 'none', padding: '16px' }}
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>ISSUE CATEGORY</label>
                <select 
                  className="form-control" 
                  style={{ background: '#f8fafc', border: 'none', padding: '14px' }}
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Waste">Waste Management</option>
                  <option value="Road">Roads & Transport</option>
                  <option value="Water">Water Supply</option>
                  <option value="Electricity">Electricity & Lighting</option>
                  <option value="Other">Other Category</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>PRIORITY LEVEL</label>
                <div style={{ display: 'flex', background: '#f8fafc', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
                  <button 
                    onClick={() => setFormData({...formData, priority: 'Normal'})}
                    style={{ flex: 1, padding: '10px 0', border: 'none', background: formData.priority === 'Normal' ? 'white' : 'transparent', color: formData.priority === 'Normal' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700, borderRadius: '4px', cursor: 'pointer', boxShadow: formData.priority === 'Normal' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                    Normal
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, priority: 'Urgent'})}
                    style={{ flex: 1, padding: '10px 0', border: 'none', background: formData.priority === 'Urgent' ? 'white' : 'transparent', color: formData.priority === 'Urgent' ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: 700, borderRadius: '4px', cursor: 'pointer', boxShadow: formData.priority === 'Urgent' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                    Urgent
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>INCIDENT DESCRIPTION</label>
              <textarea 
                className="form-control" 
                rows="5" 
                placeholder="Provide technical details, history of the issue, and immediate impact observed..." 
                style={{ background: '#f8fafc', border: 'none', resize: 'vertical' }}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Location Block */}
          <div style={{ background: '#e2e8f0', padding: '32px', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em', margin: '0 0 24px 0', textTransform: 'uppercase' }}>03. Location</h3>
            <div style={{ marginBottom: '16px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={defaultCenter}
                  zoom={12}
                  onClick={onMapClick}
                  options={{ disableDefaultUI: true, zoomControl: true }}
                >
                  {markerPos && <Marker position={markerPos} />}
                </GoogleMap>
              ) : (
                <div style={{ width: '100%', height: '160px', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 600 }}>
                  Initializing Map...
                </div>
              )}
            </div>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Click on the map to pin exact coordinates..." 
              style={{ border: 'none' }}
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          {/* Visual Proof Block */}
          <div style={{ border: '2px dashed #cbd5e1', padding: '40px 32px', borderRadius: 'var(--radius-md)', textAlign: 'center', background: '#f8fafc' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '0.05em', margin: '0 0 32px 0', textTransform: 'uppercase' }}>04. Visual Proof</h3>
            
            <input 
              type="file" 
              id="file-upload" 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleFileChange}
            />
            
            {imagePreview ? (
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '140px', borderRadius: '8px' }} />
                <button onClick={() => { setImageFile(null); setImagePreview(''); }} style={{ position: 'absolute', top: -10, right: -10, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer' }}>×</button>
              </div>
            ) : (
              <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, background: '#e2e8f0', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '16px' }}>
                  <UploadCloud size={24} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>Upload Image</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '24px' }}>Max 5MB. JPG/PNG only.</div>
                <div style={{ background: '#e2e8f0', color: 'var(--text-main)', fontWeight: 600, padding: '8px 24px', borderRadius: '16px', fontSize: '0.8rem' }}>Browse Files</div>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '16px', paddingBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
          <CheckCircle size={16} color="#c2410c" />
          Authorized internal entry. Record will be timestamped.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate(-1)}>Discard</button>
          <button 
            className="btn btn-primary" 
            style={{ padding: '12px 32px' }} 
            onClick={handleSubmit} 
            disabled={isSubmitting || !formData.title || !formData.description}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewReport;
