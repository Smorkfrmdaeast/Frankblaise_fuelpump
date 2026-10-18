import React from 'react';
import { Truck, Banknote, AlertCircle } from 'lucide-react';

export const DeliveryAndPaymentSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-20 bg-[#F5F5F7] text-[#292929] border-b border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#292929] font-display">
            Order Across Nigeria
          </h2>
          <p className="text-sm text-[#777777]">
            Please review the delivery and payment terms before placing your order.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* FREE DELIVERY */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E32636] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#292929] font-display">
              FREE DELIVERY
            </h3>
            <p className="text-xs sm:text-sm text-[#777777] leading-relaxed">
              Delivery availability and any applicable conditions will be confirmed by the seller.
            </p>
          </div>

          {/* PAY ON DELIVERY */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E32636] flex items-center justify-center">
              <Banknote className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#292929] font-display">
              PAY ON DELIVERY
            </h3>
            <p className="text-xs sm:text-sm text-[#777777] leading-relaxed">
              Payment arrangements will be confirmed when the order is reviewed.
            </p>
          </div>
        </div>

        {/* Customer accuracy advice */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-start gap-3 text-xs sm:text-sm text-[#777777]">
          <AlertCircle className="w-5 h-5 text-[#E32636] shrink-0 mt-0.5" />
          <p>
            Please provide accurate contact details and your complete delivery address in the order form so the seller can verify vehicle compatibility and coordinate delivery smoothly.
          </p>
        </div>
      </div>
    </section>
  );
};
