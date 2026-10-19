import React, { useState } from 'react';
import { useProductConfig } from '../hooks/useProductConfig';
import { ChevronLeft, ChevronRight, MessageSquare, Maximize2, X } from 'lucide-react';

export const CustomerExperiencesSection: React.FC = () => {
  const config = useProductConfig();
  const reviews = config.reviewScreenshots.filter((r) => r.url);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // If no genuine review screenshots exist, hide the section completely
  if (reviews.length === 0) {
    return null;
  }

  const activeReview = reviews[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : reviews.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < reviews.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="reviews" className="bg-[#E9E7E2] text-[#1B1C1F] py-16 lg:py-24 border-b border-[#D5D2CB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-[#B51222] font-bold">
            SECTION 08 · BUYER EXPERIENCES
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase font-display tracking-tight text-[#1B1C1F]">
            Verified Customer Evidence
          </h2>
          <p className="text-sm sm:text-base text-[#2B2D31]">
            Genuine WhatsApp conversations and feedback screenshots from verified Nigerian buyers. Personal contact details are redacted for privacy.
          </p>
        </div>

        {/* Editorial Screenshot Card */}
        <div className="bg-white border border-[#D5D2CB] rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="relative aspect-[3/4] sm:aspect-[9/16] max-h-[500px] w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
            <img
              src={activeReview.url!}
              alt={activeReview.caption || 'Verified customer feedback screenshot'}
              className="w-full h-full object-contain"
            />

            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              aria-label="Enlarge feedback screenshot"
              className="min-tap-target absolute top-3 right-3 p-2.5 rounded-lg bg-[#1B1C1F]/80 hover:bg-[#1B1C1F] text-white transition-colors cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {reviews.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous review"
                  className="min-tap-target absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-[#1B1C1F]/80 hover:bg-[#1B1C1F] text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next review"
                  className="min-tap-target absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-[#1B1C1F]/80 hover:bg-[#1B1C1F] text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E9E7E2] text-xs font-mono text-[#6E7075]">
            <span>{activeReview.caption || 'Customer feedback message'}</span>
            <span>REVIEW {activeIndex + 1} OF {reviews.length}</span>
          </div>
        </div>
      </div>

      {/* Lightbox for review */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="relative max-w-lg w-full max-h-[90vh] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close enlarged review"
              className="min-tap-target absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={activeReview.url!}
              alt="Enlarged customer review screenshot"
              className="max-h-[80vh] w-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};
