import React, { useState } from 'react';
import Card from '../components/Card';
import GoldButton from '../components/GoldButton';

const SIMULATED_LEADERS = [
  'Rivka S.', 'Yossi K.', 'Miriam L.', 'David H.', 'Sarah B.',
  'Moshe R.', 'Leah G.', 'Ari P.', 'Chana W.', 'Binyamin F.',
  'Esther M.', 'Noam T.', 'Yael D.', 'Shmuel A.', 'Tova N.',
  'Eli C.', 'Nechama Z.', 'Avraham J.', 'Penina E.'
];

const SIMULATED_XP = [
  2400, 2150, 1875, 1620, 1400, 1180, 1020, 870, 740, 620,
  510, 430, 350, 280, 220, 170, 120, 80, 50
];

function buildLeaderboard(user) {
  const simulated = SIMULATED_LEADERS.map((name, i) => ({
    name,
    xp: SIMULATED_XP[i],
    initial: name.charAt(0),
    isUser: false,
  }));

  const userName = user.name || 'You';
  const userEntry = {
    name: userName,
    xp: user.xp || 0,
    initial: userName.charAt(0).toUpperCase(),
    isUser: true,
  };

  const combined = [...simulated, userEntry];
  combined.sort((a, b) => b.xp - a.xp);

  return combined.map((entry, i) => ({
    ...entry,
    rank: i + 1,
  }));
}

const RANK_BADGES = { 1: '\u{1F947}', 2: '\u{1F948}', 3: '\u{1F949}' };

const AVATAR_COLORS = [
  'var(--gold)', 'var(--blue)', 'var(--green)', '#b39ddb',
  '#f48fb1', '#ffb74d', '#4dd0e1', '#aed581',
];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function LeaderboardScreen({ userHook, onBack }) {
  const { user } = userHook;
  const [activeTab, setActiveTab] = useState('weekly');

  const leaderboard = buildLeaderboard(user);
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3, 20);
  const userEntry = leaderboard.find((e) => e.isUser);

  // Podium display order: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]];

  return (
    <div className="screen leaderboard-screen">
      {/* ── Header ── */}
      <div className="leaderboard-header" style={styles.leaderboardHeader}>
        <button className="back-button" onClick={onBack} style={styles.backButton}>
          <span style={{ fontSize: 'var(--fs-xl)' }}>&larr;</span>
        </button>
        <h2 style={styles.headerTitle}>Leaderboard</h2>
        <div style={{ width: 40 }} />
      </div>

      {/* ── Tabs ── */}
      <div className="leaderboard-tabs fade-in-up" style={styles.leaderboardTabs}>
        <button
          className={`tab-btn ${activeTab === 'weekly' ? 'active' : ''}`}
          onClick={() => setActiveTab('weekly')}
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'weekly' ? styles.tabBtnActive : {}),
          }}
        >
          Weekly
        </button>
        <button
          className={`tab-btn ${activeTab === 'alltime' ? 'active' : ''}`}
          onClick={() => setActiveTab('alltime')}
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'alltime' ? styles.tabBtnActive : {}),
          }}
        >
          All Time
        </button>
      </div>

      <div style={styles.scrollContainer}>
        {/* ── Podium ── */}
        <div className="podium fade-in-up" style={{ ...styles.podium, animationDelay: '0.05s' }}>
          {podiumOrder.map((entry, i) => {
            if (!entry) return null;
            const isFirst = entry.rank === 1;
            const avatarColor = entry.isUser ? 'var(--gold)' : getAvatarColor(entry.name);

            return (
              <div
                key={entry.name}
                className="podium-item"
                style={{
                  ...styles.podiumItem,
                  ...(isFirst ? styles.podiumItemFirst : styles.podiumItemSide),
                  animationDelay: `${0.1 + i * 0.08}s`,
                }}
              >
                <div
                  className="podium-rank"
                  style={styles.podiumRank}
                >
                  {RANK_BADGES[entry.rank]}
                </div>
                <div
                  className="podium-avatar"
                  style={{
                    ...styles.podiumAvatar,
                    ...(isFirst ? styles.podiumAvatarFirst : {}),
                    borderColor: avatarColor,
                    ...(entry.isUser
                      ? { boxShadow: 'var(--gold-glow-strong)', borderColor: 'var(--gold)' }
                      : {}),
                  }}
                >
                  <span style={{
                    ...styles.podiumInitial,
                    color: avatarColor,
                    ...(isFirst ? { fontSize: 'var(--fs-2xl)' } : {}),
                  }}>
                    {entry.initial}
                  </span>
                </div>
                <span
                  className="podium-name"
                  style={{
                    ...styles.podiumName,
                    ...(entry.isUser ? { color: 'var(--gold)' } : {}),
                  }}
                >
                  {entry.isUser ? 'You' : entry.name}
                </span>
                <span className="podium-xp" style={styles.podiumXp}>
                  {entry.xp.toLocaleString()} XP
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Ranked List ── */}
        <div className="leaderboard-list" style={styles.leaderboardList}>
          {rest.map((entry, i) => (
            <div
              key={entry.name}
              className={`leaderboard-row fade-in-up ${entry.isUser ? 'is-user' : ''}`}
              style={{
                ...styles.leaderboardRow,
                ...(entry.isUser ? styles.leaderboardRowUser : {}),
                animationDelay: `${0.15 + i * 0.03}s`,
              }}
            >
              <span className="rank-number" style={styles.rankNumber}>
                {entry.rank}
              </span>
              <div
                className="row-avatar"
                style={{
                  ...styles.rowAvatar,
                  borderColor: entry.isUser ? 'var(--gold)' : getAvatarColor(entry.name),
                }}
              >
                <span style={{
                  fontSize: 'var(--fs-sm)',
                  fontWeight: 'var(--fw-bold)',
                  color: entry.isUser ? 'var(--gold)' : getAvatarColor(entry.name),
                }}>
                  {entry.initial}
                </span>
              </div>
              <span
                className="row-name"
                style={{
                  ...styles.rowName,
                  ...(entry.isUser ? { color: 'var(--gold)', fontWeight: 'var(--fw-bold)' } : {}),
                }}
              >
                {entry.isUser ? 'You' : entry.name}
              </span>
              <span
                className="row-xp"
                style={{
                  ...styles.rowXp,
                  ...(entry.isUser ? { background: 'var(--gold-gradient)', color: 'var(--text-inverse)' } : {}),
                }}
              >
                {entry.xp.toLocaleString()} XP
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── User Rank Card (Pinned Bottom) ── */}
      {userEntry && (
        <Card
          className="user-rank-card fade-in-up"
          style={{
            ...styles.userRankCard,
            animationDelay: '0.3s',
          }}
        >
          <div style={styles.userRankInner}>
            <div style={styles.userRankLeft}>
              <div
                style={{
                  ...styles.rowAvatar,
                  borderColor: 'var(--gold)',
                  flexShrink: 0,
                }}
              >
                <span style={{
                  fontSize: 'var(--fs-sm)',
                  fontWeight: 'var(--fw-bold)',
                  color: 'var(--gold)',
                }}>
                  {userEntry.initial}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{
                  color: 'var(--text-primary)',
                  fontWeight: 'var(--fw-bold)',
                  fontSize: 'var(--fs-base)',
                }}>
                  Your Rank: #{userEntry.rank}
                </span>
                <span style={{
                  color: 'var(--text-muted)',
                  fontSize: 'var(--fs-sm)',
                }}>
                  {userEntry.xp.toLocaleString()} XP earned
                </span>
              </div>
            </div>
            <GoldButton
              onClick={onBack}
              variant="outline"
              style={{ fontSize: 'var(--fs-sm)', padding: '6px 14px' }}
            >
              Back
            </GoldButton>
          </div>
        </Card>
      )}
    </div>
  );
}

const styles = {
  leaderboardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--space-base) var(--space-base)',
    paddingTop: 'calc(var(--safe-area-top, 0px) + var(--space-base))',
    background: 'rgba(10, 10, 18, 0.8)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  leaderboardTabs: {
    display: 'flex',
    gap: 'var(--space-xs)',
    padding: 'var(--space-sm) var(--space-base)',
    background: 'rgba(255, 255, 255, 0.04)',
    margin: 'var(--space-md) var(--space-base)',
    borderRadius: 'var(--radius-lg)',
  },
  podium: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 'var(--space-sm)',
    padding: 'var(--space-xl) var(--space-base) var(--space-lg)',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: 'var(--gold)',
    cursor: 'pointer',
    padding: 'var(--space-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 'var(--radius-full)',
  },
  headerTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--fs-xl)',
    fontWeight: 'var(--fw-bold)',
    color: 'var(--text-primary)',
    textAlign: 'center',
    margin: 0,
  },
  tabBtn: {
    flex: 1,
    padding: '10px 0',
    border: 'none',
    borderRadius: 'var(--radius-lg)',
    background: 'transparent',
    color: 'var(--text-muted)',
    fontSize: 'var(--fs-base)',
    fontWeight: 'var(--fw-semibold)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabBtnActive: {
    background: 'var(--bg-card)',
    color: 'var(--gold)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  },
  scrollContainer: {
    flex: 1,
    overflowY: 'auto',
    paddingBottom: 100,
  },
  podiumItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-xs)',
    flex: 1,
  },
  podiumItemFirst: {
    marginTop: 0,
  },
  podiumItemSide: {
    marginTop: 28,
  },
  podiumRank: {
    fontSize: 'var(--fs-2xl)',
    lineHeight: 1,
  },
  podiumAvatar: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    background: 'var(--bg-card)',
    border: '2.5px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumAvatarFirst: {
    width: 68,
    height: 68,
    borderWidth: 3,
  },
  podiumInitial: {
    fontSize: 'var(--fs-lg)',
    fontWeight: 'var(--fw-bold)',
  },
  podiumName: {
    fontSize: 'var(--fs-sm)',
    fontWeight: 'var(--fw-semibold)',
    color: 'var(--text-primary)',
    textAlign: 'center',
    maxWidth: 90,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  podiumXp: {
    fontSize: 'var(--fs-xs)',
    color: 'var(--text-secondary)',
    fontWeight: 'var(--fw-medium)',
  },
  leaderboardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
    padding: '0 var(--space-base)',
  },
  leaderboardRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)',
    padding: '10px var(--space-md)',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border)',
    transition: 'all 0.2s ease',
  },
  leaderboardRowUser: {
    border: '1.5px solid var(--gold)',
    boxShadow: 'var(--gold-glow)',
    background: 'rgba(242, 192, 39, 0.06)',
  },
  rankNumber: {
    width: 28,
    textAlign: 'center',
    fontSize: 'var(--fs-base)',
    fontWeight: 'var(--fw-bold)',
    color: 'var(--text-muted)',
    flexShrink: 0,
  },
  rowAvatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: 'var(--bg-card)',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowName: {
    flex: 1,
    fontSize: 'var(--fs-base)',
    fontWeight: 'var(--fw-medium)',
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  rowXp: {
    fontSize: 'var(--fs-xs)',
    fontWeight: 'var(--fw-bold)',
    color: 'var(--text-secondary)',
    background: 'rgba(255, 255, 255, 0.06)',
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
    flexShrink: 0,
  },
  userRankCard: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: 'var(--app-max-width, 430px)',
    margin: 0,
    borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
    borderTop: '1.5px solid var(--gold)',
    boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.5), var(--gold-glow)',
    zIndex: 100,
    padding: 'var(--space-base) var(--space-lg)',
  },
  userRankInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--space-md)',
  },
  userRankLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)',
  },
};
