import { siteConfig, ReviewScreenshotItem } from '../config/site';

export interface StoredReviewScreenshot {
  id: string;
  url: string; // Base64 data URL
  caption?: string;
  uploadedAt: string;
}

export interface AdminStoreData {
  reviewScreenshots: StoredReviewScreenshot[];
  singlePrice: number;
  doublePrice: number;
  videoUrl: string | null;
  whatsappNumber: string;
}

const STORAGE_KEY = 'frankblaise_seller_admin_data';
const EVENT_NAME = 'frankblaise_admin_data_changed';

export function getAdminData(): AdminStoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        reviewScreenshots: [],
        singlePrice: siteConfig.prices.singlePump,
        doublePrice: siteConfig.prices.doublePump,
        videoUrl: siteConfig.video.url,
        whatsappNumber: siteConfig.whatsappNumber,
      };
    }
    const parsed = JSON.parse(raw);
    return {
      reviewScreenshots: Array.isArray(parsed.reviewScreenshots) ? parsed.reviewScreenshots : [],
      singlePrice: typeof parsed.singlePrice === 'number' ? parsed.singlePrice : siteConfig.prices.singlePump,
      doublePrice: typeof parsed.doublePrice === 'number' ? parsed.doublePrice : siteConfig.prices.doublePump,
      videoUrl: parsed.videoUrl !== undefined ? parsed.videoUrl : siteConfig.video.url,
      whatsappNumber:
        typeof parsed.whatsappNumber === 'string' && parsed.whatsappNumber.trim() !== ''
          ? parsed.whatsappNumber
          : siteConfig.whatsappNumber,
    };
  } catch (err) {
    return {
      reviewScreenshots: [],
      singlePrice: siteConfig.prices.singlePump,
      doublePrice: siteConfig.prices.doublePump,
      videoUrl: siteConfig.video.url,
      whatsappNumber: siteConfig.whatsappNumber,
    };
  }
}

export function saveAdminData(data: Partial<AdminStoreData>): AdminStoreData {
  const current = getAdminData();
  const updated: AdminStoreData = { ...current, ...data };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
  } catch (err) {
    console.error('Failed to save admin data to localStorage:', err);
  }
  return updated;
}

export function addReviewScreenshot(base64Url: string, caption?: string): StoredReviewScreenshot {
  const current = getAdminData();
  const newItem: StoredReviewScreenshot = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    url: base64Url,
    caption: caption || undefined,
    uploadedAt: new Date().toISOString(),
  };

  const updatedScreenshots = [newItem, ...current.reviewScreenshots];
  saveAdminData({ reviewScreenshots: updatedScreenshots });
  return newItem;
}

export function removeReviewScreenshot(id: string): void {
  const current = getAdminData();
  const filtered = current.reviewScreenshots.filter((item) => item.id !== id);
  saveAdminData({ reviewScreenshots: filtered });
}

export function resetAdminData(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(
    new CustomEvent(EVENT_NAME, {
      detail: {
        reviewScreenshots: [],
        singlePrice: siteConfig.prices.singlePump,
        doublePrice: siteConfig.prices.doublePump,
        videoUrl: siteConfig.video.url,
        whatsappNumber: siteConfig.whatsappNumber,
      },
    })
  );
}

/**
 * Compress image on client side to preserve local storage limits
 */
export async function compressImageToDataUrl(file: File, maxDim = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export { EVENT_NAME };
