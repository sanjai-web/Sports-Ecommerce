import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { FaTrash, FaMinus, FaPlus, FaArrowRight, FaShoppingBag } from 'react-icons/fa';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => {
    const discountedPrice = item.product.price - (item.product.price * (item.product.discount || 0) / 100);
    return sum + (discountedPrice * item.quantity);
  }, 0);

  if (cart.length === 0) return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="text-center p-5">
        <div style={{ width: 96, height: 96, background: 'var(--pale-blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <FaShoppingBag style={{ fontSize: '2.5rem', color: 'var(--sky-light)' }} />
        </div>
        <h3 style={{ color: 'var(--navy)', marginBottom: '0.75rem' }}>Your cart is empty</h3>
        <p style={{ color: 'var(--text-mid)', marginBottom: '1.5rem' }}>Looks like you haven't added any gear yet.</p>
        <Link to="/products" className="btn btn-primary px-5 py-2">Start Shopping</Link>
      </div>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="container">
        <h2 style={{ color: 'var(--navy)', marginBottom: '0.25rem' }}>Your <span style={{ color: 'var(--accent)' }}>Cart</span></h2>
        <p style={{ color: 'var(--text-mid)', marginBottom: '2rem' }}>{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>

        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-lg-8">
            <div className="fitgear-card overflow-hidden">
              {cart.map((item, idx) => {
                // Access product properties from the nested product object
                const product = item.product;
                const finalPrice = product.price - (product.price * (product.discount || 0) / 100);
                
                return (
                  <div key={product._id} style={{ padding: '1.25rem 1.5rem', borderBottom: idx < cart.length - 1 ? '1.5px solid var(--border)' : 'none' }}>
                    <div className="row align-items-center g-3">
                      <div className="col-3 col-md-2">
                        <div style={{ background: 'linear-gradient(135deg, #f8fbff, var(--pale-blue))', borderRadius: 'var(--radius-sm)', padding: '0.5rem', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            style={{ maxWidth: '100%', maxHeight: 60, objectFit: 'contain' }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/60x60?text=Product';
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-9 col-md-4">
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
                          {product.brand}
                        </div>
                        <div style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--navy)', fontSize: '0.95rem', lineHeight: 1.3, marginBottom: 4 }}>
                          {product.name}
                        </div>
                        <div style={{ fontFamily: 'Outfit', fontWeight: 800, color: 'var(--dark-blue)', fontSize: '1.1rem' }}>
                          ₹{finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="col-6 col-md-4 d-flex justify-content-start justify-content-md-center">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1.5px solid var(--border)', borderRadius: 50, overflow: 'hidden' }}>
                          <button 
                            onClick={() => updateQuantity(product._id, item.quantity - 1)} 
                            style={{ background: 'none', border: 'none', padding: '6px 12px', cursor: 'pointer', color: 'var(--text-mid)', display: 'flex', alignItems: 'center' }}
                          >
                            <FaMinus style={{ fontSize: '0.7rem' }} />
                          </button>
                          <span style={{ padding: '6px 12px', fontWeight: 700, color: 'var(--navy)', minWidth: 36, textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(product._id, item.quantity + 1)} 
                            style={{ background: 'none', border: 'none', padding: '6px 12px', cursor: 'pointer', color: 'var(--text-mid)', display: 'flex', alignItems: 'center' }}
                          >
                            <FaPlus style={{ fontSize: '0.7rem' }} />
                          </button>
                        </div>
                      </div>
                      <div className="col-6 col-md-2 d-flex align-items-center justify-content-end gap-3">
                        <span style={{ fontFamily: 'Outfit', fontWeight: 800, color: 'var(--dark-blue)' }}>
                          ₹{(finalPrice * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <button 
                          onClick={() => removeFromCart(product._id)} 
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E63946', padding: 4 }} 
                          title="Remove"
                        >
                          <FaTrash style={{ fontSize: '0.85rem' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="fitgear-card p-4 sticky-top" style={{ top: 80 }}>
              <h5 style={{ color: 'var(--navy)', marginBottom: '1.25rem', fontFamily: 'Outfit' }}>Order Summary</h5>
              <div className="d-flex justify-content-between mb-3" style={{ fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-mid)' }}>Subtotal</span>
                <span style={{ color: 'var(--text-dark)' }}>
                  ₹{cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-3" style={{ fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-mid)' }}>Shipping</span>
                <span style={{ color: '#1a7a45', fontWeight: 600 }}>Free</span>
              </div>
              <hr style={{ borderColor: 'var(--border)' }} />
              <div className="d-flex justify-content-between mb-4">
                <span style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--navy)', fontSize: '1.1rem' }}>Total</span>
                <span style={{ fontFamily: 'Outfit', fontWeight: 800, color: 'var(--dark-blue)', fontSize: '1.3rem' }}>
                  ₹{cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <button 
                className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2" 
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout <FaArrowRight />
              </button>
              <div className="text-center mt-3">
                <Link to="/products" style={{ color: 'var(--text-mid)', fontSize: '0.85rem' }}>Continue Shopping</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;