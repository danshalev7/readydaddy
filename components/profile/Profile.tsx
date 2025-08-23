import React, { useState, useMemo, useEffect } from 'react';
import { ACHIEVEMENTS, LEVEL_THRESHOLDS } from '../../constants';
import type { UserProgress, UserProfile, Achievement, Milestone, MilestoneMemory } from '../../types';
import { TrophyIcon, ShareIcon } from '../layout/Icons';
import MilestoneTimeline from '../milestones/MilestoneTimeline';

interface ProfileProps {
    userProfile: UserProfile;
    userProgress: UserProgress;
    onProfileUpdate: (profile: UserProfile) => void;
    milestones: Milestone[];
    milestoneMemories: MilestoneMemory[];
}

const Profile: React.FC<ProfileProps> = ({ userProfile, userProgress, onProfileUpdate, milestones, milestoneMemories }) => {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<UserProfile>(userProfile);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        setFormData(userProfile);
    }, [userProfile]);

    const { level, points, readWeeks } = userProgress;

    const {
        unlockedAchievements,
        lockedAchievements,
        nextAchievement
    } = useMemo(() => {
        const unlocked = ACHIEVEMENTS.filter(a => a.criteria(userProgress));
        const locked = ACHIEVEMENTS.filter(a => !a.criteria(userProgress));
        return {
            unlockedAchievements: unlocked,
            lockedAchievements: locked,
            nextAchievement: locked[0] || null
        };
    }, [userProgress]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'emergencyContactName' || name === 'emergencyContactPhone') {
            const key = name === 'emergencyContactName' ? 'name' : 'phone';
            setFormData(prev => ({
                ...prev,
                emergencyContact: {
                    ...prev.emergencyContact,
                    name: prev.emergencyContact?.name || '',
                    phone: prev.emergencyContact?.phone || '',
                    [key]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const lmp = new Date(formData.lmpDate + 'T00:00:00');
        lmp.setDate(lmp.getDate() + 280);
        const dueDate = lmp;
        const updatedProfile = { ...formData, dueDate: dueDate.toISOString().split('T')[0] };
        onProfileUpdate(updatedProfile);
        setEditMode(false);
    };

    const handleShare = (achievement: Achievement) => {
        const text = `I just unlocked the "${achievement.title}" achievement on ReadyDaddy! ${achievement.icon} #ReadyDaddy #NewDad #PregnancyJourney`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                setNotification('Copied to clipboard!');
                setTimeout(() => setNotification(''), 2000);
            }).catch(err => console.error('Failed to copy: ', err));
        }
    };

    const currentLevelThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
    const nextLevelThreshold = LEVEL_THRESHOLDS[level] ?? points;
    const levelProgress = nextLevelThreshold > currentLevelThreshold
        ? Math.round(((points - currentLevelThreshold) / (nextLevelThreshold - currentLevelThreshold)) * 100)
        : 100;

    return (
        <div className="p-4 space-y-6">
            {notification && <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-success-green text-white px-4 py-2 rounded-lg shadow-lg z-50">{notification}</div>}
            
            <div className="bg-pure-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                <h2 className="text-3xl font-bold">Level {level}</h2>
                <p className="text-5xl font-bold text-primary-blue my-2">{points} <span className="text-2xl text-gray-500 dark:text-gray-400">Points</span></p>
                <div className="mt-4">
                    <div className="flex justify-between text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">
                        <span>Progress to Level {level + 1}</span>
                        <span>{levelProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4">
                        <div 
                            className="bg-gradient-to-r from-primary-blue to-mint-green h-4 rounded-full transition-all duration-500" 
                            style={{width: `${levelProgress}%`}}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{nextLevelThreshold > points ? `${nextLevelThreshold - points} points to next level` : 'Max Level Reached!'}</p>
                </div>
            </div>

             <div className="bg-pure-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4">Milestone Journey</h3>
                <MilestoneTimeline 
                    milestones={milestones} 
                    celebratedMilestoneIds={userProgress.celebratedMilestones}
                    memories={milestoneMemories} 
                />
            </div>

            <div className="bg-pure-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-3 mb-4">
                    <TrophyIcon className="w-6 h-6 text-comfort-yellow"/>
                    <h3 className="text-xl font-bold">Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})</h3>
                </div>
                <div className="space-y-4">
                    {unlockedAchievements.map(achievement => (
                        <div key={achievement.id} className="flex items-start space-x-4 p-4 bg-mint-wash dark:bg-success-green/10 rounded-lg border-l-4 border-mint-green">
                            <span className="text-3xl">{achievement.icon}</span>
                            <div className="flex-grow">
                                <h4 className="font-bold text-green-800 dark:text-green-200">{achievement.title}</h4>
                                <p className="text-sm text-green-600 dark:text-green-300">{achievement.description}</p>
                            </div>
                            <button onClick={() => handleShare(achievement)} className="p-2 text-gray-500 hover:text-primary-blue transition-colors active:scale-90">
                                <ShareIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    ))}
                    {nextAchievement && (
                         <div className="flex items-start space-x-4 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg border-l-4 border-gray-400 opacity-70">
                            <span className="text-3xl filter grayscale">{nextAchievement.icon}</span>
                            <div>
                                <h4 className="font-bold text-gray-800 dark:text-gray-200">Next Up: {nextAchievement.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{nextAchievement.description}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-pure-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Your Details</h3>
                    <button onClick={() => setEditMode(!editMode)} className="text-sm font-semibold text-primary-blue hover:underline active:text-blue-700 dark:active:text-blue-300">
                        {editMode ? 'Cancel' : 'Edit'}
                    </button>
                </div>
                {!editMode ? (
                    <div className="space-y-3 text-gray-700 dark:text-gray-300">
                        <p><strong className="font-semibold text-gray-900 dark:text-gray-100">Est. Due Date:</strong> {new Date(userProfile.dueDate + 'T00:00:00').toLocaleDateString()}</p>
                        <p><strong className="font-semibold text-gray-900 dark:text-gray-100">Partner's Name:</strong> {userProfile.partnerName}</p>
                        <p><strong className="font-semibold text-gray-900 dark:text-gray-100">Baby's Nickname:</strong> {userProfile.babyNickname || 'Not set'}</p>
                        <p><strong className="font-semibold text-gray-900 dark:text-gray-100">Emergency Contact:</strong> {userProfile.emergencyContact?.name ? `${userProfile.emergencyContact.name} - ${userProfile.emergencyContact.phone}` : 'Not set'}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Last Menstrual Period (LMP)</label>
                            <input type="date" name="lmpDate" value={formData.lmpDate} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"/>
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Partner's Name</label>
                            <input type="text" name="partnerName" value={formData.partnerName} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"/>
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Baby's Nickname</label>
                            <input type="text" name="babyNickname" value={formData.babyNickname || ''} onChange={handleInputChange} placeholder="e.g., Peanut" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"/>
                        </div>
                        <div className="pt-2 border-t dark:border-gray-700">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Emergency Contact Name</label>
                            <input type="text" name="emergencyContactName" value={formData.emergencyContact?.name || ''} onChange={handleInputChange} placeholder="e.g., Doctor, Doula" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"/>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1">Emergency Contact Phone</label>
                            <input type="tel" name="emergencyContactPhone" value={formData.emergencyContact?.phone || ''} onChange={handleInputChange} placeholder="e.g., 555-123-4567" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"/>
                        </div>
                        <button type="submit" className="w-full bg-primary-blue text-white font-bold py-2 px-4 rounded-lg transition-transform active:scale-95">Save Changes</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;