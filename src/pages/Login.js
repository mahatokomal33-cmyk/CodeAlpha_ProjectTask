import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Login to GPM Collection</h1>
          <p>Get access to your Orders, Wishlist and Recommendations</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password" />
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="auth-divider"><span>OR</span></div>
        <div className="social-logins">
          <a href="http://localhost:5000/api/auth/google" className="social-btn google">
            <span>G</span> Continue with Google
          </a>
          <a href="http://localhost:5000/api/auth/facebook" className="social-btn facebook">
            <span>f</span> Continue with Facebook
          </a>
        </div>
        <div className="auth-footer">
          New to GPM Collection? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
