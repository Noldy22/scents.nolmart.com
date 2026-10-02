# 🌸 NolMart Scents — Official Web Platform (`scents.nolmart.com`)

> **Luxury Artisanal Perfumery & Signature Fragrance Blends**  
> Dedicated sub-brand of **[NolMart](https://nolmart.com)**.

[![Website](https://img.shields.io/badge/Website-scents.nolmart.com-0f386b?style=for-the-badge&logo=googlechrome&logoColor=white)](https://scents.nolmart.com)
[![Parent Brand](https://img.shields.io/badge/Parent_Store-nolmart.com-2174db?style=for-the-badge&logo=shopify&logoColor=white)](https://nolmart.com)
[![WhatsApp Order](https://img.shields.io/badge/WhatsApp_Order-+255_695_557_358-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/255695557358)

---

## 🌟 Overview

**NolMart Scents** is engineered to deliver high-converting, luxury digital shopping for artisanal fragrances in Tanzania. Every scent is formulated using our strict **60% pure fragrance oil : 40% perfumer's ethanol** ratio, fortified with **3 drops of molecular fixative** per bottle for unmatched 12+ hour skin longevity.

This repository powers the official subdomain **[scents.nolmart.com](https://scents.nolmart.com)**, adhering to NolMart's established e-commerce checkout architecture while elevating visual luxury, micro-interactions, and mobile conversion.

---

## ✨ Key Features & High-Conversion UX

- 🔮 **Interactive 30-Second Scent Matcher Quiz**: AI-styled matching algorithm guiding customers to their signature scent (Flagships, Gourmands, Aquatics, Florals) with 1-click add-to-bag.
- 👑 **Flagship Collection Showcase**: Prominent hero spotlight for NolMart's proprietary house formulas:
  - **Crown Noir** (Men's Bold Flagship • 212 VIP Men + Tom Ford Noir Extreme)
  - **Cashmere Bloom** (Women's Elegant Flagship • Marshmallow + Burberry Weekend)
  - **Azure VIP** (Men's Calm Flagship • 212 VIP Men + Vanilla 28)
  - **Onyx Bloom** (Women's Bold Flagship • Tom Ford Noir Extreme + Pink Chiffon)
- 💧 **Real-Time Size & Price Toggle**: Seamless 10ml (Pocket/Travel Atomizer) vs 30ml (Luxury Crystal Bottle) switcher directly on cards and product details.
- 🛍️ **Slide-Out Floating Cart Drawer**: Real-time reactive badge counter, thumbnail previews, quantity steppers, and free delivery thresholds matching the main NolMart store standard.
- 💬 **WhatsApp Express Checkout**: Auto-generates structured, professional receipts with customer details, bottle sizes, quantities, and totals in Tanzanian Shillings (TZS) directly to `+255 695 557 358`.
- 📱 **Mobile-First Luxury Design**: Sticky bottom action bar, instant WhatsApp 1-click buy, and fast asset loading on mobile networks.
- 🌿 **Fragrance Architecture (Pyramids)**: Visual breakdown of Top, Heart, and Base notes, plus longevity and sillage ratings.
- 🎁 **Discovery Sets & Up-Sells**: "Try & Buy" (3 × 10ml for 25,000 TZS), His & Hers Couple Packs, and Luxury Duo sets.

---

## 📂 Project Structure

```
scents.nolmart.com/
├── index.html              # Main luxury landing page & interactive quiz
├── products.html           # Full fragrance catalog with live filters & search
├── product.html            # Dedicated product detail page with Scent Pyramid
├── about.html              # Artisanal 60/40 formula story & brand philosophy
├── contact.html            # Direct WhatsApp, phone, delivery & M-Pesa guide
├── CNAME                   # Custom domain pointer (scents.nolmart.com)
├── vercel.json             # Deployment headers, security rules & clean URLs
├── package.json            # Node.js scripts for local serving
├── css/
│   └── style.css           # Luxury perfumery design system (Poppins + Playfair Display)
├── js/
│   ├── config.js           # Central store configuration (WhatsApp number, currency)
│   ├── products-data.js    # Exhaustive 27-fragrance catalog from SOP v3.1
│   ├── cart.js             # LocalStorage cart state management & event dispatcher
│   ├── cart-drawer.js      # Sliding drawer UI & WhatsApp order formatter
│   ├── scent-quiz.js       # Interactive 3-step recommendation engine
│   └── main.js             # Main page controller & UI bindings
└── img/
    ├── logo-horizontal.png  # Header navigation logo (High-DPI transparent)
    ├── logo-stacked.png     # Flagship stacked logo
    ├── logo-dark.png        # Luxury navy edition logo
    ├── logo-icon.png        # Perfume bottle app icon
    ├── favicon.ico          # Browser tab icon
    └── products/            # 27 custom rendered luxury perfume bottle shots
        ├── crown-noir.png
        ├── cashmere-bloom.png
        ├── azure-vip.png
        ├── onyx-bloom.png
        ├── obsidian-reef.png
        └── ...
```

---

## 🚀 Local Testing (PC & Mobile)

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

## 🌐 Deployment to Subdomain `scents.nolmart.com`

### Option 1: Vercel (Recommended)
1. In Vercel, click **Add New Project** and import the GitHub repository `Noldy22/scents.nolmart.com`.
2. In Project Settings > **Domains**, add `scents.nolmart.com`.
3. In your DNS provider (e.g., Cloudflare or cPanel for `nolmart.com`), add a CNAME record:
   - **Type**: `CNAME`
   - **Name**: `scents`
   - **Target**: `cname.vercel-dns.com`

### Option 2: GitHub Pages
1. Go to repository Settings > **Pages** > Source: `Deploy from branch main / root`.
2. Under Custom Domain, enter `scents.nolmart.com` (already preconfigured in `CNAME`).
3. Add a CNAME in your DNS for `scents` pointing to `noldy22.github.io`.

---

## 🎨 Official Brand Palette

- **Primary Navy**: `#0f386b`
- **Accent Vibrant Blue**: `#2174db`
- **Champagne Gold**: `#c5a059` / `#d4af37`
- **WhatsApp Green**: `#25D366`
- **Cream Backdrop**: `#faf8f5`
- **Typography**: Poppins & Playfair Display

---

## 📞 Business Contact

- **Parent Company**: NolMart ([nolmart.com](https://nolmart.com))
- **WhatsApp Orders**: [+255 695 557 358](https://wa.me/255695557358)
- **Nationwide Coverage**: Dar es Salaam, Arusha, Mwanza, Dodoma, Zanzibar
