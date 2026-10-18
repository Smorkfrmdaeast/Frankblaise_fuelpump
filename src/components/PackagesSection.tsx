import React from 'react';
import { formatNaira } from '../config/site';
import { useAdminData } from '../hooks/useAdminData';
import { Check } from 'lucide-react';

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
  const adminData = useAdminData();

  const handleSelect = (pkg: PackageSelection) => {
    onSelectPackage(pkg);
    onScrollToForm();
  };

  return (
    <section id="packages" className="py-16 lg:py-20 bg-[#FFFFFF] text-[#292929] border-b border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#292929] font-display">
            Choose Your Fuel Pump Package
          </h2>
          <p className="text-sm text-[#777777]">
            Select the quantity you require for your vehicle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch mb-8">
          {/* Card 1: 1 FUEL PUMP */}
          <div
            onClick={() => onSelectPackage('single')}
            className={`rounded-2xl p-6 sm:p-8 border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedPackage === 'single'
                ? 'border-[#E32636] bg-[#F5F5F7] shadow-md'
                : 'border-neutral-200 bg-white hover:border-neutral-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#777777]">
                  Single Package
                </span>
                <input
                  type="radio"
                  name="package-select"
                  checked={selectedPackage === 'single'}
                  onChange={() => onSelectPackage('single')}
                  className="w-4 h-4 text-[#E32636] accent-[#E32636]"
                  aria-label="1 Fuel Pump"
                />
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#292929] font-display mb-2">
                1 FUEL PUMP
              </h3>

              <div className="mb-6">
                <span className="text-3xl sm:text-4xl font-black text-[#292929] font-mono tabular-nums">
                  {formatNaira(adminData.singlePrice)}
                </span>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-[#777777] mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#E32636] shrink-0 mt-0.5" />
                  <span>1x Electric Fuel Pump Unit</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#E32636] shrink-0 mt-0.5" />
                  <span>Delivery arrangement confirmed by seller</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('single');
              }}
              className={`min-tap-target w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer text-center ${
                selectedPackage === 'single'
                  ? 'bg-[#E32636] text-white hover:bg-[#B51222]'
                  : 'bg-[#151518] text-white hover:bg-neutral-800'
              }`}
            >
              SELECT THIS PACKAGE
            </button>
          </div>

          {/* Card 2: 2 FUEL PUMPS */}
          <div
            onClick={() => onSelectPackage('double')}
            className={`rounded-2xl p-6 sm:p-8 border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedPackage === 'double'
                ? 'border-[#E32636] bg-[#F5F5F7] shadow-md'
                : 'border-neutral-200 bg-white hover:border-neutral-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#777777]">
                  Double Package
                </span>
                <input
                  type="radio"
                  name="package-select"
                  checked={selectedPackage === 'double'}
                  onChange={() => onSelectPackage('double')}
                  className="w-4 h-4 text-[#E32636] accent-[#E32636]"
                  aria-label="2 Fuel Pumps"
                />
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#292929] font-display mb-2">
                2 FUEL PUMPS
              </h3>

              <div className="mb-6">
                <span className="text-3xl sm:text-4xl font-black text-[#292929] font-mono tabular-nums">
                  {formatNaira(adminData.doublePrice)}
                </span>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-[#777777] mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#E32636] shrink-0 mt-0.5" />
                  <span>2x Electric Fuel Pump Units</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#E32636] shrink-0 mt-0.5" />
                  <span>Delivery arrangement confirmed by seller</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('double');
              }}
              className={`min-tap-target w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer text-center ${
                selectedPackage === 'double'
                  ? 'bg-[#E32636] text-white hover:bg-[#B51222]'
                  : 'bg-[#151518] text-white hover:bg-neutral-800'
              }`}
            >
              SELECT THIS PACKAGE
            </button>
          </div>
        </div>

        {/* Note */}
        <p className="text-center text-xs text-[#777777]">
          Confirm product compatibility and applicable delivery terms before completing your order.
        </p>
      </div>
    </section>
  );
};
