import React, { useState } from 'react';
import GoldButton from '../components/GoldButton';
import { CURRENT_PARSHA } from '../data/parsha';

export default function VerseScreen({ userHook, awardXP, onBack }) {
  const [reflection, setReflection] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const verse = CURRENT_PARSHA.keyVerse;

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

      {/* ── Header ── */}
      <div className="verse-header fade-in-up">
        <button className="back-button" onClick={onBack}>←</button>
        <h2>Verse of the Day</h2>
        <div style={{ width: 32 }} />
      </div>

      {/* ── Verse Card ── */}
      <div className="verse-card fade-in-up" style={{ animationDelay: '0.06s' }}>
        <p className="verse-hebrew" dir="rtl">
          {verse.heb}
        </p>
        <p className="verse-english">
          {verse.en}
        </p>
        <p className="verse-ref">
          {verse.ref}
        </p>
      </div>

      {/* ── Reflection Section ── */}
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

      {/* ── Complete Button ── */}
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
