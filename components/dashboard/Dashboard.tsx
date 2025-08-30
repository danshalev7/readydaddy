import React, { useState, useEffect } from 'react';
import Countdown from './Countdown';
import MilestoneTracker from './MilestoneTracker';
import DailyMessages from './DailyMessages';
import { View, UserProfile, Milestone, UserProgress, MilestoneMemory } from '../../types';
import MilestoneCelebration from '../milestones/MilestoneCelebration';

interface DashboardProps {
  userProfile: UserProfile;
  userProgress: UserProgress;
  currentWeek: number;
  setActiveView: (view: View) => void;
  milestones: Milestone[];
  onMilestoneCelebrated: (milestoneId: string, memory?: MilestoneMemory) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile, userProgress, currentWeek, setActiveView, milestones, onMilestoneCelebrated }) => {
  const [milestoneToCelebrate, setMilestoneToCelebrate] = useState<Milestone | null>(null);

  const hasDismissedCelebration = (milestoneId: string) => {
    return sessionStorage.getItem(`dismissed_${milestoneId}`) === 'true';
  };

  useEffect(() => {
    if (milestones.length > 0 && userProgress) {
      const uncelebratedMilestone = milestones.find(m => 
        m.week === currentWeek && 
        !userProgress.celebratedMilestones.includes(m.id) &&
        !hasDismissedCelebration(m.id)
      );
      if (uncelebratedMilestone) {
        // A short delay to allow the user to see the dashboard first
        setTimeout(() => setMilestoneToCelebrate(uncelebratedMilestone), 1000);
      }
    }
  }, [currentWeek, milestones, userProgress]);

  const handleCelebrationComplete = (milestoneId: string, memory?: MilestoneMemory) => {
    onMilestoneCelebrated(milestoneId, memory);
    setMilestoneToCelebrate(null);
  }

  const handleCelebrationClose = () => {
    if (milestoneToCelebrate) {
      sessionStorage.setItem(`dismissed_${milestoneToCelebrate.id}`, 'true');
    }
    setMilestoneToCelebrate(null);
  };

  return (
    <>
      {milestoneToCelebrate && (
        <MilestoneCelebration 
          milestone={milestoneToCelebrate}
          onComplete={handleCelebrationComplete}
          onClose={handleCelebrationClose}
        />
      )}
      <div className="p-4 space-y-4 md:space-y-6 animate-fadeIn">
        <header>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Your Journey with {userProfile.partnerName}</h1>
          <p className="text-md text-gray-600 dark:text-gray-400">You're on week {currentWeek} of this amazing adventure.</p>
        </header>
        
        <Countdown userProfile={userProfile} setActiveView={setActiveView} />

        <div className="bg-pure-white dark:bg-gray-800 p-6 rounded-xl shadow-md animate-slideInUp">
          <h2 className="text-xl font-bold mb-2">This Week's Intel</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">A sneak peek into week {currentWeek}. Tap to see the full guide.</p>
          <button 
            onClick={() => setActiveView(View.Weekly)}
            className="w-full bg-primary-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-all active:scale-95 active:bg-blue-700 duration-200"
          >
            Explore Week {currentWeek}
          </button>
        </div>
        
        <DailyMessages week={currentWeek} userProfile={userProfile} />

        <MilestoneTracker userProfile={userProfile} currentWeek={currentWeek} milestones={milestones} />
      </div>
    </>
  );
};

export default Dashboard;