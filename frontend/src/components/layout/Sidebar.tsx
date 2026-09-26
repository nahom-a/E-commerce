import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  Activity,
  Settings,
  LogOut,
  Send,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/deliveries', label: 'Deliveries', icon: Package },
  { path: '/drivers', label: 'Drivers', icon: Truck },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/activity', label: 'Activity', icon: Activity },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      style={{
        width: '230px',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 30,
        borderRight: '1px solid #1e293b',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '20px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            backgroundColor: '#2563eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
          }}
        >
          <Send size={18} />
        </div>
        <div>
          <h1
            style={{
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '0.8px',
              margin: 0,
              color: '#ffffff',
            }}
          >
            DISPATCHDESK
          </h1>
          <span style={{ fontSize: '10.5px', color: '#94a3b8', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
            Logistics & Ops
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#64748b', padding: '0 10px 6px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '5px',
                color: isActive ? '#ffffff' : '#94a3b8',
                backgroundColor: isActive ? '#1e293b' : 'transparent',
                fontSize: '13.5px',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.15s ease',
                borderLeft: isActive ? '3px solid #2563eb' : '3px solid transparent',
              })}
            >
              <Icon size={17} style={{ opacity: 0.9 }} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer User Info */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#090d16',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ overflow: 'hidden' }}>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#f8fafc',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.name || 'User'}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: '#38bdf8',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
              }}
            >
              {user?.role || 'DRIVER'}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '7px 12px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            color: '#cbd5e1',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '5px',
            fontSize: '12.5px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.2)';
            e.currentTarget.style.color = '#fca5a5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.color = '#cbd5e1';
          }}
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};