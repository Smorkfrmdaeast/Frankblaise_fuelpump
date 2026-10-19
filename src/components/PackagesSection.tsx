import React from 'react';
import { useProductConfig } from '../hooks/useProductConfig';
import { formatNaira } from '../config/site';
import { Check, ArrowDown } from 'lucide-react';

export type PackageSelection = 'single' | 'double';

interface PackagesSectionProps {
  selectedPackage: PackageSelection;
  onSelectPackage: (pkg: PackageSelection) => void;
  onScrollToForm: () => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  selectedPackage,
  onSelectPackage,
  onScrollToForm,
}) => {
  const config = useProductConfig();

  const handleSelectAndScroll = (pkg: PackageSelection) => {
    onSelectPackage(pkg);
    onScrollToForm();
  };

  return (
    <section id="packages" className="bg-[#E9E7E2] text-[#1B1C1F] py-16 lg:py-24 border-b border-[#D5D2CB]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-[#B51222] font-bold">
            SECTION 06 · COMMERCIAL PACKAGES
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase font-display tracking-tight text-[#1B1C1F]">
            Package Configuration &amp; Pricing
          </h2>
          <p className="text-sm sm:text-base text-[#2B2D31]">
            Select your required quantity. Package selection updates your order terminal below. No invented deadlines or deceptive discounts.
          </p>
        </div>

        {/* Package Grid (2 Symmetrical Technical Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* PACKAGE A: 1 FUEL PUMP */}
          <div
            onClick={() => onSelectPackage('single')}
            className={`rounded-2xl p-6 sm:p-8 border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedPackage === 'single'
                ? 'border-[#B51222] bg-white shadow-md ring-2 ring-[#B51222]/10'
                : 'border-[#D5D2CB] bg-white/70 hover:bg-white hover:border-[#6E7075]'
            }`}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#E9E7E2] pb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#6E7075]">
                  PACKAGE A · SINGLE UNIT
                </span>
                <input
                  type="radio"
                  name="package-choice"
                  checked={selectedPackage === 'single'}
                  onChange={() => onSelectPackage('single')}
                  aria-label="Select Package A: 1 Fuel Pump"
                  className="w-4 h-4 accent-[#B51222]"
                />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold uppercase font-display text-[#1B1C1F]">
                  ONE FUEL PUMP
                </h3>
                <div className="mt-2">
                  <span className="text-3xl sm:text-4xl font-bold font-mono tabular-nums text-[#1B1C1F]">
                    {formatNaira(config.prices.singlePump)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#E9E7E2] text-xs sm:text-sm text-[#2B2D31]">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#B51222] shrink-0 mt-0.5" />
                  <span>1x FRANKBLAISE Electric Fuel Pump Unit (12V)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#B51222] shrink-0 mt-0.5" />
                  <span>1x Micron Inlet Strainer Filter Sock</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#B51222] shrink-0 mt-0.5" />
                  <span>1x Submersible Rubber Fuel Hose &amp; Clamps</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#B51222] shrink-0 mt-0.5" />
                  <span>1x 2-Pin Electrical Pigtail Wiring Harness</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#B51222] shrink-0 mt-0.5" />
                  <span>Telephone vehicle fitment verification before dispatch</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectAndScroll('single');
                }}
                className={`min-tap-target w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center gap-2 ${
                  selectedPackage === 'single'
                    ? 'bg-[#B51222] text-white hover:bg-[#8F0E1B]'
                    : 'bg-[#1B1C1F] text-white hover:bg-[#2B2D31]'
                }`}
              >
                <span>SELECT PACKAGE A</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* PACKAGE B: 2 FUEL PUMPS */}
          <div
            onClick={() => onSelectPackage('double')}
            className={`rounded-2xl p-6 sm:p-8 border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedPackage === 'double'
                ? 'border-[#B51222] bg-white shadow-md ring-2 ring-[#B51222]/10'
                : 'border-[#D5D2CB] bg-white/70 hover:bg-white hover:border-[#6E7075]'
            }`}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#E9E7E2] pb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B51222]">
                  PACKAGE B · FLEET &amp; DUAL PACK
                </span>
                <input
                  type="radio"
                  name="package-choice"
                  checked={selectedPackage === 'double'}
                  onChange={() => onSelectPackage('double')}
                  aria-label="Select Package B: 2 Fuel Pumps"
                  className="w-4 h-4 accent-[#B51222]"
                />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold uppercase font-display text-[#1B1C1F]">
                  TWO FUEL PUMPS
                </h3>
                <div className="mt-2">
                  <span className="text-3xl sm:text-4xl font-bold font-mono tabular-nums text-[#B51222]">
                    {formatNaira(config.prices.doublePump)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#E9E7E2] text-xs sm:text-sm text-[#2B2D31]">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#B51222] shrink-0 mt-0.5" />
                  <span>2x FRANKBLAISE Electric Fuel Pump Units (12V)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#B51222] shrink-0 mt-0.5" />
                  <span>2x Micron Inlet Strainer Filter Socks</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#B51222] shrink-0 mt-0.5" />
                  <span>2x Submersible Rubber Fuel Hoses &amp; Clamps</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#B51222] shrink-0 mt-0.5" />
                  <span>2x 2-Pin Electrical Pigtail Wiring Harnesses</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#B51222] shrink-0 mt-0.5" />
                  <span>Ideal for multi-vehicle owners or backup inventory</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectAndScroll('double');
                }}
                className={`min-tap-target w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center flex items-center justify-center gap-2 ${
                  selectedPackage === 'double'
                    ? 'bg-[#B51222] text-white hover:bg-[#8F0E1B]'
                    : 'bg-[#1B1C1F] text-white hover:bg-[#2B2D31]'
                }`}
              >
                <span>SELECT PACKAGE B</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
