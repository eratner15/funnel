import React from 'react';
import Card from '../components/Card';
import { getTreeStage } from '../data/tree';

export default function ProfileScreen({ userHook }) {
  const { user } = userHook;
  const stage = getTreeStage(user.xp);
  const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';

  const settingsItems = [
    { label: 'Shabbat Mode', value: user.settings?.shabbatMode ? 'On' : 'Off', isToggle: true },
    { label: 'Notifications', value: null },
    { label: 'Language', value: 'English' },
    { label: 'Study Stats', value: null },
    { label: 'Upgrade to Premium', value: null },
  ];

  return (
    <div className="screen profile-screen">
      <div className="container">

        {/* ── Avatar ── */}
        <div className="profile-avatar-section fade-in-up">
          <div className="avatar-circle">
            <span className="avatar-initial">{initial}</span>
          </div>
          <h2 className="profile-name">{user.name || 'Student'}</h2>
          <p className="profile-level">
            Level {user.level} &middot; {stage.emoji} {stage.name}
          </p>
        </div>

        {/* ── Stats Row ── */}
        <div className="profile-stats fade-in-up" style={{ animationDelay: '0.04s' }}>
          <div className="profile-stat">
            <span className="profile-stat-value">{user.xp}</span>
            <span className="profile-stat-label">XP</span>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat">
            <span className="profile-stat-value">{user.streak}</span>
            <span className="profile-stat-label">Streak</span>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat">
            <span className="profile-stat-value">{user.level}</span>
            <span className="profile-stat-label">Level</span>
          </div>
        </div>

        {/* ── Settings List ── */}
        <Card className="settings-card fade-in-up" style={{ animationDelay: '0.08s' }}>
          {settingsItems.map((item, index) => (
            <div key={index} className="settings-item">
              <span className="settings-item-label">{item.label}</span>
              <div className="settings-item-right">
                {item.isToggle ? (
                  <span className={`toggle-indicator ${item.value === 'On' ? 'active' : ''}`}>
                    {item.value}
                  </span>
                ) : item.value ? (
                  <span className="settings-item-value">{item.value}</span>
                ) : null}
                <span className="settings-chevron">&rsaquo;</span>
              </div>
            </div>
          ))}
        </Card>

        {/* ── Footer ── */}
        <footer className="profile-footer fade-in-up" style={{ animationDelay: '0.12s' }}>
          <p className="profile-footer-text">Powered by Sefaria Open API</p>
          <p className="profile-footer-version">DAF v1.0.0</p>
        </footer>

      </div>
    </div>
  );
}
