import React from 'react';
import Card from '../components/Card';
import GoldButton from '../components/GoldButton';
import ProgressBar from '../components/ProgressBar';
import { LEARNING_PATHS } from '../data/paths';

export default function ExploreScreen({ navigate }) {
  return (
    <div className="screen explore-screen">
      <div className="container">

        {/* ── Header ── */}
        <header className="explore-header fade-in-up">
          <h1>Explore</h1>
        </header>

        {/* ── Search Bar (Cosmetic) ── */}
        <div className="explore-search fade-in-up" style={{ animationDelay: '0.04s' }}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search topics, parshiyot, concepts..."
            readOnly
          />
        </div>

        {/* ── Learning Paths Grid ── */}
        <section className="paths-section fade-in-up" style={{ animationDelay: '0.08s' }}>
          <h3 className="section-title">Learning Paths</h3>
          <div className="paths-grid">
            {LEARNING_PATHS.map((path, index) => (
              <Card
                key={path.id}
                className="path-card"
                style={{ animationDelay: `${0.12 + index * 0.04}s` }}
              >
                <span className="path-icon">{path.icon}</span>
                <h4 className="path-title">{path.title}</h4>
                <p className="path-subtitle">{path.subtitle}</p>
                <span className="path-lessons">{path.lessonCount} lessons</span>
                <ProgressBar value={0} max={path.lessonCount} height={4} />
              </Card>
            ))}
          </div>
        </section>

        {/* ── AI Chavruta CTA ── */}
        <Card className="chavruta-cta fade-in-up" style={{ animationDelay: '0.36s' }}>
          <span className="chavruta-cta-icon">🤖</span>
          <h3 className="chavruta-cta-title">Ask the Torah anything</h3>
          <p className="chavruta-cta-subtitle">Powered by Sefaria + AI</p>
          <GoldButton onClick={() => navigate('chavruta')}>
            Start a Conversation
          </GoldButton>
        </Card>

      </div>
    </div>
  );
}
