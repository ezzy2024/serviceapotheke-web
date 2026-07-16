const fs = require('fs');
function fix(file, replaces) {
  let content = fs.readFileSync(file, 'utf8');
  for (let [search, replace] of replaces) {
    content = content.replace(search, replace);
  }
  fs.writeFileSync(file, content, 'utf8');
}
fix('src/app/(b2b)/dashboard/pharmacy/atm/page.tsx', [
  [/Gltig fr/g, 'Gültig für'],
  [/Bereit fr/g, 'Bereit für']
]);
fix('src/app/(b2b)/register/pharmacist/page.tsx', [
  [/Besttigungscode/g, 'Bestätigungscode']
]);
fix('src/app/(b2b)/register/pharmacy/page.tsx', [
  [/Besttigungscode/g, 'Bestätigungscode']
]);
fix('src/app/(b2c)/register/patient/page.tsx', [
  [/ausdrcklich/g, 'ausdrücklich'],
  [/Ausfhrung/g, 'Ausführung']
]);
console.log('Fixed additional files');

