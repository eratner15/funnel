import React from 'react';
import GoldButton from '../components/GoldButton';
import { DAILY_REWARDS } from '../hooks/useUser';

const DAY_REWARDS = DAILY_REWARDS;

export default function DailyRewardModal({ day, xpReward, streakBonus, onClaim }) {
  const total = xpReward + (streakBonus || 0);

  return (
    <div className="daily-reward-overlay">
      <div className="daily-reward-modal">
        <div className="reward-track">
          {DAY_REWARDS.map((reward, i) => {
            const dayNum = i + 1;
            let variant = 'locked';
            if (dayNum < day) {
              variant = 'claimed';
            } else if (dayNum === day) {
              variant = 'current';
            }

            return (
              <div key={dayNum} className={`reward-day ${variant}`}>
                <span className="reward-day-label">Day {dayNum}</span>
                <div className="reward-day-circle">
                  {variant === 'claimed' ? (
                    <span className="reward-check">&#10003;</span>
                  ) : (
                    <span className="reward-xp">{reward}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="reward-amount">{xpReward} XP</div>

        <p className="reward-day-title">Day {day} Reward</p>

        {streakBonus > 0 && (
          <p className="reward-streak-bonus">
            Streak Bonus: +{streakBonus} XP
          </p>
        )}

        <div className="reward-claim">
          <GoldButton onClick={() => onClaim(total)}>
            Claim {total} XP
          </GoldButton>
        </div>
      </div>
    </div>
  );
}
