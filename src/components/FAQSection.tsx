import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'Will FRANKBLAISE ELECTRIC FUEL PUMP PLUS fit my car?',
      answer:
        'Yes! The pump is built with the industry standard 38mm slim-canister body. It directly fits over 95% of Japanese, Korean, American, and European petrol injection vehicles (Toyota, Honda, Lexus, Nissan, Hyundai, Kia, Ford, Mitsubishi, Mazda, Mercedes, etc.). Our kit also includes a wiring pigtail, high-grade strainer sock, and submersible fuel line for direct plug-and-play installation.',
    },
    {
      question: 'How does Pay On Delivery work?',
      answer:
        'You do not make any advance payment. You fill out the delivery form with your vehicle details and Nigerian address. Our dispatch partner brings the package to your location. You inspect the box and verify the fuel pump and accessories, then pay the exact amount (₦25,000 for 1 pump or ₦45,000 for 2 pumps) in cash or via mobile bank transfer to the courier.',
    },
    {
      question: 'How long does delivery take across Nigeria?',
      answer:
        'Deliveries within Lagos and Abuja (FCT) typically arrive within 24 to 48 hours. Deliveries to other state capitals and major cities (Port Harcourt, Ibadan, Kano, Asaba, Benin, Enugu, etc.) take between 2 to 4 working days.',
    },
    {
      question: 'Is this pump noisy like other aftermarket pumps?',
      answer:
        'Not at all. Unlike cheap pumps that use coarse eccentric roller vanes that create a loud buzzing drone inside the vehicle cabin, Frankblaise features a dynamically balanced turbine impeller operating at under 45 dB. It is whisper-quiet and runs virtually silent.',
    },
    {
      question: 'How does the 1-Year Replacement Warranty work?',
      answer:
        'Every Frankblaise Electric Fuel Pump Plus is backed by our confirmed 1-Year Direct Replacement Warranty. If your pump fails, loses rail pressure, or exhibits an electrical defect within 365 days of delivery, simply contact our customer desk with your order phone number. We will dispatch a brand-new replacement unit to you without long repairs or hassle.',
    },
    {
      question: 'Why should I pick the Double Pack (2 Pumps for ₦45,000)?',
      answer:
        'The Double Value Pack saves you an instant ₦5,000. It is the top choice for commercial motorists, ride-hailing drivers (Uber/Bolt), and multi-car households who want to keep an emergency spare unit in their vehicle trunk to guarantee they never get stranded on inter-state journeys.',
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-white text-neutral-900 border-b border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-red-600">
            <HelpCircle className="w-4 h-4" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 font-display">
            Got Questions? We Have Answers.
          </h2>
          <p className="text-base text-neutral-600">
            Everything you need to know about vehicle fitment, delivery terms, and the 1-year warranty.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-200 bg-neutral-50/70 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-neutral-900 hover:text-red-600 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-red-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-200/60 bg-white">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
