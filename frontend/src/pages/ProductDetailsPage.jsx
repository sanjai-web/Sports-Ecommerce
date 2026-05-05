import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductContext } from '../contexts/ProductContext';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaStar, FaArrowLeft, FaCheckCircle, FaTruck } from 'react-icons/fa';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const product = products.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '4rem 0', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--navy)' }}>Product Not Found</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  const discountedPrice = product.discount > 0
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  const handleAddToCart = () => {
    if (!user) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-link" 
          style={{ textDecoration: 'none', color: 'var(--text-mid)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontWeight: 600, padding: 0 }}
        >
          <FaArrowLeft /> Back
        </button>

        <div className="row g-5">
          {/* Left Side: Product Image */}
          <div className="col-lg-6">
            <div className="fitgear-card d-flex align-items-center justify-content-center p-4 position-relative" style={{ height: '100%', minHeight: 450, background: 'var(--surface-2)' }}>
              {product.discount > 0 && (
                <span className="badge" style={{ position: 'absolute', top: 20, left: 20, background: '#E63946', color: '#fff', fontSize: '1rem', padding: '6px 12px', borderRadius: '50px' }}>
                  {product.discount}% OFF
                </span>
              )}
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '100%', maxHeight: 450, objectFit: 'contain' }} 
              />
            </div>
          </div>

          {/* Right Side: Product Details */}
          <div className="col-lg-6 d-flex flex-column justify-content-center">
            <div style={{ textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>
              {product.brand}
            </div>
            <h1 style={{ color: 'var(--navy)', fontFamily: 'Outfit', fontWeight: 800, fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>
              {product.name}
            </h1>

            <div className="d-flex align-items-center gap-2 mb-4">
              <div style={{ color: '#F59E0B', display: 'flex' }}>
                {[1,2,3,4].map(i => <FaStar key={i} />)}
                <FaStar style={{ color: '#D1D5DB' }} />
              </div>
              <span style={{ color: 'var(--text-mid)', fontWeight: 600, fontSize: '0.9rem' }}>
                4.0 ({product.popularity} Reviews)
              </span>
            </div>

            <div className="mb-4 d-flex align-items-end gap-3">
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--dark-blue)', lineHeight: 1 }}>
                ₹{discountedPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              {product.discount > 0 && (
                <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-light)', textDecoration: 'line-through', marginBottom: 4 }}>
                  ₹{product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>

            <p style={{ color: 'var(--text-mid)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Designed for optimal performance and durability. This {product.category.toLowerCase()} is perfect for taking your fitness journey to the next level. Featuring premium materials and state-of-the-art construction, it provides the reliability you need for intense workouts.
            </p>

            <div className="d-flex flex-column gap-3 mb-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--navy)', fontWeight: 600 }}>
                <FaCheckCircle style={{ color: '#1a7a45', fontSize: '1.2rem' }} /> In Stock and ready to ship
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--navy)', fontWeight: 600 }}>
                <FaTruck style={{ color: 'var(--primary)', fontSize: '1.2rem' }} /> Free Delivery on all orders
              </div>
            </div>

            <button 
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" 
              style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: 700, borderRadius: 'var(--radius-md)' }}
              onClick={handleAddToCart}
            >
              <FaShoppingCart /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
