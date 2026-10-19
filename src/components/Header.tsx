import React from 'react';
import { useProductConfig } from '../hooks/useProductConfig';
import { MessageCircle } from 'lucide-react';

interface HeaderProps {
  onOrderClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOrderClick }) => {
  const config = useProductConfig();
  const whatsappDigits = config.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F6F4EF]/95 backdrop-blur-md border-b border-[#D5D2CB] text-[#1B1C1F]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single Brand Wordmark in Display Font */}
        <a
          href="#top"
          className="text-lg sm:text-xl font-bold tracking-tight uppercase font-display text-[#1B1C1F] hover:text-[#B51222] transition-colors whitespace-nowrap shrink-0"
        >
          {config.brandName}
        </a>

        {/* Zone 2: Single-line Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#2B2D31]">
          <a href="#overview" className="hover:text-[#B51222] transition-colors whitespace-nowrap shrink-0">Overview</a>
          <a href="#engineering" className="hover:text-[#B51222] transition-colors whitespace-nowrap shrink-0">Engineering</a>
          <a href="#specifications" className="hover:text-[#B51222] transition-colors whitespace-nowrap shrink-0">Specifications</a>
          <a href="#video-demo" className="hover:text-[#B51222] transition-colors whitespace-nowrap shrink-0">Demonstration</a>
          <a href="#packages" className="hover:text-[#B51222] transition-colors whitespace-nowrap shrink-0">Packages</a>
          <a href="#compatibility" className="hover:text-[#B51222] transition-colors whitespace-nowrap shrink-0">Compatibility</a>
        </nav>

        {/* Zone 3: 1 Primary Action + Direct WhatsApp */}
        <div className="flex items-center gap-3 shrink-0">
          {config.whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
                'Hello FRANKBLAISE PARTS, I would like to inquire about the Electric Fuel Pump Plus.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Contact on WhatsApp at ${config.whatsappNumber}`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#E9E7E2] hover:bg-[#D5D2CB] text-[#1B1C1F] text-xs font-mono font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>
          )}

          <button
            onClick={onOrderClick}
            type="button"
            className="min-tap-target px-5 py-2.5 bg-[#B51222] hover:bg-[#8F0E1B] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            ORDER NOW
          </button>
        </div>
      </div>
    </header>
  );
};
