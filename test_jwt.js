const crypto = require('crypto');
const secret = 'EIN_LANGER_GEHEIMER_SCHLUESSEL_MIT_MINDESTENS_32_ZEICHEN';
const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
const payload = Buffer.from(JSON.stringify({
  sub: '12345',
  email: 'test@test.com',
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Pharmacist",
  iss: 'ServiceApotheke.API',
  aud: 'ServiceApotheke.Clients',
  exp: Math.floor(Date.now() / 1000) + (60 * 60)
})).toString('base64url');
const signature = crypto.createHmac('sha256', secret).update(header + '.' + payload).digest('base64url');
const token = header + '.' + payload + '.' + signature;

const fetch = require('node-fetch');
async function testTimesheet() {
  const submitRes = await fetch('https://api.serviceapotheke.tech/api/Timesheet/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ jobApplicationId: 999999, actualStartDate: '2026-07-16T08:00:00Z', endTime: '2026-07-16T16:00:00Z', breakMinutes: 30 })
  });
  console.log('Status:', submitRes.status);
  console.log('Body:', await submitRes.text());
}
testTimesheet();
