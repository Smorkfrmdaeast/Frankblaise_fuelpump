import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';

interface ReusableCarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number, openLightbox?: (index: number) => void) => React.ReactNode;
  renderLightboxContent?: (item: T, index: number) => React.ReactNode;
  ariaLabel: string;
  enableLightbox?: boolean;
  className?: string;
}

export function ReusableCarousel<T>({
  items,
  renderItem,
  renderLightboxContent,
  ariaLabel,
  enableLightbox = false,
  className = '',
}: ReusableCarouselProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastActiveTriggerRef = useRef<HTMLElement | null>(null);
  const lightboxModalRef = useRef<HTMLDivElement>(null);

  const total = items.length;

  const scrollToItem = useCallback((index: number) => {
    if (!containerRef.current || total === 0) return;
    const clamped = Math.max(0, Math.min(index, total - 1));
    setCurrentIndex(clamped);

    const child = containerRef.current.children[clamped] as HTMLElement;
    if (child) {
      child.scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest',
      });
    }
  }, [total]);

  const handlePrev = useCallback(() => {
    scrollToItem(currentIndex === 0 ? total - 1 : currentIndex - 1);
  }, [currentIndex, total, scrollToItem]);

  const handleNext = useCallback(() => {
    scrollToItem(currentIndex === total - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, total, scrollToItem]);

  // Handle scroll detection
  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollLeft = container.scrollLeft;
    const childWidth = container.firstElementChild ? (container.firstElementChild as HTMLElement).offsetWidth : 1;
    const newIndex = Math.round(scrollLeft / childWidth);
    if (newIndex >= 0 && newIndex < total && newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  // Keyboard navigation on container
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Lightbox handlers
  const openLightbox = (index: number) => {
    if (!enableLightbox) return;
    lastActiveTriggerRef.current = document.activeElement as HTMLElement;
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    if (lastActiveTriggerRef.current) {
      lastActiveTriggerRef.current.focus();
    }
  }, []);

  // Escape key listener for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, total, closeLightbox]);

  if (total === 0) {
    return null;
  }

  return (
    <div
      className={`relative w-full ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Item {currentIndex + 1} of {total}
      </div>

      {/* Main Track with scroll-snap */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto scroll-snap-x scrollbar-none gap-4 pb-4 snap-mandatory focus:outline-none"
        tabIndex={-1}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-full sm:w-[85%] md:w-[65%] lg:w-[48%] scroll-snap-align-start transition-opacity"
            role="group"
            aria-roledescription="slide"
            aria-label={`${idx + 1} of ${total}`}
          >
            {renderItem(item, idx, openLightbox)}
          </div>
        ))}
      </div>

      {/* Controls Bar: Prev, Indicators, Next */}
      <div className="flex items-center justify-between gap-4 mt-4 pt-2 border-t border-neutral-800/40">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous slide"
          className="min-tap-target p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Indicators */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center" role="tablist" aria-label="Slide dots">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={currentIndex === idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => scrollToItem(idx)}
              className={`min-tap-target p-1 flex items-center justify-center cursor-pointer`}
            >
              <span
                className={`block rounded-full transition-all ${
                  currentIndex === idx
                    ? 'w-6 h-2 bg-[#E32636]'
                    : 'w-2 h-2 bg-neutral-700 hover:bg-neutral-500'
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next slide"
          className="min-tap-target p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Lightbox Modal */}
      {enableLightbox && lightboxOpen && (
        <div
          ref={lightboxModalRef}
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged view"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm animate-in fade-in"
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center">
            {/* Close Button */}
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close enlarged view"
              className="min-tap-target absolute -top-12 right-0 p-2 text-white hover:text-[#E32636] transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Lightbox Content */}
            <div className="w-full flex items-center justify-center">
              {renderLightboxContent
                ? renderLightboxContent(items[lightboxIndex], lightboxIndex)
                : renderItem(items[lightboxIndex], lightboxIndex)}
            </div>

            {/* Lightbox Nav */}
            <div className="flex items-center justify-between w-full mt-4 text-white text-xs">
              <button
                type="button"
                onClick={() => setLightboxIndex((prev) => (prev === 0 ? total - 1 : prev - 1))}
                aria-label="Previous enlarged image"
                className="min-tap-target px-4 py-2 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Previous
              </button>

              <span className="font-mono">
                {lightboxIndex + 1} / {total}
              </span>

              <button
                type="button"
                onClick={() => setLightboxIndex((prev) => (prev === total - 1 ? 0 : prev + 1))}
                aria-label="Next enlarged image"
                className="min-tap-target px-4 py-2 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
