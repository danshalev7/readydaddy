import React, { useState } from 'react';
import type { Milestone, MilestoneMemory } from '../../types';

interface MilestoneCelebrationProps {
  milestone: Milestone;
  onComplete: (milestoneId: string, memory?: MilestoneMemory) => void;
  onClose: () => void;
}

const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({ milestone, onComplete, onClose }) => {
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const hasNote = note.trim().length > 0;

  const handleSave = () => {
    setIsSaving(true);
    if (!note.trim()) {
        onComplete(milestone.id);
        return;
    }
    const memory: MilestoneMemory = {
      milestoneId: milestone.id,
      note,
      date: new Date().toISOString(),
    };
    onComplete(milestone.id, memory);
  };
  
  const handleClose = () => {
    if (isSaving) return;
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" role="dialog" aria-modal="true" aria-labelledby="milestone-title">
      <div className="bg-pure-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg h-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
            <header className="text-center">
                <h2 className="text-sm font-bold uppercase text-primary-blue tracking-widest">Milestone Reached!</h2>
                <h1 id="milestone-title" className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">{milestone.name}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{milestone.description}</p>
            </header>

            <div className="bg-baby-blue dark:bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 dark:text-gray-200">Why This Is a Big Deal for You</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{milestone.fatherSignificance}</p>
            </div>

            <div className="bg-soft-pink dark:bg-warm-coral/10 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 dark:text-gray-200">Navigating Your Emotions</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{milestone.emotionalGuidance}</p>
            </div>

            <div className="space-y-3 pt-4 border-t dark:border-gray-700">
                <h3 className="text-lg font-bold text-center">Capture This Moment</h3>
                <p className="text-sm text-center text-gray-500 italic">"{milestone.celebrationPrompt}"</p>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write down your thoughts and feelings..."
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
                <p className="text-xs text-gray-500 text-center">Add a note to remember this day forever. It will appear in your Milestone Journey on your profile.</p>
            </div>
        </div>
        <footer className="flex-shrink-0 p-4 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700 grid grid-cols-2 gap-3">
            <button onClick={handleClose} disabled={isSaving} className="px-4 py-3 bg-gray-200 dark:bg-gray-600 font-bold rounded-lg disabled:opacity-50">
                {isSaving ? '...' : 'Close'}
            </button>
            <button onClick={handleSave} disabled={isSaving} className="px-4 py-3 bg-primary-blue text-white font-bold rounded-lg disabled:opacity-50">
                {isSaving ? 'Saving...' : (hasNote ? 'Save & Celebrate' : 'Celebrate')}
            </button>
        </footer>
      </div>
    </div>
  );
};

export default MilestoneCelebration;