import React, { useContext } from 'react';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { CartContext } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const discountedPrice = product.discount > 0
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
      <div className="product-image-container">
        {product.discount > 0 && (
          <span className="discount-badge">{product.discount}% OFF</span>
        )}
        <img src={product.image} alt={product.name} className="product-image" />
      </div>

      <div className="card-body-inner">
        <div className="product-brand">{product.brand}</div>
        <div className="product-name">{product.name}</div>

        <div className="d-flex align-items-center gap-1 mb-3" style={{ color: '#F59E0B' }}>
          {[1,2,3,4].map(i => <FaStar key={i} style={{ fontSize: '0.75rem' }} />)}
          <FaStar style={{ fontSize: '0.75rem', color: '#D1D5DB' }} />
          <span style={{ color: 'var(--text-light)', fontSize: '0.75rem', marginLeft: 4 }}>
            ({product.popularity})
          </span>
        </div>

        <div className="d-flex align-items-center justify-content-between mt-auto">
          <div>
            {product.discount > 0 && (
              <span className="product-price-original me-2">₹{product.price.toLocaleString()}</span>
            )}
            <span className="product-price-current">₹{discountedPrice.toLocaleString()}</span>
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart} title="Add to Cart">
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
