import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../common/Modal';
import { deliveryApi, driverApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Delivery, Driver } from '../../types';
import { DriverStatusBadge } from '../common/Badge';
import { Truck, Check } from 'lucide-react';

interface AssignDriverModalProps {
  delivery: Delivery | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AssignDriverModal: React.FC<AssignDriverModalProps> = ({
  delivery,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const [selectedDriverId, setSelectedDriverId] = useState<number | null>(null);

  const { data: driversData, isLoading } = useQuery<{ content: Driver[] }>({
    queryKey: ['driversAssignList'],
    queryFn: () => driverApi.getAll({ size: 100 }),
    enabled: isOpen,
  });

  const assignMutation = useMutation({
    mutationFn: (driverId: number) => {
      if (!delivery) throw new Error('No delivery selected');
      return deliveryApi.assignDriver(delivery.id, driverId);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['delivery', delivery?.id] });
      queryClient.invalidateQueries({ queryKey: ['deliveryHistory', delivery?.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      success('Driver Assigned', `Delivery #${updated.deliveryNumber} has been assigned.`);
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      error('Assignment Failed', err.response?.data?.message || 'Could not assign driver');
    },
  });

  if (!delivery) return null;

  const drivers = driversData?.content || [];

  const handleAssign = () => {
    if (!selectedDriverId) {
      error('Selection Required', 'Please select a driver from the list.');
      return;
    }
    assignMutation.mutate(selectedDriverId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Driver"
      subtitle={`Select a driver for Delivery #${delivery.deliveryNumber}`}
      maxWidth="500px"
    >
      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
          Destination
        </div>
        <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>
          {delivery.recipientName} &bull; {delivery.address} ({delivery.city})
        </div>
        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
          Pkg: {delivery.packageDescription} ({delivery.packageSize || 'Medium'})
        </div>
      </div>

      <label style={{ marginBottom: '8px' }}>Available Drivers</label>

      {isLoading ? (
        <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>Loading drivers...</div>
      ) : drivers.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
          No drivers registered in system.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
          {drivers.map((driver) => {
            const isOffline = driver.status === 'OFFLINE';
            const isSelected = selectedDriverId === driver.id;
            const isCurrent = delivery.driverId === driver.id;

            return (
              <div
                key={driver.id}
                onClick={() => {
                  if (!isOffline) setSelectedDriverId(driver.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#eff6ff' : isOffline ? '#f8fafc' : '#ffffff',
                  opacity: isOffline ? 0.6 : 1,
                  cursor: isOffline ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#2563eb' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Truck size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{driver.userName}</span>
                      {isCurrent && (
                        <span style={{ fontSize: '10.5px', padding: '1px 6px', backgroundColor: '#e2e8f0', borderRadius: '3px', color: '#475569' }}>
                          Current
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {driver.vehicle} &bull; {driver.phone} &bull; {driver.activeDeliveries} active loads
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <DriverStatusBadge status={driver.status} />
                  {isSelected && <Check size={18} color="#2563eb" />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', marginTop: '16px' }}>
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleAssign}
          disabled={!selectedDriverId || assignMutation.isPending}
          className="btn-primary"
        >
          {assignMutation.isPending ? 'Assigning...' : 'Confirm Assignment'}
        </button>
      </div>
    </Modal>
  );
};
