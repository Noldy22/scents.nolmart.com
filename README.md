# NolMart Scents: Official Web Platform (`scents.nolmart.com`)

> **Luxury Long-Lasting Perfumes & Signature Fragrance Blends**  
> Dedicated sub-brand of **[NolMart](https://nolmart.com)**.

[![Website](https://img.shields.io/badge/Website-scents.nolmart.com-0f386b?style=for-the-badge&logo=googlechrome&logoColor=white)](https://scents.nolmart.com)
[![Parent Brand](https://img.shields.io/badge/Parent_Store-nolmart.com-2174db?style=for-the-badge&logo=shopify&logoColor=white)](https://nolmart.com)
[![WhatsApp Order](https://img.shields.io/badge/WhatsApp_Order-+255_695_557_358-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/255695557358)

---

## Overview

**NolMart Scents** is the online shop for long-lasting NolMart perfumes in Tanzania. Every fragrance is made with high-concentration oils for strong projection and 12+ hours on skin.

This repository powers the official web platform **[scents.nolmart.com](https://scents.nolmart.com)** (and [noldy22.github.io/scents.nolmart.com](https://noldy22.github.io/scents.nolmart.com/)), adhering to NolMart's established e-commerce checkout architecture while offering modern aesthetics, smooth scroll animations, and fast mobile performance.

---

## Key Features

- **Interactive 5-Step Scent Matcher Quiz**: Smart recommendation engine matching customers based on who they're shopping for, scent vibe, daily occasion, strength preference, and ideal bottle size, with 1-click add-to-bag.
- **Flagship Collection Spotlight**: House signature fragrances with dedicated storytelling and scent notes:
  - **Crown Noir** (Men's Bold Flagship)
  - **Cashmere Bloom** (Women's Elegant Flagship)
  - **Azure VIP** (Men's Fresh & Calm Flagship)
  - **Onyx Bloom** (Women's Bold & Sweet Flagship)
- **Real-Time Size & Price Switcher**: Seamless 10ml (Pocket & Travel Atomizer) vs 30ml (Full Luxury Crystal Bottle) switcher directly on cards and product details.
- **Slide-Out Shopping Bag Drawer**: Gender-neutral, modern slide-out cart with item counters, thumbnail previews, quantity steppers, and free delivery qualifiers.
- **WhatsApp Express Checkout**: Instantly formats structured, professional receipts with customer items, selected bottle sizes, quantities, and totals in Tanzanian Shillings (TZS) sent directly to `+255 695 557 358`.
- **Accepted Payment Methods**: Support for **Vodacom M-Pesa**, **Airtel Money**, **Selcom Pay**, **CRDB Bank (SimBanking)**, and **Cash on Delivery**.
- **Nationwide Delivery**: Fast 24-48 hour doorstep delivery to **all regions in Tanzania** with safe, protective packaging.
- **Fragrance Scent Notes**: Clear breakdown of Top, Heart, and Base notes, plus longevity and scent trail ratings.
- **Discovery Sets & Up-Sells**: "Try & Buy" (3 × 10ml for 35,000 TZS), His & Hers Couple Packs, and Luxury Duo sets.
- **Premium Motion & Scroll Animations**: Every scroll animation is bidirectional: it plays scrolling down, rewinds scrolling up and replays endlessly (GSAP ScrollTrigger + Lenis inertia scrolling, `prefers-reduced-motion` respected).
- **Real-Time 3D Bottles (Three.js)**: The home page hero + flagship chapters scroll over a pinned 3D NolMart bottle that spins and morphs between scents; every product page has a drag-to-rotate 3D viewer. Each bottle size has its own Blender model in `models/` (30ml: fluted glass, gold pump, ivory cap, navy label; 10ml: slim vial with a black cap and a paper name band; 6ml: a shorter 10ml vial). Labels are painted live with each scent's name, and the liquid colour comes from `js/bottle-palette.js`. Falls back to photos when WebGL is unavailable.

---

## Project Structure

```
scents.nolmart.com/
├── index.html              # Main luxury landing page, 5-step quiz & catalog
├── products.html           # Full fragrance catalog with live category filters & search
├── product.html            # Dedicated product detail page with scent notes & specs
├── contact.html            # Contact, delivery across all regions & payment guide
├── CNAME                   # Custom domain pointer (scents.nolmart.com)
├── vercel.json             # Deployment headers, security rules & clean URLs
├── package.json            # Lightweight Node scripts for local preview
├── css/
│   └── style.css           # Luxury design system, animations & responsive styling
├── js/
│   ├── config.js           # Central store configuration (WhatsApp number, currency)
│   ├── products-data.js    # Exhaustive 27-fragrance catalog with notes & specs
│   ├── cart.js             # LocalStorage cart state management & event bus
│   ├── cart-drawer.js      # Sliding drawer UI & WhatsApp order formatter
│   ├── scent-quiz.js       # 5-step interactive scent matcher algorithm
│   ├── main.js             # Home page controller & UI bindings
│   ├── motion.js           # Site-wide bidirectional scroll animations & smooth scroll
│   ├── bottle3d.js         # Loads the brand bottle GLB, live label printing, viewer
│   ├── bottle-palette.js   # Liquid colours per scent
│   ├── home-stage.js       # Scroll-driven 3D hero + flagship chapters
│   └── vendor/             # three.js r170, GSAP 3.13 (ScrollTrigger, SplitText), Lenis
└── img/
    ├── logo-light.png       # Ivory/blue logo for the dark header & footer
    ├── logo-transparent.png # Original navy logo (transparent high-res)
    ├── logo-horizontal.png  # Horizontal logo badge
    ├── logo-stacked.png     # Stacked brand logo
    ├── logo-dark.png        # Luxury dark edition logo
    ├── logo-icon.png        # Perfume bottle app icon
    ├── favicon.ico          # Browser tab icon
    └── products/            # Product shots rendered from the 3D bottles, one per size (WebP)
        ├── crown-noir.png
        ├── cashmere-bloom.png
        ├── azure-vip.png
        ├── onyx-bloom.png
        ├── obsidian-reef.png
        └── ...
```

---

## Updating the 3D Bottles

1. Export the bottles from Blender (`D:/projects/3D Models/brand_bottle/export_perfume.py` for 30ml,
   `D:/projects/3D Models/brand_bottle_10ml/export_10ml.py` for 10ml).
2. Make the light web copies:
   - `python tools/optimize_bottle_glb.py "<path>/nolmart_obsidian_reef.glb" models/nolmart-bottle-30ml.glb`
   - `python tools/optimize_bottle_glb.py "<path>/nolmart_azure_vip_10ml.glb" models/nolmart-bottle-10ml.glb`
   - `python tools/optimize_bottle_glb.py "<path>/nolmart_azure_vip_10ml.glb" models/nolmart-bottle-6ml.glb --shorten 0.014 0.078 0.031`
     (the 6ml vial is the 10ml one with a 31 mm shorter glass body)
3. Re-render the product images: run `node tools/dev-server.mjs`, open `http://127.0.0.1:3000/tools/render-product-images.html`,
   then convert the PNGs it writes in `img/products/` to 640px WebP (quality 88).

## Local Testing (PC & Mobile)

To test the appearance locally on your PC and your mobile phone on the same Wi-Fi network:

```bash
# 1. Navigate to the project directory
cd "d:\coding\web coding\scents.nolmart.com"

# 2. Start a lightweight local server
npx serve . -p 3000
```

- **On your PC**: Open [http://localhost:3000](http://localhost:3000)
- **On your Mobile Phone**: Connect to the same Wi-Fi and open `http://<YOUR_PC_LOCAL_IP>:3000` (e.g. `http://192.168.1.100:3000`).

---

## Deployment to Subdomain `scents.nolmart.com`

### Option 1: GitHub Pages (Current Live Test)
- **Test URL**: [https://noldy22.github.io/scents.nolmart.com/](https://noldy22.github.io/scents.nolmart.com/)
- Repository Settings > **Pages** > Source: `Deploy from branch main / root`.
- Custom domain `scents.nolmart.com` is configured in `CNAME`.

### Option 2: Vercel (Production)
1. In Vercel, click **Add New Project** and import the GitHub repository `Noldy22/scents.nolmart.com`.
2. In Project Settings > **Domains**, add `scents.nolmart.com`.
3. In your DNS provider (e.g., Cloudflare or cPanel for `nolmart.com`), add a CNAME record:
   - **Type**: `CNAME`
   - **Name**: `scents`
   - **Target**: `cname.vercel-dns.com`

---

## Official Brand Palette

- **Primary Navy**: `#0f386b`
- **Deep Midnight**: `#081d38`
- **Accent Vibrant Blue**: `#2174db`
- **Champagne Gold**: `#c5a059` / `#d4af37`
- **WhatsApp Green**: `#25D366`
- **Cream Backdrop**: `#faf8f5`
- **Typography**: Poppins & Playfair Display

---

## Business Contact

- **Parent Brand**: NolMart ([nolmart.com](https://nolmart.com))
- **WhatsApp Orders**: [+255 695 557 358](https://wa.me/255695557358)
- **Delivery Coverage**: All Regions in Tanzania
- **Accepted Payments**: Vodacom M-Pesa, Airtel Money, Selcom Pay, CRDB Bank, Cash on Delivery
