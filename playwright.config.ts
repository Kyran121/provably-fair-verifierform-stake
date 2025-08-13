import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173
  },
  testIgnore: ['gen/**'],
  testDir: 'e2e'
});
