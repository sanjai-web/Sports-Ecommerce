import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FaLock, FaDumbbell } from 'react-icons/fa';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!identifier || !password) {
    toast.error("Please fill in all fields");
    return;
  }

  const result = await login(identifier, password);

  if (result.success) {
    toast.success("Welcome Back!");
    navigate("/");
  } else {
    toast.error(result.message);
  }
};

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '2rem 0' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-9 col-lg-7 col-xl-5">

            {/* Card */}
            <div className="fitgear-card p-5">
              {/* Header */}
              <div className="text-center mb-4">
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--dark-blue), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <FaDumbbell style={{ color: '#fff', fontSize: '1.5rem' }} />
                </div>
                <h2 style={{ color: 'var(--navy)', marginBottom: '0.4rem' }}>Welcome Back</h2>
                <p style={{ color: 'var(--text-mid)', margin: 0, fontSize: '0.95rem' }}>Login to access your FitGear account</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email or Mobile Number</label>
                  <input type="text" className="form-control" placeholder="Enter email or mobile" value={identifier} onChange={e => setIdentifier(e.target.value)} />
                </div>
                <div className="mb-4">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2">
                  <FaLock /> Login
                </button>
              </form>

              <div className="text-center mt-4" style={{ color: 'var(--text-mid)', fontSize: '0.9rem' }}>
                Don't have an account?{' '}
                <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign up</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
