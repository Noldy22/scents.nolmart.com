// js/motion.js
// Site-wide luxury motion layer (all pages).
//  • Lenis inertia scrolling (desktop wheel/trackpad; native on touch)
//  • Direction-aware header (hides scrolling down, returns scrolling up)
//  • Reveal animations that play on the way in, rewind when you scroll back
//    past them, and replay every time, in both scroll directions.
//  • Scrubbed parallax, scroll-velocity marquees, counters.
// Respects prefers-reduced-motion and fails safe (content stays visible).

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const SplitText = window.SplitText;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Replays forward on enter (down) and enter-back (up); rewinds on leave in either direction
const BOTH_WAYS = 'play reverse play reverse';

let lenis = null;

function init() {
    if (!gsap || !ScrollTrigger) {
        document.documentElement.classList.add('motion-off');
        initHeaderBasic();
        return;
    }
    gsap.registerPlugin(ScrollTrigger);
    if (SplitText) gsap.registerPlugin(SplitText);
    document.documentElement.classList.add('motion-on');

    initSmoothScroll();
    initHeader();
    initProgress();

    if (reduceMotion) {
        initCounters(true);
        return;
    }

    initReveals();
    initSplitHeadings();
    initParallax();
    initCardGrids();
    initWhyGrid();
    initBundle();
    initTestimonials();
    initCounters(false);
    initMarquees();

    window.addEventListener('load', () => ScrollTrigger.refresh());
}

// ---------- Smooth scroll ----------
function initSmoothScroll() {
    const headerOffset = () => {
        const h = document.querySelector('.site-header');
        return h ? -h.offsetHeight + 1 : 0;
    };

    if (!reduceMotion && window.Lenis) {
        lenis = new window.Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        // Pause inertia while the cart drawer / mobile menu lock the page
        const sync = () => {
            const locked = document.body.classList.contains('cart-open') || document.body.classList.contains('menu-open');
            if (locked) lenis.stop(); else lenis.start();
        };
        new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    // Same-page anchor links glide to their target
    document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href*="#"]');
        if (!a) return;
        const url = new URL(a.getAttribute('href'), window.location.href);
        if (url.pathname !== window.location.pathname || !url.hash || url.hash === '#') return;
        const target = document.querySelector(url.hash);
        if (!target) return;
        e.preventDefault();
        if (lenis) {
            lenis.scrollTo(target, { offset: headerOffset(), duration: 1.6 });
        } else {
            const y = target.getBoundingClientRect().top + window.scrollY + headerOffset();
            window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
        }
        history.replaceState(null, '', url.hash);
    });
}

// ---------- Header ----------
// The navigation bar stays pinned to the top of the screen at all times;
// scrolling only switches it to its solid "scrolled" style.
function initHeaderBasic() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

function initHeader() {
    initHeaderBasic();
}

function initProgress() {
    const bar = document.querySelector('.scroll-progress span');
    if (!bar) return;
    gsap.fromTo(bar, { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
    });
}

// ---------- Generic reveals: [data-reveal="fade|up|rise|left|right|scale"] ----------
const REVEAL_FROM = {
    fade: { autoAlpha: 0 },
    up: { autoAlpha: 0, y: 50 },
    rise: { autoAlpha: 0, y: 110, scale: 0.94, rotateX: 8, transformPerspective: 1200 },
    left: { autoAlpha: 0, x: -90 },
    right: { autoAlpha: 0, x: 90 },
    scale: { autoAlpha: 0, scale: 0.86 }
};

function initReveals() {
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
        const from = REVEAL_FROM[el.dataset.reveal] || REVEAL_FROM.up;
        gsap.fromTo(el, from, {
            autoAlpha: 1, x: 0, y: 0, scale: 1, rotateX: 0,
            duration: 1.2, ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 90%', end: 'bottom 8%', toggleActions: BOTH_WAYS }
        });
    });
}

// ---------- Headings: words rise out of masked lines ----------
function initSplitHeadings() {
    const els = gsap.utils.toArray('[data-split]');
    els.forEach((el) => {
        if (!SplitText) {
            gsap.fromTo(el, { autoAlpha: 0, y: 40 }, {
                autoAlpha: 1, y: 0, duration: 1.1, ease: 'expo.out',
                scrollTrigger: { trigger: el, start: 'top 90%', end: 'bottom 8%', toggleActions: BOTH_WAYS }
            });
            return;
        }
        SplitText.create(el, {
            type: 'words,lines',
            mask: 'lines',
            linesClass: 'split-line',
            autoSplit: true,
            onSplit(self) {
                return gsap.from(self.words, {
                    yPercent: 120, rotate: 4, duration: 1.15, ease: 'expo.out', stagger: 0.05,
                    scrollTrigger: { trigger: el, start: 'top 90%', end: 'bottom 6%', toggleActions: BOTH_WAYS }
                });
            }
        });
    });
}

// ---------- Scrubbed parallax: [data-parallax="-0.3"] ----------
function initParallax() {
    gsap.utils.toArray('[data-parallax]').forEach((el) => {
        const amt = parseFloat(el.dataset.parallax) || 0.2;
        gsap.fromTo(el, { yPercent: -amt * 100 }, {
            yPercent: amt * 100, ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
        });
    });
}

// ---------- Product grids (re-bind whenever a filter re-renders them) ----------
const gridTriggers = new WeakMap();

function bindCards(grid) {
    (gridTriggers.get(grid) || []).forEach(t => t.kill());
    const cards = Array.from(grid.querySelectorAll('.product-card'));
    if (!cards.length) { gridTriggers.set(grid, []); return; }

    const hiddenBelow = { autoAlpha: 0, y: 80, rotateX: -14, scale: 0.96 };
    const hiddenAbove = { autoAlpha: 0, y: -80, rotateX: 14, scale: 0.96 };
    const shown = { autoAlpha: 1, y: 0, rotateX: 0, scale: 1 };
    gsap.set(cards, { ...hiddenBelow, transformPerspective: 1000, transformOrigin: '50% 100%' });

    const show = (batch) => gsap.to(batch, { ...shown, duration: 1, ease: 'expo.out', stagger: 0.07, overwrite: true });
    const triggers = ScrollTrigger.batch(cards, {
        start: 'top 94%',
        end: 'bottom 4%',
        onEnter: show,
        onEnterBack: show,
        onLeave: (batch) => gsap.to(batch, { ...hiddenAbove, duration: 0.6, ease: 'power2.in', stagger: 0.04, overwrite: true }),
        onLeaveBack: (batch) => gsap.to(batch, { ...hiddenBelow, duration: 0.6, ease: 'power2.in', stagger: 0.04, overwrite: true })
    });
    gridTriggers.set(grid, triggers);
}

function initCardGrids() {
    let refreshTimer = 0;
    const scheduleRefresh = () => {
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 60);
    };
    document.querySelectorAll('.products-grid').forEach((grid) => {
        bindCards(grid);
        new MutationObserver(() => { bindCards(grid); scheduleRefresh(); })
            .observe(grid, { childList: true });
    });
}

// ---------- "Why" cards: fan in from depth, scrubbed ----------
function initWhyGrid() {
    const grid = document.querySelector('[data-why-grid]');
    if (!grid) return;
    const boxes = grid.querySelectorAll('.why-feature-box');
    gsap.fromTo(boxes,
        { autoAlpha: 0, y: 160, rotateY: (i) => (i % 2 ? -28 : 28), rotateX: 10, z: -200, transformPerspective: 1100 },
        {
            autoAlpha: 1, y: 0, rotateY: 0, rotateX: 0, z: 0, ease: 'power2.out', stagger: 0.12,
            scrollTrigger: { trigger: grid, start: 'top 92%', end: 'top 38%', scrub: 0.8 }
        });
}

// ---------- Bundle feature: bottle swings in, copy cascades ----------
function initBundle() {
    const feature = document.querySelector('[data-bundle-feature]');
    if (!feature) return;
    const img = feature.querySelector('[data-bundle-img]');
    const copy = feature.querySelector('[data-bundle-copy]');
    gsap.fromTo(feature, { clipPath: 'inset(14% 8% 14% 8% round 28px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none',
        scrollTrigger: { trigger: feature, start: 'top 95%', end: 'top 35%', scrub: true }
    });
    if (img) {
        gsap.fromTo(img, { yPercent: 18, rotate: -10, scale: 0.85 }, {
            yPercent: -8, rotate: 6, scale: 1.04, ease: 'none',
            scrollTrigger: { trigger: feature, start: 'top bottom', end: 'bottom top', scrub: true }
        });
    }
    if (copy) {
        gsap.fromTo(copy.children, { autoAlpha: 0, x: 60 }, {
            autoAlpha: 1, x: 0, duration: 1, ease: 'expo.out', stagger: 0.08,
            scrollTrigger: { trigger: copy, start: 'top 85%', end: 'bottom 10%', toggleActions: BOTH_WAYS }
        });
    }
}

// ---------- Testimonials ----------
function initTestimonials() {
    const grid = document.querySelector('[data-testimonials]');
    if (!grid) return;
    gsap.fromTo(grid.children,
        { autoAlpha: 0, y: 90, rotate: (i) => (i - 1) * 4 },
        {
            autoAlpha: 1, y: 0, rotate: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12,
            scrollTrigger: { trigger: grid, start: 'top 88%', end: 'bottom 8%', toggleActions: BOTH_WAYS }
        });
}

// ---------- Counters (count up going down, back to zero going up) ----------
function initCounters(instant) {
    document.querySelectorAll('[data-count]').forEach((el) => {
        const target = parseFloat(el.dataset.count) || 0;
        const suffix = el.dataset.suffix || '';
        const fmt = (v) => Math.round(v).toLocaleString('en-US') + suffix;
        if (instant) { el.textContent = fmt(target); return; }
        const state = { v: 0 };
        el.textContent = fmt(0);
        gsap.to(state, {
            v: target, duration: 2, ease: 'power3.out',
            onUpdate: () => { el.textContent = fmt(state.v); },
            scrollTrigger: { trigger: el, start: 'top 92%', end: 'bottom 5%', toggleActions: BOTH_WAYS }
        });
    });
}

// ---------- Marquees that follow scroll direction & speed ----------
function initMarquees() {
    document.querySelectorAll('[data-marquee]').forEach((m) => {
        const track = m.querySelector('.marquee-track');
        if (!track) return;
        track.innerHTML += track.innerHTML; // seamless loop
        const baseDir = parseFloat(m.dataset.marqueeDir || '1');
        const loop = gsap.to(track, { xPercent: -50, ease: 'none', duration: 38, repeat: -1 });
        // start far from time 0 so the loop can also run backwards forever
        loop.totalTime(loop.duration() * 500 + (baseDir < 0 ? loop.duration() * 0.5 : 0));
        loop.timeScale(baseDir);
        let dir = 1;
        ScrollTrigger.create({
            trigger: m,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate(self) {
                dir = self.direction;
                const boost = Math.min(Math.abs(self.getVelocity()) / 250, 6);
                gsap.to(loop, {
                    timeScale: baseDir * dir * (1 + boost),
                    duration: 0.3,
                    overwrite: true,
                    onComplete: () => gsap.to(loop, { timeScale: baseDir * dir, duration: 1.2, ease: 'power2.out' })
                });
            }
        });
        // subtle skew with scroll speed
        const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3' });
        ScrollTrigger.create({
            trigger: m, start: 'top bottom', end: 'bottom top',
            onUpdate: (self) => skewTo(gsap.utils.clamp(-8, 8, self.getVelocity() / -300)),
            onLeave: () => skewTo(0), onLeaveBack: () => skewTo(0)
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

export function getLenis() { return lenis; }
