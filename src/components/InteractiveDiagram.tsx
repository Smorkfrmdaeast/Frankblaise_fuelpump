import React, { useState } from 'react';
import { Layers, ShieldCheck, Zap, Info, Compass } from 'lucide-react';

interface ComponentHotspot {
  id: string;
  name: string;
  material: string;
  functionDesc: string;
  advantage: string;
  xPercent: number; // For diagram marker
  yPercent: number;
}

export const InteractiveDiagram: React.FC = () => {
  const hotspots: ComponentHotspot[] = [
    {
      id: 'armature',
      name: 'Oxygen-Free Copper Armature Coil',
      material: '100% Grade-A Pure Copper Wire with Class-H Enamel Insulation',
      functionDesc: 'Converts 12V automotive battery current into electromagnetic torque to spin the fuel turbine.',
      advantage: 'Prevents thermal coil shorting in slow-moving traffic up to 105°C, unlike cheap copper-clad aluminum.',
      xPercent: 43,
      yPercent: 42,
    },
    {
      id: 'impeller',
      name: 'Precision High-Flow Turbine Impeller',
      material: 'Aircraft-grade PPS Thermoplastic with balanced curved blades',
      functionDesc: 'Pressurizes liquid fuel progressively through dual aerodynamic channels without turbulence.',
      advantage: 'Operates whisper-quiet (<45dB) and avoids vapor lock cavitation during hot afternoon starts.',
      xPercent: 62,
      yPercent: 32,
    },
    {
      id: 'checkvalve',
      name: 'High-Pressure Viton Check Valve',
      material: 'Viton Fluoropolymer Seal with stainless steel compression spring',
      functionDesc: 'Maintains 2.5–3.0 Bar static line pressure in the fuel rail when the vehicle engine is turned off.',
      advantage: 'Guarantees instant single-kick ignition every morning without requiring repeated key primes.',
      xPercent: 68,
      yPercent: 58,
    },
    {
      id: 'commutator',
      name: 'Heavy-Duty Sintered Carbon Commutator',
      material: 'Silver-impregnated graphite carbon brushes with bronze springs',
      functionDesc: 'Maintains steady electrical brush contact without spark erosion as the motor spins at 6,500 RPM.',
      advantage: 'Extended 100,000+ kilometer lifespan with ultra-low electrical noise and low RF interference.',
      xPercent: 28,
      yPercent: 40,
    },
    {
      id: 'filter',
      name: 'Dual-Stage Micro Inlet Filter Strainer',
      material: 'Ultrasonic welded multi-ply nylon micro-mesh (30 Micron rating)',
      functionDesc: 'Pre-screens sediment, tank rust flakes, and water droplets before fuel enters the turbine chamber.',
      advantage: 'Protects delicate pump tolerances against fuel contamination from road-side black-market petrol.',
      xPercent: 54,
      yPercent: 64,
    },
    {
      id: 'casing',
      name: 'Corrosion-Resistant Steel Canister Body',
      material: 'Electroless nickel-plated seamless steel tube (38mm standard diameter)',
      functionDesc: 'Encloses the complete motor assembly with hermetic crimp sealing to prevent internal leaks.',
      advantage: 'Impervious to aggressive high-ethanol fuels, moisture rust, and physical vibration.',
      xPercent: 40,
      yPercent: 20,
    },
  ];

  const [activeSpot, setActiveSpot] = useState<ComponentHotspot>(hotspots[0]);

  return (
    <section id="specs" className="py-16 lg:py-24 bg-neutral-900 text-white border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-red-500">
            <Compass className="w-4 h-4" />
            <span>INTERNAL ANATOMY &amp; CUTAWAY</span>
            <span aria-hidden="true">·</span>
            <span>PRECISION ENGINEERING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
            Interactive Cutaway Anatomy: Built Better From The Inside
          </h2>
          <p className="text-base text-neutral-400">
            Click on any highlighted marker on the cutaway diagram below to inspect the internal components that make FRANKBLAISE ELECTRIC FUEL PUMP PLUS outlast standard alternatives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left/Main Column: Image with interactive hotspot badges */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-700 bg-neutral-950 p-2 shadow-2xl">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-950">
                <img
                  src="/images/fuel_pump_cutaway_diagram_1792348149087.jpg"
                  alt="Frankblaise Electric Fuel Pump internal cutaway diagram showing copper armature and turbine impeller"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Hotspot Markers */}
                {hotspots.map((spot, idx) => {
                  const isActive = activeSpot.id === spot.id;
                  return (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => setActiveSpot(spot)}
                      style={{ left: `${spot.xPercent}%`, top: `${spot.yPercent}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group flex items-center justify-center transition-all ${
                        isActive ? 'scale-125 z-20' : 'hover:scale-110 z-10'
                      }`}
                      aria-label={`Inspect ${spot.name}`}
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all ${
                        isActive
                          ? 'bg-red-600 text-white ring-4 ring-red-500/50'
                          : 'bg-neutral-900/90 text-neutral-200 border border-neutral-600 hover:border-red-400 hover:text-white'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="sr-only">{spot.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Component selector pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto p-2 scrollbar-thin">
                {hotspots.map((spot, idx) => (
                  <button
                    key={spot.id}
                    onClick={() => setActiveSpot(spot)}
                    className={`px-2.5 py-1 text-xs rounded font-medium transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                      activeSpot.id === spot.id
                        ? 'bg-red-600 text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'
                    }`}
                  >
                    0{idx + 1}. {spot.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Active Component Details Card */}
          <div className="lg:col-span-5">
            <div className="bg-neutral-950 rounded-2xl p-6 sm:p-8 border border-neutral-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center font-black">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                      COMPONENT INSPECTION
                    </span>
                    <h3 className="text-xl font-bold text-white font-display">
                      {activeSpot.name}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-xs uppercase font-semibold tracking-wider text-neutral-400 block mb-1">
                    Material Specification:
                  </span>
                  <p className="text-neutral-200 font-medium bg-neutral-900 p-3 rounded-lg border border-neutral-800">
                    {activeSpot.material}
                  </p>
                </div>

                <div>
                  <span className="text-xs uppercase font-semibold tracking-wider text-neutral-400 block mb-1">
                    Operational Function:
                  </span>
                  <p className="text-neutral-300 leading-relaxed">
                    {activeSpot.functionDesc}
                  </p>
                </div>

                <div className="p-3.5 bg-red-950/40 rounded-xl border border-red-900/60">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-red-300 block mb-0.5">
                        Nigerian Road Durability Advantage:
                      </span>
                      <p className="text-xs text-red-200/90 leading-relaxed">
                        {activeSpot.advantage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-xs text-neutral-500 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-neutral-400" />
                <span>Every Frankblaise pump undergoes factory pressure testing before shipping.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
