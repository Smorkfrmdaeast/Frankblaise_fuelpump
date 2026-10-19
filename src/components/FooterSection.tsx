import React from 'react';
import { useProductConfig } from '../hooks/useProductConfig';
import { Lock, MessageCircle } from 'lucide-react';

interface FooterSectionProps {
  onOpenAdmin: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onOpenAdmin }) => {
  const config = useProductConfig();
  const whatsappDigits = config.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#1B1C1F] text-[#F6F4EF] py-14 border-t border-[#2B2D31] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#2B2D31]">
          <div>
            <span className="text-xl font-bold font-display uppercase tracking-wider text-white block">
              {config.brandName}
            </span>
            <span className="text-neutral-400 font-mono text-[11px] block mt-1">
              TECHNICAL ENGINEERING EDITION · AUTOMOTIVE REPLACEMENT FUEL PUMPS
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-neutral-300 font-mono text-xs">
            <a href="#overview" className="hover:text-[#B51222] transition-colors">Overview</a>
            <a href="#engineering" className="hover:text-[#B51222] transition-colors">Engineering</a>
            <a href="#specifications" className="hover:text-[#B51222] transition-colors">Data Sheet</a>
            <a href="#packages" className="hover:text-[#B51222] transition-colors">Packages</a>
            <a href="#order-form" className="hover:text-[#B51222] transition-colors">Order Terminal</a>
            {config.whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
                  'Hello FRANKBLAISE PARTS, I would like to inquire about vehicle compatibility.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 text-emerald-400"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>{config.whatsappNumber}</span>
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-neutral-500 font-mono">
          <p className="max-w-xl leading-relaxed">
            Legal &amp; Engineering Notice: Product parameters, vehicle fitment, delivery terms, and warranty period are verified by the seller via telephone prior to dispatch. Fuel pumps are not universally interchangeable.
          </p>

          <div className="flex items-center gap-4 shrink-0">
            <span>&copy; {new Date().getFullYear()} {config.brandName}. All rights reserved.</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-neutral-500 hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer"
              title="Seller Engineering Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
