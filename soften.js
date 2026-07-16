const fs = require('fs');
const files = [
  'C:/Users/ezzel/Projects/ServiceApotheke_MegaProject/serviceapotheke-web/src/app/(b2b)/register/pharmacist/page.tsx',
  'C:/Users/ezzel/Projects/ServiceApotheke_MegaProject/serviceapotheke-web/src/app/(b2b)/register/pharmacy/page.tsx',
  'C:/Users/ezzel/Projects/ServiceApotheke_MegaProject/serviceapotheke-web/src/app/(marketing)/ueber-uns/page.tsx',
  'C:/Users/ezzel/Projects/ServiceApotheke_MegaProject/serviceapotheke-web/src/app/(marketing)/fuer-apotheken/page.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');

    // Registration pages: remove brutalism
    content = content.replace(/border-2 border-ink shadow-\[8px_8px_0px_0px_rgba\(12,20,16,1\)\]/g, 'bg-white rounded-2xl shadow-xl ring-1 ring-ink/5');
    content = content.replace(/shadow-\[4px_4px_0px_0px_rgba\(12,20,16,1\)\]/g, 'shadow-md rounded-xl ring-1 ring-ink/5');
    content = content.replace(/border-2 focus:outline-none focus:bg-lime\/10 transition-colors border-ink/g, 'border border-ink/20 rounded-xl focus:ring-2 focus:ring-lime focus:border-lime transition-all shadow-sm');
    content = content.replace(/border-2 border-lime focus:outline-none focus:bg-lime\/10 transition-colors/g, 'border border-lime/50 rounded-xl focus:ring-2 focus:ring-lime transition-all shadow-sm');
    content = content.replace(/border-2 focus:outline-none focus:bg-lime\/10 transition-colors border-persimmon bg-persimmon\/10/g, 'border border-persimmon rounded-xl focus:ring-2 focus:ring-persimmon transition-all shadow-sm bg-persimmon/5');
    content = content.replace(/variant="brutalist"/g, 'className="bg-ink text-white rounded-xl shadow-md hover:bg-ink/90 font-semibold px-6 py-3 transition-all inline-flex items-center justify-center"');
    content = content.replace(/variant="brutalist-secondary"/g, 'className="bg-white text-ink border border-ink/20 rounded-xl shadow-sm hover:bg-bone font-semibold px-6 py-3 transition-all inline-flex items-center justify-center"');
    
    // Replace remaining generic borders not caught by the specific matches
    content = content.replace(/className={`block w-full p-3 border-2 focus:outline-none focus:bg-lime\/10 transition-colors \${/g, 'className={`block w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime transition-all shadow-sm ${');
    
    // Marketing pages: remove blue gradients
    content = content.replace(/bg-gradient-to-r from-blue-600 to-cyan-500/g, 'bg-ink');
    content = content.replace(/text-blue-600/g, 'text-ink');
    content = content.replace(/text-blue-500/g, 'text-ink/80');
    content = content.replace(/bg-blue-600/g, 'bg-lime text-ink');
    content = content.replace(/hover:bg-blue-700/g, 'hover:bg-lime/90');
    content = content.replace(/bg-blue-50/g, 'bg-bone');

    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated design on:', f);
  } else {
    console.log('File not found:', f);
  }
});
