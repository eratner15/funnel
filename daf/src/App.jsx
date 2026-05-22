import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useUser } from './hooks/useUser';
import TabBar from './components/TabBar';
import XPToast from './components/XPToast';
import LevelUpModal from './components/LevelUpModal';
import DailyRewardModal from './components/DailyRewardModal';
import UrgencyBanner from './components/UrgencyBanner';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import CommentaryScreen from './screens/CommentaryScreen';
import ChavrutaScreen from './screens/ChavrutaScreen';
import VerseScreen from './screens/VerseScreen';
import TreeScreen from './screens/TreeScreen';
import ExploreScreen from './screens/ExploreScreen';
import ProfileScreen from './screens/ProfileScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import PremiumScreen from './screens/PremiumScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';

const TAB_SCREENS = ['home', 'tree', 'explore', 'profile'];
const MODAL_SCREENS = ['quiz', 'commentary', 'chavruta', 'verse', 'challenge', 'premium', 'leaderboard'];

export default function App() {
  const userHook = useUser();
  const { user, addXP, canClaimDailyReward, getDailyRewardInfo, claimDailyReward } = userHook;
  const [activeTab, setActiveTab] = useState('home');
  const [activeScreen, setActiveScreen] = useState(null);
  const [xpToasts, setXpToasts] = useState([]);
  const [levelUpModal, setLevelUpModal] = useState(null);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [urgencyBanners, setUrgencyBanners] = useState([]);
  const promoRolled = useRef(false);

  // Show daily reward on first visit of the day
  useEffect(() => {
    if (user.onboarded && canClaimDailyReward()) {
      const timer = setTimeout(() => setShowDailyReward(true), 800);
      return () => clearTimeout(timer);
    }
  }, [user.onboarded, canClaimDailyReward]);

  // Check for urgency conditions
  useEffect(() => {
    if (!user.onboarded) return;
    const banners = [];
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Streak at risk (studied yesterday but not today yet)
    if (user.streak > 0 && user.lastStudyDate === yesterday) {
      banners.push({
        id: 'streak-risk',
        type: 'streak-risk',
        message: `${user.streak}-day streak at risk! Study now to keep it alive.`,
        action: 'Start Quiz',
        screen: 'quiz'
      });
    }

    // Hearts low
    if (user.hearts <= 1 && !user.isPremium) {
      banners.push({
        id: 'hearts-low',
        type: 'hearts-low',
        message: `Only ${user.hearts} heart${user.hearts === 1 ? '' : 's'} left! Go Premium for unlimited.`,
        action: 'Go Premium',
        screen: 'premium'
      });
    }

    // Premium promo (30% chance, rolled once per session)
    if (!user.isPremium && user.xp >= 50 && user.quizzesTaken >= 1 && !banners.length && !promoRolled.current) {
      promoRolled.current = true;
      if (Math.random() < 0.3) {
        banners.push({
          id: 'premium-promo',
          type: 'premium-promo',
          message: 'Unlock unlimited hearts, 2x XP & all 54 parshiyot!',
          action: 'Learn More',
          screen: 'premium'
        });
      }
    }

    setUrgencyBanners(banners);
  }, [user.onboarded, user.streak, user.lastStudyDate, user.hearts, user.isPremium, user.xp, user.quizzesTaken]);

  const showXPToast = useCallback((amount) => {
    const id = Date.now();
    setXpToasts(prev => [...prev, { id, amount }]);
  }, []);

  const removeToast = useCallback((id) => {
    setXpToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const awardXP = useCallback((amount) => {
    const result = addXP(amount);
    showXPToast(amount);
    // Check for level up
    if (result && result.leveledUp) {
      setTimeout(() => setLevelUpModal(result.newLevel), 600);
    }
    return result;
  }, [addXP, showXPToast]);

  const navigate = useCallback((screen) => {
    if (TAB_SCREENS.includes(screen)) {
      setActiveTab(screen);
      setActiveScreen(null);
    } else {
      setActiveScreen(screen);
    }
  }, []);

  const goBack = useCallback(() => {
    setActiveScreen(null);
  }, []);

  const handleDailyRewardClaim = useCallback(() => {
    const reward = claimDailyReward();
    setShowDailyReward(false);
    if (reward && reward.total > 0) {
      showXPToast(reward.total);
    }
  }, [claimDailyReward, showXPToast]);

  const dismissBanner = useCallback((id) => {
    setUrgencyBanners(prev => prev.filter(b => b.id !== id));
  }, []);

  // Show onboarding if user hasn't been onboarded
  if (!user.onboarded) {
    return (
      <div className="app-container">
        <OnboardingScreen userHook={userHook} />
      </div>
    );
  }

  const isModal = activeScreen && MODAL_SCREENS.includes(activeScreen);

  const renderScreen = () => {
    if (activeScreen === 'quiz') {
      return <QuizScreen userHook={userHook} awardXP={awardXP} onBack={goBack} />;
    }
    if (activeScreen === 'commentary') {
      return <CommentaryScreen userHook={userHook} awardXP={awardXP} onBack={goBack} />;
    }
    if (activeScreen === 'chavruta') {
      return <ChavrutaScreen userHook={userHook} awardXP={awardXP} onBack={goBack} />;
    }
    if (activeScreen === 'verse') {
      return <VerseScreen userHook={userHook} awardXP={awardXP} onBack={goBack} />;
    }
    if (activeScreen === 'challenge') {
      return <QuizScreen userHook={userHook} awardXP={awardXP} onBack={goBack} missionType="challenge" />;
    }
    if (activeScreen === 'premium') {
      return <PremiumScreen userHook={userHook} onBack={goBack} />;
    }
    if (activeScreen === 'leaderboard') {
      return <LeaderboardScreen userHook={userHook} onBack={goBack} />;
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen userHook={userHook} navigate={navigate} />;
      case 'tree':
        return <TreeScreen userHook={userHook} />;
      case 'explore':
        return <ExploreScreen navigate={navigate} />;
      case 'profile':
        return <ProfileScreen userHook={userHook} navigate={navigate} />;
      default:
        return <HomeScreen userHook={userHook} navigate={navigate} />;
    }
  };

  const rewardInfo = getDailyRewardInfo();

  return (
    <div className="app-container">
      {/* XP Toasts */}
      {xpToasts.map(toast => (
        <XPToast
          key={toast.id}
          amount={toast.amount}
          onDone={() => removeToast(toast.id)}
        />
      ))}

      {/* Urgency Banners */}
      {urgencyBanners.map(banner => (
        <UrgencyBanner
          key={banner.id}
          type={banner.type}
          message={banner.message}
          action={banner.action}
          onAction={() => {
            dismissBanner(banner.id);
            navigate(banner.screen);
          }}
          onDismiss={() => dismissBanner(banner.id)}
        />
      ))}

      {/* Level Up Modal */}
      {levelUpModal && (
        <LevelUpModal
          level={levelUpModal}
          onClose={() => setLevelUpModal(null)}
        />
      )}

      {/* Daily Reward Modal */}
      {showDailyReward && (
        <DailyRewardModal
          day={rewardInfo.day}
          xpReward={rewardInfo.xp}
          streakBonus={rewardInfo.streakBonus}
          onClaim={handleDailyRewardClaim}
        />
      )}

      {/* Screen content */}
      <div className={`screen-wrapper ${isModal ? 'modal' : ''}`}>
        {renderScreen()}
      </div>

      {/* Tab bar (hidden during modal screens) */}
      {!isModal && (
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
}
