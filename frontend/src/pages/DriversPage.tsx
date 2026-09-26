import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driverApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import { Driver } from '../../types';
import { DriverDTO } from '../../types';

const DriversPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ phone: '', vehicle: '', licenseNumber: '', status: 'AVAILABLE' });

  const { data, isLoading } = useQuery<{ data: DriverDTO[] }>({
    queryKey: ['drivers'],
    queryFn: () => driverApi.getAll().then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => driverApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setShowForm(false);
      setFormData({ phone: '', vehicle: '', licenseNumber: '', status: 'AVAILABLE' });
    },
  });

  const handleSubmit = () => {
    if (!formData.phone || !formData.vehicle || !formData.licenseNumber) {
      alert('All fields are required.');
      return;
    }
    createMutation.mutate(formData);
  };

  const drivers = data?.data || [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Drivers</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>Manage your delivery team</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1a1a2e',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '13px',
          }}
        >
          + Add driver
        </button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', padding: '16px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Add New Driver</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <input
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              placeholder="Vehicle"
              value={formData.vehicle}
              onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
              style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              placeholder="License Number"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="AVAILABLE">Available</option>
              <option value="ON_DELIVERY">On Delivery</option>
              <option value="OFFLINE">Offline</option>
            </select>
          </div>
          <button
            onClick={handleSubmit}
            style={{
              padding: '8px 16px',
              backgroundColor: '#5cb85c',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
            }}
          >
            Save
          </button>
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Loading...</div>
      ) : (
        <div style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                {['Name', 'Phone', 'Vehicle', 'Status', 'Active Deliveries', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600, color: '#555', fontSize: '12px', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px 8px', fontWeight: 500 }}>{driver.userName || 'Driver'}</td>
                  <td style={{ padding: '10px 8px' }}>{driver.phone}</td>
                  <td style={{ padding: '10px 8px' }}>{driver.vehicle}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: driver.status === 'AVAILABLE' ? '#e6f4ea' : driver.status === 'ON_DELIVERY' ? '#fef3e2' : '#f0f0f0',
                      color: driver.status === 'AVAILABLE' ? '#137333' : driver.status === 'ON_DELIVERY' ? '#d97706' : '#666',
                    }}>
                      {driver.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '10px 8px' }}>{driver.activeDeliveries}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <button style={{ color: '#4a90d9', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DriversPage;