import { test, expect } from '@playwright/test';
import axios from 'axios';

async function getMailTmAccount() {
  const domainRes = await axios.get('https://api.mail.tm/domains');
  const domain = domainRes.data['hydra:member'][0].domain;
  
  const randomString = Math.random().toString(36).substring(7);
  const email = `test_${randomString}@${domain}`;
  const password = 'TestPassword123!';

  await axios.post('https://api.mail.tm/accounts', { address: email, password });
  const tokenRes = await axios.post('https://api.mail.tm/token', { address: email, password });
  
  return { email, password, token: tokenRes.data.token };
}

async function getVerificationCode(token: string) {
  for (let i = 0; i < 20; i++) {
    const res = await axios.get('https://api.mail.tm/messages', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (res.data['hydra:member'].length > 0) {
      const msgId = res.data['hydra:member'][0].id;
      const msg = await axios.get(`https://api.mail.tm/messages/${msgId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const match = msg.data.text.match(/Dein Bestätigungscode lautet:\s*(\d{6})/);
      if (match) return match[1];
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  throw new Error('No email received');
}

test.describe('E2E Registration Flow', () => {
  test('Pharmacy Registration Flow', async ({ page }) => {
    test.setTimeout(120000);
    const account = await getMailTmAccount();
    console.log(`Pharmacy Test Email: ${account.email}`);

    await page.goto('http://localhost:3000/register/pharmacy');
    
    // Step 1: Manually Enter (Search logic removed)

    await page.fill('input[name="pharmacyName"]', 'Test Apotheke');
    await page.fill('input[name="email"]', account.email);
    await page.fill('input[name="password"]', account.password);
    await page.fill('input[name="confirmPassword"]', account.password);
    await page.fill('input[name="street"]', 'Apothekenweg');
    await page.fill('input[name="houseNumber"]', '1');
    await page.fill('input[name="postalCode"]', '10115');
    await page.fill('input[name="city"]', 'Berlin');

    const weiterButtons = await page.locator('button:has-text("Weiter")').all();
    await weiterButtons[weiterButtons.length - 1].click();

    await page.waitForSelector('text=Infrastruktur & Details');
    await page.fill('input[name="licenseNumber"]', '123456789');
    await page.click('button:has-text("Weiter")');

    await page.waitForSelector('text=Verifizierung Dokument');

    const fs = require('fs');
    fs.writeFileSync('dummy.pdf', 'dummy content');
    
    await page.setInputFiles('input[type="file"]', 'dummy.pdf');
    await page.click('button:has-text("Registrierung abschließen")');

    await page.waitForSelector('text=E-Mail Bestätigung');

    console.log('Waiting for verification code...');
    const code = await getVerificationCode(account.token);
    console.log(`Received code: ${code}`);

    await page.fill('input[placeholder="123456"]', code);
    await page.click('button:has-text("Verifizieren")');

    await page.waitForURL('**/dashboard/pharmacy*');
    await page.waitForLoadState('networkidle');
    
    // Check Inventar is gone and side bar is okay
    await page.screenshot({ path: 'pharmacy_dashboard_local.png', fullPage: true });
    
    // Check PDL page (AMTS modal)
    await page.goto('http://localhost:3000/dashboard/pharmacy/pdl');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'amts_modal_local.png', fullPage: true });

    console.log('Pharmacy registration completed successfully!');
  });
});
