const fs = require('fs');
const glob = require('glob'); // Assuming we can use simple Node.js fs loops
function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/Kein Personal fr heute/g, 'Kein Personal für heute');
  content = content.replace(/Kï¿½hlschrank/g, 'Kühlschrank');
  content = content.replace(/E-Mail Besttigung/g, 'E-Mail Bestätigung');
  content = content.replace(/E-Mail besttigt/g, 'E-Mail bestätigt');
  content = content.replace(/Registrierung abschlieen/g, 'Registrierung abschließen');
  content = content.replace(/ï¿½/g, 'ß'); // Maybe?
  fs.writeFileSync(file, content, 'utf8');
}
fix('src/app/(b2b)/dashboard/pharmacy/page.tsx');
fix('src/app/(b2b)/register/pharmacist/page.tsx');
fix('src/app/(b2b)/register/pharmacy/page.tsx');
console.log('Fixed');

