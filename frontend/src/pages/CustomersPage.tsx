import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { customerApi } from '../api';
import { CustomerModal } from '../components/customers/CustomerModal';
import { Customer, PageResponse } from '../types';
import { Plus, Search, Building2, Phone, Mail, MapPin, Eye, Edit2 } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  const { data, isLoading } = useQuery<PageResponse<Customer>>({
    queryKey: ['customers', search],
    queryFn: () => customerApi.getAll({ size: 50 }),
  });

  const allCustomers = data?.content || [];
  const filteredCustomers = allCustomers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.contactPerson && c.contactPerson.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      c.phone.includes(q)
    );
  });

  return (
    <div>
      {/* Header */}
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
            Customers
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '3px 0 0 0' }}>
            Client accounts, corporate partners, and delivery destinations
          </p>
        </div>

        <button onClick={() => setIsAddOpen(true)} className="btn-primary">
          <Plus size={16} />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
          backgroundColor: '#ffffff',
          padding: '12px 16px',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search customers by name, contact, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '32px' }}
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            Loading customer directory...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
              {search ? 'No customers match your search.' : 'No customer accounts registered yet.'}
            </p>
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Business / Customer</th>
                  <th>Contact Person</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Location / Address</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '5px',
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                          }}
                        >
                          <Building2 size={16} />
                        </div>
                        <div>
                          <div
                            onClick={() => navigate(`/customers/${c.id}`)}
                            style={{ fontWeight: 600, color: '#2563eb', cursor: 'pointer' }}
                          >
                            {c.name}
                          </div>
                          {c.notes && (
                            <div style={{ fontSize: '11.5px', color: '#64748b', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {c.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#334155', fontWeight: 500 }}>
                      {c.contactPerson || '-'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px' }}>
                        <Phone size={12} color="#64748b" />
                        <span>{c.phone}</span>
                      </div>
                    </td>
                    <td>
                      {c.email ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', color: '#475569' }}>
                          <Mail size={12} color="#64748b" />
                          <span>{c.email}</span>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>-</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', color: '#475569' }}>
                        <MapPin size={12} color="#64748b" />
                        <span>{c.address || '-'}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => navigate(`/customers/${c.id}`)}
                          className="btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                        >
                          <Eye size={13} />
                          <span>History</span>
                        </button>
                        <button
                          onClick={() => setEditCustomer(c)}
                          className="btn-secondary"
                          style={{ padding: '4px 6px' }}
                          title="Edit Customer"
                        >
                          <Edit2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <CustomerModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />

      <CustomerModal
        customer={editCustomer}
        isOpen={!!editCustomer}
        onClose={() => setEditCustomer(null)}
      />
    </div>
  );
};

export default CustomersPage;