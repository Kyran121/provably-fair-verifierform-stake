import { expect, test } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

///------------------------
/// CONSTANTS
///------------------------

// Cloudflare user agent
const USER_AGENT = '[redacted]';

// Seeding information
const CLIENT_SEED = '2Gb-U__XyD';
const SERVER_SEED = 'fad1d904fc884b817775353e8969741728d50b509cfdb0e2d854730ee21e446e';

const ASSET_PATH_NONCES = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27,
  28, 29, 30, 31, 32, 34, 35, 36, 40, 41, 44, 45, 46, 48, 49, 50, 53, 55, 56, 57, 59, 60, 62, 63,
  65, 66, 67, 69, 70, 72, 74, 75, 77, 79, 81, 82, 83, 84, 85, 91, 95, 96, 98, 100, 102, 106, 107,
  110, 126, 133, 139, 142, 146, 154, 156, 163, 171, 183, 197, 206, 208, 212, 214, 217, 227, 241,
  248, 279, 286, 311, 316, 319, 326, 331, 343, 359, 363, 364, 397, 411, 420, 426, 430, 438, 481,
  499, 512, 554, 608, 629, 634, 639, 658, 750, 759, 824, 974, 1008, 1013, 1136, 1143, 1279, 1338,
  1372, 1438, 1647, 1677, 1684, 1743, 1807, 1838, 1937, 2130, 2269, 2323, 3178, 3261, 3623, 6731,
  6963, 8544, 15487, 29639, 34266, 38891, 39866, 45326, 48283, 130624, 147753, 2024111
];

///------------------------
/// TESTS
///------------------------

test.use({
  userAgent: USER_AGENT,
  storageState: 'storageState.json'
});

test('extract 240 assets for packs from stake', async ({ page, request }, testInfo) => {
  const response = await page.goto(
    `https://stake.com/provably-fair/calculation?game=packs&clientSeed=${CLIENT_SEED}&serverSeed=${SERVER_SEED}&nonce=0`
  );

  console.log('page loaded:', response?.status());
  console.log();

  if (response?.status() === 403) {
    console.log('stopped by cloudflare protection');
    return;
  }

  console.log('extracting 240 asset paths ...');
  console.log();

  const assets: Set<string> = new Set();

  for (const i of ASSET_PATH_NONCES) {
    // Fill nonce
    const nonce = page.getByLabel('Nonce');
    await expect(nonce).toBeVisible();
    await nonce.fill('' + i);

    // Extract img paths
    const cardsContainer = page.locator('.cards-container');
    await expect(cardsContainer).toBeVisible();
    const images = await cardsContainer.locator('img').all();
    const paths = await Promise.all(images.map((img) => img.getAttribute('src')));
    paths.forEach((path) => assets.add(`https://stake.com${path!}`));
  }

  const outDir = testInfo.outputPath('svgs');
  await mkdir(outDir, { recursive: true }); // await to ensure dir exists

  for (const batch of chunk([...assets], 50)) {
    await Promise.all(
      batch.map(async (url) => {
        const res = await request.get(url);
        expect(res.ok(), `GET ${url} -> ${res.status()}`).toBeTruthy();

        // Ensure a clean basename (works cross-platform)
        const name = `${url.match(/c\d+/)![0]}.svg`; // e.g. "icon.svg"
        const filePath = path.join(outDir, name);

        // Normalize body to Buffer for fs.writeFile
        const body = await res.body(); // Buffer in Node; some typings suggest ArrayBuffer
        const buf = body instanceof Buffer ? body : Buffer.from(body);

        await writeFile(filePath, buf);
      })
    );
  }
});

///------------------------
/// UTILS
///------------------------

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
