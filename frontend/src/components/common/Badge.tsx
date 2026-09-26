import React from 'react';
import { DeliveryStatus, DriverStatus, Priority } from '../../types';

interface StatusBadgeProps {
  status: DeliveryStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const configs: Record<string, { bg: string; text: string; border: string; label: string }> = {
    PENDING: { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1', label: 'Pending' },
    ASSIGNED: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe', label: 'Assigned' },
    PICKED_UP: { bg: '#fffbeb', text: '#b45309', border: '#fde68a', label: 'Picked Up' },
    OUT_FOR_DELIVERY: { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe', label: 'Out for Delivery' },
    DELIVERED: { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0', label: 'Delivered' },
    FAILED: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', label: 'Failed' },
    CANCELLED: { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb', label: 'Cancelled' },
  };

  const config = configs[status] || configs.PENDING;
  const isSmall = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: isSmall ? '2px 8px' : '4px 10px',
        borderRadius: '4px',
        fontSize: isSmall ? '12px' : '13px',
        fontWeight: 600,
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
        whiteSpace: 'nowrap',
        letterSpacing: '0.2px',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: config.text,
          marginRight: '6px',
          display: 'inline-block',
        }}
      />
      {config.label}
    </span>
  );
};

interface DriverStatusBadgeProps {
  status: DriverStatus | string;
}

export const DriverStatusBadge: React.FC<DriverStatusBadgeProps> = ({ status }) => {
  const configs: Record<string, { bg: string; text: string; border: string; label: string }> = {
    AVAILABLE: { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0', label: 'Available' },
    ON_DELIVERY: { bg: '#fffbeb', text: '#b45309', border: '#fde68a', label: 'On Delivery' },
    OFFLINE: { bg: '#f1f5f9', text: '#64748b', border: '#cbd5e1', label: 'Offline' },
  };

  const config = configs[status] || configs.OFFLINE;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: config.text,
          marginRight: '6px',
          display: 'inline-block',
        }}
      />
      {config.label}
    </span>
  );
};

interface PriorityBadgeProps {
  priority: Priority | string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const configs: Record<string, { bg: string; text: string; border: string }> = {
    URGENT: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
    HIGH: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
    NORMAL: { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' },
    LOW: { bg: '#f8fafc', text: '#94a3b8', border: '#e2e8f0' },
  };

  const config = configs[priority] || configs.NORMAL;

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 6px',
        borderRadius: '3px',
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
      }}
    >
      {priority}
    </span>
  );
};
