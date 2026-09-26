import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { customerApi } from '../api';
import { CustomerModal } from '../components/customers/CustomerModal';
import { CreateDeliveryModal } from '../components/deliveries/CreateDeliveryModal';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { Customer, Delivery } from '../types';
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Plus,
  Edit2,
  Eye,
} from 'lucide-react';

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const customerId = Number(id);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateDeliveryOpen, setIsCreateDeliveryOpen] = useState(false);

  const { data: customer, isLoading: isCustomerLoading } = useQuery<Customer>({
    queryKey: ['customer', customerId],
    queryFn: () => customerApi.getById(customerId),
  });

  const { data: deliveries, isLoading: isDeliveriesLoading } = useQuery<Delivery[]>({
    queryKey: ['customerDeliveries', customerId],
    queryFn: () => customerApi.getDeliveries(customerId),
  });

  if (isCustomerLoading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading customer profile...</div>;
  }

  if (!customer) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', fontWeight: 600, color: '#334155' }}>Customer not found</p>
        <button onClick={() => navigate('/customers')} className="btn-secondary" style={{ marginTop: '12px' }}>
          Back to Customers
        </button>
      </div>
    );
  }

  const deliveryList = deliveries || [];

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '13px', color: '#64748b' }}>
        <button
          onClick={() => navigate('/customers')}
          style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
        >
          <ArrowLeft size={14} />
          <span>Customers</span>
        </button>
        <span>/</span>
        <span style={{ fontWeight: 600, color: '#0f172a' }}>{customer.name}</span>
      </div>

      {/* Header Profile Card */}
      <div
        className="card"
        style={{
          padding: '24px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Building2 size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              {customer.name}
            </h1>
            <p style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 0 0' }}>
              Customer #{customer.id} &bull; Member since {new Date(customer.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setIsEditOpen(true)} className="btn-secondary">
            <Edit2 size={14} />
            <span>Edit Profile</span>
          </button>
          <button onClick={() => setIsCreateDeliveryOpen(true)} className="btn-primary">
            <Plus size={16} />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* Customer Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '20px' }}>
        {/* Left Column: Contact & Details */}
        <div className="card" style={{ padding: '20px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
            Account Details
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
            <div>
              <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Contact Person</span>
              <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{customer.contactPerson || '-'}</div>
            </div>

            <div>
              <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Phone</span>
              <div style={{ color: '#0f172a', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={13} color="#2563eb" />
                <span>{customer.phone}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Email</span>
              <div style={{ color: '#0f172a', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={13} color="#2563eb" />
                <span>{customer.email || '-'}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Address</span>
              <div style={{ color: '#0f172a', marginTop: '2px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <MapPin size={14} color="#dc2626" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{customer.address || '-'}</span>
              </div>
            </div>

            {customer.notes && (
              <div>
                <span style={{ fontSize: '11.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Notes</span>
                <div style={{ color: '#475569', marginTop: '2px', backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                  {customer.notes}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Order History ({deliveryList.length})
            </h3>
          </div>

          {isDeliveriesLoading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>Loading order history...</div>
          ) : deliveryList.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>No orders placed by this customer yet.</p>
              <button
                onClick={() => setIsCreateDeliveryOpen(true)}
                className="btn-primary"
                style={{ marginTop: '10px', fontSize: '12.5px' }}
              >
                Create First Order
              </button>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Recipient</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryList.map((d) => (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 600, color: '#2563eb' }}>{d.deliveryNumber}</td>
                      <td>{d.recipientName}</td>
                      <td>
                        <StatusBadge status={d.status} />
                      </td>
                      <td>
                        <button
                          onClick={() => navigate(`/deliveries/${d.id}`)}
                          className="btn-secondary"
                          style={{ padding: '3px 8px', fontSize: '12px' }}
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CustomerModal
        customer={customer}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      <CreateDeliveryModal
        isOpen={isCreateDeliveryOpen}
        onClose={() => setIsCreateDeliveryOpen(false)}
      />
    </div>
  );
};

export default CustomerDetailPage;