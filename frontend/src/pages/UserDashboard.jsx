import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import { FaUserEdit, FaBox, FaSignOutAlt, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user, updateProfile, logout } = useContext(AuthContext);
  const { orders } = useContext(CartContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', mobile: user?.mobile || '', address: user?.address || '' });

  if (!user) { navigate('/login'); return null; }

  const userOrders = orders.filter(o => o.userId === user.id);

  const handleUpdate = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    toast.success('Profile updated!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUserEdit },
    { id: 'orders', label: `Orders (${userOrders.length})`, icon: FaBox },
  ];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 style={{ color: 'var(--navy)', marginBottom: 4 }}>My <span style={{ color: 'var(--accent)' }}>Dashboard</span></h2>
            <p style={{ color: 'var(--text-mid)', margin: 0 }}>Manage your account and orders</p>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} style={{ background: 'none', border: '1.5px solid #E63946', color: '#E63946', borderRadius: 'var(--radius-sm)', padding: '0.45rem 1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem' }}>
            <FaSignOutAlt /> Logout
          </button>
        </div>

        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="fitgear-card overflow-hidden">
              {/* Avatar */}
              <div style={{ background: 'linear-gradient(135deg, var(--dark-blue), var(--accent))', padding: '2rem', textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '3px solid rgba(255,255,255,0.4)' }}>
                  <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '2rem', color: '#fff' }}>{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>{user.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#BDD8E9' }}>{user.email}</div>
              </div>
              {/* Tabs */}
              <div style={{ padding: '0.75rem' }}>
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button key={id} className={`dashboard-sidebar-btn${activeTab === id ? ' active' : ''}`} onClick={() => setActiveTab(id)}>
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="col-lg-9">
            {activeTab === 'profile' && (
              <div className="fitgear-card">
                <div className="d-flex justify-content-between align-items-center p-4" style={{ borderBottom: '1.5px solid var(--border)' }}>
                  <h5 style={{ margin: 0, color: 'var(--navy)', fontFamily: 'Outfit' }}>Profile Details</h5>
                  {!isEditing && <button className="btn btn-outline-primary btn-sm" onClick={() => setIsEditing(true)}>Edit Profile</button>}
                </div>
                <div className="p-4">
                  {isEditing ? (
                    <form onSubmit={handleUpdate}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Full Name</label>
                          <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Mobile</label>
                          <input type="tel" className="form-control" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Address</label>
                          <textarea className="form-control" rows={3} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                        <div className="col-12 d-flex gap-2">
                          <button type="submit" className="btn btn-primary px-4">Save Changes</button>
                          <button type="button" className="btn btn-outline-primary px-4" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="row g-4">
                      {[
                        { label: 'Full Name', value: user.name, icon: FaUserEdit },
                        { label: 'Email Address', value: user.email, icon: FaEnvelope },
                        { label: 'Mobile', value: user.mobile, icon: FaPhone },
                      ].map(({ label, value, icon: Icon }) => (
                        <div className="col-md-6" key={label}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
                            <Icon style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, marginBottom: 2 }}>{label}</div>
                              <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{value}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="col-12">
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
                          <FaMapMarkerAlt style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600, marginBottom: 2 }}>Address</div>
                            <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{user.address}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="fitgear-card">
                <div className="p-4" style={{ borderBottom: '1.5px solid var(--border)' }}>
                  <h5 style={{ margin: 0, color: 'var(--navy)', fontFamily: 'Outfit' }}>Order History</h5>
                </div>
                {userOrders.length === 0 ? (
                  <div className="p-5 text-center">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                    <p style={{ color: 'var(--text-mid)' }}>No orders placed yet.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table fitgear-table mb-0">
                      <thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
                      <tbody>
                        {userOrders.map(order => (
                          <tr key={order.id}>
                            <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{order.id}</td>
                            <td>{new Date(order.date).toLocaleDateString()}</td>
                            <td>{order.items.reduce((a, i) => a + i.quantity, 0)} items</td>
                            <td style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>₹{order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td><span className="badge badge-success" style={{ padding: '4px 10px', borderRadius: 50 }}>Processing</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
