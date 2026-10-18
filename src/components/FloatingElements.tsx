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
      {/* WhatsApp Floating Button: Only if whatsappNumber is set */}
      {hasWhatsApp && (
        <aside
          aria-label="Direct Customer Support"
          className={`fixed right-4 z-40 transition-all duration-300 ${
            !isFormInView ? 'bottom-20 md:bottom-6' : 'bottom-6'
          }`}
        >
          <a
            href={`https://wa.me/${currentWhatsApp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact seller on WhatsApp"
            className="min-tap-target w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-black/40 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
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
