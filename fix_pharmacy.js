const fs = require('fs');
const file = 'src/app/(b2b)/register/pharmacy/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<div className="min-h-screen bg-bone flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">/g, '<div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">');
content = content.replace(/<h2 className="text-4xl md:text-5xl font-black text-ink font-bricolage tracking-tight uppercase">Apotheken Registrierung<\/h2>/g, '<h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Apotheken Registrierung</h2>');
content = content.replace(/<p className="mt-4 text-ink\/70 font-medium font-jetbrains uppercase tracking-widest text-sm">Schritt \{step\} von \{step === 4 \? 4 : 3\}<\/p>/g, '<p className="mt-2 text-slate-500 font-semibold text-sm uppercase tracking-wider">Schritt {step} von {step === 4 ? 4 : 3}</p>');
content = content.replace(/<div className="bg-white rounded-2xl shadow-xl ring-1 ring-ink\/5 p-8">/g, '<div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10">');


content = content.replace(/<label className="block text-sm font-bold text-ink mb-2 uppercase tracking-wide">/g, '<label className="block text-sm font-semibold text-slate-700 mb-1">');
content = content.replace(/className=\{\`block w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-lime transition-all shadow-sm \$\{errors\.([a-zA-Z]+) \? 'border-persimmon bg-persimmon\/10' : 'border-ink'\}\`\}/g, 
"className={`w-full px-4 py-3 rounded-xl border transition-all ${errors.$1 ? 'border-red-300 focus:ring-2 focus:ring-red-500/20 bg-red-50 text-red-900' : 'border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'}`}");
content = content.replace(/<p className="mt-2 text-xs font-bold text-persimmon uppercase tracking-wider">\{errors\.([a-zA-Z]+)\}<\/p>/g,
'<p className="mt-2 text-sm text-red-600 font-medium">{errors.$1}</p>');
content = content.replace(/<h3 className="text-2xl font-bold text-ink mb-6 font-bricolage tracking-tight">/g, '<h3 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">');
content = content.replace(/<Button onClick=\{handleNext\} className="bg-ink text-white rounded-xl shadow-md hover:bg-ink\/90 font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">/g, '<Button onClick={handleNext} className="bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">');
content = content.replace(/<Button onClick=\{handleRegister\} isLoading=\{isLoading\} className="bg-ink text-white rounded-xl shadow-md hover:bg-ink\/90 font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">/g, '<Button onClick={handleRegister} isLoading={isLoading} className="bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">');
content = content.replace(/<Button onClick=\{handleVerify\} isLoading=\{isLoading\} className="bg-ink text-white rounded-xl shadow-md hover:bg-ink\/90 font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">/g, '<Button onClick={handleVerify} isLoading={isLoading} className="bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">');
content = content.replace(/<Button onClick=\{\(\) => setStep\(\d\)\} className="bg-white text-ink border border-ink\/20 rounded-xl shadow-sm hover:bg-bone font-semibold px-6 py-3 transition-all inline-flex items-center justify-center">/g, match => {
  return match.replace(/bg-white text-ink border border-ink\/20.*hover:bg-bone/, 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm');
});
content = content.replace(/className="block w-full p-3 border-2 border-ink focus:outline-none focus:bg-lime\/10 transition-colors bg-white font-bold"/g, 'className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"');
content = content.replace(/className="block w-full p-3 border-2 border-ink focus:outline-none focus:bg-lime\/10 transition-colors"/g, 'className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"');
content = content.replace(/className="block w-full p-4 border-2 border-ink focus:outline-none focus:bg-lime\/10 transition-colors text-center text-3xl tracking-\[0\.5em\] font-jetbrains font-bold"/g, 'className="block w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-center text-3xl tracking-[0.5em] font-mono font-bold"');
content = content.replace(/<strong className="bg-lime px-1">/g, '<strong className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded">');
content = content.replace(/<p className="text-ink font-medium">/g, '<p className="text-slate-600 font-medium">');

fs.writeFileSync(file, content);
console.log('Pharmacy form restyled');
