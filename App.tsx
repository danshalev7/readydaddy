import React, { useState, useEffect, useRef } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/dashboard/Dashboard';
import WeekView from './components/weekly/WeekView';
import ContractionTimer from './components/labor/ContractionTimer';
import Profile from './components/profile/Profile';
import BottomNav from './components/layout/BottomNav';
import AchievementToast from './components/common/AchievementToast';
import { View, UserProfile, UserProgress, Achievement, Milestone, MilestoneMemory } from './types';
import { MILESTONES } from './data/milestones';
import { ACHIEVEMENTS, LEVEL_THRESHOLDS } from './constants';

const VIEW_ORDER = [View.Dashboard, View.Weekly, View.Labor, View.Profile];

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  });
  
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [milestoneMemories, setMilestoneMemories] = useState<MilestoneMemory[]>(() => {
      const savedMemories = localStorage.getItem('milestoneMemories');
      return savedMemories ? JSON.parse(savedMemories) : [];
  });

  const [activeView, setActiveView] = useState<View>(View.Dashboard);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [pregnancyWeek, setPregnancyWeek] = useState<number>(1);
  const [viewingWeek, setViewingWeek] = useState<number>(1);
  const [unlockedAchievementToast, setUnlockedAchievementToast] = useState<Achievement | null>(null);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Load and sync user progress on mount to handle any changes in achievement logic
  useEffect(() => {
    const savedProgress = localStorage.getItem('userProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress) as UserProgress;
        
        const oldPoints = progress.points;
        const oldLevel = progress.level;

        // Recalculate points and level to sync with current achievement definitions
        let totalPoints = 0;
        ACHIEVEMENTS.forEach(a => {
            if (a.criteria(progress)) {
                totalPoints += a.points;
            }
        });
        progress.points = totalPoints;
        progress.level = calculateLevel(totalPoints);
        
        // If anything changed, update localStorage
        if (progress.points !== oldPoints || progress.level !== oldLevel) {
            localStorage.setItem('userProgress', JSON.stringify(progress));
        }
        
        setUserProgress(progress);
    }
  }, []);

  useEffect(() => {
    if (userProfile?.dueDate) {
      try {
        const today = new Date();
        const dueDateObj = new Date(userProfile.dueDate);
        if (isNaN(dueDateObj.getTime())) {
          throw new Error("Invalid due date in user profile");
        }
        const diffTime = today.getTime() - (dueDateObj.getTime() - 280 * 24 * 60 * 60 * 1000);
        const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
        const week = Math.min(40, Math.max(1, Math.floor(diffDays / 7) + 1));
        setPregnancyWeek(week);
        setViewingWeek(week);
      } catch (error) {
        console.error("Error processing due date, resetting profile:", error);
        // Corrupted profile data, reset the app state to force re-onboarding
        localStorage.removeItem('userProfile');
        localStorage.removeItem('userProgress');
        localStorage.removeItem('milestoneMemories');
        setUserProfile(null);
        setUserProgress(null);
        setMilestoneMemories([]);
      }
    }
  }, [userProfile]);

  useEffect(() => {
    if (userProfile) {
        setMilestones(MILESTONES);
    }
  }, [userProfile]);


  const calculateLevel = (points: number): number => {
      for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
          if (points >= LEVEL_THRESHOLDS[i]) {
              return i + 1;
          }
      }
      return 1;
  };

  const checkAchievements = (oldProgress: UserProgress, newProgress: UserProgress) => {
    const oldUnlockedAchievements = ACHIEVEMENTS.filter(a => a.criteria(oldProgress));
    const newUnlockedAchievements = ACHIEVEMENTS.filter(a => a.criteria(newProgress));
    const newlyUnlocked = newUnlockedAchievements.find(a => !oldUnlockedAchievements.some(oldA => oldA.id === a.id));

    if (newlyUnlocked) {
        setUnlockedAchievementToast(newlyUnlocked);
    }
  };

  /**
   * Centralized function to handle all user progress updates.
   * It applies the given changes and then recalculates points and level to ensure data is always in sync.
   */
  const handleProgressUpdate = (updater: (current: UserProgress) => Partial<UserProgress>) => {
    if (!userProgress) return;

    const oldProgress = { ...userProgress };
    const updatedParts = updater(userProgress);
    
    const newProgressData: UserProgress = {
        ...userProgress,
        ...updatedParts,
    };
    
    // Recalculate points and level from scratch based on the new state
    let totalPoints = 0;
    ACHIEVEMENTS.forEach(a => {
        if (a.criteria(newProgressData)) {
            totalPoints += a.points;
        }
    });
    newProgressData.points = totalPoints;
    newProgressData.level = calculateLevel(totalPoints);

    setUserProgress(newProgressData);
    localStorage.setItem('userProgress', JSON.stringify(newProgressData));
    checkAchievements(oldProgress, newProgressData);
  };

  const handleWeekRead = (week: number) => {
      if (!userProgress || userProgress.readWeeks.includes(week)) {
          return;
      }
      handleProgressUpdate(current => ({
          readWeeks: [...current.readWeeks, week],
      }));
  };

  const handleMilestoneCelebrated = (milestoneId: string, memory?: MilestoneMemory) => {
    if (!userProgress || userProgress.celebratedMilestones.includes(milestoneId)) {
      return;
    }

    handleProgressUpdate(current => ({
      celebratedMilestones: [...current.celebratedMilestones, milestoneId],
    }));

    if (memory) {
      const newMemories = [...milestoneMemories, memory];
      setMilestoneMemories(newMemories);
      localStorage.setItem('milestoneMemories', JSON.stringify(newMemories));
    }
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setUserProfile(profile);
    
    // A synthetic "before" state that couldn't have unlocked any achievements
    const beforeProgress: UserProgress = { readWeeks: [], points: -1, level: 0, celebratedMilestones: [] };

    const initialProgress: UserProgress = {
      readWeeks: [],
      points: 0,
      level: 1,
      celebratedMilestones: [],
    };
    
    // Calculate initial points and level based on achievements criteria
    let totalPoints = 0;
    ACHIEVEMENTS.forEach(a => {
        if (a.criteria(initialProgress)) { // Should only match 'first_step'
            totalPoints += a.points;
        }
    });
    initialProgress.points = totalPoints;
    initialProgress.level = calculateLevel(totalPoints);
    
    localStorage.setItem('userProgress', JSON.stringify(initialProgress));
    setUserProgress(initialProgress);
    
    // Use the central achievement checker to find the newly unlocked achievement
    checkAchievements(beforeProgress, initialProgress);
  };
  
  const handleProfileUpdate = (profile: UserProfile) => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setUserProfile(profile);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const navigateToView = (view: View) => {
    if (view === View.Weekly) {
        setViewingWeek(pregnancyWeek);
    }
    setActiveView(view);
  };

  const handlePrevView = () => {
    const currentIndex = VIEW_ORDER.indexOf(activeView);
    if (currentIndex > 0) {
      navigateToView(VIEW_ORDER[currentIndex - 1]);
    }
  };
  
  const handleNextView = () => {
    const currentIndex = VIEW_ORDER.indexOf(activeView);
    if (currentIndex < VIEW_ORDER.length - 1) {
      navigateToView(VIEW_ORDER[currentIndex + 1]);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = 0;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchEndX.current === 0) return;

    const swipeThreshold = 50; // Minimum distance for a swipe
    const swipeDistance = touchStartX.current - touchEndX.current;

    if (swipeDistance > swipeThreshold) {
      handleNextView();
    } else if (swipeDistance < -swipeThreshold) {
      handlePrevView();
    }
  };
  
  const renderSpecificView = (view: View) => {
    if (!userProfile || !userProgress) return null;
    switch (view) {
      case View.Dashboard:
        return <Dashboard 
                  userProfile={userProfile} 
                  userProgress={userProgress}
                  currentWeek={pregnancyWeek} 
                  setActiveView={navigateToView}
                  milestones={milestones}
                  onMilestoneCelebrated={handleMilestoneCelebrated}
                />;
      case View.Weekly:
        return <WeekView 
                    userProfile={userProfile} 
                    currentWeek={viewingWeek} 
                    onWeekChange={setViewingWeek}
                    maxPregnancyWeek={pregnancyWeek}
                    onWeekRead={handleWeekRead} 
                />;
      case View.Labor:
        return <ContractionTimer userProfile={userProfile} />;
      case View.Profile:
        return <Profile 
                  userProfile={userProfile} 
                  onProfileUpdate={handleProfileUpdate} 
                  userProgress={userProgress}
                  milestones={milestones}
                  milestoneMemories={milestoneMemories}
                />;
      default:
        return <Dashboard 
                  userProfile={userProfile} 
                  userProgress={userProgress}
                  currentWeek={pregnancyWeek} 
                  setActiveView={navigateToView}
                  milestones={milestones}
                  onMilestoneCelebrated={handleMilestoneCelebrated}
                />;
    }
  };

  if (!userProfile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }
  
  const currentIndex = VIEW_ORDER.indexOf(activeView);

  return (
    <div className="min-h-screen font-sans text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {unlockedAchievementToast && (
        <AchievementToast 
          achievement={unlockedAchievementToast} 
          onClose={() => setUnlockedAchievementToast(null)} 
        />
      )}
      <main 
        className="w-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
            {VIEW_ORDER.map(view => (
                <div key={view} className="w-full flex-shrink-0 min-h-screen box-border pb-24">
                    {renderSpecificView(view)}
                </div>
            ))}
        </div>
      </main>
      <BottomNav activeView={activeView} setActiveView={navigateToView} />
      <button
        onClick={toggleTheme}
        className="fixed bottom-20 right-4 bg-pure-white dark:bg-gray-700 p-2 rounded-full shadow-md border border-gray-300 dark:border-gray-600 transition-transform active:scale-90"
        aria-label="Toggle theme"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
};

export default App;