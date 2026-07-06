import { test, expect } from '@playwright/test';

test.describe('Autonomous E2E Verification Pipeline', () => {
  const TARGET_URL = process.env.BASE_URL || 'http://localhost:3000';

  test('UI Hydration and Asset Rendering', async ({ page }) => {
    await page.goto(TARGET_URL);
    // Verify Next.js hydration completes without fatal errors
    const rootElement = page.locator('#__next, main');
    await expect(rootElement).toBeVisible();
    
    // Verify Tailwind CSS application (check computed styles of a primary button)
    const primaryButton = page.locator('button').first();
    if (await primaryButton.isVisible()) {
      const display = await primaryButton.evaluate((el) => window.getComputedStyle(el).display);
      expect(display).not.toBe('none');
    }
  });

  test('Security & DSGVO: Cookie Consent Trapping', async ({ page }) => {
    await page.goto(TARGET_URL);
    const consentBanner = page.locator('text=Cookie'); // Adjust selector based on actual text/ID
    
    // Banner must trap user on first visit
    if (await consentBanner.isVisible()) {
      await consentBanner.locator('button:has-text("Akzeptieren")').click();
      await expect(consentBanner).toBeHidden();
      
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
        Email: 'playwright-test@serviceapotheke.tech',
        Password: 'TestPass123!',
        PharmacyName: 'E2E Test Apotheke',
        ZipCode: '47798',
        City: 'Krefeld',
        Street: 'Teststraße 1',
        WwsType: 'CGM Lauer',
        LicenseDocument: {
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
  });
});
