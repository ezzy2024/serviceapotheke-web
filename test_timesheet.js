const { Client } = require('pg');
const fetch = require('node-fetch');

async function testTimesheet() {
  const client = new Client({
    host: 'localhost',
    port: 5433,
    database: 'serviceapotheke-db',
    user: 'appuser',
    password: 'ServiceApotheke2026Strong'
  });
  await client.connect();
  const res = await client.query('SELECT "Email" FROM "Pharmacists" WHERE "IsEmailConfirmed" = true LIMIT 1');
  const email = res.rows[0].Email;
  console.log('Logging in as', email);

  const loginRes = await fetch('https://api.serviceapotheke.tech/api/Pharmacist/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'TestPassword123!' })
  });
  
  if (!loginRes.ok) {
    console.log('Login failed', loginRes.status, await loginRes.text());
    await client.end();
    return;
  }
  
  const token = (await loginRes.json()).token;
  
  const submitRes = await fetch('https://api.serviceapotheke.tech/api/Timesheet/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ shiftId: 1, startTime: '2026-07-16T08:00:00Z', endTime: '2026-07-16T16:00:00Z', breakMinutes: 30 })
  });
  
  console.log('Timesheet Submit Status:', submitRes.status);
  console.log('Timesheet Submit Body:', await submitRes.text());

  await client.end();
}

testTimesheet().catch(console.error);
