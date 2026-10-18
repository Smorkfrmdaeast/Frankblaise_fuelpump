import React from 'react';
import { Car, FileText, HelpCircle, Truck } from 'lucide-react';

export const BenefitCards: React.FC = () => {
  const cards = [
    {
      title: 'VEHICLE COMPATIBILITY',
      description: "Confirm your vehicle's specifications before purchasing a replacement fuel pump.",
      icon: Car,
    },
    {
      title: 'PRODUCT INFORMATION',
      description: 'Review the available product details to understand the component you are purchasing.',
      icon: FileText,
    },
    {
      title: 'ORDER SUPPORT',
      description: 'Provide your vehicle details so the seller can help confirm compatibility.',
      icon: HelpCircle,
    },
    {
      title: 'DELIVERY INFORMATION',
      description: 'Review the delivery and payment arrangements before completing your order.',
      icon: Truck,
    },
  ];

  return (
    <section id="benefits" className="py-14 sm:py-16 bg-[#FFFFFF] text-[#292929] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-[#F5F5F7] rounded-2xl p-6 border border-neutral-200 transition-all hover:border-neutral-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200 text-[#E32636] flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#292929] mb-2 font-display">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#777777] leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
