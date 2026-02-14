import React from 'react';

export default function GoldButton({ children, onClick, variant = 'primary', disabled = false, style = {} }) {
  const className = variant === 'outline' ? 'outline-button' : 'gold-button';

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}
