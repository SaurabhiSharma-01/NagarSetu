import React, { useState } from 'react';
import { User, Bell, Sliders, Shield, Camera, Lock, Smartphone, ChevronRight, History } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const adminUser = JSON.parse(localStorage.getItem('adminUser')) || { name: 'Vikram Malhotra', email: 'v.malhotra@nagarsetu.gov.in' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px' }}>
      <div>
        <div className="page-caption" style={{ color: 'var(--primary)' }}>SYSTEM ADMINISTRATION</div>
        <h1 className="page-title" style={{ margin: '8px 0', fontSize: '2.5rem' }}>Control Center</h1>
        <p className="card-desc" style={{ fontSize: '1rem', maxWidth: '700px' }}>
          Manage administrative privileges, platform parameters, and security protocols for the NagarSetu ecosystem.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginTop: '16px' }}>
        <div 
          onClick={() => setActiveTab('account')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: activeTab === 'account' ? 700 : 600, color: activeTab === 'account' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'account' ? '3px solid var(--primary)' : 'none', paddingBottom: '14px', marginBottom: '-18px' }}>
          <User size={18} /> Account Profile
        </div>
        <div 
          onClick={() => setActiveTab('notifications')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: activeTab === 'notifications' ? 700 : 600, color: activeTab === 'notifications' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'notifications' ? '3px solid var(--primary)' : 'none', paddingBottom: '14px', marginBottom: '-18px' }}>
          <Bell size={18} /> Notifications
        </div>
        <div 
          onClick={() => setActiveTab('config')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: activeTab === 'config' ? 700 : 600, color: activeTab === 'config' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'config' ? '3px solid var(--primary)' : 'none', paddingBottom: '14px', marginBottom: '-18px' }}>
          <Sliders size={18} /> Platform Config
        </div>
        <div 
          onClick={() => setActiveTab('security')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: activeTab === 'security' ? 700 : 600, color: activeTab === 'security' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: activeTab === 'security' ? '3px solid var(--primary)' : 'none', paddingBottom: '14px', marginBottom: '-18px' }}>
          <Shield size={18} /> Security & 2FA
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '32px', marginTop: '32px', maxWidth: '800px' }}>
        {/* Account Profile Tab */}
        {activeTab === 'account' && (
          <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '32px', gap: '32px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 140, height: 140, background: '#f1f5f9', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                 <img src={`https://ui-avatars.com/api/?name=${adminUser.name.replace(' ', '+')}&background=e2e8f0&color=0f172a&size=140`} alt="Profile" />
              </div>
              <div style={{ position: 'absolute', bottom: -12, right: -12, background: 'var(--primary)', color: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
                <Camera size={16} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '1.4rem' }}>Administrative Profile</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 24px 0' }}>These details are visible to the ministry oversight board.</p>
              
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">FULL NAME</label>
                  <input type="text" className="form-control" style={{ background: '#f1f5f9', border: 'none' }} value={adminUser.name} readOnly />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">DESIGNATION</label>
                  <input type="text" className="form-control" style={{ background: '#f1f5f9', border: 'none' }} value="City Commissioner" readOnly />
                </div>
              </div>
              <div>
                <label className="form-label">WORK EMAIL ADDRESS</label>
                <input type="text" className="form-control" style={{ background: '#f1f5f9', border: 'none' }} value={adminUser.email} readOnly />
              </div>
            </div>
          </div>
        )}

        {/* Platform Configuration List */}
        {activeTab === 'config' && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Platform Configuration</h2>
              <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Save Structural Changes</button>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>Global parameters for issue routing and triage.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: 40, height: 40, background: '#e0e7ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)' }}>
                    <Sliders size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Active Categories</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Waste, Infrastructure, Water, Lighting (+8 more)</div>
                  </div>
                </div>
                <ChevronRight color="var(--text-light)" />
              </div>

              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: 40, height: 40, background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontWeight: 800 }}>!</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Priority Matrices</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Define SLA response times per severity level</div>
                  </div>
                </div>
                <ChevronRight color="var(--text-light)" />
              </div>
            </div>
          </div>
        )}

        {/* Security / Notifications (Combined or Split) */}
        {activeTab === 'security' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', padding: '32px' }}>
            <Shield size={28} />
            <h2 style={{ fontSize: '1.4rem', margin: '16px 0 8px 0' }}>Security Status</h2>
            <p style={{ fontSize: '0.9rem', color: '#bfdbfe', lineHeight: 1.5, marginBottom: '32px' }}>
              Your account is currently protected by Multi-Factor Authentication. Last password update: 14 days ago.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '16px', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, cursor: 'pointer' }}>
                Change Password <Lock size={16} />
              </button>
              <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '16px', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, cursor: 'pointer' }}>
                Manage 2FA Devices <Smartphone size={16} />
              </button>
              <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '16px', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, cursor: 'pointer' }}>
                View Login History <History size={16} />
              </button>
            </div>
          </div>
          
          {/* Danger Zone */}
          <div style={{ border: '1px dashed #f87171', background: '#fef2f2', padding: '24px', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#b91c1c', fontSize: '0.95rem' }}>Zone of Deletion</h4>
            <p style={{ color: '#dc2626', fontSize: '0.8rem', margin: '0 0 24px 0' }}>Actions here are permanent and require secondary authorization.</p>
            <button style={{ background: 'none', border: 'none', color: '#b91c1c', fontWeight: 700, fontSize: '0.85rem', padding: 0, cursor: 'pointer' }}>
              Deactivate Administrative Account
            </button>
          </div>
         </div>
        )}

        {activeTab === 'notifications' && (
          <div style={{ background: '#f1f5f9', borderRadius: 'var(--radius-md)', padding: '32px' }}>
            <div className="insight-label" style={{ marginBottom: '24px' }}>QUICK PREFERENCES</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Email Digest</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Weekly summary of city KPIs</div>
              </div>
              <div style={{ width: 44, height: 24, background: 'var(--primary)', borderRadius: 12, position: 'relative' }}>
                <div style={{ width: 20, height: 20, background: 'white', borderRadius: 10, position: 'absolute', top: 2, right: 2 }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>SMS Critical Alerts</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Immediate priority 1 incidents</div>
              </div>
              <div style={{ width: 44, height: 24, background: '#cbd5e1', borderRadius: 12, position: 'relative' }}>
                <div style={{ width: 20, height: 20, background: 'white', borderRadius: 10, position: 'absolute', top: 2, left: 2 }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Desktop Notification</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>New issues in assigned zones</div>
              </div>
              <div style={{ width: 44, height: 24, background: 'var(--primary)', borderRadius: 12, position: 'relative' }}>
                <div style={{ width: 20, height: 20, background: 'white', borderRadius: 10, position: 'absolute', top: 2, right: 2 }}></div>
              </div>
            </div>

            <a href="#" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.05em' }}>
              MORE NOTIFICATION SETTINGS →
            </a>
          </div>
        )}
    </div>
    </div>
  );
};

export default Settings;
