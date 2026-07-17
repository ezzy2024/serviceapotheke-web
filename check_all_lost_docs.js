const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://appuser:ServiceApotheke2026Strong@127.0.0.1:5432/serviceapotheke-db',
});

async function run() {
  await client.connect();
  
  const pharmacies = await client.query('SELECT "PharmacyName", "Email" FROM "Pharmacies" WHERE "FreelanceContractDocumentPath" IS NOT NULL');
  console.log('Pharmacies with documents:', pharmacies.rows);

  const pharmacists = await client.query('SELECT "FirstName", "LastName", "Email" FROM "Pharmacists" WHERE "ApprobationDocumentPath" IS NOT NULL');
  console.log('Pharmacists with documents:', pharmacists.rows);

  const timesheets = await client.query('SELECT "Id", "TimesheetPath" FROM "Timesheets" WHERE "TimesheetPath" IS NOT NULL');
  console.log('Timesheets with documents:', timesheets.rows);

  await client.end();
}

run().catch(console.error);
