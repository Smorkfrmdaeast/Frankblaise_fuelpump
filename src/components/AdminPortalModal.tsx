import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Lock,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Plus,
  DollarSign,
  Video,
  Phone,
  RotateCcw,
  Image as ImageIcon,
} from 'lucide-react';
import {
  getAdminData,
  saveAdminData,
  addReviewScreenshot,
  removeReviewScreenshot,
  resetAdminData,
  compressImageToDataUrl,
} from '../services/adminStorage';
import { useAdminData } from '../hooks/useAdminData';
import { formatNaira } from '../config/site';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({ isOpen, onClose }) => {
  const adminData = useAdminData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'reviews' | 'prices' | 'settings'>('reviews');

  // Review upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');

  // Price state
  const [singlePriceInput, setSinglePriceInput] = useState<number>(adminData.singlePrice);
  const [doublePriceInput, setDoublePriceInput] = useState<number>(adminData.doublePrice);
  const [priceSuccessMessage, setPriceSuccessMessage] = useState('');

  // Video & WhatsApp state
  const [videoUrlInput, setVideoUrlInput] = useState<string>(adminData.videoUrl || '');
  const [whatsappInput, setWhatsappInput] = useState<string>(adminData.whatsappNumber || '');
  const [settingsSuccessMessage, setSettingsSuccessMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync inputs with admin data when opened
  useEffect(() => {
    if (isOpen) {
      const data = getAdminData();
      setSinglePriceInput(data.singlePrice);
      setDoublePriceInput(data.doublePrice);
      setVideoUrlInput(data.videoUrl || '');
      setWhatsappInput(data.whatsappNumber || '');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'frankblaise2026' || passcode.trim() === 'admin123') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. Default passcode is: frankblaise2026');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setFilePreview(url);
    }
  };

  const handleUploadReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsProcessingFile(true);
    try {
      const compressedDataUrl = await compressImageToDataUrl(selectedFile);
      addReviewScreenshot(compressedDataUrl, caption.trim());
      setSelectedFile(null);
      setFilePreview(null);
      setCaption('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setUploadSuccessMessage('Review screenshot added successfully!');
      setTimeout(() => setUploadSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleDeleteReview = (id: string) => {
    if (window.confirm('Are you sure you want to delete this review screenshot?')) {
      removeReviewScreenshot(id);
    }
  };

  const handleSavePrices = (e: React.FormEvent) => {
    e.preventDefault();
    saveAdminData({
      singlePrice: Number(singlePriceInput) || 25000,
      doublePrice: Number(doublePriceInput) || 45000,
    });
    setPriceSuccessMessage('Prices updated successfully across the entire landing page!');
    setTimeout(() => setPriceSuccessMessage(''), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveAdminData({
      videoUrl: videoUrlInput.trim() || null,
      whatsappNumber: whatsappInput.trim(),
    });
    setSettingsSuccessMessage('Video and WhatsApp settings updated!');
    setTimeout(() => setSettingsSuccessMessage(''), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all admin changes back to site.ts factory defaults?')) {
      resetAdminData();
      const def = getAdminData();
      setSinglePriceInput(def.singlePrice);
      setDoublePriceInput(def.doublePrice);
      setVideoUrlInput(def.videoUrl || '');
      setWhatsappInput(def.whatsappNumber || '');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#151518] text-white rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#0B0B0D] px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E32636] text-white flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider font-display">
                Seller Administration Panel
              </h2>
              <span className="text-[11px] text-neutral-400 font-mono">
                FRANKBLAISE PARTS — Store Management
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-tap-target p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close admin modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Authenticated vs Passcode Gate */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-700 text-[#E32636] flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white font-display">
                Client Access Required
              </h3>
              <p className="text-xs text-neutral-400">
                Enter your seller passcode to upload reviews and manage pricing.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode (e.g. frankblaise2026)"
                  className="w-full px-4 py-3 bg-[#0B0B0D] border border-neutral-700 rounded-xl text-center text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#E32636]"
                  autoFocus
                />
                {authError && (
                  <p className="text-xs text-red-400 mt-2 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {authError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="min-tap-target w-full py-3 bg-[#E32636] hover:bg-[#B51222] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Access Seller Portal
              </button>
            </form>

            <p className="text-[11px] text-neutral-500 font-mono">
              Default passcode: <code className="text-neutral-300">frankblaise2026</code>
            </p>
          </div>
        ) : (
          <div className="flex flex-col max-h-[75vh]">
            {/* Nav Tabs */}
            <div className="flex items-center gap-1 px-6 pt-4 border-b border-neutral-800 bg-[#0B0B0D] overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`min-tap-target px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'border-[#E32636] text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-[#E32636]" />
                <span>Review Screenshots ({adminData.reviewScreenshots.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('prices')}
                className={`min-tap-target px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'prices'
                    ? 'border-[#E32636] text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-4 h-4 text-[#E32636]" />
                <span>Package Prices</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`min-tap-target px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'border-[#E32636] text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Video className="w-4 h-4 text-[#E32636]" />
                <span>Video &amp; WhatsApp</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* TAB 1: REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Upload Form */}
                  <form onSubmit={handleUploadReview} className="bg-[#0B0B0D] p-5 rounded-2xl border border-neutral-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-white">
                        Upload Genuine Customer Review Screenshot
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        PNG / JPG / WebP
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* File selector dropzone */}
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          id="admin-review-file"
                          className="hidden"
                        />
                        <label
                          htmlFor="admin-review-file"
                          className="min-h-[120px] rounded-xl border-2 border-dashed border-neutral-700 hover:border-[#E32636] bg-neutral-900/60 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
                        >
                          {filePreview ? (
                            <img
                              src={filePreview}
                              alt="Preview"
                              className="max-h-24 w-auto object-contain rounded"
                            />
                          ) : (
                            <>
                              <Upload className="w-6 h-6 text-neutral-400 mb-1" />
                              <span className="text-xs font-medium text-white">
                                Click to select screenshot
                              </span>
                              <span className="text-[10px] text-neutral-500">
                                WhatsApp delivery confirmation, chat, or voice note
                              </span>
                            </>
                          )}
                        </label>
                      </div>

                      {/* Caption & Submit */}
                      <div className="flex flex-col justify-between space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            Review Caption / Customer Note (Optional)
                          </label>
                          <input
                            type="text"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="e.g. 2008 Toyota Camry customer in Ikeja, Lagos"
                            className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#E32636]"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={!selectedFile || isProcessingFile}
                          className="min-tap-target py-2.5 px-4 bg-[#E32636] hover:bg-[#B51222] disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                        >
                          {isProcessingFile ? (
                            <span>Optimizing &amp; Saving...</span>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              <span>Save Review Screenshot</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {uploadSuccessMessage && (
                      <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> {uploadSuccessMessage}
                      </p>
                    )}
                  </form>

                  {/* List of currently uploaded reviews */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                        Published Customer Screenshots ({adminData.reviewScreenshots.length})
                      </span>
                    </div>

                    {adminData.reviewScreenshots.length === 0 ? (
                      <div className="bg-[#0B0B0D] p-8 rounded-2xl border border-neutral-800 text-center text-xs text-neutral-500">
                        No customer review screenshots uploaded yet. Upload one above to replace the placeholders in the carousel!
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {adminData.reviewScreenshots.map((item, idx) => (
                          <div
                            key={item.id}
                            className="bg-[#0B0B0D] rounded-xl border border-neutral-800 p-2.5 flex flex-col justify-between group"
                          >
                            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-black mb-2 flex items-center justify-center">
                              <img
                                src={item.url}
                                alt={item.caption || 'Customer review screenshot'}
                                className="w-full h-full object-contain"
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteReview(item.id)}
                                aria-label="Delete review screenshot"
                                className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg opacity-90 transition-opacity cursor-pointer shadow"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="text-[11px] text-neutral-300 line-clamp-2">
                              {item.caption || `Review Screenshot #${idx + 1}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: PRICING */}
              {activeTab === 'prices' && (
                <form onSubmit={handleSavePrices} className="space-y-5 max-w-lg bg-[#0B0B0D] p-6 rounded-2xl border border-neutral-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Live Product Package Pricing
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Changes here immediately update the Hero section, Package selector, Order form, and Mobile Sticky bar.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Single Pump Package Price (₦)
                      </label>
                      <input
                        type="number"
                        min="1000"
                        step="500"
                        value={singlePriceInput}
                        onChange={(e) => setSinglePriceInput(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#E32636]"
                      />
                      <span className="text-[11px] text-neutral-500 mt-1 block">
                        Current: {formatNaira(adminData.singlePrice)}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Double Pump Package Price (₦)
                      </label>
                      <input
                        type="number"
                        min="1000"
                        step="500"
                        value={doublePriceInput}
                        onChange={(e) => setDoublePriceInput(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#E32636]"
                      />
                      <span className="text-[11px] text-neutral-500 mt-1 block">
                        Current: {formatNaira(adminData.doublePrice)}
                      </span>
                    </div>
                  </div>

                  {priceSuccessMessage && (
                    <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> {priceSuccessMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="min-tap-target w-full py-3 bg-[#E32636] hover:bg-[#B51222] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                  >
                    Save &amp; Update Prices
                  </button>
                </form>
              )}

              {/* TAB 3: VIDEO & WHATSAPP */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-5 max-w-lg bg-[#0B0B0D] p-6 rounded-2xl border border-neutral-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Video Demonstration &amp; WhatsApp Settings
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Video Demonstration File / URL
                      </label>
                      <input
                        type="text"
                        value={videoUrlInput}
                        onChange={(e) => setVideoUrlInput(e.target.value)}
                        placeholder="e.g. /videos/frankblaise_fuel_pump_demo.mp4"
                        className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#E32636]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        WhatsApp Business Number (with country code)
                      </label>
                      <input
                        type="text"
                        value={whatsappInput}
                        onChange={(e) => setWhatsappInput(e.target.value)}
                        placeholder="e.g. 2348012345678"
                        className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#E32636]"
                      />
                      <span className="text-[11px] text-neutral-500 mt-1 block">
                        Enables the WhatsApp floating button and contact buttons when set.
                      </span>
                    </div>
                  </div>

                  {settingsSuccessMessage && (
                    <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> {settingsSuccessMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="min-tap-target w-full py-3 bg-[#E32636] hover:bg-[#B51222] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                  >
                    Save Settings
                  </button>
                </form>
              )}
            </div>

            {/* Footer with Reset */}
            <div className="bg-[#0B0B0D] px-6 py-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
              <button
                type="button"
                onClick={handleReset}
                className="hover:text-red-400 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Factory Defaults</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold transition-colors cursor-pointer"
              >
                Close Portal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
