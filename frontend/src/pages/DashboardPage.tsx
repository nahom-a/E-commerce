import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../../api';
import { DashboardContent, useDashboardStats } from '../../components/dashboard/DashboardContent';
import DeliveryTable from '../../components/deliveries/DeliveryTable';
import { deliveryApi } from '../../api';
import { Delivery } from '../../types';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useDashboardStats();
  const { data: deliveriesData } = useQuery({
    queryKey: ['currentDeliveries'],
    queryFn: () => deliveryApi.getAll({ status: 'ASSIGNED', page: 0, size: 10 }).then((r) => r.data),
  });

  const deliveries = deliveriesData?.data as any;

  if (isLoading || !stats) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Loading...</div>;
  }

  return (
    <div>
      <DashboardContent stats={stats} />
      <div style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', padding: '16px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Current Deliveries</h3>
        <DeliveryTable
          deliveries={deliveries?.data || { content: [], page: 0, size: 0, totalElements: 0, totalPages: 0 }}
          onView={(id) => navigate(`/deliveries/${id}`)}
        />
      </div>
    </div>
  );
};

export default DashboardPage;