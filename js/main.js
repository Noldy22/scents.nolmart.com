// js/main.js
// Main JavaScript logic for NolMart Scents

import { PRODUCTS, getProductById, getFlagshipProducts, getBestsellerProducts } from './products-data.js';
import { addItemToCart, getCartTotalCount } from './cart.js';
import { initCartDrawer, openCartDrawer, directWhatsAppOrder, showToast } from './cart-drawer.js';
import { initScentQuiz } from './scent-quiz.js';
import { CONFIG } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Cart Drawer
    initCartDrawer();

    // 2. Initialize Scent Quiz if on page
    initScentQuiz();

    // 3. Mobile Navigation Menu Toggle
    initMobileNav();

    // 4. Render Flagship Showcase on Home Page
    renderFlagshipShowcase();

    // 5. Render Products Grid (Home or Products page)
    renderProductsGrid();

    // 6. Search Bar Autocomplete / Modal
    initSearch();

    // 7. Announcement Bar dismiss / ticker
    initAnnouncement();

    // 8. Luxury Scroll Animations & Header Elevation
    initScrollAnimations();
});

// Mobile Nav Toggle
function initMobileNav() {
    const burger = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('mainNavMenu');
    if (burger && navMenu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            navMenu.classList.toggle('open');
            document.body.classList.toggle('menu-open');
        });

        // Close on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navMenu.classList.remove('open');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

// Render Flagship Showcase Cards on Home Page
function renderFlagshipShowcase() {
    const container = document.getElementById('flagshipsContainer');
    if (!container) return;

    const flagships = getFlagshipProducts();

    container.innerHTML = flagships.map(p => {
        const price10 = p.prices["10ml"] ? `Tzs ${p.prices["10ml"].toLocaleString('en-US')}` : '';
        const price30 = p.prices["30ml"] ? `Tzs ${p.prices["30ml"].toLocaleString('en-US')}` : '';

        return `
            <div class="flagship-card" data-product-id="${p.id}">
                <div class="flagship-badge">${p.badge}</div>
                <div class="flagship-img-wrap">
                    <img src="${p.imageUrl}" alt="${p.name}" loading="lazy">
                </div>
                <div class="flagship-details">
                    <span class="flagship-gender-tag">${p.gender.toUpperCase()}</span>
                    <h3 class="flagship-name">${p.name}</h3>
                    <p class="flagship-tagline">${p.tagline}</p>
                    <div class="flagship-notes-preview">
                        <span><strong>Notes:</strong> ${p.notes.top[0]}, ${p.notes.heart[0]}, ${p.notes.base[0]}</span>
                    </div>

                    <!-- Size Switcher -->
                    <div class="size-switch-wrap">
                        <button class="size-pill-btn active" data-size="30ml">30ml (${price30})</button>
                        <button class="size-pill-btn" data-size="10ml">10ml (${price10})</button>
                    </div>

                    <div class="flagship-card-actions">
                        <button class="btn btn-primary add-to-bag-btn" data-id="${p.id}" data-size="30ml">
                            Add to Bag
                        </button>
                        <button class="btn btn-whatsapp-icon wa-quick-btn" data-id="${p.id}" data-size="30ml" title="Order via WhatsApp">
                            💬
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    attachCardEventListeners(container);
}

// Render Products Grid with Category Filter Tabs
function renderProductsGrid() {
    const container = document.getElementById('productsGridContainer');
    if (!container) return;

    const filterTabs = document.querySelectorAll('.category-filter-tab');
    let currentCategory = 'all';

    function render(category = 'all') {
        let items = PRODUCTS;
        if (category === 'flagships') {
            items = PRODUCTS.filter(p => p.category === 'flagship');
        } else if (category === 'men') {
            items = PRODUCTS.filter(p => p.gender === 'men' || p.gender === 'unisex');
        } else if (category === 'women') {
            items = PRODUCTS.filter(p => p.gender === 'women' || p.gender === 'unisex');
        } else if (category === 'pure') {
            items = PRODUCTS.filter(p => p.category === 'pure');
        } else if (category === 'signature') {
            items = PRODUCTS.filter(p => p.category === 'signature');
        } else if (category === 'bundles') {
            items = PRODUCTS.filter(p => p.category === 'bundle');
        }

        container.innerHTML = items.map(p => {
            const has10 = !!p.prices["10ml"];
            const has30 = !!p.prices["30ml"];
            const defaultSize = p.defaultSize || "30ml";
            const defaultPrice = p.prices[defaultSize] || Object.values(p.prices)[0] || 0;

            return `
                <div class="product-card" data-product-id="${p.id}">
                    <div class="product-badge-tag">${p.badge}</div>
                    <a href="product.html?id=${p.id}" class="product-card-link">
                        <div class="product-img-box">
                            <img src="${p.imageUrl}" alt="${p.name}" loading="lazy">
                        </div>
                    </a>
                    <div class="product-info-box">
                        <div class="product-cat-label">${p.category.toUpperCase()} • ${p.gender.toUpperCase()}</div>
                        <h4 class="product-title"><a href="product.html?id=${p.id}">${p.name}</a></h4>
                        <p class="product-short-notes">${p.notes.top.slice(0, 2).join(' • ')}</p>

                        <!-- Size Switcher -->
                        ${(has10 && has30) ? `
                            <div class="product-card-sizes">
                                <button class="card-size-opt active" data-size="30ml">30ml</button>
                                <button class="card-size-opt" data-size="10ml">10ml</button>
                            </div>
                        ` : `
                            <div class="product-card-sizes">
                                <span class="single-size-label">${defaultSize}</span>
                            </div>
                        `}

                        <div class="product-price-row">
                            <span class="product-price-val" data-base-price="${defaultPrice}">
                                Tzs ${defaultPrice.toLocaleString('en-US')}
                            </span>
                        </div>

                        <div class="product-action-row">
                            <button class="btn btn-outline-primary card-add-bag-btn" data-id="${p.id}" data-size="${defaultSize}">
                                🛒 Add
                            </button>
                            <button class="btn btn-whatsapp card-wa-buy-btn" data-id="${p.id}" data-size="${defaultSize}">
                                Order
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        attachCardEventListeners(container);
    }

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category;
            render(currentCategory);
        });
    });

    render('all');
}

// Wire dynamic card size switcher and buttons
function attachCardEventListeners(container) {
    // 1. Size buttons inside cards
    container.querySelectorAll('.product-card, .flagship-card').forEach(card => {
        const productId = card.dataset.productId;
        const product = getProductById(productId);
        if (!product) return;

        const sizeBtns = card.querySelectorAll('.card-size-opt, .size-pill-btn');
        const priceVal = card.querySelector('.product-price-val');
        const addBtn = card.querySelector('.add-to-bag-btn, .card-add-bag-btn');
        const waBtn = card.querySelector('.wa-quick-btn, .card-wa-buy-btn');

        sizeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                sizeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const chosenSize = btn.dataset.size;
                const newPrice = product.prices[chosenSize];

                if (priceVal && newPrice) {
                    priceVal.textContent = `Tzs ${newPrice.toLocaleString('en-US')}`;
                }

                if (addBtn) addBtn.dataset.size = chosenSize;
                if (waBtn) waBtn.dataset.size = chosenSize;
            });
        });
    });

    // 2. Add to Bag buttons
    container.querySelectorAll('.add-to-bag-btn, .card-add-bag-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.dataset.id;
            const size = btn.dataset.size || "30ml";
            const product = getProductById(id);
            if (product) {
                addItemToCart(product, size, 1);
                showToast(`Added ${product.name} (${size}) to shopping bag!`);
                openCartDrawer();
            }
        });
    });

    // 3. Quick WhatsApp Order buttons
    container.querySelectorAll('.wa-quick-btn, .card-wa-buy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.dataset.id;
            const size = btn.dataset.size || "30ml";
            const product = getProductById(id);
            if (product) {
                directWhatsAppOrder(product, size, 1);
            }
        });
    });
}

// Search Modal / Autocomplete
function initSearch() {
    const searchOpenBtn = document.getElementById('openSearchModalBtn');
    const searchModal = document.getElementById('searchModal');
    const searchCloseBtn = document.getElementById('closeSearchModalBtn');
    const searchInput = document.getElementById('siteSearchInput');
    const searchResults = document.getElementById('searchResultsContainer');

    if (!searchOpenBtn || !searchModal) return;

    searchOpenBtn.addEventListener('click', (e) => {
        e.preventDefault();
        searchModal.classList.add('active');
        if (searchInput) searchInput.focus();
    });

    if (searchCloseBtn) {
        searchCloseBtn.addEventListener('click', () => {
            searchModal.classList.remove('active');
        });
    }

    if (searchInput && searchResults) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            if (query.length < 2) {
                searchResults.innerHTML = '<p class="search-empty-hint">Type at least 2 characters to search scents by name, note, or vibe...</p>';
                return;
            }

            const matches = PRODUCTS.filter(p => {
                const inName = p.name.toLowerCase().includes(query);
                const inDesc = p.description.toLowerCase().includes(query);
                const inNotes = Object.values(p.notes).flat().some(n => n.toLowerCase().includes(query));
                const inTag = p.tagline.toLowerCase().includes(query);
                return inName || inDesc || inNotes || inTag;
            });

            if (matches.length === 0) {
                searchResults.innerHTML = `<p class="search-no-results">No scents found matching "${query}". Try searching "vanilla", "oud", "fresh", or "sweet".</p>`;
                return;
            }

            searchResults.innerHTML = matches.map(p => `
                <a href="product.html?id=${p.id}" class="search-result-item">
                    <img src="${p.imageUrl}" alt="${p.name}">
                    <div class="search-item-info">
                        <h5>${p.name}</h5>
                        <p>${p.tagline}</p>
                        <span class="search-item-price">From Tzs ${(p.prices["10ml"] || Object.values(p.prices)[0]).toLocaleString('en-US')}</span>
                    </div>
                </a>
            `).join('');
        });
    }
}

function initAnnouncement() {
    const bar = document.querySelector('.announcement-banner');
    if (!bar) return;
    // Keep visible for high conversion reassurance
}

// 8. Luxury Scroll Animations
function initScrollAnimations() {
    // A. Header scroll elevation
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 25) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // B. IntersectionObserver for Reveal Animations
    function attachReveals() {
        const targets = document.querySelectorAll(
            '.flagship-card, .product-card, .why-feature-box, .testimonial-card, .bundle-showcase-card'
        );

        targets.forEach((el) => {
            if (!el.classList.contains('reveal-up')) {
                el.classList.add('reveal-up');
            }
        });

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        obs.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.05,
                rootMargin: '100px 0px -20px 0px'
            });

            document.querySelectorAll('.reveal-up:not(.is-revealed)').forEach(el => observer.observe(el));
        } else {
            document.querySelectorAll('.reveal-up').forEach(el => el.classList.add('is-revealed'));
        }
    }

    // Initial attach
    attachReveals();

    // Re-observe when filter tabs change
    document.querySelectorAll('.category-filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            setTimeout(attachReveals, 80);
        });
    });
}

