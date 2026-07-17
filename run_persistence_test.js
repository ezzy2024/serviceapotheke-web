const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { Client } = require('pg');
const crypto = require('crypto');
const { Storage } = require('@google-cloud/storage');
const { execSync } = require('child_process');

async function run() {
    console.log("1. Creating dummy PDF...");
    const originalText = 'This is a PERSISTENCE test PDF document for B2B registration.';
    fs.writeFileSync('test_doc.pdf', originalText);

    const email = 'e2e_test_persist_' + Date.now() + '@10mail.org';

    const form = new FormData();
    form.append('Name', 'E2E Persist Apo');
    form.append('Street', 'Teststr. 1');
    form.append('PLZ', '12345');
    form.append('City', 'TestCity');
    form.append('Phone', '0123456789');
    form.append('Email', email);
    form.append('Password', 'StrongPass123!');
    form.append('DocumentFile', fs.createReadStream('test_doc.pdf'));

    console.log("2. Uploading B2B Registration to Cloud Run...");
    let res;
    try {
        res = await axios.post('https://serviceapotheke-api-830781040278.europe-west1.run.app/api/Pharmacy/register', form, {
            headers: form.getHeaders()
        });
        console.log("   Registration success.");
    } catch (e) {
        console.error("Registration failed:", e.response ? e.response.data : e.message);
        return;
    }

    console.log("3. Querying DB for locator...");
    const client = new Client({
        connectionString: 'postgres://appuser:ServiceApotheke2026Strong@127.0.0.1:5432/serviceapotheke-db',
    });
    await client.connect();
    const result = await client.query('SELECT "FreelanceContractDocumentPath" FROM "Pharmacies" WHERE "Email" = $1', [email]);
    await client.end();

    const locator = result.rows[0].FreelanceContractDocumentPath;
    console.log("   Found locator:", locator);

    console.log("4. Restarting Cloud Run to force ephemeral wipe...");
    execSync('gcloud run services update serviceapotheke-api --region europe-west1 --update-env-vars=FORCE_RESTART=' + Date.now(), { stdio: 'inherit' });
    console.log("   Restart complete.");

    console.log("5. Downloading from GCS after restart...");
    const storage = new Storage();
    const bucket = storage.bucket('serviceapotheke-documents-prod');
    const file = bucket.file(locator);
    const [fileBytes] = await file.download();

    console.log("6. Decrypting manually...");
    const keyBase64 = fs.readFileSync('../dms.txt', 'utf8').trim();
    const encryptionKey = Buffer.from(keyBase64, 'base64');

    const nonceSize = 12;
    const tagSize = 16;
    const nonce = fileBytes.subarray(0, nonceSize);
    const tag = fileBytes.subarray(nonceSize, nonceSize + tagSize);
    const ciphertext = fileBytes.subarray(nonceSize + tagSize);

    const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey, nonce);
    decipher.setAuthTag(tag);

    let decrypted;
    try {
        decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
        const decText = decrypted.toString('utf8');
        console.log("   DECRYPTED TEXT:", decText);
        if (decText === originalText) {
            console.log("   ✅ PERSISTENCE VALIDATED: Matches exactly across restart!");
        } else {
            console.log("   ❌ TEXT MISMATCH");
        }
    } catch (e) {
        console.log("   ❌ DECRYPTION FAILED:", e.message);
    }
}

run().catch(console.error);
