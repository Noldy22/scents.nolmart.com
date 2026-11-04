// js/pwa.js
// Web app support (all pages): registers the service worker and adds an
// "Install the App" button to the footer and the mobile menu whenever the
// browser can install the site. iPhones and iPads have no install prompt, so
// there the button explains Safari's "Add to Home Screen" instead.

const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
const ua = navigator.userAgent;
const isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    });
}

let installEvent = null;
const ICON = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/></svg>';
const IOS_HINT = 'On iPhone or iPad: tap the Share button in Safari, then "Add to Home Screen".';
const parts = [];

function build() {
    if (standalone || parts.length) return;

    const brand = document.querySelector('.footer-brand');
    if (brand) {
        const wrap = document.createElement('div');
        wrap.className = 'install-app';
        wrap.hidden = true;
        wrap.innerHTML = `
            <button type="button" class="btn btn-ghost-light install-app-btn">${ICON} Install the App</button>
            <p class="install-app-hint" hidden>${IOS_HINT}</p>`;
        brand.appendChild(wrap);
        parts.push(wrap);
    }

    const nav = document.getElementById('mainNavMenu');
    if (nav) {
        const link = document.createElement('button');
        link.type = 'button';
        link.className = 'nav-link nav-install-app install-app-btn';
        link.hidden = true;
        link.innerHTML = `${ICON} Install the App`;
        nav.appendChild(link);
        parts.push(link);
    }

    document.querySelectorAll('.install-app-btn').forEach((btn) => btn.addEventListener('click', install));
}

function show(visible) {
    parts.forEach((el) => { el.hidden = !visible; });
}

async function install() {
    if (installEvent) {
        installEvent.prompt();
        const { outcome } = await installEvent.userChoice;
        installEvent = null;
        if (outcome === 'accepted') show(false);
        return;
    }
    if (isIOS) {
        // close the mobile menu first so the footer note can be seen
        if (document.body.classList.contains('menu-open')) {
            const burger = document.getElementById('mobileMenuToggle');
            if (burger) burger.click();
        }
        document.querySelectorAll('.install-app-hint').forEach((p) => { p.hidden = false; });
        const footerHint = document.querySelector('.install-app-hint');
        if (footerHint) footerHint.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function init() {
    build();
    if (!standalone && isIOS) show(true);
}

window.addEventListener('beforeinstallprompt', (e) => {
    installEvent = e;
    build();
    show(true);
});
window.addEventListener('appinstalled', () => show(false));

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
