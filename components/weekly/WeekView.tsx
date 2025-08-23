import React, { useState, useEffect, useCallback } from 'react';
import { getWeekData, refreshWeekData } from '../../services/geminiService';
import type { WeekData, UserProfile } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
import { ChevronLeftIcon, ChevronRightIcon, BabyIcon, HeartIcon, UserIcon, MedicalIcon, RefreshCwIcon } from '../layout/Icons';

interface WeekViewProps {
  userProfile: UserProfile;
  currentWeek: number;
  onWeekChange: (week: number) => void;
  maxPregnancyWeek: number;
  onWeekRead: (week: number) => void;
}

type Tab = 'baby' | 'partner' | 'father' | 'medical';
type Status = 'Forming' | 'Developing' | 'Functional';

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => (
    <details className="group bg-gray-50 dark:bg-gray-700/50 rounded-lg" open={defaultOpen}>
        <summary className="flex items-center justify-between cursor-pointer p-3 list-none">
            <h5 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h5>
            <ChevronRightIcon className="w-5 h-5 transition-transform duration-200 group-open:rotate-90 text-gray-500" />
        </summary>
        <div className="p-4 border-t border-gray-300 dark:border-gray-600">
            {children}
        </div>
    </details>
);

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
    const statusStyles: { [key in Status]: string } = {
        'Forming': 'bg-warning-amber/20 text-amber-800 dark:bg-warning-amber/20 dark:text-warning-amber',
        'Developing': 'bg-info-blue/20 text-blue-800 dark:bg-info-blue/20 dark:text-info-blue',
        'Functional': 'bg-success-green/20 text-green-800 dark:bg-success-green/20 dark:text-success-green',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>{status}</span>;
};

const BabyContent: React.FC<{ data: WeekData }> = ({ data }) => (
    <div className="space-y-4 animate-slideInUp">
        <div className="bg-pure-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <p className="text-lg font-semibold text-soft-purple">Baby is the size of a</p>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 capitalize my-2">{data.babySize.comparisonObject}</h3>
            <p className="text-gray-500 dark:text-gray-400">{data.babySize.inches.toFixed(2)}" / {data.babySize.grams.toFixed(1)}g</p>
        </div>
        
        <div className="bg-pure-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
            <h4 className="text-lg font-bold mb-3 px-2">Key Systems Development</h4>
            <div className="space-y-2">
                {data.fetalSystems.map(system => (
                    <CollapsibleSection key={system.name} title={system.name}>
                        <div className="space-y-3 text-sm">
                            <p><StatusBadge status={system.status} /></p>
                            <p><strong className="font-semibold">What's Happening:</strong> {system.fatherFriendlyExplanation}</p>
                            <p><strong className="font-semibold">Clinical Significance:</strong> {system.clinicalSignificance}</p>
                            <p><strong className="font-semibold">Why This Matters For Dad:</strong> {system.whyThisMatters}</p>
                        </div>
                    </CollapsibleSection>
                ))}
            </div>
        </div>
        
        <div className="bg-baby-blue dark:bg-info-blue/10 p-4 rounded-xl border-l-4 border-info-blue">
            <h4 className="font-bold text-blue-800 dark:text-blue-200">Did You Know?</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">{data.didYouKnowFact}</p>
        </div>
    </div>
);

const PartnerContent: React.FC<{ data: WeekData, partnerName: string }> = ({ data, partnerName }) => (
    <div className="space-y-4 animate-slideInUp">
         <div className="bg-pure-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
            <h4 className="text-lg font-bold mb-3 px-2">What {partnerName} Might Be Experiencing</h4>
            <div className="space-y-2">
                {data.maternalChanges.map(change => (
                    <CollapsibleSection key={change.symptom} title={change.symptom}>
                        <div className="space-y-3 text-sm">
                            <p><strong className="font-semibold">Timeline:</strong> {change.timeline}</p>
                            <div className={`p-3 rounded-lg ${change.isWarningSign ? 'bg-red-50 dark:bg-alert-red/10 border-l-4 border-alert-red' : 'bg-soft-pink dark:bg-warm-coral/10'}`}>
                                <h5 className="font-bold">How you can help:</h5>
                                <p className="text-sm">{change.fatherActionItem}</p>
                            </div>
                        </div>
                    </CollapsibleSection>
                ))}
            </div>
        </div>
    </div>
);


const FatherContent: React.FC<{ data: WeekData }> = ({ data }) => (
     <div className="space-y-4 animate-slideInUp">
        <div className="bg-pure-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h4 className="text-lg font-bold mb-2">Your Emotional Journey</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{data.paternalGuidance.paternalChanges}</p>
        </div>
         <div className="bg-pure-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h4 className="text-lg font-bold mb-2">Bonding Opportunity</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{data.paternalGuidance.bondingOpportunity}</p>
        </div>
         <div className="bg-pure-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h4 className="text-lg font-bold mb-2">Your Mission This Week</h4>
             <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                {data.paternalGuidance.actionableTasks.map(task => <li key={task}>{task}</li>)}
            </ul>
        </div>
    </div>
);

const MedicalContent: React.FC<{ data: WeekData }> = ({ data }) => (
    <div className="space-y-4 animate-slideInUp">
        {data.warningSigns.length > 0 && (
            <div className="bg-red-50 dark:bg-alert-red/10 p-4 rounded-xl border-l-4 border-alert-red">
                <h4 className="font-bold text-red-800 dark:text-red-200">Warning Signs: Call a Doctor If...</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-300 mt-2">
                    {data.warningSigns.map((sign, i) => <li key={i}>{sign}</li>)}
                </ul>
            </div>
        )}
        <div className="bg-pure-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
            <h4 className="text-lg font-bold mb-3 px-2">Medical Topics & Appointments</h4>
            <div className="space-y-2">
                {data.medicalGuidance.map(item => (
                    <CollapsibleSection key={item.topic} title={item.topic}>
                         <div className="space-y-3 text-sm">
                            <p>{item.simplifiedExplanation}</p>
                             <CollapsibleSection title="Detailed Explanation">
                                <p className="text-xs whitespace-pre-wrap">{item.detailedExplanation}</p>
                            </CollapsibleSection>
                            {item.fatherAdvocacyScript && item.fatherAdvocacyScript.length > 0 && (
                                <CollapsibleSection title="Advocacy Script for Dad">
                                    <ul className="list-disc list-inside space-y-1 text-xs font-semibold italic">
                                        {item.fatherAdvocacyScript.map(script => <li key={script}>"{script}"</li>)}
                                    </ul>
                                </CollapsibleSection>
                            )}
                        </div>
                    </CollapsibleSection>
                ))}
            </div>
        </div>
    </div>
);


const WeekView: React.FC<WeekViewProps> = ({ userProfile, currentWeek, onWeekChange, maxPregnancyWeek, onWeekRead }) => {
  const [weekData, setWeekData] = useState<WeekData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('partner');

  const fetchWeek = useCallback(async (week: number) => {
    setLoading(true);
    setError(null);
    setWeekData(null);
    
    const data = await getWeekData(week, userProfile);

    if (data.error) {
        setError(data.error);
        setWeekData(null);
    } else {
        setWeekData(data);
        onWeekRead(week);
    }
    
    setLoading(false);
  }, [userProfile, onWeekRead]);
  
  const handleRefresh = useCallback(() => {
      if(weekData) {
          setLoading(true);
          setError(null);
          refreshWeekData(weekData.week, userProfile).then(data => {
              if (data.error) {
                  setError(data.error);
                  setWeekData(null);
              } else {
                  setWeekData(data);
              }
          }).catch(err => {
              setError('Failed to refresh week data.');
              console.error(err);
          }).finally(() => {
              setLoading(false);
          });
      }
  }, [weekData, userProfile]);

  useEffect(() => {
    fetchWeek(currentWeek);
  }, [currentWeek, fetchWeek]);

  const navigateWeek = (direction: 'next' | 'prev') => {
    const newWeek = direction === 'next' ? currentWeek + 1 : currentWeek - 1;
    if (newWeek > 0 && newWeek <= 40) {
      onWeekChange(newWeek);
      setActiveTab('partner');
    }
  };

  const isFutureWeek = currentWeek > maxPregnancyWeek;

  const tabs: {id: Tab, label: string, icon: React.ReactNode}[] = [
    { id: 'baby', label: "Baby", icon: <BabyIcon /> },
    { id: 'partner', label: "Partner", icon: <HeartIcon /> },
    { id: 'father', label: "You", icon: <UserIcon /> },
    { id: 'medical', label: "Medical", icon: <MedicalIcon /> },
  ];

  const renderContent = () => {
    if (!weekData) return null;
    switch (activeTab) {
        case 'baby': return <BabyContent data={weekData} />;
        case 'partner': return <PartnerContent data={weekData} partnerName={userProfile.partnerName} />;
        case 'father': return <FatherContent data={weekData} />;
        case 'medical': return <MedicalContent data={weekData} />;
        default: return null;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <header className="flex items-center justify-between">
        <button onClick={() => navigateWeek('prev')} disabled={currentWeek === 1} className="p-2 rounded-full bg-pure-white dark:bg-gray-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:bg-gray-200 dark:active:bg-gray-600">
          <ChevronLeftIcon />
        </button>
        <div className="text-center flex items-center gap-4">
            <h2 className="text-2xl font-bold">Week {currentWeek}</h2>
            <button 
                onClick={handleRefresh} 
                disabled={loading || !weekData} 
                className="p-2 rounded-full bg-pure-white dark:bg-gray-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:bg-gray-200 dark:active:bg-gray-600"
                aria-label="Refresh week data"
            >
                <RefreshCwIcon className={loading ? 'animate-spin' : ''} />
            </button>
        </div>
        <button onClick={() => navigateWeek('next')} disabled={currentWeek === 40} className="p-2 rounded-full bg-pure-white dark:bg-gray-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:bg-gray-200 dark:active:bg-gray-600">
          <ChevronRightIcon />
        </button>
      </header>

       <nav className="grid grid-cols-4 gap-2 p-1 rounded-xl bg-gray-100 dark:bg-gray-700 sticky top-2 z-10">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 active:scale-90 ${activeTab === tab.id ? 'bg-pure-white dark:bg-gray-800 shadow text-primary-blue' : 'text-gray-500 dark:text-gray-400'}`}
                    aria-current={activeTab === tab.id}
                >
                    {tab.icon}
                    <span className="text-xs font-semibold mt-1">{tab.label}</span>
                </button>
            ))}
        </nav>
      
      <div className="relative min-h-[300px]">
        {loading && <div className="absolute inset-0 flex items-center justify-center"><LoadingSpinner /></div>}
        {error && <p className="text-center text-alert-red pt-10">{error}</p>}
        {weekData && !loading && !error && renderContent()}
        {isFutureWeek && (
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-pure-white rounded-xl text-center p-4 z-20">
                <h3 className="text-3xl font-bold">Coming Soon!</h3>
                <p className="mt-2 text-lg">This content will unlock for you in {currentWeek - maxPregnancyWeek} week(s).</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default WeekView;
