import React, { useState } from 'react';

interface DeliveriesChartProps {
  data: Array<{ date: string; count: number }>;
}

export const DeliveriesChart: React.FC<DeliveriesChartProps> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '13px' }}>
        No delivery history data available.
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 5);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '12px',
          height: '140px',
          paddingTop: '20px',
          borderBottom: '1px solid #e2e8f0',
          position: 'relative',
        }}
      >
        {data.map((item, idx) => {
          const heightPercent = Math.max((item.count / maxCount) * 100, item.count > 0 ? 8 : 2);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.date || idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '100%',
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              {/* Tooltip on hover */}
              {isHovered && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-24px',
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  {item.count} {item.count === 1 ? 'order' : 'orders'}
                </div>
              )}

              {/* Bar */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '36px',
                  height: `${heightPercent}%`,
                  backgroundColor: isHovered ? '#1d4ed8' : '#2563eb',
                  borderRadius: '3px 3px 0 0',
                  transition: 'height 0.3s ease, background-color 0.15s ease',
                  opacity: isHovered ? 1 : 0.85,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Date Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
        {data.map((item) => (
          <div
            key={item.date}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: '11px',
              color: '#64748b',
              fontWeight: 500,
            }}
          >
            {item.date}
          </div>
        ))}
      </div>
    </div>
  );
};
