const fs = require('fs'); let file = fs.readFileSync('tests/live-e2e.spec.ts', 'utf8'); file = file.replace(/abschlie.*?"/g, 'abschlie"'); fs.writeFileSync('tests/live-e2e.spec.ts', file);
