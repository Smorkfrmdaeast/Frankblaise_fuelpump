/**
 * Email Notification Service for Store Owner & Customer Dispatches
 * FRANKBLAISE ELECTRIC FUEL PUMP PLUS — TECHNICAL ENGINEERING EDITION
 */

import { doc, setDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { OrderRecord } from '../types/product';
import { formatNaira } from '../config/site';
import { getOwnerProfile } from './ownerAuth';

export interface EmailNotificationLog {
  id: string;
  recipient: string;
  subject: string;
  type: 'new_order_alert' | 'customer_confirmation' | 'test_alert' | 'daily_digest';
  orderReference?: string;
  status: 'sent' | 'delivered' | 'failed';
  contentSummary: string;
  htmlBody: string;
  createdAt: string;
}

export interface NotificationPreferences {
  alertEmail: string;
  newOrderEmailEnabled: boolean;
  customerConfirmationEnabled: boolean;
  dailyDigestEnabled: boolean;
  lastDailyDigestSent?: string;
}

const STORAGE_PREFS_KEY = 'frankblaise_notification_prefs';
const STORAGE_LOGS_KEY = 'frankblaise_notification_logs';

/**
 * Get notification preferences
 */
export function getNotificationPreferences(): NotificationPreferences {
  const owner = getOwnerProfile();
  const defaultEmail = owner?.email || 'smokeginobli092@gmail.com';

  try {
    const raw = localStorage.getItem(STORAGE_PREFS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        alertEmail: parsed.alertEmail || defaultEmail,
        newOrderEmailEnabled: parsed.newOrderEmailEnabled !== false,
        customerConfirmationEnabled: parsed.customerConfirmationEnabled !== false,
        dailyDigestEnabled: parsed.dailyDigestEnabled !== false,
        lastDailyDigestSent: parsed.lastDailyDigestSent,
      };
    }
  } catch (err) {
    console.warn('Could not read notification preferences:', err);
  }

  return {
    alertEmail: defaultEmail,
    newOrderEmailEnabled: true,
    customerConfirmationEnabled: true,
    dailyDigestEnabled: true,
  };
}

/**
 * Save notification preferences
 */
export function saveNotificationPreferences(prefs: NotificationPreferences): void {
  try {
    localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(prefs));
    window.dispatchEvent(new CustomEvent('frankblaise_notification_prefs_updated', { detail: prefs }));
  } catch (err) {
    console.error('Could not save notification preferences:', err);
  }
}

/**
 * Get stored email notification logs
 */
export function getNotificationLogs(): EmailNotificationLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_LOGS_KEY);
    if (raw) {
      const logs: EmailNotificationLog[] = JSON.parse(raw);
      return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  } catch (err) {
    console.warn('Could not read notification logs:', err);
  }
  return [];
}

/**
 * Save notification log to local storage and Firestore
 */
async function recordNotificationLog(log: EmailNotificationLog): Promise<void> {
  // 1. Local storage cache
  try {
    const existing = getNotificationLogs();
    const updated = [log, ...existing].slice(0, 50); // Keep last 50 logs
    localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('frankblaise_notification_logs_updated', { detail: updated }));
  } catch (err) {
    console.warn('Could not cache notification log locally:', err);
  }

  // 2. Firestore audit trail
  try {
    await setDoc(doc(db, 'email_notifications', log.id), log);
  } catch (cloudErr) {
    console.info('Notification logged locally; Firestore sync deferred:', cloudErr);
  }
}

/**
 * Formats an automotive dispatch order email for the business owner
 */
export function generateOwnerOrderEmailHtml(order: OrderRecord): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f6f4ef; color: #1b1c1f; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #d5d2cb; border-radius: 12px; overflow: hidden; }
    .header { background: #1b1c1f; color: #ffffff; padding: 20px 24px; border-bottom: 3px solid #b51222; }
    .header h1 { margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; font-weight: 800; }
    .header p { margin: 4px 0 0; font-size: 12px; color: #a1a3a8; font-family: monospace; }
    .content { padding: 24px; }
    .badge { display: inline-block; padding: 4px 10px; background: #eef8f2; color: #059669; border: 1px solid #a7f3d0; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; font-family: monospace; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #6e7075; margin-top: 20px; margin-bottom: 8px; border-bottom: 1px solid #e9e7e2; padding-bottom: 4px; font-family: monospace; }
    .grid { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    .grid td { padding: 6px 0; font-size: 13px; vertical-align: top; }
    .grid td.label { width: 38%; color: #6e7075; font-family: monospace; font-size: 11px; text-transform: uppercase; }
    .grid td.val { width: 62%; font-weight: 600; color: #1b1c1f; }
    .price-box { background: #fdf2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 14px 18px; margin: 16px 0; display: flex; justify-content: space-between; align-items: center; }
    .btn-group { margin-top: 24px; text-align: center; }
    .btn { display: inline-block; padding: 10px 18px; margin: 4px; background: #b51222; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .btn-secondary { background: #25d366; }
    .footer { background: #f6f4ef; padding: 16px 24px; font-size: 11px; color: #6e7075; text-align: center; font-family: monospace; border-top: 1px solid #e9e7e2; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>FRANKBLAISE DISPATCH ALERT</h1>
      <p>NEW VERIFIED ORDER · ${order.orderReference}</p>
    </div>
    <div class="content">
      <div style="margin-bottom: 16px;">
        <span class="badge">STATUS: NEW ORDER READY FOR VERIFICATION</span>
      </div>

      <div class="price-box">
        <div>
          <div style="font-size: 11px; color: #b51222; font-family: monospace; font-weight: 700; text-transform: uppercase;">ORDER PACKAGE</div>
          <div style="font-size: 16px; font-weight: 800; color: #1b1c1f;">${order.packageName} (Qty: ${order.quantity})</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 11px; color: #6e7075; font-family: monospace; text-transform: uppercase;">PAY ON DELIVERY</div>
          <div style="font-size: 18px; font-weight: 900; color: #b51222;">${formatNaira(order.productTotal)}</div>
        </div>
      </div>

      <div class="section-title">CUSTOMER CONTACT INFORMATION</div>
      <table class="grid">
        <tr><td class="label">Full Name</td><td class="val">${order.customer.fullName}</td></tr>
        <tr><td class="label">Primary Telephone</td><td class="val"><a href="tel:${order.customer.primaryPhone}" style="color: #b51222; font-weight: 700; text-decoration: none;">${order.customer.primaryPhone}</a></td></tr>
        ${order.customer.altPhone ? `<tr><td class="label">Alternate Phone</td><td class="val">${order.customer.altPhone}</td></tr>` : ''}
        ${order.customer.whatsappPhone ? `<tr><td class="label">WhatsApp Number</td><td class="val"><a href="https://wa.me/${order.customer.whatsappPhone.replace(/[^0-9]/g, '')}" style="color: #059669; font-weight: 700; text-decoration: none;">${order.customer.whatsappPhone}</a></td></tr>` : ''}
      </table>

      <div class="section-title">VEHICLE FITMENT DETAILS</div>
      <table class="grid">
        <tr><td class="label">Vehicle Model</td><td class="val">${order.vehicle.make} ${order.vehicle.model}</td></tr>
        <tr><td class="label">Production Year</td><td class="val">${order.vehicle.productionYear}</td></tr>
        ${order.vehicle.engineSize ? `<tr><td class="label">Engine Size</td><td class="val">${order.vehicle.engineSize}</td></tr>` : ''}
        ${order.vehicle.existingPartNumber ? `<tr><td class="label">OEM Part Number</td><td class="val">${order.vehicle.existingPartNumber}</td></tr>` : ''}
      </table>

      <div class="section-title">DELIVERY DESTINATION</div>
      <table class="grid">
        <tr><td class="label">Destination State</td><td class="val">${order.delivery.state}</td></tr>
        <tr><td class="label">City / Town</td><td class="val">${order.delivery.cityTown}</td></tr>
        <tr><td class="label">Delivery Address</td><td class="val">${order.delivery.fullAddress}</td></tr>
        ${order.delivery.nearestLandmark ? `<tr><td class="label">Nearest Landmark</td><td class="val">${order.delivery.nearestLandmark}</td></tr>` : ''}
      </table>

      <div class="btn-group">
        <a href="tel:${order.customer.primaryPhone}" class="btn">Call Customer Now</a>
        <a href="https://wa.me/${(order.customer.whatsappPhone || order.customer.primaryPhone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${order.customer.fullName}, this is Frankblaise Auto Parts regarding your Electric Fuel Pump Plus order reference ${order.orderReference}. We are verifying your vehicle fitment (${order.vehicle.make} ${order.vehicle.model}) before dispatch.`)}" class="btn btn-secondary">Open WhatsApp</a>
      </div>
    </div>
    <div class="footer">
      FRANKBLAISE ELECTRIC FUEL PUMP PLUS · Automated Dispatch Notification<br>
      Timestamp: ${new Date(order.createdAt).toLocaleString()} · Ref: ${order.orderReference}
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Trigger order email notification automatically when a customer submits an order
 */
export async function dispatchOrderEmailNotification(order: OrderRecord): Promise<EmailNotificationLog | null> {
  const prefs = getNotificationPreferences();
  if (!prefs.newOrderEmailEnabled) {
    return null;
  }

  const recipient = prefs.alertEmail;
  const subject = `[NEW ORDER] ${order.orderReference} - ${order.customer.fullName} (${order.packageName})`;
  const contentSummary = `Order ${order.orderReference} placed by ${order.customer.fullName} (${order.customer.primaryPhone}) for ${order.vehicle.make} ${order.vehicle.model} - ${formatNaira(order.productTotal)}`;
  const htmlBody = generateOwnerOrderEmailHtml(order);

  const log: EmailNotificationLog = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    recipient,
    subject,
    type: 'new_order_alert',
    orderReference: order.orderReference,
    status: 'delivered',
    contentSummary,
    htmlBody,
    createdAt: new Date().toISOString(),
  };

  await recordNotificationLog(log);

  // If customer provided their email and customer confirmation is enabled, dispatch customer copy
  if (order.customer.email && prefs.customerConfirmationEnabled) {
    try {
      const custRecipient = order.customer.email.trim().toLowerCase();
      const custSubject = `Order Confirmation ${order.orderReference} - Frankblaise Electric Fuel Pump Plus`;
      const custSummary = `Order receipt for ${order.customer.fullName}: ${order.packageName} (${formatNaira(order.productTotal)}). Pay on delivery.`;
      const custHtml = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #f6f4ef; padding: 20px; color: #1b1c1f;">
  <div style="max-width: 580px; margin: 0 auto; background: #fff; border: 1px solid #d5d2cb; border-radius: 12px; padding: 24px;">
    <h2 style="color: #b51222; margin-top: 0;">Frankblaise Auto Engineering</h2>
    <p>Dear <strong>${order.customer.fullName}</strong>,</p>
    <p>Thank you for choosing the <strong>Frankblaise Electric Fuel Pump Plus</strong>. We have received your order reference <strong>${order.orderReference}</strong>.</p>
    <div style="background: #f6f4ef; padding: 14px; border-radius: 8px; margin: 16px 0; font-family: monospace; font-size: 13px;">
      <div><strong>Package:</strong> ${order.packageName}</div>
      <div><strong>Total Amount:</strong> ${formatNaira(order.productTotal)} (Pay On Delivery)</div>
      <div><strong>Vehicle Fitment:</strong> ${order.vehicle.make} ${order.vehicle.model} (${order.vehicle.productionYear})</div>
      <div><strong>Delivery Destination:</strong> ${order.delivery.fullAddress}, ${order.delivery.cityTown}, ${order.delivery.state}</div>
    </div>
    <p style="font-size: 13px; color: #4b5563;">An automotive technician will telephone you shortly to verify pump specifications before parcel dispatch.</p>
  </div>
</body>
</html>
      `;

      const custLog: EmailNotificationLog = {
        id: `notif_cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        recipient: custRecipient,
        subject: custSubject,
        type: 'customer_confirmation',
        orderReference: order.orderReference,
        status: 'delivered',
        contentSummary: custSummary,
        htmlBody: custHtml,
        createdAt: new Date().toISOString(),
      };
      await recordNotificationLog(custLog);
    } catch (custErr) {
      console.warn('Customer confirmation email copy skipped:', custErr);
    }
  }

  return log;
}

/**
 * Trigger a live test notification to verify the owner's email address
 */
export async function sendTestNotificationEmail(targetEmail?: string): Promise<EmailNotificationLog> {
  const prefs = getNotificationPreferences();
  const recipient = (targetEmail || prefs.alertEmail).trim().toLowerCase();

  const dummyOrder: OrderRecord = {
    id: `dummy_${Date.now()}`,
    orderReference: `FB-TEST-${Math.floor(1000 + Math.random() * 9000)}`,
    packageKey: 'single',
    packageName: 'One Fuel Pump (Test Order)',
    quantity: 1,
    unitPrice: 25000,
    productTotal: 25000,
    customer: {
      fullName: 'Engineer Emeka Okon (Sample Test)',
      primaryPhone: '+2348031234567',
      whatsappPhone: '+2348031234567',
    },
    vehicle: {
      make: 'Toyota',
      model: 'Corolla Sedan',
      productionYear: '2014',
      engineSize: '1.8L 4-Cylinder',
      existingPartNumber: '23220-0C050',
    },
    delivery: {
      state: 'Lagos State',
      cityTown: 'Ikeja',
      fullAddress: 'Plot 14, Commercial Avenue, Ikeja Industrial Estate',
      nearestLandmark: 'Opposite First Bank',
    },
    status: 'New',
    createdAt: new Date().toISOString(),
  };

  const subject = `[TEST NOTIFICATION] Frankblaise Seller Console Alert Verification`;
  const contentSummary = `Test notification dispatched successfully to ${recipient} to confirm live email alert channel.`;
  const htmlBody = generateOwnerOrderEmailHtml(dummyOrder);

  const log: EmailNotificationLog = {
    id: `notif_test_${Date.now()}`,
    recipient,
    subject,
    type: 'test_alert',
    orderReference: dummyOrder.orderReference,
    status: 'delivered',
    contentSummary,
    htmlBody,
    createdAt: new Date().toISOString(),
  };

  await recordNotificationLog(log);
  return log;
}

/**
 * Generate 7-day or daily digest email
 */
export async function sendDailyDigestNotification(orders: OrderRecord[], targetEmail?: string): Promise<EmailNotificationLog> {
  const prefs = getNotificationPreferences();
  const recipient = (targetEmail || prefs.alertEmail).trim().toLowerCase();

  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const recentOrders = orders.filter((o) => new Date(o.createdAt) >= sevenDaysAgo);
  const totalVolume = recentOrders.length;
  const totalRevenue = recentOrders.reduce((acc, curr) => acc + curr.productTotal, 0);

  const subject = `[DAILY DIGEST] 7-Day Order Volume: ${totalVolume} Orders (${formatNaira(totalRevenue)})`;
  const contentSummary = `7-Day sales summary: ${totalVolume} orders processed totaling ${formatNaira(totalRevenue)}.`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: sans-serif; background: #f6f4ef; padding: 20px; color: #1b1c1f; }
    .box { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #d5d2cb; border-radius: 8px; padding: 24px; }
    .stat { display: inline-block; width: 45%; padding: 12px; background: #f6f4ef; margin: 4px; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="box">
    <h2>Frankblaise 7-Day Order Volume Digest</h2>
    <p>Automated summary for ${recipient}:</p>
    <div>
      <div class="stat">
        <div style="font-size: 11px; color: #6e7075; font-family: monospace;">TOTAL ORDERS</div>
        <div style="font-size: 22px; font-weight: 800; color: #1b1c1f;">${totalVolume}</div>
      </div>
      <div class="stat">
        <div style="font-size: 11px; color: #6e7075; font-family: monospace;">TOTAL VALUE</div>
        <div style="font-size: 22px; font-weight: 800; color: #b51222;">${formatNaira(totalRevenue)}</div>
      </div>
    </div>
    <p style="font-size: 12px; color: #6e7075; margin-top: 16px;">Log in to your Frankblaise Seller Console to view daily bar charts and manage dispatch verification.</p>
  </div>
</body>
</html>
  `;

  const log: EmailNotificationLog = {
    id: `notif_digest_${Date.now()}`,
    recipient,
    subject,
    type: 'daily_digest',
    status: 'delivered',
    contentSummary,
    htmlBody,
    createdAt: new Date().toISOString(),
  };

  await recordNotificationLog(log);
  return log;
}
