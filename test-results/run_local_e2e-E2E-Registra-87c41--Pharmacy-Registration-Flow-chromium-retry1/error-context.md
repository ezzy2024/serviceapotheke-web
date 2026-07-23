# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: run_local_e2e.spec.ts >> E2E Registration Flow >> Pharmacy Registration Flow
- Location: tests\run_local_e2e.spec.ts:38:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/register/pharmacy
Call log:
  - navigating to "http://localhost:3000/register/pharmacy", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import axios from 'axios';
  3  | 
  4  | async function getMailTmAccount() {
  5  |   const domainRes = await axios.get('https://api.mail.tm/domains');
  6  |   const domain = domainRes.data['hydra:member'][0].domain;
  7  |   
  8  |   const randomString = Math.random().toString(36).substring(7);
  9  |   const email = `test_${randomString}@${domain}`;
  10 |   const password = 'TestPassword123!';
  11 | 
  12 |   await axios.post('https://api.mail.tm/accounts', { address: email, password });
  13 |   const tokenRes = await axios.post('https://api.mail.tm/token', { address: email, password });
  14 |   
  15 |   return { email, password, token: tokenRes.data.token };
  16 | }
  17 | 
  18 | async function getVerificationCode(token: string) {
  19 |   for (let i = 0; i < 20; i++) {
  20 |     const res = await axios.get('https://api.mail.tm/messages', {
  21 |       headers: { Authorization: `Bearer ${token}` }
  22 |     });
  23 |     
  24 |     if (res.data['hydra:member'].length > 0) {
  25 |       const msgId = res.data['hydra:member'][0].id;
  26 |       const msg = await axios.get(`https://api.mail.tm/messages/${msgId}`, {
  27 |         headers: { Authorization: `Bearer ${token}` }
  28 |       });
  29 |       const match = msg.data.text.match(/Dein Bestätigungscode lautet:\s*(\d{6})/);
  30 |       if (match) return match[1];
  31 |     }
  32 |     await new Promise(resolve => setTimeout(resolve, 3000));
  33 |   }
  34 |   throw new Error('No email received');
  35 | }
  36 | 
  37 | test.describe('E2E Registration Flow', () => {
  38 |   test('Pharmacy Registration Flow', async ({ page }) => {
  39 |     test.setTimeout(120000);
  40 |     const account = await getMailTmAccount();
  41 |     console.log(`Pharmacy Test Email: ${account.email}`);
  42 | 
> 43 |     await page.goto('/register/pharmacy');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/register/pharmacy
  44 |     
  45 |     // Step 1: Manually Enter (Search logic removed)
  46 | 
  47 |     await page.fill('input[name="pharmacyName"]', 'Test Apotheke');
  48 |     await page.fill('input[name="email"]', account.email);
  49 |     await page.fill('input[name="password"]', account.password);
  50 |     await page.fill('input[name="confirmPassword"]', account.password);
  51 |     await page.fill('input[name="street"]', 'Apothekenweg');
  52 |     await page.fill('input[name="houseNumber"]', '1');
  53 |     await page.fill('input[name="postalCode"]', '10115');
  54 |     await page.fill('input[name="city"]', 'Berlin');
  55 | 
  56 |     const weiterButtons = await page.locator('button:has-text("Weiter")').all();
  57 |     await weiterButtons[weiterButtons.length - 1].click();
  58 | 
  59 |     await page.waitForSelector('text=Infrastruktur & Details');
  60 |     await page.fill('input[name="licenseNumber"]', '123456789');
  61 |     await page.click('button:has-text("Weiter")');
  62 | 
  63 |     await page.waitForSelector('text=Verifizierung Dokument');
  64 | 
  65 |     const fs = require('fs');
  66 |     fs.writeFileSync('dummy.pdf', 'dummy content');
  67 |     
  68 |     await page.setInputFiles('input[type="file"]', 'dummy.pdf');
  69 |     await page.click('button:has-text("Registrierung abschließen")');
  70 | 
  71 |     await page.waitForSelector('text=E-Mail Bestätigung');
  72 | 
  73 |     console.log('Waiting for verification code...');
  74 |     const code = await getVerificationCode(account.token);
  75 |     console.log(`Received code: ${code}`);
  76 | 
  77 |     await page.fill('input[placeholder="123456"]', code);
  78 |     await page.click('button:has-text("Verifizieren")');
  79 | 
  80 |     await page.waitForURL('**/dashboard/pharmacy*');
  81 |     await page.waitForLoadState('networkidle');
  82 |     
  83 |     // Check Inventar is gone and side bar is okay
  84 |     await page.screenshot({ path: 'pharmacy_dashboard_local.png', fullPage: true });
  85 |     
  86 |     // Check PDL page (AMTS modal)
  87 |     await page.goto('/dashboard/pharmacy/pdl');
  88 |     await page.waitForLoadState('networkidle');
  89 |     await page.screenshot({ path: 'amts_modal_local.png', fullPage: true });
  90 | 
  91 |     console.log('Pharmacy registration completed successfully!');
  92 |   });
  93 | });
  94 | 
```