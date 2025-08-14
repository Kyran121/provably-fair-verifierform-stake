import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 60000, // 60 seconds per test
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173
  },
  testIgnore: ['gen/**'],
  testDir: 'e2e'
});
