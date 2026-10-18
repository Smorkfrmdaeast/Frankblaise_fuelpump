import React from 'react';
import { Check, ShieldCheck, Sparkles, Truck, Banknote } from 'lucide-react';

export type PackageType = 'single' | 'double';

interface PackagePricingSelectorProps {
  selectedPackage: PackageType;
  onSelectPackage: (pkg: PackageType) => void;
  onProceedToForm: () => void;
}

export const PackagePricingSelector: React.FC<PackagePricingSelectorProps> = ({
  selectedPackage,
  onSelectPackage,
  onProceedToForm,
}) => {
  return (
    <section id="pricing" className="py-16 lg:py-24 bg-white text-neutral-900 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-red-600">
            <span>OFFICIAL FACTORY PRICING</span>
            <span aria-hidden="true">·</span>
            <span>NO HIDDEN COURIER SURCHARGES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 font-display">
            Select Your Preferred Package
          </h2>
          <p className="text-base text-neutral-600">
            Select your package below. Both packages include full installation hardware, 100% Free Nationwide Delivery, and Pay On Delivery privileges.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Package 1: Single Pump */}
          <div
            onClick={() => onSelectPackage('single')}
            className={`rounded-3xl p-6 sm:p-8 border-2 transition-all cursor-pointer flex flex-col justify-between relative bg-neutral-50/70 hover:bg-neutral-50 ${
              selectedPackage === 'single'
                ? 'border-red-600 shadow-xl ring-2 ring-red-600/20'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">
                  STANDARD MOTORIST OPTION
                </span>
                <input
                  type="radio"
                  name="package"
                  checked={selectedPackage === 'single'}
                  onChange={() => onSelectPackage('single')}
                  className="w-5 h-5 text-red-600 accent-red-600"
                />
              </div>

              <h3 className="text-2xl font-black text-neutral-900 font-display mb-1">
                Single Fuel Pump Pack
              </h3>
              <p className="text-xs text-neutral-500 mb-6">
                1x FRANKBLAISE ELECTRIC FUEL PUMP PLUS
              </p>

              <div className="mb-6 p-4 bg-white rounded-2xl border border-neutral-200">
                <span className="text-xs text-neutral-400 block mb-1">Total Delivered Price:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-neutral-900 font-mono tabular-nums">
                    ₦25,000
                  </span>
                  <span className="text-sm text-neutral-400 line-through font-mono">
                    ₦35,000
                  </span>
                </div>
                <span className="text-xs font-semibold text-emerald-600 mt-1 block">
                  Delivery Fee: ₦0 (FREE) · Pay On Delivery
                </span>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-neutral-700 mb-8">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>1x High-Performance Electric Fuel Pump</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>1x Micro-Mesh Inlet Strainer Filter Sock</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>1x Wiring Pigtail Harness &amp; Clamps</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>1-Year Direct Replacement Warranty</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Payment upon physical delivery at your door</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectPackage('single');
                onProceedToForm();
              }}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                selectedPackage === 'single'
                  ? 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-lg'
                  : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800'
              }`}
            >
              <span>{selectedPackage === 'single' ? '✓ Selected — Fill Order Form' : 'Select Single Pack (₦25,000)'}</span>
            </button>
          </div>

          {/* Package 2: Double Pack (Best Value) */}
          <div
            onClick={() => onSelectPackage('double')}
            className={`rounded-3xl p-6 sm:p-8 border-2 transition-all cursor-pointer flex flex-col justify-between relative bg-neutral-950 text-white shadow-2xl ${
              selectedPackage === 'double'
                ? 'border-red-500 ring-2 ring-red-500/30'
                : 'border-neutral-800 hover:border-neutral-700'
            }`}
          >
            {/* Best Value Badge */}
            <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-red-600 to-amber-500 text-white text-xs font-black px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MOST POPULAR · SAVE ₦5,000</span>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                  DOUBLE PUMP COMBO
                </span>
                <input
                  type="radio"
                  name="package"
                  checked={selectedPackage === 'double'}
                  onChange={() => onSelectPackage('double')}
                  className="w-5 h-5 text-red-600 accent-red-600"
                />
              </div>

              <h3 className="text-2xl font-black text-white font-display mb-1">
                Double Value Pack (2 Pumps)
              </h3>
              <p className="text-xs text-neutral-400 mb-6">
                2x FRANKBLAISE ELECTRIC FUEL PUMPS PLUS (Keep a spare or 2nd car)
              </p>

              <div className="mb-6 p-4 bg-neutral-900 rounded-2xl border border-neutral-800">
                <span className="text-xs text-neutral-400 block mb-1">Total Delivered Price:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono tabular-nums">
                    ₦45,000
                  </span>
                  <span className="text-sm text-neutral-500 line-through font-mono">
                    ₦70,000
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="font-semibold text-emerald-400">
                    Delivery: ₦0 (FREE) · Pay On Delivery
                  </span>
                  <span className="text-amber-400 font-bold font-mono">
                    ₦22,500 / pump
                  </span>
                </div>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-neutral-200 mb-8">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>2x High-Performance Electric Fuel Pumps</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>2x Complete Installation Hardware Kits</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Keep 1 as emergency spare in vehicle trunk</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>1-Year Direct Replacement Warranty on BOTH units</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Priority fast-track nationwide courier dispatch</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectPackage('double');
                onProceedToForm();
              }}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-xl shadow-red-950 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{selectedPackage === 'double' ? '✓ Selected — Fill Order Form' : 'Select Double Pack (₦45,000)'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
