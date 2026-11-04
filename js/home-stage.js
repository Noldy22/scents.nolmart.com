// js/home-stage.js
// Home page 3D stage: the hero and the four flagship chapters scroll over a
// pinned (CSS sticky) WebGL canvas. Every value below is derived from the
// scroll position, so the whole sequence plays forward when scrolling down
// and rewinds exactly when scrolling back up — as many times as you like.

import * as THREE from 'three';
import { createBottleStage, canRender3D } from './bottle3d.js';
import { getBottlePalette } from './bottle-palette.js';

const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export async function initHomeStage(stageEl, flagships) {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger || !flagships.length) return;
    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const content = stageEl.querySelector('.stage-content');
    const canvas = stageEl.querySelector('#stageCanvas');
    const fallback = stageEl.querySelector('#stageFallback');
    const ghost = stageEl.querySelector('#stageGhost');
    const counter = stageEl.querySelector('#stageCounterNum');
    const counterTotal = stageEl.querySelector('#stageCounterTotal');
    if (counterTotal) counterTotal.textContent = String(flagships.length).padStart(2, '0');
    const progressBar = stageEl.querySelector('#stageProgressBar');
    const cue = stageEl.querySelector('.scroll-cue');
    const panels = Array.from(content.querySelectorAll('.stage-panel'));

    // State 0 = hero (shows the first flagship), states 1..N = chapters
    const states = [flagships[0], ...flagships];
    const N = states.length - 1;

    // ---------- Ghost words behind the bottle ----------
    ghost.innerHTML = ['NolMart', ...flagships.map(p => p.name.split(' ')[0])]
        .map(w => `<span>${w}</span>`).join('');
    const ghostWords = Array.from(ghost.children);

    // ---------- 3D or photo fallback ----------
    let stage = null;
    if (canRender3D()) {
        try {
            const isSmall = window.innerWidth < 900;
            stage = await createBottleStage(canvas, { dprMax: isSmall ? 1.5 : 1.75 });
            stage.bottle.prepare(flagships);
            stage.bottle.setProduct(states[0]);
            addGoldDust(stage);
            stageEl.classList.add('stage-3d-ready');
        } catch (err) {
            console.warn('WebGL stage failed, using photo fallback.', err);
            stage = null;
        }
    }
    if (!stage) stageEl.classList.add('stage-no-webgl');
    const fallbackImg = fallback ? fallback.querySelector('img') : null;

    // ---------- Layout helpers ----------
    let panelTops = [];
    function measure() {
        panelTops = panels.map(p => p.offsetTop);
    }

    function isPortrait() {
        return window.innerWidth < 900;
    }

    // World-space half extents of the camera view at z = 0
    function viewHalf() {
        if (!stage) return { w: 2.7, h: 1.55 };
        const cam = stage.camera;
        const h = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.position.z;
        return { w: h * cam.aspect, h };
    }

    // Target pose for a given state index
    function poseFor(k) {
        const v = viewHalf();
        if (isPortrait()) {
            // Keep the bottle in the free band between the header and the copy
            const scale = Math.min(0.74, v.h * 0.44);
            return {
                x: 0,
                y: v.h * 0.39,
                rotY: k % 2 === 0 ? -0.22 : 0.22,
                scale
            };
        }
        // Hero + chapters with text on the left → bottle right, and vice versa
        const bottleRight = k === 0 || (k % 2 === 0);
        const x = clamp(v.w * 0.42, 0.9, 1.6) * (bottleRight ? 1 : -1);
        return {
            x,
            y: k === 0 ? -0.04 : 0,
            rotY: bottleRight ? -0.32 : 0.32,
            scale: k === 0 ? 1.08 : 1
        };
    }

    // ---------- Pointer parallax (desktop) ----------
    const pointer = { x: 0, y: 0 };
    if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('pointermove', (e) => {
            pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
        }, { passive: true });
    }

    // ---------- The scroll-driven update ----------
    const tmpColor = new THREE.Color();
    const tmpColor2 = new THREE.Color();
    const baseRot = { x: 0, y: 0 };

    function update(scrollInStage) {
        // Convert scroll into a continuous chapter position u ∈ [0, N]
        let u = 0;
        for (let i = 0; i < panelTops.length - 1; i++) {
            const a = panelTops[i];
            const b = panelTops[i + 1];
            if (scrollInStage >= b) { u = i + 1; continue; }
            if (scrollInStage >= a) { u = i + (scrollInStage - a) / (b - a); }
            break;
        }
        u = clamp(u, 0, N);

        const k = Math.min(Math.floor(u), N - 1);
        const f = u - k;
        const e = easeInOut(f);
        const A = poseFor(k);
        const B = poseFor(k + 1);
        const arc = Math.sin(Math.PI * e);

        if (stage) {
            const t = stage.pose.target;
            t.x = lerp(A.x, B.x, e);
            t.y = lerp(A.y, B.y, e) + arc * 0.12;
            t.scale = lerp(A.scale, B.scale, e) * (1 - arc * 0.14);
            const spin = reduceMotion ? 0 : (k + e) * TAU;
            baseRot.y = lerp(A.rotY, B.rotY, e) + spin;
            baseRot.x = arc * 0.18;
            t.rotY = baseRot.y + pointer.x * 0.22;
            t.rotX = baseRot.x + pointer.y * 0.08;
            t.rotZ = arc * 0.1 * (B.x >= A.x ? -1 : 1);
            stage.bottle.blend(states[k], states[k + 1], f);
        } else if (fallbackImg) {
            const nearest = states[Math.round(u)];
            if (fallbackImg.dataset.id !== nearest.id) {
                fallbackImg.dataset.id = nearest.id;
                fallbackImg.src = nearest.imageUrl;
                fallbackImg.alt = nearest.name;
            }
            const xPct = (lerp(A.x, B.x, e) / 2.7) * 50;
            fallback.style.transform = `translate3d(${xPct}vw, 0, 0) scale(${1 - arc * 0.15})`;
            fallback.style.opacity = String(1 - arc * 0.6);
        }

        // Ambient glow follows the liquid colour of the current/next scent
        const pa = getBottlePalette(states[k].id);
        const pb = getBottlePalette(states[k + 1].id);
        if (pa && pb) {
            tmpColor.set(pa.top).lerp(tmpColor2.set(pb.top), e);
            stageEl.style.setProperty('--glow', `#${tmpColor.getHexString()}`);
        }
        stageEl.style.setProperty('--u', u.toFixed(4));

        // Ghost words drift and cross-fade with the chapters
        ghostWords.forEach((w, i) => {
            const d = u - i;
            const o = clamp(1 - Math.abs(d) * 1.35, 0, 1);
            w.style.opacity = (o * 0.9).toFixed(3);
            w.style.transform = `translate3d(${(-d * 28).toFixed(2)}vw, -50%, 0) scale(${(1 - Math.abs(d) * 0.08).toFixed(3)})`;
        });

        // HUD
        const chapter = Math.round(u);
        if (counter) counter.textContent = String(chapter).padStart(2, '0');
        if (progressBar) progressBar.style.transform = `scaleX(${(u / N).toFixed(4)})`;
        if (cue) cue.style.opacity = String(clamp(1 - u * 4, 0, 1));
    }

    measure();
    ScrollTrigger.create({
        trigger: content,
        start: 'top top',
        end: 'bottom bottom',
        onRefresh: () => { measure(); update(Math.max(0, window.scrollY - offsetTop(content))); },
        onUpdate: (self) => update(self.scroll() - self.start)
    });
    update(Math.max(0, window.scrollY - offsetTop(content)));
    if (stage) {
        stage.snap();
        stage.start();
        // Pointer parallax stays alive between scroll events
        gsap.ticker.add(() => {
            stage.pose.target.rotY = baseRot.y + pointer.x * 0.22;
            stage.pose.target.rotX = baseRot.x + pointer.y * 0.08;
        });
    }

    // ---------- Hero intro + scroll-scrubbed exit ----------
    const heroPanel = content.querySelector('.hero-panel');
    const heroContent = heroPanel && heroPanel.querySelector('.hero-content');
    const heroTitle = document.getElementById('heroTitle');
    if (heroContent && !reduceMotion) {
        const items = heroPanel.querySelectorAll('[data-hero-item]');
        gsap.set(heroTitle, { autoAlpha: 0 });
        gsap.set(items, { y: 40, autoAlpha: 0 });
        const playIntro = () => {
            let titleTargets = heroTitle;
            gsap.set(heroTitle, { autoAlpha: 1 });
            if (window.SplitText && heroTitle) {
                gsap.registerPlugin(window.SplitText);
                const split = window.SplitText.create(heroTitle, { type: 'words,lines', mask: 'lines', linesClass: 'split-line' });
                titleTargets = split.words;
            }
            gsap.timeline({ delay: 0.1 })
                .from(titleTargets, { yPercent: 115, rotate: 3, duration: 1.3, ease: 'expo.out', stagger: 0.06 })
                .to(items, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out', stagger: 0.1 }, '-=1.0');
        };
        // Split only once the web fonts are in, so line breaks are measured correctly
        const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
        Promise.race([fontsReady, new Promise(r => setTimeout(r, 2500))]).then(playIntro);

        gsap.fromTo(heroContent,
            { y: 0, autoAlpha: 1, filter: 'blur(0px)' },
            {
                y: -140, autoAlpha: 0, filter: 'blur(6px)', ease: 'none',
                scrollTrigger: { trigger: heroPanel, start: 'top top', end: 'bottom 25%', scrub: true }
            });
    }

    // ---------- Chapter copy: rises in, holds, lifts out (scrubbed both ways) ----------
    content.querySelectorAll('.chapter').forEach((chapter) => {
        const items = chapter.querySelectorAll('[data-ch-item]');
        const card = chapter.querySelector('.chapter-card');
        const side = chapter.dataset.side === 'left' ? -1 : 1;
        if (reduceMotion) return;
        const tl = gsap.timeline({
            scrollTrigger: { trigger: chapter, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
        });
        tl.fromTo(card, { x: side * 80, rotateY: side * -10, transformPerspective: 1200 },
                { x: 0, rotateY: 0, duration: 0.38, ease: 'power3.out' }, 0)
          .fromTo(items, { y: 70, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.3, stagger: 0.025, ease: 'power3.out' }, 0.04)
          .to({}, { duration: 0.24 })
          .to(items, { y: -70, autoAlpha: 0, duration: 0.3, stagger: 0.02, ease: 'power2.in' }, 0.66)
          .to(card, { x: side * -60, rotateY: side * 8, duration: 0.34, ease: 'power2.in' }, 0.66);
    });

    // Re-measure once fonts/images settle
    window.addEventListener('load', () => ScrollTrigger.refresh());
    ScrollTrigger.refresh();
}

function offsetTop(el) {
    let y = 0;
    while (el) { y += el.offsetTop; el = el.offsetParent; }
    return y;
}

// Floating gold dust that drifts around the bottle
function addGoldDust(stage) {
    const count = window.innerWidth < 900 ? 90 : 180;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 9;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 4 - 0.5;
        seeds[i] = Math.random() * 100;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const dot = document.createElement('canvas');
    dot.width = dot.height = 64;
    const g = dot.getContext('2d');
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,236,190,1)');
    grd.addColorStop(0.35, 'rgba(226,190,110,0.55)');
    grd.addColorStop(1, 'rgba(197,160,89,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);

    const mat = new THREE.PointsMaterial({
        size: 0.06,
        map: new THREE.CanvasTexture(dot),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.75
    });
    const points = new THREE.Points(geo, mat);
    stage.scene.add(points);

    const base = pos.slice();
    let last = 0;
    window.gsap.ticker.add((time) => {
        if (time - last < 1 / 40) return; // ~40fps is plenty for dust
        last = time;
        const u = parseFloat(getComputedStyleSafe());
        for (let i = 0; i < count; i++) {
            const s = seeds[i];
            pos[i * 3] = base[i * 3] + Math.sin(time * 0.2 + s) * 0.25;
            pos[i * 3 + 1] = ((base[i * 3 + 1] + time * 0.06 + s * 0.01 + 2.5) % 5) - 2.5;
            pos[i * 3 + 2] = base[i * 3 + 2] + Math.cos(time * 0.17 + s) * 0.2;
        }
        geo.attributes.position.needsUpdate = true;
        points.rotation.y = u * 0.6;
    });

    function getComputedStyleSafe() {
        const el = document.getElementById('stage');
        return (el && el.style.getPropertyValue('--u')) || '0';
    }
}
