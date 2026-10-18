import React, { useRef, useState } from 'react';
import { siteConfig } from '../config/site';
import { ArrowDown, Play, CheckCircle2 } from 'lucide-react';

interface ProductVideoSectionProps {
  onOrderClick: () => void;
}

export const ProductVideoSection: React.FC<ProductVideoSectionProps> = ({ onOrderClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);

  const chapters = [
    { label: '01. Pump Body & Terminals', time: 0 },
    { label: '02. Copper Armature & Turbine', time: 4 },
    { label: '03. Accessories & Strainer Kit', time: 8 },
    { label: '04. In-Tank Vehicle Fitment', time: 12 },
  ];

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const jumpToChapter = (time: number, idx: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    videoRef.current.play();
    setIsPlaying(true);
    setActiveChapter(idx);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const t = videoRef.current.currentTime;
    if (t < 4) setActiveChapter(0);
    else if (t < 8) setActiveChapter(1);
    else if (t < 12) setActiveChapter(2);
    else setActiveChapter(3);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const hasVideo = Boolean(siteConfig.video.url);

  return (
    <section className="py-16 lg:py-20 bg-[#FFFFFF] text-[#292929] border-b border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#E32636] text-xs font-bold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>VIDEO DEMONSTRATION &amp; INSPECTION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#292929] font-display">
            Take a Closer Look at the Fuel Pump
          </h2>
          <p className="text-sm text-[#777777] mt-2 max-w-xl mx-auto">
            Review the physical component, terminals, and strainer assembly in high definition.
          </p>
        </div>

        {/* Responsive 16:9 Aspect Ratio Container for mobile & desktop */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-[#0B0B0D] border border-neutral-800 shadow-2xl group">
            {hasVideo ? (
              <>
                <video
                  ref={videoRef}
                  src={siteConfig.video.url || undefined}
                  poster={siteConfig.video.poster || undefined}
                  controls
                  playsInline
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleEnded}
                  className="w-full h-full object-cover sm:object-contain bg-black cursor-pointer"
                >
                  Your browser does not support the video tag.
                </video>

                {/* Floating Big Play Button Overlay when paused */}
                {!isPlaying && (
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label="Play fuel pump video demonstration"
                    className="min-tap-target absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#E32636]/90 hover:bg-[#E32636] text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-sm z-20"
                  >
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white ml-1" />
                  </button>
                )}

                {/* Top Watermark Badge */}
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-white text-[11px] font-mono pointer-events-none flex items-center gap-1.5 z-10">
                  <span className="w-2 h-2 rounded-full bg-[#E32636] animate-pulse" />
                  <span>1080p HD Video Inspection</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-3">
                <span className="text-sm font-semibold text-white block">
                  Product Video Demonstrating Fuel Pump
                </span>
                <span className="text-xs text-neutral-400 font-mono block max-w-md">
                  Video placeholder: upload video file or set video URL in site.ts
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Chapter Selector Navigation */}
        {hasVideo && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {chapters.map((ch, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => jumpToChapter(ch.time, idx)}
                className={`min-tap-target px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  activeChapter === idx
                    ? 'bg-[#E32636] text-white border-[#E32636] shadow-sm'
                    : 'bg-[#F5F5F7] text-[#292929] border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>
        )}

        {/* Button below: Exact copy required */}
        <div className="pt-4">
          <button
            onClick={onOrderClick}
            type="button"
            className="min-tap-target px-8 py-3.5 text-sm sm:text-base font-bold text-white bg-[#E32636] hover:bg-[#B51222] rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>ORDER YOUR FUEL PUMP</span>
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
