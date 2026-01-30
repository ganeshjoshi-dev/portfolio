/**
 * Validates that every tool in src/config/tools.ts has a registry entry and a
 * page component file. Run before build to catch missing tool pages.
 * Usage: node scripts/validate-tool-registry.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const configPath = path.join(root, 'src', 'config', 'tools.ts');
const registryPath = path.join(root, 'src', 'components', 'tools', 'pages', 'registry.tsx');
const pagesDir = path.join(root, 'src', 'components', 'tools', 'pages');

function extractToolIdsFromConfig(content) {
  const ids = [];
  const re = /id:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    ids.push(m[1]);
  }
  return ids;
}

function extractRegistryKeys(content) {
  const keys = [];
  const re = /['"]([a-z0-9-]+)['"]:\s*lazy\s*\(/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    keys.push(m[1]);
  }
  return keys;
}

function main() {
  const configContent = fs.readFileSync(configPath, 'utf8');
  const registryContent = fs.readFileSync(registryPath, 'utf8');

  const configIds = extractToolIdsFromConfig(configContent);
  const registryKeys = extractRegistryKeys(registryContent);

  const pageFiles = fs.readdirSync(pagesDir);
  const pageNames = pageFiles
    .filter((f) => f.endsWith('.tsx') && f !== 'registry.tsx' && f !== 'index.tsx')
    .map((f) => f.replace(/\.tsx$/, ''));

  let failed = false;

  for (const id of configIds) {
    if (!registryKeys.includes(id)) {
      console.error(`[validate-tool-registry] Tool "${id}" is in config but missing from registry (src/components/tools/pages/registry.tsx).`);
      failed = true;
    }
    if (!pageNames.includes(id)) {
      console.error(`[validate-tool-registry] Tool "${id}" is in config but missing page file: src/components/tools/pages/${id}.tsx`);
      failed = true;
    }
  }

  for (const key of registryKeys) {
    if (!configIds.includes(key)) {
      console.error(`[validate-tool-registry] Registry has "${key}" but it is not in config (src/config/tools.ts).`);
      failed = true;
    }
  }

  if (failed) {
    process.exit(1);
  }

  console.log('[validate-tool-registry] All tools have matching registry entries and page files.');
}

main();
