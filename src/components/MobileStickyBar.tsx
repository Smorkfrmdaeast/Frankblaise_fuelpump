import React from 'react';
import { PackageType } from './PackagePricingSelector';
import { Truck } from 'lucide-react';

interface MobileStickyBarProps {
  selectedPackage: PackageType;
  onOrderClick: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ selectedPackage, onOrderClick }) => {
  const price = selectedPackage === 'double' ? '₦45,000' : '₦25,000';
  const label = selectedPackage === 'double' ? '2 Pumps Pack' : '1 Pump Pack';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 px-4 py-2.5 shadow-2xl">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-black text-white font-mono tabular-nums">{price}</span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/80">
              FREE SHIP
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 font-medium">
            {label} · Pay on Delivery
          </span>
        </div>

        <button
          onClick={onOrderClick}
          type="button"
          className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl shadow-lg shadow-red-950/80 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>Order Now</span>
          <Truck className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
