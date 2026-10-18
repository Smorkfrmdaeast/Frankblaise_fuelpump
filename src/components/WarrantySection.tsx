import React from 'react';
import { ShieldCheck, CheckCircle2, RotateCw, PhoneCall, Award } from 'lucide-react';

export const WarrantySection: React.FC = () => {
  return (
    <section id="warranty" className="py-16 lg:py-20 bg-neutral-950 text-white border-b border-neutral-800 relative overflow-hidden">
      {/* Decorative subtle background mesh */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 80% 20%, #ef4444 0%, transparent 50%), radial-gradient(circle at 20% 80%, #10b981 0%, transparent 40%)`
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Certificate Style Container */}
          <div className="relative rounded-3xl bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 p-6 sm:p-10 border-2 border-amber-500/30 shadow-2xl">
            {/* Top Badge Stamp */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-800">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 shrink-0">
                  <Award className="w-9 h-9" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 block mb-1">
                    OFFICIAL SELLER WARRANTY PROGRAM
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                    1-Year Direct Replacement Guarantee
                  </h2>
                </div>
              </div>

              <div className="px-4 py-2 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-400 text-xs font-mono font-bold tracking-wide flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>CONFIRMED &amp; ACTIVE</span>
              </div>
            </div>

            {/* Warranty Terms Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-neutral-800">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  What Is 100% Covered Under Warranty
                </h3>
                <ul className="space-y-2.5 text-xs text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Electric coil thermal burnout or armature failure during 365 days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Sudden drop in operating fuel rail pressure below 3.2 Bar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Internal check valve leakage causing hard starting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Turbine impeller rotor jamming or internal mechanical seizure</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-amber-400" />
                  Simple 3-Step Swap Claim Procedure
                </h3>
                <ol className="space-y-2.5 text-xs text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <span>Contact the dedicated Frankblaise customer WhatsApp helpline with your order phone number.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <span>Our technician verifies the pressure reading or failure code within 2 hours.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <span>We dispatch a brand-new replacement fuel pump to your address with zero repair waiting time.</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Bottom Guarantee Note */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-red-500" />
                <span>Dedicated Lagos &amp; Abuja Dispatch &amp; Technical Support line on your invoice slip.</span>
              </div>
              <div className="font-mono text-neutral-500 text-[11px]">
                Policy Code: FB-WTY-365D-NG
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
