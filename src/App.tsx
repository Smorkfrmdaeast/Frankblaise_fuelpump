import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { EngineeringBreakdownSection } from './components/EngineeringBreakdownSection';
import { SpecificationsSection } from './components/SpecificationsSection';
import { ProductGallerySection } from './components/ProductGallerySection';
import { ProductVideoSection } from './components/ProductVideoSection';
import { PackagesSection, PackageSelection } from './components/PackagesSection';
import { CompatibilitySection } from './components/CompatibilitySection';
import { CustomerExperiencesSection } from './components/CustomerExperiencesSection';
import { DeliveryAndPaymentSection } from './components/DeliveryAndPaymentSection';
import { OrderFormSection } from './components/OrderFormSection';
import { FooterSection } from './components/FooterSection';
import { FloatingElements } from './components/FloatingElements';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [selectedPackage, setSelectedPackage] = useState<PackageSelection>('single');
  const [isAdminView, setIsAdminView] = useState(() => {
    return (
      window.location.hash === '#admin' ||
      window.location.pathname.startsWith('/admin')
    );
  });

  // Listen to hash changes for #admin navigation
  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(
        window.location.hash === '#admin' ||
        window.location.pathname.startsWith('/admin')
      );
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openAdmin = () => {
    window.location.hash = 'admin';
    setIsAdminView(true);
  };

  const closeAdmin = () => {
    window.location.hash = '';
    setIsAdminView(false);
  };

  const scrollToOrderForm = () => {
    const element = document.getElementById('order-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSpecifications = () => {
    const element = document.getElementById('specifications');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Render Admin Console when in admin route
  if (isAdminView) {
    return <AdminDashboard onBackToSite={closeAdmin} />;
  }

  return (
    <div id="top" className="min-h-screen bg-[#F6F4EF] text-[#1B1C1F] flex flex-col font-sans selection:bg-[#B51222] selection:text-white">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#order-form"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#B51222] focus:text-white focus:font-mono focus:text-xs focus:rounded focus:outline-none"
      >
        Skip to Order Terminal
      </a>

      {/* 1. ANNOUNCEMENT BAR */}
      <AnnouncementBar />

      {/* 2. TOP NAVIGATION BAR */}
      <Header onOrderClick={scrollToOrderForm} />

      {/* MAIN TECHNICAL PRODUCT CATALOGUE */}
      <main className="flex-1">
        {/* 3. HERO (Dominant Genuine Photo & Technical Proposition) */}
        <HeroSection
          onOrderClick={scrollToOrderForm}
          onExploreClick={scrollToSpecifications}
        />

        {/* 4. SECTION 02: ENGINEERING BREAKDOWN & DIAGRAM */}
        <EngineeringBreakdownSection />

        {/* 5. SECTION 03: VERIFIED SPECIFICATIONS SHEET & FAQS */}
        <SpecificationsSection />

        {/* 6. SECTION 04: PRODUCT VERIFICATION GALLERY (Lightbox & Zoom) */}
        <ProductGallerySection />

        {/* 7. SECTION 05: BENCH VIDEO DEMONSTRATION */}
        <ProductVideoSection onOrderClick={scrollToOrderForm} />

        {/* 8. SECTION 06: COMMERCIAL PACKAGES */}
        <PackagesSection
          selectedPackage={selectedPackage}
          onSelectPackage={setSelectedPackage}
          onScrollToForm={scrollToOrderForm}
        />

        {/* 9. SECTION 07: FITMENT & COMPATIBILITY PROTOCOL */}
        <CompatibilitySection onScrollToForm={scrollToOrderForm} />

        {/* 10. SECTION 08: VERIFIED BUYER EXPERIENCES (Hidden if 0 exist) */}
        <CustomerExperiencesSection />

        {/* 11. SECTION 09: LOGISTICS & PAYMENT PROTOCOL */}
        <DeliveryAndPaymentSection />

        {/* 12. SECTION 10: VEHICLE VERIFICATION ORDER TERMINAL */}
        <OrderFormSection
          selectedPackage={selectedPackage}
          onSelectPackage={setSelectedPackage}
        />
      </main>

      {/* 13. TECHNICAL FOOTER WITH ADMIN PORTAL LINK */}
      <FooterSection onOpenAdmin={openAdmin} />

      {/* 14. FLOATING ELEMENTS (WhatsApp action & Mobile sticky order bar) */}
      <FloatingElements
        selectedPackage={selectedPackage}
        onOrderClick={scrollToOrderForm}
      />
    </div>
  );
}
