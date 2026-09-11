#!/usr/bin/env node
/**
 * Auth modu: dev (tek tık giriş) ↔ prod (Google + şifre)
 * Kullanım: node scripts/set-auth-mode.mjs dev|prod
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const mode = process.argv[2];
if (mode !== 'dev' && mode !== 'prod') {
  console.error('Kullanım: node scripts/set-auth-mode.mjs <dev|prod>');
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(root, '.env');
const examplePath = path.join(root, '.env.example');

const DEV_LINES = {
  ENABLE_DEV_AUTO_LOGIN: 'true',
  NEXT_PUBLIC_ENABLE_DEV_AUTO_LOGIN: 'true',
  ENABLE_GOOGLE_OAUTH: 'false',
  NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH: 'false',
  ENABLE_GOOGLE_OAUTH_BYPASS: 'true',
  NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH_BYPASS: 'true',
};

const PROD_LINES = {
  ENABLE_DEV_AUTO_LOGIN: 'false',
  NEXT_PUBLIC_ENABLE_DEV_AUTO_LOGIN: 'false',
  ENABLE_GOOGLE_OAUTH: 'true',
  NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH: 'true',
  ENABLE_GOOGLE_OAUTH_BYPASS: 'false',
  NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH_BYPASS: 'false',
  SUPPORT_DEMO_MODE: 'false',
};

const DEV_SUPPORT = { SUPPORT_DEMO_MODE: 'true' };

const lines = mode === 'dev' ? { ...DEV_LINES, ...DEV_SUPPORT } : PROD_LINES;

function upsertEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    if (filePath.endsWith('.env.example')) {
      return;
    }
    console.warn(`[auth-mode] ${filePath} bulunamadı, atlanıyor.`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const keys = Object.keys(lines);

  for (const key of keys) {
    const value = lines[key];
    const pattern = new RegExp(`^${key}=.*$`, 'm');
    if (pattern.test(content)) {
      content = content.replace(pattern, `${key}=${value}`);
    } else {
      content += `\n${key}=${value}\n`;
    }
  }

  fs.writeFileSync(filePath, content);
  console.log(`[auth-mode] ${path.basename(filePath)} → ${mode}`);
}

upsertEnv(envPath);
if (mode === 'prod') {
  upsertEnv(examplePath);
}

console.log(
  mode === 'dev'
    ? 'Geliştirme: Google kapalı, tek tıkla giriş aktif.'
    : 'Production: Google OAuth açık, otomatik giriş kapalı.'
);
