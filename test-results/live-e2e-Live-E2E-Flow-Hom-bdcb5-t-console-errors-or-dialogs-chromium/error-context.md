# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: live-e2e.spec.ts >> Live E2E Flow >> Homepage loads correctly without console errors or dialogs
- Location: tests\live-e2e.spec.ts:23:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Live E2E Flow', () => {
  4  |   // Global handlers for strict testing
  5  |   test.beforeEach(async ({ page }) => {
  6  |     // 1. Fail test on unexpected native dialogs (alert, confirm, prompt)
  7  |     page.on('dialog', dialog => {
  8  |       throw new Error(`Unexpected native dialog fired: ${dialog.type()} with message: "${dialog.message()}"`);
  9  |     });
  10 | 
  11 |     // 2. Fail test on console errors
  12 |     page.on('console', msg => {
  13 |       if (msg.type() === 'error') {
  14 |         const text = msg.text();
  15 |         // Only ignore specific known benign static asset 404s
  16 |         if (text.includes('favicon.ico') && text.includes('404')) return;
  17 |         if (text.includes('manifest.json') && text.includes('404')) return;
  18 |         throw new Error(`Console Error: ${text}`);
  19 |       }
  20 |     });
  21 |   });
  22 | 
  23 |   test('Homepage loads correctly without console errors or dialogs', async ({ page }) => {
  24 |     test.setTimeout(30000); // 30 seconds
  25 |     
> 26 |     await page.goto('/');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  27 |     await expect(page).toHaveTitle(/ServiceApotheke|Home/i);
  28 |     await expect(page.locator('main')).toBeVisible();
  29 |   });
  30 | });
  31 | 
```