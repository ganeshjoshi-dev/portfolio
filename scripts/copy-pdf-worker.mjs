#!/usr/bin/env node
/**
 * Copy pdfjs-dist worker to public so it is served from same origin (no CDN).
 * Keeps the "All processing runs in your browser" promise accurate.
 * Run automatically after npm install via postinstall.
 */
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const src = join(root, 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs');
const dest = join(root, 'public', 'pdf.worker.min.mjs');
const destDir = dirname(dest);

if (!existsSync(src)) {
  console.warn('copy-pdf-worker: pdfjs-dist worker not found, skipping (run npm install)');
  process.exit(0);
}

if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log('copy-pdf-worker: copied pdf.worker.min.mjs to public/');
