import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaDumbbell } from 'react-icons/fa';

const Footer = () => (
  <footer className="fitgear-footer">
    <div className="container">
      <div className="row gy-4 pb-4">
        <div className="col-lg-4 col-md-6">
          <div className="d-flex align-items-center gap-2 mb-3">
            <FaDumbbell style={{ color: '#7BBDE8', fontSize: '1.4rem' }} />
            <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.5rem', color: '#fff', letterSpacing: '-0.02em' }}>
              FIT<span style={{ color: '#7BBDE8' }}>GEAR</span>
            </span>
          </div>
          <p style={{ color: '#6EA2B3', fontSize: '0.9rem', lineHeight: 1.7 }}>
            Premium sports and fitness equipment to help you reach your ultimate potential. Gear up and push your limits.
          </p>
          <div className="d-flex gap-3 mt-3">
            {[FaFacebook, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
              <a key={i} href="#" className="social-icon"><Icon /></a>
            ))}
          </div>
        </div>

        <div className="col-lg-2 col-md-6 col-6">
          <h5>Shop</h5>
          {['Weights', 'Equipment', 'Footwear', 'Supplements', 'Accessories'].map(cat => (
            <Link key={cat} to={`/products?category=${cat}`} className="footer-link">{cat}</Link>
          ))}
        </div>

        <div className="col-lg-2 col-md-6 col-6">
          <h5>Company</h5>
          {['About Us', 'Contact', 'Careers'].map(l => (
            <a key={l} href="#" className="footer-link">{l}</a>
          ))}
        </div>

        <div className="col-lg-4 col-md-6">
          <h5>Stay in the Loop</h5>
          <p style={{ color: '#6EA2B3', fontSize: '0.88rem' }}>Get the latest deals and training tips.</p>
          <div className="d-flex gap-2 mt-2">
            <input type="email" className="form-control" placeholder="Enter your email" style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#fff', borderRadius: 8 }} />
            <button className="btn btn-accent btn-sm px-3" style={{ background: '#4E8EA2', color: '#fff', border: 'none', borderRadius: 8, whiteSpace: 'nowrap' }}>Subscribe</button>
          </div>
          <div className="mt-4">
            <h5>Legal</h5>
            {['Privacy Policy', 'Terms of Service', 'Return Policy'].map(l => (
              <a key={l} href="#" className="footer-link">{l}</a>
            ))}
          </div>
        </div>
      </div>

      <hr className="footer-divider" />
      <p className="text-center mb-0" style={{ color: '#49769F', fontSize: '0.82rem' }}>
        &copy; {new Date().getFullYear()} FitGear. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
