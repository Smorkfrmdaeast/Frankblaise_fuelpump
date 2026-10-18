import React from 'react';
import { siteConfig } from '../config/site';
import { ShieldCheck, Info } from 'lucide-react';

export const WarrantyInfoSection: React.FC = () => {
  const isConfirmed = Boolean(siteConfig.confirmedWarrantyTerms);

  return (
    <section id="warranty" className="py-16 lg:py-20 bg-[#FFFFFF] text-[#292929] border-b border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#292929] font-display">
            Product Warranty Information
          </h2>
        </div>

        {isConfirmed ? (
          <div className="bg-[#F5F5F7] p-6 sm:p-8 rounded-2xl border border-neutral-200 text-left max-w-2xl mx-auto space-y-3">
            <div className="flex items-center gap-2 text-[#E32636] font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Confirmed Warranty Terms</span>
            </div>
            <p className="text-sm text-[#292929] leading-relaxed">
              {siteConfig.confirmedWarrantyTerms}
            </p>
          </div>
        ) : (
          <div className="bg-[#F5F5F7] p-6 sm:p-8 rounded-2xl border border-neutral-200 max-w-2xl mx-auto flex items-start gap-3.5 text-left">
            <Info className="w-5 h-5 text-[#777777] shrink-0 mt-0.5" />
            <p className="text-sm sm:text-base text-[#777777] leading-relaxed">
              Please confirm the warranty coverage, duration, conditions, and claim process with the seller before placing your order.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
