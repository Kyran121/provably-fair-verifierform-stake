import { expect, test } from '@playwright/test';
import { writeFileSync } from 'fs';

///------------------------
/// CONSTANTS
///------------------------

// Cloudflare user agent
const USER_AGENT = '[redacted]';

// Seeding information
const CLIENT_SEED = '2Gb-U__XyD';
const SERVER_SEED = 'fad1d904fc884b817775353e8969741728d50b509cfdb0e2d854730ee21e446e';

// Difficulty
const DIFFICULTY = 'expert';

// Dartboard color palette
const COLOR_HEX_LIST = ['#0e202c', '#213843', '#fcc101', '#fb6120', '#fb053f', '#24e700'];

// Darts pay lines by difficulty and color index
const DARTS_PAY_TABLES = {
  easy: [0.5, 0.8, 1.2, 1.5, 2.7, 8.5],
  medium: [0.4, 0.6, 1.3, 3.1, 6, 16],
  hard: [0.2, 0.5, 2.5, 3.6, 8.8, 63],
  expert: [0.1, 0.5, 4.8, 9.6, 42, 500]
};

// Transform DARTS_PAY_TABLES into a lookup:
// difficulty -> color hex -> payout multiplier
const DART_PAY_TABLE_LOOKUP = Object.fromEntries(
  // Iterate over each difficulty level and its payline array
  Object.entries(DARTS_PAY_TABLES).map(([difficulty, multipliers]) => [
    difficulty,
    // Build an object: color hex -> multiplier
    Object.fromEntries(multipliers.map((multiplier, i) => [COLOR_HEX_LIST[i], multiplier]))
  ])
);

///------------------------
/// TYPES
///------------------------

type RGB = [number, number, number];

interface TestCase {
  clientSeed: string;
  serverSeed: string;
  nonce: number;
  difficulty: string;
  rotation: number;
  distance: number;
  pixelColor: string;
  multiplier: number;
}

///------------------------
/// TESTS
///------------------------

test.use({
  userAgent: USER_AGENT,
  storageState: 'storageState.json'
});

test('extract dart testcases from stake', async ({ page }, testInfo) => {
  // console.log('visiting stake provably fair page with query params:');
  // console.log('\tgame:\t\tdarts');
  // console.log('\tclientSeed:\t' + CLIENT_SEED);
  // console.log('\tserverSeed:\t' + SERVER_SEED);
  // console.log('\tnonce:\t\t0');
  // console.log('\tdifficulty:\texpert');
  // console.log();

  const response = await page.goto(
    `https://stake.com/provably-fair/calculation?game=darts&clientSeed=${CLIENT_SEED}&serverSeed=${SERVER_SEED}&nonce=0&dartsDifficulty=${DIFFICULTY}`
  );

  console.log('page loaded:', response?.status());
  console.log();

  if (response?.status() === 403) {
    console.log('stopped by cloudflare protection');
    return;
  }

  console.log('generating 200 testcases ...');
  console.log();

  const testcases: TestCase[] = [];

  for (let i = 0; i < 200; i++) {
    // Fill nonce
    const nonce = page.getByLabel('Nonce');
    await expect(nonce).toBeVisible();
    await nonce.fill('' + i);

    // Extract rotation
    const rotationEl = page.getByText(/Rotation -/);
    await expect(rotationEl).toBeVisible();
    const rotation = +(await rotationEl.innerText()).match(/0.\d+/)![0];

    // Extract distance
    const distanceEl = page.getByText(/Distance -/);
    await expect(distanceEl).toBeVisible();
    const distance = +(await distanceEl.innerText()).match(/0.\d+/)![0];

    // Extract pixel color dart landed on
    const dartEl = page.locator('.dart-animation');
    await expect(dartEl).toBeVisible();
    const pathEl = dartEl.locator(
      'svg g:nth-of-type(1) > g:nth-of-type(2) > g:nth-of-type(1) > g:nth-of-type(2) > path:nth-of-type(1)'
    );
    await expect(pathEl).toBeVisible();
    const pixelColor = (await pathEl.getAttribute('fill'))!;
    const [rr, gg, bb] = pixelColor.match(/\d+/g)!.map(Number);
    const closestColor = getClosestColor(rgbToHex([rr, gg, bb]), COLOR_HEX_LIST);

    // Extract multiplier
    const multiplier = DART_PAY_TABLE_LOOKUP[DIFFICULTY][closestColor];

    testcases.push({
      clientSeed: CLIENT_SEED,
      serverSeed: SERVER_SEED,
      nonce: i,
      difficulty: DIFFICULTY,
      rotation,
      distance,
      pixelColor: closestColor,
      multiplier
    });

    // console.log('added testcase:');
    // console.log('\tclientSeed:\t' + CLIENT_SEED);
    // console.log('\tserverSeed:\t' + SERVER_SEED);
    // console.log('\tnonce:\t\t' + i);
    // console.log('\tdifficulty:\teasy');
    // console.log('\trotation:\t' + rotation);
    // console.log('\tdistance:\t' + distance);
    // console.log('\tpixelColor:\t' + closestColor);
    // console.log('\tmultipler:\t' + multiplier);
    // console.log();
  }

  const outputPath = testInfo.outputPath('darts-testcases.json'); // writes to test-result folder

  // Write object to file as JSON
  writeFileSync(outputPath, JSON.stringify(testcases, null, 2), 'utf-8');
});

///------------------------
/// UTILS
///------------------------

function getClosestColor(targetHex: string, colorHexList: string[]): string {
  const targetRgb = hexToRgb(targetHex);

  const distance = (c1: RGB, c2: RGB): number =>
    Math.sqrt((c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2 + (c1[2] - c2[2]) ** 2);

  let closestHex = colorHexList[0];
  let minDistance = distance(targetRgb, hexToRgb(closestHex));

  for (let i = 1; i < colorHexList.length; i++) {
    const currentHex = colorHexList[i];
    const currentDistance = distance(targetRgb, hexToRgb(currentHex));

    if (currentDistance < minDistance) {
      minDistance = currentDistance;
      closestHex = currentHex;
    }
  }

  return closestHex;
}

function hexToRgb(hex: string): RGB {
  const sanitized = hex.replace(/^#/, '');
  if (sanitized.length !== 6) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const r = parseInt(sanitized.slice(0, 2), 16);
  const g = parseInt(sanitized.slice(2, 4), 16);
  const b = parseInt(sanitized.slice(4, 6), 16);
  return [r, g, b];
}

function rgbToHex([r, g, b]: RGB): string {
  const toHex = (value: number): string => {
    const hex = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
