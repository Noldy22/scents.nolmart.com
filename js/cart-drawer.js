// js/cart-drawer.js
// Interactive Floating Cart Drawer & WhatsApp Express Checkout

import {
    getCart,
    removeItemFromCart,
    updateItemQuantity,
    getCartTotalPrice,
    getCartTotalCount,
    clearCart
} from './cart.js';
import { CONFIG } from './config.js';

export function initCartDrawer() {
    renderCartDrawer();
    updateCartBadges();

    // Listen for custom cartUpdated events
    window.addEventListener('cartUpdated', () => {
        renderCartDrawer();
        updateCartBadges();
    });

    // Wire open/close buttons
    document.querySelectorAll('.open-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openCartDrawer();
        });
    });

    const closeBtn = document.getElementById('closeCartDrawerBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCartDrawer);
    }

    const backdrop = document.getElementById('cartDrawerBackdrop');
    if (backdrop) {
        backdrop.addEventListener('click', closeCartDrawer);
    }

    // Checkout button
    const checkoutBtn = document.getElementById('cartCheckoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleWhatsAppCheckout);
    }
}

export function openCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const backdrop = document.getElementById('cartDrawerBackdrop');
    if (drawer && backdrop) {
        drawer.classList.add('open');
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';

        // Pre-fill customer details from localStorage if available
        try {
            const savedName = localStorage.getItem('nolmart_customer_name');
            const savedLoc = localStorage.getItem('nolmart_customer_location');
            const nameEl = document.getElementById('cartCustomerName');
            const locEl = document.getElementById('cartDeliveryLocation');
            if (savedName && nameEl && !nameEl.value) nameEl.value = savedName;
            if (savedLoc && locEl && !locEl.value) locEl.value = savedLoc;
        } catch(e) {}
    }
}

export function closeCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const backdrop = document.getElementById('cartDrawerBackdrop');
    if (drawer && backdrop) {
        drawer.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
    }
}

export function updateCartBadges() {
    const count = getCartTotalCount();
    document.querySelectorAll('.cart-badge-count').forEach(el => {
        el.textContent = count;
        if (count > 0) {
            el.classList.add('has-items');
        } else {
            el.classList.remove('has-items');
        }
    });

    // Update bottom mobile bar if present
    const mobileTotal = document.getElementById('mobileBarTotal');
    if (mobileTotal) {
        mobileTotal.textContent = `Tzs ${getCartTotalPrice().toLocaleString('en-US')}`;
    }
}

export function renderCartDrawer() {
    const cart = getCart();
    const container = document.getElementById('cartDrawerItems');
    const emptyState = document.getElementById('cartEmptyState');
    const footer = document.getElementById('cartDrawerFooter');
    const totalEl = document.getElementById('cartDrawerSubtotal');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'flex';
        if (footer) footer.style.display = 'none';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (footer) footer.style.display = 'block';

    const total = getCartTotalPrice();
    if (totalEl) {
        totalEl.textContent = `Tzs ${total.toLocaleString('en-US')}`;
    }

    container.innerHTML = cart.map(item => {
        const itemTotal = (item.price * item.quantity).toLocaleString('en-US');
        const unitPrice = item.price.toLocaleString('en-US');

        return `
            <div class="cart-drawer-item" data-key="${item.itemKey}">
                <div class="cart-item-thumb">
                    <img src="${item.imageUrl}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-header">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <button class="cart-item-remove-btn" data-key="${item.itemKey}" title="Remove item" aria-label="Remove ${item.name}">
                            &times;
                        </button>
                    </div>
                    <div class="cart-item-meta">
                        <span class="cart-item-size-pill">${item.size}</span>
                        <span class="cart-item-unit-price">Tzs ${unitPrice}</span>
                    </div>
                    <div class="cart-item-bottom">
                        <div class="quantity-stepper">
                            <button class="qty-btn qty-minus" data-key="${item.itemKey}">−</button>
                            <span class="qty-val">${item.quantity}</span>
                            <button class="qty-btn qty-plus" data-key="${item.itemKey}">+</button>
                        </div>
                        <div class="cart-item-subtotal">Tzs ${itemTotal}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Attach listeners for remove and quantity
    container.querySelectorAll('.cart-item-remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.key;
            removeItemFromCart(key);
            showToast("Item removed from bag");
        });
    });

    container.querySelectorAll('.qty-minus').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.key;
            const item = cart.find(i => i.itemKey === key);
            if (item) {
                updateItemQuantity(key, item.quantity - 1);
            }
        });
    });

    container.querySelectorAll('.qty-plus').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.key;
            const item = cart.find(i => i.itemKey === key);
            if (item) {
                updateItemQuantity(key, item.quantity + 1);
            }
        });
    });
}

function handleWhatsAppCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        showToast("Your shopping bag is empty");
        return;
    }

    const nameInput = document.getElementById('cartCustomerName');
    const locationInput = document.getElementById('cartDeliveryLocation');
    const paymentSelect = document.getElementById('cartPaymentPref');

    const customerName = nameInput ? nameInput.value.trim() : '';
    const deliveryLocation = locationInput ? locationInput.value.trim() : '';
    const paymentMethod = paymentSelect ? paymentSelect.value : 'Vodacom M-Pesa';

    if (!customerName) {
        if (nameInput) {
            nameInput.classList.add('input-error');
            nameInput.focus();
            setTimeout(() => nameInput.classList.remove('input-error'), 2500);
        }
        showToast("Please enter your name for the delivery receipt", 3000);
        return;
    }

    // Persist details locally for repeat orders
    try {
        localStorage.setItem('nolmart_customer_name', customerName);
        if (deliveryLocation) localStorage.setItem('nolmart_customer_location', deliveryLocation);
    } catch(e) {}

    let message = `*🛍️ NEW ORDER — NOLMART SCENTS*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `*Customer Details:*\n`;
    message += `• *Name:* ${customerName}\n`;
    message += `• *Delivery Location:* ${deliveryLocation || "All Regions in Tanzania"}\n`;
    message += `• *Payment Preference:* ${paymentMethod}\n\n`;
    message += `*Selected Fragrances:*\n`;

    cart.forEach((item, index) => {
        const itemTotal = (item.price * item.quantity).toLocaleString('en-US');
        message += `${index + 1}. *${item.name}* (${item.size})\n`;
        message += `   Qty: ${item.quantity} × Tzs ${item.price.toLocaleString('en-US')} = *Tzs ${itemTotal}*\n`;
    });

    const total = getCartTotalPrice().toLocaleString('en-US');
    message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*Total Amount:* *Tzs ${total}*\n\n`;
    message += `Please confirm my order and send payment & delivery details. Thank you!`;

    const encoded = encodeURIComponent(message);
    // Universal WhatsApp link directly intercepted by mobile apps
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${CONFIG.WHATSAPP_NUMBER}&text=${encoded}`;

    showToast("Connecting to WhatsApp...", 2000);

    // Direct synchronous navigation ensures WhatsApp opens on all mobile devices without popup blockers
    window.location.href = whatsappUrl;
}

// Single-product Instant WhatsApp Buy Now
export function directWhatsAppOrder(product, size = "30ml", quantity = 1) {
    const price = product.prices[size] || Object.values(product.prices)[0] || 0;
    const total = (price * quantity).toLocaleString('en-US');

    let message = `*✨ INSTANT ORDER — NOLMART SCENTS*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `Hello NolMart Scents! I would like to order:\n\n`;
    message += `• *Fragrance:* ${product.name}\n`;
    message += `• *Size:* ${size}\n`;
    message += `• *Quantity:* ${quantity}\n`;
    message += `• *Total Price:* *Tzs ${total}*\n\n`;
    message += `Please share payment details (M-Pesa / Airtel Money / Selcom / CRDB) and delivery timeline. Thank you!`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${CONFIG.WHATSAPP_NUMBER}&text=${encoded}`;
    window.location.href = whatsappUrl;
}

// Toast notification helper
export function showToast(message, duration = 3000) {
    let container = document.getElementById('toastNotificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastNotificationContainer';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <span class="toast-icon">✨</span>
        <span class="toast-text">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('visible');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}
