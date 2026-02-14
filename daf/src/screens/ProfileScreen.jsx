import React from 'react';
import Card from '../components/Card';
import GoldButton from '../components/GoldButton';
import { getTreeStage } from '../data/tree';

export default function ProfileScreen({ userHook, navigate }) {
  const { user, getStudyStats, resetUser } = userHook;
  const stage = getTreeStage(user.xp);
  const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';
  const stats = getStudyStats();

  const settingsItems = [
    { label: 'Shabbat Mode', value: user.settings?.shabbatMode ? 'On' : 'Off', isToggle: true },
    { label: 'Notifications', value: null },
    { label: 'Language', value: 'English' },
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
          {user.isPremium && (
            <span className="premium-badge">✡ Premium</span>
          )}
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

        {/* ── Study Analytics ── */}
        <section className="analytics-section fade-in-up" style={{ animationDelay: '0.08s' }}>
          <h3 className="section-title">Study Analytics</h3>
          <div className="analytics-grid">
            <Card className="analytics-card">
              <span className="analytics-value">{stats.totalDays}</span>
              <span className="analytics-label">Days Studied</span>
            </Card>
            <Card className="analytics-card">
              <span className="analytics-value">{stats.avgDailyXP}</span>
              <span className="analytics-label">Avg Daily XP</span>
            </Card>
            <Card className="analytics-card">
              <span className="analytics-value">{stats.quizzesTaken}</span>
              <span className="analytics-label">Quizzes Taken</span>
            </Card>
            <Card className="analytics-card">
              <span className="analytics-value">{stats.longestStreak}</span>
              <span className="analytics-label">Best Streak</span>
            </Card>
            <Card className="analytics-card">
              <span className="analytics-value">{stats.reflections}</span>
              <span className="analytics-label">Reflections</span>
            </Card>
            <Card className="analytics-card">
              <span className="analytics-value">{stats.achievements}</span>
              <span className="analytics-label">Achievements</span>
            </Card>
          </div>

          {/* Weekly XP Bar */}
          <Card className="weekly-xp-card">
            <div className="weekly-xp-header">
              <span className="weekly-xp-title">This Week</span>
              <span className="weekly-xp-value">{stats.weeklyXP} XP</span>
            </div>
            <div className="weekly-xp-bar">
              <div
                className="weekly-xp-fill"
                style={{ width: `${Math.min(100, (stats.weeklyXP / 500) * 100)}%` }}
              />
            </div>
            <span className="weekly-xp-goal">{stats.weeklyXP} / 500 XP weekly goal</span>
          </Card>
        </section>

        {/* ── Quick Actions ── */}
        <section className="profile-actions fade-in-up" style={{ animationDelay: '0.12s' }}>
          <Card className="profile-action-card" onClick={() => navigate('leaderboard')}>
            <span className="profile-action-icon">🏆</span>
            <span className="profile-action-label">Leaderboard</span>
            <span className="settings-chevron">&rsaquo;</span>
          </Card>
          {!user.isPremium && (
            <Card className="profile-action-card premium-action" onClick={() => navigate('premium')}>
              <span className="profile-action-icon">✡</span>
              <span className="profile-action-label">Upgrade to Premium</span>
              <span className="settings-chevron">&rsaquo;</span>
            </Card>
          )}
        </section>

        {/* ── Settings List ── */}
        <Card className="settings-card fade-in-up" style={{ animationDelay: '0.16s' }}>
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
        <footer className="profile-footer fade-in-up" style={{ animationDelay: '0.20s' }}>
          <p className="profile-footer-text">Powered by Sefaria Open API</p>
          <p className="profile-footer-version">DAF v1.0.0</p>
        </footer>

      </div>
    </div>
  );
}
