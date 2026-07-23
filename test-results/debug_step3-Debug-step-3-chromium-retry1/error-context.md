# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: debug_step3.spec.ts >> Debug step 3
- Location: tests\debug_step3.spec.ts:3:5

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
  3  | test('Debug step 3', async ({ page }) => {
> 4  |   await page.goto('/register/pharmacy');
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/register/pharmacy
  5  |   
  6  |   await page.fill('input[placeholder*="Suchen Sie Ihre Apotheke"]', 'Not Real Apotheke 99');
  7  |   await page.waitForSelector('text=Registrierung');
  8  |   await page.click('button:has-text("Weiter")');
  9  | 
  10 |   await page.fill('input[name="pharmacyName"]', 'Test Apotheke');
  11 |   await page.fill('input[name="email"]', 'test@example.com');
  12 |   await page.fill('input[name="password"]', 'TestPassword123!');
  13 |   await page.fill('input[name="confirmPassword"]', 'TestPassword123!');
  14 |   await page.fill('input[name="street"]', 'Apothekenweg');
  15 |   await page.fill('input[name="houseNumber"]', '1');
  16 |   await page.fill('input[name="postalCode"]', '10115');
  17 |   await page.fill('input[name="city"]', 'Berlin');
  18 | 
  19 |   const weiterButtons = await page.locator('button:has-text("Weiter")').all();
  20 |   await weiterButtons[weiterButtons.length - 1].click();
  21 | 
  22 |   await page.waitForSelector('text=Infrastruktur & Details');
  23 |   await page.fill('input[name="licenseNumber"]', '123456789');
  24 |   
  25 |   await page.screenshot({ path: 'step2.png' });
  26 |   
  27 |   await page.click('button:has-text("Weiter")');
  28 |   
  29 |   await page.waitForTimeout(1000); // Wait for transition
  30 |   await page.screenshot({ path: 'step3.png' });
  31 | });
  32 | 
```