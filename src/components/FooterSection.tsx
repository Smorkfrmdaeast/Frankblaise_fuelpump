import React from 'react';
import { siteConfig } from '../config/site';
import { Lock } from 'lucide-react';

interface FooterSectionProps {
  onOpenAdminPortal?: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onOpenAdminPortal }) => {
  return (
    <footer className="bg-[#0B0B0D] text-neutral-400 py-12 border-t border-neutral-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-extrabold text-base text-white uppercase tracking-wider font-display">
            {siteConfig.brandName}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-400">
            <a href="#benefits" className="hover:text-white transition-colors">Benefits</a>
            <span aria-hidden="true">·</span>
            <a href="#specifications" className="hover:text-white transition-colors">Specifications</a>
            <span aria-hidden="true">·</span>
            <a href="#diagram" className="hover:text-white transition-colors">Fuel Diagram</a>
            <span aria-hidden="true">·</span>
            <a href="#packages" className="hover:text-white transition-colors">Packages</a>
            <span aria-hidden="true">·</span>
            <a href="#order-form" className="hover:text-white transition-colors">Order Form</a>
            {onOpenAdminPortal && (
              <>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={onOpenAdminPortal}
                  className="hover:text-[#E32636] transition-colors flex items-center gap-1 cursor-pointer text-neutral-500"
                >
                  <Lock className="w-3 h-3" />
                  <span>Seller Portal</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Short disclaimer */}
        <p className="text-neutral-500 text-[11px] leading-relaxed max-w-2xl">
          Disclaimer: Product details, vehicle compatibility, delivery arrangements, and warranty terms are subject to final confirmation by the seller upon order review.
        </p>

        <div className="pt-4 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-600">
          <div>
            &copy; {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.
          </div>
          <div>
            Genuine Automotive Parts · Nigeria
          </div>
        </div>
      </div>
    </footer>
  );
};
