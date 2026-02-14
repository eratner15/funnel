import React, { useEffect } from 'react';

const TYPE_ICONS = {
  'streak-risk': '\uD83D\uDD25',
  'hearts-low': '\uD83D\uDC94',
  'premium-promo': '\u2721',
  'achievement': '\uD83C\uDFC6',
};

export default function UrgencyBanner({ type, message, action, onAction, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onDismiss) {
        onDismiss();
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const icon = TYPE_ICONS[type] || '';

  return (
    <div className={`urgency-banner ${type}`}>
      <span className="urgency-banner-icon">{icon}</span>

      <span className="urgency-banner-message">{message}</span>

      {action && onAction && (
        <button className="urgency-banner-action" onClick={onAction}>
          {action}
        </button>
      )}

      <button className="urgency-banner-dismiss" onClick={onDismiss} aria-label="Dismiss">
        &#10005;
      </button>
    </div>
  );
}
