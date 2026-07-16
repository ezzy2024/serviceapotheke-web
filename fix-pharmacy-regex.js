const fs = require('fs');
let file = fs.readFileSync('tests/live-e2e.spec.ts', 'utf8');

file = file.replace(
  /await page\.click\('button:has-text\("Registrierung abschlie.+?"\)'\);/g,
  `await page.click('button:has-text("Weiter")');\n\n    // Step 2: Infrastructure\n    await page.fill('input[name="licenseNumber"]', '123456789');\n    await page.click('button:has-text("Weiter")');\n\n    // Step 3: Verification (Fake file upload)\n    await page.setInputFiles('input[type="file"]', {\n      name: 'file.pdf',\n      mimeType: 'application/pdf',\n      buffer: Buffer.from('fake pdf content')\n    });\n    await page.click('button:has-text("Registrierung abschlieﬂen")');`
);

fs.writeFileSync('tests/live-e2e.spec.ts', file);
