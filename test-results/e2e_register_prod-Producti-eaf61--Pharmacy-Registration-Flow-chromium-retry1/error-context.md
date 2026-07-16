# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e_register_prod.spec.ts >> Production Registration E2E >> Pharmacy Registration Flow
- Location: tests\e2e_register_prod.spec.ts:102:7

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: page.fill: Test timeout of 120000ms exceeded.
Call log:
  - waiting for locator('input[type="email"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - heading "Apotheken Registrierung" [level=2] [ref=e5]
      - paragraph [ref=e6]: Schritt 1 von 3
    - generic [ref=e8]:
      - heading "Apotheken Daten & Account" [level=3] [ref=e9]
      - generic [ref=e10]:
        - generic [ref=e11]: Apotheken-Register durchsuchen
        - textbox "Suchen Sie Ihre Apotheke nach Name oder PLZ..." [ref=e12]
  - alert [ref=e13]
```

# Test source

```ts
  9   | 
  10  |   await fetch('https://api.mail.tm/accounts', {
  11  |     method: 'POST',
  12  |     headers: { 'Content-Type': 'application/json' },
  13  |     body: JSON.stringify({ address: email, password })
  14  |   });
  15  | 
  16  |   const tokenResponse = await fetch('https://api.mail.tm/token', {
  17  |     method: 'POST',
  18  |     headers: { 'Content-Type': 'application/json' },
  19  |     body: JSON.stringify({ address: email, password })
  20  |   });
  21  |   const { token } = await tokenResponse.json();
  22  | 
  23  |   return { email, password, token };
  24  | }
  25  | 
  26  | async function getVerificationCode(token: string) {
  27  |   for (let i = 0; i < 30; i++) {
  28  |     const msgRes = await fetch('https://api.mail.tm/messages', {
  29  |       headers: { Authorization: `Bearer ${token}` }
  30  |     });
  31  |     const msgs = await msgRes.json();
  32  |     if (msgs['hydra:member'] && msgs['hydra:member'].length > 0) {
  33  |       const msgId = msgs['hydra:member'][0].id;
  34  |       const msgDetail = await fetch(`https://api.mail.tm/messages/${msgId}`, {
  35  |         headers: { Authorization: `Bearer ${token}` }
  36  |       });
  37  |       const msgData = await msgDetail.json();
  38  |       const match = msgData.text.match(/\b\d{6}\b/);
  39  |       if (match) return match[0];
  40  |     }
  41  |     await new Promise(r => setTimeout(r, 2000));
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
  53  |     await page.goto('https://serviceapotheke.tech/register/pharmacist');
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
  99  |     await page.goto('https://serviceapotheke.tech/register/pharmacy');
  100 |     
  101 |     // Step 1: Search and Manually Enter
  102 |     await page.fill('input[placeholder*="Suchen Sie Ihre Apotheke"]', 'Not Real Apotheke 99');
  103 |     await page.waitForSelector('text=Keine Apotheke gefunden?');
  104 |     await page.click('button:has-text("Manuell eintragen")');
  105 | 
  106 |     await page.fill('input[name="pharmacyName"]', 'Test Apotheke');
  107 |     await page.fill('input[name="email"]', account.email);
  108 |     await page.fill('input[name="password"]', account.password);
> 109 |     await page.fill('input[name="confirmPassword"]', account.password);
      |                ^ Error: page.fill: Test timeout of 120000ms exceeded.
  110 |     await page.fill('input[name="street"]', 'Apothekenweg');
  111 |     await page.fill('input[name="houseNumber"]', '1');
  112 |     await page.fill('input[name="postalCode"]', '10115');
  113 |     await page.fill('input[name="city"]', 'Berlin');
  114 | 
  115 |     // Make sure we get the Weiter button that's part of the manual fields (or the only Weiter button)
  116 |     const weiterButtons = await page.locator('button:has-text("Weiter")').all();
  117 |     await weiterButtons[weiterButtons.length - 1].click();
  118 | 
  119 |     // Step 2: Infrastructure
  120 |     await page.waitForSelector('text=Infrastruktur & Details');
  121 |     await page.fill('input[name="licenseNumber"]', '123456789');
  122 |     await page.click('button:has-text("Weiter")');
  123 | 
  124 |     // Step 3: Verify Document -> but here wait, is documentFile required?
  125 |     // Let's check page.tsx: `required={true}` for "Betriebserlaubnis (erforderlich)"
  126 |     // If it's required, we must create a dummy file and upload it!
  127 |     await page.waitForSelector('text=Verifizierung Dokument');
  128 | 
  129 |     // Create a dummy file in JS context or attach a file from disk
  130 |     // Since we are running in the playwright test context, we can just point to an existing file or create one.
  131 |     // I'll create a dummy.pdf on disk using run_command before the test, but wait, the test runs on the same machine!
  132 |     const fs = require('fs');
  133 |     fs.writeFileSync('dummy.pdf', 'dummy content');
  134 |     
  135 |     // The FileUpload component hides the actual file input, but we can set input[type="file"]
  136 |     await page.setInputFiles('input[type="file"]', 'dummy.pdf');
  137 | 
  138 |     await page.click('button:has-text("Registrierung abschließen")');
  139 | 
  140 |     // Step 4: Email Verification
  141 |     await page.waitForSelector('text=E-Mail Bestätigung');
  142 | 
  143 |     // Get code from Mail.tm
  144 |     console.log('Waiting for verification code...');
  145 |     const code = await getVerificationCode(account.token);
  146 |     console.log(`Received code: ${code}`);
  147 | 
  148 |     // Enter code
  149 |     await page.fill('input[placeholder="123456"]', code);
  150 |     await page.click('button:has-text("Verifizieren")');
  151 | 
  152 |     // Dashboard
  153 |     await page.waitForURL('**/dashboard/pharmacy*');
  154 |     await page.waitForLoadState('networkidle');
  155 |     await page.screenshot({ path: 'pharmacy_dashboard.png', fullPage: true });
  156 |     console.log('Pharmacy registration completed successfully!');
  157 |   });
  158 | });
  159 | 
```