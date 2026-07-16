const fs = require('fs');
let file = fs.readFileSync('tests/live-e2e.spec.ts', 'utf8');

file = file.replace(
  'return { address, token: tokenData.token };',
  'return { id: tokenData.id, address, token: tokenData.token };'
);

file = file.replace(
  /const \{ address: testEmail, token \} = await createMailTmAccount\(request\);/g,
  'const { id: accountId, address: testEmail, token } = await createMailTmAccount(request);'
);

file = file.replace(
  /await expect\(page\.locator\('h1'\)\)\.toContainText\('Dashboard'\);/g,
  'await expect(page.locator(	ext=Alle Schichten)).toBeVisible();\n\n    // Clean up mail.tm account\n    await request.delete(https://api.mail.tm/accounts/${accountId}, { headers: { Authorization: Bearer  } });'
);

file = file.replace(
  /await expect\(page\.locator\('text=Command Center'\)\)\.toBeVisible\(\);/g,
  'await expect(page.locator(	ext=Command Center)).toBeVisible();\n\n    // Clean up mail.tm account\n    await request.delete(https://api.mail.tm/accounts/${accountId}, { headers: { Authorization: Bearer  } });'
);

fs.writeFileSync('tests/live-e2e.spec.ts', file);
