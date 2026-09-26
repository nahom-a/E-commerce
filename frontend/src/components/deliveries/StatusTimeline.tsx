import React from 'react';
import { DeliveryStatusHistory } from '../../types';
import { StatusBadge } from '../common/Badge';
import { Clock, User } from 'lucide-react';

interface Props {
  history: DeliveryStatusHistory[];
}

export const StatusTimeline: React.FC<Props> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '13px' }}>
        No status history recorded yet.
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', paddingLeft: '28px' }}>
      {/* Vertical Timeline Bar */}
      <div
        style={{
          position: 'absolute',
          left: '10px',
          top: '8px',
          bottom: '12px',
          width: '2px',
          backgroundColor: '#e2e8f0',
        }}
      />

      {history.map((item, index) => {
        const isLatest = index === history.length - 1;
        const dotColor =
          item.newStatus === 'DELIVERED'
            ? '#059669'
            : item.newStatus === 'FAILED'
            ? '#dc2626'
            : item.newStatus === 'CANCELLED'
            ? '#6b7280'
            : isLatest
            ? '#2563eb'
            : '#94a3b8';

        return (
          <div
            key={item.id || index}
            style={{
              position: 'relative',
              marginBottom: index === history.length - 1 ? 0 : '20px',
            }}
          >
            {/* Timeline Dot */}
            <div
              style={{
                position: 'absolute',
                left: '-23px',
                top: '4px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: dotColor,
                border: '2px solid #ffffff',
                boxShadow: '0 0 0 2px ' + dotColor,
              }}
            />

            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StatusBadge status={item.newStatus} />
                  {item.oldStatus && (
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                      (from {item.oldStatus.replace(/_/g, ' ')})
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#64748b' }}>
                  <Clock size={12} />
                  <span>
                    {new Date(item.changedAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {item.note && (
                <div style={{ fontSize: '13px', color: '#334155', marginTop: '4px', fontStyle: 'italic' }}>
                  "{item.note}"
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px', color: '#64748b', marginTop: '6px' }}>
                <User size={12} />
                <span>Updated by: <strong>{item.changedBy?.name || 'System / Dispatcher'}</strong></span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusTimeline;