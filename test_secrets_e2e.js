const axios = require('axios');

async function testAll() {
  try {
    console.log('--- 1. Testing JWT & DB (Register, Login, Dashboard) ---');
    console.log('Generating random email address with Mail.tm...');
    
    const domainRes = await axios.get('https://api.mail.tm/domains');
    const domain = domainRes.data['hydra:member'][0].domain;
    
    const email = 'secret_test_' + Date.now() + '@' + domain;
    const password = 'TestPassword123!';
    
    console.log(`Using email: ${email}`);
    
    await axios.post('https://api.mail.tm/accounts', {
      address: email,
      password: password
    });
    
    const tokenRes = await axios.post('https://api.mail.tm/token', {
      address: email,
      password: password
    });
    const mailToken = tokenRes.data.token;

    console.log('Registering user on ServiceApotheke...');
    await axios.post('https://api.serviceapotheke.tech/api/Pharmacist/register', {
      email: email,
      password: password,
      firstName: 'Test',
      lastName: 'Secrets',
      street: 'Ph',
      houseNumber: '1',
      postalCode: '12345',
      city: 'City'
    });
    console.log('User registered. Waiting for verification email...');

    let verificationCode = null;
    let seenMessages = new Set();
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 5000));
      const checkRes = await axios.get('https://api.mail.tm/messages', {
        headers: { Authorization: `Bearer ${mailToken}` }
      });
      
      if (checkRes.data['hydra:member'] && checkRes.data['hydra:member'].length > 0) {
        for(let msg of checkRes.data['hydra:member']) {
            if (!seenMessages.has(msg.id)) {
                const readRes = await axios.get(`https://api.mail.tm/messages/${msg.id}`, {
                  headers: { Authorization: `Bearer ${mailToken}` }
                });
                seenMessages.add(msg.id);
                const match = readRes.data.text.match(/\b\d{6}\b/);
                if (match) {
                    verificationCode = match[0];
                    console.log('Verification code received:', verificationCode, 'Subject:', msg.subject);
                    break;
                }
            }
        }
      }
      if (verificationCode) break;
      console.log(`Check ${i+1}: No verification email yet...`);
    }

    if (!verificationCode) throw new Error("Did not receive verification code.");

    console.log('Confirming email...');
    await axios.post('https://api.serviceapotheke.tech/api/Pharmacist/confirm-email', {
      email: email,
      token: verificationCode
    });
    console.log('Email confirmed.');

    console.log('Logging in...');
    const loginRes = await axios.post('https://api.serviceapotheke.tech/api/Pharmacist/login', {
      email: email,
      password: password
    });
    const apiJwt = loginRes.data.token;
    console.log('Logged in successfully. JWT received:', !!apiJwt);

    console.log('Fetching protected /api/Auth/me endpoint to verify JWT auth...');
    const meRes = await axios.get('https://api.serviceapotheke.tech/api/Auth/me', {
        headers: { Authorization: `Bearer ${apiJwt}` }
    });
    console.log('Auth check successful. User role:', meRes.data.role);

    console.log('\n--- 2. Testing SMTP (Forgot Password) ---');
    console.log('Requesting forgot password...');
    await axios.post('https://api.serviceapotheke.tech/api/Pharmacist/forgot-password', {
      email: email
    });
    console.log('Forgot password requested. Waiting for email...');

    let foundReset = false;
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 5000));
      const checkRes = await axios.get('https://api.mail.tm/messages', {
        headers: { Authorization: `Bearer ${mailToken}` }
      });
      
      if (checkRes.data['hydra:member'] && checkRes.data['hydra:member'].length > 0) {
        for(let msg of checkRes.data['hydra:member']) {
            if (!seenMessages.has(msg.id) && msg.subject.includes('Passwort')) {
                const readRes = await axios.get(`https://api.mail.tm/messages/${msg.id}`, {
                  headers: { Authorization: `Bearer ${mailToken}` }
                });
                console.log('SMTP Delivery Confirmed!');
                console.log('Subject:', readRes.data.subject);
                console.log('Body snippet:', readRes.data.text.substring(0, 100).replace(/\n/g, ' '));
                foundReset = true;
                break;
            }
        }
      }
      if (foundReset) break;
      console.log(`Check ${i+1}: No reset email yet...`);
    }
    if (!foundReset) console.log('Did not receive forgot password email within 60 seconds.');
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

testAll();
