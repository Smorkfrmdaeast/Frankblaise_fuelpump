import React, { useState, useEffect } from 'react';
import { siteConfig, formatNaira } from '../config/site';
import { useAdminData } from '../hooks/useAdminData';
import { PackageSelection } from './PackagesSection';
import { MessageCircle, ArrowDown } from 'lucide-react';

interface FloatingElementsProps {
  selectedPackage: PackageSelection;
  onOrderClick: () => void;
}

export const FloatingElements: React.FC<FloatingElementsProps> = ({
  selectedPackage,
  onOrderClick,
}) => {
  const [isFormInView, setIsFormInView] = useState(false);
  const adminData = useAdminData();

  const price =
    selectedPackage === 'double'
      ? adminData.doublePrice
      : adminData.singlePrice;

  const currentWhatsApp = adminData.whatsappNumber || siteConfig.whatsappNumber;
  const hasWhatsApp = Boolean(currentWhatsApp && currentWhatsApp.trim() !== '');

  useEffect(() => {
    const target = document.getElementById('order-form');
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFormInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* WhatsApp Floating Button: Always present when WhatsApp is set */}
      {hasWhatsApp && (
        <aside
          aria-label="Direct Customer Support on WhatsApp"
          className={`fixed right-4 z-40 transition-all duration-300 ${
            !isFormInView ? 'bottom-20 md:bottom-6' : 'bottom-6'
          }`}
        >
          <a
            href={`https://wa.me/${currentWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              'Hello FRANKBLAISE PARTS, I want to inquire about the FRANKBLAISE Electric Fuel Pump Plus.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Chat with FRANKBLAISE PARTS on WhatsApp at ${currentWhatsApp}`}
            title={`Chat with us on WhatsApp (${currentWhatsApp})`}
            className="group min-tap-target relative flex items-center gap-2.5 px-3.5 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl shadow-emerald-950/60 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-white/20"
          >
            {/* Live pulsing online dot */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-[#0B0B0D]"></span>
            </span>

            <MessageCircle className="w-6 h-6 shrink-0 fill-white/10" />

            <div className="hidden sm:flex flex-col text-left leading-tight pr-1">
              <span className="text-[11px] font-bold tracking-tight text-white uppercase font-display">
                WhatsApp Us
              </span>
              <span className="text-[10px] font-mono font-medium text-emerald-100 opacity-95">
                {currentWhatsApp}
              </span>
            </div>
          </a>
        </aside>
      )}

      {/* Sticky Bottom Order Bar on Mobile: Hidden while order form is in view */}
      {!isFormInView && (
        <aside
          aria-label="Quick Order"
          className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-[#0B0B0D]/95 backdrop-blur-md border-t border-neutral-800 px-4 py-2.5 shadow-2xl transition-all"
        >
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="flex flex-col">
              <span className="text-base font-black text-white font-mono tabular-nums leading-tight">
                {formatNaira(price)}
              </span>
              <span className="text-[10px] text-neutral-400">
                {selectedPackage === 'double' ? '2 Pumps' : '1 Pump'} · Pay on Delivery
              </span>
            </div>

            <button
              onClick={onOrderClick}
              type="button"
              className="min-tap-target px-4 py-2 text-xs font-bold text-white bg-[#E32636] hover:bg-[#B51222] rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Order Now</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}
    </>
  );
};
