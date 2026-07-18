const axios = require('axios');
const fs = require('fs');
const { execSync } = require('child_process');

const API_BASE = 'https://api.serviceapotheke.tech/api';

async function runTest() {
  console.log("1. Creating fresh Pharmacy account...");
  const domainRes = await axios.get('https://api.mail.tm/domains');
  const domain = domainRes.data['hydra:member'][0].domain;
  const email = 'atm_test_' + Date.now() + '@' + domain;
  const password = 'TestPassword123!';
  
  await axios.post('https://api.mail.tm/accounts', { address: email, password: password });
  const tokenRes = await axios.post('https://api.mail.tm/token', { address: email, password: password });
  const mailToken = tokenRes.data.token;

  const FormData = require('form-data');
  const form = new FormData();
  form.append('email', email);
  form.append('password', password);
  form.append('name', 'Test Pharmacy E2E');
  form.append('street', 'Test Str');
  form.append('houseNumber', '1');
  form.append('postalCode', '12345');
  form.append('city', 'Berlin');
  form.append('ownerName', 'Test Owner');
  form.append('ikNumber', '123456789');

  await axios.post(`${API_BASE}/Pharmacy/register`, form, {
    headers: form.getHeaders()
  });

  console.log("Waiting for verification email...");
  let verificationCode = null;
  let seenMessages = new Set();
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 5000));
    const checkRes = await axios.get('https://api.mail.tm/messages', { headers: { Authorization: `Bearer ${mailToken}` } });
    if (checkRes.data['hydra:member']) {
      for(let msg of checkRes.data['hydra:member']) {
        if (!seenMessages.has(msg.id)) {
          const readRes = await axios.get(`https://api.mail.tm/messages/${msg.id}`, { headers: { Authorization: `Bearer ${mailToken}` } });
          seenMessages.add(msg.id);
          const match = readRes.data.text.match(/\b\d{6}\b/);
          if (match) { verificationCode = match[0]; break; }
        }
      }
    }
    if (verificationCode) break;
  }
  
  await axios.post(`${API_BASE}/Pharmacy/confirm-email`, { email: email, token: verificationCode });
  const authRes = await axios.post(`${API_BASE}/Pharmacy/login`, { email: email, password: password });
  const pharmacyToken = authRes.data.token;
  const axiosPharmacy = axios.create({ baseURL: API_BASE, headers: { Authorization: `Bearer ${pharmacyToken}` } });

  console.log("2. Kiosk initiating pairing...");
  const initRes = await axios.post(`${API_BASE}/atm/kiosk/initiate`);
  const pairingCode = initRes.data.code;
  console.log(`   Pairing Code generated: ${pairingCode}`);

  console.log("3. Pharmacy pairing terminal...");
  const pairRes = await axiosPharmacy.post('/atm/kiosk/pair', {
    code: pairingCode,
    terminalName: "E2E Test Terminal"
  });
  console.log("   Pairing successful, Terminal ID:", pairRes.data.terminalId);

  console.log("4. Kiosk polling for status to get DeviceToken...");
  const statusRes = await axios.get(`${API_BASE}/atm/kiosk/status/${pairingCode}`);
  const deviceToken = statusRes.data.deviceToken;
  console.log("   Device Token acquired.");

  const axiosKiosk = axios.create({ baseURL: API_BASE, headers: { 'x-device-token': deviceToken } });

  console.log("5. Kiosk submitting Consent and generating billable record...");
  const consentRes = await axiosKiosk.post('/atm/consent', {
    patientName: "Max Mustermann",
    healthInsuranceName: "AOK",
    healthInsuranceNumber: "A123456789",
    ikNumber: "101234567",
    signatureBlob: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    isTelepharmacyConsentGranted: true,
    isWwsExportGranted: true
  });
  const pdfUrl = consentRes.data.pdfUrl; // e.g. /api/atm/kiosk/download/{locator}
  console.log(`   Consent submitted. PDF Endpoint: ${pdfUrl}`);

  console.log("6. Pharmacy downloading PDF (Before Restart)...");
  const dlRes1 = await axiosPharmacy.get(pdfUrl.replace('/api', ''), { responseType: 'arraybuffer' });
  console.log(`   Success! Downloaded ${dlRes1.data.length} bytes.`);
  fs.writeFileSync('test_atm_consent_before.pdf', dlRes1.data);

  console.log("7. Forcing Cloud Run Restart...");
  execSync('gcloud run services update serviceapotheke-api --region=europe-west1 --update-env-vars FORCE_RESTART_TIMESTAMP=' + Date.now(), { stdio: 'inherit' });

  console.log("8. Pharmacy downloading PDF (After Restart)...");
  // Add small delay to ensure new instance is serving
  await new Promise(r => setTimeout(r, 10000));
  
  try {
    const dlRes2 = await axiosPharmacy.get(pdfUrl.replace('/api', ''), { responseType: 'arraybuffer' });
    console.log(`   SUCCESS! PDF survived restart. Downloaded ${dlRes2.data.length} bytes.`);
    fs.writeFileSync('test_atm_consent_after.pdf', dlRes2.data);
  } catch (err) {
    console.error("   FAILED: Could not download PDF after restart.", err.message);
  }
}

runTest().catch(console.error);
