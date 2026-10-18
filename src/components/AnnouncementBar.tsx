import React from 'react';
import { siteConfig } from '../config/site';
import { useAdminData } from '../hooks/useAdminData';
import { MessageCircle } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const adminData = useAdminData();
  const currentWhatsApp = adminData.whatsappNumber || siteConfig.whatsappNumber;
  const hasWhatsApp = Boolean(currentWhatsApp && currentWhatsApp.trim() !== '');

  return (
    <div className="bg-[#151518] border-b border-neutral-800 text-white text-xs py-2 px-4 text-center">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-1 sm:gap-2">
        <span className="font-bold tracking-wider uppercase text-[#E32636]">
          FREE DELIVERY | PAY ON DELIVERY
        </span>
        <span className="hidden sm:inline text-neutral-500" aria-hidden="true">·</span>
        <span className="text-[11px] sm:text-xs text-neutral-400">
          Available to customers nationwide across Nigeria
        </span>
        {hasWhatsApp && (
          <>
            <span className="hidden md:inline text-neutral-500" aria-hidden="true">·</span>
            <a
              href={`https://wa.me/${currentWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                'Hello FRANKBLAISE PARTS, I would like to make an inquiry about the FRANKBLAISE Electric Fuel Pump Plus.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors ml-1"
            >
              <MessageCircle className="w-3 h-3 text-[#25D366]" />
              <span>WhatsApp: {currentWhatsApp}</span>
            </a>
          </>
        )}
      </div>
    </div>
  );
};
