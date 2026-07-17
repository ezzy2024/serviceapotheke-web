const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://appuser:ServiceApotheke2026Strong@127.0.0.1:5432/serviceapotheke-db',
});

async function run() {
  await client.connect();
  console.log('Clearing dummy ApprobationDocumentPath...');
  const res1 = await client.query('UPDATE "Pharmacists" SET "ApprobationDocumentPath" = NULL WHERE "ApprobationDocumentPath" IS NOT NULL');
  console.log(`Cleared ${res1.rowCount} rows in Pharmacists.`);

  console.log('Clearing dummy FreelanceContractDocumentPath...');
  const res2 = await client.query('UPDATE "Pharmacies" SET "FreelanceContractDocumentPath" = NULL WHERE "FreelanceContractDocumentPath" IS NOT NULL');
  console.log(`Cleared ${res2.rowCount} rows in Pharmacies.`);
  
  await client.end();
}

run().catch(console.error);
