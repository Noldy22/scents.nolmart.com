// js/bottle3d.js
// Real-time 3D NolMart bottle (Three.js).
// The geometry is the brand bottle modelled in Blender (models/nolmart-bottle.glb):
// fluted 30 ml glass, gold FEA15 pump, ivory cap with gold top and the navy
// NolMart label. The label is painted at runtime so every bottle carries the
// exact scent name from js/products-data.js; the juice colour comes from
// js/bottle-palette.js.

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/RoomEnvironment.js';
import { getBottlePalette } from './bottle-palette.js';

const MODEL_URL = new URL('../models/nolmart-bottle.glb', import.meta.url).href;
const BOTTLE_HEIGHT = 1.9; // world units, from the glass foot to the top of the cap

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

// ---------- Model loading (shared, fetched once per page) ----------
let modelPromise = null;
export function loadBottleModel() {
    if (!modelPromise) {
        modelPromise = new GLTFLoader().loadAsync(MODEL_URL).catch((err) => {
            modelPromise = null;
            throw err;
        });
    }
    return modelPromise;
}

// The GLB is quantised (int16/int8) to keep the download small. Expand to
// float so the geometry can be baked into world space below.
function toFloatAttributes(geo) {
    for (const key of Object.keys(geo.attributes)) {
        const a = geo.attributes[key];
        if (a.isBufferAttribute && a.array instanceof Float32Array && !a.normalized) continue;
        const n = a.itemSize;
        const out = new Float32Array(a.count * n);
        const getters = [a.getX, a.getY, a.getZ, a.getW];
        for (let i = 0; i < a.count; i++) {
            for (let k = 0; k < n; k++) out[i * n + k] = getters[k].call(a, i);
        }
        geo.setAttribute(key, new THREE.BufferAttribute(out, n));
    }
    return geo;
}

// ---------- Label artwork (matches the printed NolMart label) ----------
// Drawn on the label's own 1800 x 2000 design grid, then scaled to the canvas.
const LABEL_GRID = { w: 1800, h: 2000 };
const INK = {
    navy: '#1c2c5c',
    gold: '#e9c248',
    frame: '#c4ac62',
    white: '#f6f4ec',
    blue: '#96b2e2',
    icon: '#bebeaf'
};

let fontsReady = null;
function ensureFonts() {
    if (!fontsReady) {
        fontsReady = (document.fonts && document.fonts.load)
            ? Promise.race([
                Promise.all([
                    document.fonts.load('600 200px "Oswald"', 'OBSIDIAN'),
                    document.fonts.load('500 150px "Poppins"', 'NolMart'),
                    document.fonts.load('600 100px "Poppins"', 'Eau de Parfum'),
                    document.fonts.load('400 96px "Poppins"', '30 mls')
                ]),
                new Promise((r) => setTimeout(r, 3000))
            ]).catch(() => null)
            : Promise.resolve();
    }
    return fontsReady;
}

function drawSpaced(g, text, cx, cy, spacing) {
    const chars = [...text];
    const widths = chars.map((c) => g.measureText(c).width);
    const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
    let x = cx - total / 2;
    const prevAlign = g.textAlign;
    g.textAlign = 'left';
    chars.forEach((c, i) => {
        g.fillText(c, x, cy);
        x += widths[i] + spacing;
    });
    g.textAlign = prevAlign;
    return total;
}

function spacedWidth(g, text, spacing) {
    const chars = [...text];
    return chars.reduce((a, c) => a + g.measureText(c).width, 0) + spacing * (chars.length - 1);
}

// Gold frame with concave (inverted quarter-circle) corners
function labelFrame(g, inset, rad, width) {
    const { w: W, h: H } = LABEL_GRID;
    const x0 = inset, y0 = inset, x1 = W - inset, y1 = H - inset;
    g.strokeStyle = INK.frame;
    g.lineWidth = width;
    g.beginPath();
    g.moveTo(x0 + rad, y0); g.lineTo(x1 - rad, y0);
    g.moveTo(x0 + rad, y1); g.lineTo(x1 - rad, y1);
    g.moveTo(x0, y0 + rad); g.lineTo(x0, y1 - rad);
    g.moveTo(x1, y0 + rad); g.lineTo(x1, y1 - rad);
    g.stroke();
    [[x0, y0, 0], [x1, y0, 90], [x1, y1, 180], [x0, y1, 270]].forEach(([cx, cy, a0]) => {
        g.beginPath();
        g.arc(cx, cy, rad, (a0 * Math.PI) / 180, ((a0 + 90) * Math.PI) / 180);
        g.stroke();
    });
}

// Shopping-cart mark from the NolMart logo, drawn as line art (height ≈ 175)
function cartIcon(g, x, y) {
    g.save();
    g.translate(x, y);
    g.strokeStyle = INK.gold;
    g.fillStyle = INK.gold;
    g.lineWidth = 11;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    // handle + basket outline
    g.beginPath();
    g.moveTo(0, 8); g.lineTo(34, 8); g.lineTo(52, 40);
    g.lineTo(196, 40); g.lineTo(178, 112); g.lineTo(70, 112);
    g.closePath();
    g.moveTo(52, 40); g.lineTo(70, 112);
    g.moveTo(70, 112); g.lineTo(62, 138); g.lineTo(184, 138);
    g.stroke();
    // basket grid
    g.lineWidth = 6;
    g.beginPath();
    for (let i = 1; i < 5; i++) {
        const t = i / 5;
        g.moveTo(52 + 144 * t, 40); g.lineTo(70 + 108 * t, 112);
    }
    g.moveTo(58, 64); g.lineTo(190, 64);
    g.moveTo(64, 88); g.lineTo(184, 88);
    g.stroke();
    // wheels
    g.lineWidth = 8;
    [[86, 160], [166, 160]].forEach(([cx, cy]) => {
        g.beginPath();
        g.arc(cx, cy, 13, 0, Math.PI * 2);
        g.stroke();
    });
    g.restore();
    return 200; // icon width
}

function instagramIcon(g, x, y, s) {
    g.save();
    g.strokeStyle = INK.icon;
    g.fillStyle = INK.icon;
    g.lineWidth = 7;
    const r = 18;
    g.beginPath();
    g.moveTo(x + r, y - s / 2);
    g.arcTo(x + s, y - s / 2, x + s, y + s / 2, r);
    g.arcTo(x + s, y + s / 2, x, y + s / 2, r);
    g.arcTo(x, y + s / 2, x, y - s / 2, r);
    g.arcTo(x, y - s / 2, x + s, y - s / 2, r);
    g.closePath();
    g.stroke();
    g.lineWidth = 6;
    g.beginPath();
    g.arc(x + s / 2, y, s * 0.22, 0, Math.PI * 2);
    g.stroke();
    g.beginPath();
    g.arc(x + s * 0.79, y - s * 0.31, s * 0.06, 0, Math.PI * 2);
    g.fill();
    g.restore();
}

function drawLabelCanvas(name) {
    const { w: W, h: H } = LABEL_GRID;
    const cv = document.createElement('canvas');
    cv.width = 1024;
    cv.height = Math.round(1024 * (H / W));
    const g = cv.getContext('2d');
    g.scale(cv.width / W, cv.height / H);

    g.fillStyle = INK.navy;
    g.fillRect(0, 0, W, H);

    labelFrame(g, 95, 95, 7);
    labelFrame(g, 118, 72, 5);

    g.textAlign = 'center';
    g.textBaseline = 'middle';

    // Brand line: cart mark + "NolMart"
    g.font = '500 150px "Poppins", "Helvetica Neue", Arial, sans-serif';
    const brandW = spacedWidth(g, 'NolMart', 14);
    const iconW = 200;
    const startX = (W - (iconW + 34 + brandW)) / 2;
    const brandY = 0.175 * H;
    cartIcon(g, startX, brandY - 95);
    g.fillStyle = INK.gold;
    drawSpaced(g, 'NolMart', startX + iconW + 34 + brandW / 2, brandY + 6, 14);

    // Scent name: bold condensed caps, one line if it fits comfortably, else two
    const text = String(name || '').toUpperCase();
    const fontFor = (s) => `600 ${s}px "Oswald", "Bahnschrift", "Arial Narrow", Impact, sans-serif`;
    const maxW = W * 0.8;
    const ref = 200;
    g.font = fontFor(ref);
    let lines = [text];
    let size = Math.min(270, (ref * maxW) / g.measureText(text).width);
    const words = text.split(' ');
    if (size < 190 && words.length > 1) {
        let best = null;
        for (let i = 1; i < words.length; i++) {
            const a = words.slice(0, i).join(' ');
            const b = words.slice(i).join(' ');
            const w = Math.max(g.measureText(a).width, g.measureText(b).width);
            if (!best || w < best.w) best = { lines: [a, b], w };
        }
        lines = best.lines;
        size = Math.min(215, (ref * maxW) / best.w);
    }
    g.font = fontFor(size);
    g.fillStyle = INK.gold;
    g.textBaseline = 'alphabetic';
    const capH = size * 0.74;
    const lineGap = size * 1.04;
    const nameY = 0.425 * H;
    lines.forEach((l, i) => {
        const cy = nameY + (i - (lines.length - 1) / 2) * lineGap;
        drawSpaced(g, l, W / 2, cy + capH / 2, size * 0.02);
    });
    g.textBaseline = 'middle';

    // Type + volume
    g.fillStyle = INK.white;
    g.font = '600 100px "Poppins", "Helvetica Neue", Arial, sans-serif';
    g.fillText('Eau de Parfum', W / 2, 0.615 * H);
    g.fillStyle = INK.blue;
    g.font = '400 96px "Poppins", "Helvetica Neue", Arial, sans-serif';
    g.fillText('30 mls', W / 2, 0.738 * H);

    // Instagram handle (bottom right)
    const ix = 0.585 * W, iy = 0.868 * H, s = 64;
    instagramIcon(g, ix, iy, s);
    g.textAlign = 'left';
    g.font = '500 58px "Poppins", "Helvetica Neue", Arial, sans-serif';
    g.fillStyle = INK.blue;
    g.fillText('_nolmart', ix + s + 22, iy + 2);

    return cv;
}

// ---------- Materials (tuned for real-time; names match the Blender file) ----------
function makeMaterials() {
    return {
        Glass: new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0,
            roughness: 0.035,
            transmission: 1,
            thickness: 0.32,
            ior: 1.5,
            dispersion: 0.8,
            clearcoat: 1,
            clearcoatRoughness: 0.03,
            envMapIntensity: 1.05,
            specularIntensity: 1
        }),
        Perfume_Golden: new THREE.MeshPhysicalMaterial({
            vertexColors: true,
            roughness: 0.18,
            metalness: 0,
            clearcoat: 0.6,
            clearcoatRoughness: 0.1,
            envMapIntensity: 0.6
        }),
        Polished_Gold: new THREE.MeshPhysicalMaterial({
            color: '#f0cd85',
            metalness: 1,
            roughness: 0.17,
            clearcoat: 0.4,
            clearcoatRoughness: 0.1,
            envMapIntensity: 1.35
        }),
        Ivory_SoftTouch: new THREE.MeshPhysicalMaterial({
            color: '#efe7d3',
            roughness: 0.55,
            sheen: 0.6,
            sheenColor: new THREE.Color('#fff6e2'),
            sheenRoughness: 0.55,
            envMapIntensity: 0.95
        }),
        White_Plastic: new THREE.MeshStandardMaterial({ color: '#ecebe6', roughness: 0.35 }),
        Orifice_Black: new THREE.MeshStandardMaterial({ color: '#060606', roughness: 0.5 }),
        // Opaque on purpose: transparent objects are not seen through transmissive glass
        Clear_Plastic: new THREE.MeshStandardMaterial({ color: '#e7edf0', roughness: 0.25 }),
        Label_Print: new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            roughness: 0.4,
            clearcoat: 0.35,
            clearcoatRoughness: 0.12,
            envMapIntensity: 0.55
        }),
        Label_Back_Paper: new THREE.MeshStandardMaterial({ color: '#e8e6df', roughness: 0.8 })
    };
}

// ---------- Bottle model ----------
class BottleModel {
    constructor(renderer, gltf) {
        this.renderer = renderer;
        this.group = new THREE.Group();
        this.labelCache = new Map();
        this.currentLabelId = null;
        this._tmpA = new THREE.Color();
        this._tmpB = new THREE.Color();
        this._tmpC = new THREE.Color();
        this.mats = makeMaterials();
        this._build(gltf);
    }

    _build(gltf) {
        const src = gltf.scene;
        src.updateMatrixWorld(true);

        // Bake every part into one bottle-sized, centred space
        const parts = [];
        src.traverse((o) => {
            if (!o.isMesh) return;
            const geo = toFloatAttributes(o.geometry.clone());
            geo.applyMatrix4(o.matrixWorld);
            parts.push({ geo, matName: (o.material && o.material.name) || '' });
        });
        const box = new THREE.Box3();
        parts.forEach((p) => { p.geo.computeBoundingBox(); box.union(p.geo.boundingBox); });
        const s = BOTTLE_HEIGHT / (box.max.y - box.min.y);
        const place = new THREE.Matrix4()
            .makeTranslation(0, -BOTTLE_HEIGHT / 2 - box.min.y * s, 0)
            .multiply(new THREE.Matrix4().makeScale(s, s, s));

        parts.forEach(({ geo, matName }) => {
            geo.applyMatrix4(place);
            geo.computeBoundingBox();
            geo.computeBoundingSphere();
            const mat = this.mats[matName] || this.mats.White_Plastic;
            const mesh = new THREE.Mesh(geo, mat);
            mesh.name = matName;
            if (matName === 'Perfume_Golden') {
                this.liquidGeo = geo;
                geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(geo.attributes.position.count * 3), 3));
            }
            this.group.add(mesh);
        });

        // Soft contact shadow under the glass foot
        const sh = document.createElement('canvas');
        sh.width = sh.height = 256;
        const sg = sh.getContext('2d');
        const grd = sg.createRadialGradient(128, 128, 0, 128, 128, 128);
        grd.addColorStop(0, 'rgba(0,0,0,0.6)');
        grd.addColorStop(0.5, 'rgba(0,0,0,0.24)');
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        sg.fillStyle = grd;
        sg.fillRect(0, 0, 256, 256);
        this.shadow = new THREE.Mesh(
            new THREE.PlaneGeometry(1.7, 0.9),
            new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sh), transparent: true, depthWrite: false, opacity: 0.85 })
        );
        this.shadow.rotation.x = -Math.PI / 2;
        this.shadow.position.y = -BOTTLE_HEIGHT / 2 - 0.006;
        this.group.add(this.shadow);
    }

    _labelTexture(id, name) {
        if (this.labelCache.has(id)) return this.labelCache.get(id);
        const tex = new THREE.CanvasTexture(drawLabelCanvas(name));
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.flipY = false; // glTF UV convention
        tex.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
        this.labelCache.set(id, tex);
        return tex;
    }

    // Preload label textures (call after fonts are ready)
    prepare(products) {
        products.forEach((p) => this._labelTexture(p.id, p.name));
    }

    _setLabel(product) {
        if (this.currentLabelId === product.id) return;
        this.currentLabelId = product.id;
        this.mats.Label_Print.map = this._labelTexture(product.id, product.name);
        this.mats.Label_Print.needsUpdate = true;
    }

    _paintLiquid(top, bottom) {
        if (!this.liquidGeo) return;
        const pos = this.liquidGeo.attributes.position;
        const col = this.liquidGeo.attributes.color;
        const bb = this.liquidGeo.boundingBox;
        const h = bb.max.y - bb.min.y;
        const c = this._tmpC;
        for (let i = 0; i < pos.count; i++) {
            const t = (pos.getY(i) - bb.min.y) / h; // 0 bottom → 1 top
            c.copy(bottom).lerp(top, THREE.MathUtils.smoothstep(t, 0, 1));
            col.setXYZ(i, c.r, c.g, c.b);
        }
        col.needsUpdate = true;
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
        backdrop = ['#0e1f3a', '#050b16'],
        preserveDrawingBuffer = false
    } = options;

    // Start the download before the GPU setup so both happen in parallel
    const modelReady = loadBottleModel();

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer
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
    scene.environmentIntensity = 0.9;

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

    const [gltf] = await Promise.all([modelReady, ensureFonts()]);
    const bottle = new BottleModel(renderer, gltf);
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
    function applyPose(t, dt) {
        // Frame-rate independent smoothing (same feel at 30, 60 or 120 fps)
        const e = 1 - Math.pow(1 - pose.ease, dt * 60);
        const c = pose.current, tg = pose.target;
        for (const k in c) c[k] += (tg[k] - c[k]) * e;
        pivot.position.set(c.x, c.y + Math.sin(t * 1.1) * 0.035, 0);
        pivot.rotation.set(c.rotX, c.rotY, c.rotZ + Math.sin(t * 0.7) * 0.012);
        pivot.scale.setScalar(c.scale);
    }

    function frame() {
        raf = 0;
        if (!running || !visible) return;
        const t = clock.getElapsedTime();
        const dt = Math.min(0.1, Math.max(0, t - lastT));
        lastT = t;
        applyPose(t, dt);
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

    // Render one still frame at the current target pose (used for snapshots)
    function renderStill() {
        Object.assign(pose.current, pose.target);
        pivot.position.set(pose.current.x, pose.current.y, 0);
        pivot.rotation.set(pose.current.rotX, pose.current.rotY, pose.current.rotZ);
        pivot.scale.setScalar(pose.current.scale);
        renderer.render(scene, camera);
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

    return { renderer, scene, camera, bottle, pose, start, stop, snap, resize, renderStill };
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

    // Frame-rate independent auto-spin (same speed on 60 Hz and 120 Hz screens)
    let last = performance.now();
    function tick(now) {
        const f = Math.min(4, (now - last) / (1000 / 60));
        last = now;
        if (!dragging) {
            velocity += (autoSpin - velocity) * 0.02 * f;
            pose.target.rotY += velocity * f;
        }
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}
