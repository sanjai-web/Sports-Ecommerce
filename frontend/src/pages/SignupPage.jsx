import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FaUserPlus } from 'react-icons/fa';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', address: '', password: '', confirmPassword: '' });
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formData).some(v => !v)) { toast.error('Please fill in all fields'); return; }
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (formData.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    const { confirmPassword, ...userData } = formData;
    const result = signup(userData);
    if (result.success) { toast.success('Account created!'); navigate('/'); }
    else toast.error(result.message);
  };

  const Field = ({ label, name, type = 'text', placeholder, half }) => (
    <div className={half ? 'col-md-6' : 'col-12'}>
      <label className="form-label">{label}</label>
      <input type={type} name={name} className="form-control" placeholder={placeholder} value={formData[name]} onChange={handleChange} />
    </div>
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '2rem 0' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-7">
            <div className="fitgear-card p-5">
              <div className="text-center mb-4">
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--dark-blue), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <FaUserPlus style={{ color: '#fff', fontSize: '1.4rem' }} />
                </div>
                <h2 style={{ color: 'var(--navy)', marginBottom: '0.4rem' }}>Create Account</h2>
                <p style={{ color: 'var(--text-mid)', margin: 0, fontSize: '0.95rem' }}>Join FitGear to start your fitness journey</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <Field label="Full Name" name="name" placeholder="John Doe" />
                  <Field label="Email Address" name="email" type="email" placeholder="john@example.com" half />
                  <Field label="Mobile Number" name="mobile" type="tel" placeholder="9876543210" half />
                  <div className="col-12">
                    <label className="form-label">Delivery Address</label>
                    <textarea name="address" className="form-control" rows={2} placeholder="Enter your full address" value={formData.address} onChange={handleChange} />
                  </div>
                  <Field label="Password" name="password" type="password" placeholder="Min. 6 characters" half />
                  <Field label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat password" half />
                </div>
                <button type="submit" className="btn btn-primary w-100 py-2 mt-4">
                  Create Account
                </button>
              </form>

              <div className="text-center mt-4" style={{ color: 'var(--text-mid)', fontSize: '0.9rem' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
