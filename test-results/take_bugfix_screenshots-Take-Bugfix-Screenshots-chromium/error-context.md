# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: take_bugfix_screenshots.spec.ts >> Take Bugfix Screenshots
- Location: tests\take_bugfix_screenshots.spec.ts:3:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/register/pharmacy
Call log:
  - navigating to "http://localhost:3000/register/pharmacy", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('Take Bugfix Screenshots', async ({ page }) => {
  4  |   test.setTimeout(120000);
  5  |   
  6  |   const uniqueId = Date.now();
  7  |   const email = `test_${uniqueId}@web-library.net`;
  8  |   
  9  |   // 1. Pharmacy Registration Step 2
> 10 |   await page.goto('/register/pharmacy');
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/register/pharmacy
  11 |   await page.fill('input[name="pharmacyName"]', 'TestApo');
  12 |   await page.fill('input[name="email"]', email);
  13 |   await page.fill('input[name="password"]', 'TestPassword123!');
  14 |   await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
  15 |   await page.fill('input[name="street"]', 'Teststr');
  16 |   await page.fill('input[name="houseNumber"]', '1');
  17 |   await page.fill('input[name="postalCode"]', '10115');
  18 |   await page.fill('input[name="city"]', 'Berlin');
  19 |   await page.click('button:has-text("Weiter")');
  20 |   
  21 |   await page.waitForSelector('text=Infrastruktur & Details');
  22 |   await page.selectOption('select[name="softwareSystem"]', 'Andere');
  23 |   await page.waitForSelector('input[name="softwareSystemOther"]');
  24 |   await page.fill('input[name="softwareSystemOther"]', 'MyCustomWWS');
  25 |   await page.screenshot({ path: 'step2_dropdown_andere.png' });
  26 | 
  27 |   // Complete registration
  28 |   await page.click('button:has-text("Weiter")');
  29 |   await page.waitForSelector('text=SCHRITT 3 VON 3');
  30 |   await page.check('input[type="checkbox"]');
  31 |   await page.click('button:has-text("Registrierung abschlie�en")');
  32 |   
  33 |   // Wait for login/dashboard
  34 |   await page.waitForURL('**/dashboard/pharmacy*');
  35 | 
  36 |   // 2. PDL Page Umlaute
  37 |   await page.goto('/dashboard/pharmacy/pdl');
  38 |   await page.waitForLoadState('networkidle');
  39 |   
  40 |   // Unlock Vault
  41 |   await page.fill('input[type="password"]', 'TestPassword123!');
  42 |   // Wait a moment for modal animation
  43 |   await page.waitForTimeout(500);
  44 |   await page.screenshot({ path: 'vault_modal_umlaut.png' });
  45 |   await page.click('button:has-text("Entsperren")');
  46 |   await page.waitForLoadState('networkidle');
  47 | 
  48 |   // 3. Forgot Password
  49 |   // Need to log out or just go to forgot password (which works when logged out)
  50 |   await page.goto('/forgot-password');
  51 |   // Wait for React to render tabs, we select Pharmacy tab
  52 |   await page.waitForSelector('button:has-text("Apotheke")');
  53 |   await page.click('button:has-text("Apotheke")');
  54 |   await page.fill('input[type="email"]', email);
  55 |   await page.click('button:has-text("Code anfordern")');
  56 |   await page.waitForSelector('text=E-Mail gesendet!', { timeout: 10000 });
  57 |   await page.screenshot({ path: 'forgot_password_success.png' });
  58 | });
  59 | 
```