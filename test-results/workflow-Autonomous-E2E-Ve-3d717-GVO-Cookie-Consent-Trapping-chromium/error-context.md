# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workflow.spec.ts >> Autonomous E2E Verification Pipeline >> Security & DSGVO: Cookie Consent Trapping
- Location: tests\workflow.spec.ts:20:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=Cookie').locator('button:has-text("Akzeptieren")')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - generic [ref=e6]: S
          - generic [ref=e7]: ServiceApotheke
        - navigation [ref=e8]:
          - link "Lösungen" [ref=e9] [cursor=pointer]:
            - /url: "#loesungen"
          - link "Vorteile" [ref=e10] [cursor=pointer]:
            - /url: /fuer-apotheken
          - link "Über uns" [ref=e11] [cursor=pointer]:
            - /url: /ueber-uns
        - generic [ref=e12]:
          - link "Login" [ref=e13] [cursor=pointer]:
            - /url: /login
          - link "Jetzt starten" [ref=e14] [cursor=pointer]:
            - /url: /onboarding
    - main [ref=e15]:
      - generic [ref=e17]:
        - generic [ref=e18]:
          - heading "Apotheken-Management, neu gedacht." [level=1] [ref=e19]:
            - text: Apotheken-Management,
            - text: neu gedacht.
          - paragraph [ref=e20]: Automatisieren Sie Vertretungsdienste, pDL-Abrechnungen und Dokumentenmanagement mit unserer nahtlosen Zero-Instruction Plattform.
          - generic [ref=e21]:
            - link "Kostenlos registrieren" [ref=e22] [cursor=pointer]:
              - /url: /onboarding
              - text: Kostenlos registrieren
              - img [ref=e23]
            - link "Mehr erfahren" [ref=e25] [cursor=pointer]:
              - /url: "#loesungen"
        - img "Apothekerin nutzt digitales Tablet" [ref=e27]
      - generic [ref=e30]:
        - generic [ref=e31]:
          - img [ref=e33]
          - heading "Rechtssichere Prozesse" [level=3] [ref=e35]
          - paragraph [ref=e36]: Integrierte AÜG-Prüfung und DSGVO-konformes Dokumentenmanagement für Freelancer und Apotheken.
        - generic [ref=e37]:
          - img [ref=e39]
          - heading "Smarte Vermittlung" [level=3] [ref=e41]
          - paragraph [ref=e42]: Automatisches Matching von Notdiensten und Vertretungen basierend auf WWS-Expertise und Distanz.
        - generic [ref=e43]:
          - img [ref=e45]
          - heading "pDL Automatisierung" [level=3] [ref=e47]
          - paragraph [ref=e48]: Einfacher Upload und intelligente Extraktion von pharmazentrischen Dienstleistungen (MiniExcel).
    - contentinfo [ref=e49]:
      - generic [ref=e50]:
        - generic [ref=e51]:
          - generic [ref=e52]:
            - generic [ref=e53]: S
            - generic [ref=e54]: ServiceApotheke
          - paragraph [ref=e55]: Wir digitalisieren die Apotheken-Infrastruktur. Sicher, effizient und zukunftsweisend.
        - generic [ref=e56]:
          - heading "Unternehmen" [level=4] [ref=e57]
          - list [ref=e58]:
            - listitem [ref=e59]:
              - link "Über uns" [ref=e60] [cursor=pointer]:
                - /url: /ueber-uns
            - listitem [ref=e61]:
              - link "Kontakt" [ref=e62] [cursor=pointer]:
                - /url: /kontakt
        - generic [ref=e63]:
          - heading "Rechtliches" [level=4] [ref=e64]
          - list [ref=e65]:
            - listitem [ref=e66]:
              - link "Impressum" [ref=e67] [cursor=pointer]:
                - /url: /impressum
            - listitem [ref=e68]:
              - link "Datenschutz" [ref=e69] [cursor=pointer]:
                - /url: /datenschutz
            - listitem [ref=e70]:
              - link "AGB" [ref=e71] [cursor=pointer]:
                - /url: /agb
      - paragraph [ref=e73]: © 2026 ServiceApotheke GmbH. Alle Rechte vorbehalten.
    - generic [ref=e78]:
      - generic [ref=e79]:
        - paragraph [ref=e80]: Ihre Privatsphäre ist uns wichtig
        - paragraph [ref=e81]:
          - text: Wir verwenden Cookies, um Ihnen ein optimales Webseiten-Erlebnis zu bieten. Dazu zählen Cookies, die für den Betrieb der Seite und für die Steuerung unserer kommerziellen Unternehmensziele notwendig sind, sowie solche, die lediglich zu anonymen Statistikzwecken genutzt werden. Weitere Informationen finden Sie in unserer
          - link "Datenschutzerklärung" [ref=e82] [cursor=pointer]:
            - /url: /datenschutz
          - text: .
      - generic [ref=e83]:
        - button "Nur notwendige" [ref=e84]
        - button "Akzeptieren" [ref=e85]
  - button "Open Next.js Dev Tools" [ref=e91] [cursor=pointer]:
    - img [ref=e92]
  - alert [ref=e95]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Autonomous E2E Verification Pipeline', () => {
  4  |   const TARGET_URL = process.env.BASE_URL || 'http://localhost:3000';
  5  | 
  6  |   test('UI Hydration and Asset Rendering', async ({ page }) => {
  7  |     await page.goto(TARGET_URL);
  8  |     // Verify Next.js hydration completes without fatal errors
  9  |     const rootElement = page.locator('#__next, main');
  10 |     await expect(rootElement).toBeVisible();
  11 |     
  12 |     // Verify Tailwind CSS application (check computed styles of a primary button)
  13 |     const primaryButton = page.locator('button').first();
  14 |     if (await primaryButton.isVisible()) {
  15 |       const display = await primaryButton.evaluate((el) => window.getComputedStyle(el).display);
  16 |       expect(display).not.toBe('none');
  17 |     }
  18 |   });
  19 | 
  20 |   test('Security & DSGVO: Cookie Consent Trapping', async ({ page }) => {
  21 |     await page.goto(TARGET_URL);
  22 |     const consentBanner = page.locator('text=Cookie'); // Adjust selector based on actual text/ID
  23 |     
  24 |     // Banner must trap user on first visit
  25 |     if (await consentBanner.isVisible()) {
> 26 |       await consentBanner.locator('button:has-text("Akzeptieren")').click();
     |                                                                     ^ Error: locator.click: Test timeout of 30000ms exceeded.
  27 |       await expect(consentBanner).toBeHidden();
  28 |       
  29 |       // Verify local storage persistence
  30 |       const storageState = await page.evaluate(() => localStorage.getItem('cookie-consent'));
  31 |       expect(storageState).toBeTruthy();
  32 |     }
  33 |   });
  34 | 
  35 |   test('Backend Integration: Registration Payload Transmission', async ({ page, request }) => {
  36 |     // API boundary test bypassing UI to verify backend database connection
  37 |     const apiUrl = `https://serviceapotheke-api-830781040278.europe-west1.run.app/api/Pharmacy/register`;
  38 |     
  39 |     // Convert FormData to standard multi-part payload for Playwright request
  40 |     const response = await request.post(apiUrl, {
  41 |       multipart: {
  42 |         Email: `playwright-test-${Date.now()}@serviceapotheke.tech`,
  43 |         Password: 'TestPass123!',
  44 |         PharmacyName: 'E2E Test Apotheke',
  45 |         ZipCode: '47798',
  46 |         City: 'Krefeld',
  47 |         Street: 'Teststraße 1',
  48 |         WwsType: 'CGM Lauer',
  49 |         LicenseDocument: {
  50 |           name: 'dummy.pdf',
  51 |           mimeType: 'application/pdf',
  52 |           buffer: Buffer.from('mock pdf content')
  53 |         }
  54 |       }
  55 |     });
  56 | 
  57 |     // 415 or 503 indicates infrastructure collapse. 400 indicates validation failure.
  58 |     // Accept 200 (Success) or 400 (Already registered).
  59 |     const status = response.status();
  60 |     expect([200, 400, 409]).toContain(status);
  61 |     
  62 |     if (status === 200) {
  63 |       const setCookie = response.headers()['set-cookie'];
  64 |       expect(setCookie).toContain('sa_auth_v2');
  65 |     }
  66 |   });
  67 | 
  68 |   test('Visual Topology Audit', async ({ page }) => {
  69 |     await page.goto(TARGET_URL);
  70 |     await page.waitForLoadState('networkidle');
  71 |     await expect(page).toHaveScreenshot('landing-page-baseline.png', { maxDiffPixels: 100, fullPage: true });
  72 |   });
  73 | });
  74 | 
```