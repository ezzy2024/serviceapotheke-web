import { test, expect } from '@playwright/test';
import { Client } from 'pg';
import * as XLSX from 'xlsx';
import * as fs from 'fs';

test('Take AMTS screenshot', async ({ page }) => {
  test.setTimeout(90000);
  
  const client = new Client({
    host: 'localhost',
    port: 5433,
    database: 'serviceapotheke-db',
    user: 'appuser',
    password: 'ServiceApotheke2026Strong'
  });
  await client.connect();
  const res = await client.query('SELECT "Email" FROM "Pharmacies" WHERE "IsEmailConfirmed" = true ORDER BY "CreatedAt" DESC LIMIT 1');
  await client.end();

  if (res.rows.length === 0) throw new Error("No verified user found");
  const email = res.rows[0].Email;
  const password = 'TestPassword123!';

  await page.goto('https://serviceapotheke.tech/login');
  await page.click('button:has-text("Apotheke")');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button:has-text("Einloggen")');

  await page.waitForURL('**/dashboard/pharmacy*');
  await page.goto('https://serviceapotheke.tech/dashboard/pharmacy/pdl');
  await page.waitForLoadState('networkidle');
  
  // Unlock Vault
  await page.fill('input[type="password"]', 'TestPassword123!');
  await page.click('button:has-text("Entsperren")');
  await page.waitForLoadState('networkidle');

  // Generate a valid Excel file for upload
  const ws = XLSX.utils.json_to_sheet([
    { KdnNr: "123", Geburtsjahr: "1960", Medikament1: "Aspirin", Medikament2: "Ibuprofen", Medikament3: "Paracetamol", Medikament4: "Omeprazol", Medikament5: "Simvastatin" }
  ]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Patients");
  XLSX.writeFile(wb, "dummy_patients.xlsx");

  // Upload file
  await page.setInputFiles('input[type="file"]', 'dummy_patients.xlsx');
  
  // Wait for the upload to complete and the row to appear
  await page.waitForSelector('text=123');
  
  await page.click('button:has-text("AMTS-Analyse starten")');
  await page.waitForSelector('text=Bald verfügbar');

  await page.screenshot({ path: 'amts_modal.png', fullPage: true });
});
