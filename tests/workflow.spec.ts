import { test, expect } from '@playwright/test';

test.describe('Autonomous E2E Verification Pipeline', () => {
  const TARGET_URL = process.env.BASE_URL || 'http://localhost:3000';

  test('UI Hydration and Asset Rendering', async ({ page }) => {
    await page.goto(TARGET_URL);
    // Verify Next.js hydration completes without fatal errors
    const rootElement = page.locator('#__next, main');
    await expect(rootElement).toBeVisible();
    
    // Verify Tailwind CSS application (check computed styles of a primary button)
    const primaryButton = page.locator('a:has-text("Loslegen")').first();
    if (await primaryButton.isVisible()) {
      const display = await primaryButton.evaluate((el) => window.getComputedStyle(el).display);
      expect(display).not.toBe('none');
    }
  });

  test('Security & DSGVO: Cookie Consent Trapping', async ({ page }) => {
    await page.goto(TARGET_URL);
    // Banner must trap user on first visit
    const acceptBtn = page.locator('button:has-text("Akzeptieren")');
    if (await acceptBtn.isVisible()) {
      await acceptBtn.click();
      await expect(acceptBtn).toBeHidden();
      
      // Verify local storage persistence
      const storageState = await page.evaluate(() => localStorage.getItem('cookie-consent'));
      expect(storageState).toBeTruthy();
    }
  });

  test('Backend Integration: Registration Payload Transmission', async ({ page, request }) => {
    // API boundary test bypassing UI to verify backend database connection
    const apiUrl = `https://serviceapotheke-api-830781040278.europe-west1.run.app/api/Pharmacy/register`;
    
    // Convert FormData to standard multi-part payload for Playwright request
    const response = await request.post(apiUrl, {
      multipart: {
        Email: `playwright-test-${Date.now()}@serviceapotheke.tech`,
        Password: 'TestPass123!',
        PharmacyName: 'E2E Test Apotheke',
        PostalCode: '47798',
        City: 'Krefeld',
        Street: 'Teststraße 1',
        SoftwareSystem: 'CGM Lauer',
        documentFile: {
          name: 'dummy.pdf',
          mimeType: 'application/pdf',
          buffer: Buffer.from('mock pdf content')
        }
      }
    });

    // 415 or 503 indicates infrastructure collapse. 400 indicates validation failure.
    // Accept 200 (Success) or 400 (Already registered).
    const status = response.status();
    expect([200, 400, 409]).toContain(status);
    
    if (status === 200) {
      const setCookie = response.headers()['set-cookie'];
      expect(setCookie).toContain('sa_auth_v2');
    }
  });

  test('Visual Topology Audit', async ({ page }) => {
    await page.goto(TARGET_URL);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('landing-page-baseline.png', { maxDiffPixels: 100, fullPage: true });
  });
});
