import React from 'react';

export default function MissionCard({ mission, completed, onClick, delay = 0 }) {
  return (
    <div
      className={`mission-card ${completed ? 'completed' : ''}`}
      onClick={!completed ? onClick : undefined}
      style={{ animationDelay: `${delay}s` }}
      role="button"
      tabIndex={0}
    >
      <div className="mission-icon">{mission.icon}</div>
      <div className="mission-info">
        <div className="mission-title">{mission.title}</div>
        <div className="mission-desc">{mission.description}</div>
      </div>
      <div className="mission-meta">
        {completed ? (
          <span className="mission-check">✓</span>
        ) : (
          <>
            <span className="mission-xp">+{mission.xp} XP</span>
            <span className="mission-time">{mission.estimatedMinutes} min</span>
          </>
        )}
      </div>
    </div>
  );
}
