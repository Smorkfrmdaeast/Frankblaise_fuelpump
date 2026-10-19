import React, { useState, useEffect } from 'react';
import { useProductConfig } from '../hooks/useProductConfig';
import {
  getStoredOrders,
  updateOrderStatusInBackend,
  saveAuthoritativeProductConfig,
  exportOrdersToCSV,
} from '../services/firebase';
import {
  getOwnerProfile,
  setupOwnerProfile,
  verifyOwnerLogin,
  getOwnerSession,
  clearOwnerSession,
  updateOwnerCredentials,
  resetOwnerProfile,
  OwnerProfile,
} from '../services/ownerAuth';
import { OrderRecord, OrderStatus } from '../types/product';
import { formatNaira } from '../config/site';
import {
  ArrowLeft,
  Lock,
  Search,
  Download,
  CheckCircle2,
  AlertCircle,
  Package,
  Trash2,
  RefreshCw,
  LogOut,
  UserCheck,
  KeyRound,
  ShieldCheck,
  Settings,
  MessageCircle,
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite }) => {
  const config = useProductConfig();

  // Owner Profile & Session State
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile | null>(getOwnerProfile());
  const [session, setSession] = useState(getOwnerSession());

  // Setup Wizard Form State (First visit)
  const [setupEmail, setSetupEmail] = useState('');
  const [setupPin, setSetupPin] = useState('');
  const [setupWhatsapp, setSetupWhatsapp] = useState(config.whatsappNumber || '+234 706 540 0645');
  const [setupError, setSetupError] = useState('');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab: 'orders' | 'product' | 'reviews' | 'settings'
  const [activeTab, setActiveTab] = useState<'orders' | 'product' | 'reviews' | 'settings'>('orders');

  // Orders State
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orderActionMessage, setOrderActionMessage] = useState('');

  // Product & Pricing State
  const [singlePrice, setSinglePrice] = useState<number>(config.prices.singlePump);
  const [doublePrice, setDoublePrice] = useState<number>(config.prices.doublePump);
  const [productHeadline, setProductHeadline] = useState(config.headline);
  const [factualOverview, setFactualOverview] = useState(config.factualOverview);
  const [whatsappNumber, setWhatsappNumber] = useState(config.whatsappNumber);
  const [videoUrl, setVideoUrl] = useState(config.video.url || '');
  const [materialSpec, setMaterialSpec] = useState(config.specs.material || '');
  const [voltageSpec, setVoltageSpec] = useState(config.specs.operatingVoltage || '');
  const [warrantySpec, setWarrantySpec] = useState(config.specs.warranty || '');
  const [packageContentsSpec, setPackageContentsSpec] = useState(config.specs.packageContents || '');
  const [deliveryNotes, setDeliveryNotes] = useState(config.delivery.deliveryNotes || '');
  const [isFreeDelivery, setIsFreeDelivery] = useState(config.delivery.isFreeDeliveryConfirmed);
  const [isPayOnDelivery, setIsPayOnDelivery] = useState(config.delivery.isPayOnDeliveryConfirmed);
  const [isPublished, setIsPublished] = useState(config.published);
  const [productSaveSuccess, setProductSaveSuccess] = useState('');

  // Review Upload State
  const [reviewCaption, setReviewCaption] = useState('');
  const [reviewFileBase64, setReviewFileBase64] = useState<string | null>(null);
  const [reviewUploadSuccess, setReviewUploadSuccess] = useState('');

  // Settings Credentials Update State
  const [newEmailInput, setNewEmailInput] = useState(ownerProfile?.email || '');
  const [newPinInput, setNewPinInput] = useState(ownerProfile?.pin || '');
  const [newWhatsappInput, setNewWhatsappInput] = useState(ownerProfile?.whatsappNumber || '');
  const [settingsUpdateMessage, setSettingsUpdateMessage] = useState('');

  // Refresh orders
  const refreshOrders = () => {
    setOrders(getStoredOrders());
  };

  useEffect(() => {
    refreshOrders();
    const handleOrdersUpdated = () => refreshOrders();
    window.addEventListener('frankblaise_orders_updated', handleOrdersUpdated);
    return () => window.removeEventListener('frankblaise_orders_updated', handleOrdersUpdated);
  }, []);

  // Sync state when config updates
  useEffect(() => {
    setSinglePrice(config.prices.singlePump);
    setDoublePrice(config.prices.doublePump);
    setProductHeadline(config.headline);
    setFactualOverview(config.factualOverview);
    setWhatsappNumber(config.whatsappNumber);
    setVideoUrl(config.video.url || '');
    setMaterialSpec(config.specs.material || '');
    setVoltageSpec(config.specs.operatingVoltage || '');
    setWarrantySpec(config.specs.warranty || '');
    setPackageContentsSpec(config.specs.packageContents || '');
    setDeliveryNotes(config.delivery.deliveryNotes || '');
    setIsFreeDelivery(config.delivery.isFreeDeliveryConfirmed);
    setIsPayOnDelivery(config.delivery.isPayOnDeliveryConfirmed);
    setIsPublished(config.published);
  }, [config]);

  // First-time owner setup submission
  const handleCompleteSetup = (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError('');

    const cleanEmail = setupEmail.trim().toLowerCase();
    const cleanPin = setupPin.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setSetupError('Please enter a valid business email address.');
      return;
    }

    if (!cleanPin || cleanPin.length < 4) {
      setSetupError('Please create a security PIN of at least 4 digits or characters.');
      return;
    }

    const created = setupOwnerProfile(cleanEmail, cleanPin, setupWhatsapp);
    setOwnerProfile(created);
    setSession(getOwnerSession());
    setNewEmailInput(created.email);
    setNewPinInput(created.pin);
    setNewWhatsappInput(created.whatsappNumber);

    // Also sync the owner's WhatsApp alert number to the public store config
    saveAuthoritativeProductConfig({ whatsappNumber: created.whatsappNumber });
  };

  // Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const result = verifyOwnerLogin(loginEmail, loginPin);
    if (result.success) {
      setSession(getOwnerSession());
      setLoginEmail('');
      setLoginPin('');
    } else {
      setLoginError(result.error || 'Invalid credentials.');
    }
  };

  const handleLogout = () => {
    clearOwnerSession();
    setSession(null);
  };

  const handleResetOwner = () => {
    if (
      window.confirm(
        'Are you sure you want to reset the store owner profile? You or your client will need to complete the first-time setup again.'
      )
    ) {
      resetOwnerProfile();
      setOwnerProfile(null);
      setSession(null);
    }
  };

  // Order status update
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const success = await updateOrderStatusInBackend(orderId, newStatus);
    if (success) {
      setOrderActionMessage(`Order ${orderId} updated to ${newStatus}`);
      setTimeout(() => setOrderActionMessage(''), 3000);
      refreshOrders();
    }
  };

  // CSV export
  const handleExportCSV = () => {
    const csvContent = exportOrdersToCSV(orders);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `frankblaise_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save product changes
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    saveAuthoritativeProductConfig({
      headline: productHeadline.trim(),
      factualOverview: factualOverview.trim(),
      whatsappNumber: whatsappNumber.trim(),
      published: isPublished,
      prices: {
        singlePump: Number(singlePrice) || config.prices.singlePump,
        doublePump: Number(doublePrice) || config.prices.doublePump,
      },
      specs: {
        ...config.specs,
        material: materialSpec.trim() || null,
        operatingVoltage: voltageSpec.trim() || null,
        warranty: warrantySpec.trim() || null,
        packageContents: packageContentsSpec.trim() || null,
      },
      delivery: {
        ...config.delivery,
        isFreeDeliveryConfirmed: isFreeDelivery,
        isPayOnDeliveryConfirmed: isPayOnDelivery,
        deliveryNotes: deliveryNotes.trim() || null,
      },
      video: {
        ...config.video,
        url: videoUrl.trim() || null,
      },
    });

    setProductSaveSuccess('Configuration and prices published successfully!');
    setTimeout(() => setProductSaveSuccess(''), 3500);
  };

  // Handle Review Screenshot Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setReviewFileBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewFileBase64) return;

    const newReview = {
      id: `rev_${Date.now()}`,
      url: reviewFileBase64,
      caption: reviewCaption.trim() || 'Verified buyer feedback',
      verifiedBuyer: true,
      date: new Date().toISOString(),
    };

    const updated = [newReview, ...config.reviewScreenshots];
    saveAuthoritativeProductConfig({ reviewScreenshots: updated });
    setReviewFileBase64(null);
    setReviewCaption('');
    setReviewUploadSuccess('Customer review screenshot added successfully!');
    setTimeout(() => setReviewUploadSuccess(''), 3500);
  };

  const handleDeleteReview = (id: string) => {
    const filtered = config.reviewScreenshots.filter((r) => r.id !== id);
    saveAuthoritativeProductConfig({ reviewScreenshots: filtered });
  };

  // Handle Owner Profile Update
  const handleUpdateOwnerCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newEmailInput.trim().toLowerCase();
    const cleanPin = newPinInput.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!cleanPin || cleanPin.length < 4) {
      alert('PIN must be at least 4 digits or characters.');
      return;
    }

    const updated = updateOwnerCredentials(cleanEmail, cleanPin, newWhatsappInput);
    setOwnerProfile(updated);
    saveAuthoritativeProductConfig({ whatsappNumber: updated.whatsappNumber });
    setSettingsUpdateMessage('Owner credentials and alert number updated successfully!');
    setTimeout(() => setSettingsUpdateMessage(''), 3500);
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const q = orderSearch.toLowerCase();
    const matchesSearch =
      !q ||
      o.orderReference.toLowerCase().includes(q) ||
      o.customer.fullName.toLowerCase().includes(q) ||
      o.customer.primaryPhone.includes(q) ||
      o.vehicle.make.toLowerCase().includes(q) ||
      o.vehicle.model.toLowerCase().includes(q) ||
      o.delivery.state.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  // SCREEN 1: FIRST-TIME OWNER ONBOARDING
  if (!ownerProfile || !ownerProfile.isSetupComplete) {
    return (
      <div className="min-h-screen bg-[#F6F4EF] text-[#1B1C1F] flex flex-col justify-between p-4 sm:p-6 font-sans">
        <header className="max-w-xl mx-auto w-full flex items-center justify-between py-4">
          <button
            onClick={onBackToSite}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#6E7075] hover:text-[#1B1C1F] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Catalog</span>
          </button>
        </header>

        <main className="max-w-lg mx-auto w-full bg-white border border-[#D5D2CB] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm my-auto">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#E9E7E2] text-[#B51222] flex items-center justify-center mx-auto">
              <UserCheck className="w-7 h-7" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B51222] block">
              FIRST-TIME SETUP (CLIENT ONBOARDING)
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-tight text-[#1B1C1F]">
              Register Your Owner Account
            </h1>
            <p className="text-xs sm:text-sm text-[#6E7075] max-w-sm mx-auto leading-relaxed">
              Welcome to your Frankblaise store. Enter your email and create a secret security PIN to protect your order dispatch queue.
            </p>
          </div>

          <form onSubmit={handleCompleteSetup} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1.5">
                Your Business Email <span className="text-[#B51222]">*</span>
              </label>
              <input
                type="email"
                required
                value={setupEmail}
                onChange={(e) => setSetupEmail(e.target.value)}
                placeholder="e.g. yourname@gmail.com or owner@frankblaise.com"
                className="w-full px-4 py-3 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm text-[#1B1C1F] font-mono focus:outline-none focus:ring-2 focus:ring-[#B51222]"
              />
              <span className="text-[11px] text-[#6E7075] mt-1 block">
                This is the email address you will use to log in on future visits.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1.5">
                Create Your Secret Security PIN <span className="text-[#B51222]">*</span>
              </label>
              <input
                type="password"
                required
                value={setupPin}
                onChange={(e) => setSetupPin(e.target.value)}
                placeholder="Enter 4 to 8 digits/characters (e.g. 2026)"
                className="w-full px-4 py-3 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm text-[#1B1C1F] font-mono focus:outline-none focus:ring-2 focus:ring-[#B51222]"
              />
              <span className="text-[11px] text-[#6E7075] mt-1 block">
                Choose a PIN you will remember. You will enter this PIN every time you sign in.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1.5">
                WhatsApp Alert Phone Number <span className="text-[#B51222]">*</span>
              </label>
              <input
                type="text"
                required
                value={setupWhatsapp}
                onChange={(e) => setSetupWhatsapp(e.target.value)}
                placeholder="+234 706 540 0645"
                className="w-full px-4 py-3 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm text-[#1B1C1F] font-mono focus:outline-none focus:ring-2 focus:ring-[#B51222]"
              />
              <span className="text-[11px] text-[#6E7075] mt-1 block">
                Customer orders will be routed immediately to this WhatsApp phone line.
              </span>
            </div>

            {setupError && (
              <p className="text-xs text-[#B51222] font-mono flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" /> {setupError}
              </p>
            )}

            <button
              type="submit"
              className="min-tap-target w-full py-4 bg-[#B51222] hover:bg-[#8F0E1B] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-md"
            >
              COMPLETE SETUP &amp; ENTER DASHBOARD
            </button>
          </form>

          <div className="p-3.5 bg-[#E9E7E2] rounded-xl text-[11px] text-[#6E7075] font-mono space-y-1">
            <span className="font-bold text-[#1B1C1F] block">Zero-Technical Setup:</span>
            <span>No cloud console, developer keys, or complex setup required. Everything is managed directly from your device.</span>
          </div>
        </main>

        <footer className="text-center text-xs font-mono text-[#6E7075] py-4">
          FRANKBLAISE PARTS · Client Administration
        </footer>
      </div>
    );
  }

  // SCREEN 2: OWNER LOGIN (For registered owners when not in active session)
  if (!session) {
    return (
      <div className="min-h-screen bg-[#F6F4EF] text-[#1B1C1F] flex flex-col justify-between p-4 sm:p-6 font-sans">
        <header className="max-w-xl mx-auto w-full flex items-center justify-between py-4">
          <button
            onClick={onBackToSite}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#6E7075] hover:text-[#1B1C1F] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Catalog</span>
          </button>
        </header>

        <main className="max-w-md mx-auto w-full bg-white border border-[#D5D2CB] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm my-auto">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#E9E7E2] text-[#B51222] flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-[#1B1C1F]">
              Owner Portal Sign In
            </h1>
            <p className="text-xs text-[#6E7075] font-mono">
              Registered Owner: <strong className="text-[#1B1C1F]">{ownerProfile.email}</strong>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1.5">
                Owner Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder={ownerProfile.email}
                className="w-full px-4 py-3 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm text-[#1B1C1F] font-mono focus:outline-none focus:ring-2 focus:ring-[#B51222]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1.5">
                Security PIN
              </label>
              <input
                type="password"
                required
                value={loginPin}
                onChange={(e) => setLoginPin(e.target.value)}
                placeholder="Enter your security PIN"
                className="w-full px-4 py-3 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm text-[#1B1C1F] font-mono focus:outline-none focus:ring-2 focus:ring-[#B51222]"
              />
            </div>

            {loginError && (
              <p className="text-xs text-[#B51222] font-mono flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" /> {loginError}
              </p>
            )}

            <button
              type="submit"
              className="min-tap-target w-full py-3.5 bg-[#B51222] hover:bg-[#8F0E1B] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              ACCESS OWNER DASHBOARD
            </button>
          </form>

          <div className="pt-2 text-center border-t border-[#E9E7E2]">
            <button
              type="button"
              onClick={handleResetOwner}
              className="text-xs text-[#6E7075] hover:text-[#B51222] underline cursor-pointer"
            >
              Reset Owner Profile / Re-register
            </button>
          </div>
        </main>

        <footer className="text-center text-xs font-mono text-[#6E7075] py-4">
          FRANKBLAISE PARTS · All Rights Reserved
        </footer>
      </div>
    );
  }

  // SCREEN 3: AUTHENTICATED OWNER DASHBOARD
  return (
    <div className="min-h-screen bg-[#F6F4EF] text-[#1B1C1F] flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-[#D5D2CB] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              type="button"
              className="p-2 rounded-lg bg-[#E9E7E2] hover:bg-[#D5D2CB] text-[#1B1C1F] transition-colors cursor-pointer"
              title="Return to Public Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-base sm:text-lg font-bold font-display uppercase tracking-tight text-[#1B1C1F] block">
                FRANKBLAISE SELLER CONSOLE
              </span>
              <span className="text-[10px] font-mono text-[#6E7075]">
                Owner: <strong className="text-[#1B1C1F]">{ownerProfile.email}</strong> · Alerts: <strong className="text-emerald-700">{ownerProfile.whatsappNumber}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              type="button"
              className="min-tap-target px-3.5 py-2 rounded-lg border border-[#D5D2CB] hover:bg-[#E9E7E2] text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto gap-2 border-t border-[#E9E7E2] text-xs font-mono uppercase tracking-wider py-2">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`min-tap-target px-4 py-2 rounded-lg font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#1B1C1F] text-white'
                : 'text-[#6E7075] hover:text-[#1B1C1F] hover:bg-[#E9E7E2]'
            }`}
          >
            Orders Queue ({orders.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('product')}
            className={`min-tap-target px-4 py-2 rounded-lg font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'product'
                ? 'bg-[#1B1C1F] text-white'
                : 'text-[#6E7075] hover:text-[#1B1C1F] hover:bg-[#E9E7E2]'
            }`}
          >
            Pricing &amp; Specifications
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`min-tap-target px-4 py-2 rounded-lg font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-[#1B1C1F] text-white'
                : 'text-[#6E7075] hover:text-[#1B1C1F] hover:bg-[#E9E7E2]'
            }`}
          >
            Genuine Reviews ({config.reviewScreenshots.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`min-tap-target px-4 py-2 rounded-lg font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#1B1C1F] text-white'
                : 'text-[#6E7075] hover:text-[#1B1C1F] hover:bg-[#E9E7E2]'
            }`}
          >
            Owner Settings
          </button>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* ================= TAB 1: ORDERS ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-display uppercase text-[#1B1C1F]">
                  Customer Orders Queue
                </h2>
                <p className="text-xs text-[#6E7075] font-mono">
                  Orders sorted newest first. Telephone customers to verify vehicle compatibility before dispatch.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={refreshOrders}
                  className="min-tap-target px-3 py-2 bg-white border border-[#D5D2CB] rounded-lg text-xs font-mono text-[#2B2D31] hover:bg-[#E9E7E2] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={orders.length === 0}
                  className="min-tap-target px-4 py-2 bg-[#1B1C1F] hover:bg-[#2B2D31] text-white rounded-lg text-xs font-mono uppercase tracking-wider font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {orderActionMessage && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-mono text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{orderActionMessage}</span>
              </div>
            )}

            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8 relative">
                <Search className="w-4 h-4 text-[#6E7075] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by reference, name, phone, make, model, or state..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D5D2CB] rounded-lg text-xs font-mono text-[#1B1C1F] focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#D5D2CB] rounded-lg text-xs font-mono text-[#1B1C1F] focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                >
                  <option value="all">All Statuses ({orders.length})</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white border border-[#D5D2CB] rounded-2xl p-12 text-center space-y-3">
                <Package className="w-10 h-10 text-[#6E7075] mx-auto" />
                <h3 className="text-base font-bold text-[#1B1C1F] font-display uppercase">
                  No Orders in Queue
                </h3>
                <p className="text-xs text-[#6E7075] font-mono max-w-md mx-auto">
                  {orders.length === 0
                    ? 'Incoming customer orders submitted on the landing page will appear here immediately.'
                    : 'No orders match your search or filter criteria.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-[#D5D2CB] rounded-xl p-5 space-y-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E9E7E2] pb-3 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#1B1C1F]">{order.orderReference}</span>
                        <span className="text-[#6E7075]">·</span>
                        <span>{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#6E7075]">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className="px-2.5 py-1 bg-[#F6F4EF] border border-[#D5D2CB] rounded text-xs font-mono font-bold text-[#1B1C1F] focus:outline-none focus:ring-1 focus:ring-[#B51222]"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                      {/* Customer Info */}
                      <div className="space-y-1">
                        <span className="text-[#6E7075] block uppercase font-bold text-[10px]">CUSTOMER</span>
                        <span className="text-sm font-bold text-[#1B1C1F] block">{order.customer.fullName}</span>
                        <span className="text-[#2B2D31] block">Phone: {order.customer.primaryPhone}</span>
                        {order.customer.altPhone && (
                          <span className="text-[#6E7075] block">Alt: {order.customer.altPhone}</span>
                        )}
                        {order.customer.whatsappPhone && (
                          <span className="text-emerald-700 block">WhatsApp: {order.customer.whatsappPhone}</span>
                        )}
                      </div>

                      {/* Vehicle Fitment Info */}
                      <div className="space-y-1">
                        <span className="text-[#6E7075] block uppercase font-bold text-[10px]">VEHICLE FITMENT</span>
                        <span className="text-sm font-bold text-[#1B1C1F] block">
                          {order.vehicle.make} {order.vehicle.model}
                        </span>
                        <span className="text-[#2B2D31] block">Year: {order.vehicle.productionYear}</span>
                        {order.vehicle.engineSize && (
                          <span className="text-[#6E7075] block">Engine: {order.vehicle.engineSize}</span>
                        )}
                        {order.vehicle.existingPartNumber && (
                          <span className="text-[#6E7075] block">OEM #: {order.vehicle.existingPartNumber}</span>
                        )}
                      </div>

                      {/* Delivery & Package Info */}
                      <div className="space-y-1">
                        <span className="text-[#6E7075] block uppercase font-bold text-[10px]">PACKAGE &amp; DESTINATION</span>
                        <span className="text-sm font-bold text-[#B51222] block">
                          {order.packageName} — {formatNaira(order.productTotal)}
                        </span>
                        <span className="text-[#2B2D31] block">
                          {order.delivery.state}, {order.delivery.cityTown}
                        </span>
                        <span className="text-[#6E7075] block leading-tight">{order.delivery.fullAddress}</span>
                        {order.delivery.nearestLandmark && (
                          <span className="text-[#6E7075] block text-[11px]">Near: {order.delivery.nearestLandmark}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: PRICING & SPECS ================= */}
        {activeTab === 'product' && (
          <form onSubmit={handleSaveProduct} className="max-w-3xl mx-auto space-y-8 bg-white border border-[#D5D2CB] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display uppercase text-[#1B1C1F]">
                Product Specifications &amp; Pricing Editor
              </h2>
              <p className="text-xs text-[#6E7075] font-mono">
                Updates saved here instantly update the live public catalog and recalculate order submission totals.
              </p>
            </div>

            {productSaveSuccess && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-mono text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{productSaveSuccess}</span>
              </div>
            )}

            {/* Live Pricing */}
            <div className="space-y-4 pt-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B51222]">
                1. PACKAGE PRICING (NGN)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1">
                    Single Pump (1 Unit) Price (₦)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={singlePrice}
                    onChange={(e) => setSinglePrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm font-mono text-[#1B1C1F] focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                  />
                  <span className="text-[11px] text-[#6E7075] mt-1 block font-mono">
                    Default: ₦25,000 · Current: {formatNaira(config.prices.singlePump)}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1">
                    Double Pump (2 Units) Price (₦)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={doublePrice}
                    onChange={(e) => setDoublePrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm font-mono text-[#1B1C1F] focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                  />
                  <span className="text-[11px] text-[#6E7075] mt-1 block font-mono">
                    Default: ₦45,000 · Current: {formatNaira(config.prices.doublePump)}
                  </span>
                </div>
              </div>
            </div>

            {/* General Texts */}
            <div className="space-y-4 pt-4 border-t border-[#E9E7E2]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B51222]">
                2. TECHNICAL COPY &amp; HEADLINE
              </span>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1">
                  Product Headline
                </label>
                <input
                  type="text"
                  value={productHeadline}
                  onChange={(e) => setProductHeadline(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm text-[#1B1C1F] focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1">
                  Factual Technical Overview
                </label>
                <textarea
                  rows={3}
                  value={factualOverview}
                  onChange={(e) => setFactualOverview(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm text-[#1B1C1F] focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1">
                    WhatsApp Customer Contact
                  </label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="+234 706 540 0645"
                    className="w-full px-4 py-2.5 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm font-mono text-[#1B1C1F] focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1">
                    Video Demonstration URL
                  </label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="/videos/frankblaise_fuel_pump_demo.mp4"
                    className="w-full px-4 py-2.5 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm font-mono text-[#1B1C1F] focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                  />
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-4 pt-4 border-t border-[#E9E7E2]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B51222]">
                3. SPECIFICATION DATA SHEET
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1">
                    Operating Voltage Spec
                  </label>
                  <input
                    type="text"
                    value={voltageSpec}
                    onChange={(e) => setVoltageSpec(e.target.value)}
                    placeholder="12V DC nominal"
                    className="w-full px-4 py-2.5 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm font-mono text-[#1B1C1F] focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1">
                    Confirmed Warranty Period
                  </label>
                  <input
                    type="text"
                    value={warrantySpec}
                    onChange={(e) => setWarrantySpec(e.target.value)}
                    placeholder="Leave empty to display 'Please confirm with the seller.'"
                    className="w-full px-4 py-2.5 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm font-mono text-[#1B1C1F] focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1">
                  Housing &amp; Internal Materials
                </label>
                <input
                  type="text"
                  value={materialSpec}
                  onChange={(e) => setMaterialSpec(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm text-[#1B1C1F] focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1">
                  Included Package Contents
                </label>
                <textarea
                  rows={2}
                  value={packageContentsSpec}
                  onChange={(e) => setPackageContentsSpec(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm text-[#1B1C1F] focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                />
              </div>
            </div>

            {/* Delivery Terms */}
            <div className="space-y-4 pt-4 border-t border-[#E9E7E2]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B51222]">
                4. DELIVERY &amp; COD POLICY
              </span>

              <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFreeDelivery}
                    onChange={(e) => setIsFreeDelivery(e.target.checked)}
                    className="w-4 h-4 accent-[#B51222]"
                  />
                  <span>Confirm Free Nationwide Delivery</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPayOnDelivery}
                    onChange={(e) => setIsPayOnDelivery(e.target.checked)}
                    className="w-4 h-4 accent-[#B51222]"
                  />
                  <span>Confirm Pay On Delivery (COD)</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1">
                  Delivery Notes &amp; Dispatch Terms
                </label>
                <textarea
                  rows={2}
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm text-[#1B1C1F] focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                />
              </div>
            </div>

            {/* Publish Toggle & Save Button */}
            <div className="pt-4 border-t border-[#E9E7E2] flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 accent-[#B51222]"
                />
                <span className="font-bold">Public Storefront Active</span>
              </label>

              <button
                type="submit"
                className="min-tap-target px-8 py-3 bg-[#B51222] hover:bg-[#8F0E1B] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-md"
              >
                PUBLISH SPECIFICATIONS &amp; PRICES
              </button>
            </div>
          </form>
        )}

        {/* ================= TAB 3: REVIEWS ================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display uppercase text-[#1B1C1F]">
                Customer Review Screenshots
              </h2>
              <p className="text-xs text-[#6E7075] font-mono">
                Only genuine screenshots from verified buyers are permitted. If none exist, the public section remains hidden.
              </p>
            </div>

            {/* Redaction Notice */}
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3 text-xs text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold">Redaction Reminder:</span>
                <p>
                  Before uploading customer chat screenshots, redact customer phone numbers, home addresses, and personal identification to protect customer privacy and comply with data guidelines.
                </p>
              </div>
            </div>

            {reviewUploadSuccess && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-mono text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{reviewUploadSuccess}</span>
              </div>
            )}

            {/* Upload Form */}
            <form onSubmit={handleAddReview} className="bg-white border border-[#D5D2CB] rounded-2xl p-6 space-y-4 shadow-sm">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#B51222] block">
                UPLOAD NEW REVIEW SCREENSHOT
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1">
                    Select Screenshot Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-xs font-mono file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#E9E7E2] file:text-[#1B1C1F] hover:file:bg-[#D5D2CB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1">
                    Caption (e.g. Lagos Customer Feedback)
                  </label>
                  <input
                    type="text"
                    value={reviewCaption}
                    onChange={(e) => setReviewCaption(e.target.value)}
                    placeholder="e.g. Abuja Toyota Corolla buyer feedback"
                    className="w-full px-4 py-2.5 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-xs font-mono text-[#1B1C1F] focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                  />
                </div>
              </div>

              {reviewFileBase64 && (
                <div className="pt-2">
                  <span className="text-[11px] font-mono text-[#6E7075] block mb-1">Preview:</span>
                  <div className="max-w-xs max-h-48 overflow-hidden rounded-lg border border-[#D5D2CB]">
                    <img src={reviewFileBase64} alt="Upload preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!reviewFileBase64}
                className="min-tap-target px-6 py-2.5 bg-[#B51222] hover:bg-[#8F0E1B] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer disabled:opacity-40"
              >
                ADD TO PUBLIC CAROUSEL
              </button>
            </form>

            {/* Existing Uploaded Reviews */}
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1B1C1F] block">
                CURRENT VERIFIED SCREENSHOTS ({config.reviewScreenshots.length})
              </span>

              {config.reviewScreenshots.length === 0 ? (
                <div className="p-8 bg-white border border-[#D5D2CB] rounded-xl text-center text-xs font-mono text-[#6E7075]">
                  No review screenshots have been uploaded yet. The customer evidence section is currently hidden from the public landing page.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {config.reviewScreenshots.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-[#D5D2CB] rounded-xl p-3 flex flex-col justify-between space-y-2 shadow-sm"
                    >
                      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-black flex items-center justify-center">
                        <img src={item.url!} alt={item.caption || 'Review'} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono pt-1">
                        <span className="truncate pr-2">{item.caption || 'Customer feedback'}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(item.id)}
                          className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
                          title="Delete screenshot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 4: OWNER SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display uppercase text-[#1B1C1F]">
                Owner Account &amp; Alert Settings
              </h2>
              <p className="text-xs text-[#6E7075] font-mono">
                Update your login email, change your security PIN, or modify your WhatsApp order alert number.
              </p>
            </div>

            {settingsUpdateMessage && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-mono text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{settingsUpdateMessage}</span>
              </div>
            )}

            <form onSubmit={handleUpdateOwnerCredentials} className="bg-white border border-[#D5D2CB] rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1.5">
                  Owner Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newEmailInput}
                  onChange={(e) => setNewEmailInput(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm text-[#1B1C1F] font-mono focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1.5">
                  Security PIN
                </label>
                <input
                  type="text"
                  required
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm text-[#1B1C1F] font-mono focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                />
                <span className="text-[11px] text-[#6E7075] mt-1 block font-mono">
                  Enter new or existing PIN (minimum 4 characters).
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2B2D31] font-mono mb-1.5">
                  Order Alert WhatsApp Phone
                </label>
                <input
                  type="text"
                  required
                  value={newWhatsappInput}
                  onChange={(e) => setNewWhatsappInput(e.target.value)}
                  placeholder="+234 706 540 0645"
                  className="w-full px-4 py-3 bg-[#F6F4EF] border border-[#D5D2CB] rounded-lg text-sm text-[#1B1C1F] font-mono focus:outline-none focus:ring-2 focus:ring-[#B51222]"
                />
                <span className="text-[11px] text-[#6E7075] mt-1 block font-mono">
                  When customers submit orders, instant WhatsApp notifications route directly to this line.
                </span>
              </div>

              <button
                type="submit"
                className="min-tap-target px-8 py-3 bg-[#B51222] hover:bg-[#8F0E1B] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-md"
              >
                UPDATE CREDENTIALS &amp; ALERT NUMBER
              </button>
            </form>

            <div className="p-4 bg-white border border-red-200 rounded-xl flex items-center justify-between gap-4 text-xs font-mono">
              <div>
                <span className="font-bold text-red-900 block">Factory Reset Owner Profile</span>
                <span className="text-neutral-500">Allows another email to claim store ownership.</span>
              </div>
              <button
                type="button"
                onClick={handleResetOwner}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 rounded-lg font-bold transition-colors cursor-pointer shrink-0"
              >
                Reset Store
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
