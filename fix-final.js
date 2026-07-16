const fs = require('fs');
let file = fs.readFileSync('tests/live-e2e.spec.ts', 'utf8');

// 1. Destructure the id from the account
file = file.replace(
  'return { address, token: tokenData.token };',
  'return { id: tokenData.id, address, token: tokenData.token };'
);
file = file.replace(
  /const \{ address: testEmail, token \} = await createMailTmAccount\(request\);/g,
  'const { id: accountId, address: testEmail, token } = await createMailTmAccount(request);'
);

// 2. Remove the explicit login block because auto-login happens after OTP
file = file.replace(
  /\/\/ 2\. Login[\s\S]*?await page\.click\('button:has-text\("Anmelden"\)'\);\n/g,
  ''
);

// 3. Fix the locators and add cleanup (properly escaping backticks in JS using \)
file = file.replace(
  /await expect\(page\.locator\('h1'\)\)\.toContainText\('Dashboard'\);/g,
  'await expect(page.locator("text=Alle Schichten")).toBeVisible();\n\n    // Clean up mail.tm account\n    await request.delete(https://api.mail.tm/accounts/, { headers: { Authorization: Bearer  } });'
);

file = file.replace(
  /await expect\(page\.locator\('text=Command Center'\)\)\.toBeVisible\(\);/g,
  'await expect(page.locator("text=Command Center")).toBeVisible();\n\n    // Clean up mail.tm account\n    await request.delete(https://api.mail.tm/accounts/, { headers: { Authorization: Bearer  } });'
);

fs.writeFileSync('tests/live-e2e.spec.ts', file);
