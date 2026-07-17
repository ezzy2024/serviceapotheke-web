const fs = require('fs');
const bcrypt = require('bcrypt');
const { Client } = require('pg');

async function run() {
  const hash = await bcrypt.hash('Test1234!', 10);
  const client = new Client({
    connectionString: 'postgres://appuser:ServiceApotheke2026Strong@127.0.0.1:5432/serviceapotheke-db',
    ssl: false
  });
  await client.connect();
  
  const emailSuffix = Date.now();
  const pharmacyEmail = `pharmacy_${emailSuffix}@test.com`;
  const pharmacistEmail = `pharmacist_${emailSuffix}@test.com`;

  console.log("Inserting Pharmacy...");
  const pRes = await client.query(`
    INSERT INTO "Pharmacies" 
    ("PharmacyName", "Email", "PasswordHash", "Street", "HouseNumber", "PostalCode", "City", "IsEmailConfirmed", "LicenseNumber", "SoftwareSystem", "CreatedAt", "PhoneNumber", "IsVerified")
    VALUES 
    ('Test Apo', $1, $2, 'Apo', '1', '12345', 'City', true, '12345', 'IXOS', NOW(), '0123456789', true)
    RETURNING "Id"
  `, [pharmacyEmail, hash]);
  const pharmacyId = pRes.rows[0].Id;

  console.log("Inserting Pharmacist...");
  const phRes = await client.query(`
    INSERT INTO "Pharmacists"
    ("FullName", "Email", "PasswordHash", "Street", "HouseNumber", "PostalCode", "City", "IsEmailConfirmed", "Status", "Qualification", "WwsProficiency", "PhoneNumber", "IsVerified")
    VALUES
    ('Test Pharm', $1, $2, 'Ph', '1', '12345', 'City', true, 2, 'Apotheker', 'IXOS', '0123456789', true)
    RETURNING "Id"
  `, [pharmacistEmail, hash]);
  const pharmacistId = phRes.rows[0].Id;

  console.log("Inserting JobPost...");
  const start = new Date(Date.now() - 86400000).toISOString();
  const end = new Date(Date.now() - 40000000).toISOString();
  const jRes = await client.query(`
    INSERT INTO "JobPosts"
    ("PharmacyId", "Title", "Description", "StartDate", "EndDate", "Salary", "Status", "CreatedAt", "HourlyRate")
    VALUES
    ($1, 'Direct Test Shift', 'Test', $2, $3, 50, 'Active', NOW(), 50)
    RETURNING "Id"
  `, [pharmacyId, start, end]);
  const jobId = jRes.rows[0].Id;

  console.log("Inserting JobApplication...");
  const aRes = await client.query(`
    INSERT INTO "JobApplications"
    ("JobPostId", "PharmacistId", "Status", "AppliedAt")
    VALUES
    ($1, $2, 'Accepted', NOW())
    RETURNING "Id"
  `, [jobId, pharmacistId]);

  await client.end();
  
  const creds = {
    pharmacy: { email: pharmacyEmail, password: 'Test1234!' },
    pharmacist: { email: pharmacistEmail, password: 'Test1234!' }
  };
  fs.writeFileSync('creds.json', JSON.stringify(creds));
  console.log("Direct seed complete!");
}

run().catch(console.error);
