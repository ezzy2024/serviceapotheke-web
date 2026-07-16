import { test, expect } from '@playwright/test';

async function getMailTmAccount() {
  const response = await fetch('https://api.mail.tm/domains');
  const domains = await response.json();
  const domain = domains['hydra:member'][0].domain;
  const email = `test_${Date.now()}@${domain}`;
  const password = 'TestPassword123!';

  await fetch('https://api.mail.tm/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: email, password })
  });

  const tokenResponse = await fetch('https://api.mail.tm/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: email, password })
  });
  const { token } = await tokenResponse.json();

  return { email, password, token };
}

async function getVerificationCode(token: string) {
  for (let i = 0; i < 30; i++) {
    const msgRes = await fetch('https://api.mail.tm/messages', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const msgs = await msgRes.json();
    if (msgs['hydra:member'] && msgs['hydra:member'].length > 0) {
      const msgId = msgs['hydra:member'][0].id;
      const msgDetail = await fetch(`https://api.mail.tm/messages/${msgId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const msgData = await msgDetail.json();
      const match = msgData.text.match(/\b\d{6}\b/);
      if (match) return match[0];
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error('Verification code not received');
}

test.describe('Production Registration E2E', () => {
  test.setTimeout(120000); // 2 minutes

  test('Pharmacist Registration Flow', async ({ page }) => {
    const account = await getMailTmAccount();
    console.log(`Pharmacist Test Email: ${account.email}`);

    await page.goto('https://serviceapotheke.tech/register/pharmacist');
    
    // Step 1: Personal Data
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'Pharmacist');
    await page.fill('input[name="email"]', account.email);
    await page.fill('input[name="password"]', account.password);
    await page.fill('input[name="confirmPassword"]', account.password);
    await page.fill('input[name="street"]', 'Teststraße');
    await page.fill('input[name="houseNumber"]', '1');
    await page.fill('input[name="postalCode"]', '10115');
    await page.fill('input[name="city"]', 'Berlin');
    
    await page.click('button:has-text("Weiter")');

    // Step 2: Qualifications
    await page.waitForSelector('text=Qualifikationen & Kenntnisse');
    await page.click('button:has-text("Weiter")');

    // Step 3: Document Upload (Optional) -> Submit
    await page.waitForSelector('text=Dokumente Upload');
    await page.click('button:has-text("Registrierung abschließen")');

    // Step 4: Email Verification
    await page.waitForSelector('text=E-Mail Bestätigung');

    // Get code from Mail.tm
    console.log('Waiting for verification code...');
    const code = await getVerificationCode(account.token);
    console.log(`Received code: ${code}`);

    // Enter code
    await page.fill('input[placeholder="123456"]', code);
    await page.click('button:has-text("Verifizieren")');

    // Dashboard
    await page.waitForURL('**/dashboard/pharmacist*');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'pharmacist_dashboard.png', fullPage: true });
    console.log('Pharmacist registration completed successfully!');
  });

  test('Pharmacy Registration Flow', async ({ page }) => {
    const account = await getMailTmAccount();
    console.log(`Pharmacy Test Email: ${account.email}`);

    await page.goto('https://serviceapotheke.tech/register/pharmacy');
    
    // Step 1: Search and Manually Enter
    await page.fill('input[placeholder*="Suchen Sie Ihre Apotheke"]', 'Not Real Apotheke 99');
    await page.waitForSelector('text=Keine Apotheke gefunden?');
    await page.click('button:has-text("Manuell eintragen")');

    await page.fill('input[name="pharmacyName"]', 'Test Apotheke');
    await page.fill('input[name="email"]', account.email);
    await page.fill('input[name="password"]', account.password);
    await page.fill('input[name="confirmPassword"]', account.password);
    await page.fill('input[name="street"]', 'Apothekenweg');
    await page.fill('input[name="houseNumber"]', '1');
    await page.fill('input[name="postalCode"]', '10115');
    await page.fill('input[name="city"]', 'Berlin');

    // Make sure we get the Weiter button that's part of the manual fields (or the only Weiter button)
    const weiterButtons = await page.locator('button:has-text("Weiter")').all();
    await weiterButtons[weiterButtons.length - 1].click();

    // Step 2: Infrastructure
    await page.waitForSelector('text=Infrastruktur & Details');
    await page.fill('input[name="licenseNumber"]', '123456789');
    await page.click('button:has-text("Weiter")');

    // Step 3: Verify Document -> but here wait, is documentFile required?
    // Let's check page.tsx: `required={true}` for "Betriebserlaubnis (erforderlich)"
    // If it's required, we must create a dummy file and upload it!
    await page.waitForSelector('text=Verifizierung Dokument');

    // Create a dummy file in JS context or attach a file from disk
    // Since we are running in the playwright test context, we can just point to an existing file or create one.
    // I'll create a dummy.pdf on disk using run_command before the test, but wait, the test runs on the same machine!
    const fs = require('fs');
    fs.writeFileSync('dummy.pdf', 'dummy content');
    
    // The FileUpload component hides the actual file input, but we can set input[type="file"]
    await page.setInputFiles('input[type="file"]', 'dummy.pdf');

    await page.click('button:has-text("Registrierung abschließen")');

    // Step 4: Email Verification
    await page.waitForSelector('text=E-Mail Bestätigung');

    // Get code from Mail.tm
    console.log('Waiting for verification code...');
    const code = await getVerificationCode(account.token);
    console.log(`Received code: ${code}`);

    // Enter code
    await page.fill('input[placeholder="123456"]', code);
    await page.click('button:has-text("Verifizieren")');

    // Dashboard
    await page.waitForURL('**/dashboard/pharmacy*');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'pharmacy_dashboard.png', fullPage: true });
    
    // Check PDL page (AMTS modal)
    await page.goto('https://serviceapotheke.tech/dashboard/pharmacy/pdl');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'amts_modal.png', fullPage: true });

    console.log('Pharmacy registration completed successfully!');
  });
});
