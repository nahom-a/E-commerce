import React from 'react';
import { Delivery } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { UserCheck, Edit3, ArrowRightCircle, XCircle, Eye, Truck } from 'lucide-react';

interface DeliveryTableProps {
  deliveries: Delivery[];
  onView: (id: number) => void;
  onAssign?: (delivery: Delivery) => void;
  onStatusChange?: (delivery: Delivery) => void;
  onEdit?: (delivery: Delivery) => void;
  onCancel?: (delivery: Delivery) => void;
  emptyMessage?: string;
}

export const DeliveryTable: React.FC<DeliveryTableProps> = ({
  deliveries,
  onView,
  onAssign,
  onStatusChange,
  onEdit,
  onCancel,
  emptyMessage = 'No deliveries found.',
}) => {
  if (deliveries.length === 0) {
    return (
      <div
        style={{
          padding: '48px 24px',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
        }}
      >
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
          {emptyMessage}
        </p>
        <p style={{ fontSize: '12.5px', color: '#64748b' }}>
          Try adjusting your search criteria or create a new delivery order.
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Customer</th>
            <th>Recipient & Address</th>
            <th>Package</th>
            <th>Driver</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Time</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((d) => {
            const isTerminal = d.status === 'DELIVERED' || d.status === 'CANCELLED';
            const canCancel = d.status === 'PENDING' || d.status === 'ASSIGNED';

            return (
              <tr key={d.id}>
                {/* Delivery Number */}
                <td style={{ fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
                  <button
                    onClick={() => onView(d.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563eb',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '13px',
                      padding: 0,
                    }}
                  >
                    #{d.deliveryNumber}
                  </button>
                </td>

                {/* Customer */}
                <td style={{ color: '#334155', fontWeight: 500 }}>
                  {d.customerName ? (
                    <span style={{ color: '#0f172a', fontWeight: 600 }}>{d.customerName}</span>
                  ) : (
                    <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Direct Order</span>
                  )}
                </td>

                {/* Recipient & Destination */}
                <td>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{d.recipientName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {d.address} {d.city ? `(${d.city})` : ''}
                  </div>
                </td>

                {/* Package */}
                <td>
                  <div style={{ fontSize: '12.5px', color: '#334155', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {d.packageDescription}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'capitalize' }}>
                    {d.packageSize ? d.packageSize.toLowerCase().replace('_', ' ') : 'Standard'}
                  </div>
                </td>

                {/* Driver */}
                <td>
                  {d.driverName ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', fontWeight: 500, color: '#0f172a' }}>
                      <Truck size={13} color="#2563eb" />
                      <span>{d.driverName}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAssign && onAssign(d)}
                      style={{
                        padding: '3px 8px',
                        backgroundColor: '#f1f5f9',
                        color: '#2563eb',
                        border: '1px dashed #93c5fd',
                        borderRadius: '4px',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <UserCheck size={12} />
                      <span>Assign</span>
                    </button>
                  )}
                </td>

                {/* Priority */}
                <td>
                  <PriorityBadge priority={d.priority} />
                </td>

                {/* Status */}
                <td>
                  <StatusBadge status={d.status} />
                </td>

                {/* Time */}
                <td style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>
                  {new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>

                {/* Actions */}
                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      title="View Details"
                      onClick={() => onView(d.id)}
                      style={{
                        padding: '5px 8px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        color: '#334155',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                    >
                      <Eye size={13} />
                      <span>View</span>
                    </button>

                    {onStatusChange && !isTerminal && (
                      <button
                        title="Update Status"
                        onClick={() => onStatusChange(d)}
                        style={{
                          padding: '5px 8px',
                          backgroundColor: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: '4px',
                          color: '#1d4ed8',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        <ArrowRightCircle size={13} />
                        <span>Status</span>
                      </button>
                    )}

                    {onEdit && !isTerminal && (
                      <button
                        title="Edit Delivery"
                        onClick={() => onEdit(d)}
                        style={{
                          padding: '5px 6px',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px',
                          color: '#475569',
                          cursor: 'pointer',
                        }}
                      >
                        <Edit3 size={13} />
                      </button>
                    )}

                    {onCancel && canCancel && (
                      <button
                        title="Cancel Order"
                        onClick={() => onCancel(d)}
                        style={{
                          padding: '5px 6px',
                          backgroundColor: '#fef2f2',
                          border: '1px solid #fecaca',
                          borderRadius: '4px',
                          color: '#dc2626',
                          cursor: 'pointer',
                        }}
                      >
                        <XCircle size={13} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryTable;