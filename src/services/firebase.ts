/**
 * Firebase Client & Live Firestore Integration
 * FRANKBLAISE ELECTRIC FUEL PUMP PLUS — TECHNICAL ENGINEERING EDITION
 * 
 * Configured using provisioned firebase-applet-config.json with resilient offline fallback.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  orderBy,
  getDocFromServer,
} from 'firebase/firestore';
import rawFirebaseConfig from '../../firebase-applet-config.json';
import {
  AuthoritativeProductConfig,
  OrderRecord,
  OrderStatus,
} from '../types/product';
import { siteConfig } from '../config/site';

// Support both provisioned firebase-applet-config.json and VITE_ environment variables
const resolvedConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || rawFirebaseConfig.projectId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || rawFirebaseConfig.appId,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || rawFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || rawFirebaseConfig.authDomain,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || rawFirebaseConfig.firestoreDatabaseId || '(default)',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || rawFirebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || rawFirebaseConfig.messagingSenderId,
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(resolvedConfig);

// Initialize Firestore with configured databaseId per skill
export const db = getFirestore(app, resolvedConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);

// Firebase configuration flag
export const isFirebaseConfigured = Boolean(
  resolvedConfig.projectId &&
  resolvedConfig.apiKey &&
  resolvedConfig.projectId !== 'remixed-project-id'
);

// Local Storage Fallback Keys
const STORAGE_PRODUCT_KEY = 'frankblaise_engineering_product_config';
const STORAGE_ORDERS_KEY = 'frankblaise_engineering_orders';

// Test connection per skill specifications
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client is currently offline.');
    }
    return false;
  }
}

// Initial connection check on module load
testFirestoreConnection();

// Standardized Error Handling per Skill requirements
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Generate unique order reference: FB-YYMMDD-XXXX
 */
export function generateOrderReference(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `FB-${yy}${mm}${dd}-${rand}`;
}

/**
 * Normalizes image paths so legacy or dev-relative /src/assets/images/ paths
 * automatically map to public /images/ paths across dev and production builds.
 */
export function normalizeAssetUrl(url?: string | null): string {
  if (!url) return '';
  return url.replace(/^\/?src\/assets\/images\//, '/images/');
}

export function sanitizeProductConfig(config: AuthoritativeProductConfig): AuthoritativeProductConfig {
  return {
    ...config,
    video: {
      ...config.video,
      poster: normalizeAssetUrl(config.video?.poster),
    },
    productImages: (config.productImages || []).map((img) => ({
      ...img,
      url: normalizeAssetUrl(img.url),
    })),
  };
}

/**
 * Get current authoritative product configuration
 * (Reads from local cached overrides or defaults to siteConfig, and can sync from Firestore)
 */
export function getAuthoritativeProductConfig(): AuthoritativeProductConfig {
  try {
    const raw = localStorage.getItem(STORAGE_PRODUCT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return sanitizeProductConfig({
        ...siteConfig,
        ...parsed,
        prices: {
          singlePump:
            typeof parsed.prices?.singlePump === 'number'
              ? parsed.prices.singlePump
              : siteConfig.prices.singlePump,
          doublePump:
            typeof parsed.prices?.doublePump === 'number'
              ? parsed.prices.doublePump
              : siteConfig.prices.doublePump,
        },
        specs: {
          ...siteConfig.specs,
          ...(parsed.specs || {}),
        },
        delivery: {
          ...siteConfig.delivery,
          ...(parsed.delivery || {}),
        },
      });
    }
  } catch (err) {
    console.warn('Could not read cached product config:', err);
  }
  return sanitizeProductConfig(siteConfig);
}

/**
 * Fetch product configuration from Firestore
 */
export async function fetchProductConfigFromFirestore(): Promise<AuthoritativeProductConfig> {
  const configDocPath = 'product_config/main';
  try {
    const snap = await getDoc(doc(db, 'product_config', 'main'));
    if (snap.exists()) {
      const data = sanitizeProductConfig(snap.data() as AuthoritativeProductConfig);
      saveAuthoritativeProductConfig(data, false);
      return data;
    }
  } catch (error) {
    console.warn('Could not fetch product config from Firestore, using local fallback:', error);
  }
  return getAuthoritativeProductConfig();
}

/**
 * Save authoritative product configuration changes to Firestore & Local Storage
 */
export async function saveAuthoritativeProductConfig(
  updates: Partial<AuthoritativeProductConfig>,
  syncToCloud = true
): Promise<AuthoritativeProductConfig> {
  const current = getAuthoritativeProductConfig();
  const merged: AuthoritativeProductConfig = sanitizeProductConfig({
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  try {
    localStorage.setItem(STORAGE_PRODUCT_KEY, JSON.stringify(merged));
    window.dispatchEvent(
      new CustomEvent('frankblaise_config_updated', { detail: merged })
    );

    if (syncToCloud) {
      try {
        await setDoc(doc(db, 'product_config', 'main'), merged, { merge: true });
      } catch (err) {
        console.warn('Could not save product config to Firestore (requires admin auth):', err);
      }
    }
  } catch (err) {
    console.error('Failed to save product config:', err);
  }

  return merged;
}

/**
 * Fetch all stored orders (Newest first) from local cache
 */
export function getStoredOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
    if (raw) {
      const orders: OrderRecord[] = JSON.parse(raw);
      return orders.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
  } catch (err) {
    console.warn('Error reading stored orders:', err);
  }
  return [];
}

/**
 * Fetch orders from Firestore (if authenticated as admin)
 */
export async function fetchOrdersFromFirestore(): Promise<OrderRecord[]> {
  const ordersPath = 'orders';
  try {
    const q = query(collection(db, ordersPath), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const cloudOrders: OrderRecord[] = [];
    snapshot.forEach((d) => {
      cloudOrders.push({ id: d.id, ...d.data() } as OrderRecord);
    });

    if (cloudOrders.length > 0) {
      // Merge with local orders
      const local = getStoredOrders();
      const map = new Map<string, OrderRecord>();
      [...cloudOrders, ...local].forEach((ord) => {
        if (!map.has(ord.orderReference)) {
          map.set(ord.orderReference, ord);
        }
      });
      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(merged));
      window.dispatchEvent(
        new CustomEvent('frankblaise_orders_updated', { detail: merged })
      );
      return merged;
    }
  } catch (error) {
    // Falls back to local orders quietly if not logged into Firebase
    console.info('Using local orders queue');
  }
  return getStoredOrders();
}

/**
 * Save a newly placed order with authoritatively recalculated pricing.
 * Writes to Firestore (allowed by security rules) AND local dispatch queue.
 */
export async function submitOrderToBackend(orderPayload: {
  packageKey: 'single' | 'double';
  customer: {
    fullName: string;
    primaryPhone: string;
    altPhone?: string;
    whatsappPhone?: string;
  };
  vehicle: {
    make: string;
    model: string;
    productionYear: string;
    engineSize?: string;
    existingPartNumber?: string;
  };
  delivery: {
    state: string;
    cityTown: string;
    fullAddress: string;
    nearestLandmark?: string;
  };
}): Promise<{ success: boolean; orderReference?: string; error?: string }> {
  // Authoritatively recalculate product total from backend configuration
  const config = getAuthoritativeProductConfig();
  const unitPrice =
    orderPayload.packageKey === 'double'
      ? config.prices.doublePump
      : config.prices.singlePump;
  const quantity = orderPayload.packageKey === 'double' ? 2 : 1;
  const productTotal = unitPrice;

  const orderReference = generateOrderReference();
  const orderDocId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Clean payload conforming to Firestore schema
  const newOrder: OrderRecord = {
    id: orderDocId,
    orderReference,
    packageKey: orderPayload.packageKey,
    packageName:
      orderPayload.packageKey === 'double'
        ? 'Two Fuel Pumps'
        : 'One Fuel Pump',
    quantity,
    unitPrice,
    productTotal,
    customer: {
      fullName: orderPayload.customer.fullName,
      primaryPhone: orderPayload.customer.primaryPhone,
      ...(orderPayload.customer.altPhone ? { altPhone: orderPayload.customer.altPhone } : {}),
      ...(orderPayload.customer.whatsappPhone ? { whatsappPhone: orderPayload.customer.whatsappPhone } : {}),
    },
    vehicle: {
      make: orderPayload.vehicle.make,
      model: orderPayload.vehicle.model,
      productionYear: orderPayload.vehicle.productionYear,
      ...(orderPayload.vehicle.engineSize ? { engineSize: orderPayload.vehicle.engineSize } : {}),
      ...(orderPayload.vehicle.existingPartNumber ? { existingPartNumber: orderPayload.vehicle.existingPartNumber } : {}),
    },
    delivery: {
      state: orderPayload.delivery.state,
      cityTown: orderPayload.delivery.cityTown,
      fullAddress: orderPayload.delivery.fullAddress,
      ...(orderPayload.delivery.nearestLandmark ? { nearestLandmark: orderPayload.delivery.nearestLandmark } : {}),
    },
    status: 'New',
    createdAt: new Date().toISOString(),
  };

  // 1. Write to local storage for immediate offline/client access
  try {
    const existing = getStoredOrders();
    const updated = [newOrder, ...existing];
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent('frankblaise_orders_updated', { detail: updated })
    );
  } catch (err) {
    console.warn('Could not cache order locally:', err);
  }

  // 2. Write to Firestore database
  try {
    await setDoc(doc(db, 'orders', orderDocId), newOrder);
    console.log(`Order ${orderReference} successfully saved to Firestore.`);
  } catch (err) {
    console.warn('Could not write order to Firestore, local queue preserved:', err);
  }

  return { success: true, orderReference };
}

/**
 * Update order status (New, Contacted, Confirmed, Dispatched, Delivered, Cancelled)
 */
export async function updateOrderStatusInBackend(
  orderId: string,
  newStatus: OrderStatus,
  notes?: string
): Promise<boolean> {
  try {
    const orders = getStoredOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index !== -1) {
      orders[index].status = newStatus;
      if (notes !== undefined) {
        orders[index].notes = notes;
      }
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
      window.dispatchEvent(
        new CustomEvent('frankblaise_orders_updated', { detail: orders })
      );
    }

    // Attempt cloud update if connected
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        ...(notes !== undefined ? { notes } : {}),
        updatedAt: new Date().toISOString(),
      });
    } catch (cloudErr) {
      // Local update is already saved
    }

    return true;
  } catch (err) {
    console.error('Error updating order status:', err);
    return false;
  }
}

/**
 * Export orders to CSV string
 */
export function exportOrdersToCSV(orders: OrderRecord[]): string {
  const headers = [
    'Order Reference',
    'Created At',
    'Status',
    'Package',
    'Quantity',
    'Product Total (NGN)',
    'Customer Name',
    'Primary Phone',
    'Alt Phone',
    'WhatsApp Phone',
    'Vehicle Make',
    'Vehicle Model',
    'Vehicle Year',
    'Engine',
    'Existing Part #',
    'State',
    'City/Town',
    'Address',
    'Landmark',
    'Notes',
  ];

  const rows = orders.map((o) => [
    `"${o.orderReference}"`,
    `"${o.createdAt}"`,
    `"${o.status}"`,
    `"${o.packageName}"`,
    o.quantity,
    o.productTotal,
    `"${(o.customer.fullName || '').replace(/"/g, '""')}"`,
    `"${o.customer.primaryPhone || ''}"`,
    `"${o.customer.altPhone || ''}"`,
    `"${o.customer.whatsappPhone || ''}"`,
    `"${(o.vehicle.make || '').replace(/"/g, '""')}"`,
    `"${(o.vehicle.model || '').replace(/"/g, '""')}"`,
    `"${o.vehicle.productionYear || ''}"`,
    `"${(o.vehicle.engineSize || '').replace(/"/g, '""')}"`,
    `"${(o.vehicle.existingPartNumber || '').replace(/"/g, '""')}"`,
    `"${(o.delivery.state || '').replace(/"/g, '""')}"`,
    `"${(o.delivery.cityTown || '').replace(/"/g, '""')}"`,
    `"${(o.delivery.fullAddress || '').replace(/"/g, '""')}"`,
    `"${(o.delivery.nearestLandmark || '').replace(/"/g, '""')}"`,
    `"${(o.notes || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
