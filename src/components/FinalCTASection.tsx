import React from 'react';
import { formatNaira } from '../config/site';
import { useAdminData } from '../hooks/useAdminData';
import { ArrowDown } from 'lucide-react';

interface FinalCTASectionProps {
  onOrderClick: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({ onOrderClick }) => {
  const adminData = useAdminData();

  return (
    <section className="py-16 lg:py-20 bg-[#0B0B0D] text-white border-b border-neutral-800 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white font-display">
          Ready to Find the Right Fuel Pump?
        </h2>

        <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
          Provide your vehicle details and choose your package so the seller can review your order.
        </p>

        {/* Show both packages */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-mono font-bold">
          <div className="bg-[#151518] border border-neutral-800 px-5 py-3 rounded-xl">
            <span className="text-neutral-400 font-sans block text-xs">Option 1</span>
            <span>1 FUEL PUMP — {formatNaira(adminData.singlePrice)}</span>
          </div>
          <div className="bg-[#151518] border border-neutral-800 px-5 py-3 rounded-xl">
            <span className="text-neutral-400 font-sans block text-xs">Option 2</span>
            <span className="text-[#E32636]">2 FUEL PUMPS — {formatNaira(adminData.doublePrice)}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button
            onClick={onOrderClick}
            type="button"
            className="min-tap-target px-8 py-4 bg-[#E32636] hover:bg-[#B51222] text-white font-bold text-sm sm:text-base rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xl"
          >
            <span>ORDER YOUR FUEL PUMP NOW</span>
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
