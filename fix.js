const fs = require('fs');
const file = 'src/app/(b2b)/register/pharmacist/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">/g, '<label className="block text-sm font-semibold text-slate-700 mb-1">');
content = content.replace(/className=\{\`block w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime transition-all shadow-sm \$\{errors\.([a-zA-Z]+) \? 'border-persimmon bg-persimmon\/10' : 'border-ink'\}\`\}/g, 
"className={`w-full px-4 py-3 rounded-xl border transition-all ${errors.$1 ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 bg-red-50 text-red-900' : 'border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'}`}");
content = content.replace(/<p className="mt-2 text-xs font-bold text-persimmon uppercase tracking-wider">\{errors\.([a-zA-Z]+)\}<\/p>/g,
'<p className="mt-2 text-sm text-red-600 font-medium">{errors.$1}</p>');
content = content.replace(/<h3 className="text-2xl font-bold text-ink mb-6 font-bricolage tracking-tight">/g, '<h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">');
content = content.replace(/<Button onClick=\{handleNext\} className="bg-ink text-white rounded-xl shadow-md hover:bg-ink\/90 font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">/g, '<Button onClick={handleNext} className="bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">');
content = content.replace(/<Button onClick=\{handleSubmit\} isLoading=\{isLoading\} className="bg-ink text-white rounded-xl shadow-md hover:bg-ink\/90 font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">/g, '<Button onClick={handleSubmit} isLoading={isLoading} className="bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">');
content = content.replace(/<Button onClick=\{handleVerify\} isLoading=\{isLoading\} className="bg-ink text-white rounded-xl shadow-md hover:bg-ink\/90 font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">/g, '<Button onClick={handleVerify} isLoading={isLoading} className="bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">');
content = content.replace(/<Button onClick=\{\(\) => setStep\(\d\)\} className="bg-white text-ink border border-ink\/20 rounded-xl shadow-sm hover:bg-bone font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">/g, match => {
  return match.replace(/bg-white text-ink border border-ink\/20.*hover:bg-bone/, 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm');
});
content = content.replace(/className="block w-full p-3 border-2 border-ink focus:outline-none focus:bg-lime\/10 transition-colors font-bold bg-white"/g, 'className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"');
content = content.replace(/<Button onClick=\{addWws\} className="bg-white text-ink border border-ink\/20 rounded-xl shadow-sm hover:bg-bone font-semibold px-6 py-3 transition-all inline-flex items-center justify-center" size="md">/g, '<Button onClick={addWws} className="bg-white text-slate-700 border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 hover:text-slate-900 font-semibold px-4 py-3 transition-all inline-flex items-center justify-center" size="md">');
content = content.replace(/className="inline-flex items-center gap-2 bg-lime border-2 border-ink text-ink px-4 py-2 text-sm font-bold uppercase tracking-wide"/g, 'className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg px-4 py-2 text-sm font-semibold"');
content = content.replace(/className="block w-full p-4 border-2 border-ink focus:outline-none focus:bg-lime\/10 transition-colors text-center text-3xl tracking-\[0\.5em\] font-jetbrains font-bold"/g, 'className="block w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-center text-3xl tracking-[0.5em] font-mono font-bold"');
content = content.replace(/<strong className="bg-lime px-1">/g, '<strong className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded">');
content = content.replace(/<p className="text-ink font-medium">/g, '<p className="text-slate-600 font-medium">');

fs.writeFileSync(file, content);
console.log('Pharmacist form restyled');
