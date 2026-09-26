import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { customerApi } from '../../api';
import { CustomerDTO } from '../../types';

const CustomersPage: React.FC = () => {
  const { data, isLoading } = useQuery<{ data: CustomerDTO[] }>({
    queryKey: ['customers'],
    queryFn: () => customerApi.getAll().then((r) => r.data),
  });

  const customers = data?.data || [];

  if (isLoading) return <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700 }}>Customers</h1>
        <p style={{ color: '#666', fontSize: '14px' }}>Manage customer accounts</p>
      </div>
      {customers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
          <p>No customers found</p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                {['Name', 'Contact Person', 'Phone', 'Email', 'Address', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 600, color: '#555', fontSize: '12px', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px 8px', fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: '10px 8px' }}>{c.contactPerson}</td>
                  <td style={{ padding: '10px 8px' }}>{c.phone}</td>
                  <td style={{ padding: '10px 8px' }}>{c.email}</td>
                  <td style={{ padding: '10px 8px' }}>{c.address}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <button style={{ color: '#4a90d9', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;