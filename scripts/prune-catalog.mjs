#!/usr/bin/env node
/**
 * Keeps only the MCP-focused catalog in lib/data.ts.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '../lib/data.ts');

const KEEP_SLUGS = new Set([
  'nook-muhasebe-mcp',
  'cal-com',
  'chatwoot',
  'outline',
  'plausible',
  'metabase',
]);

const content = fs.readFileSync(dataPath, 'utf8');
const blockRegex = /  \{\n    slug: '([^']+)',[\s\S]*?\n  \},?\n/g;

let removed = 0;
let kept = 0;
const next = content.replace(blockRegex, (match, slug) => {
  if (!KEEP_SLUGS.has(slug)) {
    removed += 1;
    return '';
  }
  kept += 1;
  return match;
});

if (removed === 0 && kept === KEEP_SLUGS.size) {
  console.log(`Catalog already trimmed (${kept} services).`);
} else {
  fs.writeFileSync(dataPath, next);
  console.log(`Kept ${kept}, removed ${removed}.`);
}
