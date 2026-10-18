import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCheck, Play, Mic, MapPin, Car, ShieldCheck } from 'lucide-react';
import { WHATSAPP_REVIEWS, ReviewItem } from '../data/reviewsData';

export const WhatsAppReviewsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const prevReview = () => {
    setCurrentIndex((prev) => (prev === 0 ? WHATSAPP_REVIEWS.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev === WHATSAPP_REVIEWS.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      nextReview();
    } else if (diff < -50) {
      prevReview();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const current = WHATSAPP_REVIEWS[currentIndex];

  return (
    <section id="reviews" className="py-16 lg:py-24 bg-neutral-900 text-white border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>GENUINE WHATSAPP CUSTOMER FEEDBACK</span>
            <span aria-hidden="true">·</span>
            <span>VERIFIED NIGERIAN MOTORISTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
            Real Experiences From Car Owners Across Nigeria
          </h2>
          <p className="text-base text-neutral-400">
            Swipe through real feedback and conversations from motorists who resolved hard starting, traffic stalls, and power drops with Frankblaise Electric Fuel Pump Plus.
          </p>
        </div>

        {/* Carousel Area */}
        <div className="max-w-xl mx-auto relative">
          {/* Navigation Chevrons for Desktop */}
          <button
            onClick={prevReview}
            type="button"
            className="hidden md:flex absolute -left-14 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white items-center justify-center border border-neutral-700 shadow-xl transition-all z-20 cursor-pointer"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextReview}
            type="button"
            className="hidden md:flex absolute -right-14 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white items-center justify-center border border-neutral-700 shadow-xl transition-all z-20 cursor-pointer"
            aria-label="Next review"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Authentic WhatsApp Phone Card Mockup */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="rounded-3xl overflow-hidden shadow-2xl border-2 border-neutral-800 bg-[#0b141a] text-slate-100 flex flex-col min-h-[580px] transition-all"
          >
            {/* WhatsApp Header Bar */}
            <div className="bg-[#1f2c34] px-4 py-3 flex items-center justify-between border-b border-[#2a3942] shrink-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${current.avatarColor} text-white flex items-center justify-center font-bold text-sm shadow-inner`}>
                  {current.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-white">{current.customerName}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono block">
                    {current.phoneMasked} · Online
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                  Verified Delivery
                </span>
              </div>
            </div>

            {/* Vehicle & Location Context Strip */}
            <div className="bg-[#182229] px-4 py-2 border-b border-[#233138] flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-300">
              <div className="flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-red-400" />
                <span className="font-medium text-white">{current.vehicle}</span>
              </div>
              <div className="flex items-center gap-1 text-neutral-400 text-[11px]">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{current.location}</span>
              </div>
            </div>

            {/* Chat Body with subtle WhatsApp chat pattern */}
            <div 
              className="flex-1 p-4 space-y-3 overflow-y-auto"
              style={{
                backgroundColor: '#0b141a',
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }}
            >
              {/* Date stamp bubble */}
              <div className="text-center my-1">
                <span className="bg-[#182229] text-neutral-400 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                  {current.date}
                </span>
              </div>

              {/* Chat Messages */}
              {current.messages.map((msg, i) => {
                const isSeller = msg.sender === 'seller';
                return (
                  <div
                    key={i}
                    className={`flex flex-col ${isSeller ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-md relative text-xs leading-relaxed ${
                        isSeller
                          ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
                          : 'bg-[#202c33] text-[#d1d7db] rounded-tl-none'
                      }`}
                    >
                      {/* Voice Note Simulation */}
                      {msg.isVoiceNote ? (
                        <div className="flex items-center gap-3 py-1 pr-2">
                          <button
                            type="button"
                            className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 cursor-pointer shadow"
                            aria-label="Play voice note preview"
                          >
                            <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                          </button>
                          <div className="flex flex-col gap-1 w-32">
                            {/* Simulated waveform bars */}
                            <div className="flex items-center gap-0.5 h-3">
                              {[4, 8, 12, 6, 14, 10, 7, 12, 5, 11, 8, 13, 6, 9].map((h, barIdx) => (
                                <span
                                  key={barIdx}
                                  className="w-1 bg-emerald-400 rounded-full"
                                  style={{ height: `${h}px` }}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-neutral-300 font-mono">
                              {msg.voiceDuration} Voice Note
                            </span>
                          </div>
                          <Mic className="w-4 h-4 text-emerald-400 shrink-0" />
                        </div>
                      ) : (
                        <p>{msg.text}</p>
                      )}

                      {/* Time and Blue double ticks */}
                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-neutral-400">
                        <span>{msg.time}</span>
                        <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Swipe Controls */}
            <div className="bg-[#1f2c34] p-3 border-t border-[#2a3942] flex items-center justify-between">
              <button
                onClick={prevReview}
                type="button"
                className="px-3 py-1.5 rounded-lg bg-[#2a3942] hover:bg-[#32424b] text-xs font-medium text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>

              {/* Indicator dots */}
              <div className="flex items-center gap-1.5">
                {WHATSAPP_REVIEWS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx ? 'w-5 bg-emerald-400' : 'bg-neutral-600'
                    }`}
                    aria-label={`Go to review ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextReview}
                type="button"
                className="px-3 py-1.5 rounded-lg bg-[#2a3942] hover:bg-[#32424b] text-xs font-medium text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
