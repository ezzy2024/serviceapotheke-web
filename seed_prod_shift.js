const fs = require('fs');
const { Client } = require('pg');

async function getMailTmAccount() {
  const domainRes = await fetch('https://api.mail.tm/domains');
  const domains = await domainRes.json();
  const domain = domains['hydra:member'][0].domain;
  const email = 'test_seed_' + Date.now() + Math.random().toString().substring(2,5) + '@' + domain;
  const password = 'TestPassword123!';

  await fetch('https://api.mail.tm/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: email, password })
  });

  const tokenRes = await fetch('https://api.mail.tm/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: email, password })
  });
  const { token } = await tokenRes.json();

  return { email, password, token };
}

async function getTokenFromMail(token) {
  for (let i = 0; i < 30; i++) {
    const msgRes = await fetch('https://api.mail.tm/messages', {
      headers: { Authorization: 'Bearer ' + token }
    });
    const msgs = await msgRes.json();
    if (msgs['hydra:member'] && msgs['hydra:member'].length > 0) {
      const msgId = msgs['hydra:member'][0].id;
      const msgDetail = await fetch('https://api.mail.tm/messages/' + msgId, {
        headers: { Authorization: 'Bearer ' + token }
      });
      const msgData = await msgDetail.json();
      const match = msgData.text.match(/\b\d{6}\b/);
      if (match) return match[0];
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error('Code not found');
}

async function run() {
  console.log("Setting up Pharmacy...");
  const pharmacy = await getMailTmAccount();
  
  const fd = new FormData();
  fd.append('pharmacyName', 'Test Apo');
  fd.append('email', pharmacy.email);
  fd.append('password', pharmacy.password);
  fd.append('street', 'Apo');
  fd.append('houseNumber', '1');
  fd.append('postalCode', '12345');
  fd.append('city', 'City');
  fd.append('softwareSystem', 'IXOS');
  fd.append('softwareSystemLevel', 'Experte');
  fd.append('operatingLicense', new Blob(['dummy'], { type: 'application/pdf' }), 'dummy.pdf');

  const regRes = await fetch('https://api.serviceapotheke.tech/api/Pharmacy/register', {
    method: 'POST',
    body: fd
  });
  if(!regRes.ok) throw new Error("Pharmacy reg failed: " + await regRes.text());

  let pcode = await getTokenFromMail(pharmacy.token);
  await fetch('https://api.serviceapotheke.tech/api/Pharmacy/confirm-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: pharmacy.email, token: pcode })
  });
  const plogin = await fetch('https://api.serviceapotheke.tech/api/Pharmacy/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: pharmacy.email, password: pharmacy.password })
  });
  const ploginData = await plogin.json();
  const pharmacyJwt = ploginData.token;
  const pharmacyId = ploginData.id;

  console.log("Setting up Pharmacist...");
  const pharmacist = await getMailTmAccount();
  const pRegRes = await fetch('https://api.serviceapotheke.tech/api/Pharmacist/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: 'Test',
      lastName: 'Pharm',
      email: pharmacist.email,
      password: pharmacist.password,
      street: 'Ph',
      houseNumber: '1',
      postalCode: '12345',
      city: 'City'
    })
  });
  if(!pRegRes.ok) throw new Error("Pharm reg failed: " + await pRegRes.text());

  let phcode = await getTokenFromMail(pharmacist.token);
  await fetch('https://api.serviceapotheke.tech/api/Pharmacist/confirm-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: pharmacist.email, token: phcode })
  });
  const phlogin = await fetch('https://api.serviceapotheke.tech/api/Pharmacist/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: pharmacist.email, password: pharmacist.password })
  });
  const phloginData = await phlogin.json();
  const pharmacistJwt = phloginData.token;
  const pharmacistId = phloginData.id;

  console.log("Creating Job Post...");
  const jobRes = await fetch('https://api.serviceapotheke.tech/api/Job', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pharmacyJwt },
    body: JSON.stringify({
      pharmacyId: pharmacyId,
      title: 'Playwright Test Shift',
      description: 'Test',
      startDate: new Date(Date.now() - 86400000).toISOString(),
      endDate: new Date(Date.now() - 40000000).toISOString(),
      salary: 50
    })
  });
  const jobData = await jobRes.json();
  const jobId = jobData.id;
  console.log("Job ID:", jobId);

  console.log("Verifying Pharmacist via DB...");
  const client = new Client({
    connectionString: 'postgres://appuser:ServiceApotheke2026Strong@127.0.0.1:5432/serviceapotheke-db',
    ssl: false
  });
  await client.connect();
  await client.query('UPDATE "Pharmacists" SET "Status" = 2 WHERE "Id" = $1', [pharmacistId]);
  await client.end();

  console.log("Applying...");
  const applyRes = await fetch('https://api.serviceapotheke.tech/api/Job/JobApplication/apply', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pharmacistJwt },
    body: JSON.stringify({
      jobPostId: jobId,
      pharmacistId: pharmacistId
    })
  });
  if(!applyRes.ok) throw new Error('Apply failed: ' + await applyRes.text());
  const applyData = await applyRes.json();
  const appId = applyData.applicationId || applyData.id;
  console.log("Application ID:", appId);

  console.log("Accepting...");
  await fetch(`https://api.serviceapotheke.tech/api/Allocation/shift/${appId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + pharmacyJwt },
    body: JSON.stringify({ newStatus: 'Accepted', notes: '' })
  });

  fs.writeFileSync('creds.json', JSON.stringify({ pharmacy, pharmacist }));
  console.log("Setup complete!");
}

run();
