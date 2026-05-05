import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ProductContext } from '../contexts/ProductContext';
import { FaArrowRight, FaDumbbell, FaRunning, FaFlask } from 'react-icons/fa';

const categories = [
  { label: 'Weights', desc: 'Dumbbells, Kettlebells & Plates', icon: FaDumbbell, key: 'Weights', color: '#0A4174' },
  { label: 'Footwear', desc: 'Running & Training Shoes', icon: FaRunning, key: 'Footwear', color: '#4E8EA2' },
  { label: 'Supplements', desc: 'Protein, Pre-workout & Recovery', icon: FaFlask, key: 'Supplements', color: '#49769F' },
];

const LandingPage = () => {
  const { visibleProducts: products } = useContext(ProductContext);
  const featuredProducts = [...products].sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 4);

  return (
    <div>
      {/* ── HERO ── */}
      <section
        className="page-hero d-flex align-items-center py-5 py-lg-0"
        style={{ minHeight: '88vh', position: 'relative', overflow: 'hidden' }}
      >
        {/* decorative blobs */}
        <div style={{ position:'absolute', top:'-80px', right:'-80px', width:420, height:420, borderRadius:'50%', background:'rgba(123,189,232,0.12)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-60px', left:'-60px', width:280, height:280, borderRadius:'50%', background:'rgba(78,142,162,0.12)', pointerEvents:'none' }} />

        <div className="container" style={{ position:'relative', zIndex:2 }}>
          <div className="row align-items-center gy-5">
            <div className="col-lg-6">
              <span style={{ background:'rgba(123,189,232,0.18)', color:'#7BBDE8', fontWeight:700, fontSize:'0.78rem', letterSpacing:'2px', textTransform:'uppercase', borderRadius:50, padding:'6px 16px', display:'inline-block', marginBottom:'1.25rem' }}>
                🏆 Premium Sports & Fitness
              </span>
              <h1 style={{ fontSize:'clamp(2.4rem,6vw,4rem)', fontWeight:900, color:'#fff', lineHeight:1.1, marginBottom:'1.25rem' }}>
                UNLEASH YOUR<br />
                <span style={{ color:'#7BBDE8' }}>POTENTIAL</span>
              </h1>
              <p style={{ color:'#BDD8E9', fontSize:'1.1rem', lineHeight:1.8, marginBottom:'2rem', maxWidth:480 }}>
                Premium gear for elite performance. Elevate every workout with top-tier sports and fitness equipment.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/products" className="btn btn-primary btn-lg px-5 py-3">
                  Shop Now <FaArrowRight className="ms-2" />
                </Link>
                <Link to="/products?category=Equipment" style={{ background:'rgba(255,255,255,0.1)', color:'#fff', border:'1.5px solid rgba(255,255,255,0.25)', borderRadius:8, padding:'0.75rem 2rem', fontFamily:'Outfit', fontWeight:600, display:'inline-flex', alignItems:'center', transition:'all 0.2s', textDecoration:'none' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.18)'}
                  onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
                >
                  Explore Equipment
                </Link>
              </div>

              {/* Stats row */}
              <div className="d-flex gap-4 mt-5 flex-wrap">
                {[['10K+','Happy Customers'],['500+','Products'],['50+','Brands']].map(([n,l]) => (
                  <div key={l}>
                    <div style={{ fontFamily:'Outfit', fontWeight:800, fontSize:'1.6rem', color:'#7BBDE8' }}>{n}</div>
                    <div style={{ color:'#6EA2B3', fontSize:'0.82rem' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-6 d-none d-lg-flex justify-content-center">
              <div style={{ position:'relative', width:420, height:420 }}>
                <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(123,189,232,0.1)', border:'2px solid rgba(123,189,232,0.2)' }} />
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Athlete"
                  style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%', border:'4px solid rgba(123,189,232,0.3)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY CARDS ── */}
      <section className="py-5 section-white">
        <div className="container py-3">
          <div className="text-center mb-5">
            <h2 style={{ fontSize:'2rem' }}>Shop by <span style={{ color:'var(--accent)' }}>Category</span></h2>
            <p className="text-muted-blue mt-2">Everything you need for your fitness journey</p>
          </div>
          <div className="row g-4">
            {categories.map(({ label, desc, icon: Icon, key, color }) => (
              <div className="col-md-4" key={key}>
                <Link to={`/products?category=${key}`} className="text-decoration-none" style={{ display:'block' }}>
                  <div className="fitgear-card p-4 text-center h-100" style={{ borderRadius:'var(--radius-lg)', transition:'all 0.3s ease', cursor:'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)'; e.currentTarget.style.borderColor='var(--accent)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='var(--shadow-sm)'; e.currentTarget.style.borderColor='var(--border)'; }}
                  >
                    <div style={{ width:64, height:64, borderRadius:'50%', background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>
                      <Icon style={{ fontSize:'1.6rem', color }} />
                    </div>
                    <h4 style={{ color:'var(--navy)', marginBottom:'0.5rem' }}>{label}</h4>
                    <p style={{ color:'var(--text-mid)', fontSize:'0.9rem', marginBottom:0 }}>{desc}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-5 section-surface">
        <div className="container py-3">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2>Featured <span style={{ color:'var(--accent)' }}>Gear</span></h2>
              <p className="text-muted-blue mt-1 mb-0">Hand-picked top-rated products for you.</p>
            </div>
            <Link to="/products" className="btn btn-outline-primary">View All</Link>
          </div>
          <div className="row g-4">
            {featuredProducts.map(product => (
              <div className="col-12 col-sm-6 col-lg-3" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <section style={{ background:'linear-gradient(135deg,var(--dark-blue),var(--teal))', padding:'4rem 0' }}>
        <div className="container text-center">
          <h2 style={{ color:'#fff', fontSize:'2.2rem', marginBottom:'0.75rem' }}>SUMMER SHRED SALE 🔥</h2>
          <p style={{ color:'#BDD8E9', fontSize:'1.1rem', marginBottom:'2rem' }}>
            Get up to 30% off on all cardio equipment and accessories.
          </p>
          <Link to="/products?discount=true" style={{ background:'#fff', color:'var(--dark-blue)', fontFamily:'Outfit', fontWeight:700, padding:'0.8rem 2.5rem', borderRadius:8, textDecoration:'none', fontSize:'1rem', display:'inline-block', transition:'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform='none'}
          >
            Shop Sale
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
