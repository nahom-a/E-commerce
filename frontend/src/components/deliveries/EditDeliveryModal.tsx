import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../common/Modal';
import { deliveryApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { CreateDeliveryPayload, Delivery } from '../../types';

interface EditDeliveryModalProps {
  delivery: Delivery | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ADDIS_NEIGHBORHOODS = [
  'Bole',
  'Kazanchis',
  'CMC',
  'Saris',
  'Gerji',
  'Piassa',
  'Megenagna',
  'Yeka',
  'Mexico',
  'Old Airport',
  'Gotera',
  'Bole Medhanialem',
  'Atlas',
  'Sarbet',
  'Tor Hailoch',
];

export const EditDeliveryModal: React.FC<EditDeliveryModalProps> = ({
  delivery,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const [formData, setFormData] = useState<Partial<CreateDeliveryPayload>>({
    recipientName: '',
    recipientPhone: '',
    address: '',
    city: 'Bole',
    packageDescription: '',
    packageSize: 'MEDIUM',
    priority: 'NORMAL',
  });

  useEffect(() => {
    if (delivery) {
      setFormData({
        recipientName: delivery.recipientName,
        recipientPhone: delivery.recipientPhone,
        address: delivery.address,
        city: delivery.city,
        packageDescription: delivery.packageDescription,
        packageSize: (delivery.packageSize as string) || 'MEDIUM',
        priority: delivery.priority || 'NORMAL',
      });
    }
  }, [delivery]);

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<CreateDeliveryPayload>) => {
      if (!delivery) throw new Error('No delivery selected');
      return deliveryApi.update(delivery.id, payload);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['delivery', delivery?.id] });
      success('Delivery Updated', `Order #${updated.deliveryNumber} updated successfully.`);
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      error('Update Failed', err.response?.data?.message || 'Could not update delivery');
    },
  });

  if (!delivery) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Delivery"
      subtitle={`Update details for Order #${delivery.deliveryNumber}`}
      maxWidth="560px"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div>
            <label>Recipient Name *</label>
            <input
              type="text"
              required
              value={formData.recipientName || ''}
              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label>Recipient Phone *</label>
            <input
              type="tel"
              required
              value={formData.recipientPhone || ''}
              onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label>Delivery Address *</label>
            <input
              type="text"
              required
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label>Area / Neighborhood</label>
            <select
              value={formData.city || 'Bole'}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              style={{ width: '100%' }}
            >
              {ADDIS_NEIGHBORHOODS.map((area) => (
                <option key={area} value={area}>
                  {area}, Addis Ababa
                </option>
              ))}
            </select>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label>Package Description *</label>
            <input
              type="text"
              required
              value={formData.packageDescription || ''}
              onChange={(e) => setFormData({ ...formData, packageDescription: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label>Package Size</label>
            <select
              value={formData.packageSize || 'MEDIUM'}
              onChange={(e) => setFormData({ ...formData, packageSize: e.target.value })}
              style={{ width: '100%' }}
            >
              <option value="SMALL">Small</option>
              <option value="MEDIUM">Medium</option>
              <option value="LARGE">Large</option>
              <option value="EXTRA_LARGE">Extra Large</option>
            </select>
          </div>

          <div>
            <label>Priority</label>
            <select
              value={formData.priority || 'NORMAL'}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              style={{ width: '100%' }}
            >
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={updateMutation.isPending} className="btn-primary">
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
