import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { dashboardApi, deliveryApi, driverApi } from '../api';
import { StatCard } from '../components/dashboard/StatCard';
import { DeliveriesChart } from '../components/dashboard/DeliveriesChart';
import { DeliveryTable } from '../components/deliveries/DeliveryTable';
import { CreateDeliveryModal } from '../components/deliveries/CreateDeliveryModal';
import { AssignDriverModal } from '../components/deliveries/AssignDriverModal';
import { StatusChangeModal } from '../components/deliveries/StatusChangeModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { ActivityLog, DashboardStats, Delivery, Driver, PageResponse } from '../types';
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  Activity,
  Users,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [assignDelivery, setAssignDelivery] = useState<Delivery | null>(null);
  const [statusChangeDelivery, setStatusChangeDelivery] = useState<Delivery | null>(null);
  const [cancelDeliveryTarget, setCancelDeliveryTarget] = useState<Delivery | null>(null);

  // Queries
  const { data: stats, isLoading: isStatsLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: () => dashboardApi.getStats(),
    refetchInterval: 15000,
  });

  const { data: deliveriesData, isLoading: isDeliveriesLoading } = useQuery<PageResponse<Delivery>>({
    queryKey: ['activeDeliveriesDashboard'],
    queryFn: () => deliveryApi.getAll({ size: 8 }),
  });

  const { data: recentActivity } = useQuery<ActivityLog[]>({
    queryKey: ['dashboardActivity'],
    queryFn: () => dashboardApi.getActivity(),
  });

  const { data: driversData } = useQuery<{ content: Driver[] }>({
    queryKey: ['dashboardDrivers'],
    queryFn: () => driverApi.getAll({ size: 100 }),
  });

  // Cancel Mutation
  const cancelMutation = useMutation({
    mutationFn: (id: number) => deliveryApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeDeliveriesDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      success('Order Cancelled', 'The delivery order has been cancelled.');
      setCancelDeliveryTarget(null);
    },
    onError: (err: any) => {
      error('Cancellation Failed', err.response?.data?.message || 'Could not cancel order');
    },
  });

  const deliveries = deliveriesData?.content || [];
  const activeDrivers = (driversData?.content || []).filter((d) => d.status === 'AVAILABLE' || d.status === 'ON_DELIVERY');
  const activityList = (recentActivity || []).slice(0, 6);

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Overview
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '3px 0 0 0' }}>
            Real-time delivery operations and fleet monitoring
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary"
          >
            <Plus size={16} />
            <span>New Delivery</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <StatCard
          label="Active Deliveries"
          value={stats ? stats.activeDeliveries : '--'}
          subtitle="Orders currently in progress"
          icon={Package}
          color="#2563eb"
          bgLight="#eff6ff"
          onClick={() => navigate('/deliveries')}
        />
        <StatCard
          label="Pending Assignment"
          value={stats ? stats.pendingAssignment : '--'}
          subtitle="Needs driver allocation"
          icon={Clock}
          color="#d97706"
          bgLight="#fffbeb"
          onClick={() => navigate('/deliveries?status=PENDING')}
        />
        <StatCard
          label="Out for Delivery"
          value={stats ? stats.outForDelivery : '--'}
          subtitle="En route to destinations"
          icon={Truck}
          color="#7c3aed"
          bgLight="#f5f3ff"
          onClick={() => navigate('/deliveries?status=OUT_FOR_DELIVERY')}
        />
        <StatCard
          label="Delivered Today"
          value={stats ? stats.deliveredToday : '--'}
          subtitle="Completed successfully"
          icon={CheckCircle2}
          color="#059669"
          bgLight="#ecfdf5"
          onClick={() => navigate('/deliveries?status=DELIVERED')}
        />
        <StatCard
          label="Failed Today"
          value={stats ? stats.failedToday : '--'}
          subtitle="Exceptions requiring review"
          icon={AlertTriangle}
          color="#dc2626"
          bgLight="#fef2f2"
          onClick={() => navigate('/deliveries?status=FAILED')}
        />
      </div>

      {/* Main Grid: Left (Chart + Deliveries) | Right (Fleet + Recent Activity) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2.2fr) minmax(0, 1fr)', gap: '20px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 7-Day Chart Panel */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Delivery Volume — Last 7 Days
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                  Total orders booked across the week
                </p>
              </div>
            </div>
            {isStatsLoading ? (
              <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                Loading metrics...
              </div>
            ) : (
              <DeliveriesChart data={stats?.deliveriesLast7Days || []} />
            )}
          </div>

          {/* Current Deliveries Table */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Recent Deliveries
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                  Latest orders moving through dispatch
                </p>
              </div>
              <button
                onClick={() => navigate('/deliveries')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>View all</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {isDeliveriesLoading ? (
              <div style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>Loading deliveries...</div>
            ) : (
              <DeliveryTable
                deliveries={deliveries}
                onView={(id) => navigate(`/deliveries/${id}`)}
                onAssign={(d) => setAssignDelivery(d)}
                onStatusChange={(d) => setStatusChangeDelivery(d)}
                onCancel={(d) => setCancelDeliveryTarget(d)}
              />
            )}
          </div>
        </div>

        {/* Right Column: Fleet Status & Activity Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Active Fleet Card */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Active Drivers ({activeDrivers.length})
              </h3>
              <button
                onClick={() => navigate('/drivers')}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Manage
              </button>
            </div>

            {activeDrivers.length === 0 ? (
              <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '8px 0' }}>No active drivers online.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeDrivers.slice(0, 5).map((driver) => (
                  <div
                    key={driver.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '5px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                        {driver.userName}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                        {driver.vehicle} &bull; {driver.activeDeliveries} load{driver.activeDeliveries === 1 ? '' : 's'}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: '3px',
                        backgroundColor: driver.status === 'AVAILABLE' ? '#ecfdf5' : '#fffbeb',
                        color: driver.status === 'AVAILABLE' ? '#047857' : '#b45309',
                      }}
                    >
                      {driver.status === 'AVAILABLE' ? 'Available' : 'On Delivery'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Log Feed */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Recent Activity
              </h3>
              <button
                onClick={() => navigate('/activity')}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                All activity
              </button>
            </div>

            {activityList.length === 0 ? (
              <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '8px 0' }}>No recent activity.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activityList.map((act) => (
                  <div key={act.id} style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#2563eb',
                        marginTop: '6px',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#0f172a', fontWeight: 500, lineHeight: 1.3 }}>
                        {act.description || `${act.actor} performed ${act.action}`}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '2px' }}>
                        {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; by {act.actor}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateDeliveryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <AssignDriverModal
        delivery={assignDelivery}
        isOpen={!!assignDelivery}
        onClose={() => setAssignDelivery(null)}
      />

      <StatusChangeModal
        delivery={statusChangeDelivery}
        isOpen={!!statusChangeDelivery}
        onClose={() => setStatusChangeDelivery(null)}
      />

      <ConfirmDialog
        isOpen={!!cancelDeliveryTarget}
        onClose={() => setCancelDeliveryTarget(null)}
        onConfirm={() => cancelDeliveryTarget && cancelMutation.mutate(cancelDeliveryTarget.id)}
        title="Cancel Delivery Order"
        message={`Are you sure you want to cancel Order #${cancelDeliveryTarget?.deliveryNumber}? This action will halt dispatch.`}
        confirmLabel="Yes, Cancel Order"
        isDestructive
        isLoading={cancelMutation.isPending}
      />
    </div>
  );
};

export default DashboardPage;