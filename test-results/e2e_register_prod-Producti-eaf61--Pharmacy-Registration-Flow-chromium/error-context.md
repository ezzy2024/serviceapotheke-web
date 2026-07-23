# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e_register_prod.spec.ts >> Production Registration E2E >> Pharmacy Registration Flow
- Location: tests\e2e_register_prod.spec.ts:95:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/register/pharmacy
Call log:
  - navigating to "http://localhost:3000/register/pharmacy", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import axios from 'axios';
  3   | 
  4   | async function getMailTmAccount() {
  5   |   const response = await fetch('https://api.mail.tm/domains');
  6   |   const domains = await response.json();
  7   |   const domain = domains['hydra:member'][0].domain;
  8   |   const email = `test_${Date.now()}@${domain}`;
  9   |   const password = 'TestPassword123!';
  10  | 
  11  |   await fetch('https://api.mail.tm/accounts', {
  12  |     method: 'POST',
  13  |     headers: { 'Content-Type': 'application/json' },
  14  |     body: JSON.stringify({ address: email, password })
  15  |   });
  16  | 
  17  |   const tokenResponse = await fetch('https://api.mail.tm/token', {
  18  |     method: 'POST',
  19  |     headers: { 'Content-Type': 'application/json' },
  20  |     body: JSON.stringify({ address: email, password })
  21  |   });
  22  |   const { token } = await tokenResponse.json();
  23  | 
  24  |   return { email, password, token };
  25  | }
  26  | 
  27  | async function getVerificationCode(token: string) {
  28  |   for (let i = 0; i < 60; i++) {
  29  |     const res = await axios.get('https://api.mail.tm/messages', {
  30  |       headers: { Authorization: `Bearer ${token}` }
  31  |     });
  32  |     
  33  |     if (res.data['hydra:member'].length > 0) {
  34  |       const msgId = res.data['hydra:member'][0].id;
  35  |       const msg = await axios.get(`https://api.mail.tm/messages/${msgId}`, {
  36  |         headers: { Authorization: `Bearer ${token}` }
  37  |       });
  38  |       const match = msg.data.text.match(/Dein Bestätigungscode lautet:\s*(\d{6})/);
  39  |       if (match) return match[1];
  40  |     }
  41  |     await new Promise(r => setTimeout(r, 3000));
  42  |   }
  43  |   throw new Error('Verification code not received');
  44  | }
  45  | 
  46  | test.describe('Production Registration E2E', () => {
  47  |   test.setTimeout(120000); // 2 minutes
  48  | 
  49  |   test('Pharmacist Registration Flow', async ({ page }) => {
  50  |     const account = await getMailTmAccount();
  51  |     console.log(`Pharmacist Test Email: ${account.email}`);
  52  | 
  53  |     await page.goto('/register/pharmacist');
  54  |     
  55  |     // Step 1: Personal Data
  56  |     await page.fill('input[name="firstName"]', 'Test');
  57  |     await page.fill('input[name="lastName"]', 'Pharmacist');
  58  |     await page.fill('input[name="email"]', account.email);
  59  |     await page.fill('input[name="password"]', account.password);
  60  |     await page.fill('input[name="confirmPassword"]', account.password);
  61  |     await page.fill('input[name="street"]', 'Teststraße');
  62  |     await page.fill('input[name="houseNumber"]', '1');
  63  |     await page.fill('input[name="postalCode"]', '10115');
  64  |     await page.fill('input[name="city"]', 'Berlin');
  65  |     
  66  |     await page.click('button:has-text("Weiter")');
  67  | 
  68  |     // Step 2: Qualifications
  69  |     await page.waitForSelector('text=Qualifikationen & Kenntnisse');
  70  |     await page.click('button:has-text("Weiter")');
  71  | 
  72  |     // Step 3: Document Upload (Optional) -> Submit
  73  |     await page.waitForSelector('text=Dokumente Upload');
  74  |     await page.click('button:has-text("Registrierung abschließen")');
  75  | 
  76  |     // Step 4: Email Verification
  77  |     await page.waitForSelector('text=E-Mail Bestätigung');
  78  | 
  79  |     // Get code from Mail.tm
  80  |     console.log('Waiting for verification code...');
  81  |     const code = await getVerificationCode(account.token);
  82  |     console.log(`Received code: ${code}`);
  83  | 
  84  |     // Enter code
  85  |     await page.fill('input[placeholder="123456"]', code);
  86  |     await page.click('button:has-text("Verifizieren")');
  87  | 
  88  |     // Dashboard
  89  |     await page.waitForURL('**/dashboard/pharmacist*');
  90  |     await page.waitForLoadState('networkidle');
  91  |     await page.screenshot({ path: 'pharmacist_dashboard.png', fullPage: true });
  92  |     console.log('Pharmacist registration completed successfully!');
  93  |   });
  94  | 
  95  |   test('Pharmacy Registration Flow', async ({ page }) => {
  96  |     const account = await getMailTmAccount();
  97  |     console.log(`Pharmacy Test Email: ${account.email}`);
  98  | 
> 99  |     await page.goto('/register/pharmacy');
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/register/pharmacy
  100 |     
  101 |     // Step 1: Manually Enter (Search logic removed)
  102 | 
  103 |     await page.fill('input[name="pharmacyName"]', 'Test Apotheke');
  104 |     await page.fill('input[name="email"]', account.email);
  105 |     await page.fill('input[name="password"]', account.password);
  106 |     await page.fill('input[name="confirmPassword"]', account.password);
  107 |     await page.fill('input[name="street"]', 'Apothekenweg');
  108 |     await page.fill('input[name="houseNumber"]', '1');
  109 |     await page.fill('input[name="postalCode"]', '10115');
  110 |     await page.fill('input[name="city"]', 'Berlin');
  111 | 
  112 |     // Make sure we get the Weiter button that's part of the manual fields (or the only Weiter button)
  113 |     const weiterButtons = await page.locator('button:has-text("Weiter")').all();
  114 |     await weiterButtons[weiterButtons.length - 1].click();
  115 | 
  116 |     // Step 2: Infrastructure
  117 |     await page.waitForSelector('text=Infrastruktur & Details');
  118 |     await page.fill('input[name="licenseNumber"]', '123456789');
  119 |     await page.click('button:has-text("Weiter")');
  120 | 
  121 |     // Step 3: Verify Document -> but here wait, is documentFile required?
  122 |     // Let's check page.tsx: `required={true}` for "Betriebserlaubnis (erforderlich)"
  123 |     // If it's required, we must create a dummy file and upload it!
  124 |     await page.waitForSelector('text=Verifizierung Dokument');
  125 | 
  126 |     // Create a dummy file in JS context or attach a file from disk
  127 |     // Since we are running in the playwright test context, we can just point to an existing file or create one.
  128 |     // I'll create a dummy.pdf on disk using run_command before the test, but wait, the test runs on the same machine!
  129 |     const fs = require('fs');
  130 |     fs.writeFileSync('dummy.pdf', 'dummy content');
  131 |     
  132 |     // The FileUpload component hides the actual file input, but we can set input[type="file"]
  133 |     await page.setInputFiles('input[type="file"]', 'dummy.pdf');
  134 | 
  135 |     await page.click('button:has-text("Registrierung abschließen")');
  136 | 
  137 |     // Step 4: Email Verification
  138 |     await page.waitForSelector('text=E-Mail Bestätigung');
  139 | 
  140 |     // Get code from Mail.tm
  141 |     console.log('Waiting for verification code...');
  142 |     const code = await getVerificationCode(account.token);
  143 |     console.log(`Received code: ${code}`);
  144 | 
  145 |     // Enter code
  146 |     await page.fill('input[placeholder="123456"]', code);
  147 |     await page.click('button:has-text("Verifizieren")');
  148 | 
  149 |     // Dashboard
  150 |     await page.waitForURL('**/dashboard/pharmacy*');
  151 |     await page.waitForLoadState('networkidle');
  152 |     await page.screenshot({ path: 'pharmacy_dashboard.png', fullPage: true });
  153 |     
  154 |     // Check PDL page (AMTS modal)
  155 |     await page.goto('/dashboard/pharmacy/pdl');
  156 |     await page.waitForLoadState('networkidle');
  157 |     await page.screenshot({ path: 'amts_modal.png', fullPage: true });
  158 | 
  159 |     console.log('Pharmacy registration completed successfully!');
  160 |   });
  161 | });
  162 | 
```