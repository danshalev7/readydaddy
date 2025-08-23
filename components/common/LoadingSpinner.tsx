import React from 'react';

const LoadingSpinner: React.FC<{ text?: string }> = ({ text = "Loading..."}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-t-primary-blue dark:border-t-warm-coral border-gray-200 dark:border-gray-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-gray-600 dark:text-gray-300">{text}</p>
    </div>
  );
};

export default LoadingSpinner;