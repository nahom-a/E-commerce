import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../common/Modal';
import { customerApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { CreateCustomerPayload, Customer } from '../../types';

interface CustomerModalProps {
  customer?: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  customer,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const isEditing = !!customer;

  const [formData, setFormData] = useState<CreateCustomerPayload>({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        contactPerson: customer.contactPerson || '',
        phone: customer.phone,
        email: customer.email || '',
        address: customer.address || '',
        notes: customer.notes || '',
      });
    } else {
      setFormData({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
      });
    }
  }, [customer, isOpen]);

  const saveMutation = useMutation({
    mutationFn: (payload: CreateCustomerPayload) => {
      if (isEditing && customer) {
        return customerApi.update(customer.id, payload);
      }
      return customerApi.create(payload);
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', customer?.id] });
      success(
        isEditing ? 'Customer Updated' : 'Customer Added',
        `${saved.name} has been ${isEditing ? 'updated' : 'added'} successfully.`
      );
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      error('Operation Failed', err.response?.data?.message || 'Could not save customer');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      error('Required Fields', 'Business Name and Phone are required.');
      return;
    }
    saveMutation.mutate(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Customer' : 'Add New Customer'}
      subtitle={isEditing ? `Editing ${customer?.name}` : 'Register a new business or client account'}
      maxWidth="520px"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label>Business / Customer Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Mekdes Cafe & Roastery"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label>Contact Person</label>
            <input
              type="text"
              placeholder="e.g. Mekdes Tadesse"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label>Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="e.g. +251 91 123 4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. orders@mekdescafe.et"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label>Physical Address / Location</label>
            <input
              type="text"
              placeholder="e.g. Bole Sub-city, Near Medhanialem Mall"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label>Internal Notes / Remarks</label>
            <textarea
              rows={2}
              placeholder="Special delivery instructions, key contacts..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={saveMutation.isPending} className="btn-primary">
            {saveMutation.isPending ? 'Saving...' : isEditing ? 'Update Customer' : 'Add Customer'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
