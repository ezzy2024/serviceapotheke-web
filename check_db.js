const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://appuser:ServiceApotheke2026Strong@127.0.0.1:5432/serviceapotheke-db',
});

async function query() {
  await client.connect();
  const res = await client.query('SELECT "Id", "Email", "ApprobationDocumentPath" FROM "Pharmacists" WHERE "ApprobationDocumentPath" IS NOT NULL');
  console.log('Results:', res.rows);
  await client.end();
}

query().catch(console.error);
