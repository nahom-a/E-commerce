import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { activityApi } from '../api';
import { ActivityLog } from '../types';
import { Search, Clock, User, Shield, RefreshCw } from 'lucide-react';

export const ActivityPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const { data, isLoading, refetch, isFetching } = useQuery<ActivityLog[]>({
    queryKey: ['activity'],
    queryFn: () => activityApi.getAll(),
  });

  const logs = data || [];
  const filteredLogs = logs.filter((log) => {
    if (actionFilter && log.action !== actionFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      log.actor.toLowerCase().includes(q) ||
      (log.description && log.description.toLowerCase().includes(q)) ||
      log.action.toLowerCase().includes(q) ||
      (log.entityType && log.entityType.toLowerCase().includes(q))
    );
  });

  const uniqueActions = Array.from(new Set(logs.map((l) => l.action))).filter(Boolean);

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
            Activity Log
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '3px 0 0 0' }}>
            System audit trail, dispatch modifications, and operations timeline
          </p>
        </div>

        <button onClick={() => refetch()} className="btn-secondary" disabled={isFetching}>
          <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Bar */}
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
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search activity by actor, action, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '32px' }}
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          style={{ minWidth: '180px' }}
        >
          <option value="">All Action Types</option>
          {uniqueActions.map((action) => (
            <option key={action} value={action}>
              {action.replace(/_/g, ' ')}
            </option>
          ))}
        </select>

        {(search || actionFilter) && (
          <button
            onClick={() => {
              setSearch('');
              setActionFilter('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#dc2626',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Main Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            Loading activity log...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
              {search || actionFilter ? 'No matching activity records found.' : 'No system activity logged yet.'}
            </p>
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor / User</th>
                  <th>Action</th>
                  <th>Target Entity</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={13} color="#94a3b8" />
                        <span>{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#0f172a' }}>
                        <User size={13} color="#2563eb" />
                        <span>{log.actor}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: '2px 7px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.4px',
                          backgroundColor: '#eff6ff',
                          color: '#1d4ed8',
                          border: '1px solid #bfdbfe',
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12.5px', color: '#475569', fontWeight: 500 }}>
                        {log.entityType} {log.entityId ? `#${log.entityId}` : ''}
                      </span>
                    </td>
                    <td style={{ color: '#334155', maxWidth: '340px' }}>
                      {log.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityPage;