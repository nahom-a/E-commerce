import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { driverApi } from '../api';
import { DriverModal } from '../components/drivers/DriverModal';
import { DriverDeliveriesModal } from '../components/drivers/DriverDeliveriesModal';
import { DriverStatusBadge } from '../components/common/Badge';
import { Driver, PageResponse } from '../types';
import { Plus, Truck, Phone, CreditCard, Package, Edit2, List, Grid } from 'lucide-react';

export const DriversPage: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);
  const [viewDeliveriesDriver, setViewDeliveriesDriver] = useState<Driver | null>(null);

  const { data, isLoading } = useQuery<PageResponse<Driver>>({
    queryKey: ['drivers', selectedStatus],
    queryFn: () => driverApi.getAll(selectedStatus ? { status: selectedStatus, size: 50 } : { size: 50 }),
  });

  const drivers = data?.content || [];

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Drivers
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '3px 0 0 0' }}>
            Manage delivery personnel, vehicles, and active dispatch loads
          </p>
        </div>

        <button onClick={() => setIsAddOpen(true)} className="btn-primary">
          <Plus size={16} />
          <span>Add Driver</span>
        </button>
      </div>

      {/* Filter and View Toggle Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          backgroundColor: '#ffffff',
          padding: '12px 16px',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          {['', 'AVAILABLE', 'ON_DELIVERY', 'OFFLINE'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              style={{
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12.5px',
                fontWeight: selectedStatus === status ? 600 : 500,
                backgroundColor: selectedStatus === status ? '#2563eb' : '#f8fafc',
                color: selectedStatus === status ? '#ffffff' : '#475569',
                border: `1px solid ${selectedStatus === status ? '#2563eb' : '#e2e8f0'}`,
                cursor: 'pointer',
              }}
            >
              {status ? status.replace(/_/g, ' ') : 'All Drivers'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '6px 8px',
              borderRadius: '4px',
              backgroundColor: viewMode === 'grid' ? '#e2e8f0' : '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Grid size={15} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            style={{
              padding: '6px 8px',
              borderRadius: '4px',
              backgroundColor: viewMode === 'table' ? '#e2e8f0' : '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading drivers...</div>
      ) : drivers.length === 0 ? (
        <div style={{ padding: '48px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>No drivers found</p>
          <p style={{ fontSize: '12.5px', color: '#64748b' }}>Register a new driver to start dispatching orders.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="card"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '6px',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Truck size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                        {driver.userName}
                      </h3>
                      <span style={{ fontSize: '11.5px', color: '#64748b' }}>ID #{driver.id}</span>
                    </div>
                  </div>
                  <DriverStatusBadge status={driver.status} />
                </div>

                <div style={{ fontSize: '12.5px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px', margin: '14px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={14} color="#64748b" />
                    <span>{driver.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={14} color="#64748b" />
                    <span>{driver.vehicle}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={14} color="#64748b" />
                    <span>License: <strong>{driver.licenseNumber}</strong></span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  paddingTop: '12px',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <button
                  onClick={() => setViewDeliveriesDriver(driver)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#2563eb',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <Package size={14} />
                  <span>{driver.activeDeliveries} Active Load{driver.activeDeliveries === 1 ? '' : 's'}</span>
                </button>

                <button
                  onClick={() => setEditDriver(driver)}
                  className="btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                >
                  <Edit2 size={12} />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Driver Name</th>
                <th>Phone</th>
                <th>Vehicle Model</th>
                <th>License Plate</th>
                <th>Status</th>
                <th>Active Loads</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{d.userName}</td>
                  <td>{d.phone}</td>
                  <td>{d.vehicle}</td>
                  <td style={{ fontWeight: 500 }}>{d.licenseNumber}</td>
                  <td>
                    <DriverStatusBadge status={d.status} />
                  </td>
                  <td>
                    <button
                      onClick={() => setViewDeliveriesDriver(d)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563eb',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '12.5px',
                      }}
                    >
                      {d.activeDeliveries} orders
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => setEditDriver(d)}
                      className="btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                      <Edit2 size={12} />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <DriverModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />

      <DriverModal
        driver={editDriver}
        isOpen={!!editDriver}
        onClose={() => setEditDriver(null)}
      />

      <DriverDeliveriesModal
        driver={viewDeliveriesDriver}
        isOpen={!!viewDeliveriesDriver}
        onClose={() => setViewDeliveriesDriver(null)}
      />
    </div>
  );
};

export default DriversPage;