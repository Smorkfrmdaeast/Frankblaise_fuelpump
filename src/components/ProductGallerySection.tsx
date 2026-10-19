import React, { useState, useEffect, useRef } from 'react';
import { useProductConfig } from '../hooks/useProductConfig';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

export const ProductGallerySection: React.FC = () => {
  const config = useProductConfig();
  const images = config.productImages.filter((img) => img.url);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [erroredImages, setErroredImages] = useState<Record<string, boolean>>({});

  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Keyboard navigation and focus return for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      triggerButtonRef.current?.focus();
    };
  }, [isLightboxOpen, images.length]);

  if (images.length === 0) {
    return null;
  }

  const activeImage = images[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleImageError = (id: string) => {
    setErroredImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="gallery" className="bg-[#E9E7E2] text-[#1B1C1F] py-16 lg:py-24 border-b border-[#D5D2CB]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Gallery Header */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-[#B51222] font-bold">
            SECTION 04 · PHOTOGRAPHIC ASSETS
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase font-display tracking-tight text-[#1B1C1F]">
            Product Verification Gallery
          </h2>
          <p className="text-sm sm:text-base text-[#2B2D31]">
            Genuine high-resolution photographic evidence of the unit, assembly kit, cutaway diagram, and in-tank installation bracket.
          </p>
        </div>

        {/* Main Showcase Frame */}
        <div className="bg-white border border-[#D5D2CB] rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#F6F4EF] flex items-center justify-center border border-[#E9E7E2]">
            {erroredImages[activeImage.id] ? (
              <div className="text-center p-6 space-y-2">
                <span className="text-xs font-mono text-[#6E7075] block">Image unavailable</span>
                <span className="text-xs text-[#B51222]">{activeImage.slotName}</span>
              </div>
            ) : (
              <img
                src={activeImage.url!}
                alt={activeImage.alt}
                onError={() => handleImageError(activeImage.id)}
                className="w-full h-full object-contain"
              />
            )}

            {/* Lightbox Trigger Button */}
            <button
              ref={triggerButtonRef}
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              aria-label="Enlarge image"
              className="min-tap-target absolute top-3 right-3 p-2.5 rounded-lg bg-[#1B1C1F]/80 hover:bg-[#1B1C1F] text-white transition-colors cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Left and Right Nav Buttons */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous photograph"
                  className="min-tap-target absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-[#1B1C1F]/80 hover:bg-[#1B1C1F] text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next photograph"
                  className="min-tap-target absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-lg bg-[#1B1C1F]/80 hover:bg-[#1B1C1F] text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Caption & Metadata */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-[#E9E7E2] text-xs font-mono text-[#6E7075]">
            <span className="font-bold text-[#1B1C1F] uppercase">{activeImage.slotName}</span>
            <span>{activeImage.caption || activeImage.alt}</span>
          </div>

          {/* Thumbnails Row */}
          <div className="grid grid-cols-4 gap-3 pt-2">
            {images.map((img, idx) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View ${img.slotName}`}
                className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  activeIndex === idx
                    ? 'border-[#B51222] ring-2 ring-[#B51222]/20'
                    : 'border-[#D5D2CB] hover:border-[#6E7075]'
                }`}
              >
                {erroredImages[img.id] ? (
                  <div className="w-full h-full flex items-center justify-center bg-[#F6F4EF] text-[10px] text-[#6E7075]">
                    Unavailable
                  </div>
                ) : (
                  <img
                    src={img.url!}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Accessible Fullscreen Modal / Lightbox */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.slotName}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close enlarged view"
              className="min-tap-target absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full max-h-[80vh] flex items-center justify-center">
              <img
                src={activeImage.url!}
                alt={activeImage.alt}
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />
            </div>

            <div className="mt-4 text-center text-xs font-mono text-white/90">
              <span className="font-bold text-white block mb-1">{activeImage.slotName}</span>
              <span>{activeImage.caption || activeImage.alt}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
