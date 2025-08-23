import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import { MedicalIcon, ClipboardIcon, GiftIcon, ChevronRightIcon } from '../layout/Icons';
import type { UserProfile, Milestone } from '../../types';

interface MilestoneTrackerProps {
  currentWeek: number;
  userProfile: UserProfile;
  milestones: Milestone[] | null;
}

const categoryStyles = {
    Medical: {
        icon: <MedicalIcon className="w-6 h-6 text-info-blue" />,
        color: 'border-info-blue',
        bg: 'bg-info-blue/10'
    },
    Preparation: {
        icon: <ClipboardIcon className="w-6 h-6 text-soft-purple" />,
        color: 'border-soft-purple',
        bg: 'bg-soft-purple/10'
    },
    Social: {
        icon: <GiftIcon className="w-6 h-6 text-warm-coral" />,
        color: 'border-warm-coral',
        bg: 'bg-warm-coral/10'
    }
};

const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ currentWeek, userProfile, milestones }) => {
  const loading = !milestones;
  const error = milestones === null;
  
  const upcomingMilestones = milestones
    ? milestones.filter(m => m.week >= currentWeek).sort((a, b) => a.week - b.week).slice(0, 4)
    : [];

  return (
    <div className="bg-pure-white dark:bg-gray-800 p-6 rounded-xl shadow-md animate-slideInUp">
      <h2 className="text-xl font-bold mb-4">Upcoming Milestones</h2>
      {loading ? (
        <LoadingSpinner text="Mapping your journey..." />
      ) : error ? (
        <p className="text-alert-red">Could not load upcoming milestones.</p>
      ) : upcomingMilestones.length > 0 ? (
        <div className="space-y-3">
          {upcomingMilestones.map((milestone) => {
            const style = categoryStyles[milestone.category] || categoryStyles.Preparation;
            return (
              <details key={milestone.name} className={`group border-l-4 ${style.color} ${style.bg} rounded-r-lg`}>
                <summary className="flex items-center justify-between p-3 cursor-pointer list-none">
                    <div className="flex items-center space-x-3">
                        {style.icon}
                        <div>
                            <p className="font-bold text-gray-800 dark:text-gray-100">{milestone.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Around Week {milestone.week}</p>
                        </div>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 transition-transform duration-200 group-open:rotate-90 text-gray-500" />
                </summary>
                <div className="px-4 pb-3 ml-9 border-t border-gray-300 dark:border-gray-600">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 mb-3">{milestone.description}</p>
                    <h4 className="font-semibold text-sm mb-2 text-gray-800 dark:text-gray-200">Your Actions:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        {milestone.preparationTips.map((action, i) => <li key={i}>{action}</li>)}
                    </ul>
                </div>
              </details>
            )
           })}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">All major milestones are complete! Get ready!</p>
      )}
    </div>
  );
};

export default MilestoneTracker;