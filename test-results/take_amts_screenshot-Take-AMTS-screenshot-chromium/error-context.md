# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: take_amts_screenshot.spec.ts >> Take AMTS screenshot
- Location: tests\take_amts_screenshot.spec.ts:6:5

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: page.waitForSelector: Test timeout of 90000ms exceeded.
Call log:
  - waiting for locator('text=123') to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]
  - generic [ref=e3]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - generic [ref=e7]: S
        - heading "ServiceApotheke" [level=1] [ref=e8]
      - navigation [ref=e9]:
        - link "Übersicht" [ref=e10] [cursor=pointer]:
          - /url: /dashboard/pharmacy
          - img [ref=e11]
          - text: Übersicht
        - link "Vakanzen" [ref=e16] [cursor=pointer]:
          - /url: /dashboard/pharmacy/jobs
          - img [ref=e17]
          - text: Vakanzen
        - link "Dienstplan" [ref=e20] [cursor=pointer]:
          - /url: /dashboard/pharmacy/dienstplan
          - img [ref=e21]
          - text: Dienstplan
        - link "Rechnungen" [ref=e23] [cursor=pointer]:
          - /url: /dashboard/pharmacy/invoices
          - img [ref=e24]
          - text: Rechnungen
        - link "pDL Analyzer" [ref=e27] [cursor=pointer]:
          - /url: /dashboard/pharmacy/pdl
          - img [ref=e28]
          - text: pDL Analyzer
        - link "aTM Terminals" [ref=e31] [cursor=pointer]:
          - /url: /dashboard/pharmacy/atm
          - img [ref=e32]
          - text: aTM Terminals
        - link "Einstellungen" [ref=e39] [cursor=pointer]:
          - /url: /dashboard/pharmacy/settings
          - img [ref=e40]
          - text: Einstellungen
      - generic [ref=e44]:
        - generic [ref=e45]: T
        - generic [ref=e46]:
          - paragraph [ref=e47]: Pharmacy
          - paragraph [ref=e48]: test_4dh6yzt@example.com
    - generic [ref=e49]:
      - banner [ref=e50]:
        - heading "Apotheken Dashboard" [level=2] [ref=e52]
        - generic [ref=e53]:
          - button "Benachrichtigungen" [ref=e55]:
            - img [ref=e56]
          - button "Logout" [ref=e60]:
            - img [ref=e61]
            - text: Logout
      - main [ref=e64]:
        - generic [ref=e66]:
          - generic [ref=e67]:
            - generic [ref=e68]:
              - heading "Pharmazeutische Dienstleistungen (pDL)" [level=1] [ref=e69]
              - paragraph [ref=e70]: Automatische Identifikation und KI-gestützte Dokumentation von Polymedikationen (AMTS).
            - generic [ref=e71]:
              - generic [ref=e72]:
                - generic [ref=e73]: 100% DSGVO-Konform
                - generic [ref=e74]: Data processed locally, zero-knowledge.
              - generic [ref=e75]:
                - generic [ref=e76]: Client-Side E2EE
                - generic [ref=e77]: AES-256-GCM encrypted.
              - generic [ref=e78]:
                - generic [ref=e79]: ABDA-Standard pDL
                - generic [ref=e80]: Algorithms based on public guidelines.
          - generic [ref=e82] [cursor=pointer]:
            - img [ref=e84]
            - generic [ref=e87]:
              - paragraph [ref=e88]: Patientendaten hochladen (.xlsx, .csv)
              - paragraph [ref=e89]: Drag & Drop oder Klicken zum Auswählen. Daten werden direkt im Arbeitsspeicher verarbeitet.
          - generic [ref=e90]:
            - heading "Patienten-Matrix" [level=2] [ref=e92]:
              - img [ref=e93]
              - text: Patienten-Matrix
            - generic [ref=e96]: Keine Patientendaten vorhanden. Bitte laden Sie eine Datei hoch.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { Client } from 'pg';
  3  | import * as XLSX from 'xlsx';
  4  | import * as fs from 'fs';
  5  | 
  6  | test('Take AMTS screenshot', async ({ page }) => {
  7  |   test.setTimeout(90000);
  8  |   
  9  |   const client = new Client({
  10 |     host: 'localhost',
  11 |     port: 5433,
  12 |     database: 'serviceapotheke-db',
  13 |     user: 'appuser',
  14 |     password: 'ServiceApotheke2026Strong'
  15 |   });
  16 |   await client.connect();
  17 |   const res = await client.query('SELECT "Email" FROM "Pharmacies" WHERE "IsEmailConfirmed" = true ORDER BY "CreatedAt" DESC LIMIT 1');
  18 |   await client.end();
  19 | 
  20 |   if (res.rows.length === 0) throw new Error("No verified user found");
  21 |   const email = res.rows[0].Email;
  22 |   const password = 'TestPassword123!';
  23 | 
  24 |   await page.goto('https://serviceapotheke.tech/login');
  25 |   await page.click('button:has-text("Apotheke")');
  26 |   await page.fill('input[name="email"]', email);
  27 |   await page.fill('input[name="password"]', password);
  28 |   await page.click('button:has-text("Einloggen")');
  29 | 
  30 |   await page.waitForURL('**/dashboard/pharmacy*');
  31 |   await page.goto('https://serviceapotheke.tech/dashboard/pharmacy/pdl');
  32 |   await page.waitForLoadState('networkidle');
  33 |   
  34 |   // Unlock Vault
  35 |   await page.fill('input[type="password"]', 'TestPassword123!');
  36 |   await page.click('button:has-text("Entsperren")');
  37 |   await page.waitForLoadState('networkidle');
  38 | 
  39 |   // Generate a valid Excel file for upload
  40 |   const ws = XLSX.utils.json_to_sheet([
  41 |     { KdnNr: "123", Geburtsjahr: "1960", Medikament1: "Aspirin", Medikament2: "Ibuprofen", Medikament3: "Paracetamol", Medikament4: "Omeprazol", Medikament5: "Simvastatin" }
  42 |   ]);
  43 |   const wb = XLSX.utils.book_new();
  44 |   XLSX.utils.book_append_sheet(wb, ws, "Patients");
  45 |   XLSX.writeFile(wb, "dummy_patients.xlsx");
  46 | 
  47 |   // Upload file
  48 |   await page.setInputFiles('input[type="file"]', 'dummy_patients.xlsx');
  49 |   
  50 |   // Wait for the upload to complete and the row to appear
> 51 |   await page.waitForSelector('text=123');
     |              ^ Error: page.waitForSelector: Test timeout of 90000ms exceeded.
  52 |   
  53 |   await page.click('button:has-text("AMTS-Analyse starten")');
  54 |   await page.waitForSelector('text=Bald verfügbar');
  55 | 
  56 |   await page.screenshot({ path: 'amts_modal.png', fullPage: true });
  57 | });
  58 | 
```