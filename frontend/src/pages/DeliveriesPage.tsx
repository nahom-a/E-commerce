import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { deliveryApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import DeliveryTable from '../../components/deliveries/DeliveryTable';
import { Delivery, PageResponse } from '../../types';

const DeliveriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ search: '', status: '', driverId: '' });
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery<PageResponse<Delivery>>({
    queryKey: ['deliveries', filters, page],
    queryFn: () => deliveryApi.getAll({ ...filters, page, size: 20 }).then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => deliveryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      navigate('/deliveries');
    },
  });

  const handleCreate = () => {
    const name = prompt('Enter recipient name:');
    const phone = prompt('Enter recipient phone:');
    const address = prompt('Enter delivery address:');
    const city = prompt('Enter city:');
    const pkgDesc = prompt('Enter package description:');
    const pkgSize = prompt('Enter package size (SMALL, MEDIUM, LARGE, EXTRA_LARGE):');
    const priority = prompt('Enter priority (NORMAL, HIGH, URGENT):') || 'NORMAL';

    if (!name || !phone || !address || !pkgDesc) {
      alert('Recipient name, phone, address, and package description are required.');
      return;
    }

    createMutation.mutate({
      recipientName: name,
      recipientPhone: phone,
      address,
      city,
      packageDescription: pkgDesc,
      packageSize: pkgSize || 'MEDIUM',
      priority,
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Deliveries</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>Manage delivery operations</p>
        </div>
        <button
          onClick={handleCreate}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1a1a2e',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          + New delivery
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '13px',
            width: '200px',
          }}
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '13px',
          }}
        >
          <option value="">All Status</option>
          {['PENDING', 'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED', 'CANCELLED'].map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Driver ID"
          value={filters.driverId}
          onChange={(e) => setFilters({ ...filters, driverId: e.target.value })}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '13px',
            width: '120px',
          }}
        />
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Loading...</div>
      ) : data ? (
        <DeliveryTable
          deliveries={data.data}
          onView={(id) => navigate(`/deliveries/${id}`)}
        />
      ) : null}
    </div>
  );
};

export default DeliveriesPage;