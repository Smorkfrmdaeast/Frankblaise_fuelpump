import React from 'react';
import { siteConfig, ReviewScreenshotItem } from '../config/site';
import { useAdminData } from '../hooks/useAdminData';
import { ReusableCarousel } from './ReusableCarousel';
import { MessageSquare, MessageCircle, Maximize2, UploadCloud } from 'lucide-react';

interface CustomerExperiencesSectionProps {
  onOpenAdminPortal?: () => void;
}

export const CustomerExperiencesSection: React.FC<CustomerExperiencesSectionProps> = ({
  onOpenAdminPortal,
}) => {
  const adminData = useAdminData();

  // Prefer uploaded screenshots from admin storage if available, otherwise siteConfig
  const activeScreenshots: ReviewScreenshotItem[] =
    adminData.reviewScreenshots.length > 0
      ? adminData.reviewScreenshots.map((item) => ({
          id: item.id,
          url: item.url,
          caption: item.caption,
        }))
      : siteConfig.reviewScreenshots.length > 0
      ? siteConfig.reviewScreenshots
      : [
          { id: 'rev-ph-1', url: null, caption: 'Customer WhatsApp conversation 1' },
          { id: 'rev-ph-2', url: null, caption: 'Customer WhatsApp conversation 2' },
          { id: 'rev-ph-3', url: null, caption: 'Customer WhatsApp conversation 3' },
        ];

  const hasUploadedReviews = adminData.reviewScreenshots.length > 0 || siteConfig.reviewScreenshots.length > 0;
  const currentWhatsApp = adminData.whatsappNumber || siteConfig.whatsappNumber;
  const hasWhatsApp = Boolean(currentWhatsApp && currentWhatsApp.trim() !== '');

  const renderReviewSlide = (item: ReviewScreenshotItem, index: number, openLightbox?: (index: number) => void) => {
    return (
      <div className="bg-[#151518] rounded-2xl p-4 border border-neutral-800 text-white flex flex-col justify-between h-full">
        {item.url ? (
          <div className="relative aspect-[3/4] sm:aspect-[9/16] max-h-[460px] rounded-xl overflow-hidden bg-black flex items-center justify-center group">
            <img
              src={item.url}
              alt="Genuine WhatsApp customer review screenshot"
              className="w-full h-full object-contain"
            />
            {openLightbox && (
              <button
                type="button"
                onClick={() => openLightbox(index)}
                aria-label="Enlarge review screenshot"
                className="min-tap-target absolute top-2 right-2 p-2 rounded-lg bg-black/70 hover:bg-black text-white cursor-pointer transition-colors shadow"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="aspect-[4/3] rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-neutral-800 text-neutral-500 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-neutral-300 max-w-xs">
              Insert genuine customer review screenshot.
            </span>
            <span className="text-[11px] text-neutral-500">
              Redact customer personal contact info before uploading.
            </span>

            {onOpenAdminPortal && (
              <button
                type="button"
                onClick={onOpenAdminPortal}
                className="mt-2 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] font-semibold text-[#E32636] border border-neutral-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload as Seller</span>
              </button>
            )}
          </div>
        )}

        {item.caption && (
          <div className="mt-3 text-center">
            <span className="text-xs text-neutral-300 font-medium">{item.caption}</span>
          </div>
        )}
      </div>
    );
  };

  const renderLightbox = (item: ReviewScreenshotItem) => {
    return (
      <div className="flex flex-col items-center max-w-lg w-full">
        <div className="w-full max-h-[75vh] rounded-2xl overflow-hidden bg-black flex items-center justify-center p-2">
          {item.url && (
            <img
              src={item.url}
              alt={item.caption || 'Customer review screenshot enlarged'}
              className="max-h-[70vh] w-auto object-contain rounded-xl"
            />
          )}
        </div>
        {item.caption && (
          <div className="mt-3 text-center text-white text-xs font-semibold">
            {item.caption}
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="reviews" className="py-16 lg:py-20 bg-[#0B0B0D] text-white border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
              Customer Experiences
            </h2>
            {onOpenAdminPortal && (
              <button
                onClick={onOpenAdminPortal}
                title="Seller Review Upload Portal"
                className="text-neutral-500 hover:text-[#E32636] transition-colors p-1"
                aria-label="Open seller review upload portal"
              >
                <UploadCloud className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-sm text-neutral-400">
            Genuine customer review screenshots and experiences as supplied by verified buyers.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <ReusableCarousel<ReviewScreenshotItem>
            items={activeScreenshots}
            renderItem={renderReviewSlide}
            renderLightboxContent={renderLightbox}
            enableLightbox={hasUploadedReviews}
            ariaLabel="Customer Review Screenshots"
          />
        </div>

        {/* Contact seller note below */}
        <div className="mt-12 text-center space-y-3">
          <p className="text-sm text-neutral-300">
            Have questions about the product? Contact the seller for more information.
          </p>

          {hasWhatsApp && (
            <div>
              <a
                href={`https://wa.me/${currentWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  'Hello FRANKBLAISE PARTS, I would like to ask a few questions about customer reviews and compatibility for the Electric Fuel Pump Plus.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-tap-target inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact Seller on WhatsApp ({currentWhatsApp})</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
