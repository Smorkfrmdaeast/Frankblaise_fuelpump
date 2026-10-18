import React from 'react';
import { siteConfig, ProductImageItem } from '../config/site';
import { ReusableCarousel } from './ReusableCarousel';
import { ImageWithPlaceholder } from './ImageWithPlaceholder';
import { Maximize2 } from 'lucide-react';

export const ProductGallerySection: React.FC = () => {
  const images = siteConfig.productImages;

  const renderSlide = (item: ProductImageItem, index: number, openLightbox?: (index: number) => void) => {
    return (
      <div className="bg-[#151518] rounded-2xl p-3 border border-neutral-800 text-white flex flex-col justify-between h-full group">
        <div className="relative overflow-hidden rounded-xl bg-neutral-950">
          <ImageWithPlaceholder
            src={item.url}
            alt={item.alt}
            slotLabel={item.slotName}
            aspectRatio="4/3"
            width={700}
            height={525}
          />

          {openLightbox && (
            <button
              type="button"
              onClick={() => openLightbox(index)}
              aria-label={`Enlarge image for ${item.slotName}`}
              className="min-tap-target absolute top-3 right-3 p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="p-3">
          <span className="text-xs font-bold text-[#E32636] uppercase tracking-wider block mb-1">
            {item.slotName}
          </span>
          <p className="text-xs text-neutral-300 line-clamp-2">
            {item.caption || item.alt}
          </p>
        </div>
      </div>
    );
  };

  const renderLightbox = (item: ProductImageItem) => {
    return (
      <div className="flex flex-col items-center max-w-3xl w-full">
        <div className="w-full max-h-[70vh] rounded-2xl overflow-hidden bg-black flex items-center justify-center p-2">
          {item.url ? (
            <img
              src={item.url}
              alt={item.alt}
              className="max-h-[65vh] w-auto object-contain rounded-xl"
            />
          ) : (
            <div className="p-12 text-center text-neutral-400">
              <span className="text-sm font-semibold text-white block mb-2">{item.slotName}</span>
              <span className="text-xs font-mono">Product photo placeholder: replace in site.ts</span>
            </div>
          )}
        </div>
        <div className="mt-3 text-center">
          <span className="text-sm font-bold text-white block">{item.slotName}</span>
          <p className="text-xs text-neutral-300 mt-1">{item.caption || item.alt}</p>
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 lg:py-20 bg-[#0B0B0D] text-white border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
            Designed for Automotive Fuel Delivery
          </h2>
          <p className="text-sm text-neutral-400">
            Swipe or use arrow controls to examine component packaging, cylindrical pump body, wiring connector, and strainer assembly.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <ReusableCarousel<ProductImageItem>
            items={images}
            renderItem={renderSlide}
            renderLightboxContent={renderLightbox}
            enableLightbox={true}
            ariaLabel="Automotive Fuel Pump Gallery"
          />
        </div>
      </div>
    </section>
  );
};
