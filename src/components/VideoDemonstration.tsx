import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle, Gauge, Activity, Sparkles } from 'lucide-react';

interface VideoDemonstrationProps {
  onOrderClick: () => void;
}

export const VideoDemonstration: React.FC<VideoDemonstrationProps> = ({ onOrderClick }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(15);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTest, setActiveTest] = useState<'pressure' | 'temp' | 'noise'>('pressure');

  // Simulated playback progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section className="py-16 lg:py-24 bg-white text-neutral-900 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-red-600">
            <Activity className="w-4 h-4" />
            <span>BENCH LAB DEMONSTRATION</span>
            <span aria-hidden="true">·</span>
            <span>REAL PRESSURE PERFORMANCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 font-display">
            Watch The 4.0 Bar Pressure Bench Test
          </h2>
          <p className="text-base text-neutral-600">
            See how the FRANKBLAISE ELECTRIC FUEL PUMP PLUS maintains rock-solid fuel rail pressure under simulated heavy acceleration compared to a generic market pump.
          </p>
        </div>

        {/* Video Player & Lab Test Container */}
        <div className="max-w-5xl mx-auto bg-neutral-950 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 text-white">
          <div className="relative aspect-video bg-neutral-900 flex items-center justify-center overflow-hidden">
            {/* Visual background simulation */}
            <img
              src="/src/assets/images/customer_car_installation_1792348149630.jpg"
              alt="Fuel pump bench testing and technician verification"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                isPlaying ? 'opacity-85 scale-105' : 'opacity-65'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />

            {/* Test Simulation HUD Overlay */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs pointer-events-none">
              <div className="flex items-center gap-2 bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-700">
                <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-neutral-500'}`} />
                <span className="font-mono font-bold tracking-wider">
                  {isPlaying ? 'LIVE BENCH DEMO: TEST RUN #04' : 'LAB RECORDING READY'}
                </span>
              </div>

              <div className="bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-700 font-mono text-emerald-400 font-bold">
                TEST SPEC: 12.8V DC / 150 LPH
              </div>
            </div>

            {/* Simulated Live Gauge Comparison Overlay in Center */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              {!isPlaying ? (
                <button
                  onClick={() => setIsPlaying(true)}
                  type="button"
                  className="w-20 h-20 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-950 hover:scale-110 active:scale-95 transition-all cursor-pointer group"
                  aria-label="Play video demonstration"
                >
                  <Play className="w-8 h-8 ml-1 fill-white" />
                </button>
              ) : (
                <div className="w-full max-w-lg bg-neutral-950/90 backdrop-blur-md rounded-2xl p-5 border border-neutral-700 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="text-xs uppercase font-bold text-neutral-300">
                      Live Fuel Pressure Readout
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      Optimal Target: 3.8–4.2 Bar
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Competitor Pump */}
                    <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-3 text-center">
                      <span className="text-[11px] text-red-300 font-semibold block mb-1">
                        Generic Market Pump
                      </span>
                      <div className="text-2xl font-black font-mono text-red-500">
                        2.1 <span className="text-xs font-normal">Bar</span>
                      </div>
                      <span className="text-[10px] text-red-400">⚠️ Pressure Drop Under Load</span>
                    </div>

                    {/* Frankblaise Plus */}
                    <div className="bg-emerald-950/30 border border-emerald-800/60 rounded-xl p-3 text-center">
                      <span className="text-[11px] text-emerald-300 font-semibold block mb-1">
                        Frankblaise Electric Plus
                      </span>
                      <div className="text-2xl font-black font-mono text-emerald-400">
                        4.1 <span className="text-xs font-normal">Bar</span>
                      </div>
                      <span className="text-[10px] text-emerald-300">✓ Steady Rock-Solid Flow</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Video Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex flex-col gap-2">
              {/* Progress Bar */}
              <div 
                className="w-full h-1.5 bg-neutral-700/80 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  setProgress(Math.round((clickX / rect.width) * 100));
                }}
              >
                <div 
                  className="h-full bg-red-600 transition-all duration-200" 
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-300 pt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="hover:text-white transition-colors cursor-pointer"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <button
                    onClick={() => {
                      setProgress(0);
                      setIsPlaying(true);
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                    aria-label="Replay"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-[11px] text-neutral-400">
                    0:{(Math.floor(progress * 0.45)).toString().padStart(2, '0')} / 0:45
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span className="text-[10px]">{isMuted ? 'Muted' : 'Acoustics'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Test Chapters / Key Takeaways Below Video */}
          <div className="p-6 sm:p-8 bg-neutral-950 border-t border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral-900/80 p-4 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase mb-1">
                <Gauge className="w-4 h-4" />
                <span>Test 1: Cold Start Pressure</span>
              </div>
              <p className="text-xs text-neutral-300">
                Spikes instantly to 4.2 Bar in under 0.3 seconds upon key ignition, priming fuel rails immediately.
              </p>
            </div>

            <div className="bg-neutral-900/80 p-4 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Test 2: 90°C Thermal Run</span>
              </div>
              <p className="text-xs text-neutral-300">
                Submerged in heated fuel bath for 60 continuous minutes with zero drop in amperage or discharge speed.
              </p>
            </div>

            <div className="bg-neutral-900/80 p-4 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase mb-1">
                <CheckCircle className="w-4 h-4" />
                <span>Test 3: Sound Acoustic Lab</span>
              </div>
              <p className="text-xs text-neutral-300">
                Measured at 43.8 dB, significantly quieter than conversational speech (60 dB) and stock OEM pumps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
