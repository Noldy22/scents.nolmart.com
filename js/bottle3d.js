// js/bottle3d.js
// Real-time 3D NolMart bottle (Three.js).
// Glass flacon + coloured liquid + dip tube + collar + cap + printed label.
// The label is drawn at runtime, so every bottle carries the exact scent
// name from js/products-data.js. Liquid/cap colours come from
// js/bottle-palette.js (sampled from the product photography).

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/RoomEnvironment.js';
import { getBottlePalette } from './bottle-palette.js';

// ---------- Capability checks ----------
export function canRender3D() {
    try {
        const c = document.createElement('canvas');
        return !!(window.WebGL2RenderingContext && c.getContext('webgl2'));
    } catch (e) {
        return false;
    }
}

export function hasBottle(productId) {
    return !!getBottlePalette(productId);
}

// ---------- Bottle proportions (taken from the brand bottle artwork) ----------
const BODY = { w: 1.1, h: 1.42, d: 0.6, r: 0.085 };
const WALL = 0.055;
const FILL = 0.74;
const LABEL = { w: 0.78, h: 0.59, y: -0.1 };
const CAP_STYLES = {
    gold: {
        cap: { color: new THREE.Color('#e2bf5c'), metalness: 1, roughness: 0.22 },
        collar: { color: new THREE.Color('#f0d98a'), metalness: 1, roughness: 0.2 }
    },
    navy: {
        cap: { color: new THREE.Color('#0f386b'), metalness: 0.35, roughness: 0.2 },
        collar: { color: new THREE.Color('#2d69af'), metalness: 0.6, roughness: 0.25 }
    }
};

// ---------- Label artwork ----------
let fontsReady = null;
function ensureFonts() {
    if (!fontsReady) {
        fontsReady = (document.fonts && document.fonts.load)
            ? Promise.all([
                document.fonts.load('600 120px "Playfair Display"'),
                document.fonts.load('600 40px "Poppins"'),
                document.fonts.load('500 30px "Poppins"')
            ]).catch(() => null)
            : Promise.resolve();
    }
    return fontsReady;
}

function drawLabelCanvas(name) {
    const W = 1024;
    const H = Math.round(W * (LABEL.h / LABEL.w));
    const cv = document.createElement('canvas');
    cv.width = W;
    cv.height = H;
    const g = cv.getContext('2d');

    // Paper
    const paper = g.createLinearGradient(0, 0, 0, H);
    paper.addColorStop(0, '#fdfcf9');
    paper.addColorStop(1, '#f3efe6');
    g.fillStyle = paper;
    g.fillRect(0, 0, W, H);

    // Navy frame + gold inner rule
    g.strokeStyle = '#0f386b';
    g.lineWidth = 10;
    g.strokeRect(5, 5, W - 10, H - 10);
    g.strokeStyle = '#c5a059';
    g.lineWidth = 3;
    g.strokeRect(28, 28, W - 56, H - 56);

    g.textAlign = 'center';
    g.textBaseline = 'middle';

    // House name
    g.fillStyle = '#0f386b';
    g.font = '600 50px "Poppins", "Helvetica Neue", Arial, sans-serif';
    drawSpaced(g, 'NOLMART SCENTS', W / 2, 112, 10);

    // Gold hairline with diamond
    g.strokeStyle = '#c5a059';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(W / 2 - 170, 162); g.lineTo(W / 2 - 16, 162);
    g.moveTo(W / 2 + 16, 162); g.lineTo(W / 2 + 170, 162);
    g.stroke();
    g.fillStyle = '#c5a059';
    g.beginPath();
    g.moveTo(W / 2, 152); g.lineTo(W / 2 + 10, 162); g.lineTo(W / 2, 172); g.lineTo(W / 2 - 10, 162);
    g.closePath();
    g.fill();

    // Scent name: auto-fit, up to two lines
    const text = String(name || '').toUpperCase();
    const maxW = W - 150;
    let size = 112;
    let lines = [text];
    const fontFor = (s) => `600 ${s}px "Playfair Display", Georgia, "Times New Roman", serif`;
    g.font = fontFor(size);
    if (g.measureText(text).width > maxW) {
        const words = text.split(' ');
        if (words.length > 1) {
            let best = null;
            for (let i = 1; i < words.length; i++) {
                const a = words.slice(0, i).join(' ');
                const b = words.slice(i).join(' ');
                const wMax = Math.max(g.measureText(a).width, g.measureText(b).width);
                if (!best || wMax < best.w) best = { a, b, w: wMax };
            }
            lines = [best.a, best.b];
            size = 96;
        }
        g.font = fontFor(size);
        while (lines.some(l => g.measureText(l).width > maxW) && size > 40) {
            size -= 4;
            g.font = fontFor(size);
        }
    }
    g.fillStyle = '#0a192f';
    const centerY = 312;
    const lh = size * 1.08;
    lines.forEach((l, i) => {
        const y = centerY + (i - (lines.length - 1) / 2) * lh;
        drawSpaced(g, l, W / 2, y, size * 0.06);
    });

    // Classification lines
    g.fillStyle = '#475569';
    g.font = '500 38px "Poppins", "Helvetica Neue", Arial, sans-serif';
    drawSpaced(g, 'EXTRAIT DE PARFUM', W / 2, H - 175, 7);
    g.fillStyle = '#94a3b8';
    g.font = '600 30px "Poppins", "Helvetica Neue", Arial, sans-serif';
    drawSpaced(g, 'EXTRA LONG-LASTING  •  30ML', W / 2, H - 118, 5);

    return cv;
}

function drawSpaced(g, text, cx, cy, spacing) {
    const chars = [...text];
    const widths = chars.map(c => g.measureText(c).width);
    const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
    let x = cx - total / 2;
    const prevAlign = g.textAlign;
    g.textAlign = 'left';
    chars.forEach((c, i) => {
        g.fillText(c, x, cy);
        x += widths[i] + spacing;
    });
    g.textAlign = prevAlign;
}

// ---------- Bottle model ----------
class BottleModel {
    constructor(renderer) {
        this.renderer = renderer;
        this.group = new THREE.Group();
        this.labelCache = new Map();
        this.currentLabelId = null;
        this._tmpA = new THREE.Color();
        this._tmpB = new THREE.Color();
        this._build();
    }

    _build() {
        const g = this.group;

        // Glass body
        const glassGeo = new RoundedBoxGeometry(BODY.w, BODY.h, BODY.d, 6, BODY.r);
        this.glassMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0,
            roughness: 0.03,
            transmission: 1,
            thickness: 0.35,
            ior: 1.45,
            dispersion: 1.5,
            clearcoat: 1,
            clearcoatRoughness: 0.02,
            envMapIntensity: 0.85,
            specularIntensity: 1
        });
        const glass = new THREE.Mesh(glassGeo, this.glassMat);
        g.add(glass);

        // Liquid (opaque so it reads through the transmissive glass)
        const innerW = BODY.w - WALL * 2;
        const innerD = BODY.d - WALL * 2;
        const innerH = BODY.h - WALL * 2.4;
        const liqH = innerH * FILL;
        const liqGeo = new RoundedBoxGeometry(innerW, liqH, innerD, 4, 0.05);
        const pos = liqGeo.attributes.position;
        const colors = new Float32Array(pos.count * 3);
        liqGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        this.liquidGeo = liqGeo;
        this.liquidH = liqH;
        this.liquidMat = new THREE.MeshPhysicalMaterial({
            vertexColors: true,
            roughness: 0.25,
            metalness: 0,
            clearcoat: 0.4,
            clearcoatRoughness: 0.15,
            envMapIntensity: 0.55
        });
        const liquid = new THREE.Mesh(liqGeo, this.liquidMat);
        const innerBottom = -BODY.h / 2 + WALL * 1.4;
        liquid.position.y = innerBottom + liqH / 2;
        g.add(liquid);

        // Dip tube
        const tubeTop = BODY.h / 2 - 0.02;
        const tubeBottom = innerBottom + 0.03;
        const tubeGeo = new THREE.CylinderGeometry(0.011, 0.011, tubeTop - tubeBottom, 12);
        const tube = new THREE.Mesh(tubeGeo, new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.35 }));
        tube.position.y = (tubeTop + tubeBottom) / 2;
        g.add(tube);

        // Collar / neck
        const collarGeo = new THREE.CylinderGeometry(0.11, 0.12, 0.11, 40);
        this.collarMat = new THREE.MeshPhysicalMaterial({ clearcoat: 0.6, envMapIntensity: 1.3 });
        const collar = new THREE.Mesh(collarGeo, this.collarMat);
        collar.position.y = BODY.h / 2 + 0.05;
        g.add(collar);

        // Cap
        const capGeo = new RoundedBoxGeometry(0.42, 0.32, 0.34, 5, 0.04);
        this.capMat = new THREE.MeshPhysicalMaterial({ clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.4 });
        const cap = new THREE.Mesh(capGeo, this.capMat);
        cap.position.y = BODY.h / 2 + 0.1 + 0.16;
        g.add(cap);

        // Fine gold band under the cap
        const bandGeo = new THREE.BoxGeometry(0.425, 0.018, 0.345);
        const band = new THREE.Mesh(bandGeo, new THREE.MeshStandardMaterial({ color: '#e8c873', metalness: 1, roughness: 0.2 }));
        band.position.y = cap.position.y - 0.12;
        g.add(band);

        // Label (front face)
        const labelGeo = new THREE.PlaneGeometry(LABEL.w, LABEL.h);
        this.labelMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            roughness: 0.55,
            clearcoat: 0.35,
            clearcoatRoughness: 0.3,
            envMapIntensity: 0.6
        });
        const label = new THREE.Mesh(labelGeo, this.labelMat);
        label.position.set(0, LABEL.y, BODY.d / 2 + 0.0025);
        g.add(label);

        // Soft contact shadow
        const sh = document.createElement('canvas');
        sh.width = sh.height = 256;
        const sg = sh.getContext('2d');
        const grd = sg.createRadialGradient(128, 128, 0, 128, 128, 128);
        grd.addColorStop(0, 'rgba(0,0,0,0.55)');
        grd.addColorStop(0.5, 'rgba(0,0,0,0.22)');
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        sg.fillStyle = grd;
        sg.fillRect(0, 0, 256, 256);
        const shadowTex = new THREE.CanvasTexture(sh);
        this.shadow = new THREE.Mesh(
            new THREE.PlaneGeometry(2.2, 1.1),
            new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.85 })
        );
        this.shadow.rotation.x = -Math.PI / 2;
        this.shadow.position.y = -BODY.h / 2 - 0.02;
        g.add(this.shadow);

        // Centre the composition (body + cap) around the origin
        g.children.forEach(c => { if (c !== this.shadow) c.position.y -= 0.2; });
        this.shadow.position.y -= 0.2;
    }

    _labelTexture(id, name) {
        if (this.labelCache.has(id)) return this.labelCache.get(id);
        const tex = new THREE.CanvasTexture(drawLabelCanvas(name));
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
        this.labelCache.set(id, tex);
        return tex;
    }

    // Preload label textures (call after fonts are ready)
    prepare(products) {
        products.forEach(p => this._labelTexture(p.id, p.name));
    }

    _setLabel(product) {
        if (this.currentLabelId === product.id) return;
        this.currentLabelId = product.id;
        this.labelMat.map = this._labelTexture(product.id, product.name);
        this.labelMat.needsUpdate = true;
    }

    _paintLiquid(top, bottom) {
        const pos = this.liquidGeo.attributes.position;
        const col = this.liquidGeo.attributes.color;
        const half = this.liquidH / 2;
        const c = new THREE.Color();
        for (let i = 0; i < pos.count; i++) {
            const t = (pos.getY(i) + half) / this.liquidH; // 0 bottom → 1 top
            c.copy(bottom).lerp(top, THREE.MathUtils.smoothstep(t, 0, 1));
            col.setXYZ(i, c.r, c.g, c.b);
        }
        col.needsUpdate = true;
    }

    _applyCap(a, b, t) {
        const A = CAP_STYLES[a] || CAP_STYLES.navy;
        const B = CAP_STYLES[b] || CAP_STYLES.navy;
        this.capMat.color.copy(A.cap.color).lerp(B.cap.color, t);
        this.capMat.metalness = THREE.MathUtils.lerp(A.cap.metalness, B.cap.metalness, t);
        this.capMat.roughness = THREE.MathUtils.lerp(A.cap.roughness, B.cap.roughness, t);
        this.collarMat.color.copy(A.collar.color).lerp(B.collar.color, t);
        this.collarMat.metalness = THREE.MathUtils.lerp(A.collar.metalness, B.collar.metalness, t);
        this.collarMat.roughness = THREE.MathUtils.lerp(A.collar.roughness, B.collar.roughness, t);
    }

    // Show a single product
    setProduct(product) {
        this.blend(product, product, 0);
    }

    // Blend between two products (t: 0 → a, 1 → b). Label switches at t = 0.5.
    blend(a, b, t) {
        const pa = getBottlePalette(a.id) || getBottlePalette('obsidian-reef');
        const pb = getBottlePalette(b.id) || pa;
        const k = THREE.MathUtils.smoothstep(t, 0.3, 0.7);
        const top = this._tmpA.set(pa.top).lerp(new THREE.Color(pb.top), k);
        const bottom = this._tmpB.set(pa.bottom).lerp(new THREE.Color(pb.bottom), k);
        this._paintLiquid(top, bottom);
        this._applyCap(pa.cap, pb.cap, k);
        this._setLabel(t < 0.5 ? a : b);
    }
}

// ---------- Stage (renderer + camera + loop) ----------
export async function createBottleStage(canvas, options = {}) {
    const {
        dprMax = 1.75,
        cameraZ = 6.2,
        fov = 28,
        onFrame = null,
        backdrop = ['#0e1f3a', '#050b16']
    } = options;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprMax));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    scene.environmentIntensity = 0.85;

    // Key, warm gold rim and cool fill
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(2.5, 3.5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffd79a, 2.2);
    rim.position.set(-3.5, 1.5, -2.5);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0x9cc7ff, 0.7);
    fill.position.set(3, -1, -3);
    scene.add(fill);
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));

    const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 50);
    camera.position.set(0, 0, cameraZ);

    // Refraction backdrop. With a transparent canvas, three.js clears the
    // transmission buffer to half-white, which makes clear glass look milky.
    // This plane is drawn ONLY into that buffer (never to the screen), so the
    // glass refracts a dark stage that matches the page behind the canvas.
    const bd = document.createElement('canvas');
    bd.width = bd.height = 256;
    const bg = bd.getContext('2d');
    const grad = bg.createRadialGradient(128, 128, 10, 128, 128, 128);
    grad.addColorStop(0, backdrop[0]);
    grad.addColorStop(1, backdrop[1]);
    bg.fillStyle = grad;
    bg.fillRect(0, 0, 256, 256);
    const backdropTex = new THREE.CanvasTexture(bd);
    backdropTex.colorSpace = THREE.SRGBColorSpace;
    const backdropMat = new THREE.MeshBasicMaterial({ map: backdropTex, toneMapped: false, depthWrite: false });
    const backdropMesh = new THREE.Mesh(new THREE.PlaneGeometry(30, 18), backdropMat);
    backdropMesh.position.z = -4;
    backdropMesh.renderOrder = -1;
    backdropMesh.onBeforeRender = (r) => {
        const inTransmissionPass = r.getRenderTarget() !== null;
        backdropMat.colorWrite = inTransmissionPass;
    };
    scene.add(backdropMesh);

    await ensureFonts();
    const bottle = new BottleModel(renderer);
    const pivot = new THREE.Group();
    pivot.add(bottle.group);
    scene.add(pivot);

    // Pose: target values are set by callers, current values ease towards them
    const pose = {
        target: { x: 0, y: 0, rotY: 0, rotX: 0, rotZ: 0, scale: 1 },
        current: { x: 0, y: 0, rotY: 0, rotX: 0, rotZ: 0, scale: 1 },
        ease: 0.085
    };

    let width = 0, height = 0;
    function resize() {
        const rect = canvas.getBoundingClientRect();
        const w = Math.max(1, Math.round(rect.width));
        const h = Math.max(1, Math.round(rect.height));
        if (w === width && h === height) return;
        width = w; height = h;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        // Keep the bottle fully framed on narrow (portrait) screens
        const minAspect = 0.62;
        camera.position.z = cameraZ * (camera.aspect < minAspect ? minAspect / camera.aspect : 1);
        camera.updateProjectionMatrix();
    }
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let running = false;
    let visible = true;
    let raf = 0;
    const clock = new THREE.Clock();

    let lastT = 0;
    function frame() {
        raf = 0;
        if (!running || !visible) return;
        const t = clock.getElapsedTime();
        const dt = Math.min(0.1, Math.max(0, t - lastT));
        lastT = t;
        // Frame-rate independent smoothing (same feel at 30, 60 or 120 fps)
        const e = 1 - Math.pow(1 - pose.ease, dt * 60);
        const c = pose.current, tg = pose.target;
        for (const k in c) c[k] += (tg[k] - c[k]) * e;
        pivot.position.set(c.x, c.y + Math.sin(t * 1.1) * 0.035, 0);
        pivot.rotation.set(c.rotX, c.rotY, c.rotZ + Math.sin(t * 0.7) * 0.012);
        pivot.scale.setScalar(c.scale);
        if (onFrame) onFrame(t);
        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
    }

    function start() {
        if (running) return;
        running = true;
        if (!raf) raf = requestAnimationFrame(frame);
    }
    function stop() {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
    }

    const io = new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        if (visible && running && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (raf) cancelAnimationFrame(raf);
            raf = 0;
        } else if (running && visible && !raf) {
            raf = requestAnimationFrame(frame);
        }
    });

    // Snap current pose to target (avoids an initial swoosh)
    function snap() {
        Object.assign(pose.current, pose.target);
    }

    return { renderer, scene, camera, bottle, pose, start, stop, snap, resize };
}

// ---------- Drag-to-rotate helper (product page) ----------
export function enableDragRotate(element, stage, { autoSpin = 0.0035 } = {}) {
    let dragging = false;
    let lastX = 0, lastY = 0;
    let velocity = autoSpin;
    let idleTimer = 0;
    const pose = stage.pose;

    element.addEventListener('pointerdown', (e) => {
        dragging = true;
        lastX = e.clientX; lastY = e.clientY;
        element.setPointerCapture(e.pointerId);
        element.classList.add('is-dragging');
        clearTimeout(idleTimer);
    });
    element.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX; lastY = e.clientY;
        velocity = dx * 0.006;
        pose.target.rotY += dx * 0.012;
        pose.target.rotX = THREE.MathUtils.clamp(pose.target.rotX + dy * 0.006, -0.45, 0.45);
    });
    const end = () => {
        if (!dragging) return;
        dragging = false;
        element.classList.remove('is-dragging');
        idleTimer = setTimeout(() => { pose.target.rotX = 0; }, 1600);
    };
    element.addEventListener('pointerup', end);
    element.addEventListener('pointercancel', end);

    function tick() {
        if (!dragging) {
            velocity += (autoSpin - velocity) * 0.02;
            pose.target.rotY += velocity;
        }
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}
