import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../hooks/useAuth';
import { Send, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@dispatchdesk.local');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLoginWithCredentials = async (loginEmail: string, loginPass: string) => {
    setError('');
    setIsLoading(true);
    try {
      const data = await authApi.login(loginEmail, loginPass);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLoginWithCredentials(email, password);
  };

  const setDemoCredentials = (role: 'admin' | 'dispatcher' | 'driver') => {
    const creds = {
      admin: { email: 'admin@dispatchdesk.local', pass: 'password123' },
      dispatcher: { email: 'dispatcher@dispatchdesk.local', pass: 'password123' },
      driver: { email: 'driver1@dispatchdesk.local', pass: 'password123' },
    }[role];
    setEmail(creds.email);
    setPassword(creds.pass);
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid #1e293b',
        }}
      >
        {/* Brand Top Banner */}
        <div
          style={{
            backgroundColor: '#090d16',
            padding: '28px 24px',
            textAlign: 'center',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
            }}
          >
            <Send size={22} />
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '1px', color: '#ffffff', margin: 0 }}>
            DISPATCHDESK
          </h1>
          <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Delivery Management & Fleet Dispatch System
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: '28px 24px' }}>
          {error && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                padding: '10px 12px',
                marginBottom: '16px',
                fontSize: '12.5px',
                color: '#b91c1c',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={16} color="#dc2626" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label>Work Email</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={15}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  required
                  placeholder="name@dispatchdesk.local"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', paddingLeft: '32px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={15}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', paddingLeft: '32px' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '10px',
                fontSize: '13.5px',
              }}
            >
              <span>{isLoading ? 'Signing in...' : 'Sign In to DispatchDesk'}</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '8px', textAlign: 'center' }}>
              Quick Demo Accounts
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setDemoCredentials('admin')}
                className="btn-secondary"
                style={{ fontSize: '11.5px', padding: '6px 8px', justifyContent: 'center' }}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('dispatcher')}
                className="btn-secondary"
                style={{ fontSize: '11.5px', padding: '6px 8px', justifyContent: 'center' }}
              >
                Dispatcher
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('driver')}
                className="btn-secondary"
                style={{ fontSize: '11.5px', padding: '6px 8px', justifyContent: 'center' }}
              >
                Driver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;