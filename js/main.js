// js/main.js
// Main JavaScript logic for NolMart Scents

import { PRODUCTS, getProductById, getFlagshipProducts, getBestsellerProducts } from './products-data.js';
import { addItemToCart, getCartTotalCount } from './cart.js';
import { initCartDrawer, openCartDrawer, directWhatsAppOrder, showToast } from './cart-drawer.js';
import { initScentQuiz } from './scent-quiz.js';
import { CONFIG } from './config.js';
import { getBottlePalette } from './bottle-palette.js';

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

    // 5b. Discovery Set feature buttons (Add to Bag / WhatsApp)
    const bundlesSection = document.getElementById('bundles');
    if (bundlesSection) attachCardEventListeners(bundlesSection);

    // 6. Search Bar Autocomplete / Modal
    initSearch();

    // 7. Announcement Bar dismiss / ticker
    initAnnouncement();

    // 8. Scroll animations & header behaviour live in js/motion.js
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

// Render the Flagship "chapters" of the home 3D stage.
// Each chapter keeps the flagship-card contract (data-product-id, size pills,
// add-to-bag & WhatsApp buttons) so attachCardEventListeners() wires it up.
const ICON_WA = '<svg class="icon icon-fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.24-.25-.6-.5-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.06 1.03-1.06 2.51s1.08 2.91 1.23 3.11c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.5 1.72.63.72.23 1.38.2 1.9.12.57-.08 1.77-.72 2.02-1.43.25-.7.25-1.3.18-1.43-.08-.12-.28-.2-.58-.35zM12.04 2C6.51 2 2.02 6.49 2.02 12.02c0 1.94.56 3.75 1.52 5.29L2 22l4.83-1.52c1.48.89 3.2 1.4 5.21 1.4 5.53 0 10.02-4.49 10.02-10.02C22.06 6.49 17.57 2 12.04 2zm0 18.28c-1.78 0-3.43-.56-4.79-1.52l-.34-.24-2.87.9.92-2.79-.27-.37a8.2 8.2 0 0 1-1.62-5.24c0-4.57 3.72-8.29 8.29-8.29s8.29 3.72 8.29 8.29-3.72 8.28-8.29 8.28z"/></svg>';
const ICON_BAG = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/></svg>';

function genderLabel(g) {
    return g === 'men' ? 'For Him' : g === 'women' ? 'For Her' : 'Unisex';
}

function renderFlagshipShowcase() {
    const container = document.getElementById('flagshipsContainer');
    if (!container) return;

    // Single-bottle flagships become 3D chapters (bundles stay in the catalog grid)
    const flagships = getFlagshipProducts().filter(p => getBottlePalette(p.id));
    const total = String(flagships.length).padStart(2, '0');

    container.innerHTML = flagships.map((p, i) => {
        const price = (size) => p.prices[size] ? `Tzs ${p.prices[size].toLocaleString('en-US')}` : '';
        const side = i % 2 === 0 ? 'right' : 'left';

        return `
            <article class="stage-panel chapter flagship-card" data-product-id="${p.id}" data-chapter="${i}" data-side="${side}">
                <div class="container chapter-inner">
                    <div class="chapter-card">
                        <div class="chapter-meta" data-ch-item>
                            <span class="chapter-index">${String(i + 1).padStart(2, '0')} <i>/</i> ${total}</span>
                            <span class="flagship-badge">${p.badge}</span>
                        </div>
                        <span class="flagship-gender-tag" data-ch-item>The Flagship Perfumes · ${genderLabel(p.gender)}</span>
                        <h3 class="flagship-name" data-ch-item>${p.name}</h3>
                        <p class="flagship-tagline" data-ch-item>${p.tagline}</p>

                        <dl class="chapter-notes" data-ch-item>
                            <div><dt>Top</dt><dd>${p.notes.top.slice(0, 3).join(', ')}</dd></div>
                            <div><dt>Heart</dt><dd>${p.notes.heart.slice(0, 3).join(', ')}</dd></div>
                            <div><dt>Base</dt><dd>${p.notes.base.slice(0, 3).join(', ')}</dd></div>
                        </dl>

                        <div class="chapter-specs" data-ch-item>
                            <span><em>Longevity</em>${p.longevity}</span>
                            <span><em>Projection</em>${p.sillage}</span>
                        </div>

                        <div class="size-switch-wrap" data-ch-item>
                            <button class="size-pill-btn active" data-size="30ml">30ml · ${price('30ml')}</button>
                            <button class="size-pill-btn" data-size="10ml">10ml · ${price('10ml')}</button>
                            ${p.prices["6ml"] ? `<button class="size-pill-btn" data-size="6ml">6ml · ${price('6ml')}</button>` : ''}
                        </div>

                        <div class="flagship-card-actions" data-ch-item>
                            <button class="btn btn-gold add-to-bag-btn" data-id="${p.id}" data-size="30ml">
                                ${ICON_BAG} Add to Bag
                            </button>
                            <button class="btn btn-whatsapp-icon wa-quick-btn" data-id="${p.id}" data-size="30ml" title="Order via WhatsApp" aria-label="Order ${p.name} via WhatsApp">
                                ${ICON_WA}
                            </button>
                            <a href="product.html?id=${p.id}" class="chapter-link">View details <span aria-hidden="true">→</span></a>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    attachCardEventListeners(container);

    // Launch the 3D stage (loaded lazily so the shop works even if WebGL is unavailable)
    const stage = document.getElementById('stage');
    if (stage) {
        import('./home-stage.js')
            .then(m => m.initHomeStage(stage, flagships))
            .catch(err => {
                console.warn('3D stage unavailable, using photo fallback.', err);
                stage.classList.add('stage-no-webgl');
            });
    }
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
        } else if (category === 'car-freshener') {
            items = PRODUCTS.filter(p => p.category === 'car-freshener');
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
                                ${p.prices["6ml"] ? `<button class="card-size-opt" data-size="6ml">6ml</button>` : ''}
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
                                Add to Bag
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
                        <span class="search-item-price">From Tzs ${(p.prices["6ml"] || p.prices["10ml"] || Object.values(p.prices)[0]).toLocaleString('en-US')}</span>
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
