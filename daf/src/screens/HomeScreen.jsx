import React, { useState, useEffect } from 'react';
import { useParsha } from '../hooks/useParsha';
import Card from '../components/Card';
import StreakBadge from '../components/StreakBadge';
import ProgressBar from '../components/ProgressBar';
import MissionCard from '../components/MissionCard';
import ShabbatWidget from '../components/ShabbatWidget';
import HebrewText from '../components/HebrewText';
import { MISSION_TEMPLATES } from '../data/missions';

export default function HomeScreen({ userHook, navigate }) {
  const { user, getTodayMissions, getDailyXP } = userHook;
  const { currentParsha, loading } = useParsha();
  const [todayMissions, setTodayMissions] = useState({});
  const [dailyXP, setDailyXP] = useState(0);

  useEffect(() => {
    setTodayMissions(getTodayMissions());
    setDailyXP(getDailyXP());
  }, [getTodayMissions, getDailyXP]);

  if (loading || !currentParsha) {
    return (
      <div className="screen home-screen">
        <div className="container">
          <div className="loading-state">Loading...</div>
        </div>
      </div>
    );
  }

  const completedParshiyotCount = user.completedParshiyot
    ? user.completedParshiyot.length
    : 0;

  return (
    <div className="screen home-screen">
      <div className="container">

        {/* ── Header ── */}
        <header className="home-header fade-in-up">
          <div className="header-greeting">
            <h1>Shalom, {user.name}</h1>
            <span className="level-badge">Lvl {user.level}</span>
          </div>
          <StreakBadge streak={user.streak} />
        </header>

        {/* ── Parsha Hero Card ── */}
        <Card className="parsha-hero fade-in-up" style={{ animationDelay: '0.04s' }}>
          <div className="parsha-header">
            <HebrewText size="large" gold>
              {currentParsha.heb}
            </HebrewText>
            <h2 className="parsha-english-name">{currentParsha.name}</h2>
            <p className="parsha-reference">{currentParsha.book} &middot; {currentParsha.chapters}</p>
          </div>

          <p className="parsha-summary">{currentParsha.summary}</p>

          <div className="parsha-verse">
            <HebrewText size="medium" className="verse-hebrew">
              {currentParsha.keyVerse.heb}
            </HebrewText>
            <p className="verse-english">{currentParsha.keyVerse.en}</p>
          </div>

          <span className="mitzvot-badge">
            {currentParsha.mitzvot} Mitzvot
          </span>
        </Card>

        {/* ── Daily Goal Progress ── */}
        <Card className="daily-goal fade-in-up" style={{ animationDelay: '0.08s' }}>
          <div className="daily-goal-header">
            <span className="daily-goal-label">Daily Goal</span>
            <span className="daily-goal-xp">{dailyXP} / 100 XP</span>
          </div>
          <ProgressBar value={dailyXP} max={100} showLabel={false} />
        </Card>

        {/* ── Daily Missions ── */}
        <section className="missions-section fade-in-up" style={{ animationDelay: '0.12s' }}>
          <h3 className="section-title">Today's Missions</h3>
          {MISSION_TEMPLATES.map((mission, index) => {
            const completed = !!(todayMissions[mission.type] && todayMissions[mission.type].done);
            return (
              <MissionCard
                key={mission.type}
                mission={mission}
                completed={completed}
                onClick={() => navigate(mission.type)}
                delay={index * 0.04}
              />
            );
          })}
        </section>

        {/* ── Leaderboard CTA ── */}
        <Card className="leaderboard-cta fade-in-up" onClick={() => navigate('leaderboard')} style={{ animationDelay: '0.28s' }}>
          <div className="leaderboard-cta-content">
            <span className="leaderboard-cta-icon">🏆</span>
            <div className="leaderboard-cta-text">
              <span className="leaderboard-cta-title">Leaderboard</span>
              <span className="leaderboard-cta-sub">See how you rank</span>
            </div>
            <span className="leaderboard-cta-arrow">&rsaquo;</span>
          </div>
        </Card>

        {/* ── Shabbat Widget ── */}
        <div className="fade-in-up" style={{ animationDelay: '0.32s' }}>
          <ShabbatWidget />
        </div>

        {/* ── Premium CTA (free users only) ── */}
        {!user.isPremium && (
          <Card className="premium-home-cta fade-in-up" onClick={() => navigate('premium')} style={{ animationDelay: '0.34s' }}>
            <div className="premium-home-content">
              <span className="premium-home-icon">✡</span>
              <div className="premium-home-text">
                <span className="premium-home-title">Upgrade to Premium</span>
                <span className="premium-home-sub">Unlimited hearts, 2x XP & more</span>
              </div>
              <span className="premium-home-arrow">&rsaquo;</span>
            </div>
          </Card>
        )}

        {/* ── Quick Stats Row ── */}
        <div className="quick-stats fade-in-up" style={{ animationDelay: '0.38s' }}>
          <Card className="stat-card">
            <span className="stat-value">{user.xp}</span>
            <span className="stat-label">Total XP</span>
          </Card>
          <Card className="stat-card">
            <span className="stat-value">{user.streak}</span>
            <span className="stat-label">Day Streak</span>
          </Card>
          <Card className="stat-card">
            <span className="stat-value">{completedParshiyotCount}</span>
            <span className="stat-label">Parshiyot</span>
          </Card>
        </div>

      </div>
    </div>
  );
}
