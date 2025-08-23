import React, { useEffect } from 'react';
import type { Achievement } from '../../types';

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className="fixed top-4 right-4 w-full max-w-sm bg-pure-white dark:bg-gray-800 rounded-xl shadow-lg p-4 z-50 animate-slideInUp"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start space-x-4">
        <div className="text-4xl">{achievement.icon}</div>
        <div>
          <h3 className="font-bold text-lg text-primary-blue dark:text-pure-white">Achievement Unlocked!</h3>
          <p className="text-md font-semibold text-gray-800 dark:text-gray-200">{achievement.title}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
          <p className="font-bold text-lg text-comfort-yellow mt-1">+{achievement.points} Points!</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" aria-label="Close notification">
          &times;
        </button>
      </div>
    </div>
  );
};

export default AchievementToast;
