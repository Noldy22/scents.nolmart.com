// Local preview server for the site (no dependencies).
//   node tools/dev-server.mjs [port]
// Also accepts POST /__save-product-image?id=<product-id> (PNG body) from
// tools/render-product-images.html, writing img/products/<id>.png.
// Only listens on 127.0.0.1 and is never deployed.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2] || 3000);
const TYPES = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.glb': 'model/gltf-binary', '.webp': 'image/webp'
};

http.createServer((req, res) => {
    const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

    if (req.method === 'POST' && url.pathname === '/__save-product-image') {
        const id = url.searchParams.get('id') || '';
        if (!/^[a-z0-9-]+$/.test(id)) { res.writeHead(400).end('bad id'); return; }
        const chunks = [];
        req.on('data', (c) => chunks.push(c));
        req.on('end', () => {
            const file = path.join(ROOT, 'img', 'products', `${id}.png`);
            fs.writeFileSync(file, Buffer.concat(chunks));
            res.writeHead(200).end('saved');
            console.log('saved', path.relative(ROOT, file));
        });
        return;
    }

    let rel = decodeURIComponent(url.pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    let file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    if (!fs.existsSync(file) && fs.existsSync(file + '.html')) file += '.html'; // cleanUrls like Vercel
    fs.readFile(file, (err, data) => {
        if (err) { res.writeHead(404).end('not found'); return; }
        res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
        res.end(data);
    });
}).listen(PORT, '127.0.0.1', () => console.log(`NolMart Scents preview on http://127.0.0.1:${PORT}`));
