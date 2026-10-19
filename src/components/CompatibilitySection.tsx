import React from 'react';
import { AlertTriangle, CheckCircle2, PhoneCall } from 'lucide-react';
import { useProductConfig } from '../hooks/useProductConfig';

interface CompatibilitySectionProps {
  onScrollToForm: () => void;
}

export const CompatibilitySection: React.FC<CompatibilitySectionProps> = ({
  onScrollToForm,
}) => {
  const config = useProductConfig();

  return (
    <section id="compatibility" className="bg-[#F6F4EF] text-[#1B1C1F] py-16 lg:py-24 border-b border-[#D5D2CB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-[#B51222] font-bold">
            SECTION 07 · FITMENT PROTOCOL
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase font-display tracking-tight text-[#1B1C1F]">
            Vehicle Compatibility &amp; Fitment Advisory
          </h2>
          <p className="text-sm sm:text-base text-[#2B2D31] leading-relaxed">
            Automotive electric fuel pumps are engineered to specific operating pressures (bar/PSI) and flow rates (LPH). They are not universally interchangeable across all engines.
          </p>
        </div>

        {/* Warning Callout Box */}
        <div className="bg-[#E9E7E2] border border-[#D5D2CB] rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-white border border-[#D5D2CB] text-[#B51222] shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold uppercase font-display text-[#1B1C1F]">
                Compatibility is Confirmed by the Seller Before Dispatch
              </h3>
              <p className="text-sm text-[#2B2D31] leading-relaxed">
                To eliminate wrong deliveries and fitment headaches, FRANKBLAISE PARTS will telephone you immediately upon receiving your order to verify your car’s exact make, model, production year, and engine code before dispatching your package.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#D5D2CB] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-[#2B2D31]">
            <div className="bg-white p-3.5 rounded-xl border border-[#D5D2CB]">
              <span className="text-[#6E7075] block mb-1">STEP 01</span>
              <span className="font-bold block text-[#1B1C1F]">SUBMIT VEHICLE DATA</span>
              <span className="text-[11px] text-[#6E7075]">Make, Model, Year, Engine</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#D5D2CB]">
              <span className="text-[#6E7075] block mb-1">STEP 02</span>
              <span className="font-bold block text-[#1B1C1F]">PHONE VERIFICATION</span>
              <span className="text-[11px] text-[#6E7075]">Direct consultation with tech</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#D5D2CB]">
              <span className="text-[#6E7075] block mb-1">STEP 03</span>
              <span className="font-bold block text-[#1B1C1F]">DISPATCH &amp; COD</span>
              <span className="text-[11px] text-[#6E7075]">Pay on delivery across Nigeria</span>
            </div>
          </div>

          <div className="pt-2 text-center sm:text-left">
            <button
              onClick={onScrollToForm}
              type="button"
              className="min-tap-target px-6 py-3 bg-[#1B1C1F] hover:bg-[#2B2D31] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              PROVIDE YOUR VEHICLE DETAILS IN ORDER FORM
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
