import React, { useState } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { BenefitCards } from './components/BenefitCards';
import { ProblemSection } from './components/ProblemSection';
import { ProductVideoSection } from './components/ProductVideoSection';
import { ProductGallerySection } from './components/ProductGallerySection';
import { SpecificationsSection } from './components/SpecificationsSection';
import { FuelSystemDiagram } from './components/FuelSystemDiagram';
import { WarrantyInfoSection } from './components/WarrantyInfoSection';
import { CustomerExperiencesSection } from './components/CustomerExperiencesSection';
import { PackagesSection, PackageSelection } from './components/PackagesSection';
import { DeliveryAndPaymentSection } from './components/DeliveryAndPaymentSection';
import { OrderFormSection } from './components/OrderFormSection';
import { FinalCTASection } from './components/FinalCTASection';
import { FooterSection } from './components/FooterSection';
import { FloatingElements } from './components/FloatingElements';
import { AdminPortalModal } from './components/AdminPortalModal';

export default function App() {
  const [selectedPackage, setSelectedPackage] = useState<PackageSelection>('single');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const scrollToOrderForm = () => {
    const element = document.getElementById('order-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCompatibility = () => {
    const element = document.getElementById('specifications');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="top" className="min-h-screen bg-[#0B0B0D] text-white flex flex-col font-sans selection:bg-[#E32636] selection:text-white">
      {/* 1. ANNOUNCEMENT BAR */}
      <AnnouncementBar />

      {/* 2. HEADER */}
      <Header onOrderClick={scrollToOrderForm} />

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {/* 3. HERO (dark) */}
        <HeroSection
          onOrderClick={scrollToOrderForm}
          onCheckCompatibility={scrollToCompatibility}
        />

        {/* 4. BENEFIT CARDS */}
        <BenefitCards />

        {/* 5. PROBLEM SECTION */}
        <ProblemSection />

        {/* 6. PRODUCT VIDEO */}
        <ProductVideoSection onOrderClick={scrollToOrderForm} />

        {/* 7. PRODUCT GALLERY */}
        <ProductGallerySection />

        {/* 8. SPECIFICATIONS */}
        <SpecificationsSection />

        {/* 9. FUEL SYSTEM DIAGRAM */}
        <FuelSystemDiagram />

        {/* 10. WARRANTY */}
        <WarrantyInfoSection />

        {/* 11. CUSTOMER EXPERIENCES */}
        <CustomerExperiencesSection onOpenAdminPortal={() => setIsAdminOpen(true)} />

        {/* 12. PACKAGES */}
        <PackagesSection
          selectedPackage={selectedPackage}
          onSelectPackage={setSelectedPackage}
          onScrollToForm={scrollToOrderForm}
        />

        {/* 13. DELIVERY AND PAYMENT */}
        <DeliveryAndPaymentSection />

        {/* 14. ORDER FORM */}
        <OrderFormSection
          selectedPackage={selectedPackage}
          onSelectPackage={setSelectedPackage}
        />

        {/* 15. FINAL CTA */}
        <FinalCTASection onOrderClick={scrollToOrderForm} />
      </main>

      {/* 16. FOOTER */}
      <FooterSection onOpenAdminPortal={() => setIsAdminOpen(true)} />

      {/* FLOATING ELEMENTS (WhatsApp button if configured, Sticky bottom bar on mobile) */}
      <FloatingElements
        selectedPackage={selectedPackage}
        onOrderClick={scrollToOrderForm}
      />

      {/* SELLER ADMIN PORTAL MODAL */}
      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
