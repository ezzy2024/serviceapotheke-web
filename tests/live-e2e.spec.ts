import { test, expect } from '@playwright/test';

// Helper function to create a mail.tm account and return credentials
async function createMailTmAccount(request: any) {
  // 1. Get a valid domain
  const domainRes = await request.get('https://api.mail.tm/domains');
  const domainData = await domainRes.json();
  const domain = domainData['hydra:member'][0].domain;

  // 2. Create an account
  const address = `e2etest_${Date.now()}@${domain}`;
  const password = 'Password123!';
  
  await request.post('https://api.mail.tm/accounts', {
    data: { address, password }
  });

  // 3. Get JWT token
  const tokenRes = await request.post('https://api.mail.tm/token', {
    data: { address, password }
  });
  const tokenData = await tokenRes.json();
  
  return { address, token: tokenData.token };
}

// Helper function to poll mail.tm for an OTP
async function getOtpFromMailTm(request: any, token: string, maxRetries = 15): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    // Wait 5 seconds before polling
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const messagesRes = await request.get('https://api.mail.tm/messages', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const messagesData = await messagesRes.json();
    const messages = messagesData['hydra:member'];
    
    if (messages && messages.length > 0) {
      // Pick the first message
      const msgId = messages[0].id;
      const msgRes = await request.get(`https://api.mail.tm/messages/${msgId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const msg = await msgRes.json();
      
      const body = msg.text || msg.html || '';
      const match = body.match(/\b\d{6}\b/);
      if (match) {
        return match[0];
      }
    }
  }
  throw new Error(`OTP not found after ${maxRetries} retries`);
}

test.describe('Live E2E Flow', () => {
  // Global handlers for strict testing
  test.beforeEach(async ({ page }) => {
    // 1. Fail test on unexpected native dialogs (alert, confirm, prompt)
    page.on('dialog', dialog => {
      throw new Error(`Unexpected native dialog fired: ${dialog.type()} with message: "${dialog.message()}"`);
    });

    // 2. Fail test on console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        throw new Error(`Console Error: ${msg.text()}`);
      }
    });
  });

  test('Pharmacist Registration -> Confirm Email -> Login -> Dashboard', async ({ page, request }) => {
    test.setTimeout(120000); // 2 minutes for email polling

    // Generate mail.tm address
    const { address: testEmail, token } = await createMailTmAccount(request);
    const testPassword = 'Password123!';

    // 1. Registration
    await page.goto('/register/pharmacist');
    
    // Step 1: Personal Info
    await page.fill('input[name="firstName"]', 'E2E');
    await page.fill('input[name="lastName"]', 'Tester');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="phone"]', '01511234567');
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.fill('input[name="street"]', 'Teststraße');
    await page.fill('input[name="houseNumber"]', '1');
    await page.fill('input[name="postalCode"]', '10115');
    await page.fill('input[name="city"]', 'Berlin');
    
    await page.click('button:has-text("Weiter")');

    // Step 2: Qualifications
    await expect(page.locator('h3:has-text("Qualifikationen")')).toBeVisible();
    await page.click('button:has-text("Weiter")');

    // Step 3: Documents
    await expect(page.locator('h3:has-text("Dokumente Upload")')).toBeVisible();
    await page.click('button:has-text("Registrierung abschließen")');

    // Step 4: OTP Confirmation
    await expect(page.locator('h3:has-text("E-Mail Best")')).toBeVisible();
    
    // Poll for the actual OTP
    const otp = await getOtpFromMailTm(request, token);

    await page.fill('input[placeholder="123456"]', otp);
    await page.click('button:has-text("Verifizieren")');

    // 2. Login
    await expect(page).toHaveURL(/\/login/);
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button:has-text("Anmelden")');

    // 3. Dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('Pharmacy Registration -> Confirm Email -> Login -> Dashboard', async ({ page, request }) => {
    test.setTimeout(120000); // 2 minutes for email polling

    // Generate mail.tm address
    const { address: testEmail, token } = await createMailTmAccount(request);
    const testPassword = 'Password123!';

    // 1. Registration
    await page.goto('/register/pharmacy');
    
    // Step 1: Pharmacy Info
    await page.fill('input[name="pharmacyName"]', 'E2E Apotheke');
    await page.fill('input[name="ownerFirstName"]', 'E2E');
    await page.fill('input[name="ownerLastName"]', 'Owner');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="phone"]', '01511234567');
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.fill('input[name="street"]', 'Apothekenweg');
    await page.fill('input[name="houseNumber"]', '42');
    await page.fill('input[name="postalCode"]', '10115');
    await page.fill('input[name="city"]', 'Berlin');
    
    await page.click('button:has-text("Registrierung abschließen")');

    // Step 2: OTP Confirmation
    await expect(page.locator('h3:has-text("E-Mail Best")')).toBeVisible();
    
    // Poll for the actual OTP
    const otp = await getOtpFromMailTm(request, token);

    await page.fill('input[placeholder="123456"]', otp);
    await page.click('button:has-text("Verifizieren")');

    // 2. Login
    await expect(page).toHaveURL(/\/login/);
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button:has-text("Anmelden")');

    // 3. Dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard');
  });
});
