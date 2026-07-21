const { chromium } = require('playwright');

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const apiRequests = [];
  let corsErrorEncountered = false;
  let successfulRegistration = false;

  // Listen to network requests
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/Pharmacy/register')) {
      console.log(`[NETWORK] Captured API Request: ${url} [${request.method()}]`);
    }
  });

  page.on('response', response => {
    const url = response.url();
    if (url.includes('/Pharmacy/register')) {
      console.log(`[NETWORK] Response for ${url} -> Status: ${response.status()}`);
      if (response.status() === 200 || response.status() === 201) {
        successfulRegistration = true;
      }
    }
  });

  page.on('requestfailed', request => {
    const url = request.url();
    if (url.includes('/Pharmacy/register')) {
      console.error(`[NETWORK ERROR] Request failed: ${url} - Error text: ${request.failure()?.errorText}`);
      if (request.failure()?.errorText?.includes('CORS') || request.failure()?.errorText?.includes('net::ERR_FAILED')) {
        corsErrorEncountered = true;
      }
    }
  });

  console.log("Navigating to https://serviceapotheke.tech/register/pharmacy ...");
  await page.goto('https://serviceapotheke.tech/register/pharmacy', { waitUntil: 'networkidle' });
  
  // Fill the registration form
  console.log("Filling out the registration form...");
  
  // Try to find the common fields - adjusting based on likely names for a pharmacy registration
  try {
    const uniqueEmail = `ezzeldinemad90+pharmacy_${Date.now()}@gmail.com`;
    
    // Step 1: Account Data
    await page.fill('input[name="pharmacyName"]', 'Apotheke am Markt');
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', 'StrongPassw0rd!');
    await page.fill('input[name="confirmPassword"]', 'StrongPassw0rd!');
    await page.fill('input[name="street"]', 'Hauptstr.');
    await page.fill('input[name="houseNumber"]', '1');
    await page.fill('input[name="postalCode"]', '10115');
    await page.fill('input[name="city"]', 'Berlin');
    
    console.log("Clicking Weiter to Step 2...");
    await page.click('button:has-text("Weiter")');
    
    // Step 2: Infrastructure
    await page.waitForTimeout(500); // small wait for state to update
    await page.fill('input[name="licenseNumber"]', '123456');
    
    console.log("Clicking Weiter to Step 3...");
    await page.click('button:has-text("Weiter")');
    
    // Step 3: Verification Document
    await page.waitForTimeout(500);
    // Note: We bypass file upload strictly by just trying to submit, which might trigger validation, but should hit the API.
    // Wait, if it requires a file, it might not submit!
    // Let's create a dummy file and upload it.
    const fs = require('fs');
    fs.writeFileSync('dummy.pdf', 'dummy content');
    
    // Find the file input within the FileUpload component
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
       await fileInput.setInputFiles('dummy.pdf');
    }

    console.log(`Submitting registration with email: ${uniqueEmail}`);
    await page.click('button:has-text("Registrierung abschließen")');
    
    // Wait for network response
    await page.waitForTimeout(5000);
    fs.unlinkSync('dummy.pdf');
    
  } catch (e) {
    console.error("Error interacting with the form:", e.message);
  }

  console.log("\n--- Verification Results ---");
  if (corsErrorEncountered) {
    console.error("❌ FAILED: A CORS error or network failure was encountered during registration.");
  } else if (successfulRegistration) {
    console.log("✅ SUCCESS: Registration request succeeded with a 200/201 response. CORS is fixed!");
  } else {
    console.log("⚠️ WARNING: Registration did not explicitly succeed, but no CORS error was caught. Check form selectors.");
  }

  await browser.close();
})();
