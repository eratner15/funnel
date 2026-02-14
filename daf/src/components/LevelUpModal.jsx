import React from 'react';
import GoldButton from '../components/GoldButton';

const motivationalMessages = {
  1: 'The journey begins!',
  2: 'Building a foundation!',
  3: 'Growing in wisdom!',
  4: 'A true talmid chacham!',
  5: 'Master scholar!',
  6: 'Etz Chaim — the pinnacle!',
};

export default function LevelUpModal({ level, onClose }) {
  const message = motivationalMessages[level] || motivationalMessages[6];

  return (
    <div className="level-up-overlay">
      <div className="level-up-modal">
        {Array.from({ length: 8 }, (_, i) => (
          <span
            key={i}
            className="confetti-particle"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}

        <div className="level-up-number">{level}</div>

        <h1 className="level-up-heading">Level Up!</h1>

        <p className="level-up-subtitle">You've reached Level {level}</p>

        <p className="level-up-message">{message}</p>

        <GoldButton onClick={onClose}>Continue Learning</GoldButton>
      </div>
    </div>
  );
}
