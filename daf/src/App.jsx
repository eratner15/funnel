import React, { useState, useCallback } from 'react';
import { useUser } from './hooks/useUser';
import TabBar from './components/TabBar';
import XPToast from './components/XPToast';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import CommentaryScreen from './screens/CommentaryScreen';
import ChavrutaScreen from './screens/ChavrutaScreen';
import VerseScreen from './screens/VerseScreen';
import TreeScreen from './screens/TreeScreen';
import ExploreScreen from './screens/ExploreScreen';
import ProfileScreen from './screens/ProfileScreen';
import OnboardingScreen from './screens/OnboardingScreen';

const TAB_SCREENS = ['home', 'tree', 'explore', 'profile'];
const MODAL_SCREENS = ['quiz', 'commentary', 'chavruta', 'verse', 'challenge'];

export default function App() {
  const userHook = useUser();
  const { user, addXP } = userHook;
  const [activeTab, setActiveTab] = useState('home');
  const [activeScreen, setActiveScreen] = useState(null);
  const [xpToasts, setXpToasts] = useState([]);

  const showXPToast = useCallback((amount) => {
    const id = Date.now();
    setXpToasts(prev => [...prev, { id, amount }]);
  }, []);

  const removeToast = useCallback((id) => {
    setXpToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const awardXP = useCallback((amount) => {
    addXP(amount);
    showXPToast(amount);
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
    // Modal screens (no tab bar)
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
      // Challenge maps to quiz for MVP
      return <QuizScreen userHook={userHook} awardXP={awardXP} onBack={goBack} />;
    }

    // Tab screens
    switch (activeTab) {
      case 'home':
        return <HomeScreen userHook={userHook} navigate={navigate} />;
      case 'tree':
        return <TreeScreen userHook={userHook} />;
      case 'explore':
        return <ExploreScreen navigate={navigate} />;
      case 'profile':
        return <ProfileScreen userHook={userHook} />;
      default:
        return <HomeScreen userHook={userHook} navigate={navigate} />;
    }
  };

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
