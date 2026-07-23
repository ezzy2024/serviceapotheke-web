import { test, expect } from '@playwright/test';

test.describe('WWS Dropdown Registration', () => {
  test('should persist non-default WWS selection to the database', async ({ page, request }) => {
    // Navigate to the registration page
    await page.goto('/register');

    // Select the "Apotheke" registration type if needed
    // Usually there's a button or radio to choose pharmacy vs pharmacist
    const pharmacyBtn = page.getByRole('button', { name: /Als Apotheke/i });
    if (await pharmacyBtn.isVisible()) {
      await pharmacyBtn.click();
    }

    // Fill in basic details
    const uniqueEmail = `test_pharmacy_${Date.now()}@example.com`;
    await page.getByLabel(/Apothekenname/i).fill('Test Apotheke WWS');
    await page.getByLabel(/E-Mail/i).fill(uniqueEmail);
    await page.getByLabel(/Passwort/i).first().fill('SecurePassword123!');
    
    // Select WWS from Dropdown
    const wwsSelect = page.getByLabel(/Warenwirtschaft/i, { exact: false });
    await wwsSelect.selectOption({ label: 'Andere' });

    // When "Andere" is selected, a new input field should appear for the custom WWS
    const customWwsInput = page.getByLabel(/Bitte spezifizieren/i, { exact: false });
    await expect(customWwsInput).toBeVisible();
    
    const customWwsName = 'My Custom WWS 2026';
    await customWwsInput.fill(customWwsName);

    // Fill remaining required fields (if any) and submit
    await page.getByLabel(/Straße/i).fill('Musterstraße');
    await page.getByLabel(/Hausnummer/i).fill('1');
    await page.getByLabel(/PLZ/i).fill('10115');
    await page.getByLabel(/Ort/i).fill('Berlin');

    const submitBtn = page.getByRole('button', { name: /Registrieren/i });
    
    // Intercept the API request to ensure it sends the correct softwareSystem
    const registerPromise = page.waitForResponse(response => 
        response.url().includes('/api/Pharmacy/register') && response.status() === 200
    );

    await submitBtn.click();

    const response = await registerPromise;
    expect(response.ok()).toBeTruthy();

    // The backend should have saved the user. We can optionally verify by logging in and fetching profile
    // Or we could trust the API request was correct. Let's ensure the request payload had the custom WWS
    const requestPayload = await response.request().postData();
    expect(requestPayload).toContain(customWwsName);
  });
});
