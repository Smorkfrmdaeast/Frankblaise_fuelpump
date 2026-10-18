import React from 'react';
import { AlertCircle, Gauge, Activity, Zap, AlertTriangle } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const problemCards = [
    {
      title: 'DIFFICULT STARTING',
      description: 'A vehicle may struggle to start when fuel delivery is insufficient.',
      icon: Gauge,
    },
    {
      title: 'ENGINE HESITATION',
      description: 'Irregular fuel delivery can contribute to hesitation during acceleration.',
      icon: Activity,
    },
    {
      title: 'LOSS OF POWER',
      description: 'Fuel supply problems can affect engine performance.',
      icon: Zap,
    },
    {
      title: 'UNEXPECTED STALLING',
      description: 'Certain fuel delivery faults may contribute to engine stalling.',
      icon: AlertTriangle,
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-[#F5F5F7] text-[#292929] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#292929] font-display">
            Is Your Car Struggling to Start?
          </h2>
          <p className="text-sm sm:text-base text-[#777777] leading-relaxed">
            A faulty fuel pump can contribute to starting difficulties, engine hesitation, loss of power, or unexpected stalling. These symptoms may also have other causes, so proper diagnosis is important before replacing any component.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {problemCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E32636] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#292929] mb-2 font-display">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#777777] leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mandatory Disclaimer */}
        <div className="max-w-3xl mx-auto bg-white border border-neutral-200 rounded-xl p-4 flex items-start gap-3 text-xs sm:text-sm text-[#777777]">
          <AlertCircle className="w-5 h-5 text-[#E32636] shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#292929]">Disclaimer:</strong> These symptoms do not automatically confirm that the fuel pump is faulty. Seek appropriate vehicle diagnosis before replacement.
          </p>
        </div>
      </div>
    </section>
  );
};
