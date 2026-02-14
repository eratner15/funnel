import React, { useState } from 'react';
import GoldButton from '../components/GoldButton';
import HebrewText from '../components/HebrewText';
import { CURRENT_PARSHA } from '../data/parsha';

export default function VerseScreen({ userHook, awardXP, onBack }) {
  const [reflection, setReflection] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const verse = CURRENT_PARSHA ? CURRENT_PARSHA.keyVerse : null;

  if (!verse) {
    return (
      <div className="screen verse-screen">
        <div className="container" style={{ paddingTop: 80, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>No verse available.</p>
          <GoldButton onClick={onBack}>Go Back</GoldButton>
        </div>
      </div>
    );
  }

  const handleComplete = () => {
    if (isComplete) return;
    setIsComplete(true);
    awardXP(20);
    userHook.completeMission('verse', { xp: 20 });
    if (reflection.trim()) {
      userHook.addReflection({ verse: verse.ref, text: reflection });
    }
    userHook.addAchievement('first_verse');
    onBack();
  };

  const handleSkip = () => {
    if (isComplete) return;
    setIsComplete(true);
    awardXP(20);
    userHook.completeMission('verse', { xp: 20 });
    userHook.addAchievement('first_verse');
    onBack();
  };

  return (
    <div className="screen verse-screen">

      {/* Header */}
      <div className="verse-header fade-in-up">
        <button className="back-button" onClick={onBack}>&larr;</button>
        <h2>Verse of the Day</h2>
        <div style={{ width: 32 }} />
      </div>

      {/* Verse Card */}
      <div className="verse-card fade-in-up" style={{ animationDelay: '0.06s' }}>
        <HebrewText size="large" gold className="verse-hebrew">
          {verse.heb}
        </HebrewText>
        <p className="verse-english">
          &ldquo;{verse.en}&rdquo;
        </p>
        <p className="verse-ref">
          {verse.ref}
        </p>
      </div>

      {/* Reflection */}
      <div className="verse-reflection fade-in-up" style={{ animationDelay: '0.12s' }}>
        <label className="reflection-label">
          What does this verse mean to you today?
        </label>
        <textarea
          className="reflection-input"
          rows={3}
          placeholder="Write your thoughts..."
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="verse-actions fade-in-up" style={{ animationDelay: '0.18s' }}>
        <GoldButton onClick={handleComplete} disabled={isComplete}>
          Complete +20 XP
        </GoldButton>
        <button
          className="skip-link"
          onClick={handleSkip}
          disabled={isComplete}
        >
          Skip reflection
        </button>
      </div>

    </div>
  );
}
