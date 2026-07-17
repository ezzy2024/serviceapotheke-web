const fs = require('fs');
const path = require('path');

const DASHBOARD_DIR = path.join(__dirname, 'src', 'app', '(b2b)', 'dashboard');

// Recursively find all .tsx files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findFiles(filePath, fileList);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = findFiles(DASHBOARD_DIR);

const replacements = [
  // Box shadows and borders
  { regex: /shadow-\[8px_8px_0px_0px_rgba\(0,0,0,1\)\]/g, replacement: 'shadow-lg rounded-2xl' },
  { regex: /shadow-\[6px_6px_0px_0px_rgba\(0,0,0,1\)\]/g, replacement: 'shadow-md rounded-2xl' },
  { regex: /shadow-\[4px_4px_0px_0px_rgba\(0,0,0,1\)\]/g, replacement: 'shadow-md rounded-xl' },
  { regex: /shadow-\[2px_2px_0px_0px_rgba\(0,0,0,1\)\]/g, replacement: 'shadow-sm rounded-lg' },
  { regex: /shadow-\[3px_3px_0px_0px_rgba\(0,0,0,1\)\]/g, replacement: 'shadow rounded-lg' },
  { regex: /border-4 border-ink/g, replacement: 'border border-slate-200' },
  { regex: /border-2 border-ink/g, replacement: 'border border-slate-200' },
  { regex: /border-b-2 border-ink/g, replacement: 'border-b border-slate-200' },
  { regex: /border-t-2 border-ink/g, replacement: 'border-t border-slate-200' },
  { regex: /border-ink/g, replacement: 'border-slate-200' },
  
  // Backgrounds
  { regex: /bg-bone/g, replacement: 'bg-slate-50' },
  { regex: /bg-ink\/90/g, replacement: 'bg-blue-700' },
  { regex: /bg-ink/g, replacement: 'bg-blue-600' },
  { regex: /bg-lime/g, replacement: 'bg-emerald-500' },
  { regex: /bg-green-400/g, replacement: 'bg-emerald-50' },
  { regex: /hover:bg-bone/g, replacement: 'hover:bg-slate-50' },

  // Typography
  { regex: /text-ink\/70/g, replacement: 'text-slate-500' },
  { regex: /text-ink\/80/g, replacement: 'text-slate-600' },
  { regex: /text-ink/g, replacement: 'text-slate-800' },
  { regex: /text-bone/g, replacement: 'text-white' },
  { regex: /font-black uppercase tracking-wide/g, replacement: 'font-semibold' },
  { regex: /font-black uppercase tracking-widest/g, replacement: 'font-bold' },
  { regex: /font-black uppercase/g, replacement: 'font-semibold' },
  { regex: /font-black/g, replacement: 'font-bold' },
  
  // Shapes
  { regex: /rounded-none/g, replacement: 'rounded-xl' }
];

let filesModified = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  for (const rule of replacements) {
    content = content.replace(rule.regex, rule.replacement);
  }

  // A couple specific fixes for ATM terminal simulator component colors
  content = content.replace(/text-slate-800 uppercase tracking-tight flex items-center/g, 'text-slate-800 tracking-tight flex items-center');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    filesModified++;
    console.log(`Updated ${file}`);
  }
}

console.log(`\nComplete! Modified ${filesModified} files.`);
