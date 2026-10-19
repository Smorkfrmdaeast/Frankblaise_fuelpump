import React from 'react';
import { useProductConfig } from '../hooks/useProductConfig';
import { ArrowDown } from 'lucide-react';

interface ProductVideoSectionProps {
  onOrderClick: () => void;
}

export const ProductVideoSection: React.FC<ProductVideoSectionProps> = ({
  onOrderClick,
}) => {
  const config = useProductConfig();

  // If no real video URL is present, hide section on public site
  if (!config.video?.url) {
    return null;
  }

  return (
    <section id="video-demo" className="bg-[#F6F4EF] text-[#1B1C1F] py-16 lg:py-24 border-b border-[#D5D2CB]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-[#B51222] font-bold">
            SECTION 05 · BENCH DEMONSTRATION
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase font-display tracking-tight text-[#1B1C1F]">
            Product Video Demonstration
          </h2>
          <p className="text-sm sm:text-base text-[#2B2D31]">
            Recorded demonstration of the {config.productName} showing terminal contacts, inlet strainer, and cylindrical housing.
          </p>
        </div>

        <div className="bg-white border border-[#D5D2CB] rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center">
            <video
              controls
              playsInline
              preload="metadata"
              poster={config.video.poster || undefined}
              className="w-full h-full object-contain"
            >
              <source src={config.video.url} type="video/mp4" />
              Your browser does not support HTML5 video playback.
            </video>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-[#E9E7E2] text-xs font-mono text-[#6E7075]">
            <div>
              <span className="font-bold text-[#1B1C1F] block">ASSET RECORDING</span>
              <span>Direct seller bench presentation (MP4)</span>
            </div>

            <button
              onClick={onOrderClick}
              type="button"
              className="min-tap-target px-5 py-2.5 bg-[#B51222] hover:bg-[#8F0E1B] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>ORDER YOUR FUEL PUMP</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
