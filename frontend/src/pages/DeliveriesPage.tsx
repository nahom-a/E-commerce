import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { deliveryApi, driverApi } from '../api';
import { DeliveryTable } from '../components/deliveries/DeliveryTable';
import { CreateDeliveryModal } from '../components/deliveries/CreateDeliveryModal';
import { EditDeliveryModal } from '../components/deliveries/EditDeliveryModal';
import { AssignDriverModal } from '../components/deliveries/AssignDriverModal';
import { StatusChangeModal } from '../components/deliveries/StatusChangeModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { Delivery, DeliveryStatus, Driver, PageResponse } from '../types';
import { Plus, Search, Filter, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const STATUS_TABS: Array<{ id: string; label: string }> = [
  { id: '', label: 'All' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'ASSIGNED', label: 'Assigned' },
  { id: 'PICKED_UP', label: 'Picked Up' },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { id: 'DELIVERED', label: 'Delivered' },
  { id: 'FAILED', label: 'Failed' },
  { id: 'CANCELLED', label: 'Cancelled' },
];

export const DeliveriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get('status') || '');
  const [selectedDriverId, setSelectedDriverId] = useState<string>(searchParams.get('driverId') || '');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(15);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editDelivery, setEditDelivery] = useState<Delivery | null>(null);
  const [assignDelivery, setAssignDelivery] = useState<Delivery | null>(null);
  const [statusChangeDelivery, setStatusChangeDelivery] = useState<Delivery | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Delivery | null>(null);

  // Sync params
  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam !== null && statusParam !== selectedStatus) {
      setSelectedStatus(statusParam);
    }
  }, [searchParams]);

  const { data: driversData } = useQuery<{ content: Driver[] }>({
    queryKey: ['driversFilterList'],
    queryFn: () => driverApi.getAll({ size: 100 }),
  });

  const { data, isLoading, refetch, isFetching } = useQuery<PageResponse<Delivery>>({
    queryKey: ['deliveries', searchQuery, selectedStatus, selectedDriverId, page, size],
    queryFn: () => {
      const params: Record<string, any> = { page, size };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedStatus) params.status = selectedStatus;
      if (selectedDriverId) params.driverId = selectedDriverId;
      return deliveryApi.getAll(params);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => deliveryApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      success('Order Cancelled', 'The delivery order has been cancelled.');
      setCancelTarget(null);
    },
    onError: (err: any) => {
      error('Cancellation Failed', err.response?.data?.message || 'Could not cancel order');
    },
  });

  const deliveries = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;
  const drivers = driversData?.content || [];

  const handleTabChange = (status: string) => {
    setSelectedStatus(status);
    setPage(0);
    if (status) {
      setSearchParams({ status });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Deliveries
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '3px 0 0 0' }}>
            Manage, dispatch, and track orders across your fleet
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => refetch()}
            className="btn-secondary"
            title="Refresh list"
            disabled={isFetching}
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="btn-primary"
          >
            <Plus size={16} />
            <span>New Delivery</span>
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '16px',
          overflowX: 'auto',
          paddingBottom: '2px',
        }}
      >
        {STATUS_TABS.map((tab) => {
          const isActive = selectedStatus === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                padding: '8px 14px',
                border: 'none',
                background: 'none',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#2563eb' : '#64748b',
                borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
          flexWrap: 'wrap',
          backgroundColor: '#ffffff',
          padding: '12px 16px',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search by order #, recipient, customer, or address..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            style={{ width: '100%', paddingLeft: '32px' }}
          />
        </div>

        {/* Driver Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={15} color="#64748b" />
          <select
            value={selectedDriverId}
            onChange={(e) => {
              setSelectedDriverId(e.target.value);
              setPage(0);
            }}
            style={{ minWidth: '160px' }}
          >
            <option value="">All Drivers</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.userName} ({d.vehicle})
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters button */}
        {(searchQuery || selectedStatus || selectedDriverId) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStatus('');
              setSelectedDriverId('');
              setSearchParams({});
              setPage(0);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#dc2626',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '6px 8px',
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Main Delivery Table Card */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            Loading deliveries...
          </div>
        ) : (
          <DeliveryTable
            deliveries={deliveries}
            onView={(id) => navigate(`/deliveries/${id}`)}
            onAssign={(d) => setAssignDelivery(d)}
            onStatusChange={(d) => setStatusChangeDelivery(d)}
            onEdit={(d) => setEditDelivery(d)}
            onCancel={(d) => setCancelTarget(d)}
            emptyMessage={
              searchQuery || selectedStatus || selectedDriverId
                ? 'No deliveries match your active filter criteria.'
                : 'No delivery orders in system yet.'
            }
          />
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div
            style={{
              padding: '12px 20px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8fafc',
            }}
          >
            <div style={{ fontSize: '12.5px', color: '#64748b' }}>
              Showing {deliveries.length} of {totalElements} orders &bull; Page {page + 1} of {totalPages}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn-secondary"
                style={{ padding: '5px 10px', fontSize: '12px' }}
              >
                <ChevronLeft size={14} />
                <span>Prev</span>
              </button>

              <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155', padding: '0 4px' }}>
                {page + 1}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="btn-secondary"
                style={{ padding: '5px 10px', fontSize: '12px' }}
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateDeliveryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditDeliveryModal
        delivery={editDelivery}
        isOpen={!!editDelivery}
        onClose={() => setEditDelivery(null)}
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
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={() => cancelTarget && cancelMutation.mutate(cancelTarget.id)}
        title="Cancel Delivery Order"
        message={`Are you sure you want to cancel Order #${cancelTarget?.deliveryNumber}?`}
        confirmLabel="Yes, Cancel"
        isDestructive
        isLoading={cancelMutation.isPending}
      />
    </div>
  );
};

export default DeliveriesPage;