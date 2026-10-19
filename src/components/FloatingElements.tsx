import React, { useState, useEffect } from 'react';
import { useProductConfig } from '../hooks/useProductConfig';
import { formatNaira } from '../config/site';
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
  const config = useProductConfig();

  const price =
    selectedPackage === 'double'
      ? config.prices.doublePump
      : config.prices.singlePump;

  const currentWhatsApp = config.whatsappNumber;
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
      {/* WhatsApp Floating Button: Always accessible */}
      {hasWhatsApp && (
        <aside
          aria-label="Direct Technical Support on WhatsApp"
          className={`fixed right-4 z-40 transition-all duration-300 ${
            !isFormInView ? 'bottom-20 md:bottom-6' : 'bottom-6'
          }`}
        >
          <a
            href={`https://wa.me/${currentWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              'Hello FRANKBLAISE PARTS, I would like to inquire about the FRANKBLAISE Electric Fuel Pump Plus.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Chat with FRANKBLAISE PARTS on WhatsApp at ${currentWhatsApp}`}
            title={`Direct WhatsApp Consultation (${currentWhatsApp})`}
            className="group min-tap-target relative flex items-center gap-2 px-3 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-black/30 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-white/30"
          >
            <MessageCircle className="w-5 h-5 shrink-0" />
            <div className="hidden sm:flex flex-col text-left leading-tight pr-1">
              <span className="text-[10px] font-mono uppercase font-bold tracking-tight text-white">
                WhatsApp Us
              </span>
              <span className="text-[10px] font-mono text-emerald-100">
                {currentWhatsApp}
              </span>
            </div>
          </a>
        </aside>
      )}

      {/* Sticky Bottom Order Bar on Mobile: Hidden while order form is in view */}
      {!isFormInView && (
        <aside
          aria-label="Mobile Quick Order Bar"
          className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-[#1B1C1F]/95 backdrop-blur-md border-t border-[#2B2D31] px-4 py-2.5 shadow-2xl transition-all"
        >
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="flex flex-col">
              <span className="text-base font-bold text-[#F6F4EF] font-mono tabular-nums leading-tight">
                {formatNaira(price)}
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                {selectedPackage === 'double' ? '2 Fuel Pumps' : '1 Fuel Pump'} · Pay on Delivery
              </span>
            </div>

            <button
              onClick={onOrderClick}
              type="button"
              className="min-tap-target px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#B51222] hover:bg-[#8F0E1B] rounded-lg shadow-md transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
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
