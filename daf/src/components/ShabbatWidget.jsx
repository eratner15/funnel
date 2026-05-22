import React from 'react';
import { useShabbat } from '../hooks/useShabbat';

export default function ShabbatWidget() {
  const { countdown, isShabbat, dayName } = useShabbat();

  return (
    <div className="shabbat-widget">
      <div className="shabbat-icon">🕯️</div>
      <div className="shabbat-info">
        <div className="shabbat-label">
          {isShabbat ? 'Shabbat Shalom!' : 'Candle Lighting'}
        </div>
        <div className="shabbat-time">
          {isShabbat ? 'Rest and reflect' : `${dayName} at sundown — ${countdown}`}
        </div>
      </div>
    </div>
  );
}
