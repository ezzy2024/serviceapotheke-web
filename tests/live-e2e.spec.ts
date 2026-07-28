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

  test('Pharmacist Registration Flow (Deterministic)', async ({ page }) => {
    test.setTimeout(60000);
    const testEmail = `test_pharmacist_${Date.now()}@example.com`;
    const password = 'TestPassword123!';

    await page.goto('/register/pharmacist');
    
    // Step 1: Personal Data
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'Pharmacist');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.fill('input[name="street"]', 'Teststraße');
    await page.fill('input[name="houseNumber"]', '1');
    await page.fill('input[name="postalCode"]', '10115');
    await page.fill('input[name="city"]', 'Berlin');
    
    await page.click('button:has-text("Weiter")');

    // Step 2: Qualifications
    await page.waitForSelector('text=Qualifikationen & Kenntnisse');
    await page.click('button:has-text("Weiter")');

    // Step 3: Document Upload -> Submit
    await page.waitForSelector('text=Dokumente Upload');
    await page.click('button:has-text("Registrierung abschließen")');

    // Step 4: Email Verification screen should appear
    await page.waitForSelector('text=E-Mail Bestätigung');
    
    // We stop here to avoid flaky real-world email delivery dependencies
    await expect(page.locator('text=E-Mail Bestätigung')).toBeVisible();
  });

  test('Pharmacy Registration Flow (Deterministic)', async ({ page }) => {
    test.setTimeout(60000);
    const testEmail = `test_pharmacy_${Date.now()}@example.com`;
    const password = 'TestPassword123!';

    await page.goto('/register/pharmacy');
    
    // Step 1: Manually Enter
    await page.fill('input[name="pharmacyName"]', 'Test Apotheke');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.fill('input[name="street"]', 'Apothekenweg');
    await page.fill('input[name="houseNumber"]', '1');
    await page.fill('input[name="postalCode"]', '10115');
    await page.fill('input[name="city"]', 'Berlin');

    const weiterButtons = await page.locator('button:has-text("Weiter")').all();
    await weiterButtons[weiterButtons.length - 1].click();

    // Step 2: Infrastructure
    await page.waitForSelector('text=Infrastruktur & Details');
    await page.fill('input[name="licenseNumber"]', '123456789');
    await page.click('button:has-text("Weiter")');

    // Step 3: Verify Document
    await page.waitForSelector('text=Verifizierung Dokument');

    // We can't easily upload a file in this simplified deterministic test unless we mock it or write it
    // Actually, in playwright, we can just use setInputFiles with a buffer or a real file
    // Let's create a dummy file on the fly
    const fs = require('fs');
    fs.writeFileSync('dummy.pdf', 'dummy content');
    await page.setInputFiles('input[type="file"]', 'dummy.pdf');

    await page.click('button:has-text("Registrierung abschließen")');

    // Step 4: Email Verification screen should appear
    await page.waitForSelector('text=E-Mail Bestätigung');
    
    // Stop here to avoid mail.tm flakiness
    await expect(page.locator('text=E-Mail Bestätigung')).toBeVisible();
  });
});
