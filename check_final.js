const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://appuser:ServiceApotheke2026Strong@127.0.0.1:5432/serviceapotheke-db',
});

async function query() {
  await client.connect();
  const timesheets = await client.query('SELECT * FROM "Timesheets" WHERE "TimesheetPath" IS NOT NULL');
  console.log(`Timesheets with encrypted PDF: ${timesheets.rows.length}`);
  if (timesheets.rows.length > 0) {
      console.log('Sample Timesheets:', timesheets.rows.map(r => r.Id));
  }
  
  const pharmacies = await client.query('SELECT * FROM "Pharmacies" WHERE "FreelanceContractDocumentPath" IS NOT NULL');
  console.log(`Pharmacies with encrypted DocumentLocator: ${pharmacies.rows.length}`);
  if (pharmacies.rows.length > 0) {
      console.log('Sample Pharmacies emails:', pharmacies.rows.map(r => r.ContactEmail));
  }

  await client.end();
}

query().catch(console.error);
