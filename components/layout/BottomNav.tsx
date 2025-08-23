import React from 'react';
import { View } from '../../types';
import { HomeIcon, CalendarIcon, StopwatchIcon, UserIcon } from './Icons';
import { triggerHapticFeedback } from '../../utils/haptics';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  view: View;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ view, label, icon, isActive, onClick }) => {
  const activeClasses = 'text-primary-blue';
  const inactiveClasses = 'text-gray-500 dark:text-gray-400';

  const handleClick = () => {
    triggerHapticFeedback(30);
    onClick();
  }
  
  return (
    <button
      onClick={handleClick}
      className={`flex flex-col items-center justify-center w-full transition-all duration-200 active:scale-90 ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className="text-xs font-medium mt-1">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { view: View.Dashboard, label: 'Home', icon: <HomeIcon /> },
    { view: View.Weekly, label: 'Weekly', icon: <CalendarIcon /> },
    { view: View.Labor, label: 'Labor', icon: <StopwatchIcon /> },
    { view: View.Profile, label: 'Profile', icon: <UserIcon /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-pure-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 shadow-lg">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavItem
            key={item.view}
            view={item.view}
            label={item.label}
            icon={item.icon}
            isActive={activeView === item.view}
            onClick={() => setActiveView(item.view)}
          />
        ))}
      </div>
    </div>
  );
};

export default BottomNav;