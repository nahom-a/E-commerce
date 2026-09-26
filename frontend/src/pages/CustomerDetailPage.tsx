import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { customerApi } from '../../api';
import { Customer } from '../../types';

interface Props {
  customerId: number;
}

const CustomerDetailPage: React.FC<Props> = ({ customerId }) => {
  const { data, isLoading } = useQuery<Customer>({
    queryKey: ['customer', customerId],
    queryFn: () => customerApi.getById(customerId).then((r) => r.data.data),
  });

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Loading...</div>;
  if (!data) return <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Customer not found</div>;

  return (
    <div>
      <button onClick={() => window.history.back()} style={{ marginBottom: '16px', color: '#4a90d9', background: 'none', border: 'none', cursor: 'pointer' }}>
        ← Back to customers
      </button>
      <div style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', padding: '16px', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px' }}>{data.name}</h1>
        <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
          <InfoRow label="Contact Person" value={data.contactPerson} />
          <InfoRow label="Phone" value={data.phone} />
          <InfoRow label="Email" value={data.email} />
          <InfoRow label="Address" value={data.address} />
          <InfoRow label="Notes" value={data.notes} />
          <InfoRow label="Member Since" value={new Date(data.createdAt).toLocaleDateString()} />
        </div>
      </div>
      <div style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', padding: '16px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Recent Deliveries</h3>
        <p style={{ color: '#999', fontSize: '13px' }}>Delivery history placeholder</p>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: 'flex', gap: '8px' }}>
    <span style={{ color: '#999', minWidth: '100px' }}>{label}:</span>
    <span style={{ fontWeight: 500 }}>{value || '-'}</span>
  </div>
);

export default CustomerDetailPage;