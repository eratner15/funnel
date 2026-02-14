import React, { useEffect, useState } from 'react';

export default function XPToast({ amount, onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 400);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={`xp-toast ${visible ? 'show' : 'hide'}`}>
      <span className="xp-toast-icon">✡</span>
      <span className="xp-toast-text">+{amount} XP</span>
    </div>
  );
}
