// Growth Tree & Achievements - Gamification System
// DAF Torah Study App

export const TREE_STAGES = [
  {
    level: 0,
    name: 'Seed',
    emoji: '🌰',
    xpRequired: 0,
    description: 'A tiny seed holding infinite potential',
    unlockMessage: 'Every journey begins here'
  },
  {
    level: 1,
    name: 'Sprout',
    emoji: '🌱',
    xpRequired: 100,
    description: 'The first green shoot breaks through the soil',
    unlockMessage: 'First roots taking hold'
  },
  {
    level: 2,
    name: 'Sapling',
    emoji: '🌿',
    xpRequired: 300,
    description: 'Young and flexible, growing toward the light',
    unlockMessage: 'Growing stronger each day'
  },
  {
    level: 3,
    name: 'Young Tree',
    emoji: '🌳',
    xpRequired: 600,
    description: 'Strong trunk, spreading branches, bearing fruit',
    unlockMessage: 'Branches reaching skyward'
  },
  {
    level: 4,
    name: 'Mighty Oak',
    emoji: '🌲',
    xpRequired: 1000,
    description: 'Deep roots, wide canopy, sheltering others',
    unlockMessage: 'Deep roots, wide canopy'
  },
  {
    level: 5,
    name: 'Etz Chaim',
    emoji: '✡️',
    xpRequired: 1500,
    description: 'The Tree of Life — עץ חיים היא למחזיקים בה',
    unlockMessage: 'A Tree of Life for those who hold fast'
  }
];

export const ACHIEVEMENTS = [
  {
    id: 'first_quiz',
    title: 'First Steps',
    description: 'Complete your first quiz',
    icon: '📝',
    condition: 'Complete 1 quiz'
  },
  {
    id: 'first_verse',
    title: 'Words of Torah',
    description: 'Study your first verse of the day',
    icon: '📖',
    condition: 'Complete 1 verse study'
  },
  {
    id: 'first_chavruta',
    title: 'Study Partner',
    description: 'Have your first AI chavruta conversation',
    icon: '🤝',
    condition: 'Complete 1 chavruta session'
  },
  {
    id: 'first_commentary',
    title: 'Learning with the Sages',
    description: 'Read your first commentary session',
    icon: '📜',
    condition: 'Complete 1 commentary session'
  },
  {
    id: 'streak_3',
    title: 'Consistent Learner',
    description: 'Study for 3 days in a row',
    icon: '🔥',
    condition: 'Maintain a 3-day streak'
  },
  {
    id: 'streak_7',
    title: 'Weekly Scholar',
    description: 'Study every day for a full week',
    icon: '⭐',
    condition: 'Maintain a 7-day streak'
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: 'Study every day for a full month',
    icon: '👑',
    condition: 'Maintain a 30-day streak'
  },
  {
    id: 'xp_100',
    title: 'Sprout',
    description: 'Earn 100 XP total',
    icon: '🌱',
    condition: 'Accumulate 100 XP'
  },
  {
    id: 'xp_500',
    title: 'Growing Strong',
    description: 'Earn 500 XP total',
    icon: '🌿',
    condition: 'Accumulate 500 XP'
  },
  {
    id: 'xp_1000',
    title: 'Torah Tree',
    description: 'Earn 1000 XP total',
    icon: '🌳',
    condition: 'Accumulate 1000 XP'
  },
  {
    id: 'all_missions',
    title: 'Mission Complete',
    description: 'Complete all daily missions in one day',
    icon: '🏆',
    condition: 'Complete all 5 daily missions in a single day'
  },
  {
    id: 'parsha_complete',
    title: 'Parsha Scholar',
    description: 'Complete all activities for one parsha',
    icon: '🎓',
    condition: 'Complete quiz, verse, commentary, and chavruta for one parsha'
  }
];

/**
 * Get the current tree stage based on XP.
 * @param {number} xp - The user's total XP
 * @returns {object} The current tree stage object
 */
export function getTreeStage(xp) {
  let currentStage = TREE_STAGES[0];
  for (let i = TREE_STAGES.length - 1; i >= 0; i--) {
    if (xp >= TREE_STAGES[i].xpRequired) {
      currentStage = TREE_STAGES[i];
      break;
    }
  }
  return currentStage;
}

/**
 * Get the next tree stage based on XP, or null if at max level.
 * @param {number} xp - The user's total XP
 * @returns {object|null} The next tree stage object, or null if at max
 */
export function getNextStage(xp) {
  const currentStage = getTreeStage(xp);
  const nextIndex = currentStage.level + 1;
  if (nextIndex >= TREE_STAGES.length) {
    return null;
  }
  return TREE_STAGES[nextIndex];
}

/**
 * Get progress toward the next stage as a value between 0 and 1.
 * Returns 1 if at the maximum stage.
 * @param {number} xp - The user's total XP
 * @returns {number} Progress from 0 to 1
 */
export function getStageProgress(xp) {
  const currentStage = getTreeStage(xp);
  const nextStage = getNextStage(xp);

  if (!nextStage) {
    return 1;
  }

  const stageXpStart = currentStage.xpRequired;
  const stageXpEnd = nextStage.xpRequired;
  const xpIntoStage = xp - stageXpStart;
  const stageXpRange = stageXpEnd - stageXpStart;

  return Math.min(1, Math.max(0, xpIntoStage / stageXpRange));
}
