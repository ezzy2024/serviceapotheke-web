import { test, expect } from '@playwright/test';

test('Take Bugfix Screenshots', async ({ page }) => {
  test.setTimeout(120000);
  
  const uniqueId = Date.now();
  const email = `test_${uniqueId}@web-library.net`;
  
  // 1. Pharmacy Registration Step 2
  await page.goto('https://serviceapotheke.tech/register/pharmacy');
  await page.fill('input[name="pharmacyName"]', 'TestApo');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', 'TestPassword123!');
  await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
  await page.fill('input[name="street"]', 'Teststr');
  await page.fill('input[name="houseNumber"]', '1');
  await page.fill('input[name="postalCode"]', '10115');
  await page.fill('input[name="city"]', 'Berlin');
  await page.click('button:has-text("Weiter")');
  
  await page.waitForSelector('text=Infrastruktur & Details');
  await page.selectOption('select[name="softwareSystem"]', 'Andere');
  await page.waitForSelector('input[name="softwareSystemOther"]');
  await page.fill('input[name="softwareSystemOther"]', 'MyCustomWWS');
  await page.screenshot({ path: 'step2_dropdown_andere.png' });

  // Complete registration
  await page.click('button:has-text("Weiter")');
  await page.waitForSelector('text=SCHRITT 3 VON 3');
  await page.check('input[type="checkbox"]');
  await page.click('button:has-text("Kostenpflichtig registrieren")');
  
  // Wait for login/dashboard
  await page.waitForURL('**/dashboard/pharmacy*');

  // 2. PDL Page Umlaute
  await page.goto('https://serviceapotheke.tech/dashboard/pharmacy/pdl');
  await page.waitForLoadState('networkidle');
  
  // Unlock Vault
  await page.fill('input[type="password"]', 'TestPassword123!');
  // Wait a moment for modal animation
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'vault_modal_umlaut.png' });
  await page.click('button:has-text("Entsperren")');
  await page.waitForLoadState('networkidle');

  // 3. Forgot Password
  // Need to log out or just go to forgot password (which works when logged out)
  await page.goto('https://serviceapotheke.tech/forgot-password');
  // Wait for React to render tabs, we select Pharmacy tab
  await page.waitForSelector('button:has-text("Apotheke")');
  await page.click('button:has-text("Apotheke")');
  await page.fill('input[type="email"]', email);
  await page.click('button:has-text("Code anfordern")');
  await page.waitForSelector('text=E-Mail gesendet!', { timeout: 10000 });
  await page.screenshot({ path: 'forgot_password_success.png' });
});
