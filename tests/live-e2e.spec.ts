import { test, expect } from '@playwright/test';

test.describe('Live E2E Flow', () => {
  // Global handlers for strict testing
  test.beforeEach(async ({ page }) => {
    // 1. Fail test on unexpected native dialogs (alert, confirm, prompt)
    page.on('dialog', dialog => {
      throw new Error(`Unexpected native dialog fired: ${dialog.type()} with message: "${dialog.message()}"`);
    });

    // 2. Fail test on console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Only ignore specific known benign static asset 404s
        if (text.includes('favicon.ico') && text.includes('404')) return;
        if (text.includes('manifest.json') && text.includes('404')) return;
        throw new Error(`Console Error: ${text}`);
      }
    });
  });

  test('Homepage loads correctly without console errors or dialogs', async ({ page }) => {
    test.setTimeout(30000); // 30 seconds
    
    await page.goto('/');
    await expect(page).toHaveTitle(/ServiceApotheke|Home/i);
    await expect(page.locator('main')).toBeVisible();
  });
});
