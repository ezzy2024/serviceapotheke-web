const { Client } = require('pg');
const c = new Client({ connectionString: 'postgres://appuser:ServiceApotheke2026Strong@127.0.0.1:5432/serviceapotheke-db', ssl: false });
c.connect().then(() => c.query('SELECT column_name FROM information_schema.columns WHERE table_name = \'Pharmacies\'')).then(r => console.log('Pharmacies:', r.rows.map(row => row.column_name).join(', '))).then(() => c.query('SELECT column_name FROM information_schema.columns WHERE table_name = \'Pharmacists\'')).then(r => console.log('Pharmacists:', r.rows.map(row => row.column_name).join(', '))).finally(() => c.end());
