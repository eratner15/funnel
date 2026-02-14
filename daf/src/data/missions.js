export const MISSION_TEMPLATES = [
  {
    id: 'quiz',
    title: 'Parsha Quiz',
    icon: '\u{1F4DD}',
    xp: 40,
    type: 'quiz',
    description: 'Test your knowledge',
    estimatedMinutes: 3
  },
  {
    id: 'verse',
    title: 'Verse of the Day',
    icon: '\u{1F4D6}',
    xp: 20,
    type: 'verse',
    description: 'Reflect on today\'s verse',
    estimatedMinutes: 2
  },
  {
    id: 'commentary',
    title: 'Learn with Rashi',
    icon: '\u{1F4DC}',
    xp: 40,
    type: 'commentary',
    description: 'Explore commentary',
    estimatedMinutes: 5
  },
  {
    id: 'chavruta',
    title: 'AI Chavruta',
    icon: '\u{1F916}',
    xp: 30,
    type: 'chavruta',
    description: 'Study with AI partner',
    estimatedMinutes: 5
  },
  {
    id: 'challenge',
    title: 'Chavruta Challenge',
    icon: '\u{1F3C6}',
    xp: 20,
    type: 'challenge',
    description: 'Daily challenge',
    estimatedMinutes: 2
  }
];

export function generateDailyMissions() {
  const today = new Date().toISOString().split('T')[0];
  return MISSION_TEMPLATES.map(mission => ({
    ...mission,
    done: false,
    date: today
  }));
}
