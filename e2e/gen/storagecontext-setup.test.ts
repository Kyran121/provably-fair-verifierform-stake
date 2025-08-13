import { chromium, test } from '@playwright/test';

// Cloudflare clearance cookie
const CF_COOKIE = '[redacted]';

// Cloudflare user agent
const USER_AGENT = '[redacted]';

// Cloudflare domain
const DOMAIN = '.stake.com';

test('stake storage context setup', async ({ page }) => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    userAgent: USER_AGENT
  });

  await context.addCookies([
    {
      name: 'cf_clearance',
      value: CF_COOKIE,
      domain: DOMAIN,
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'Lax'
    }
  ]);

  await context.storageState({ path: 'storageState.json' });
  await browser.close();

  console.log('✅ storageState.json written');
});
