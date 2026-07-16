import { test, expect } from '@playwright/test';
import { Client } from 'pg';

test('Take specific screenshots without mail.tm', async ({ page }) => {
  test.setTimeout(120000);
  const randomString = Math.random().toString(36).substring(7);
  const email = `test_${randomString}@example.com`;
  const password = 'TestPassword123!';

  await page.goto('https://serviceapotheke.tech/register/pharmacy');
  
  // Step 1: Manually Enter (Search logic removed)

  await page.fill('input[name="pharmacyName"]', 'Test Apotheke');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="confirmPassword"]', password);
  await page.fill('input[name="street"]', 'Apothekenweg');
  await page.fill('input[name="houseNumber"]', '1');
  await page.fill('input[name="postalCode"]', '10115');
  await page.fill('input[name="city"]', 'Berlin');

  const weiterButtons = await page.locator('button:has-text("Weiter")').all();
  await weiterButtons[weiterButtons.length - 1].click();

  await page.waitForSelector('text=Infrastruktur & Details');
  await page.fill('input[name="licenseNumber"]', '123456789');
  await page.click('button:has-text("Weiter")');

  await page.waitForSelector('text=Verifizierung Dokument');
  const fs = require('fs');
  fs.writeFileSync('dummy.pdf', 'dummy content');
  await page.setInputFiles('input[type="file"]', 'dummy.pdf');
  await page.click('button:has-text("Registrierung abschließen")');

  await page.waitForSelector('text=E-Mail Bestätigung');

  // Fetch token directly from the database
  const client = new Client({
    host: 'localhost',
    port: 5433,
    database: 'serviceapotheke-db',
    user: 'appuser',
    password: 'ServiceApotheke2026Strong'
  });
  await client.connect();
  let code = null;
  for (let i = 0; i < 10; i++) {
    const res = await client.query('SELECT "EmailConfirmationToken" FROM "Pharmacies" WHERE "Email" = $1', [email]);
    if (res.rows.length > 0 && res.rows[0].EmailConfirmationToken) {
      code = res.rows[0].EmailConfirmationToken;
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  await client.end();

  if (!code) throw new Error("Could not find code in DB");

  await page.fill('input[placeholder="123456"]', code);
  await page.click('button:has-text("Verifizieren")');

  await page.waitForURL('**/dashboard/pharmacy*');
  await page.waitForLoadState('networkidle');
  
  await page.screenshot({ path: 'pharmacy_dashboard.png', fullPage: true });
  
  await page.goto('https://serviceapotheke.tech/dashboard/pharmacy/pdl');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'amts_modal.png', fullPage: true });

  console.log('Screenshots captured successfully!');
});
