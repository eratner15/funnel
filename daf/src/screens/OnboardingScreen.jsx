import React, { useState } from 'react';
import GoldButton from '../components/GoldButton';

const SLIDES = [
  {
    emoji: '🌳',
    title: 'Welcome to DAF',
    subtitle: 'Torah study, reimagined',
  },
  {
    emoji: '📝📖📜🤖🏆',
    title: 'Your Daily Torah Habit',
    subtitle: '5 minutes a day. That\'s all it takes.',
  },
  {
    emoji: '🌰 → 🌱 → 🌿 → 🌳 → 🌲 → ✡️',
    title: 'Grow Your Etz Chaim',
    subtitle: 'Watch your tree flourish as you learn',
  },
];

export default function OnboardingScreen({ userHook }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [name, setName] = useState('');
  const [direction, setDirection] = useState('right');

  const isLastSlide = currentSlide === SLIDES.length - 1;
  const slide = SLIDES[currentSlide];

  const goNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setDirection('right');
      setCurrentSlide((s) => s + 1);
    }
  };

  const goBack = () => {
    if (currentSlide > 0) {
      setDirection('left');
      setCurrentSlide((s) => s - 1);
    }
  };

  const handleGetStarted = () => {
    if (name.trim()) {
      userHook.setName(name.trim());
    }
  };

  return (
    <div className="screen onboarding-screen">

      {/* ── Slide Content ── */}
      <div
        className={`onboarding-slide slide-${direction}`}
        key={currentSlide}
      >
        <div className="onboarding-emoji">{slide.emoji}</div>
        <h1 className="onboarding-title">{slide.title}</h1>
        <p className="onboarding-subtitle">{slide.subtitle}</p>

        {/* ── Name Input (Last Slide) ── */}
        {isLastSlide && (
          <div className="onboarding-name-section">
            <label className="onboarding-name-label">What's your name?</label>
            <input
              type="text"
              className="onboarding-name-input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) handleGetStarted(); }}
              autoFocus
            />
          </div>
        )}
      </div>

      {/* ── Dot Indicators ── */}
      <div className="onboarding-dots">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={`onboarding-dot ${i === currentSlide ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* ── Navigation ── */}
      <div className="onboarding-actions">
        {currentSlide > 0 && (
          <button className="onboarding-back-btn" onClick={goBack}>
            Back
          </button>
        )}

        {!isLastSlide ? (
          <GoldButton onClick={goNext}>
            Next
          </GoldButton>
        ) : (
          <GoldButton
            onClick={handleGetStarted}
            disabled={!name.trim()}
          >
            Get Started
          </GoldButton>
        )}
      </div>

    </div>
  );
}
