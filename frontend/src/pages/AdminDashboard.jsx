import React, { useContext, useState } from 'react';
import { ProductContext } from '../contexts/ProductContext';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaBoxOpen, FaUsers, FaLock, FaEdit, FaEyeSlash, FaEye } from 'react-icons/fa';

const TABS = ['products', 'orders', 'users'];
const CATEGORIES = ['Weights', 'Footwear', 'Accessories', 'Supplements', 'Equipment', 'Apparel'];

const emptyForm = { name: '', brand: '', category: 'Weights', price: '', discount: '0', image: '', popularity: '0' };

/* ─── Edit Modal ─── */
const EditModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: product.name,
    brand: product.brand,
    category: product.category,
    price: String(product.price),
    discount: String(product.discount ?? 0),
    image: product.image,
    popularity: String(product.popularity ?? 0),
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.image || !form.brand) {
      toast.error('Fill all required fields');
      return;
    }
    onSave({
      ...product,
      ...form,
      price: parseFloat(form.price),
      discount: parseInt(form.discount),
      popularity: parseInt(form.popularity),
    });
  };

  return (
    /* Backdrop */
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,29,57,0.45)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: 600, boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
        {/* Modal Header */}
        <div style={{ background: 'linear-gradient(135deg, var(--dark-blue), var(--accent))', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h5 style={{ margin: 0, color: '#fff', fontFamily: 'Outfit', fontWeight: 700 }}>Edit Product</h5>
            <p style={{ margin: 0, color: '#BDD8E9', fontSize: '0.82rem' }}>Update the product details below</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>&times;</button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave}>
          <div style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Product Name *</label>
                <input type="text" className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. ProFlex Dumbbells 24kg" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Brand *</label>
                <input type="text" className="form-control" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="Brand name" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Image URL *</label>
                <input type="url" className="form-control" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
                {form.image && (
                  <div style={{ marginTop: 8, borderRadius: 8, overflow: 'hidden', background: 'var(--pale-blue)', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={form.image} alt="preview" style={{ maxHeight: 72, maxWidth: '100%', objectFit: 'contain' }} onError={e => { e.target.style.display = 'none'; }} />
                  </div>
                )}
              </div>
              <div className="col-md-4">
                <label className="form-label">Price (₹) *</label>
                <input type="number" className="form-control" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} min="0" step="0.01" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Discount (%)</label>
                <input type="number" className="form-control" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} min="0" max="100" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Popularity</label>
                <input type="number" className="form-control" value={form.popularity} onChange={e => setForm({ ...form, popularity: e.target.value })} min="0" />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div style={{ padding: '1rem 1.5rem', borderTop: '1.5px solid var(--border)', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', background: 'var(--surface-2)' }}>
            <button type="button" className="btn btn-outline-primary px-4" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary px-5">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Main Admin Dashboard ─── */
const AdminDashboard = () => {
  const { products, addProduct, editProduct, toggleHideProduct } = useContext(ProductContext);
  const { orders } = useContext(CartContext);
  const { users, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('products');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [addForm, setAddForm] = useState(emptyForm);

  if (!user || user.role !== 'admin') return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="fitgear-card p-5 text-center" style={{ maxWidth: 400 }}>
        <FaLock style={{ fontSize: '3rem', color: 'var(--sky-light)', marginBottom: '1rem' }} />
        <h3 style={{ color: 'var(--navy)', marginBottom: '0.75rem' }}>Access Denied</h3>
        <p style={{ color: 'var(--text-mid)', marginBottom: '1.5rem' }}>You need admin privileges to view this page.</p>
        <button className="btn btn-primary px-4" onClick={() => navigate('/')}>Return Home</button>
      </div>
    </div>
  );

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.price || !addForm.image || !addForm.brand) { toast.error('Fill all required fields'); return; }
    addProduct({ ...addForm, id: Date.now().toString(), price: parseFloat(addForm.price), discount: parseInt(addForm.discount), popularity: parseInt(addForm.popularity) });
    toast.success('Product added!');
    setShowAddForm(false);
    setAddForm(emptyForm);
  };

  const handleEditSave = (updatedProduct) => {
    editProduct(updatedProduct);
    setEditingProduct(null);
    toast.success('Product updated!');
  };

  const handleToggleHide = (product) => {
    toggleHideProduct(product.id);
    toast.info(product.hidden ? `"${product.name}" is now visible.` : `"${product.name}" hidden from shop.`);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 0 4rem' }}>
      {/* Edit Modal */}
      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleEditSave}
        />
      )}

      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h2 style={{ color: 'var(--navy)', marginBottom: 4 }}>Admin <span style={{ color: 'var(--accent)' }}>Dashboard</span></h2>
            <p style={{ color: 'var(--text-mid)', margin: 0 }}>Manage products, orders, and users</p>
          </div>
          {activeTab === 'products' && !showAddForm && (
            <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowAddForm(true)}>
              <FaPlus /> Add Product
            </button>
          )}
        </div>

        {/* Tab Nav */}
        <div className="d-flex gap-2 mb-4" style={{ borderBottom: '2px solid var(--border)' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setShowAddForm(false); }}
              style={{ background: 'none', border: 'none', padding: '0.6rem 1.25rem', fontWeight: 700, fontFamily: 'Outfit', cursor: 'pointer', fontSize: '0.95rem', color: activeTab === tab ? 'var(--primary)' : 'var(--text-mid)', borderBottom: `3px solid ${activeTab === tab ? 'var(--primary)' : 'transparent'}`, marginBottom: -2, textTransform: 'capitalize', transition: 'all 0.2s' }}>
              {tab === 'products' ? `Products (${products.length})` : tab === 'orders' ? `Orders (${orders.length})` : `Users (${users.length})`}
            </button>
          ))}
        </div>

        {/* Add Product Form */}
        {activeTab === 'products' && showAddForm && (
          <div className="fitgear-card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 style={{ margin: 0, color: 'var(--navy)', fontFamily: 'Outfit' }}>Add New Product</h5>
              <button onClick={() => { setShowAddForm(false); setAddForm(emptyForm); }} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-mid)', lineHeight: 1 }}>&times;</button>
            </div>
            <form onSubmit={handleAddProduct}>
              <div className="row g-3">
                <div className="col-md-6"><label className="form-label">Product Name *</label><input type="text" className="form-control" placeholder="e.g. Yoga Mat Pro" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} /></div>
                <div className="col-md-6"><label className="form-label">Brand *</label><input type="text" className="form-control" placeholder="Brand name" value={addForm.brand} onChange={e => setAddForm({ ...addForm, brand: e.target.value })} /></div>
                <div className="col-12"><label className="form-label">Image URL *</label><input type="url" className="form-control" placeholder="https://..." value={addForm.image} onChange={e => setAddForm({ ...addForm, image: e.target.value })} /></div>
                <div className="col-md-4"><label className="form-label">Category</label>
                  <select className="form-select" value={addForm.category} onChange={e => setAddForm({ ...addForm, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-md-4"><label className="form-label">Price (₹) *</label><input type="number" className="form-control" placeholder="0" value={addForm.price} onChange={e => setAddForm({ ...addForm, price: e.target.value })} /></div>
                <div className="col-md-4"><label className="form-label">Discount (%)</label><input type="number" className="form-control" placeholder="0" value={addForm.discount} onChange={e => setAddForm({ ...addForm, discount: e.target.value })} /></div>
                <div className="col-12 d-flex gap-2 mt-2">
                  <button type="submit" className="btn btn-primary px-4">Save Product</button>
                  <button type="button" className="btn btn-outline-primary px-4" onClick={() => { setShowAddForm(false); setAddForm(emptyForm); }}>Cancel</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ── Products Table ── */}
        {activeTab === 'products' && !showAddForm && (
          <div className="fitgear-card overflow-hidden">
            <div className="table-responsive">
              <table className="table fitgear-table mb-0">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ opacity: p.hidden ? 0.55 : 1 }}>
                      {/* Thumbnail */}
                      <td>
                        <div style={{ width: 48, height: 48, background: p.hidden ? '#f0f0f0' : 'var(--pale-blue)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                          <img src={p.image} alt={p.name} style={{ maxWidth: 38, maxHeight: 38, objectFit: 'contain' }} />
                        </div>
                      </td>
                      {/* Name */}
                      <td>
                        <div style={{ fontWeight: 600, color: p.hidden ? 'var(--text-light)' : 'var(--navy)', fontSize: '0.92rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{p.brand}</div>
                      </td>
                      {/* Category */}
                      <td>
                        <span style={{ background: 'var(--pale-blue)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 50 }}>{p.category}</span>
                      </td>
                      {/* Price */}
                      <td style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>₹{p.price.toLocaleString()}</td>
                      {/* Discount */}
                      <td>
                        {p.discount > 0
                          ? <span style={{ color: '#1a7a45', fontWeight: 700 }}>{p.discount}% OFF</span>
                          : <span style={{ color: 'var(--text-light)' }}>—</span>}
                      </td>
                      {/* Status */}
                      <td>
                        {p.hidden
                          ? <span style={{ background: '#fde8e8', color: '#c0392b', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 50 }}>Hidden</span>
                          : <span style={{ background: '#d4f5e4', color: '#1a7a45', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 50 }}>Visible</span>}
                      </td>
                      {/* Actions */}
                      <td style={{ textAlign: 'center' }}>
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          {/* Edit */}
                          <button
                            onClick={() => setEditingProduct(p)}
                            title="Edit product"
                            style={{ background: 'var(--pale-blue)', border: 'none', color: 'var(--primary)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'var(--pale-blue)'; e.currentTarget.style.color = 'var(--primary)'; }}
                          >
                            <FaEdit size={12} /> Edit
                          </button>
                          {/* Hide / Unhide */}
                          <button
                            onClick={() => handleToggleHide(p)}
                            title={p.hidden ? 'Make visible' : 'Hide from shop'}
                            style={{ background: p.hidden ? '#d4f5e4' : '#fde8e8', border: 'none', color: p.hidden ? '#1a7a45' : '#c0392b', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                          >
                            {p.hidden ? <><FaEye size={12} /> Show</> : <><FaEyeSlash size={12} /> Hide</>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Orders Table ── */}
        {activeTab === 'orders' && (
          <div className="fitgear-card overflow-hidden">
            <div className="table-responsive">
              <table className="table fitgear-table mb-0">
                <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Payment</th></tr></thead>
                <tbody>
                  {orders.length === 0
                    ? <tr><td colSpan={5} className="text-center py-5" style={{ color: 'var(--text-mid)' }}>No orders yet.</td></tr>
                    : orders.map(o => (
                      <tr key={o.id}>
                        <td style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-mid)' }}>{o.id}</td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{o.shippingDetails?.fullName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-mid)' }}>{o.shippingDetails?.city}</div>
                        </td>
                        <td style={{ color: 'var(--text-mid)' }}>{new Date(o.date).toLocaleDateString()}</td>
                        <td style={{ fontWeight: 700, color: 'var(--dark-blue)' }}>₹{o.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td><span style={{ background: 'var(--pale-blue)', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 700, padding: '3px 10px', borderRadius: 50, textTransform: 'uppercase' }}>{o.paymentMode}</span></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Users Table ── */}
        {activeTab === 'users' && (
          <div className="fitgear-card overflow-hidden">
            <div className="table-responsive">
              <table className="table fitgear-table mb-0">
                <thead><tr><th>Name</th><th>Email</th><th>Mobile</th><th>Role</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, var(--dark-blue), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-mid)' }}>{u.email}</td>
                      <td style={{ color: 'var(--text-mid)' }}>{u.mobile}</td>
                      <td>
                        <span style={{ background: u.role === 'admin' ? '#fde8e8' : 'var(--pale-blue)', color: u.role === 'admin' ? '#c0392b' : 'var(--primary)', fontSize: '0.78rem', fontWeight: 700, padding: '3px 10px', borderRadius: 50, textTransform: 'uppercase' }}>
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
