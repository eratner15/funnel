import React, { useState } from 'react';
import GoldButton from '../components/GoldButton';
import Card from '../components/Card';

const FEATURES = [
  {
    label: 'Hearts',
    icon: '\u2764\uFE0F',
    free: '3 hearts, 30min regen',
    premium: 'Unlimited hearts',
  },
  {
    label: 'Streak',
    icon: '\uD83D\uDD25',
    free: 'No protection',
    premium: 'Streak Freeze (1/week)',
  },
  {
    label: 'XP',
    icon: '\u2B50',
    free: 'Standard XP',
    premium: '2x XP Boost on Shabbat',
  },
  {
    label: 'Content',
    icon: '\uD83D\uDCDA',
    free: '3 parshiyot',
    premium: 'All 54 parshiyot',
  },
  {
    label: 'Commentary',
    icon: '\uD83D\uDCDC',
    free: 'Basic commentary',
    premium: 'Deep Dive + Zohar, Tanya',
  },
  {
    label: 'AI Chavruta',
    icon: '\uD83E\uDD16',
    free: 'Limited responses',
    premium: 'Unlimited AI conversations',
  },
  {
    label: 'Ads',
    icon: '\uD83D\uDEAB',
    free: 'With promotions',
    premium: 'Ad-free experience',
  },
  {
    label: 'Analytics',
    icon: '\uD83D\uDCCA',
    free: 'Basic stats',
    premium: 'Full study analytics',
  },
];

export default function PremiumScreen({ onBack, userHook }) {
  const [selectedPlan, setSelectedPlan] = useState('annual');

  const handleSubscribe = () => {
    if (userHook && userHook.upgradePremium) {
      userHook.upgradePremium();
    }
    onBack();
  };

  return (
    <div className="screen premium-screen">
      <div className="container">

        {/* ── Header ── */}
        <header className="premium-header fade-in-up">
          <button className="back-button" onClick={onBack}>&larr;</button>
          <h2 className="premium-header-title">DAF Premium</h2>
          <div className="premium-header-spacer" />
        </header>

        {/* ── Hero Section ── */}
        <div className="premium-hero fade-in-up" style={{ animationDelay: '0.05s' }}>
          <div className="premium-icon">
            <span className="premium-icon-star">{'\u2721'}</span>
            <div className="premium-icon-shimmer" />
          </div>
          <h1 className="premium-headline">
            Unlock the Full<br />Torah Experience
          </h1>
          <p className="premium-subtext">
            Join thousands deepening their Torah knowledge
          </p>
        </div>

        {/* ── Feature Comparison ── */}
        <div className="premium-features fade-in-up" style={{ animationDelay: '0.10s' }}>
          <div className="premium-features-header">
            <span className="premium-features-col-label" />
            <span className="premium-features-col-label free-label">Free</span>
            <span className="premium-features-col-label premium-label">Premium</span>
          </div>

          {FEATURES.map((feature) => (
            <div className="feature-row" key={feature.label}>
              <div className="feature-label">
                <span className="feature-icon">{feature.icon}</span>
                <span className="feature-name">{feature.label}</span>
              </div>
              <div className="feature-free">{feature.free}</div>
              <div className="feature-premium">
                <span className="feature-premium-check">{'\u2713'}</span>
                {feature.premium}
              </div>
            </div>
          ))}
        </div>

        {/* ── Pricing Plans ── */}
        <div className="premium-plans fade-in-up" style={{ animationDelay: '0.15s' }}>
          <Card
            className={`plan-option ${selectedPlan === 'monthly' ? 'selected' : ''}`}
            onClick={() => setSelectedPlan('monthly')}
          >
            <div className="plan-option-radio">
              <div className={`plan-radio ${selectedPlan === 'monthly' ? 'plan-radio-active' : ''}`} />
            </div>
            <div className="plan-details">
              <span className="plan-name">Monthly</span>
              <span className="plan-price">$9.99<span className="plan-period">/month</span></span>
            </div>
          </Card>

          <Card
            className={`plan-option ${selectedPlan === 'annual' ? 'selected' : ''}`}
            onClick={() => setSelectedPlan('annual')}
          >
            <div className="plan-option-radio">
              <div className={`plan-radio ${selectedPlan === 'annual' ? 'plan-radio-active' : ''}`} />
            </div>
            <div className="plan-details">
              <span className="plan-name">Annual</span>
              <span className="plan-price">$59.99<span className="plan-period">/year</span></span>
            </div>
            <span className="plan-savings">Save 50%</span>
          </Card>
        </div>

        {/* ── CTA Button ── */}
        <div className="premium-cta fade-in-up" style={{ animationDelay: '0.20s' }}>
          <GoldButton onClick={handleSubscribe}>
            Start 7-Day Free Trial
          </GoldButton>
        </div>

        {/* ── Fine Print ── */}
        <p className="premium-fine-print fade-in-up" style={{ animationDelay: '0.25s' }}>
          Cancel anytime. No commitment.
        </p>

        {/* ── Social Proof ── */}
        <div className="premium-social-proof fade-in-up" style={{ animationDelay: '0.30s' }}>
          <span className="social-proof-number">4,892</span> Torah scholars upgraded this month
        </div>

      </div>
    </div>
  );
}
