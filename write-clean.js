const fs = require('fs');

const content = `import { test, expect } from '@playwright/test';

// Helper function to create a mail.tm account and return credentials
async function createMailTmAccount(request: any) {
  // 1. Get a valid domain
  const domainRes = await request.get('https://api.mail.tm/domains');
  const domainData = await domainRes.json();
  const domain = domainData['hydra:member'][0].domain;

  // 2. Create an account
  const address = \`e2etest_\${Date.now()}@\${domain}\`;
  const password = 'Password123!';
  
  await request.post('https://api.mail.tm/accounts', {
    data: { address, password }
  });

  // 3. Get JWT token
  const tokenRes = await request.post('https://api.mail.tm/token', {
    data: { address, password }
  });
  const tokenData = await tokenRes.json();
  
  return { id: tokenData.id, address, token: tokenData.token };
}

// Helper function to poll mail.tm for an OTP
async function getOtpFromMailTm(request: any, token: string, maxRetries = 15): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const messagesRes = await request.get('https://api.mail.tm/messages', {
      headers: { Authorization: \`Bearer \${token}\` }
    });
    const messagesData = await messagesRes.json();
    
    if (messagesData['hydra:totalItems'] > 0) {
      const messageId = messagesData['hydra:member'][0].id;
      const messageDetailRes = await request.get(\`https://api.mail.tm/messages/\${messageId}\`, {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      const messageDetail = await messageDetailRes.json();
      const match = messageDetail.text.match(/(\d{6})/);
      if (match) return match[1];
    }
  }
  throw new Error('OTP not received within timeout');
}

test.describe('Live E2E Flow', () => {
  // Ignore known benign console errors
  test.beforeEach(({ page }) => {
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (text.includes('favicon.ico') && text.includes('404')) return;
        if (text.includes('manifest.json') && text.includes('404')) return;
        if (text.includes('/Auth/me') || text.includes('AuthContext') || text.includes('status of 401')) return;
        throw new Error(\`Console Error: \${text}\`);
      }
    });
  });

  test('Pharmacist Registration -> Confirm Email -> Login -> Dashboard', async ({ page, request }) => {
    test.setTimeout(120000);

    const { id: accountId, address: testEmail, token } = await createMailTmAccount(request);
    const testPassword = 'Password123!';

    await page.goto('/register/pharmacist');
    
    // Step 1: Personal Info
    await page.fill('input[name="firstName"]', 'E2E');
    await page.fill('input[name="lastName"]', 'Tester');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.fill('input[name="street"]', 'Teststraﬂe');
    await page.fill('input[name="houseNumber"]', '1');
    await page.fill('input[name="postalCode"]', '10115');
    await page.fill('input[name="city"]', 'Berlin');
    await page.click('button:has-text("Weiter")');

    // Step 2: Qualifications
    await expect(page.locator('h3:has-text("Qualifikationen")')).toBeVisible();
    await page.click('button:has-text("Weiter")');

    // Step 3: Documents
    await expect(page.locator('h3:has-text("Dokumente Upload")')).toBeVisible();
    await page.click('button:has-text("Registrierung abschlieﬂen")');

    // Step 4: OTP Confirmation
    await expect(page.locator('h3:has-text("E-Mail Best")')).toBeVisible();
    const otp = await getOtpFromMailTm(request, token);
    await page.fill('input[placeholder="123456"]', otp);
    await page.click('button:has-text("Verifizieren")');

    // Dashboard
    await expect(page).toHaveURL(/\\/dashboard/);
    await expect(page.locator("text=Alle Schichten")).toBeVisible();

    await request.delete(\`https://api.mail.tm/accounts/\${accountId}\`, { headers: { Authorization: \`Bearer \${token}\` } });
  });

  test('Pharmacy Registration -> Confirm Email -> Login -> Dashboard', async ({ page, request }) => {
    test.setTimeout(120000);

    const { id: accountId, address: testEmail, token } = await createMailTmAccount(request);
    const testPassword = 'Password123!';

    await page.goto('/register/pharmacy');
    
    // Step 1: Pharmacy Info
    await page.fill('input[name="pharmacyName"]', 'E2E Apotheke');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.fill('input[name="street"]', 'Apothekenweg');
    await page.fill('input[name="houseNumber"]', '42');
    await page.fill('input[name="postalCode"]', '10115');
    await page.fill('input[name="city"]', 'Berlin');
    await page.click('button:has-text("Weiter")');

    // Step 2: Infrastructure
    await page.fill('input[name="licenseNumber"]', '123456789');
    await page.click('button:has-text("Weiter")');

    // Step 3: Verification (Fake file upload)
    await page.setInputFiles('input[type="file"]', {
      name: 'file.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake pdf content')
    });
    await page.click('button:has-text("Registrierung abschlieﬂen")');

    // Step 4: OTP Confirmation
    await expect(page.locator('h3:has-text("E-Mail Best")')).toBeVisible();
    const otp = await getOtpFromMailTm(request, token);
    await page.fill('input[placeholder="123456"]', otp);
    await page.click('button:has-text("Verifizieren")');

    // Dashboard
    await expect(page).toHaveURL(/\\/dashboard/);
    await expect(page.locator("text=Command Center")).toBeVisible();

    await request.delete(\`https://api.mail.tm/accounts/\${accountId}\`, { headers: { Authorization: \`Bearer \${token}\` } });
  });
});
`;

fs.writeFileSync('tests/live-e2e.spec.ts', content, 'utf8');
