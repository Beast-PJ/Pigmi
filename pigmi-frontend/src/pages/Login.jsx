import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await api.signInWithFirebase(email, password);
      localStorage.setItem('email', email); // dev only
      localStorage.setItem('password', password); // dev only
      nav('/dashboard');
      window.location.reload();
    } catch (error) {
      setErr(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card stat-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to continue to your dashboard</p>

        <form onSubmit={onSubmit} className="login-form">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn-primary full-width"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {err && <div className="error-msg">{err}</div>}

        <p className="login-note">
          <strong>Note:</strong> Password is stored locally for this demo. Use
          HTTPS in production and remove local password storage.
        </p>
      </div>
    </div>
  );
}
