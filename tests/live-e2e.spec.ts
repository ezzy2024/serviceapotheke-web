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
        throw new Error(`Console Error: ${msg.text()}`);
      }
    });
  });

  test('Pharmacist Registration -> Confirm Email -> Login -> Dashboard', async ({ page }) => {
    const testId = Date.now();
    const testEmail = `pharmacist_${testId}@e2e.test`;
    const testPassword = 'Password123!';

    // 1. Registration
    await page.goto('/register/pharmacist');
    
    // Step 1: Personal Info
    await page.fill('input[name="firstName"]', 'E2E');
    await page.fill('input[name="lastName"]', 'Tester');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="phone"]', '01511234567');
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.fill('input[name="street"]', 'Teststraße');
    await page.fill('input[name="houseNumber"]', '1');
    await page.fill('input[name="postalCode"]', '10115');
    await page.fill('input[name="city"]', 'Berlin');
    
    await page.click('button:has-text("Weiter")');

    // Step 2: Qualifications
    await expect(page.locator('h3:has-text("Qualifikationen")')).toBeVisible();
    await page.click('button:has-text("Weiter")');

    // Step 3: Documents
    await expect(page.locator('h3:has-text("Dokumente Upload")')).toBeVisible();
    await page.click('button:has-text("Registrierung abschließen")');

    // Step 4: OTP Confirmation
    await expect(page.locator('h3:has-text("E-Mail Best")')).toBeVisible();
    await page.fill('input[placeholder="123456"]', '123456');
    await page.click('button:has-text("Verifizieren")');

    // 2. Login
    await expect(page).toHaveURL(/\/login/);
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button:has-text("Anmelden")');

    // 3. Dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('Pharmacy Registration -> Confirm Email -> Login -> Dashboard', async ({ page }) => {
    const testId = Date.now();
    const testEmail = `pharmacy_${testId}@e2e.test`;
    const testPassword = 'Password123!';

    // 1. Registration
    await page.goto('/register/pharmacy');
    
    // Step 1: Pharmacy Info
    await page.fill('input[name="pharmacyName"]', 'E2E Apotheke');
    await page.fill('input[name="ownerFirstName"]', 'E2E');
    await page.fill('input[name="ownerLastName"]', 'Owner');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="phone"]', '01511234567');
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.fill('input[name="street"]', 'Apothekenweg');
    await page.fill('input[name="houseNumber"]', '42');
    await page.fill('input[name="postalCode"]', '10115');
    await page.fill('input[name="city"]', 'Berlin');
    
    await page.click('button:has-text("Registrierung abschließen")');

    // Step 2: OTP Confirmation
    await expect(page.locator('h3:has-text("E-Mail Best")')).toBeVisible();
    await page.fill('input[placeholder="123456"]', '123456');
    await page.click('button:has-text("Verifizieren")');

    // 2. Login
    await expect(page).toHaveURL(/\/login/);
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button:has-text("Anmelden")');

    // 3. Dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard');
  });
});
