// npm i -D playwright-core && npm run dev
// node scripts/capture-screenshots.mjs
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'docs', 'screenshots');
const baseUrl = process.env.SCREENSHOT_URL || 'http://localhost:5173/';

const shots = [
  { file: 'launcher.png', click: null },
  { file: 'crest.png', click: 'nav >> text=Герб семьи' },
  { file: 'ornament.png', click: 'nav >> text=Орнамент Прикамья' }
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1
});

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 30_000 });
await page.addStyleTag({ content: '::-webkit-scrollbar { display: none } html { scroll-behavior: auto !important }' });
await pause(800);

for (const shot of shots) {
  if (shot.click) {
    await page.click(shot.click);
    await pause(500);
  }
  const path = join(outDir, shot.file);
  await page.screenshot({ path, type: 'png', animations: 'disabled' });
  console.log(`wrote ${path}`);
}

await browser.close();
