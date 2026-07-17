const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://appuser:ServiceApotheke2026Strong@127.0.0.1:5432/serviceapotheke-db',
});

async function query() {
  await client.connect();
  const registries = await client.query('SELECT * FROM "pharmacy_registry" WHERE "DocumentLocator" IS NOT NULL');
  console.log(`pharmacy_registry with encrypted DocumentLocator: ${registries.rows.length}`);
  if (registries.rows.length > 0) {
      console.log('Sample Registries emails:', registries.rows.map(r => r.ContactEmail));
  }

  await client.end();
}

query().catch(console.error);
