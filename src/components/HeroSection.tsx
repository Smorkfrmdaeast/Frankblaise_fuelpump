import React from 'react';
import { useProductConfig } from '../hooks/useProductConfig';
import { formatNaira } from '../config/site';
import { ArrowDown, Check, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onOrderClick: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOrderClick,
  onExploreClick,
}) => {
  const config = useProductConfig();
  const heroImage = config.productImages[0];

  return (
    <section id="overview" className="bg-[#F6F4EF] border-b border-[#D5D2CB] pt-8 pb-14 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Technical Narrative & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Category Lead & Optional Technical Identifier */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#6E7075]">
              <span className="uppercase tracking-widest text-[#B51222] font-bold">
                {config.category}
              </span>
              {config.technicalIdentifier && (
                <>
                  <span aria-hidden="true">/</span>
                  <span className="bg-[#E9E7E2] px-2 py-0.5 rounded text-[#2B2D31]">
                    ID: {config.technicalIdentifier}
                  </span>
                </>
              )}
            </div>

            {/* Primary Headline in Technical Condensed Grotesk */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight uppercase font-display text-[#1B1C1F] leading-tight text-balance">
              {config.productName}
            </h1>

            {/* Factual Technical Proposition (1-2 sentences) */}
            <p className="text-base sm:text-lg text-[#2B2D31] max-w-2xl leading-relaxed">
              {config.factualOverview}
            </p>

            {/* Authoritative Package Pricing Strip */}
            <div className="p-4 sm:p-5 bg-[#E9E7E2] border border-[#D5D2CB] rounded-xl">
              <span className="block text-xs font-mono uppercase tracking-wider text-[#6E7075] mb-2">
                Authoritative Package Pricing (NGN)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white p-3.5 rounded-lg border border-[#D5D2CB]">
                  <span className="text-xs text-[#6E7075] block font-mono">OPTION A · 1 UNIT</span>
                  <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#1B1C1F]">
                    {formatNaira(config.prices.singlePump)}
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-[#D5D2CB]">
                  <span className="text-xs text-[#B51222] block font-mono font-bold">OPTION B · 2 UNITS</span>
                  <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#B51222]">
                    {formatNaira(config.prices.doublePump)}
                  </span>
                </div>
              </div>
            </div>

            {/* Factual Highlights without Fluff */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#2B2D31]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#B51222] shrink-0" />
                <span>12V DC Nominal In-Tank Replacement</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#B51222] shrink-0" />
                <span>Includes Filter Strainer & Pigtail Harness</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B51222] shrink-0" />
                <span>Vehicle Compatibility Verified Before Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#B51222] shrink-0" />
                <span>Pay on Delivery Nationwide across Nigeria</span>
              </div>
            </div>

            {/* Dual Actions: Order Now & Explore Specifications */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={onOrderClick}
                type="button"
                className="min-tap-target px-8 py-4 bg-[#B51222] hover:bg-[#8F0E1B] text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>ORDER NOW</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreClick}
                type="button"
                className="min-tap-target px-7 py-4 bg-transparent hover:bg-[#E9E7E2] border border-[#2B2D31] text-[#1B1C1F] font-bold text-sm uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center cursor-pointer"
              >
                <span>EXPLORE PRODUCT</span>
              </button>
            </div>
          </div>

          {/* Right Column: Dominant Genuine Fuel Pump Photograph */}
          <div className="lg:col-span-5">
            <div className="relative bg-white border border-[#D5D2CB] p-3 sm:p-4 rounded-2xl shadow-sm">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#E9E7E2] flex items-center justify-center">
                {heroImage?.url ? (
                  <img
                    src={heroImage.url}
                    alt={heroImage.alt}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="eager"
                  />
                ) : (
                  <span className="text-xs font-mono text-[#6E7075]">Image unavailable</span>
                )}
              </div>

              <div className="pt-3 px-1 flex items-center justify-between text-xs text-[#6E7075] font-mono border-t border-[#E9E7E2] mt-3">
                <span className="font-semibold text-[#1B1C1F]">FIG 01. CYLINDRICAL UNIT</span>
                <span>12V DC SPEC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
