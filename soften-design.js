const fs = require('fs');
const path = require('path');

const files = [
  'src/app/(b2b)/register/pharmacist/page.tsx',
  'src/app/(b2b)/register/pharmacy/page.tsx'
];

for (const file of files) {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Soften borders
  content = content.replace(/border-4/g, 'border-2');
  
  // 2. Reduce uppercase in headings
  content = content.replace(/uppercase tracking-tight/g, 'tracking-tight');
  
  // Keep uppercase for small labels: uppercase tracking-wide is okay, but maybe we can soften it too
  // content = content.replace(/uppercase tracking-wide/g, ''); // Let's keep it for labels as requested "reserve it for short labels/badges"

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
}
