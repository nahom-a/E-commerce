import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Modal } from '../common/Modal';
import { driverApi } from '../../api';
import { Delivery, Driver } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { useNavigate } from 'react-router-dom';

interface DriverDeliveriesModalProps {
  driver: Driver | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DriverDeliveriesModal: React.FC<DriverDeliveriesModalProps> = ({
  driver,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  const { data: deliveries, isLoading } = useQuery<Delivery[]>({
    queryKey: ['driverDeliveries', driver?.id],
    queryFn: () => (driver ? driverApi.getDeliveries(driver.id) : Promise.resolve([])),
    enabled: isOpen && !!driver,
  });

  if (!driver) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Deliveries for ${driver.userName || 'Driver #' + driver.id}`}
      subtitle={`${driver.vehicle} &bull; ${driver.phone}`}
      maxWidth="700px"
    >
      {isLoading ? (
        <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>Loading assignments...</div>
      ) : !deliveries || deliveries.length === 0 ? (
        <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
          No deliveries currently assigned to this driver.
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Delivery #</th>
                <th>Recipient</th>
                <th>Destination</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600, color: '#2563eb' }}>{d.deliveryNumber}</td>
                  <td style={{ fontWeight: 500 }}>{d.recipientName}</td>
                  <td style={{ color: '#475569' }}>{d.city || d.address}</td>
                  <td>
                    <PriorityBadge priority={d.priority} />
                  </td>
                  <td>
                    <StatusBadge status={d.status} />
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        onClose();
                        navigate(`/deliveries/${d.id}`);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563eb',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '12.5px',
                      }}
                    >
                      View &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #e2e8f0', marginTop: '16px' }}>
        <button type="button" onClick={onClose} className="btn-secondary">
          Close
        </button>
      </div>
    </Modal>
  );
};
