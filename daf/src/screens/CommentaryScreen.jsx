import React, { useState, useEffect, useRef } from 'react';
import GoldButton from '../components/GoldButton';
import { COMMENTARY_BANK } from '../data/commentary';
import { CURRENT_PARSHA } from '../data/parsha';

const SPEAKERS = {
  narrator: { name: 'Narrator', avatar: null, color: 'var(--text-muted)', italic: true },
  rashi: { name: 'Rashi', avatar: '📜', color: '#f2c027', accent: 'var(--gold)' },
  ramban: { name: 'Ramban', avatar: '🏛️', color: '#5ba3cf', accent: 'var(--blue)' },
  ibn_ezra: { name: 'Ibn Ezra', avatar: '🔭', color: '#b39ddb', accent: '#b39ddb' },
};

export default function CommentaryScreen({ userHook, awardXP, onBack }) {
  const parshaName = CURRENT_PARSHA ? CURRENT_PARSHA.name : null;
  const commentary = (parshaName && COMMENTARY_BANK[parshaName]) || Object.values(COMMENTARY_BANK)[0];
  const messages = commentary.messages;
  const total = messages.length;

  const [visibleMessages, setVisibleMessages] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasAwarded, setHasAwarded] = useState(false);

  const chatRef = useRef(null);

  useEffect(() => {
    if (visibleMessages >= total) {
      setIsComplete(true);
      return;
    }

    let revealTimer;
    const timer = setTimeout(() => {
      setIsTyping(true);

      revealTimer = setTimeout(() => {
        setIsTyping(false);
        setVisibleMessages((prev) => prev + 1);
      }, 1000);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(revealTimer);
    };
  }, [visibleMessages, total]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [visibleMessages, isTyping]);

  const handleComplete = () => {
    if (hasAwarded) return;
    setHasAwarded(true);
    awardXP(40);
    userHook.completeMission('commentary', { xp: 40 });
    userHook.addAchievement('first_commentary');
    onBack();
  };

  return (
    <div className="screen commentary-screen">
      <div className="commentary-header">
        <button className="back-button" onClick={onBack}>←</button>
        <div className="commentary-header-text">
          <h2>{commentary.title}</h2>
          <span className="commentary-ref">{commentary.ref}</span>
        </div>
        <span className="message-counter">
          {visibleMessages}/{total}
        </span>
      </div>

      <div className="chat-area" ref={chatRef}>
        {messages.slice(0, visibleMessages).map((msg, i) => {
          const speaker = SPEAKERS[msg.speaker] || SPEAKERS.narrator;
          return (
            <div
              key={i}
              className={`chat-message ${msg.speaker}`}
              style={{
                animation: `slideUp 0.4s ease ${i * 0.05}s both`,
              }}
            >
              {speaker.avatar && (
                <div
                  className="chat-avatar"
                  style={{ borderColor: speaker.accent || speaker.color }}
                >
                  {speaker.avatar}
                </div>
              )}
              <div className="chat-content">
                <span
                  className="chat-speaker-name"
                  style={{ color: speaker.color }}
                >
                  {speaker.name}
                </span>
                <p
                  className="chat-text"
                  style={speaker.italic ? { fontStyle: 'italic' } : {}}
                >
                  {msg.text}
                </p>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="typing-indicator">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}

        {isComplete && (
          <div className="commentary-complete-card">
            <h3>Commentary Complete</h3>
            <div className="xp-reward">+40 XP</div>
            <GoldButton onClick={handleComplete}>Continue</GoldButton>
          </div>
        )}
      </div>
    </div>
  );
}
