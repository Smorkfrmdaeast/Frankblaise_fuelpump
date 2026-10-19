# Client Self-Service Owner Onboarding & Direct Order Alert Architecture

Empower the store owner (your client) to set up their own administrative account directly from their mobile or desktop browser using their personal business email and private PIN, while enabling live order capture with instant WhatsApp alerts.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural approach confirmed in Phase 1 eliminates all complex cloud console dependencies and developer tooling:

- **Confirmed Decision 1 (First-Time Owner Onboarding)**: When visiting `/admin` (or clicking the footer lock), the system checks if an owner profile exists. If not, it launches a guided **"Store Owner Setup"** screen where your client enters their business email, creates a private 4–6 digit security PIN, and confirms their WhatsApp phone number.
- **Confirmed Decision 2 (Login Flow)**: On future visits, your client logs in using their registered email and PIN. Sessions are maintained securely with one-click logout and credentials update inside the portal.
- **Confirmed Decision 3 (Dual Order Capture & Instant Alerts)**: Customer orders submit live without blocking on cloud console configuration. Orders are stored in the Admin Dispatch Queue (searchable, filterable, CSV exportable) AND immediately generate an instant WhatsApp dispatch message to the owner's phone so they are notified within seconds.

---

## 1. Overview & Core Concept

- **The Problem Solved**: The store owner is an automotive parts business owner, not a software engineer. Requiring them to navigate Google Cloud console, API keys, and CLI deployments creates an adoption barrier.
- **The Solution**: A self-contained, client-friendly onboarding flow where the owner claims the store with their own email and PIN on first visit. The public order terminal becomes fully operational immediately, routing customer orders into both the store's dispatch queue and the owner's WhatsApp inbox.

---

## 2. User Experience & Flows

### Flow A: Client (Store Owner) First-Time Onboarding
1. Your client opens `[Website URL]/#admin` (or clicks **Admin** in the footer).
2. The portal detects zero configured owner and displays **"Welcome, Store Owner — Claim Your Store"**.
3. **Step 1**: The client enters their email (e.g. `owner@frankblaiseparts.com` or personal Gmail).
4. **Step 2**: The client creates their private 4–6 digit access PIN (e.g. `2026` or `123456`).
5. **Step 3**: The client verifies their business WhatsApp phone number for order alerts (defaults to `+234 706 540 0645`).
6. Clicks **"Complete Setup & Enter Dashboard"** &rarr; immediately logs in and gains full control over prices, specifications, reviews, and customer orders.

### Flow B: Subsequent Client Logins
1. Client visits `/#admin`.
2. Clean login card asks for **Email** and **Security PIN**.
3. Upon entering matching credentials, the client is granted access to the dashboard.
4. Inside the dashboard, the client can view, search, and update order statuses, export orders to CSV, adjust prices (₦25,000 / ₦45,000), upload customer review screenshots, and update their login PIN.

### Flow C: Live Customer Ordering & Instant WhatsApp Alert
1. Customer enters vehicle data (Make, Model, Year), contact info, delivery address, and selects package.
2. Customer clicks **"SUBMIT ORDER FOR COMPATIBILITY REVIEW"**.
3. **Action 1**: The order is recorded with its unique reference `FB-YYMMDD-XXXX` in the store dispatch database.
4. **Action 2**: The form displays the green confirmed state with the order reference.
5. **Action 3**: A pre-formatted WhatsApp alert with the full order breakdown is opened/offered so the owner receives an immediate notification on their phone.

---

## 3. Technical Architecture & State Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PUBLIC STOREFRONT                               │
│                                                                        │
│  ┌──────────────────────┐          ┌────────────────────────────────┐  │
│  │   Order Terminal     │ ───────> │  Authoritative Order Processor │  │
│  │ (Form + Validation)  │          │  (Recalculates total, adds ID) │  │
│  └──────────────────────┘          └───────────────┬────────────────┘  │
└────────────────────────────────────────────────────┼───────────────────┘
                                                     │
                                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        STORE PERSISTENCE & ALERTS                      │
│                                                                        │
│  ┌───────────────────────────────┐   ┌──────────────────────────────┐  │
│  │  Orders Queue (LocalStorage)  │   │   Instant WhatsApp Alert     │  │
│  │  - Order Reference            │   │   - Full customer details    │  │
│  │  - Vehicle Specs              │   │   - Vehicle make/model/year  │  │
│  │  - Status Tracking & CSV      │   │   - Direct to Owner's Phone  │  │
│  └───────────────────────────────┘   └──────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
                                     ▲
                                     │ (Protected Read/Write)
┌────────────────────────────────────┴───────────────────────────────────┐
│                        ADMIN DASHBOARD (/#admin)                       │
│                                                                        │
│  ┌───────────────────────────────┐   ┌──────────────────────────────┐  │
│  │   Owner Profile & Auth        │   │   Management Tabs            │  │
│  │   - Client's Registered Email │   │   - Order Dispatch Queue     │  │
│  │   - Hashed / Private PIN      │   │   - Prices (₦25k / ₦45k)     │  │
│  │   - First-time Claim Wizard   │   │   - Specs & Review Uploads   │  │
│  └───────────────────────────────┘   └──────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Implementation Steps

1. **Owner Authentication Service (`src/services/ownerAuth.ts`)**:
   - Store and retrieve owner profile (`email`, `pin`, `whatsappNumber`, `setupCompletedAt`).
   - Check if an owner is initialized.
   - Verify credentials on login.
   - Maintain active session in `sessionStorage` with automatic expiry handling.
2. **First-Time Setup Wizard inside `AdminDashboard.tsx`**:
   - If not initialized: render guided 3-field setup card ("Register Your Owner Account").
   - If initialized: render sleek login card (Email + PIN).
   - Add "Change PIN / Profile" modal inside admin settings.
3. **Live Order Submission Engine (`src/components/OrderFormSection.tsx`)**:
   - Remove prototype submission block; enable live order writes.
   - Save order to persistent dispatch queue with authoritative price recalculation.
   - Generate unique reference `FB-YYMMDD-XXXX`.
   - Trigger instant WhatsApp order notification to owner's WhatsApp number.
4. **Verification**:
   - Test first-time owner registration with custom email and PIN.
   - Test login with valid and invalid PIN.
   - Test submitting an order: verify order appears in dispatch queue, total matches package price, and WhatsApp message is formatted.
