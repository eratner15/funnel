import React from 'react';
import TreeSVG from '../components/TreeSVG';
import ProgressBar from '../components/ProgressBar';
import StreakBadge from '../components/StreakBadge';
import { getTreeStage, getNextStage, getStageProgress, TREE_STAGES, ACHIEVEMENTS } from '../data/tree';

export default function TreeScreen({ userHook }) {
  const { user } = userHook;
  const currentStage = getTreeStage(user.xp);
  const nextStage = getNextStage(user.xp);
  const progress = getStageProgress(user.xp);
  const isMaxLevel = !nextStage;

  // Determine which achievements to show: all earned + first 2 unearned
  const earned = ACHIEVEMENTS.filter(a => user.achievements.includes(a.id));
  const unearned = ACHIEVEMENTS.filter(a => !user.achievements.includes(a.id));
  const visibleAchievements = [...earned, ...unearned.slice(0, 2)];

  return (
    <div className="screen tree-screen">
      <div className="container">

        {/* ── Header ── */}
        <header className="tree-header fade-in-up">
          <h1>Etz Chaim</h1>
          <StreakBadge streak={user.streak} />
        </header>

        {/* ── Tree Visualization ── */}
        <div className="tree-display fade-in-up" style={{ animationDelay: '0.04s' }}>
          <TreeSVG level={currentStage.level} size={280} />
        </div>

        {/* ── Stage Label ── */}
        <div className="tree-stage-label fade-in-up" style={{ animationDelay: '0.08s' }}>
          <span className="stage-emoji">{currentStage.emoji}</span>
          <span className="stage-name">{currentStage.name}</span>
        </div>

        {/* ── Progress to Next Stage ── */}
        {!isMaxLevel && (
          <div className="tree-progress fade-in-up" style={{ animationDelay: '0.12s' }}>
            <ProgressBar
              value={user.xp - currentStage.xpRequired}
              max={nextStage.xpRequired - currentStage.xpRequired}
              height={10}
            />
            <p className="tree-progress-label">
              {user.xp} / {nextStage.xpRequired} XP to next stage
            </p>
          </div>
        )}

        {/* ── Stats Grid ── */}
        <div className="tree-stats-grid fade-in-up" style={{ animationDelay: '0.16s' }}>
          <div className="tree-stat">
            <span className="tree-stat-value">{user.xp}</span>
            <span className="tree-stat-label">Total XP</span>
          </div>
          <div className="tree-stat">
            <span className="tree-stat-value">{user.streak}</span>
            <span className="tree-stat-label">Day Streak</span>
          </div>
          <div className="tree-stat">
            <span className="tree-stat-value">{user.completedParshiyot ? user.completedParshiyot.length : 0}</span>
            <span className="tree-stat-label">Parshiyot</span>
          </div>
          <div className="tree-stat">
            <span className="tree-stat-value">{user.quizzesTaken}</span>
            <span className="tree-stat-label">Quizzes</span>
          </div>
        </div>

        {/* ── Growth Milestones ── */}
        <section className="milestones-section fade-in-up" style={{ animationDelay: '0.20s' }}>
          <h3 className="section-title">Growth Milestones</h3>
          <div className="milestones-list">
            {TREE_STAGES.map((stage) => {
              const isCompleted = user.xp >= stage.xpRequired;
              const isCurrent = stage.level === currentStage.level;
              const isLocked = !isCompleted && !isCurrent;

              let milestoneClass = 'milestone-item';
              if (isCompleted) milestoneClass += ' completed';
              if (isCurrent) milestoneClass += ' current';
              if (isLocked) milestoneClass += ' locked';

              return (
                <div key={stage.level} className={milestoneClass}>
                  <span className="milestone-emoji">{stage.emoji}</span>
                  <div className="milestone-info">
                    <span className="milestone-name">{stage.name}</span>
                    <span className="milestone-xp">{stage.xpRequired} XP</span>
                  </div>
                  <span className="milestone-status">
                    {isCompleted && !isCurrent ? '✓' : isLocked ? '🔒' : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Achievements ── */}
        <section className="achievements-section fade-in-up" style={{ animationDelay: '0.24s' }}>
          <h3 className="section-title">Achievements</h3>
          <div className="achievements-grid">
            {visibleAchievements.map((achievement) => {
              const isEarned = user.achievements.includes(achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={`achievement-badge ${isEarned ? 'earned' : 'locked'}`}
                >
                  <span className="achievement-icon">
                    {isEarned ? achievement.icon : '🔒'}
                  </span>
                  <span className="achievement-name">{achievement.title}</span>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}
