# FRANKBLAISE PARTS — FRANKBLAISE ELECTRIC FUEL PUMP PLUS Landing Page

A conversion-focused, mobile-first product landing page for **FRANKBLAISE PARTS**, built with React 18/19, TypeScript, Vite, and Tailwind CSS.

> **CRITICAL COMPONENT IDENTITY**: This product is an **automotive vehicle electric fuel pump** (a compact cylindrical replacement fuel pump submerged in the vehicle fuel tank, equipped with wiring connector, and inlet strainer mesh). It is **not** a petrol station dispenser.

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
The app will run locally on `http://localhost:3000`.

### 3. Production Build & Preview
```bash
npm run build
npm run preview
```

---

## Configuration Guide (`src/config/site.ts`)

All seller-supplied parameters, prices, media assets, and verified specifications are managed centrally in `src/config/site.ts`.

### 1. Connecting Order Submissions (`orderEndpointUrl`)
By default, `orderEndpointUrl` is set to `""`. In this state, the form acts as a prototype, showing a clear notice and safely disabling submissions to avoid recording false orders.

To connect order processing:
- **Formspree**: Set `orderEndpointUrl: "https://formspree.io/f/YOUR_FORM_ID"`
- **Google Apps Script / Webhook**: Set `orderEndpointUrl: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"`
- **Custom REST API**: Set `orderEndpointUrl: "https://api.yourdomain.com/orders"`

The form automatically dispatches a JSON payload with:
```json
{
  "product": "FRANKBLAISE ELECTRIC FUEL PUMP PLUS",
  "package": "1 Fuel Pump" or "2 Fuel Pumps",
  "quantity": 1,
  "productTotal": 25000,
  "deliveryTerms": "pending seller confirmation",
  "customer": {
    "fullName": "...",
    "primaryPhone": "+2348012345678",
    "altPhone": "...",
    "whatsappNumber": "..."
  },
  "vehicle": {
    "make": "Toyota",
    "model": "Camry",
    "productionYear": "2008",
    "engineTypeSize": "2.4L",
    "existingPartNumber": "..."
  },
  "delivery": {
    "state": "Lagos",
    "cityTown": "Ikeja",
    "fullAddress": "...",
    "nearestLandmark": "..."
  }
}
```

### 2. WhatsApp Direct Support & Ordering (`whatsappNumber`)
- By default, `whatsappNumber` is `""`.
- The floating WhatsApp button and post-submission WhatsApp launcher remain completely hidden until a valid international number is entered (e.g., `"2348012345678"`).

### 3. Product Video (`video`)
- Provide a direct link to an MP4/WebM video in `video.url` and a poster image in `video.poster`.
- If null, the page renders an accessible, labeled placeholder with no fake play controls.

### 4. Verified Specifications (`confirmedSpecs`)
- To prevent unverified claims, all technical rows (material, operating voltage, dimensions, connector type, compatible models, package contents, warranty) display `"Please confirm with the seller."` by default.
- Fill in verified values in `confirmedSpecs` as they are confirmed.

### 5. Genuine Review Screenshots (`reviewScreenshots`) & Seller Admin Panel
- **Client Admin Portal**: The store owner can upload genuine WhatsApp review screenshots directly from their phone or laptop without touching any code!
  - Click **"Seller Portal"** in the footer (or the upload button in the Customer Experiences section).
  - Enter passcode: `frankblaise2026`.
  - Select screenshot files, add customer captions, and click Save.
  - Review screenshots are saved into browser storage and instantly appear in the Customer Experiences carousel with touch swipe and lightbox enlargement.
  - The Admin Panel also allows adjusting product package pricing and updating the video demonstration URL or WhatsApp contact number.
- **Privacy notice**: Always redact customer full phone numbers, house numbers, or private details before publishing review screenshots.

---

## Deployment & Vercel Configuration

The project includes `vercel.json` for single-page application (SPA) routing:

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

### Deploying to Vercel:
1. Push your repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and import the repository.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Click **Deploy**.

### Setting Up a Custom Domain on Vercel:
1. Go to your project settings in Vercel &rarr; **Domains**.
2. Enter your custom domain (e.g. `parts.frankblaise.com` or `frankblaiseparts.com`).
3. Add the DNS `CNAME` or `A` records supplied by Vercel in your domain registrar (Namecheap, GoDaddy, Whogohost, etc.).

---

## Pre-Launch Checklist

Before going live with ad campaigns or customer traffic:

- [ ] **Real Product Photos**: Confirm images for all gallery slots (pump, packaging, accessories, connector).
- [ ] **Video Asset**: Upload a genuine demo video or confirm whether to hide the section.
- [ ] **Verified Specifications**: Confirm voltage, dimensions, and compatibility list with technical team.
- [ ] **Warranty Terms**: Verify and configure the confirmed warranty duration and claim procedure in `confirmedWarrantyTerms`.
- [ ] **Delivery Terms**: Confirm courier coverage, transit timelines, and inspection terms for all 36 Nigerian states.
- [ ] **WhatsApp Number**: Configure active seller customer service WhatsApp number in `src/config/site.ts`.
- [ ] **Order Endpoint**: Test form submission with your live endpoint (Formspree, Google Sheets, or backend database).
- [ ] **Customer Privacy**: Verify that any client review screenshots have phone numbers and sensitive addresses redacted.
