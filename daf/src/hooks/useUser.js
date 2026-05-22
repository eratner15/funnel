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
  onboarded: false,
  // Premium & Gamification
  isPremium: false,
  premiumSince: null,
  dailyRewardDay: 0,
  lastDailyReward: null,
  streakFreezeAvailable: false,
  streakFreezeUsedThisWeek: null,
  totalStudyDays: 0,
  totalCommentaries: 0,
  totalReflections: 0,
  joinDate: null,
  weeklyXP: {},
  xpMultiplier: 1
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

function getWeekKey() {
  const d = new Date();
  const daysSinceEpoch = Math.floor(d.getTime() / 86400000);
  const weekNum = Math.floor((daysSinceEpoch + 3) / 7); // weeks since epoch, aligned to Monday
  return `W${weekNum}`;
}

export const DAILY_REWARDS = [10, 10, 15, 15, 20, 20, 50]; // 7-day cycle

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
    const REGEN_MS = 30 * 60 * 1000;
    const interval = setInterval(() => {
      setUser(prev => {
        if (prev.hearts >= 3) return prev;
        const elapsed = Date.now() - prev.heartsLastRegen;
        const heartsToRegen = Math.floor(elapsed / REGEN_MS);
        if (heartsToRegen > 0) {
          const newHearts = Math.min(3, prev.hearts + heartsToRegen);
          return {
            ...prev,
            hearts: newHearts,
            heartsLastRegen: prev.heartsLastRegen + heartsToRegen * REGEN_MS
          };
        }
        return prev;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [user.hearts]);

  const addXP = useCallback((amount) => {
    let leveledUp = false;
    let newLevelValue = null;
    setUser(prev => {
      const multiplied = Math.round(amount * prev.xpMultiplier);
      const newXP = prev.xp + multiplied;
      const newLevel = calculateLevel(newXP);
      if (newLevel > prev.level) {
        leveledUp = true;
        newLevelValue = newLevel;
      }
      const weekKey = getWeekKey();
      const weeklyXP = {};
      weeklyXP[weekKey] = ((prev.weeklyXP || {})[weekKey] || 0) + multiplied;
      // XP milestone achievements
      const achievements = [...prev.achievements];
      if (newXP >= 100 && !achievements.includes('xp_100')) achievements.push('xp_100');
      if (newXP >= 500 && !achievements.includes('xp_500')) achievements.push('xp_500');
      if (newXP >= 1000 && !achievements.includes('xp_1000')) achievements.push('xp_1000');
      return { ...prev, xp: newXP, level: newLevel, weeklyXP, achievements };
    });
    return { amount, leveledUp, newLevel: newLevelValue };
  }, []);

  const completeMission = useCallback((missionType, data = {}) => {
    const today = getToday();
    setUser(prev => {
      const todayMissions = prev.missions[today] || {};
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      let newStreak = prev.streak;
      if (prev.lastStudyDate !== today) {
        if (prev.lastStudyDate === yesterday) {
          newStreak = prev.streak + 1;
        } else {
          newStreak = 1;
        }
      }

      const updatedMissions = {
        ...todayMissions,
        [missionType]: { done: true, ...data }
      };

      // Check achievements
      const achievements = [...prev.achievements];
      if (newStreak >= 3 && !achievements.includes('streak_3')) achievements.push('streak_3');
      if (newStreak >= 7 && !achievements.includes('streak_7')) achievements.push('streak_7');
      if (newStreak >= 30 && !achievements.includes('streak_30')) achievements.push('streak_30');

      // All daily missions completed
      const MISSION_TYPES = ['quiz', 'verse', 'commentary', 'chavruta', 'challenge'];
      const allDone = MISSION_TYPES.every(t => updatedMissions[t]?.done);
      if (allDone && !achievements.includes('all_missions')) achievements.push('all_missions');

      // Parsha completion: quiz + verse + commentary + chavruta done today
      const coreTypes = ['quiz', 'verse', 'commentary', 'chavruta'];
      const parshaComplete = coreTypes.every(t => updatedMissions[t]?.done);
      const completedParshiyot = [...prev.completedParshiyot];
      if (parshaComplete && !completedParshiyot.includes(today)) {
        completedParshiyot.push(today);
        if (!achievements.includes('parsha_complete')) achievements.push('parsha_complete');
      }

      return {
        ...prev,
        missions: { ...prev.missions, [today]: updatedMissions },
        lastStudyDate: today,
        streak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        totalStudyDays: prev.lastStudyDate !== today ? prev.totalStudyDays + 1 : prev.totalStudyDays,
        achievements,
        completedParshiyot
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
    setUser(prev => ({ ...prev, name, onboarded: true, joinDate: prev.joinDate || getToday() }));
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

  const upgradePremium = useCallback(() => {
    setUser(prev => ({
      ...prev,
      isPremium: true,
      premiumSince: getToday(),
      streakFreezeAvailable: true,
      xpMultiplier: 1
    }));
  }, []);

  const useStreakFreeze = useCallback(() => {
    setUser(prev => {
      if (!prev.isPremium || !prev.streakFreezeAvailable) return prev;
      return {
        ...prev,
        streakFreezeAvailable: false,
        streakFreezeUsedThisWeek: getToday()
      };
    });
  }, []);

  const claimDailyReward = useCallback(() => {
    const today = getToday();
    let reward = { xp: 0, streakBonus: 0, day: 0 };
    setUser(prev => {
      if (prev.lastDailyReward === today) return prev;
      const newDay = (prev.dailyRewardDay % 7) + 1;
      const baseXP = DAILY_REWARDS[newDay - 1];
      const streakBonus = prev.streak >= 7 ? 10 : prev.streak >= 3 ? 5 : 0;
      const totalXP = baseXP + streakBonus;
      reward = { xp: baseXP, streakBonus, day: newDay, total: totalXP };
      const newXP = prev.xp + totalXP;
      const weekKey = getWeekKey();
      const weeklyXP = {};
      weeklyXP[weekKey] = ((prev.weeklyXP || {})[weekKey] || 0) + totalXP;
      return {
        ...prev,
        xp: newXP,
        level: calculateLevel(newXP),
        dailyRewardDay: newDay,
        lastDailyReward: today,
        totalStudyDays: prev.totalStudyDays + 1,
        weeklyXP
      };
    });
    return reward;
  }, []);

  const canClaimDailyReward = useCallback(() => {
    return user.lastDailyReward !== getToday();
  }, [user.lastDailyReward]);

  const getDailyRewardInfo = useCallback(() => {
    const nextDay = (user.dailyRewardDay % 7) + 1;
    const baseXP = DAILY_REWARDS[nextDay - 1];
    const streakBonus = user.streak >= 7 ? 10 : user.streak >= 3 ? 5 : 0;
    return { day: nextDay, xp: baseXP, streakBonus, total: baseXP + streakBonus };
  }, [user.dailyRewardDay, user.streak]);

  const getWeeklyXP = useCallback(() => {
    return user.weeklyXP[getWeekKey()] || 0;
  }, [user.weeklyXP]);

  const getStudyStats = useCallback(() => {
    const daysSinceJoin = user.joinDate
      ? Math.max(1, Math.floor((Date.now() - new Date(user.joinDate).getTime()) / 86400000))
      : 1;
    return {
      totalXP: user.xp,
      totalDays: user.totalStudyDays,
      avgDailyXP: user.totalStudyDays > 0 ? Math.round(user.xp / user.totalStudyDays) : 0,
      quizzesTaken: user.quizzesTaken,
      reflections: user.reflections.length,
      longestStreak: user.longestStreak,
      currentStreak: user.streak,
      daysSinceJoin,
      weeklyXP: getWeeklyXP(),
      achievements: user.achievements.length,
      isPremium: user.isPremium
    };
  }, [user, getWeeklyXP]);

  // Enable Shabbat XP boost on Fridays/Saturdays for premium users
  useEffect(() => {
    const day = new Date().getDay(); // 0=Sun, 5=Fri, 6=Sat
    const isShabbat = day === 5 || day === 6;
    if (user.isPremium && isShabbat && user.xpMultiplier !== 2) {
      setUser(prev => ({ ...prev, xpMultiplier: 2 }));
    } else if ((!user.isPremium || !isShabbat) && user.xpMultiplier !== 1) {
      setUser(prev => ({ ...prev, xpMultiplier: 1 }));
    }
  }, [user.isPremium, user.xpMultiplier]);

  // Reset streak freeze weekly (every Sunday)
  useEffect(() => {
    if (!user.isPremium) return;
    const day = new Date().getDay();
    if (day === 0 && user.streakFreezeUsedThisWeek) {
      const usedDate = new Date(user.streakFreezeUsedThisWeek);
      const today = new Date();
      if (usedDate < today && today.getDay() === 0) {
        setUser(prev => ({ ...prev, streakFreezeAvailable: true, streakFreezeUsedThisWeek: null }));
      }
    }
  }, [user.isPremium, user.streakFreezeUsedThisWeek]);

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
    resetUser,
    // Premium & Gamification
    upgradePremium,
    useStreakFreeze,
    claimDailyReward,
    canClaimDailyReward,
    getDailyRewardInfo,
    getWeeklyXP,
    getStudyStats
  };
}
