/**
 * Extracts tool and game paths from config files for E2E smoke tests.
 * Run before test:e2e so e2e/paths.json is up to date.
 * Usage: node scripts/generate-e2e-paths.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function extractPaths(content) {
  const re = /path:\s*['"]([^'"]+)['"]/g;
  const paths = [];
  let m;
  while ((m = re.exec(content)) !== null) {
    paths.push(m[1]);
  }
  return paths;
}

const toolsContent = fs.readFileSync(path.join(root, 'src', 'config', 'tools.ts'), 'utf8');
const gamesContent = fs.readFileSync(path.join(root, 'src', 'config', 'games.ts'), 'utf8');

const toolPaths = extractPaths(toolsContent);
const gamePaths = extractPaths(gamesContent);

const outDir = path.join(root, 'e2e');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, 'paths.json'),
  JSON.stringify({ toolPaths, gamePaths }, null, 2),
  'utf8'
);

console.log('[generate-e2e-paths] Wrote e2e/paths.json with', toolPaths.length, 'tools and', gamePaths.length, 'games.');
