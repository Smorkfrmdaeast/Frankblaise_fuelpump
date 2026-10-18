import React from 'react';
import { siteConfig } from '../config/site';
import { AlertCircle } from 'lucide-react';

export const SpecificationsSection: React.FC = () => {
  const specs = siteConfig.confirmedSpecs;
  const unconfirmedPlaceholder = 'Please confirm with the seller.';

  const rows = [
    {
      label: 'Product name',
      value: specs.productName || 'FRANKBLAISE ELECTRIC FUEL PUMP PLUS',
      isConfirmed: true,
    },
    {
      label: 'Category',
      value: specs.category || 'Automotive replacement electric fuel pump',
      isConfirmed: true,
    },
    {
      label: 'Material',
      value: specs.material || unconfirmedPlaceholder,
      isConfirmed: Boolean(specs.material),
    },
    {
      label: 'Operating voltage',
      value: specs.operatingVoltage || unconfirmedPlaceholder,
      isConfirmed: Boolean(specs.operatingVoltage),
    },
    {
      label: 'Dimensions',
      value: specs.dimensions || unconfirmedPlaceholder,
      isConfirmed: Boolean(specs.dimensions),
    },
    {
      label: 'Connector type',
      value: specs.connectorType || unconfirmedPlaceholder,
      isConfirmed: Boolean(specs.connectorType),
    },
    {
      label: 'Compatible makes and models',
      value: specs.compatibleMakesAndModels || unconfirmedPlaceholder,
      isConfirmed: Boolean(specs.compatibleMakesAndModels),
    },
    {
      label: 'Package contents',
      value: specs.packageContents || unconfirmedPlaceholder,
      isConfirmed: Boolean(specs.packageContents),
    },
    {
      label: 'Warranty',
      value: specs.warranty || unconfirmedPlaceholder,
      isConfirmed: Boolean(specs.warranty),
    },
  ];

  return (
    <section id="specifications" className="py-16 lg:py-20 bg-[#FFFFFF] text-[#292929] border-b border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#292929] font-display">
            Product Details and Specifications
          </h2>
          <p className="text-sm text-[#777777]">
            Technical parameters and vehicle compatibility details verified by the seller.
          </p>
        </div>

        {/* Specifications Table */}
        <div className="bg-[#F5F5F7] rounded-2xl border border-neutral-200 overflow-hidden shadow-sm mb-6">
          <div className="divide-y divide-neutral-200 text-xs sm:text-sm">
            {rows.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-12 px-5 py-4 gap-1 sm:gap-4 items-center bg-white even:bg-[#F5F5F7]/60"
              >
                <span className="sm:col-span-5 font-bold text-[#292929]">
                  {row.label}
                </span>
                <span className={`sm:col-span-7 ${row.isConfirmed ? 'text-[#292929] font-medium' : 'text-[#777777] italic'}`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mandatory Notice */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-xs sm:text-sm text-red-900">
          <AlertCircle className="w-5 h-5 text-[#E32636] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Important Notice:</strong> Fuel pumps are not universally interchangeable. Confirm the vehicle make, model, year, engine specifications, fuel system, and relevant part number before ordering.
          </p>
        </div>
      </div>
    </section>
  );
};
