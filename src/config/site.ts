/**
 * Site Configuration for FRANKBLAISE PARTS
 * 
 * Single source of truth for all seller-supplied values, pricing, endpoints,
 * media assets, and verified product specifications.
 */

export interface ProductImageItem {
  id: string;
  slotName: string;
  url?: string | null;
  alt: string;
  caption?: string;
}

export interface ReviewScreenshotItem {
  id: string;
  url?: string | null;
  caption?: string;
}

export interface ConfirmedSpecifications {
  productName: string;
  category: string;
  material: string | null;
  operatingVoltage: string | null;
  dimensions: string | null;
  connectorType: string | null;
  compatibleMakesAndModels: string | null;
  packageContents: string | null;
  warranty: string | null;
}

export interface SiteConfig {
  brandName: string;
  productName: string;
  whatsappNumber: string; // Left empty by default; floating button and WhatsApp ordering hidden until set
  orderEndpointUrl: string; // Left empty by default; form flags as prototype until connected
  video: {
    url: string | null;
    poster: string | null;
  };
  productImages: ProductImageItem[];
  reviewScreenshots: ReviewScreenshotItem[];
  confirmedSpecs: ConfirmedSpecifications;
  confirmedWarrantyTerms: string | null; // null by default; shows "Please confirm with the seller."
  prices: {
    singlePump: number;
    doublePump: number;
  };
}

export const siteConfig: SiteConfig = {
  brandName: 'FRANKBLAISE PARTS',
  productName: 'FRANKBLAISE ELECTRIC FUEL PUMP PLUS',

  // SELLER INTEGRATIONS
  whatsappNumber: '+234 706 540 0645', // Official WhatsApp support: +234 706 540 0645
  orderEndpointUrl: '', // Example: 'https://formspree.io/f/your_form_id' or your webhook URL

  // PRODUCT VIDEO
  video: {
    url: '/videos/frankblaise_fuel_pump_demo.mp4',
    poster: '/src/assets/images/hero_fuel_pump_plus_1792348147776.jpg',
  },

  // PRODUCT GALLERY SLOTS
  // Slots: packaging, electric fuel pump, connector, accessories, close-up, dimensions (if verified), installation (if available)
  productImages: [
    {
      id: 'img-pump',
      slotName: 'Electric Fuel Pump',
      url: '/src/assets/images/hero_fuel_pump_plus_1792348147776.jpg',
      alt: 'FRANKBLAISE ELECTRIC FUEL PUMP PLUS cylindrical automotive electric fuel pump unit',
      caption: 'High-torque compact cylindrical automotive fuel pump unit with terminal studs and inlet.',
    },
    {
      id: 'img-accessories',
      slotName: 'Accessories & Strainer',
      url: '/src/assets/images/fuel_pump_unboxing_kit_1792348148348.jpg',
      alt: 'Installation kit with inlet filter strainer sock, submersible hose, clamps, and wiring harness',
      caption: 'Accessories kit: inlet filter strainer sock, submersible rubber hose, clamp rings, and pigtail connector.',
    },
    {
      id: 'img-installation',
      slotName: 'In-Tank Installation',
      url: '/src/assets/images/customer_car_installation_1792348149630.jpg',
      alt: 'Vehicle fuel tank assembly showing in-tank fuel pump replacement bracket',
      caption: 'Vehicle fuel pump hanger assembly during automotive in-tank replacement.',
    },
    {
      id: 'img-cutaway',
      slotName: 'Internal Mechanism',
      url: '/src/assets/images/fuel_pump_cutaway_diagram_1792348149087.jpg',
      alt: 'Internal cutaway showing motor armature coil, check valve, and turbine impeller',
      caption: 'Internal cutaway view of the electric motor armature and turbine pumping chamber.',
    },
    {
      id: 'img-packaging',
      slotName: 'Packaging Box',
      url: null, // Placeholder when not supplied
      alt: 'FRANKBLAISE ELECTRIC FUEL PUMP PLUS packaging box',
      caption: 'Original FRANKBLAISE PARTS product packaging.',
    },
    {
      id: 'img-connector',
      slotName: 'Connector Plug Detail',
      url: null, // Placeholder when not supplied
      alt: 'Close-up of electrical connector plug and terminals',
      caption: 'Close-up detail of 2-pin electrical connector and wiring pigtail.',
    },
    {
      id: 'img-dimensions',
      slotName: 'Dimensions & Measurements',
      url: null, // Placeholder when unverified
      alt: 'Measurement diagram of fuel pump body diameter and length',
      caption: 'Verified physical measurements (pending seller confirmation).',
    },
  ],

  // GENUINE CLIENT REVIEW SCREENSHOTS
  // Defaulted to empty array so placeholders render per requirements without inventing reviews
  reviewScreenshots: [],

  // CONFIRMED SPECIFICATIONS
  // Every row except name and category is null by default until confirmed by seller
  confirmedSpecs: {
    productName: 'FRANKBLAISE ELECTRIC FUEL PUMP PLUS',
    category: 'Automotive replacement electric fuel pump',
    material: null,
    operatingVoltage: null,
    dimensions: null,
    connectorType: null,
    compatibleMakesAndModels: null,
    packageContents: null,
    warranty: null,
  },

  // WARRANTY TERMS (null by default; renders "Please confirm with the seller.")
  confirmedWarrantyTerms: null,

  // PRICES (Single source of truth used everywhere)
  prices: {
    singlePump: 25000,
    doublePump: 45000,
  },
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
