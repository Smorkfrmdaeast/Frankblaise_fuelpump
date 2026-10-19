import React, { useState } from 'react';
import { useProductConfig } from '../hooks/useProductConfig';
import { ChevronDown, AlertCircle } from 'lucide-react';

export const SpecificationsSection: React.FC = () => {
  const config = useProductConfig();
  const specs = config.specs;
  const unconfirmedPlaceholder = 'Please confirm with the seller.';

  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const specRows = [
    {
      label: 'Product Designation',
      value: specs.productName || unconfirmedPlaceholder,
      isConfirmed: Boolean(specs.productName),
    },
    {
      label: 'Component Category',
      value: specs.category || unconfirmedPlaceholder,
      isConfirmed: Boolean(specs.category),
    },
    {
      label: 'Housing & Internal Materials',
      value: specs.material || unconfirmedPlaceholder,
      isConfirmed: Boolean(specs.material),
    },
    {
      label: 'Nominal Operating Voltage',
      value: specs.operatingVoltage || unconfirmedPlaceholder,
      isConfirmed: Boolean(specs.operatingVoltage),
    },
    {
      label: 'Physical Dimensions (OD × Length)',
      value: specs.dimensions || unconfirmedPlaceholder,
      isConfirmed: Boolean(specs.dimensions),
    },
    {
      label: 'Electrical Terminal Interface',
      value: specs.connectorType || unconfirmedPlaceholder,
      isConfirmed: Boolean(specs.connectorType),
    },
    {
      label: 'Compatible Vehicle Makes & Models',
      value:
        specs.compatibleMakesAndModels ||
        'Not universally interchangeable. Individual compatibility is verified by the seller before dispatch.',
      isConfirmed: Boolean(specs.compatibleMakesAndModels),
    },
    {
      label: 'Included Package Contents',
      value: specs.packageContents || unconfirmedPlaceholder,
      isConfirmed: Boolean(specs.packageContents),
    },
    {
      label: 'Verified Warranty Period',
      value: specs.warranty || config.warrantyTerms || unconfirmedPlaceholder,
      isConfirmed: Boolean(specs.warranty || config.warrantyTerms),
    },
  ];

  const toggleFaq = (id: string) => {
    setExpandedFaq((prev) => (prev === id ? null : id));
  };

  return (
    <section id="specifications" className="bg-[#F6F4EF] text-[#1B1C1F] py-16 lg:py-24 border-b border-[#D5D2CB]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Spec Sheet Table Header */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-[#B51222] font-bold">
            SECTION 03 · VERIFIED DATA SHEET
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase font-display tracking-tight text-[#1B1C1F]">
            Technical Specifications &amp; Parameters
          </h2>
          <p className="text-sm sm:text-base text-[#2B2D31]">
            Official engineering specifications for the {config.productName}. Parameters awaiting owner bench confirmation are noted transparently.
          </p>
        </div>

        {/* Spec-Sheet Layout (True Table with Hairline Dividers) */}
        <div className="bg-white border border-[#D5D2CB] rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-[#1B1C1F] text-[#F6F4EF] px-6 py-3.5 flex items-center justify-between text-xs font-mono">
            <span className="font-bold tracking-wider">PARAMETER / SPECIFICATION</span>
            <span className="text-neutral-400">ENGINEERING STATUS</span>
          </div>

          <div className="divide-y divide-[#D5D2CB]">
            {specRows.map((row, idx) => (
              <div
                key={row.label}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 px-6 py-4 items-start hover:bg-[#F6F4EF]/60 transition-colors"
              >
                <div className="md:col-span-4 font-mono text-xs font-semibold text-[#1B1C1F] uppercase tracking-wider">
                  {row.label}
                </div>
                <div className="md:col-span-8 flex items-start justify-between gap-4">
                  <span
                    className={`text-sm ${
                      row.isConfirmed
                        ? 'text-[#2B2D31]'
                        : 'italic text-[#6E7075]'
                    }`}
                  >
                    {row.value}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${
                      row.isConfirmed
                        ? 'bg-[#E9E7E2] text-[#2B2D31]'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {row.isConfirmed ? 'CONFIRMED' : 'PENDING'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Factual Technical FAQs Accordion */}
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#B51222] font-bold">
              KNOWLEDGE BASE
            </span>
            <h3 className="text-xl sm:text-2xl font-bold uppercase font-display text-[#1B1C1F]">
              Technical Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {config.faqs.map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white border border-[#D5D2CB] rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                  >
                    <span className="text-sm sm:text-base font-semibold text-[#1B1C1F]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#6E7075] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-[#2B2D31] leading-relaxed border-t border-[#E9E7E2]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
