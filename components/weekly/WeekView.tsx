import React, { useState, useEffect, useCallback } from 'react';
import { PregnancyDataService } from '../../services/pregnancyDataService';
import type { AggregatedWeekData, UserProfile, FetalDevelopment, MedicalExplanation } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
import { ChevronLeftIcon, ChevronRightIcon, BabyIcon, HeartIcon, UserIcon, MedicalIcon, AlertTriangleIcon } from '../layout/Icons';

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

const BabyContent: React.FC<{ data: AggregatedWeekData }> = ({ data }) => (
    <div className="space-y-4 animate-slideInUp">
        <div className="bg-pure-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <p className="text-lg font-semibold text-soft-purple">Baby is the size of a</p>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 capitalize my-2">{data.weeklyCard?.baby_size_comparison || '...'}</h3>
            <p className="text-gray-500 dark:text-gray-400">{data.weeklyCard?.baby_size_inches.toFixed(2)}" / {data.weeklyCard?.baby_weight_grams.toFixed(1)}g</p>
        </div>
        
        <div className="bg-pure-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
            <h4 className="text-lg font-bold mb-3 px-2">Key Systems Development</h4>
            <div className="space-y-2">
                {data.fetalDevelopment.map((system: FetalDevelopment) => (
                    <CollapsibleSection key={system.id} title={system.system_name}>
                        <div className="space-y-3 text-sm">
                            <p><StatusBadge status={system.status} /></p>
                            <p><strong className="font-semibold">What's Happening:</strong> {system.this_week_summary}</p>
                            <p><strong className="font-semibold">Why This Matters For Dad:</strong> {system.father_understanding_note}</p>
                        </div>
                    </CollapsibleSection>
                ))}
            </div>
        </div>
        
        {data.weeklyCard?.did_you_know && (
            <div className="bg-baby-blue dark:bg-info-blue/10 p-4 rounded-xl border-l-4 border-info-blue">
                <h4 className="font-bold text-blue-800 dark:text-blue-200">Did You Know?</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">{data.weeklyCard.did_you_know}</p>
            </div>
        )}
    </div>
);

const PartnerContent: React.FC<{ data: AggregatedWeekData, partnerName: string }> = ({ data, partnerName }) => {
    if (!data.maternalChanges) return null;
    return (
        <div className="space-y-4 animate-slideInUp">
             <div className="bg-pure-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <h4 className="text-lg font-bold mb-3 px-2">What {partnerName} Might Be Experiencing</h4>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
                    <p className="text-sm">{data.maternalChanges.summary}</p>
                     <div className='bg-soft-pink dark:bg-warm-coral/10 p-3 rounded-lg'>
                        <h5 className="font-bold">How you can help:</h5>
                        <p className="text-sm">{data.maternalChanges.suggested_action}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FatherContent: React.FC<{ data: AggregatedWeekData }> = ({ data }) => {
    if (!data.weeklyCard) return null;
    return (
        <div className="space-y-4 animate-slideInUp">
            <div className="bg-pure-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h4 className="text-lg font-bold mb-2">Your Emotional Journey</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{data.weeklyCard.paternal_changes}</p>
            </div>
             <div className="bg-pure-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h4 className="text-lg font-bold mb-2">Bonding Opportunity</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{data.weeklyCard.bonding_opportunities}</p>
            </div>
             <div className="bg-pure-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h4 className="text-lg font-bold mb-2">Your Mission This Week</h4>
                 <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    {data.weeklyCard.actionable_tasks.split(', ').map(task => <li key={task}>{task}</li>)}
                </ul>
            </div>
        </div>
    );
};

const MedicalContent: React.FC<{ data: AggregatedWeekData }> = ({ data }) => {
    const warningSigns: string[] = data.medicalInfo.reduce((acc: string[], item: MedicalExplanation) => {
        const signs = (item.related_warning_signs as any)?.warning_signs;
        if (Array.isArray(signs)) {
            return [...acc, ...signs];
        }
        return acc;
    }, []);

    return (
        <div className="space-y-4 animate-slideInUp">
            {warningSigns.length > 0 && (
                <div className="bg-red-50 dark:bg-alert-red/10 p-4 rounded-xl border-l-4 border-alert-red">
                    <div className="flex items-start">
                        <AlertTriangleIcon className="w-6 h-6 text-alert-red mr-3 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-red-800 dark:text-red-200">Potential Warning Signs This Trimester</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-300 mt-2">
                                {[...new Set(warningSigns)].map((sign, i) => <li key={i}>{sign}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            <div className="bg-pure-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <h4 className="text-lg font-bold mb-3 px-2">Medical Topics & Appointments</h4>
                <div className="space-y-2">
                    {data.medicalInfo.map(item => (
                        <CollapsibleSection key={item.topic} title={item.topic.replace(/_/g, ' ')}>
                             <div className="space-y-3 text-sm">
                                <p>{item.simplified_explanation}</p>
                                {item.advocacy_script && (
                                    <CollapsibleSection title="Advocacy Script for Dad">
                                        <p className="text-xs font-semibold italic">"{item.advocacy_script}"</p>
                                    </CollapsibleSection>
                                )}
                            </div>
                        </CollapsibleSection>
                    ))}
                </div>
            </div>
        </div>
    );
};


const WeekView: React.FC<WeekViewProps> = ({ userProfile, currentWeek, onWeekChange, maxPregnancyWeek, onWeekRead }) => {
  const [weekData, setWeekData] = useState<AggregatedWeekData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('partner');

  const fetchWeek = useCallback(async (week: number) => {
    setLoading(true);
    setError(null);
    setWeekData(null);
    
    try {
        const data = await PregnancyDataService.getWeeklyContent(week);
        if (data.error) {
            setError(data.error);
            setWeekData(null);
        } else {
            setWeekData(data);
            onWeekRead(week);
        }
    } catch(err) {
        setError(`We couldn't load the guide for week ${week}. Please check your connection and try again.`);
    }
    
    setLoading(false);
  }, [onWeekRead]);

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
        <div className="text-center">
            <h2 className="text-2xl font-bold">Week {currentWeek}</h2>
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
        {weekData && !loading && !error && weekData.hasData && renderContent()}
        {weekData && !weekData.hasData && !loading && <p className="text-center text-gray-500 pt-10">No specific information available for this week.</p>}
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