import React from 'react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#151518] border-b border-neutral-800 text-white text-xs py-2 px-4 text-center">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
        <span className="font-bold tracking-wider uppercase text-[#E32636]">
          FREE DELIVERY | PAY ON DELIVERY
        </span>
        <span className="hidden sm:inline text-neutral-500" aria-hidden="true">·</span>
        <span className="text-[11px] sm:text-xs text-neutral-400">
          Available to customers across Nigeria, subject to confirmed delivery terms.
        </span>
      </div>
    </div>
  );
};
