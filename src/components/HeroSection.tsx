import React from 'react';
import { siteConfig, formatNaira } from '../config/site';
import { useAdminData } from '../hooks/useAdminData';
import { ImageWithPlaceholder } from './ImageWithPlaceholder';
import { ArrowDown, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onOrderClick: () => void;
  onCheckCompatibility: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOrderClick,
  onCheckCompatibility,
}) => {
  const adminData = useAdminData();
  const heroImage = siteConfig.productImages[0];

  return (
    <section className="relative bg-[#0B0B0D] text-white pt-8 pb-14 sm:py-16 lg:py-20 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & Action */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E32636]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#151518] border border-neutral-800 text-white">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E32636]" />
                FREE DELIVERY
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#151518] border border-neutral-800 text-white">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E32636]" />
                PAY ON DELIVERY
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-display text-balance leading-tight">
              Fuel Pump Problems? Get the Right Replacement.
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl font-semibold text-[#E32636] font-display">
              Get back on the road with the {siteConfig.productName}.
            </p>

            {/* Description */}
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
              Looking for a replacement fuel pump? Choose a pump suited to your vehicle and confirm compatibility before ordering.
            </p>

            {/* Prices */}
            <div className="pt-2 pb-1 flex flex-wrap items-center gap-4 text-sm sm:text-base font-bold font-mono">
              <div className="bg-[#151518] border border-neutral-800 px-4 py-2.5 rounded-xl">
                <span className="text-neutral-400 text-xs block font-sans uppercase">Single Unit</span>
                <span className="text-white">1 FUEL PUMP — {formatNaira(adminData.singlePrice)}</span>
              </div>
              <div className="bg-[#151518] border border-neutral-800 px-4 py-2.5 rounded-xl">
                <span className="text-neutral-400 text-xs block font-sans uppercase">Double Pack</span>
                <span className="text-[#E32636]">2 FUEL PUMPS — {formatNaira(adminData.doublePrice)}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={onOrderClick}
                type="button"
                className="min-tap-target px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-[#E32636] hover:bg-[#B51222] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>ORDER YOUR FUEL PUMP</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={onCheckCompatibility}
                type="button"
                className="min-tap-target px-6 py-3.5 text-sm sm:text-base font-semibold text-neutral-300 hover:text-white bg-[#151518] hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>CHECK VEHICLE COMPATIBILITY</span>
              </button>
            </div>
          </div>

          {/* Right Column: Large Product Image */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl p-2 bg-[#151518] border border-neutral-800 shadow-2xl">
              <ImageWithPlaceholder
                src={heroImage?.url}
                alt={heroImage?.alt || 'FRANKBLAISE ELECTRIC FUEL PUMP PLUS'}
                slotLabel={heroImage?.slotName || 'Electric Fuel Pump'}
                aspectRatio="4/3"
                priority={true}
              />
              <div className="p-3 text-center">
                <span className="text-xs font-mono text-neutral-400">
                  {siteConfig.productName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
