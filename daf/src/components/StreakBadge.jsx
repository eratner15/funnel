import React from 'react';

export default function StreakBadge({ streak }) {
  if (!streak || streak <= 0) return null;

  return (
    <span className="streak-badge">
      <span className="streak-fire">🔥</span>
      <span className="streak-count">{streak}</span>
    </span>
  );
}
