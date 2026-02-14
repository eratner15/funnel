import React from 'react';

export default function ProgressBar({ value, max, color = 'var(--gold)', height = 8, showLabel = false }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="progress-bar-wrap">
      <div className="progress-bar" style={{ height }}>
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <span className="progress-bar-label">{value} / {max}</span>
      )}
    </div>
  );
}
