import React, { useEffect } from 'react';

export default function XPToast({ amount, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="xp-toast">
      <span className="xp-toast-icon">✡</span>
      <span className="xp-toast-text">+{amount} XP</span>
    </div>
  );
}
