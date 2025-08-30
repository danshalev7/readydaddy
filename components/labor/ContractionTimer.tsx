import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { Contraction, UserProfile, HospitalBagItem } from '../../types';
import { HOSPITAL_BAG_CHECKLIST } from '../../constants';
import { ShareIcon, ClipboardIcon, AlertTriangleIcon, PhoneIcon } from '../layout/Icons';
import { triggerHapticFeedback } from '../../utils/haptics';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const LaborEducation: React.FC = () => (
    <div className="bg-pure-white dark:bg-gray-800 p-4 rounded-xl shadow-md space-y-3">
        <h3 className="text-xl font-bold text-center mb-2">Ready for Labor</h3>
        <details className="group bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <summary className="font-semibold p-3 cursor-pointer list-none">Stages of Labor</summary>
            <div className="p-3 border-t border-gray-200 dark:border-gray-600 text-sm">
                <p><b>Early Labor:</b> Contractions are mild, irregular, and short. A good time to rest, hydrate, and eat light snacks.</p>
                <p className="mt-2"><b>Active Labor:</b> Contractions become stronger, longer, and more regular (like the 5-1-1 rule). This is when you'll head to the hospital.</p>
                <p className="mt-2"><b>Transition:</b> The most intense phase before pushing begins. Your support is crucial here.</p>
            </div>
        </details>
        <details className="group bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <summary className="font-semibold p-3 cursor-pointer list-none">Your Role as Support</summary>
            <div className="p-3 border-t border-gray-200 dark:border-gray-600 text-sm">
                <ul className="list-disc list-inside space-y-1">
                    <li>Stay calm and confident. Your presence is powerful.</li>
                    <li>Time contractions accurately.</li>
                    <li>Offer physical support: back rubs, counter-pressure.</li>
                    <li>Ensure she stays hydrated and changes positions.</li>
                    <li>Be her advocate with the medical team.</li>
                </ul>
            </div>
        </details>
    </div>
);

const ChecklistModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [packedItems, setPackedItems] = useState<Set<string>>(() => {
        const saved = localStorage.getItem('packedItems');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    const togglePacked = (id: string) => {
        const newPacked = new Set(packedItems);
        if (newPacked.has(id)) {
            newPacked.delete(id);
        } else {
            newPacked.add(id);
        }
        setPackedItems(newPacked);
        localStorage.setItem('packedItems', JSON.stringify(Array.from(newPacked)));
    };
    
    const categories = ['Documents', 'For Partner', 'For You', 'For Baby'];

    return (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="checklist-title">
            <div className="bg-pure-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 bg-pure-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h3 id="checklist-title" className="text-xl font-bold">Hospital Bag Checklist</h3>
                    <button onClick={onClose} className="font-bold text-2xl">&times;</button>
                </div>
                <div className="p-4 space-y-4">
                    {categories.map(category => (
                        <div key={category}>
                            <h4 className="font-bold text-lg mb-2 text-primary-blue dark:text-gray-100">{category}</h4>
                            <div className="space-y-2">
                                {HOSPITAL_BAG_CHECKLIST.filter(item => item.category === category).map(item => (
                                    <label key={item.id} className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                                        <input type="checkbox" checked={packedItems.has(item.id)} onChange={() => togglePacked(item.id)} className="h-5 w-5 rounded text-primary-blue focus:ring-primary-blue" />
                                        <span className={packedItems.has(item.id) ? 'line-through text-gray-500' : ''}>{item.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const ContractionTimer: React.FC<{ userProfile: UserProfile }> = ({ userProfile }) => {
  const [isTiming, setIsTiming] = useState(false);
  const [timer, setTimer] = useState(0);
  const [contractions, setContractions] = useState<Contraction[]>(() => {
    const saved = localStorage.getItem('contractionsLog');
    return saved ? JSON.parse(saved) : [];
  });
  const [showChecklist, setShowChecklist] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    localStorage.setItem('contractionsLog', JSON.stringify(contractions));
  }, [contractions]);

  useEffect(() => {
    if (isTiming) {
      startTimeRef.current = Date.now();
      intervalRef.current = window.setInterval(() => {
        setTimer(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTiming]);

  const { summary, laborAlert } = useMemo(() => {
    if (contractions.length < 2) {
      return { summary: null, laborAlert: null };
    }

    const avgDuration = contractions.reduce((acc, c) => acc + c.duration, 0) / contractions.length;
    
    const frequencies = [];
    for (let i = 0; i < contractions.length - 1; i++) {
        frequencies.push((contractions[i].startTime - contractions[i+1].startTime) / 1000);
    }
    const avgFrequency = frequencies.length > 0 ? frequencies.reduce((acc, f) => acc + f, 0) / frequencies.length : 0;

    const oneHourAgo = Date.now() - 3600 * 1000;
    const recentContractions = contractions.filter(c => c.startTime > oneHourAgo);
    let alert = null;
    if (recentContractions.length >= 6) { // Analyze last hour if there are enough contractions
        const recentAvgDuration = recentContractions.reduce((a, b) => a + b.duration, 0) / recentContractions.length;
        
        let recentTotalFrequency = 0;
        for (let i = 0; i < recentContractions.length - 1; i++) {
            recentTotalFrequency += (recentContractions[i].startTime - recentContractions[i+1].startTime) / 1000;
        }
        const recentAvgFrequency = recentContractions.length > 1 ? recentTotalFrequency / (recentContractions.length - 1) : 0;
        
        // 5-1-1 Rule: Lasting 1 minute (60s), 5 minutes apart (300s), for 1 hour.
        if (recentAvgDuration >= 60 && recentAvgFrequency <= 300) { 
            alert = {
                title: "Labor May Be Progressing!",
                message: `Contractions over the last hour are averaging ${formatTime(recentAvgDuration)} long and ${formatTime(recentAvgFrequency)} apart. This matches the 5-1-1 rule. It might be time to contact your provider.`,
            };
        }
    }

    return {
      summary: { avgDuration, avgFrequency },
      laborAlert: alert
    };
  }, [contractions]);

  const handleToggle = () => {
    triggerHapticFeedback(100);
    if (isTiming) {
      const endTime = Date.now();
      const newContraction: Contraction = {
        startTime: startTimeRef.current,
        endTime,
        duration: Math.floor((endTime - startTimeRef.current) / 1000),
      };
      setContractions(prev => [newContraction, ...prev]);
    }
    setTimer(0);
    setIsTiming(prev => !prev);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to delete all logged contractions?")) {
        setIsTiming(false);
        setTimer(0);
        setContractions([]);
    }
  }
  
  const getFrequency = (index: number) => {
    if (index >= contractions.length - 1) return null;
    const current = contractions[index];
    const previous = contractions[index + 1];
    return Math.floor((current.startTime - previous.startTime) / 1000);
  }

  const handleShare = async () => {
    const summaryText = summary ? `Summary: Avg Duration ${formatTime(summary.avgDuration)}, Avg Frequency ${formatTime(summary.avgFrequency)}\n\n` : '';
    const logText = "Contraction Log:\n" + contractions.map((c, i) => {
        const time = new Date(c.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const duration = formatTime(c.duration);
        const freq = getFrequency(i);
        const frequencyText = freq ? `(Freq: ${formatTime(freq)})` : '';
        return `${i+1}. ${time} - Duration: ${duration} ${frequencyText}`;
    }).join('\n');
    
    const fullText = summaryText + logText;

    if (navigator.share) {
      await navigator.share({ title: 'Contraction Log', text: fullText });
    } else {
      await navigator.clipboard.writeText(fullText);
      alert('Contraction log copied to clipboard!');
    }
  };


  return (
    <div className="p-4 space-y-6">
      {showChecklist && <ChecklistModal onClose={() => setShowChecklist(false)} />}
      <h2 className="text-3xl font-bold text-center">Contraction Timer</h2>
      
      <div className="bg-pure-white dark:bg-gray-800 rounded-xl shadow-lg text-center p-6">
        <div className="text-4xl sm:text-5xl lg:text-6xl font-mono font-bold mb-4">{formatTime(timer)}</div>
        <button
          onClick={handleToggle}
          className={`w-full text-white text-xl sm:text-2xl font-bold transition-transform duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg rounded-xl py-6 sm:py-8 ${
            isTiming ? 'bg-gradient-to-br from-warm-coral to-alert-red' : 'bg-gradient-to-br from-mint-green to-primary-blue'
          }`}
        >
          {isTiming ? 'Stop Contraction' : 'Start Contraction'}
        </button>
      </div>

      {laborAlert && (
          <div className="bg-warning-amber/10 border-l-4 border-warning-amber text-amber-800 dark:text-amber-200 p-4 rounded-r-lg shadow-md animate-slideInUp">
              <div className="flex">
                  <AlertTriangleIcon className="h-6 w-6 mr-3"/>
                  <div>
                      <h4 className="font-bold">{laborAlert.title}</h4>
                      <p className="text-sm mt-1">{laborAlert.message}</p>
                      {userProfile.emergencyContact?.name && (
                        <div className="mt-3 pt-3 border-t border-warning-amber/30 flex flex-col sm:flex-row sm:items-center gap-3">
                           <a href={`tel:${userProfile.emergencyContact.phone}`} className="flex items-center gap-2 text-sm font-semibold p-2 bg-warning-amber/20 rounded-lg">
                             <PhoneIcon className="w-4 h-4" /> Call {userProfile.emergencyContact.name}
                           </a>
                           <button onClick={() => setShowChecklist(true)} className="flex items-center gap-2 text-sm font-semibold p-2 bg-warning-amber/20 rounded-lg">
                             <ClipboardIcon className="w-4 h-4" /> Hospital Bag
                           </button>
                        </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {contractions.length > 0 ? (
        <div className="bg-pure-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
            {summary && (
                <div className="grid grid-cols-2 gap-4 text-center mb-4 p-2">
                    <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Avg. Duration</div>
                        <div className="text-lg sm:text-xl font-bold">{formatTime(summary.avgDuration)}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Avg. Frequency</div>
                        <div className="text-lg sm:text-xl font-bold">{formatTime(summary.avgFrequency)}</div>
                    </div>
                </div>
            )}
            <div className="flex justify-between items-center mb-2 px-2 border-t dark:border-gray-700 pt-4">
                <h3 className="text-xl font-bold">Log</h3>
                <div>
                  <button onClick={handleShare} className="p-2 text-gray-500 hover:text-primary-blue"><ShareIcon /></button>
                  <button onClick={handleReset} className="text-sm text-alert-red font-semibold">Reset</button>
                </div>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto p-1">
              {contractions.map((c, i) => (
                <div key={c.startTime} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center text-sm">
                  <div className="font-semibold">
                    <p>{new Date(c.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="flex gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="font-semibold">{formatTime(c.duration)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Frequency</p>
                      <p className="font-semibold">{getFrequency(i) ? formatTime(getFrequency(i)!) : '--:--'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      ) : (
          <LaborEducation />
      )}
    </div>
  );
};

export default ContractionTimer;