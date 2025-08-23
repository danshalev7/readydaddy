import React, { useState } from 'react';
import type { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [profile, setProfile] = useState({
    lmpDate: '',
    partnerName: '',
    babyNickname: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({...prev, [name]: value}));
  };
  
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.lmpDate && profile.partnerName) {
      const lmp = new Date(profile.lmpDate + 'T00:00:00');
      // Additional validation to prevent future dates
      if (lmp > new Date()) {
        alert("The last menstrual period cannot be in the future. Please select a valid date.");
        return;
      }

      lmp.setDate(lmp.getDate() + 280);
      const dueDate = lmp;

      onComplete({
        dueDate: dueDate.toISOString().split('T')[0],
        lmpDate: profile.lmpDate,
        partnerName: profile.partnerName,
        babyNickname: profile.babyNickname || undefined
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-pure-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-blue dark:text-pure-white mb-2">Welcome to ReadyDaddy!</h1>
            <p className="text-gray-600 dark:text-gray-300">Your co-pilot for the journey to fatherhood.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="lmpDate" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
              First, what was the first day of the last menstrual period (LMP)?
            </label>
            <input
              type="date"
              id="lmpDate"
              name="lmpDate"
              value={profile.lmpDate}
              onChange={handleChange}
              required
              max={today}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition"
            />
          </div>
          <div>
            <label htmlFor="partnerName" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
              What's your partner's name?
            </label>
            <input
              type="text"
              id="partnerName"
              name="partnerName"
              value={profile.partnerName}
              onChange={handleChange}
              placeholder="e.g., Jane"
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition"
            />
          </div>
          <div>
            <label htmlFor="babyNickname" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
              Give the baby a nickname? (Optional)
            </label>
            <input
              type="text"
              id="babyNickname"
              name="babyNickname"
              value={profile.babyNickname}
              onChange={handleChange}
              placeholder="e.g., Peanut"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition"
            />
          </div>

          
          <p className="text-xs text-center text-gray-500 pt-2">
            Your information is stored only on this device and is not shared.
          </p>

          <button
            type="submit"
            className="w-full bg-primary-blue text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-600 transition-transform transform hover:scale-105 active:scale-95 shadow-md"
          >
            Start the Journey
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;