/**
 * Authoritative Technical Product and Order Types
 * FRANKBLAISE ELECTRIC FUEL PUMP PLUS — TECHNICAL ENGINEERING EDITION
 */

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
  maxPressure?: string | null;
  flowRate?: string | null;
}

export interface ProductImageItem {
  id: string;
  slotName: string;
  url: string | null;
  alt: string;
  caption?: string;
}

export interface ReviewScreenshotItem {
  id: string;
  url: string | null;
  caption?: string;
  verifiedBuyer?: boolean;
  date?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface PackagePricing {
  singlePump: number; // Default: 25000
  doublePump: number; // Default: 45000
}

export interface DeliveryTerms {
  isFreeDeliveryConfirmed: boolean;
  isPayOnDeliveryConfirmed: boolean;
  deliveryNotes: string | null;
  estimatedDispatchWindow: string | null;
}

export interface AuthoritativeProductConfig {
  brandName: string;
  productName: string;
  category: string;
  technicalIdentifier?: string | null;
  headline: string;
  factualOverview: string;
  whatsappNumber: string; // e.g. '+234 706 540 0645'
  video: {
    url: string | null;
    poster: string | null;
  };
  prices: PackagePricing;
  specs: ConfirmedSpecifications;
  warrantyTerms: string | null;
  delivery: DeliveryTerms;
  productImages: ProductImageItem[];
  reviewScreenshots: ReviewScreenshotItem[];
  faqs: FAQItem[];
  published: boolean;
  updatedAt: string;
}

export type OrderStatus =
  | 'New'
  | 'Contacted'
  | 'Confirmed'
  | 'Dispatched'
  | 'Delivered'
  | 'Cancelled';

export interface OrderCustomer {
  fullName: string;
  primaryPhone: string;
  altPhone?: string;
  whatsappPhone?: string;
  email?: string;
}

export interface OrderVehicle {
  make: string;
  model: string;
  productionYear: string;
  engineSize?: string;
  existingPartNumber?: string;
}

export interface OrderDelivery {
  state: string;
  cityTown: string;
  fullAddress: string;
  nearestLandmark?: string;
}

export interface OrderRecord {
  id: string;
  orderReference: string; // e.g. FB-261019-XXXX
  packageKey: 'single' | 'double';
  packageName: string;
  quantity: number;
  unitPrice: number;
  productTotal: number; // Authoritatively calculated
  customer: OrderCustomer;
  vehicle: OrderVehicle;
  delivery: OrderDelivery;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
}
