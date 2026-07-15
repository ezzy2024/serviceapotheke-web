import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 1,
  reporter: 'list',
  use: {
    video: 'on',
    screenshot: 'on',
    trace: 'on',
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:3000',
    permissions: ['camera', 'microphone'],
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
        }
      },
    }
  ],

});
