import React from 'react';
import { DeliveryStatusHistory } from '../../types';

interface Props {
  history: DeliveryStatusHistory[];
}

const StatusTimeline: React.FC<Props> = ({ history }) => {
  if (history.length === 0) {
    return <p style={{ color: '#999', fontSize: '13px' }}>No status history available</p>;
  }

  return (
    <div style={{ position: 'relative', paddingLeft: '24px' }}>
      <div style={{
        position: 'absolute',
        left: '8px',
        top: '0',
        bottom: '0',
        width: '2px',
        backgroundColor: '#e0e0e0',
      }} />
      {history.map((item, index) => (
        <div key={item.id} style={{ position: 'relative', marginBottom: '20px', paddingLeft: '16px' }}>
          <div style={{
            position: 'absolute',
            left: '-20px',
            top: '2px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: index === 0 ? '#4a90d9' : '#ccc',
            border: '2px solid #fff',
          }} />
          <div style={{ fontSize: '12px', color: '#999' }}>
            {new Date(item.changedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 500 }}>{item.newStatus.replace(/_/g, ' ')}</div>
          {item.note && <div style={{ fontSize: '13px', color: '#666' }}>{item.note}</div>}
          {item.changedBy && <div style={{ fontSize: '12px', color: '#999' }}>by {item.changedBy}</div>}
        </div>
      ))}
    </div>
  );
};

export default StatusTimeline;