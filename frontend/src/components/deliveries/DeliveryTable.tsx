import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { deliveryApi } from '../../api';
import { Delivery, PageResponse } from '../../types';
import { useState } from 'react';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    PENDING: { bg: '#f0f0f0', text: '#666' },
    ASSIGNED: { bg: '#e8f0fe', text: '#1a73e8' },
    PICKED_UP: { bg: '#fef3e2', text: '#d97706' },
    OUT_FOR_DELIVERY: { bg: '#e6f4ea', text: '#137333' },
    DELIVERED: { bg: '#e6f4ea', text: '#137333' },
    FAILED: { bg: '#fce8e6', text: '#c5221f' },
    CANCELLED: { bg: '#f0f0f0', text: '#999' },
  };
  const c = colors[status] || colors.PENDING;
  return (
    <span style={{
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 500,
      backgroundColor: c.bg,
      color: c.text,
    }}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

interface Props {
  deliveries: PageResponse<Delivery>;
  onView: (id: number) => void;
}

const DeliveryTable: React.FC<Props> = ({ deliveries, onView }) => {
  if (deliveries.content.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
        <p>No deliveries found</p>
        <p style={{ fontSize: '13px' }}>Try changing your filters or create a new delivery.</p>
      </div>
    );
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
          {['ID', 'Customer', 'Recipient', 'Destination', 'Driver', 'Status', 'Created', 'Actions'].map((h) => (
            <th key={h} style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600, color: '#555', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {deliveries.content.map((d) => (
          <tr key={d.id} style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px 8px', fontWeight: 500 }}>{d.deliveryNumber}</td>
            <td style={{ padding: '10px 8px' }}>{d.customerName}</td>
            <td style={{ padding: '10px 8px' }}>{d.recipientName}</td>
            <td style={{ padding: '10px 8px' }}>{d.city}</td>
            <td style={{ padding: '10px 8px' }}>{d.driverName || '-'}</td>
            <td style={{ padding: '10px 8px' }}><StatusBadge status={d.status} /></td>
            <td style={{ padding: '10px 8px', color: '#666' }}>{new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
            <td style={{ padding: '10px 8px' }}>
              <button onClick={() => onView(d.id)} style={{ color: '#4a90d9', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DeliveryTable;