import React from 'react';
import { useProductConfig } from '../hooks/useProductConfig';
import { Truck, Banknote, ShieldCheck } from 'lucide-react';

export const DeliveryAndPaymentSection: React.FC = () => {
  const config = useProductConfig();
  const delivery = config.delivery;

  return (
    <section id="delivery" className="bg-[#F6F4EF] text-[#1B1C1F] py-16 lg:py-24 border-b border-[#D5D2CB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-[#B51222] font-bold">
            SECTION 09 · LOGISTICS &amp; SETTLEMENT
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase font-display tracking-tight text-[#1B1C1F]">
            Delivery &amp; Payment Protocol
          </h2>
          <p className="text-sm sm:text-base text-[#2B2D31]">
            Official logistics conditions. Orders are dispatched through vetted courier channels with tracking across Nigerian states.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FREE DELIVERY */}
          {delivery.isFreeDeliveryConfirmed && (
            <div className="bg-white border border-[#D5D2CB] rounded-2xl p-6 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#E9E7E2] flex items-center justify-center text-[#B51222]">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold uppercase font-display text-[#1B1C1F]">
                Nationwide Delivery Included
              </h3>
              <p className="text-xs sm:text-sm text-[#2B2D31] leading-relaxed">
                Free standard delivery is provided to state capitals and commercial centers across all 36 states and the FCT upon telephone order verification.
              </p>
            </div>
          )}

          {/* PAY ON DELIVERY */}
          {delivery.isPayOnDeliveryConfirmed && (
            <div className="bg-white border border-[#D5D2CB] rounded-2xl p-6 space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#E9E7E2] flex items-center justify-center text-[#B51222]">
                <Banknote className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold uppercase font-display text-[#1B1C1F]">
                Pay On Delivery (COD)
              </h3>
              <p className="text-xs sm:text-sm text-[#2B2D31] leading-relaxed">
                Inspect package integrity before payment. Pay cash or via bank transfer directly to the delivery rider upon physical delivery of your fuel pump parcel.
              </p>
            </div>
          )}
        </div>

        {/* Dispatch Window & Advice */}
        <div className="p-5 bg-[#E9E7E2] border border-[#D5D2CB] rounded-xl flex items-start gap-3.5 text-xs text-[#2B2D31]">
          <ShieldCheck className="w-5 h-5 text-[#B51222] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-[#1B1C1F] block">
              {delivery.estimatedDispatchWindow || 'Dispatched within 24–48 hours upon telephone order verification.'}
            </span>
            <p className="text-xs text-[#6E7075] leading-relaxed">
              {delivery.deliveryNotes ||
                'Please ensure your phone line remains reachable after submitting the order form so dispatch logistics can confirm your location.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
