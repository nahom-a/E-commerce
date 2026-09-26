import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deliveryApi } from '../../api';
import { useAuth } from '../../hooks/useAuth';
import DeliveryTable from '../../components/deliveries/DeliveryTable';
import StatusTimeline from '../../components/deliveries/StatusTimeline';
import { Delivery, DeliveryStatusHistory, PageResponse } from '../../types';

const DeliveryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const deliveryId = Number(id);

  const { data: deliveryData, isLoading } = useQuery<Delivery>({
    queryKey: ['delivery', deliveryId],
    queryFn: () => deliveryApi.getById(deliveryId).then((r) => r.data.data),
  });

  const { data: historyData } = useQuery<DeliveryStatusHistory[]>({
    queryKey: ['deliveryHistory', deliveryId],
    queryFn: () => deliveryApi.getHistory(deliveryId).then((r) => r.data.data),
  });

  const assignMutation = useMutation({
    mutationFn: (driverId: number) => deliveryApi.assignDriver(deliveryId, driverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery', deliveryId] });
      queryClient.invalidateQueries({ queryKey: ['deliveryHistory', deliveryId] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => deliveryApi.changeStatus(deliveryId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery', deliveryId] });
      queryClient.invalidateQueries({ queryKey: ['deliveryHistory', deliveryId] });
    },
  });

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Loading...</div>;
  if (!deliveryData) return <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Delivery not found</div>;

  const d = deliveryData;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Delivery #{d.deliveryNumber}</h1>
          <span style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 500,
            backgroundColor: d.status === 'DELIVERED' ? '#e6f4ea' : d.status === 'FAILED' ? '#fce8e6' : '#f0f0f0',
            color: d.status === 'DELIVERED' ? '#137333' : d.status === 'FAILED' ? '#c5221f' : '#666',
          }}>
            {d.status.replace(/_/g, ' ')}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              const driverId = prompt('Enter driver ID:');
              if (driverId) assignMutation.mutate(Number(driverId));
            }}
            style={{ padding: '8px 12px', backgroundColor: '#4a90d9', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '13px' }}
          >
            Assign driver
          </button>
          <button
            onClick={() => {
              const status = prompt('Enter new status (PICKED_UP, OUT_FOR_DELIVERY, DELIVERED, FAILED):');
              if (status) statusMutation.mutate(status);
            }}
            style={{ padding: '8px 12px', backgroundColor: '#5cb85c', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '13px' }}
          >
            Change status
          </button>
          <button
            onClick={() => navigate('/deliveries')}
            style={{ padding: '8px 12px', backgroundColor: '#f0f0f0', color: '#333', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
          >
            Back
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
        <div style={{ flex: 1, backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', padding: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Delivery Information</h3>
          <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
            <InfoRow label="Customer" value={d.customerName} />
            <InfoRow label="Recipient" value={d.recipientName} />
            <InfoRow label="Phone" value={d.recipientPhone} />
            <InfoRow label="Address" value={`${d.address}${d.city ? ', ' + d.city : ''}`} />
            <InfoRow label="Package" value={d.packageDescription} />
            <InfoRow label="Priority" value={d.priority} />
            <InfoRow label="Created" value={new Date(d.createdAt).toLocaleString()} />
            <InfoRow label="Scheduled" value={d.scheduledDate ? new Date(d.scheduledDate).toLocaleString() : '-'} />
          </div>
        </div>
        <div style={{ flex: 1, backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', padding: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Driver Information</h3>
          {d.driverId ? (
            <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
              <InfoRow label="Name" value={d.driverName || 'N/A'} />
              <InfoRow label="Vehicle" value="N/A" />
              <InfoRow label="Status" value="Assigned" />
            </div>
          ) : (
            <p style={{ color: '#999', fontSize: '13px' }}>No driver assigned</p>
          )}
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', padding: '16px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Status History</h3>
        <StatusTimeline history={historyData || []} />
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: 'flex', gap: '8px' }}>
    <span style={{ color: '#999', minWidth: '100px' }}>{label}:</span>
    <span style={{ fontWeight: 500 }}>{value}</span>
  </div>
);

export default DeliveryDetailPage;