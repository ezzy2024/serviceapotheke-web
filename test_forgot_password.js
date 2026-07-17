const axios = require('axios');

async function testEmail() {
  try {
    console.log('Generating random email address with Mail.tm...');
    
    // Create an account on Mail.tm
    const domainRes = await axios.get('https://api.mail.tm/domains');
    const domain = domainRes.data['hydra:member'][0].domain;
    
    const email = 'testuser_' + Date.now() + '@' + domain;
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
    const token = tokenRes.data.token;

    console.log('Registering user on ServiceApotheke...');
    await axios.post('https://api.serviceapotheke.tech/api/Pharmacist/register', {
      email: email,
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User',
      street: 'Ph',
      houseNumber: '1',
      postalCode: '12345',
      city: 'City'
    });
    console.log('User registered.');

    console.log('Requesting forgot password...');
    await axios.post('https://api.serviceapotheke.tech/api/Pharmacist/forgot-password', {
      email: email
    });
    console.log('Forgot password requested.');

    console.log('Waiting for email (checking every 5 seconds)...');
    for (let i = 0; i < 12; i++) {
      await new Promise(r => setTimeout(r, 5000));
      const checkRes = await axios.get('https://api.mail.tm/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (checkRes.data['hydra:member'] && checkRes.data['hydra:member'].length > 0) {
        console.log('Email received!');
        for(let msg of checkRes.data['hydra:member']) {
            if(msg.subject.includes('Passwort')) {
                const readRes = await axios.get(`https://api.mail.tm/messages/${msg.id}`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Subject:', readRes.data.subject);
                console.log('Body snippet:', readRes.data.text.substring(0, 200));
                return;
            }
        }
      }
      console.log(`Check ${i+1}: No reset email yet...`);
    }
    console.log('Did not receive email within 60 seconds.');
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

testEmail();
