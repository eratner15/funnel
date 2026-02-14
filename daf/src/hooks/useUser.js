import { useState, useEffect, useCallback } from 'react';

const DEFAULT_USER = {
  name: '',
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  missions: {},
  completedParshiyot: [],
  quizzesTaken: 0,
  reflections: [],
  achievements: [],
  hearts: 3,
  heartsLastRegen: Date.now(),
  settings: {
    shabbatMode: true,
    notifications: true,
    language: 'en'
  },
  onboarded: false
};

const STORAGE_KEY = 'daf_user';

function loadUser() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_USER, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load user data:', e);
  }
  return { ...DEFAULT_USER };
}

function saveUser(user) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user data:', e);
  }
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function calculateLevel(xp) {
  if (xp >= 1500) return 6;
  if (xp >= 1000) return 5;
  if (xp >= 600) return 4;
  if (xp >= 300) return 3;
  if (xp >= 100) return 2;
  return 1;
}

export function useUser() {
  const [user, setUser] = useState(loadUser);

  useEffect(() => {
    saveUser(user);
  }, [user]);

  // Check and update streak on load
  useEffect(() => {
    const today = getToday();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (user.lastStudyDate && user.lastStudyDate !== today && user.lastStudyDate !== yesterday) {
      // Streak broken - more than 1 day gap
      setUser(prev => ({ ...prev, streak: 0 }));
    }
  }, []);

  // Heart regeneration (1 heart every 30 minutes, max 3)
  useEffect(() => {
    if (user.hearts >= 3) return;
    const interval = setInterval(() => {
      setUser(prev => {
        const elapsed = Date.now() - prev.heartsLastRegen;
        const heartsToRegen = Math.floor(elapsed / (30 * 60 * 1000));
        if (heartsToRegen > 0) {
          return {
            ...prev,
            hearts: Math.min(3, prev.hearts + heartsToRegen),
            heartsLastRegen: Date.now()
          };
        }
        return prev;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [user.hearts]);

  const addXP = useCallback((amount) => {
    setUser(prev => {
      const newXP = prev.xp + amount;
      const newLevel = calculateLevel(newXP);
      return { ...prev, xp: newXP, level: newLevel };
    });
    return amount;
  }, []);

  const completeMission = useCallback((missionType, data = {}) => {
    const today = getToday();
    setUser(prev => {
      const todayMissions = prev.missions[today] || {};
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      let newStreak = prev.streak;
      // Only bump streak on first mission of the day
      if (prev.lastStudyDate !== today) {
        if (prev.lastStudyDate === yesterday) {
          newStreak = prev.streak + 1;  // Consecutive day
        } else {
          newStreak = 1;  // First session or missed days
        }
      }

      return {
        ...prev,
        missions: {
          ...prev.missions,
          [today]: {
            ...todayMissions,
            [missionType]: { done: true, ...data }
          }
        },
        lastStudyDate: today,
        streak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak)
      };
    });
  }, []);

  const loseHeart = useCallback(() => {
    setUser(prev => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1),
      heartsLastRegen: prev.hearts === 3 ? Date.now() : prev.heartsLastRegen
    }));
  }, []);

  const setName = useCallback((name) => {
    setUser(prev => ({ ...prev, name, onboarded: true }));
  }, []);

  const addAchievement = useCallback((achievementId) => {
    setUser(prev => {
      if (prev.achievements.includes(achievementId)) return prev;
      return { ...prev, achievements: [...prev.achievements, achievementId] };
    });
  }, []);

  const incrementQuizzes = useCallback(() => {
    setUser(prev => ({ ...prev, quizzesTaken: prev.quizzesTaken + 1 }));
  }, []);

  const addReflection = useCallback((reflection) => {
    setUser(prev => ({
      ...prev,
      reflections: [...prev.reflections, { ...reflection, date: getToday() }]
    }));
  }, []);

  const getTodayMissions = useCallback(() => {
    return user.missions[getToday()] || {};
  }, [user.missions]);

  const getDailyXP = useCallback(() => {
    const todayMissions = user.missions[getToday()] || {};
    return Object.values(todayMissions).reduce((sum, m) => sum + (m.xp || 0), 0);
  }, [user.missions]);

  const resetUser = useCallback(() => {
    setUser({ ...DEFAULT_USER });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    user,
    addXP,
    completeMission,
    loseHeart,
    setName,
    addAchievement,
    incrementQuizzes,
    addReflection,
    getTodayMissions,
    getDailyXP,
    resetUser
  };
}
