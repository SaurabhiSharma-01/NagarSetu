import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Camera, Info, Map, CheckCircle } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '220px',
  borderRadius: '8px'
};
const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // Default: New Delhi

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Road',
    location: '',
    description: '',
    imageUrl: ''
  });
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const [isUploading, setIsUploading] = useState(false);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    try {
      setIsUploading(true);
      const res = await axios.post('http://localhost:5000/api/upload', data, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      setFormData(prev => ({ ...prev, imageUrl: res.data.imageUrl }));
    } catch (err) {
      console.error('File upload failed', err);
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/complaints', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
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

      <div className="flex mb-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ flex: 1, paddingBottom: '12px', borderBottom: '3px solid var(--primary)', color: 'var(--primary)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em' }}>STEP 1 OF 2</div>
        <div style={{ flex: 1, paddingBottom: '12px', textAlign: 'right', color: 'var(--text-gray)', fontSize: '0.75rem' }}>Issue Details</div>
      </div>

      <h1 style={{ marginBottom: '12px' }}>File a New<br/>Civic Concern</h1>
      <p style={{ fontSize: '0.9rem', marginBottom: '32px' }}>
        Help us improve your neighborhood by reporting issues directly to city officials.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">COMPLAINT TITLE</label>
          <input type="text" name="title" required className="form-input" value={formData.title} onChange={handleInputChange} placeholder="e.g. Broken streetlight on 5th Ave" />
        </div>

        <div className="form-group">
          <label className="form-label">ISSUE CATEGORY</label>
          <select name="category" className="form-select" value={formData.category} onChange={handleInputChange}>
            <option value="Road">Road & Traffic</option>
            <option value="Water">Water Supply</option>
            <option value="Electricity">Public Infrastructure</option>
            <option value="Waste">Sanitation</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">EXACT LOCATION</label>
          <div style={{ marginBottom: '16px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
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
              <div style={{ width: '100%', height: '220px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 Loading Map System...
              </div>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <input type="text" name="location" required className="form-input" value={formData.location} onChange={handleInputChange} placeholder="Tap map to pin coordinates..." style={{ paddingRight: '48px' }} />
            <div style={{ position: 'absolute', right: '12px', top: '12px', background: 'white', padding: '4px', borderRadius: '4px' }}>
                <Map size={16} color="var(--primary)" />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">EVIDENCE / PHOTO</label>
          <div className="upload-box" style={{ position: 'relative', overflow: 'hidden' }}>
            <input 
               type="file" 
               accept="image/*" 
               onChange={handleFileChange}
               style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }}
            />
            {isUploading ? (
              <div style={{ fontWeight: 600, color: 'var(--primary)' }}>Uploading... Please wait</div>
            ) : formData.imageUrl ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={24} color="#16a34a" />
                <div style={{ fontWeight: 600, color: '#16a34a' }}>Photo Uploaded Successfully!</div>
                <img src={`http://localhost:5000${formData.imageUrl}`} alt="Preview" style={{ height: '80px', borderRadius: '4px', marginTop: '8px' }} />
              </div>
            ) : (
              <>
                <div className="upload-icon-container">
                  <Camera size={24} />
                </div>
                <div style={{ fontWeight: 600 }}>Tap to upload or take photo</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>High-quality JPG or PNG (Max 10MB)</div>
              </>
            )}
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '32px' }}>
          <label className="form-label">DETAILED DESCRIPTION</label>
          <textarea name="description" required className="form-textarea" rows="4" value={formData.description} onChange={handleInputChange} placeholder="Please describe the issue in detail to help our team respond faster..."></textarea>
        </div>

        <button type="submit" className="btn btn-primary mb-4">Submit Report</button>
        <button type="button" className="btn btn-text text-center" style={{ width: '100%', marginBottom: '32px' }}>Save as Draft</button>

      </form>

      <div style={{ background: '#e0e7ff', borderRadius: 'var(--rounded-md)', padding: '16px', display: 'flex', gap: '16px' }}>
        <div style={{ background: '#94a3b8', color: 'white', width: '24px', height: '24px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Info size={14} />
        </div>
        <div>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem' }}>What happens next?</h4>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Your report will be assigned to the relevant department within 24 hours. You'll receive real-time updates via the Dashboard.</p>
        </div>
      </div>
      
    </div>
  );
};

export default SubmitComplaint;
