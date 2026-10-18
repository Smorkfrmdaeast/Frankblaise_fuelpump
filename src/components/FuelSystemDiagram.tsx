import React from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';

export const FuelSystemDiagram: React.FC = () => {
  const steps = [
    {
      id: 'tank',
      label: 'FUEL TANK',
      sublabel: 'Automotive reservoir',
      desc: 'Stores vehicle fuel and houses the submerged pump module & inlet strainer.',
      color: 'bg-neutral-800 text-neutral-200 border-neutral-700',
    },
    {
      id: 'pump',
      label: 'FUEL PUMP',
      sublabel: 'Electric pump unit',
      desc: 'Generates necessary pressure to draw liquid fuel through the filter.',
      color: 'bg-[#E32636]/10 text-[#E32636] border-[#E32636]',
      highlight: true,
    },
    {
      id: 'line',
      label: 'FUEL LINE',
      sublabel: 'High-pressure feed',
      desc: 'Transfers pressurized fuel securely through chassis lines to the front.',
      color: 'bg-neutral-800 text-neutral-200 border-neutral-700',
    },
    {
      id: 'engine',
      label: 'ENGINE FUEL SYSTEM',
      sublabel: 'Rail & injectors',
      desc: 'Injectors atomize pressurized fuel into combustion chambers for engine power.',
      color: 'bg-neutral-800 text-neutral-200 border-neutral-700',
    },
  ];

  return (
    <section id="diagram" className="py-16 lg:py-20 bg-[#151518] text-white border-b border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
            How an Automotive Fuel Pump Works
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-xl mx-auto">
            Understanding the basic sequence of automotive fuel delivery from the vehicle tank to the engine.
          </p>
        </div>

        {/* Simplified Automotive Diagram (Vertical on mobile, Horizontal on desktop) */}
        <div className="bg-[#0B0B0D] p-6 sm:p-8 rounded-3xl border border-neutral-800 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                {/* Step Box */}
                <div
                  className={`w-full md:w-1/4 p-5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${step.color} ${
                    step.highlight ? 'ring-2 ring-[#E32636]/30' : ''
                  }`}
                >
                  <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-1">
                    0{idx + 1}. {step.sublabel}
                  </span>
                  <span className="text-sm sm:text-base font-black font-display tracking-wide uppercase mb-2">
                    {step.label}
                  </span>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Connector Arrow (Down on mobile, Right on desktop) */}
                {idx < steps.length - 1 && (
                  <div className="text-neutral-500 py-1 md:py-0 shrink-0" aria-hidden="true">
                    <ArrowDown className="w-5 h-5 md:hidden text-[#E32636]" />
                    <ArrowRight className="w-5 h-5 hidden md:block text-[#E32636]" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* SVG Vehicle Schematic Graphic */}
          <div className="mt-8 pt-6 border-t border-neutral-800/80">
            <svg
              className="w-full max-w-2xl mx-auto h-24 sm:h-28 text-neutral-600"
              viewBox="0 0 600 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {/* Vehicle chassis profile silhouette */}
              <path
                d="M50 70 L90 70 L120 40 L260 40 L340 55 L550 55 L560 70 L510 70"
                stroke="#333338"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              {/* Rear Fuel Tank */}
              <rect x="70" y="50" width="80" height="30" rx="4" stroke="#44444C" fill="#151518" />
              <text x="110" y="68" fill="#888890" fontSize="10" textAnchor="middle" fontWeight="bold">
                TANK
              </text>

              {/* Electric Fuel Pump inside Tank */}
              <rect x="95" y="56" width="30" height="18" rx="2" stroke="#E32636" fill="#E32636" fillOpacity="0.2" />
              <text x="110" y="68" fill="#FFFFFF" fontSize="8" textAnchor="middle" fontWeight="bold">
                PUMP
              </text>

              {/* High-pressure fuel line running to engine */}
              <path d="M125 65 L430 65" stroke="#E32636" strokeWidth="2.5" />
              <polygon points="280,62 290,65 280,68" fill="#E32636" />

              {/* Engine Block and Injectors */}
              <rect x="430" y="45" width="100" height="35" rx="4" stroke="#44444C" fill="#151518" />
              <text x="480" y="66" fill="#E32636" fontSize="10" textAnchor="middle" fontWeight="bold">
                ENGINE INJECTION
              </text>
            </svg>
          </div>
        </div>

        {/* Mandatory Caption */}
        <p className="text-xs text-neutral-400 font-medium">
          Simplified illustration. Actual fuel systems vary by vehicle.
        </p>
      </div>
    </section>
  );
};
