import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../common/Modal';
import { driverApi } from '../../api';
import { useToast } from '../../context/ToastContext';
import { CreateDriverPayload, Driver, DriverStatus } from '../../types';

interface DriverModalProps {
  driver?: Driver | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DriverModal: React.FC<DriverModalProps> = ({
  driver,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const isEditing = !!driver;

  const [formData, setFormData] = useState<CreateDriverPayload>({
    phone: '',
    vehicle: '',
    licenseNumber: '',
    status: 'AVAILABLE',
  });

  useEffect(() => {
    if (driver) {
      setFormData({
        phone: driver.phone,
        vehicle: driver.vehicle,
        licenseNumber: driver.licenseNumber,
        status: driver.status,
      });
    } else {
      setFormData({
        phone: '',
        vehicle: '',
        licenseNumber: '',
        status: 'AVAILABLE',
      });
    }
  }, [driver, isOpen]);

  const saveMutation = useMutation({
    mutationFn: (payload: CreateDriverPayload) => {
      if (isEditing && driver) {
        return driverApi.update(driver.id, payload);
      }
      return driverApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      queryClient.invalidateQueries({ queryKey: ['driver', driver?.id] });
      success(
        isEditing ? 'Driver Updated' : 'Driver Added',
        `Driver record has been ${isEditing ? 'updated' : 'registered'} successfully.`
      );
      onClose();
      if (onSuccess) onSuccess();
    },
    onError: (err: any) => {
      error('Operation Failed', err.response?.data?.message || 'Could not save driver');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone.trim() || !formData.vehicle.trim() || !formData.licenseNumber.trim()) {
      error('Required Fields', 'Phone, Vehicle, and License Plate are required.');
      return;
    }
    saveMutation.mutate(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Driver' : 'Add New Driver'}
      subtitle={isEditing ? `Editing driver profile` : 'Register a delivery team driver and vehicle'}
      maxWidth="480px"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div>
            <label>Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="e.g. +251 91 111 2222"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label>Driver Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as DriverStatus })}
              style={{ width: '100%' }}
            >
              <option value="AVAILABLE">Available</option>
              <option value="ON_DELIVERY">On Delivery</option>
              <option value="OFFLINE">Offline</option>
            </select>
          </div>

          <div>
            <label>Vehicle Model *</label>
            <input
              type="text"
              required
              placeholder="e.g. Toyota HiAce / Isuzu NPR"
              value={formData.vehicle}
              onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label>License Plate / Number *</label>
            <input
              type="text"
              required
              placeholder="e.g. 3-A12345 AA"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={saveMutation.isPending} className="btn-primary">
            {saveMutation.isPending ? 'Saving...' : isEditing ? 'Update Driver' : 'Add Driver'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
