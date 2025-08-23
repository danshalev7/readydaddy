import React, { useMemo, useState, useEffect } from 'react';
import { getFinalCountdownTip } from '../../services/geminiService';
import { UserProfile, View } from '../../types';

interface CountdownProps {
  userProfile: UserProfile;
  setActiveView: (view: View) => void;
}

const Countdown: React.FC<CountdownProps> = ({ userProfile, setActiveView }) => {
  const [dailyTip, setDailyTip] = useState<string | null>(null);
  const [tipLoading, setTipLoading] = useState(false);

  const { daysRemaining, trimester, trimesterProgress, isFinalCountdown } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDateObj = new Date(userProfile.dueDate);
    
    const totalDays = 280;
    const daysPregnant = totalDays - Math.ceil((dueDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let currentTrimester = 1;
    if (daysPregnant > 182) { // After 26 weeks
        currentTrimester = 3;
    } else if (daysPregnant > 91) { // After 13 weeks
        currentTrimester = 2;
    }

    const trimesterProgressPercent = Math.min(100, Math.round((daysPregnant / totalDays) * 100));

    const daysRemainingCalc = Math.ceil((dueDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      daysRemaining: daysRemainingCalc,
      trimester: currentTrimester,
      trimesterProgress: trimesterProgressPercent,
      isFinalCountdown: daysRemainingCalc <= 30 && daysRemainingCalc > 0
    };
  }, [userProfile.dueDate]);

  useEffect(() => {
    if (isFinalCountdown) {
      const fetchTip = async () => {
        setTipLoading(true);
        try {
          const tipData = await getFinalCountdownTip(daysRemaining, userProfile);
          setDailyTip(tipData.tip);
        } catch (e) {
          setDailyTip("Remember to take deep breaths and stay calm. You've got this!");
        } finally {
          setTipLoading(false);
        }
      };
      fetchTip();
    }
  }, [isFinalCountdown, daysRemaining, userProfile]);

  const countdownStyle = isFinalCountdown 
    ? "bg-gradient-to-r from-alert-red to-energy-orange text-white" 
    : "bg-gradient-to-r from-primary-blue to-warm-coral text-white";

  if (daysRemaining <= 0) {
    return (
      <div className="p-6 rounded-xl shadow-lg animate-slideInUp bg-gradient-to-r from-mint-green to-trust-teal text-white text-center">
        <h2 className="text-2xl font-bold">Baby Watch!</h2>
        <p className="text-4xl font-bold my-3">
          {daysRemaining === 0 ? "Due Today!" : `${Math.abs(daysRemaining)} days past due`}
        </p>
        <p className="mb-4">It could be any moment now. Stay ready and supportive!</p>
        <button
          onClick={() => setActiveView(View.Labor)}
          className="w-full bg-pure-white text-mint-green font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-md"
        >
          Go to Labor Tools
        </button>
      </div>
    )
  }

  return (
    <div className={`p-6 rounded-xl shadow-lg animate-slideInUp ${countdownStyle}`}>
      <h2 className="text-xl font-bold">{isFinalCountdown ? "Final Countdown!" : "Baby ETA"}</h2>
      <div className="flex items-baseline justify-center gap-2 mt-2">
        <span className="text-6xl font-bold">{daysRemaining}</span>
        <span className="text-2xl font-semibold">days</span>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-sm font-medium mb-1">
            <span>Trimester {trimester}</span>
            <span>{trimesterProgress}%</span>
        </div>
        <div className="w-full bg-white/30 rounded-full h-2.5">
            <div className="bg-white h-2.5 rounded-full" style={{width: `${trimesterProgress}%`}}></div>
        </div>
      </div>
      {isFinalCountdown && (
        <div className="mt-4 pt-4 border-t border-white/30">
          <h3 className="font-bold text-md">💡 Daily Dad Tip:</h3>
          {tipLoading ? (
             <div className="h-4 bg-white/30 rounded w-3/4 animate-pulse mt-1"></div>
          ) : (
            <p className="text-sm mt-1">{dailyTip}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Countdown;