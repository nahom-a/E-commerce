import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api';
import { useToast } from '../context/ToastContext';
import { User, Shield, Server, Check, Key } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, setUser } = useAuth();
  const { success, error } = useToast();

  const handleQuickSwitch = async (email: string) => {
    try {
      const data = await authApi.login(email, 'password123');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      success('Account Switched', `Now logged in as ${data.user.name} (${data.user.role})`);
    } catch (err: any) {
      error('Switch Failed', 'Could not switch accounts.');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          Settings & Configuration
        </h1>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '3px 0 0 0' }}>
          User account profile, role permissions, and system environment
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Profile Card */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <User size={18} color="#2563eb" />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              User Profile
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
            <div>
              <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Full Name</span>
              <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{user?.name || '-'}</div>
            </div>

            <div>
              <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Email Address</span>
              <div style={{ color: '#0f172a', marginTop: '2px' }}>{user?.email || '-'}</div>
            </div>

            <div>
              <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>System Role</span>
              <div style={{ marginTop: '4px' }}>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    border: '1px solid #bfdbfe',
                  }}
                >
                  {user?.role || 'GUEST'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Demo Switcher */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Key size={18} color="#2563eb" />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Demo Account Switcher
            </h3>
          </div>

          <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '14px' }}>
            Quickly test DispatchDesk under different role permissions:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => handleQuickSwitch('admin@dispatchdesk.local')}
              className="btn-secondary"
              style={{
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderColor: user?.email === 'admin@dispatchdesk.local' ? '#2563eb' : '#e2e8f0',
                backgroundColor: user?.email === 'admin@dispatchdesk.local' ? '#eff6ff' : '#ffffff',
              }}
            >
              <div>
                <strong>Admin User</strong> (admin@dispatchdesk.local)
              </div>
              {user?.email === 'admin@dispatchdesk.local' && <Check size={16} color="#2563eb" />}
            </button>

            <button
              onClick={() => handleQuickSwitch('dispatcher@dispatchdesk.local')}
              className="btn-secondary"
              style={{
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderColor: user?.email === 'dispatcher@dispatchdesk.local' ? '#2563eb' : '#e2e8f0',
                backgroundColor: user?.email === 'dispatcher@dispatchdesk.local' ? '#eff6ff' : '#ffffff',
              }}
            >
              <div>
                <strong>Dispatcher User</strong> (dispatcher@dispatchdesk.local)
              </div>
              {user?.email === 'dispatcher@dispatchdesk.local' && <Check size={16} color="#2563eb" />}
            </button>

            <button
              onClick={() => handleQuickSwitch('driver1@dispatchdesk.local')}
              className="btn-secondary"
              style={{
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderColor: user?.email === 'driver1@dispatchdesk.local' ? '#2563eb' : '#e2e8f0',
                backgroundColor: user?.email === 'driver1@dispatchdesk.local' ? '#eff6ff' : '#ffffff',
              }}
            >
              <div>
                <strong>Driver One</strong> (driver1@dispatchdesk.local)
              </div>
              {user?.email === 'driver1@dispatchdesk.local' && <Check size={16} color="#2563eb" />}
            </button>
          </div>
        </div>

        {/* Permissions Overview */}
        <div className="card" style={{ padding: '20px', gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Shield size={18} color="#2563eb" />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Role Capabilities Matrix
            </h3>
          </div>

          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Capability</th>
                  <th>ADMIN</th>
                  <th>DISPATCHER</th>
                  <th>DRIVER</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>View Overview & KPIs</td>
                  <td><Check size={16} color="#059669" /></td>
                  <td><Check size={16} color="#059669" /></td>
                  <td><Check size={16} color="#059669" /></td>
                </tr>
                <tr>
                  <td>Create / Edit Deliveries</td>
                  <td><Check size={16} color="#059669" /></td>
                  <td><Check size={16} color="#059669" /></td>
                  <td style={{ color: '#94a3b8' }}>-</td>
                </tr>
                <tr>
                  <td>Assign & Reassign Drivers</td>
                  <td><Check size={16} color="#059669" /></td>
                  <td><Check size={16} color="#059669" /></td>
                  <td style={{ color: '#94a3b8' }}>-</td>
                </tr>
                <tr>
                  <td>Update Delivery Status</td>
                  <td><Check size={16} color="#059669" /></td>
                  <td><Check size={16} color="#059669" /></td>
                  <td><Check size={16} color="#059669" /></td>
                </tr>
                <tr>
                  <td>Manage Drivers & Fleet</td>
                  <td><Check size={16} color="#059669" /></td>
                  <td><Check size={16} color="#059669" /></td>
                  <td style={{ color: '#94a3b8' }}>-</td>
                </tr>
                <tr>
                  <td>Audit Trail & Logs</td>
                  <td><Check size={16} color="#059669" /></td>
                  <td><Check size={16} color="#059669" /></td>
                  <td style={{ color: '#94a3b8' }}>-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;