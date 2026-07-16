const fs = require('fs');
let file = fs.readFileSync('tests/live-e2e.spec.ts', 'utf8');

file = file.replace(
  /\/\/ 2\. Login[\s\S]*?await page\.click\('button:has-text\("Anmelden"\)'\);\n/g,
  ''
);

fs.writeFileSync('tests/live-e2e.spec.ts', file);
