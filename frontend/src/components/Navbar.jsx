import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaDumbbell, FaShoppingCart, FaSearch, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="fitgear-navbar">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between w-100 gap-3">

          {/* Brand */}
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none flex-shrink-0">
            <FaDumbbell className="brand-accent" style={{ fontSize: '1.4rem' }} />
            <span>FIT<span className="brand-accent">GEAR</span></span>
          </Link>

          {/* Center: Search (only when logged in) */}
          {user && (
            <form className="d-none d-lg-flex align-items-center flex-grow-1" style={{ maxWidth: 480 }} onSubmit={handleSearch}>
              <input
                type="text"
                className="nav-search flex-grow-1"
                placeholder="Search products, brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="search-btn">
                <FaSearch />
              </button>
            </form>
          )}

          {/* Right side */}
          <div className="d-flex align-items-center gap-2">
            <Link to="/products" className="nav-link d-none d-md-block">Shop</Link>

            {user ? (
              <>
                {/* Cart */}
                <Link to="/cart" className="cart-icon-wrap text-decoration-none">
                  <FaShoppingCart />
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>

                {/* User Dropdown */}
                <div className="position-relative">
                  <div
                    className="user-avatar"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    title={user.name}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  {dropdownOpen && (
                    <>
                      <div
                        className="position-fixed top-0 start-0 w-100 h-100"
                        style={{ zIndex: 999 }}
                        onClick={() => setDropdownOpen(false)}
                      />
                      <ul className="dropdown-menu dropdown-menu-end show position-absolute" style={{ zIndex: 1000, top: '44px', right: 0 }}>
                        <li className="px-3 py-2">
                          <div style={{ fontWeight: 700, color: 'var(--navy)', fontFamily: 'Outfit' }}>{user.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-mid)' }}>{user.email}</div>
                        </li>
                        <li><hr className="my-1" style={{ borderColor: 'var(--border)' }} /></li>
                        <li>
                          <Link
                            className="dropdown-item d-flex align-items-center gap-2"
                            to={user.role === 'admin' ? '/admin' : '/dashboard'}
                            onClick={() => setDropdownOpen(false)}
                          >
                            <FaTachometerAlt size={13} /> Dashboard
                          </Link>
                        </li>
                        <li>
                          <button className="dropdown-item d-flex align-items-center gap-2 text-danger" onClick={handleLogout}>
                            <FaSignOutAlt size={13} /> Logout
                          </button>
                        </li>
                      </ul>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/signup" className="btn btn-primary btn-sm px-4 py-2">Sign Up</Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile search bar (logged in only) */}
        {user && (
          <form className="d-flex d-lg-none mt-2 align-items-center gap-2" onSubmit={handleSearch}>
            <input
              type="text"
              className="nav-search flex-grow-1"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <FaSearch />
            </button>
          </form>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
