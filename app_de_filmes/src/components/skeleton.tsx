import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="flex-shrink-0 w-[150px] sm:w-[180px] md:w-[220px] aspect-[2/3] rounded-2xl bg-gray-800/50 dark:bg-gray-800/40 animate-pulse relative overflow-hidden border border-gray-700/10">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col gap-2">
        <div className="h-4 bg-gray-700/60 dark:bg-gray-700/40 rounded w-3/4" />
        <div className="h-3 bg-gray-700/60 dark:bg-gray-700/40 rounded w-1/2" />
      </div>
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="w-full h-[65vh] sm:h-[80vh] md:h-[85vh] bg-gray-900/50 dark:bg-gray-900/30 animate-pulse flex flex-col justify-end p-8 sm:p-16 relative border-b border-gray-800/20">
      <div className="max-w-2xl flex flex-col gap-4 z-10">
        <div className="h-10 sm:h-14 bg-gray-800/60 dark:bg-gray-800/40 rounded-xl w-3/4" />
        <div className="flex gap-2 items-center">
          <div className="h-4 bg-gray-800/60 dark:bg-gray-800/40 rounded w-16" />
          <div className="h-4 bg-gray-800/60 dark:bg-gray-800/40 rounded w-16" />
          <div className="h-4 bg-gray-800/60 dark:bg-gray-800/40 rounded w-16" />
        </div>
        <div className="h-4 bg-gray-800/60 dark:bg-gray-800/40 rounded w-full" />
        <div className="h-4 bg-gray-800/60 dark:bg-gray-800/40 rounded w-5/6" />
        <div className="flex gap-4 mt-4">
          <div className="h-12 bg-gray-800/60 dark:bg-gray-800/40 rounded-xl w-32" />
          <div className="h-12 bg-gray-800/60 dark:bg-gray-800/40 rounded-xl w-32" />
        </div>
      </div>
    </div>
  );
};

export const DetailsSkeleton: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gray-950/30 animate-pulse pt-28 pb-12 px-6 md:px-16 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-[200px] md:w-[320px] aspect-[2/3] rounded-2xl bg-gray-800/60 dark:bg-gray-800/40 flex-shrink-0" />
        <div className="flex-1 flex flex-col gap-4 w-full">
          <div className="h-10 bg-gray-800/60 dark:bg-gray-800/40 rounded-xl w-1/2" />
          <div className="flex gap-3">
            <div className="h-4 bg-gray-800/60 dark:bg-gray-800/40 rounded w-12" />
            <div className="h-4 bg-gray-800/60 dark:bg-gray-800/40 rounded w-12" />
            <div className="h-4 bg-gray-800/60 dark:bg-gray-800/40 rounded w-20" />
          </div>
          <div className="h-24 bg-gray-800/60 dark:bg-gray-800/40 rounded-xl w-full mt-4" />
          <div className="h-6 bg-gray-800/60 dark:bg-gray-800/40 rounded w-28 mt-6" />
          <div className="flex gap-4 mt-2">
            <div className="w-16 h-20 rounded-xl bg-gray-800/60 dark:bg-gray-800/40" />
            <div className="w-16 h-20 rounded-xl bg-gray-800/60 dark:bg-gray-800/40" />
            <div className="w-16 h-20 rounded-xl bg-gray-800/60 dark:bg-gray-800/40" />
            <div className="w-16 h-20 rounded-xl bg-gray-800/60 dark:bg-gray-800/40" />
          </div>
        </div>
      </div>
    </div>
  );
};
