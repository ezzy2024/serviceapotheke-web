import { test, expect } from '@playwright/test';

test('Debug step 3', async ({ page }) => {
  await page.goto('https://serviceapotheke.tech/register/pharmacy');
  
  await page.fill('input[placeholder*="Suchen Sie Ihre Apotheke"]', 'Not Real Apotheke 99');
  await page.waitForSelector('text=Keine Apotheke gefunden?');
  await page.click('button:has-text("Manuell eintragen")');

  await page.fill('input[name="pharmacyName"]', 'Test Apotheke');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'TestPassword123!');
  await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
  await page.fill('input[name="street"]', 'Apothekenweg');
  await page.fill('input[name="houseNumber"]', '1');
  await page.fill('input[name="postalCode"]', '10115');
  await page.fill('input[name="city"]', 'Berlin');

  const weiterButtons = await page.locator('button:has-text("Weiter")').all();
  await weiterButtons[weiterButtons.length - 1].click();

  await page.waitForSelector('text=Infrastruktur & Details');
  await page.fill('input[name="licenseNumber"]', '123456789');
  
  await page.screenshot({ path: 'step2.png' });
  
  await page.click('button:has-text("Weiter")');
  
  await page.waitForTimeout(1000); // Wait for transition
  await page.screenshot({ path: 'step3.png' });
});
