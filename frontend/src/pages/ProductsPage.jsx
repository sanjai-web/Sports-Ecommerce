import React, { useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductContext } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { FaFilter, FaTimes } from 'react-icons/fa';


const ProductsPage = () => {
  const { visibleProducts: products } = useContext(ProductContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortOption, setSortOption] = useState('popularity');
  const [priceRange, setPriceRange] = useState(50000);
  const initialDiscount = searchParams.get('discount') === 'true';

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || '');
  }, [searchParams]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const categoryList = ['All', ...new Set(products.map(p => p.category))];

  let filtered = products.filter(p => {
    const s = searchQuery.toLowerCase();
    return (
      (p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s)) &&
      (category === '' || category === 'All' || p.category === category) &&
      p.price <= priceRange &&
      (initialDiscount ? p.discount > 0 : true)
    );
  });

  filtered.sort((a, b) => {
    const fp = p => p.price - (p.price * (p.discount || 0) / 100);
    if (sortOption === 'price-low') return fp(a) - fp(b);
    if (sortOption === 'price-high') return fp(b) - fp(a);
    return (b.popularity || 0) - (a.popularity || 0);
  });

  const clearFilters = () => {
    setCategory(''); setSearchQuery(''); setPriceRange(50000); setSortOption('popularity'); setSearchParams({});
  };

  const FilterPanel = () => (
    <div className="fitgear-card p-4 sticky-top" style={{ top: 80, borderRadius: 'var(--radius-md)' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 style={{ margin: 0, color: 'var(--navy)', fontFamily: 'Outfit' }}>Filters</h5>
        <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', padding: 0 }}>
          Clear all
        </button>
      </div>

      <div className="mb-4">
        <label className="form-label">Search</label>
        <input
          type="text"
          className="form-control"
          placeholder="Products, brands..."
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            e.target.value ? searchParams.set('search', e.target.value) : searchParams.delete('search');
            setSearchParams(searchParams);
          }}
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Category</label>
        <div className="d-flex flex-wrap gap-2">
          {categoryList.map(cat => (
            <button
              key={cat}
              onClick={() => {
                const val = cat === 'All' ? '' : cat;
                setCategory(val);
                val ? searchParams.set('category', val) : searchParams.delete('category');
                setSearchParams(searchParams);
              }}
              style={{
                padding: '4px 14px',
                borderRadius: 50,
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: `1.5px solid ${(category || 'All') === cat ? 'var(--primary)' : 'var(--border)'}`,
                background: (category || 'All') === cat ? 'var(--primary)' : 'transparent',
                color: (category || 'All') === cat ? '#fff' : 'var(--text-mid)',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <label className="form-label">
          Max Price: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{priceRange.toLocaleString()}</span>
        </label>
        <input type="range" className="form-range" min="0" max="50000" step="1000" value={priceRange} onChange={e => setPriceRange(Number(e.target.value))} />
        <div className="d-flex justify-content-between" style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
          <span>₹0</span><span>₹50,000</span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--dark-blue) 100%)', padding: '2.5rem 0' }}>
        <div className="container">
          <h2 style={{ color: '#fff', marginBottom: '0.25rem' }}>Shop <span style={{ color: '#7BBDE8' }}>Gear</span></h2>
          <p style={{ color: '#6EA2B3', marginBottom: 0 }}>Find everything you need to crush your goals.</p>
        </div>
      </div>

      <div className="container py-5">
        {/* Top bar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span style={{ color: 'var(--text-mid)', fontWeight: 500 }}>
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
          </span>
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-sm d-lg-none d-flex align-items-center gap-2" onClick={() => setShowFilters(!showFilters)}
              style={{ background: 'var(--pale-blue)', color: 'var(--primary)', border: 'none', borderRadius: 8, fontWeight: 600 }}>
              <FaFilter /> Filters
            </button>
            <div className="d-flex align-items-center gap-2">
              <label style={{ color: 'var(--text-mid)', fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap', margin: 0 }}>Sort:</label>
              <select className="form-select form-select-sm" value={sortOption} onChange={e => setSortOption(e.target.value)} style={{ width: 'auto' }}>
                <option value="popularity">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile filter drawer */}
        {showFilters && (
          <div className="d-lg-none mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 style={{ margin: 0, color: 'var(--navy)' }}>Filters</h6>
              <button onClick={() => setShowFilters(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-mid)' }}>
                <FaTimes />
              </button>
            </div>
            <FilterPanel />
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-3 d-none d-lg-block">
            <FilterPanel />
          </div>

          <div className="col-lg-9">
            {loading ? (
              <SkeletonLoader count={6} />
            ) : filtered.length > 0 ? (
              <div className="row g-4">
                {filtered.map(product => (
                  <div className="col-12 col-md-6 col-xl-4" key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="fitgear-card p-5 text-center">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h4 style={{ color: 'var(--navy)' }}>No products found</h4>
                <p style={{ color: 'var(--text-mid)' }}>Try adjusting your filters or search query.</p>
                <button className="btn btn-outline-primary mt-2" onClick={clearFilters}>Clear Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
