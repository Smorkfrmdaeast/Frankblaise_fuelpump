import React from 'react';
import { useProductConfig } from '../hooks/useProductConfig';
import { MessageCircle } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const config = useProductConfig();
  const delivery = config.delivery;
  const whatsappDigits = config.whatsappNumber.replace(/[^0-9]/g, '');

  if (!delivery.isFreeDeliveryConfirmed && !delivery.isPayOnDeliveryConfirmed) {
    return null;
  }

  return (
    <div className="bg-[#1B1C1F] text-[#F6F4EF] text-xs py-2 px-4 border-b border-[#2B2D31]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs">
          <span className="text-[#B51222] font-bold">TERMS:</span>
          <span className="text-neutral-300">
            {delivery.isFreeDeliveryConfirmed && 'Nationwide Free Delivery Available'}
            {delivery.isFreeDeliveryConfirmed && delivery.isPayOnDeliveryConfirmed && ' · '}
            {delivery.isPayOnDeliveryConfirmed && 'Pay on Delivery'}
          </span>
          <span className="hidden md:inline text-neutral-500">— Subject to phone vehicle verification before dispatch</span>
        </div>

        {config.whatsappNumber && (
          <a
            href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
              'Hello FRANKBLAISE PARTS, I would like to inquire about vehicle compatibility for the Electric Fuel Pump Plus.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Support: {config.whatsappNumber}</span>
          </a>
        )}
      </div>
    </div>
  );
};
