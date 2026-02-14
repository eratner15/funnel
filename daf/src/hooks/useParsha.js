import { useState, useEffect } from 'react';

// Simplified parsha calculation
// In production, this would use the Hebrew calendar
// For now, we return Mishpatim as the current parsha
export function useParsha() {
  const [currentParsha, setCurrentParsha] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dynamic import of parsha data
    import('../data/parsha.js').then(({ CURRENT_PARSHA, PARSHA_SCHEDULE }) => {
      setCurrentParsha(CURRENT_PARSHA);
      setLoading(false);
    });
  }, []);

  return { currentParsha, loading };
}
