const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://appuser:ServiceApotheke2026Strong@127.0.0.1:5432/serviceapotheke-db',
});

async function query() {
  await client.connect();
  const timesheets = await client.query('SELECT * FROM "Timesheets" WHERE "TimesheetPath" IS NOT NULL');
  console.log(`Timesheets with encrypted PDF: ${timesheets.rows.length}`);
  
  const registries = await client.query('SELECT * FROM "PharmacyRegistries" WHERE "DocumentLocator" IS NOT NULL');
  console.log(`PharmacyRegistries with encrypted DocumentLocator: ${registries.rows.length}`);
  if (registries.rows.length > 0) {
      console.log('Sample Registries emails:', registries.rows.map(r => r.ContactEmail));
  }

  await client.end();
}

query().catch(console.error);
