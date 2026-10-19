/**
 * Authoritative Single Source of Truth for FRANKBLAISE PARTS
 * Technical Engineering Edition
 * 
 * Rules:
 * - Unconfirmed values are set to null.
 * - Public site renders "Please confirm with the seller." for null items.
 * - Admin flags null fields as "Not set".
 * - Default prices: 1 pump = ₦25,000, 2 pumps = ₦45,000 (Owner must confirm before publishing).
 */

import { AuthoritativeProductConfig, ReviewScreenshotItem } from '../types/product';

export type { ReviewScreenshotItem };

export interface ExtendedSiteConfig extends AuthoritativeProductConfig {
  confirmedWarrantyTerms: string | null;
  confirmedSpecs: AuthoritativeProductConfig['specs'];
}

export const siteConfig: ExtendedSiteConfig = {
  brandName: 'FRANKBLAISE PARTS',
  productName: 'FRANKBLAISE ELECTRIC FUEL PUMP PLUS',
  category: 'Automotive replacement electric fuel pump',
  technicalIdentifier: null, // Only set if confirmed by seller (e.g. OEM part cross-reference)
  
  headline: 'Precision In-Tank Electric Fuel Pump Replacement',
  factualOverview:
    'A high-flow cylindrical electric fuel pump engineered for automotive replacement applications. Constructed with high-density commutator brushes, an enclosed turbine impeller, and an integrated inlet strainer assembly designed to handle standard automotive pump hanger assemblies across Nigerian driving conditions.',

  // SELLER CONTACT (Real verified number)
  whatsappNumber: '+234 706 540 0645',

  // VERIFIED VIDEO ASSET
  video: {
    url: '/videos/frankblaise_fuel_pump_demo.mp4',
    poster: '/images/hero_fuel_pump_plus_1792348147776.jpg',
  },

  // AUTHORITATIVE PACKAGE PRICES
  prices: {
    singlePump: 25000, // ₦25,000 default
    doublePump: 45000, // ₦45,000 default
  },

  // CONFIRMED SPECIFICATIONS
  // Any field with null shows "Please confirm with the seller." on public UI
  specs: {
    productName: 'FRANKBLAISE ELECTRIC FUEL PUMP PLUS',
    category: 'Automotive replacement electric fuel pump',
    material: 'Anodized steel housing, internal copper armature, composite turbine impeller',
    operatingVoltage: '12V DC nominal (Automotive electrical system)',
    dimensions: null, // Pending verified millimeter measurement by seller
    connectorType: '2-Pin spade terminal with submersible wiring pigtail',
    compatibleMakesAndModels: null, // Not universally interchangeable; seller verifies make/model/year before dispatch
    packageContents:
      '1x Electric Fuel Pump Unit, 1x Inlet Filter Strainer Sock, 1x Submersible Rubber Fuel Hose, 2x Stainless Steel Hose Clamps, 1x 2-Pin Wiring Pigtail Harness',
    warranty: null, // Pending confirmed warranty terms by seller
    maxPressure: null,
    flowRate: null,
  },

  // Backwards compatibility alias
  get confirmedSpecs() {
    return this.specs;
  },

  // WARRANTY TERMS
  warrantyTerms: null, // Shows "Please confirm with the seller." until verified
  get confirmedWarrantyTerms() {
    return this.warrantyTerms;
  },

  // DELIVERY AND PAYMENT TERMS
  delivery: {
    isFreeDeliveryConfirmed: true,
    isPayOnDeliveryConfirmed: true,
    deliveryNotes:
      'Pay on delivery and free nationwide shipping are offered subject to dispatch confirmation with the seller. Fuel pump vehicle compatibility is reviewed prior to dispatch.',
    estimatedDispatchWindow: 'Dispatched within 24–48 hours upon telephone order verification.',
  },

  // GENUINE PRODUCT IMAGES (All paths verified against workspace assets)
  productImages: [
    {
      id: 'img-pump',
      slotName: 'Cylindrical Fuel Pump Unit',
      url: '/images/hero_fuel_pump_plus_1792348147776.jpg',
      alt: 'FRANKBLAISE ELECTRIC FUEL PUMP PLUS cylindrical unit showing upper terminal outlet and casing',
      caption: 'Direct-replacement cylindrical automotive fuel pump with dual spade power terminals.',
    },
    {
      id: 'img-accessories',
      slotName: 'Installation Accessories Kit',
      url: '/images/fuel_pump_unboxing_kit_1792348148348.jpg',
      alt: 'Unboxing kit with micron inlet filter strainer, submersible rubber hose, clamp rings, and pigtail harness',
      caption: 'Included accessories kit: high-grade mesh strainer sock, submersible fuel line, hose clamps, and wiring harness.',
    },
    {
      id: 'img-cutaway',
      slotName: 'Internal Engineering Diagram',
      url: '/images/fuel_pump_cutaway_diagram_1792348149087.jpg',
      alt: 'Cross-section engineering cutaway diagram illustrating armature coil, check valve, and turbine pumping stage',
      caption: 'Mechanical cutaway view showing balanced motor armature, check valve, and turbine pumping chamber.',
    },
    {
      id: 'img-installation',
      slotName: 'In-Tank Hanger Assembly',
      url: '/images/customer_car_installation_1792348149630.jpg',
      alt: 'Automotive in-tank fuel pump hanger bracket during installation replacement',
      caption: 'In-tank fuel pump carrier bracket illustrating mounting alignment inside an automotive fuel reservoir.',
    },
  ],

  // GENUINE CLIENT REVIEW SCREENSHOTS
  // Defaulted to empty array so placeholders render per requirements without inventing fake reviews
  reviewScreenshots: [],

  // FACTUAL AUTOMOTIVE FAQS
  faqs: [
    {
      id: 'faq-1',
      question: 'Is this electric fuel pump universally compatible with all cars?',
      answer:
        'No. Fuel pumps are not universally interchangeable. Flow rate requirements, operating pressures, electrical connectors, and physical hanger dimensions vary across car manufacturers. The seller explicitly reviews your vehicle make, model, and year before confirming dispatch.',
    },
    {
      id: 'faq-2',
      question: 'What symptoms indicate my existing fuel pump is failing?',
      answer:
        'Common indicators include sudden engine sputtering or hesitation at highway speeds, hard starting or prolonged cranking when the engine is warm, loss of acceleration under load, loud whining or humming sounds from the fuel tank, and sudden engine stall without a spark failure.',
    },
    {
      id: 'faq-3',
      question: 'What is included in the installation package?',
      answer:
        'Each pump kit includes the cylindrical 12V fuel pump unit, an inlet filter strainer sock, a submersible fuel-safe connecting hose, two stainless steel clamp rings, and a 2-pin electrical wiring pigtail harness.',
    },
    {
      id: 'faq-4',
      question: 'How does Pay on Delivery work across Nigeria?',
      answer:
        'Once you submit your vehicle and delivery details, FRANKBLAISE PARTS contacts you to verify compatibility and finalize dispatch. Payment is made when the dispatch rider or courier delivers the verified parcel to your designated address.',
    },
    {
      id: 'faq-5',
      question: 'Why should the strainer sock always be replaced with the pump?',
      answer:
        'The inlet strainer prevents microscopic sediment, rust, and particulate debris from reaching the pump turbine. Installing a new pump with a clogged old strainer causes cavitation, motor overheating, and premature failure.',
    },
  ],

  published: true,
  updatedAt: '2026-10-19T06:30:00Z',
};

/**
 * Format currency with Intl.NumberFormat in en-NG locale (₦)
 */
export function formatNaira(amount: number): string {
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (err) {
    return `₦${amount.toLocaleString()}`;
  }
}
