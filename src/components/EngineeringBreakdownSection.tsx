import React from 'react';
import { ShieldAlert, Cpu, Wrench, Filter } from 'lucide-react';

export const EngineeringBreakdownSection: React.FC = () => {
  return (
    <section id="engineering" className="bg-[#E9E7E2] text-[#1B1C1F] py-16 lg:py-24 border-b border-[#D5D2CB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header with Human Editorial Numbering */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-[#B51222] font-bold">
            SECTION 02 · MECHANICAL ANATOMY &amp; ASSEMBLY
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase font-display tracking-tight text-[#1B1C1F]">
            Internal Construction &amp; Installation Subsystems
          </h2>
          <p className="text-base text-[#2B2D31] leading-relaxed">
            Detailed inspection of genuine components, internal electric motor architecture, and inlet filtration designed to fit standard automotive fuel pump hangers.
          </p>
        </div>

        {/* 2-Column Photographic & Diagrammatic Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Card 1: Cutaway Mechanical Mechanism */}
          <div className="bg-white border border-[#D5D2CB] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E9E7E2] pb-3">
                <span className="text-xs font-mono font-bold text-[#B51222]">DIAGRAM 01</span>
                <span className="text-xs font-mono text-[#6E7075]">INTERNAL CUTAWAY</span>
              </div>

              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F6F4EF] border border-[#E9E7E2] flex items-center justify-center">
                <img
                  src="/images/fuel_pump_cutaway_diagram_1792348149087.jpg"
                  alt="Internal mechanical cutaway diagram of electric fuel pump showing armature and impeller"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>

              <h3 className="text-lg font-bold uppercase font-display text-[#1B1C1F]">
                Armature, Commutation &amp; Impeller Chamber
              </h3>
              <p className="text-sm text-[#2B2D31] leading-relaxed">
                The cylindrical motor utilizes an internal copper coil armature and balanced commutator brushes to deliver consistent fluid displacement without vapor lock under sustained engine operating temperatures.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E9E7E2] grid grid-cols-2 gap-4 text-xs font-mono text-[#6E7075]">
              <div>
                <span className="block text-[#1B1C1F] font-bold">12V DC MOTOR</span>
                <span>Armature assembly</span>
              </div>
              <div>
                <span className="block text-[#1B1C1F] font-bold">INTERNAL CHECK VALVE</span>
                <span>Residual line pressure</span>
              </div>
            </div>
          </div>

          {/* Card 2: Complete Installation Kit */}
          <div className="bg-white border border-[#D5D2CB] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E9E7E2] pb-3">
                <span className="text-xs font-mono font-bold text-[#B51222]">ASSEMBLY 02</span>
                <span className="text-xs font-mono text-[#6E7075]">INCLUDED HARDWARE</span>
              </div>

              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F6F4EF] border border-[#E9E7E2] flex items-center justify-center">
                <img
                  src="/images/fuel_pump_unboxing_kit_1792348148348.jpg"
                  alt="Included accessories unboxing kit showing strainer sock, submersible hose, clamps, and pigtail harness"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <h3 className="text-lg font-bold uppercase font-display text-[#1B1C1F]">
                In-Tank Replacement Hardware
              </h3>
              <p className="text-sm text-[#2B2D31] leading-relaxed">
                Replacement requires fresh consumables. Every unit is bundled with a micron inlet filter strainer, a reinforced fuel-safe rubber submersible connector hose, clamp rings, and an electrical pigtail harness.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E9E7E2] grid grid-cols-2 gap-4 text-xs font-mono text-[#6E7075]">
              <div>
                <span className="block text-[#1B1C1F] font-bold">INLET STRAINER</span>
                <span>Sediment filtration</span>
              </div>
              <div>
                <span className="block text-[#1B1C1F] font-bold">2-PIN CONNECTOR</span>
                <span>Wiring pigtail harness</span>
              </div>
            </div>
          </div>
        </div>

        {/* Numbered Annotations Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          <div className="p-5 bg-white border border-[#D5D2CB] rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#B51222]" />
              <span className="text-xs font-mono font-bold text-[#1B1C1F]">01. INLET FILTRATION</span>
            </div>
            <p className="text-xs text-[#2B2D31] leading-relaxed">
              Fine-mesh strainer sock arrests rust scales and debris common in vehicle fuel tanks before fluid enters the turbine.
            </p>
          </div>

          <div className="p-5 bg-white border border-[#D5D2CB] rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#B51222]" />
              <span className="text-xs font-mono font-bold text-[#1B1C1F]">02. BALANCED COMMUTATOR</span>
            </div>
            <p className="text-xs text-[#2B2D31] leading-relaxed">
              Precision copper-wound rotor produces consistent rotational torque, minimizing electrical resistance and brush wear.
            </p>
          </div>

          <div className="p-5 bg-white border border-[#D5D2CB] rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#B51222]" />
              <span className="text-xs font-mono font-bold text-[#1B1C1F]">03. HANGER FITMENT</span>
            </div>
            <p className="text-xs text-[#2B2D31] leading-relaxed">
              Cylindrical outer diameter matches OEM bracket sleeves used in multi-point fuel injection vehicle assemblies.
            </p>
          </div>

          <div className="p-5 bg-white border border-[#D5D2CB] rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#B51222]" />
              <span className="text-xs font-mono font-bold text-[#1B1C1F]">04. PRE-DISPATCH CHECK</span>
            </div>
            <p className="text-xs text-[#2B2D31] leading-relaxed">
              Because fuel pump parameters vary, our technicians verify car model and year over the phone before shipping.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
