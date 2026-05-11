import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';

const CheckoutPage = () => {
  const { cart, cartTotal, placeOrder } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [form, setForm] = useState({ fullName: '', address: '', city: '', zipCode: '', paymentMode: 'cod' });

  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) navigate('/cart');
    if (user) setForm(f => ({ ...f, fullName: user.name || '', address: user.address || '' }));
  }, [cart, navigate, orderPlaced, user]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.address || !form.city || !form.zipCode) { toast.error('Fill in all shipping fields'); return; }
    if (!user) { toast.error('Please login to place order'); navigate('/login'); return; }
    placeOrder({ shippingDetails: { fullName: form.fullName, address: form.address, city: form.city, zipCode: form.zipCode }, paymentMode: form.paymentMode, totalAmount: cartTotal }, user.id);
    setOrderPlaced(true);
    toast.success('Order placed successfully!');
  };

  if (orderPlaced) return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="fitgear-card p-5 text-center" style={{ maxWidth: 500, width: '100%' }}>
        <FaCheckCircle style={{ fontSize: '4rem', color: '#2ea043', marginBottom: '1.25rem' }} />
        <h2 style={{ color: 'var(--navy)', marginBottom: '0.75rem' }}>Order Confirmed!</h2>
        <p style={{ color: 'var(--text-mid)', marginBottom: '2rem' }}>
          Thank you! Your order has been placed and is being processed.
        </p>
        <button className="btn btn-primary px-5 py-2" onClick={() => navigate('/dashboard')}>View Orders</button>
      </div>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 0 4rem' }}>
      <div className="container">
        <h2 style={{ color: 'var(--navy)', marginBottom: '0.25rem' }}>Checkout</h2>
        <p style={{ color: 'var(--text-mid)', marginBottom: '2rem' }}>Almost there! Fill in your delivery details.</p>

        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-lg-7">
              {/* Shipping */}
              <div className="fitgear-card p-4 mb-4">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <FaMapMarkerAlt style={{ color: 'var(--accent)', fontSize: '1.1rem' }} />
                  <h5 style={{ margin: 0, color: 'var(--navy)', fontFamily: 'Outfit' }}>Shipping Details</h5>
                </div>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Your full name" />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Address</label>
                    <input type="text" className="form-control" name="address" value={form.address} onChange={handleChange} placeholder="Street address" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">City</label>
                    <input type="text" className="form-control" name="city" value={form.city} onChange={handleChange} placeholder="City" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">PIN Code</label>
                    <input type="text" className="form-control" name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="6-digit PIN" />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="fitgear-card p-4">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <FaCreditCard style={{ color: 'var(--accent)', fontSize: '1.1rem' }} />
                  <h5 style={{ margin: 0, color: 'var(--navy)', fontFamily: 'Outfit' }}>Payment Method</h5>
                </div>
                {[
                  { value: 'cod', label: 'Cash on Delivery', sub: 'Pay when your order arrives', enabled: true },
                  { value: 'card', label: 'Credit / Debit Card', sub: 'Coming soon', enabled: false  },
                  { value: 'upi', label: 'UPI Payment', sub: 'Coming soon', enabled: false },
                ].map(({ value, label, sub, enabled }) => (
                  <label key={value} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: `1.5px solid ${form.paymentMode === value ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem', background: form.paymentMode === value ? 'rgba(10,65,116,0.04)' : 'transparent', cursor: enabled ? 'pointer' : 'not-allowed', opacity: enabled ? 1 : 0.5 }}>
                    <input type="radio" name="paymentMode" value={value} checked={form.paymentMode === value} onChange={handleChange} disabled={!enabled} style={{ accentColor: 'var(--primary)' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '0.95rem' }}>{label}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-mid)' }}>{sub}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="col-lg-5">
              <div className="fitgear-card p-4 sticky-top" style={{ top: 80 }}>
                <h5 style={{ color: 'var(--navy)', fontFamily: 'Outfit', marginBottom: '1.25rem' }}>Order Summary</h5>
                <div style={{ maxHeight: 260, overflowY: 'auto', marginBottom: '1rem' }}>
                  {cart.map(item => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center mb-3">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 44, height: 44, background: 'var(--pale-blue)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <img src={item.image} alt="" style={{ maxWidth: 36, maxHeight: 36, objectFit: 'contain' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.2 }}>{item.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-mid)' }}>Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--dark-blue)', fontSize: '0.9rem' }}>
                        ₹{((item.price - (item.price * (item.discount || 0) / 100)) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <hr style={{ borderColor: 'var(--border)' }} />
                <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-mid)' }}>Subtotal</span>
                  <span style={{ color: 'var(--text-dark)' }}>₹{cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="d-flex justify-content-between mb-3" style={{ fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-mid)' }}>Shipping</span>
                  <span style={{ color: '#1a7a45', fontWeight: 600 }}>Free</span>
                </div>
                <hr style={{ borderColor: 'var(--border)' }} />
                <div className="d-flex justify-content-between mb-4">
                  <span style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--navy)', fontSize: '1.1rem' }}>Total</span>
                  <span style={{ fontFamily: 'Outfit', fontWeight: 800, color: 'var(--dark-blue)', fontSize: '1.3rem' }}>₹{cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <button type="submit" className="btn btn-primary w-100 py-3" style={{ fontSize: '1rem' }}>Place Order</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
