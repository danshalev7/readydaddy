import React, { useState, useEffect } from 'react';
import { DAILY_MESSAGES } from '../../constants';
import type { UserProfile } from '../../types';

interface DailyMessagesProps {
  week: number;
  userProfile: UserProfile;
}

const DailyMessages: React.FC<DailyMessagesProps> = ({ week, userProfile }) => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const weekMessages = DAILY_MESSAGES.find(w => w.week === week);
    if (weekMessages) {
        setMessages(weekMessages.daily_messages);
    } else {
        // Fallback for weeks where data is missing (e.g., weeks 1-2)
        setMessages(["I'm growing bigger every day, Dad!", "Can't wait to meet you!", "Thanks for being there for Mom."]);
    }
  }, [week]);

  return (
    <div className="bg-pure-white dark:bg-gray-800 p-6 rounded-xl shadow-md animate-slideInUp">
      <h2 className="text-xl font-bold mb-4">Messages from {userProfile.babyNickname || 'Baby'}</h2>
        <div className="space-y-3">
          {messages.map((msg, index) => (
            <div key={index} className="bg-baby-blue dark:bg-gray-700 p-4 rounded-lg flex items-start space-x-3">
              <span className="text-xl text-warm-coral">❤️</span>
              <p className="font-handwritten text-xl text-gray-800 dark:text-gray-200">{msg}</p>
            </div>
          ))}
        </div>
    </div>
  );
};

export default DailyMessages;