import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../../api';
import { DashboardStats } from '../../types';

const StatPanel: React.FC<{ label: string; value: number; color?: string }> = ({ label, value, color = '#4a90d9' }) => (
  <div style={{
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    padding: '16px',
    flex: 1,
  }}>
    <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
      {label}
    </div>
    <div style={{ fontSize: '24px', fontWeight: 700, color }}>
      {value}
    </div>
  </div>
);

const StatsRow: React.FC<{ stats: DashboardStats }> = ({ stats }) => (
  <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
    <StatPanel label="Active Deliveries" value={stats.activeDeliveries} color="#4a90d9" />
    <StatPanel label="Pending Assignment" value={stats.pendingAssignment} color="#f0ad4e" />
    <StatPanel label="Out for Delivery" value={stats.outForDelivery} color="#5cb85c" />
    <StatPanel label="Delivered Today" value={stats.deliveredToday} color="#5cb85c" />
    <StatPanel label="Failed Today" value={stats.failedToday} color="#d9534f" />
  </div>
);

interface Props {
  stats: DashboardStats;
}

const DashboardContent: React.FC<Props> = ({ stats }) => (
  <div>
    <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Overview</h1>
    <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>Today's delivery operations</p>
    <StatsRow stats={stats} />
    <div style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', padding: '16px', marginBottom: '24px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Deliveries - Last 7 Days</h3>
      <SimpleChart data={stats.deliveriesLast7Days} />
    </div>
    <div style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', padding: '16px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Current Deliveries</h3>
      <p style={{ color: '#999', fontSize: '13px', marginBottom: '12px' }}>Sample data placeholder</p>
    </div>
  </div>
);

const SimpleChart: React.FC<{ data: Array<{ date: string; count: number }> }> = ({ data }) => {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px', paddingTop: '10px' }}>
      {data.map((d) => (
        <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{ fontSize: '11px', color: '#666' }}>{d.count}</div>
          <div style={{
            width: '100%',
            height: `${(d.count / max) * 80}px`,
            backgroundColor: '#4a90d9',
            borderRadius: '3px 3px 0 0',
            minHeight: d.count > 0 ? '4px' : '0',
          }} />
          <div style={{ fontSize: '10px', color: '#999' }}>{d.date}</div>
        </div>
      ))}
    </div>
  );
};

const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: () => dashboardApi.getStats().then((r) => r.data.data),
    staleTime: 30000,
  });
};

export { DashboardContent, useDashboardStats };