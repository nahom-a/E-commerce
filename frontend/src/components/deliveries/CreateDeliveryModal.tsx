import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../common/Modal';
import { customerApi, deliveryApi, driverApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { CreateDeliveryPayload, Customer, Driver } from '../../types';

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

interface CreateDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateDeliveryModal: React.FC<CreateDeliveryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const [formData, setFormData] = useState<CreateDeliveryPayload>({
    customerId: undefined,
    recipientName: '',
    recipientPhone: '',
    address: '',
    city: 'Bole',
    packageDescription: '',
    packageSize: 'MEDIUM',
    priority: 'NORMAL',
    scheduledDate: '',
    driverId: undefined,
  });

  const { data: customersData } = useQuery<{ content: Customer[] }>({
    queryKey: ['customersDropdown'],
    queryFn: () => customerApi.getAll({ size: 100 }),
    enabled: isOpen,
  });

  const { data: driversData } = useQuery<{ content: Driver[] }>({
    queryKey: ['driversDropdown'],
    queryFn: () => driverApi.getAll({ size: 100 }),
    enabled: isOpen,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateDeliveryPayload) => deliveryApi.create(payload),
    onSuccess: (newDelivery) => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      success('Delivery Created', `Order #${newDelivery.deliveryNumber} has been scheduled successfully.`);
      onClose();
      if (onSuccess) onSuccess();
      // Reset form
      setFormData({
        customerId: undefined,
        recipientName: '',
        recipientPhone: '',
        address: '',
        city: 'Bole',
        packageDescription: '',
        packageSize: 'MEDIUM',
        priority: 'NORMAL',
        scheduledDate: '',
        driverId: undefined,
      });
    },
    onError: (err: any) => {
      error('Creation Failed', err.response?.data?.message || 'Could not create delivery');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipientName.trim() || !formData.recipientPhone.trim() || !formData.address.trim() || !formData.packageDescription.trim()) {
      error('Missing Fields', 'Please fill in all required recipient and package details.');
      return;
    }

    const payload: CreateDeliveryPayload = {
      ...formData,
      customerId: formData.customerId ? Number(formData.customerId) : undefined,
      driverId: formData.driverId ? Number(formData.driverId) : undefined,
      scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate).toISOString() : null,
    };

    createMutation.mutate(payload);
  };

  const customers = customersData?.content || [];
  const drivers = (driversData?.content || []).filter((d) => d.status !== 'OFFLINE');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Delivery" subtitle="Schedule and dispatch a new order" maxWidth="600px">
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          {/* Customer */}
          <div style={{ gridColumn: 'span 2' }}>
            <label>Customer / Business (Optional)</label>
            <select
              value={formData.customerId || ''}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value ? Number(e.target.value) : undefined })}
              style={{ width: '100%' }}
            >
              <option value="">-- One-off / Direct Customer --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.contactPerson || c.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Recipient Name */}
          <div>
            <label>Recipient Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Mekdes Tadesse"
              value={formData.recipientName}
              onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          {/* Recipient Phone */}
          <div>
            <label>Recipient Phone *</label>
            <input
              type="tel"
              required
              placeholder="e.g. +251 91 123 4567"
              value={formData.recipientPhone}
              onChange={(e) => setFormData({ ...formData, recipientPhone: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          {/* Street Address */}
          <div>
            <label>Delivery Address / Street *</label>
            <input
              type="text"
              required
              placeholder="e.g. Near Edna Mall, House 412"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          {/* Neighborhood / City */}
          <div>
            <label>Area / Neighborhood *</label>
            <select
              value={formData.city}
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

          {/* Package Description */}
          <div style={{ gridColumn: 'span 2' }}>
            <label>Package Description *</label>
            <input
              type="text"
              required
              placeholder="e.g. 2x Bags of Roasted Coffee Beans"
              value={formData.packageDescription}
              onChange={(e) => setFormData({ ...formData, packageDescription: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          {/* Package Size */}
          <div>
            <label>Package Size</label>
            <select
              value={formData.packageSize}
              onChange={(e) => setFormData({ ...formData, packageSize: e.target.value })}
              style={{ width: '100%' }}
            >
              <option value="SMALL">Small (Envelope / Pouch)</option>
              <option value="MEDIUM">Medium (Shoebox / Bag)</option>
              <option value="LARGE">Large (Box / Crate)</option>
              <option value="EXTRA_LARGE">Extra Large (Pallet / Bulk)</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label>Delivery Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              style={{ width: '100%' }}
            >
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent (Rush)</option>
            </select>
          </div>

          {/* Initial Driver Assignment */}
          <div>
            <label>Assign Driver (Optional)</label>
            <select
              value={formData.driverId || ''}
              onChange={(e) => setFormData({ ...formData, driverId: e.target.value ? Number(e.target.value) : undefined })}
              style={{ width: '100%' }}
            >
              <option value="">-- Unassigned (Assign Later) --</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.userName} ({d.vehicle} - {d.status.replace(/_/g, ' ')})
                </option>
              ))}
            </select>
          </div>

          {/* Scheduled Date */}
          <div>
            <label>Scheduled Delivery Time</label>
            <input
              type="datetime-local"
              value={formData.scheduledDate || ''}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={createMutation.isPending} className="btn-primary">
            {createMutation.isPending ? 'Creating...' : 'Create Delivery'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
