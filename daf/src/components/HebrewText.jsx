import React from 'react';

export default function HebrewText({ children, size = 'medium', gold = false, className = '' }) {
  const sizeClass = size === 'large' ? 'hebrew-large' : size === 'small' ? 'hebrew-small' : '';

  return (
    <span
      className={`hebrew-text ${sizeClass} ${gold ? 'gold-text' : ''} ${className}`}
      dir="rtl"
      lang="he"
    >
      {children}
    </span>
  );
}
