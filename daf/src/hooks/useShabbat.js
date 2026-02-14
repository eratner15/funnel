import { useState, useEffect } from 'react';

function getNextFridaySunset() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 5=Fri

  let daysUntilFriday = (5 - dayOfWeek + 7) % 7;
  if (daysUntilFriday === 0) {
    // It's Friday - check if past sunset (~18:00)
    if (now.getHours() >= 18) {
      daysUntilFriday = 7;
    }
  }

  const friday = new Date(now);
  friday.setDate(now.getDate() + daysUntilFriday);
  friday.setHours(18, 0, 0, 0); // Approximate sunset at 6pm

  return friday;
}

function formatCountdown(ms) {
  if (ms <= 0) return { text: 'Shabbat Shalom!', isShabbat: true };

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);

  return { text: parts.join(' '), isShabbat: false };
}

export function useShabbat() {
  const [countdown, setCountdown] = useState({ text: '', isShabbat: false });
  const [nextShabbat, setNextShabbat] = useState(null);

  useEffect(() => {
    function update() {
      const target = getNextFridaySunset();
      setNextShabbat(target);
      const diff = target.getTime() - Date.now();
      setCountdown(formatCountdown(diff));
    }

    update();
    const interval = setInterval(update, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const dayName = nextShabbat
    ? nextShabbat.toLocaleDateString('en-US', { weekday: 'long' })
    : 'Friday';

  return {
    countdown: countdown.text,
    isShabbat: countdown.isShabbat,
    nextShabbat,
    dayName
  };
}
