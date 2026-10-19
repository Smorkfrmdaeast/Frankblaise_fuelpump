# FRANKBLAISE ELECTRIC FUEL PUMP PLUS — TECHNICAL ENGINEERING EDITION

An authoritative technical product specification catalogue, vehicle fitment verification terminal, and direct ordering platform for **FRANKBLAISE PARTS**. Built with React 19, Vite, TypeScript, Tailwind CSS, and Firebase Firestore & Authentication architecture.

---

## 1. Quick Start & Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm or bun

### Commands
```bash
# 1. Install dependencies
npm install

# 2. Start development server (Port 3000)
npm run dev

# 3. Compile and build production bundle
npm run build

# 4. Preview built production bundle
npm run preview

# 5. Typecheck & lint validation
npm run lint
```

The application runs locally on `http://localhost:3000`.

---

## 2. Architecture & Authoritative Configuration

All product data, package prices, verified specifications, delivery terms, and media assets are governed by a single authoritative configuration schema (`src/config/site.ts` and `src/types/product.ts`).

### Strict Non-Negotiable Rules:
1. **Zero Hallucinated Claims**: Any specification or warranty period not verified by the seller is set to `null` and displayed on the public site as *"Please confirm with the seller."*
2. **Authoritative Server Recalculation**: The client browser selects only the package key (`single` or `double`). Order totals are recalculated authoritatively from the backend configuration upon submission. Client-sent totals are never blindly trusted.
3. **Genuine Imagery Only**: No stock photography or AI-generated fuel pumps. All media points directly to genuine Frankblaise unit assets in `src/assets/images/` and `public/videos/`.

---

## 3. Firebase Backend Setup Guide

The application incorporates a dual-mode persistence architecture:
- When Firebase environment variables are configured, orders and administrative changes write directly to **Firebase Firestore** with **Firebase Authentication**.
- When unconfigured, the public catalogue operates in safe catalog mode, the order form displays an informative amber status notice that cloud submission is pending, and direct order inquiries can be routed seamlessly through **WhatsApp (+234 706 540 0645)**.

### Step-by-Step Firebase Console Configuration:
1. Open the [Firebase Console](https://console.firebase.google.com/) and create a new project (e.g. `frankblaise-parts`).
2. **Enable Firestore Database**:
   - In the left sidebar, click **Build** &rarr; **Firestore Database**.
   - Click **Create database**, choose your preferred cloud region (e.g. `europe-west1`), and start in **Production mode**.
3. **Enable Firebase Authentication**:
   - In the left sidebar, click **Build** &rarr; **Authentication**.
   - Click **Get started**, enable the **Email/Password** provider (or **Google Sign-In**).
4. **Register a Web App**:
   - Go to **Project Settings** (gear icon) &rarr; **General** &rarr; **Your apps** &rarr; Click the `</>` (Web) icon.
   - Register the app name (e.g. `Frankblaise Web`).
   - Copy the `firebaseConfig` keys into your `.env` file based on `.env.example`:
     ```env
     VITE_FIREBASE_API_KEY=your_actual_api_key
     VITE_FIREBASE_AUTH_DOMAIN=frankblaise-parts.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=frankblaise-parts
     VITE_FIREBASE_STORAGE_BUCKET=frankblaise-parts.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_web_app_id
     ```
5. **Deploy Security Rules**:
   - Install the Firebase CLI: `npm install -g firebase-tools`
   - Log in: `firebase login`
   - Initialize project: `firebase init firestore` (select your created project and use the existing `firestore.rules` file)
   - Deploy rules:
     ```bash
     firebase deploy --only firestore:rules
     ```

### Creating Your First Admin Account:
1. In the **Firebase Console** &rarr; **Authentication** &rarr; **Users**, click **Add user** and create an administrator account (e.g. `smokeginobli092@gmail.com`).
2. Copy the generated User UID (e.g. `a1b2c3d4...`).
3. In **Firestore Database**, create a document under the `admins` collection with that UID:
   - Collection: `admins`
   - Document ID: `[YOUR_USER_UID]`
   - Fields:
     - `email`: `"smokeginobli092@gmail.com"` (string)
     - `role`: `"owner"` (string)
     - `createdAt`: server timestamp
4. This unlocks server-enforced CRUD permissions per `firestore.rules`.

---

## 4. Seller Administration Portal

The administration portal is phone-friendly and accessible directly via:
- URL route: `/#admin` (or `/admin`)
- Public site footer: Discreet **Admin** lock button.

### Capabilities:
- **Order Dispatch Queue**: View incoming customer orders sorted newest first. Filter by status (`New`, `Contacted`, `Confirmed`, `Dispatched`, `Delivered`, `Cancelled`). Search by customer name, phone number, vehicle make, or state. Update order lifecycle status in real time.
- **CSV Data Export**: One-click download of all customer orders formatted with vehicle specs and delivery addresses for courier logistics.
- **Pricing & Technical Editor**: Adjust package prices (Single Unit and Double Unit) with immediate reflection across the public site and order calculations.
- **Review Screenshots Manager**: Upload genuine WhatsApp customer feedback screenshots with privacy redaction guidance.
- **Backend Status Monitor**: Real-time diagnostic panel showing whether live cloud persistence is active.

---

## 5. Deployment to Vercel (SPA Single-Page App)

The repository includes `vercel.json` configured for SPA routing:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

### Steps:
1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and import the repository.
3. Framework preset: **Vite**.
4. Environment Variables: If connecting Firebase, add the `VITE_FIREBASE_*` variables from `.env.example`.
5. Click **Deploy**.

### Connecting a Custom Domain:
1. Navigate to your project in Vercel &rarr; **Settings** &rarr; **Domains**.
2. Add your custom domain (e.g. `frankblaiseparts.ng` or `parts.frankblaise.com`).
3. Add the DNS records (`CNAME` or `A`) provided by Vercel in your domain registrar DNS manager.

---

## 6. Owner-Supplied Items Still Needed

The site is built with strict integrity and leaves zero room for false claims. The following items should be supplied or confirmed by the business owner before public advertising:
1. **Confirmed Package Prices**: Confirm default prices (1 pump = ₦25,000, 2 pumps = ₦45,000) or adjust in the Admin Portal.
2. **Delivery Terms**: Confirm courier coverage, transit timelines, and delivery inspection terms for regional hubs outside state capitals.
3. **Confirmed Warranty Terms**: Supply the verified replacement warranty duration (e.g. 6 months, 1 year) or leave as *"Please confirm with the seller."*
4. **Verified Technical Specifications**: Supply verified millimeter body dimensions (OD × Length) and bar/PSI pressure output.
5. **Customer Evidence**: Upload genuine WhatsApp review screenshots via the Admin Portal (with customer telephone numbers and home addresses redacted).
6. **WhatsApp Support Line**: The active verified number is set to `+234 706 540 0645`. Confirm if secondary lines should be linked.
