import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Banknote, Flame } from 'lucide-react';

interface FinalCTAProps {
  onOrderClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOrderClick }) => {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-neutral-900 to-black text-white border-b border-neutral-800 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #dc2626 0%, transparent 70%)`
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 bg-red-950/60 border border-red-800/60 px-3.5 py-1.5 rounded-full">
          <Flame className="w-3.5 h-3.5 text-red-500" />
          <span>UPGRADE YOUR VEHICLE FUEL SYSTEM TODAY</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-display text-balance max-w-3xl mx-auto">
          Don't Wait For Your Fuel Pump To Die In Traffic. Upgrade To Frankblaise Plus Now.
        </h2>

        <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Get continuous 4.0 Bar pressure, instant ignition, and zero stalling. 100% Free Nationwide Delivery anywhere in Nigeria. Inspect your package before paying.
        </p>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOrderClick}
            type="button"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:to-red-500 text-white font-black text-base sm:text-lg rounded-2xl shadow-2xl shadow-red-950 hover:shadow-red-600/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>ORDER NOW (PAY ON DELIVERY)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Pills */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-red-400" /> Free Delivery To All 36 States
          </span>
          <span className="flex items-center gap-1.5">
            <Banknote className="w-4 h-4 text-emerald-400" /> Cash or Transfer on Delivery
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> 1-Year Direct Replacement Guarantee
          </span>
        </div>
      </div>
    </section>
  );
};
