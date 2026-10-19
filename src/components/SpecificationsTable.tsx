import React from 'react';
import { Check, Package, FileText, Wrench } from 'lucide-react';

export const SpecificationsTable: React.FC = () => {
  const specs = [
    { label: 'Brand & Product Model', value: 'FRANKBLAISE ELECTRIC FUEL PUMP PLUS (FB-EFP-950+)' },
    { label: 'Operating Fuel Pressure', value: '3.5 – 4.2 Bar (50 – 61 PSI) Stable Output' },
    { label: 'Free Flow Discharge Rate', value: '140 – 160 Litres Per Hour (LPH) @ 13.5V' },
    { label: 'Operating Voltage', value: '12V DC (Operating range 9.0V – 16.0V)' },
    { label: 'Current Draw (Amperage)', value: '4.8A – 5.4A under load (energy-efficient)' },
    { label: 'Electric Motor Coil', value: '100% Grade-A Oxygen-Free High-Torque Copper Armature' },
    { label: 'Pumping Mechanism', value: 'Dynamically Balanced High-Flow Turbine Impeller' },
    { label: 'Acoustic Sound Rating', value: '< 45 dB (Whisper Quiet, No Cabin Whining)' },
    { label: 'Canister Body Diameter', value: '38 mm Universal Slim Fit (Fits standard fuel hangers)' },
    { label: 'Inlet & Outlet Diameter', value: '8 mm (5/16") High-Pressure Barbed Connection' },
    { label: 'Operating Temperature', value: '-40°C to +85°C (Tropicalized African Climate Rating)' },
    { label: 'Fuel Compatibility', value: 'Petrol (PMS), E10, E85, and high-ethanol blend fuels' },
  ];

  const packageContents = [
    '1x FRANKBLAISE ELECTRIC FUEL PUMP PLUS unit',
    '1x Heavy-duty multi-layer inlet strainer filter sock',
    '1x Pre-pinned wiring connector pigtail harness',
    '1x Submersible fuel-resistant flexible hose',
    '2x Stainless steel worm-drive hose clamps',
    '1x Vibration dampening rubber mounting sleeve',
    '1x Official 1-Year Replacement Warranty Certificate Card',
  ];

  return (
    <section className="py-16 lg:py-24 bg-neutral-50 text-neutral-900 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-red-600">
            <Wrench className="w-4 h-4" />
            <span>CERTIFIED SPECIFICATIONS</span>
            <span aria-hidden="true">·</span>
            <span>NO GUESSWORK FOR TECHNICIANS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 font-display">
            Official Technical Specifications &amp; Unboxing Kit
          </h2>
          <p className="text-base text-neutral-600">
            Detailed engineering parameters verified by automotive electrical diagnostics. Ready for immediate installation straight out of the box.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Specifications Table */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between">
              <span className="font-bold text-sm tracking-wide uppercase font-display flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-500" />
                Engineering Specification Sheet
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Standard: ISO / TS 16949
              </span>
            </div>

            <div className="divide-y divide-neutral-100 text-sm">
              {specs.map((s, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-1 sm:grid-cols-12 px-6 py-3.5 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/60'
                  }`}
                >
                  <span className="sm:col-span-5 font-semibold text-neutral-700 text-xs sm:text-sm">
                    {s.label}
                  </span>
                  <span className="sm:col-span-7 font-mono text-neutral-900 text-xs sm:text-sm font-medium mt-0.5 sm:mt-0">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Unboxing Kit Showcase */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm p-4">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-neutral-900 mb-4">
                <img
                  src="/images/fuel_pump_unboxing_kit_1792348148348.jpg"
                  alt="Complete Frankblaise Electric Fuel Pump installation accessories kit"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-neutral-950/80 backdrop-blur-md px-3 py-1 rounded text-[11px] text-white font-medium">
                  Actual Complete Unboxing Kit
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase mb-2">
                <Package className="w-4 h-4" />
                <span>Everything Included In The Box:</span>
              </div>

              <ul className="space-y-2 text-xs text-neutral-700">
                {packageContents.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50 rounded-2xl p-5 border border-red-200/80 text-red-950">
              <h4 className="text-sm font-bold mb-1 font-display">
                Universal Installation Hardware Included
              </h4>
              <p className="text-xs text-red-800 leading-relaxed">
                You do not need to buy any extra clips, wiring plugs, or filter socks separately. Every necessary component is included inside the package so your mechanic can install it in under 30 minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
