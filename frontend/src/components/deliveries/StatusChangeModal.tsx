import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../common/Modal';
import { deliveryApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { Delivery, DeliveryStatus } from '../../types';
import { StatusBadge } from '../common/Badge';
import { ArrowRight, CheckCircle2, XCircle, PackageCheck, Truck, RefreshCw } from 'lucide-react';

interface StatusChangeModalProps {
  delivery: Delivery | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const TRANSITION_MAP: Record<DeliveryStatus, Array<{ status: DeliveryStatus; label: string; desc: string; icon: any }>> = {
  PENDING: [
    { status: 'ASSIGNED', label: 'Assigned', desc: 'Assign driver and prepare dispatch', icon: Truck },
    { status: 'CANCELLED', label: 'Cancelled', desc: 'Cancel this order', icon: XCircle },
  ],
  ASSIGNED: [
    { status: 'PICKED_UP', label: 'Picked Up', desc: 'Driver retrieved package from sender / hub', icon: PackageCheck },
    { status: 'CANCELLED', label: 'Cancelled', desc: 'Cancel this order before pickup', icon: XCircle },
  ],
  PICKED_UP: [
    { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Driver is currently en route to destination', icon: Truck },
  ],
  OUT_FOR_DELIVERY: [
    { status: 'DELIVERED', label: 'Delivered', desc: 'Successfully handed over to recipient', icon: CheckCircle2 },
    { status: 'FAILED', label: 'Failed', desc: 'Delivery attempt failed (unreachable / wrong address)', icon: XCircle },
  ],
  FAILED: [
    { status: 'OUT_FOR_DELIVERY', label: 'Retry (Out for Delivery)', desc: 'Re-attempt delivery to recipient', icon: RefreshCw },
  ],
  DELIVERED: [],
  CANCELLED: [],
};

export const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  delivery,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<DeliveryStatus | null>(null);
  const [note, setNote] = useState('');

  const changeMutation = useMutation({
    mutationFn: ({ status, note }: { status: string; note: string }) => {
      if (!delivery) throw new Error('No delivery selected');
      return deliveryApi.changeStatus(delivery.id, status, note);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['delivery', delivery?.id] });
      queryClient.invalidateQueries({ queryKey: ['deliveryHistory', delivery?.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
      success('Status Updated', `Delivery #${updated.deliveryNumber} status changed to ${updated.status}.`);
      onClose();
      setSelectedStatus(null);
      setNote('');
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      error('Status Update Failed', err.response?.data?.message || 'Could not update status');
    },
  });

  if (!delivery) return null;

  const validTransitions = TRANSITION_MAP[delivery.status] || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) {
      error('Status Required', 'Please select a new status.');
      return;
    }
    changeMutation.mutate({ status: selectedStatus, note });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Delivery Status"
      subtitle={`Change state for Order #${delivery.deliveryNumber}`}
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit}>
        {/* Current Status Box */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#f8fafc',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            marginBottom: '16px',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              Current Status
            </div>
            <div style={{ marginTop: '4px' }}>
              <StatusBadge status={delivery.status} size="md" />
            </div>
          </div>
          <ArrowRight size={18} color="#94a3b8" />
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              Destination
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginTop: '4px' }}>
              {delivery.city}
            </div>
          </div>
        </div>

        {/* Valid Transitions list */}
        <label style={{ marginBottom: '8px' }}>Select New Status</label>
        {validTransitions.length === 0 ? (
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              color: '#64748b',
              fontSize: '13px',
              marginBottom: '16px',
            }}
          >
            This delivery is in terminal state ({delivery.status}). No further status transitions allowed.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {validTransitions.map((t) => {
              const isSelected = selectedStatus === t.status;
              const Icon = t.icon;
              return (
                <div
                  key={t.status}
                  onClick={() => setSelectedStatus(t.status)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? '#2563eb' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0f172a' }}>
                        {t.label}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {t.desc}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              );
            })}
          </div>
        )}

        {/* Transition Note */}
        {validTransitions.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <label>Internal Note / Reason (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Package collected at hub, customer verified phone"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selectedStatus || changeMutation.isPending || validTransitions.length === 0}
            className="btn-primary"
          >
            {changeMutation.isPending ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
