# Client Admin Panel & Review Screenshot Upload Manager

Implementation plan for a client-side Admin Panel modal for FRANKBLAISE PARTS, enabling the store owner to upload and manage genuine customer WhatsApp review screenshots directly from their phone or computer, manage pricing, and configure video settings with instant persistent browser storage.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following user-confirmed choices guide this implementation:

- **Confirmed Decision 1 (Admin Access Flow)**: A discreet "Seller Portal" lock icon / button in the website footer that opens a secure passcode-protected modal (default admin passcode `frankblaise2026`, customizable).
- **Confirmed Decision 2 (Storage & Persistence)**: Persistent browser storage (`localStorage` & `IndexedDB` file storage) for instant image compression, base64/blob storage, and persistent display in the `Customer Experiences` carousel across sessions.
- **Confirmed Decision 3 (Admin Capabilities)**:
  1. **Review Screenshots Manager**: Multi-image file picker / drag-and-drop uploader, caption editor, image preview, reordering, and instant deletion.
  2. **Price Management**: Live adjustment of Single Pump (default ₦25,000) and Double Pump (default ₦45,000) packages with reset option.
  3. **Video URL & Demonstration Control**: Update or toggle the product video demonstration source.
  4. **WhatsApp Dispatch Settings**: Update active seller WhatsApp contact number.

---

### 1. Overview & Core Concept

- **What It Does**: Bridges the gap between static code and active merchant management by giving the client a responsive, in-browser administrative control center. The client can upload genuine WhatsApp screenshot photos directly from their phone's photo library, type captions (e.g. *"2008 Toyota Camry customer in Ikeja"*), and immediately see them rendered in the live customer experience carousel.
- **Target Persona**: Store owner, marketing manager, or sales agent who receives customer delivery feedback on WhatsApp and wants to publish genuine proof screenshots without hiring a developer.
- **Key Value**: Zero code required to update review screenshots; preserves the site's strict policy against fake reviews while making real client uploads easy and immediate.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Entering Admin Mode**:
   - The store owner scrolls to the quiet footer and clicks the discreet **"Seller Portal"** affordance (or uses a keyboard shortcut like `Ctrl+Shift+A`).
   - A minimalist security dialog requests the admin passcode (`frankblaise2026`).
2. **Uploading Review Screenshots**:
   - Tab 1 displays the **Review Screenshots Manager**.
   - Store owner clicks **"Upload Review Screenshot"** or drags images from their device.
   - An image optimization utility compresses the screenshot (max 1200px width, clean JPEG) and stores it in persistent client storage.
   - Owner can add an optional caption (e.g. *"Lexus RX350 delivery to Port Harcourt"*).
   - Once saved, the `Customer Experiences` section immediately updates from placeholders to real uploaded screenshots, complete with touch swipe, indicator dots, and full-screen lightbox!
3. **Managing Store Pricing & Video**:
   - Tab 2 allows quick adjustments to standard prices (₦25,000 and ₦45,000) and video playback URL.
4. **Export / Reset Settings**:
   - Backup configuration button to copy current settings or reset to factory defaults.

#### Visual Styling
- Dark automotive styling matching the `#0B0B0D` / `#151518` / `#E32636` theme.
- Clean tabs, accessible file upload dropzone, thumbnail preview grid with remove icons, and inline validation.
- Mobile-first layout optimized for Android and iPhone touch screens.

---

### 3. Key Product Decisions & Trade-Offs

- **Browser Storage (IndexedDB / LocalStorage) vs. External Cloud Backend**:
  - *Chosen Approach*: Implement a lightweight client storage service (`src/services/adminStorage.ts`) with automatic compression.
  - *Why*: Gives the client immediate, zero-friction review uploads without requiring costly Firebase/AWS storage setup, complex API keys, or backend server provisioning.
  - *Extensibility*: Also provides a simple "Export JSON / Import JSON" tool so the store owner can easily export their uploaded reviews to commit into `siteConfig.reviewScreenshots` if they want them hardcoded across all devices.

---

### 4. Technical Architecture & Component Structure

```
┌────────────────────────────────────────────────────────┐
│                      STORE FRONT                       │
├────────────────────────────────────────────────────────┤
│ • CustomerExperiencesSection                           │
│   └─ Reads from useAdminStore() hook                   │
│      ├─ If admin has uploaded reviews -> Renders them   │
│      └─ If empty -> Falls back to siteConfig           │
│                                                        │
│ • FooterSection                                        │
│   └─ Discreet "Seller Portal" button                   │
└──────────────────────────┬─────────────────────────────┘
                           │ Opens
┌──────────────────────────▼─────────────────────────────┐
│                   ADMIN PORTAL MODAL                   │
├────────────────────────────────────────────────────────┤
│ 1. Passcode Gate (`frankblaise2026`)                   │
│ 2. Tabs:                                               │
│    ├─ [Reviews]: Upload, Preview, Caption, Delete      │
│    ├─ [Prices]: Single (₦25k) & Double (₦45k)          │
│    └─ [Video & Contact]: Video URL & WhatsApp Number   │
│ 3. Storage Service (`src/services/adminStorage.ts`)    │
│    └─ LocalStorage + Event Emitter for live updates   │
└────────────────────────────────────────────────────────┘
```

#### State & Hook Contract
```typescript
interface AdminSettings {
  reviewScreenshots: Array<{
    id: string;
    url: string; // Base64 data URL
    caption?: string;
    uploadedAt: string;
  }>;
  singlePrice: number;
  doublePrice: number;
  videoUrl: string | null;
  whatsappNumber: string;
}
```
