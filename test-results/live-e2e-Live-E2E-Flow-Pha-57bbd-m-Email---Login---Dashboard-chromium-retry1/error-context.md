# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: live-e2e.spec.ts >> Live E2E Flow >> Pharmacist Registration -> Confirm Email -> Login -> Dashboard
- Location: tests\live-e2e.spec.ts:77:7

# Error details

```
Error: Console Error: [AuthContext] /Auth/me Ping Failed: undefined Network Error
```

```
Error: page.fill: Test ended.
Call log:
  - waiting for locator('input[name="phone"]')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - heading "Apotheker Registrierung" [level=2] [ref=e5]
      - paragraph [ref=e6]: Schritt 1 von 3
    - generic [ref=e8]:
      - heading "Persönliche Daten & Account" [level=3] [ref=e9]
      - generic [ref=e10]:
        - generic [ref=e11]:
          - generic [ref=e12]: Vorname
          - textbox [ref=e13]: E2E
        - generic [ref=e14]:
          - generic [ref=e15]: Nachname
          - textbox [ref=e16]: Tester
      - generic [ref=e17]:
        - generic [ref=e18]:
          - generic [ref=e19]: E-Mail Adresse
          - textbox [active] [ref=e20]: e2etest_1784113217817@web-library.net
        - generic [ref=e21]:
          - generic [ref=e22]:
            - generic [ref=e23]: Passwort
            - textbox [ref=e24]
          - generic [ref=e25]:
            - generic [ref=e26]: Passwort bestätigen
            - textbox [ref=e27]
        - generic [ref=e28]:
          - generic [ref=e29]:
            - generic [ref=e30]: Straße
            - textbox [ref=e31]
          - generic [ref=e32]:
            - generic [ref=e33]: Hausnummer
            - textbox [ref=e34]
        - generic [ref=e35]:
          - generic [ref=e36]:
            - generic [ref=e37]: PLZ
            - textbox [ref=e38]
          - generic [ref=e39]:
            - generic [ref=e40]: Stadt
            - textbox [ref=e41]
      - button "Weiter" [ref=e43]:
        - text: Weiter
        - img [ref=e44]
  - alert [ref=e46]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | // Helper function to create a mail.tm account and return credentials
  4   | async function createMailTmAccount(request: any) {
  5   |   // 1. Get a valid domain
  6   |   const domainRes = await request.get('https://api.mail.tm/domains');
  7   |   const domainData = await domainRes.json();
  8   |   const domain = domainData['hydra:member'][0].domain;
  9   | 
  10  |   // 2. Create an account
  11  |   const address = `e2etest_${Date.now()}@${domain}`;
  12  |   const password = 'Password123!';
  13  |   
  14  |   await request.post('https://api.mail.tm/accounts', {
  15  |     data: { address, password }
  16  |   });
  17  | 
  18  |   // 3. Get JWT token
  19  |   const tokenRes = await request.post('https://api.mail.tm/token', {
  20  |     data: { address, password }
  21  |   });
  22  |   const tokenData = await tokenRes.json();
  23  |   
  24  |   return { address, token: tokenData.token };
  25  | }
  26  | 
  27  | // Helper function to poll mail.tm for an OTP
  28  | async function getOtpFromMailTm(request: any, token: string, maxRetries = 15): Promise<string> {
  29  |   for (let i = 0; i < maxRetries; i++) {
  30  |     // Wait 5 seconds before polling
  31  |     await new Promise(resolve => setTimeout(resolve, 5000));
  32  |     
  33  |     const messagesRes = await request.get('https://api.mail.tm/messages', {
  34  |       headers: { Authorization: `Bearer ${token}` }
  35  |     });
  36  |     const messagesData = await messagesRes.json();
  37  |     const messages = messagesData['hydra:member'];
  38  |     
  39  |     if (messages && messages.length > 0) {
  40  |       // Pick the first message
  41  |       const msgId = messages[0].id;
  42  |       const msgRes = await request.get(`https://api.mail.tm/messages/${msgId}`, {
  43  |         headers: { Authorization: `Bearer ${token}` }
  44  |       });
  45  |       const msg = await msgRes.json();
  46  |       
  47  |       const body = msg.text || msg.html || '';
  48  |       const match = body.match(/\b\d{6}\b/);
  49  |       if (match) {
  50  |         return match[0];
  51  |       }
  52  |     }
  53  |   }
  54  |   throw new Error(`OTP not found after ${maxRetries} retries`);
  55  | }
  56  | 
  57  | test.describe('Live E2E Flow', () => {
  58  |   // Global handlers for strict testing
  59  |   test.beforeEach(async ({ page }) => {
  60  |     // 1. Fail test on unexpected native dialogs (alert, confirm, prompt)
  61  |     page.on('dialog', dialog => {
  62  |       throw new Error(`Unexpected native dialog fired: ${dialog.type()} with message: "${dialog.message()}"`);
  63  |     });
  64  | 
  65  |     // 2. Fail test on console errors
  66  |     page.on('console', msg => {
  67  |       if (msg.type() === 'error') {
  68  |         const text = msg.text();
  69  |         // Only ignore specific known benign static asset 404s
  70  |         if (text.includes('favicon.ico') && text.includes('404')) return;
  71  |         if (text.includes('manifest.json') && text.includes('404')) return;
  72  |         throw new Error(`Console Error: ${text}`);
  73  |       }
  74  |     });
  75  |   });
  76  | 
  77  |   test('Pharmacist Registration -> Confirm Email -> Login -> Dashboard', async ({ page, request }) => {
  78  |     test.setTimeout(120000); // 2 minutes for email polling
  79  | 
  80  |     // Generate mail.tm address
  81  |     const { address: testEmail, token } = await createMailTmAccount(request);
  82  |     const testPassword = 'Password123!';
  83  | 
  84  |     // 1. Registration
  85  |     await page.goto('/register/pharmacist');
  86  |     
  87  |     // Step 1: Personal Info
  88  |     await page.fill('input[name="firstName"]', 'E2E');
  89  |     await page.fill('input[name="lastName"]', 'Tester');
  90  |     await page.fill('input[name="email"]', testEmail);
> 91  |     await page.fill('input[name="phone"]', '01511234567');
      |                ^ Error: page.fill: Test ended.
  92  |     await page.fill('input[name="password"]', testPassword);
  93  |     await page.fill('input[name="confirmPassword"]', testPassword);
  94  |     await page.fill('input[name="street"]', 'Teststraße');
  95  |     await page.fill('input[name="houseNumber"]', '1');
  96  |     await page.fill('input[name="postalCode"]', '10115');
  97  |     await page.fill('input[name="city"]', 'Berlin');
  98  |     
  99  |     await page.click('button:has-text("Weiter")');
  100 | 
  101 |     // Step 2: Qualifications
  102 |     await expect(page.locator('h3:has-text("Qualifikationen")')).toBeVisible();
  103 |     await page.click('button:has-text("Weiter")');
  104 | 
  105 |     // Step 3: Documents
  106 |     await expect(page.locator('h3:has-text("Dokumente Upload")')).toBeVisible();
  107 |     await page.click('button:has-text("Registrierung abschließen")');
  108 | 
  109 |     // Step 4: OTP Confirmation
  110 |     await expect(page.locator('h3:has-text("E-Mail Best")')).toBeVisible();
  111 |     
  112 |     // Poll for the actual OTP
  113 |     const otp = await getOtpFromMailTm(request, token);
  114 | 
  115 |     await page.fill('input[placeholder="123456"]', otp);
  116 |     await page.click('button:has-text("Verifizieren")');
  117 | 
  118 |     // 2. Login
  119 |     await expect(page).toHaveURL(/\/login/);
  120 |     await page.fill('input[type="email"]', testEmail);
  121 |     await page.fill('input[type="password"]', testPassword);
  122 |     await page.click('button:has-text("Anmelden")');
  123 | 
  124 |     // 3. Dashboard
  125 |     await expect(page).toHaveURL(/\/dashboard/);
  126 |     await expect(page.locator('h1')).toContainText('Dashboard');
  127 |   });
  128 | 
  129 |   test('Pharmacy Registration -> Confirm Email -> Login -> Dashboard', async ({ page, request }) => {
  130 |     test.setTimeout(120000); // 2 minutes for email polling
  131 | 
  132 |     // Generate mail.tm address
  133 |     const { address: testEmail, token } = await createMailTmAccount(request);
  134 |     const testPassword = 'Password123!';
  135 | 
  136 |     // 1. Registration
  137 |     await page.goto('/register/pharmacy');
  138 |     
  139 |     // Step 1: Pharmacy Info
  140 |     await page.fill('input[name="pharmacyName"]', 'E2E Apotheke');
  141 |     await page.fill('input[name="ownerFirstName"]', 'E2E');
  142 |     await page.fill('input[name="ownerLastName"]', 'Owner');
  143 |     await page.fill('input[name="email"]', testEmail);
  144 |     await page.fill('input[name="phone"]', '01511234567');
  145 |     await page.fill('input[name="password"]', testPassword);
  146 |     await page.fill('input[name="confirmPassword"]', testPassword);
  147 |     await page.fill('input[name="street"]', 'Apothekenweg');
  148 |     await page.fill('input[name="houseNumber"]', '42');
  149 |     await page.fill('input[name="postalCode"]', '10115');
  150 |     await page.fill('input[name="city"]', 'Berlin');
  151 |     
  152 |     await page.click('button:has-text("Registrierung abschließen")');
  153 | 
  154 |     // Step 2: OTP Confirmation
  155 |     await expect(page.locator('h3:has-text("E-Mail Best")')).toBeVisible();
  156 |     
  157 |     // Poll for the actual OTP
  158 |     const otp = await getOtpFromMailTm(request, token);
  159 | 
  160 |     await page.fill('input[placeholder="123456"]', otp);
  161 |     await page.click('button:has-text("Verifizieren")');
  162 | 
  163 |     // 2. Login
  164 |     await expect(page).toHaveURL(/\/login/);
  165 |     await page.fill('input[type="email"]', testEmail);
  166 |     await page.fill('input[type="password"]', testPassword);
  167 |     await page.click('button:has-text("Anmelden")');
  168 | 
  169 |     // 3. Dashboard
  170 |     await expect(page).toHaveURL(/\/dashboard/);
  171 |     await expect(page.locator('h1')).toContainText('Dashboard');
  172 |   });
  173 | });
  174 | 
```