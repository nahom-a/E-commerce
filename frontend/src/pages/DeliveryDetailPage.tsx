import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deliveryApi, driverApi } from '../api';
import { StatusBadge, PriorityBadge, DriverStatusBadge } from '../components/common/Badge';
import { StatusTimeline } from '../components/deliveries/StatusTimeline';
import { EditDeliveryModal } from '../components/deliveries/EditDeliveryModal';
import { AssignDriverModal } from '../components/deliveries/AssignDriverModal';
import { StatusChangeModal } from '../components/deliveries/StatusChangeModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { Delivery, DeliveryStatusHistory, Driver } from '../types';
import {
  ArrowLeft,
  UserCheck,
  ArrowRightCircle,
  Edit3,
  XCircle,
  Truck,
  MapPin,
  Package,
  Calendar,
  Phone,
  User,
  Building,
} from 'lucide-react';

export const DeliveryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const deliveryId = Number(id);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  const { data: delivery, isLoading: isDeliveryLoading } = useQuery<Delivery>({
    queryKey: ['delivery', deliveryId],
    queryFn: () => deliveryApi.getById(deliveryId),
  });

  const { data: history } = useQuery<DeliveryStatusHistory[]>({
    queryKey: ['deliveryHistory', deliveryId],
    queryFn: () => deliveryApi.getHistory(deliveryId),
    enabled: !!delivery,
  });

  const { data: driverData } = useQuery<Driver>({
    queryKey: ['driver', delivery?.driverId],
    queryFn: () => (delivery?.driverId ? driverApi.getById(delivery.driverId) : Promise.reject('No driver')),
    enabled: !!delivery?.driverId,
  });

  const cancelMutation = useMutation({
    mutationFn: () => deliveryApi.cancel(deliveryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery', deliveryId] });
      queryClient.invalidateQueries({ queryKey: ['deliveryHistory', deliveryId] });
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      success('Order Cancelled', 'The delivery order has been cancelled.');
      setIsCancelConfirmOpen(false);
    },
    onError: (err: any) => {
      error('Cancellation Failed', err.response?.data?.message || 'Could not cancel delivery');
    },
  });

  if (isDeliveryLoading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading order details...</div>;
  }

  if (!delivery) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', fontWeight: 600, color: '#334155' }}>Delivery not found</p>
        <button onClick={() => navigate('/deliveries')} className="btn-secondary" style={{ marginTop: '12px' }}>
          Back to Deliveries
        </button>
      </div>
    );
  }

  const isTerminal = delivery.status === 'DELIVERED' || delivery.status === 'CANCELLED';
  const canCancel = delivery.status === 'PENDING' || delivery.status === 'ASSIGNED';

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '13px', color: '#64748b' }}>
        <button
          onClick={() => navigate('/deliveries')}
          style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
        >
          <ArrowLeft size={14} />
          <span>Deliveries</span>
        </button>
        <span>/</span>
        <span style={{ fontWeight: 600, color: '#0f172a' }}>#{delivery.deliveryNumber}</span>
      </div>

      {/* Header Banner */}
      <div
        className="card"
        style={{
          padding: '20px 24px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
            }}
          >
            <Package size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Delivery #{delivery.deliveryNumber}
              </h1>
              <StatusBadge status={delivery.status} size="md" />
              <PriorityBadge priority={delivery.priority} />
            </div>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 0 0' }}>
              Booked on {new Date(delivery.createdAt).toLocaleString()} &bull; Destination: {delivery.city || 'Addis Ababa'}
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!isTerminal && (
            <>
              <button onClick={() => setIsAssignOpen(true)} className="btn-secondary">
                <UserCheck size={14} />
                <span>{delivery.driverId ? 'Reassign Driver' : 'Assign Driver'}</span>
              </button>
              <button onClick={() => setIsStatusOpen(true)} className="btn-primary">
                <ArrowRightCircle size={14} />
                <span>Update Status</span>
              </button>
              <button onClick={() => setIsEditOpen(true)} className="btn-secondary" title="Edit details">
                <Edit3 size={14} />
              </button>
            </>
          )}

          {canCancel && (
            <button onClick={() => setIsCancelConfirmOpen(true)} className="btn-danger" title="Cancel Order">
              <XCircle size={14} />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '20px' }}>
        {/* Left Column: Order & Recipient Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Recipient Card */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} color="#2563eb" />
              <span>Recipient & Delivery Destination</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
              <div>
                <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Recipient Name</span>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{delivery.recipientName}</div>
              </div>

              <div>
                <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Phone Number</span>
                <div style={{ fontSize: '13.5px', fontWeight: 500, color: '#0f172a', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={13} color="#2563eb" />
                  <span>{delivery.recipientPhone}</span>
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Street Address & Area</span>
                <div style={{ fontSize: '13.5px', color: '#0f172a', marginTop: '2px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <MapPin size={15} color="#dc2626" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{delivery.address}</div>
                    <div style={{ color: '#64748b', fontSize: '12.5px' }}>{delivery.city}, Addis Ababa, Ethiopia</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Package Details Card */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={16} color="#2563eb" />
              <span>Package & Scheduling</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Package Description</span>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#0f172a', marginTop: '2px' }}>{delivery.packageDescription}</div>
              </div>

              <div>
                <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Package Size</span>
                <div style={{ fontSize: '13.5px', fontWeight: 500, color: '#0f172a', marginTop: '2px', textTransform: 'capitalize' }}>
                  {delivery.packageSize ? delivery.packageSize.toLowerCase().replace('_', ' ') : 'Standard Medium'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Scheduled Time</span>
                <div style={{ fontSize: '13px', color: '#0f172a', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={13} color="#64748b" />
                  <span>{delivery.scheduledDate ? new Date(delivery.scheduledDate).toLocaleString() : 'Standard ASAP'}</span>
                </div>
              </div>

              {delivery.customerName && (
                <div style={{ gridColumn: 'span 2', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Originating Business / Customer</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#2563eb', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building size={14} />
                    <span>{delivery.customerName}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Assigned Driver & Status History Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Driver Card */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={16} color="#2563eb" />
                <span>Assigned Driver</span>
              </h3>
              {!isTerminal && (
                <button
                  onClick={() => setIsAssignOpen(true)}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  {delivery.driverId ? 'Change' : 'Assign'}
                </button>
              )}
            </div>

            {delivery.driverId ? (
              <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                    {delivery.driverName || 'Driver #' + delivery.driverId}
                  </div>
                  {driverData && <DriverStatusBadge status={driverData.status} />}
                </div>

                <div style={{ fontSize: '12.5px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Vehicle: <strong style={{ color: '#334155' }}>{driverData?.vehicle || 'Delivery Van'}</strong></div>
                  <div>Phone: <strong style={{ color: '#334155' }}>{driverData?.phone || 'N/A'}</strong></div>
                  <div>Active Loads: <strong style={{ color: '#334155' }}>{driverData?.activeDeliveries || 1} orders</strong></div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 10px 0' }}>No driver allocated to this delivery yet.</p>
                <button onClick={() => setIsAssignOpen(true)} className="btn-primary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                  <UserCheck size={14} />
                  <span>Assign Now</span>
                </button>
              </div>
            )}
          </div>

          {/* Status History Timeline Card */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
              Status History & Audit Trail
            </h3>
            <StatusTimeline history={history || []} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditDeliveryModal
        delivery={delivery}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      <AssignDriverModal
        delivery={delivery}
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
      />

      <StatusChangeModal
        delivery={delivery}
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
      />

      <ConfirmDialog
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        onConfirm={() => cancelMutation.mutate()}
        title="Cancel Delivery Order"
        message={`Are you sure you want to cancel Order #${delivery.deliveryNumber}?`}
        confirmLabel="Yes, Cancel"
        isDestructive
        isLoading={cancelMutation.isPending}
      />
    </div>
  );
};

export default DeliveryDetailPage;