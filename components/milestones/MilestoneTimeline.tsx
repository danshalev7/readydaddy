import React from 'react';
import type { Milestone, MilestoneMemory } from '../../types';
import { MedicalIcon, ClipboardIcon, GiftIcon, CheckCircleIcon } from '../layout/Icons';

interface MilestoneTimelineProps {
    milestones: Milestone[];
    celebratedMilestoneIds: string[];
    memories: MilestoneMemory[];
}

const categoryStyles = {
    Medical: { icon: <MedicalIcon className="w-5 h-5 text-info-blue" />, color: 'bg-info-blue' },
    Preparation: { icon: <ClipboardIcon className="w-5 h-5 text-soft-purple" />, color: 'bg-soft-purple' },
    Social: { icon: <GiftIcon className="w-5 h-5 text-warm-coral" />, color: 'bg-warm-coral' }
};

const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({ milestones, celebratedMilestoneIds, memories }) => {
    if (milestones.length === 0) {
        return <p className="text-center text-gray-500">Loading timeline...</p>;
    }
    
    const sortedMilestones = [...milestones].sort((a, b) => a.week - b.week);

    return (
        <div className="relative pl-8">
            <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-8">
                {sortedMilestones.map(milestone => {
                    const isCelebrated = celebratedMilestoneIds.includes(milestone.id);
                    const memory = memories.find(m => m.milestoneId === milestone.id);
                    const style = categoryStyles[milestone.category] || categoryStyles.Preparation;

                    return (
                        <div key={milestone.id} className="relative">
                            <div className={`absolute -left-5 top-1.5 w-5 h-5 rounded-full flex items-center justify-center ${isCelebrated ? style.color : 'bg-gray-300 dark:bg-gray-600'}`}>
                                {isCelebrated ? <CheckCircleIcon className="w-5 h-5 text-white bg-success-green rounded-full p-0.5" /> : style.icon}
                            </div>
                            <div className={`transition-opacity duration-500 ${isCelebrated ? 'opacity-100' : 'opacity-60'}`}>
                                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Week {milestone.week}</p>
                                <h4 className="font-bold text-gray-900 dark:text-gray-100">{milestone.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{milestone.description}</p>
                                {memory && (
                                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-start space-x-3">
                                        {memory.photo && <img src={memory.photo} alt={`Memory of ${milestone.name}`} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />}
                                        <div className="text-sm">
                                            <p className="font-semibold text-gray-800 dark:text-gray-200">Your Memory:</p>
                                            <p className="italic text-gray-600 dark:text-gray-300">"{memory.note}"</p>
                                            <p className="text-xs text-gray-400 mt-1">{new Date(memory.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MilestoneTimeline;