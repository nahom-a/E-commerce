import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { path: '/dashboard', label: 'Overview', icon: '📊' },
  { path: '/deliveries', label: 'Deliveries', icon: '📦' },
  { path: '/drivers', label: 'Drivers', icon: '🚛' },
  { path: '/customers', label: 'Customers', icon: '👥' },
  { path: '/activity', label: 'Activity', icon: '📋' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside style={{
      width: '240px',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      backgroundColor: '#1a1a2e',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 0',
    }}>
      <div style={{ padding: '0 20px 30px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '1px' }}>DISPATCHDESK</h2>
      </div>
      <nav style={{ flex: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 20px',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
              backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderLeft: isActive ? '3px solid #4a90d9' : '3px solid transparent',
              fontSize: '14px',
              fontWeight: isActive ? 600 : 400,
              transition: 'all 0.15s',
            })}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
          {user?.name || 'User'}
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '12px' }}>
          {user?.role}
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '4px',
            fontSize: '13px',
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;