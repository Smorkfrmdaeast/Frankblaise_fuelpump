import React from 'react';
import { siteConfig } from '../config/site';
import { useAdminData } from '../hooks/useAdminData';
import { MessageCircle } from 'lucide-react';

interface HeaderProps {
  onOrderClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOrderClick }) => {
  const adminData = useAdminData();
  const currentWhatsApp = adminData.whatsappNumber || siteConfig.whatsappNumber;
  const hasWhatsApp = Boolean(currentWhatsApp && currentWhatsApp.trim() !== '');

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0B0D]/95 backdrop-blur-md border-b border-neutral-800 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 py-3.5">
        {/* Brand wordmark */}
        <a href="#top" className="flex items-center gap-2 group whitespace-nowrap shrink-0">
          <span className="font-extrabold tracking-wider text-lg sm:text-xl text-white uppercase font-display">
            {siteConfig.brandName}
          </span>
        </a>

        {/* Minimal Nav */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-neutral-300">
          <a href="#benefits" className="hover:text-white transition-colors">Benefits</a>
          <a href="#specifications" className="hover:text-white transition-colors">Specifications</a>
          <a href="#diagram" className="hover:text-white transition-colors">Fuel Diagram</a>
          <a href="#packages" className="hover:text-white transition-colors">Packages</a>
          <a href="#reviews" className="hover:text-white transition-colors">Reviews</a>
        </nav>

        {/* Action Button & WhatsApp Contact */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {hasWhatsApp && (
            <a
              href={`https://wa.me/${currentWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                'Hello FRANKBLAISE PARTS, I would like to inquire about the FRANKBLAISE Electric Fuel Pump Plus.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp us at ${currentWhatsApp}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span className="hidden lg:inline">WhatsApp:</span>
              <span>{currentWhatsApp}</span>
            </a>
          )}

          <button
            onClick={onOrderClick}
            type="button"
            className="min-tap-target px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-[#E32636] hover:bg-[#B51222] rounded-lg transition-colors cursor-pointer shadow-md"
          >
            ORDER YOUR FUEL PUMP
          </button>
        </div>
      </div>
    </header>
  );
};
