import React from 'react';

const SkeletonLoader = ({ count = 4 }) => (
  <div className="row g-4">
    {Array.from({ length: count }).map((_, i) => (
      <div className="col-12 col-md-6 col-xl-4" key={i}>
        <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <div className="skeleton-box" style={{ height: 220 }} />
          <div style={{ padding: '1rem 1.2rem 1.2rem' }}>
            <div className="skeleton-box" style={{ height: 12, width: '40%', borderRadius: 6, marginBottom: 10 }} />
            <div className="skeleton-box" style={{ height: 16, width: '80%', borderRadius: 6, marginBottom: 8 }} />
            <div className="skeleton-box" style={{ height: 16, width: '60%', borderRadius: 6, marginBottom: 20 }} />
            <div className="d-flex justify-content-between align-items-center">
              <div className="skeleton-box" style={{ height: 24, width: '35%', borderRadius: 6 }} />
              <div className="skeleton-box" style={{ height: 38, width: 38, borderRadius: '50%' }} />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default SkeletonLoader;
