import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, Cpu, Zap, VolumeX, Fuel, Gauge } from 'lucide-react';

interface PainPointsAndSolutionProps {
  onOrderClick: () => void;
}

export const PainPointsAndSolution: React.FC<PainPointsAndSolutionProps> = ({ onOrderClick }) => {
  const problems = [
    {
      title: 'Car Cuts Off in Heavy Go-Slow Traffic',
      problem: 'Inferior aluminum windings overheat after 40 minutes of idle engine heat, shutting down the fuel feed and leaving you stranded.',
      solution: 'FRANKBLAISE pure oxygen-free copper armature coil maintains optimal conductivity up to 105°C without thermal degradation.',
      icon: Zap,
    },
    {
      title: 'Delayed Ignition & Hard Cranking',
      problem: 'Worn out check valves leak fuel backwards into the tank overnight, forcing you to crank 4–6 times before petrol reaches the engine.',
      solution: 'Spring-loaded Viton check valve seals high rail pressure instantly, giving you instantaneous single-kick ignition every time.',
      icon: Gauge,
    },
    {
      title: 'Severe Power Loss When Climbing Expressways',
      problem: 'Cheap knock-off pumps drop from 3.5 Bar down to 1.8 Bar when you press the throttle, causing severe jerking and choking.',
      solution: 'High-torque turbine delivers 140–160 LPH continuous flow even under wide-open throttle with full air conditioning on.',
      icon: Cpu,
    },
    {
      title: 'Fuel Impurities & Sediment Damage',
      problem: 'Unfiltered grit, rust particles, and sediment from local fuel pumps seize fragile plastic gears in standard pumps.',
      solution: 'Reinforced dual-stage micro-mesh strainer sock intercepts particles down to 30 microns, protecting the internal mechanism.',
      icon: Fuel,
    },
    {
      title: 'Loud Whining / Buzzing Sound Under Seat',
      problem: 'Imbalanced eccentric rollers vibrate violently against the tank wall, producing that embarrassing loud drone.',
      solution: 'Precision dynamically balanced turbine impeller operates beneath 45 dB for silent, vibration-free cabin cruising.',
      icon: VolumeX,
    },
  ];

  return (
    <section id="benefits" className="py-16 lg:py-24 bg-white text-neutral-900 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-red-600">
            <span>ENGINEERED FOR REAL ROADS</span>
            <span aria-hidden="true">·</span>
            <span>NO MORE RANDOM TOW TRUCK BILLS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 font-display">
            Why 85% of Fuel Pumps Sold in Nigeria Fail Within 3 Months
          </h2>
          <p className="text-base sm:text-lg text-neutral-600">
            Most replacement pumps on the market are low-spec clones built with cheap aluminum wiring and fragile plastic gears that cannot survive African heat and fuel conditions.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {problems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-semibold text-neutral-500">
                      POINT 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 mb-3 font-display">
                    {item.title}
                  </h3>

                  {/* Bad vs Good */}
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-red-50/60 rounded-xl border border-red-100">
                      <div className="flex items-start gap-2 text-red-900 font-medium text-xs mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        <span>Ordinary Market Pump</span>
                      </div>
                      <p className="text-xs text-red-700/90 leading-relaxed">
                        {item.problem}
                      </p>
                    </div>

                    <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
                      <div className="flex items-start gap-2 text-emerald-900 font-bold text-xs mb-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Frankblaise Electric Plus</span>
                      </div>
                      <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                        {item.solution}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Quick Call to Action Card in Grid */}
          <div className="bg-neutral-900 text-white rounded-2xl p-6 border border-neutral-800 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold mb-4">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">
                Save Money on Repeat Mechanic Visits
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed mb-4">
                Replacing an inferior pump 3 times in one year costs you over ₦90,000 in parts, towing charges, and mechanic workmanship. Upgrade once to Frankblaise.
              </p>
            </div>

            <button
              onClick={onOrderClick}
              type="button"
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shadow-red-950/60 cursor-pointer text-center"
            >
              Order Frankblaise Fuel Pump (₦25,000)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
