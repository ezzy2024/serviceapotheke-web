# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: live-e2e.spec.ts >> Live E2E Flow >> Pharmacy Registration -> Confirm Email -> Login -> Dashboard
- Location: tests\live-e2e.spec.ts:129:7

# Error details

```
Error: Console Error: [AuthContext] /Auth/me Ping Failed: undefined Network Error
```

```
Error: page.fill: Test ended.
Call log:
  - waiting for locator('input[name="ownerFirstName"]')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - heading "Apotheken Registrierung" [level=2] [ref=e5]
      - paragraph [ref=e6]: Schritt 1 von 3
    - generic [ref=e8]:
      - heading "Apotheken Daten & Account" [level=3] [ref=e9]
      - generic [ref=e10]:
        - generic [ref=e11]: Apotheken-Register durchsuchen
        - textbox "Suchen Sie Ihre Apotheke nach Name oder PLZ..." [ref=e12]
      - generic [ref=e13]:
        - generic [ref=e14]:
          - generic [ref=e15]: Name der Apotheke
          - textbox [active] [ref=e16]: E2E Apotheke
        - generic [ref=e17]:
          - generic [ref=e18]: E-Mail Adresse
          - textbox [ref=e19]
        - generic [ref=e20]:
          - generic [ref=e21]:
            - generic [ref=e22]: Passwort
            - textbox [ref=e23]
          - generic [ref=e24]:
            - generic [ref=e25]: Passwort besttigen
            - textbox [ref=e26]
        - generic [ref=e27]:
          - generic [ref=e28]:
            - generic [ref=e29]: Strae
            - textbox [ref=e30]
          - generic [ref=e31]:
            - generic [ref=e32]: Hausnummer
            - textbox [ref=e33]
        - generic [ref=e34]:
          - generic [ref=e35]:
            - generic [ref=e36]: PLZ
            - textbox [ref=e37]
          - generic [ref=e38]:
            - generic [ref=e39]: Stadt
            - textbox [ref=e40]
      - button "Weiter" [ref=e42]:
        - text: Weiter
        - img [ref=e43]
  - alert [ref=e45]
```

# Test source

```ts
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
  69  |         // Only ignore specific known benign static asset 404s and expected auth ping failures
  70  |         if (text.includes('favicon.ico') && text.includes('404')) return;
  71  |         if (text.includes('manifest.json') && text.includes('404')) return;
  72  |         if (text.includes('/Auth/me') || text.includes('AuthContext')) return;
  73  |         throw new Error(`Console Error: ${text}`);
  74  |       }
  75  |     });
  76  |   });
  77  | 
  78  |   test('Pharmacist Registration -> Confirm Email -> Login -> Dashboard', async ({ page, request }) => {
  79  |     test.setTimeout(120000); // 2 minutes for email polling
  80  | 
  81  |     // Generate mail.tm address
  82  |     const { address: testEmail, token } = await createMailTmAccount(request);
  83  |     const testPassword = 'Password123!';
  84  | 
  85  |     // 1. Registration
  86  |     await page.goto('/register/pharmacist');
  87  |     
  88  |     // Step 1: Personal Info
  89  |     await page.fill('input[name="firstName"]', 'E2E');
  90  |     await page.fill('input[name="lastName"]', 'Tester');
  91  |     await page.fill('input[name="email"]', testEmail);
  92  |     await page.fill('input[name="phone"]', '01511234567');
  93  |     await page.fill('input[name="password"]', testPassword);
  94  |     await page.fill('input[name="confirmPassword"]', testPassword);
  95  |     await page.fill('input[name="street"]', 'Teststraße');
  96  |     await page.fill('input[name="houseNumber"]', '1');
  97  |     await page.fill('input[name="postalCode"]', '10115');
  98  |     await page.fill('input[name="city"]', 'Berlin');
  99  |     
  100 |     await page.click('button:has-text("Weiter")');
  101 | 
  102 |     // Step 2: Qualifications
  103 |     await expect(page.locator('h3:has-text("Qualifikationen")')).toBeVisible();
  104 |     await page.click('button:has-text("Weiter")');
  105 | 
  106 |     // Step 3: Documents
  107 |     await expect(page.locator('h3:has-text("Dokumente Upload")')).toBeVisible();
  108 |     await page.click('button:has-text("Registrierung abschließen")');
  109 | 
  110 |     // Step 4: OTP Confirmation
  111 |     await expect(page.locator('h3:has-text("E-Mail Best")')).toBeVisible();
  112 |     
  113 |     // Poll for the actual OTP
  114 |     const otp = await getOtpFromMailTm(request, token);
  115 | 
  116 |     await page.fill('input[placeholder="123456"]', otp);
  117 |     await page.click('button:has-text("Verifizieren")');
  118 | 
  119 |     // 2. Login
  120 |     await expect(page).toHaveURL(/\/login/);
  121 |     await page.fill('input[type="email"]', testEmail);
  122 |     await page.fill('input[type="password"]', testPassword);
  123 |     await page.click('button:has-text("Anmelden")');
  124 | 
  125 |     // 3. Dashboard
  126 |     await expect(page).toHaveURL(/\/dashboard/);
  127 |     await expect(page.locator('h1')).toContainText('Dashboard');
  128 |   });
  129 | 
  130 |   test('Pharmacy Registration -> Confirm Email -> Login -> Dashboard', async ({ page, request }) => {
  131 |     test.setTimeout(120000); // 2 minutes for email polling
  132 | 
  133 |     // Generate mail.tm address
  134 |     const { address: testEmail, token } = await createMailTmAccount(request);
  135 |     const testPassword = 'Password123!';
  136 | 
  137 |     // 1. Registration
  138 |     await page.goto('/register/pharmacy');
  139 |     
  140 |     // Step 1: Pharmacy Info
> 141 |     await page.fill('input[name="pharmacyName"]', 'E2E Apotheke');
      |                ^ Error: page.fill: Test ended.
  142 |     await page.fill('input[name="ownerFirstName"]', 'E2E');
  143 |     await page.fill('input[name="ownerLastName"]', 'Owner');
  144 |     await page.fill('input[name="email"]', testEmail);
  145 |     await page.fill('input[name="phone"]', '01511234567');
  146 |     await page.fill('input[name="password"]', testPassword);
  147 |     await page.fill('input[name="confirmPassword"]', testPassword);
  148 |     await page.fill('input[name="street"]', 'Apothekenweg');
  149 |     await page.fill('input[name="houseNumber"]', '42');
  150 |     await page.fill('input[name="postalCode"]', '10115');
  151 |     await page.fill('input[name="city"]', 'Berlin');
  152 |     
  153 |     await page.click('button:has-text("Registrierung abschließen")');
  154 | 
  155 |     // Step 2: OTP Confirmation
  156 |     await expect(page.locator('h3:has-text("E-Mail Best")')).toBeVisible();
  157 |     
  158 |     // Poll for the actual OTP
  159 |     const otp = await getOtpFromMailTm(request, token);
  160 | 
  161 |     await page.fill('input[placeholder="123456"]', otp);
  162 |     await page.click('button:has-text("Verifizieren")');
  163 | 
  164 |     // 2. Login
  165 |     await expect(page).toHaveURL(/\/login/);
  166 |     await page.fill('input[type="email"]', testEmail);
  167 |     await page.fill('input[type="password"]', testPassword);
  168 |     await page.click('button:has-text("Anmelden")');
  169 | 
  170 |     // 3. Dashboard
  171 |     await expect(page).toHaveURL(/\/dashboard/);
  172 |     await expect(page.locator('h1')).toContainText('Dashboard');
  173 |   });
  174 | });
  175 | 
```