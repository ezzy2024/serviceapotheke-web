const { chromium } = require('playwright');

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const apiRequests = [];

  // Listen to network requests
  page.on('request', request => {
    const url = request.url();
    // We only care about XHR/fetch requests to our API
    if (url.includes('/api/Auth/') || url.includes('/Pharmacy/register') || url.includes('serviceapotheke-api')) {
      apiRequests.push(url);
      console.log(`[NETWORK] Captured API Request: ${url}`);
    } else if (url.includes('localhost')) {
      apiRequests.push(url);
      console.log(`[NETWORK ERROR] Captured Localhost Request: ${url}`);
    }
  });

  console.log("Navigating to https://serviceapotheke.tech/register/pharmacy ...");
  await page.goto('https://serviceapotheke.tech/register/pharmacy', { waitUntil: 'networkidle' });
  
  // Wait a few seconds to let any startup API calls finish
  await page.waitForTimeout(5000);

  console.log("\n--- Verification Results ---");
  const hasLocalhost = apiRequests.some(url => url.includes('localhost'));
  const hasProdApi = apiRequests.some(url => url.includes('serviceapotheke-api'));

  if (hasLocalhost) {
    console.error("❌ FAILED: Found requests pointing to localhost! The regression is still present.");
  } else if (hasProdApi) {
    console.log("✅ SUCCESS: API requests are correctly pointing to the production API domain.");
  } else {
    console.log("⚠️ WARNING: Could not capture any API requests matching known patterns. This might mean the page didn't make any startup requests.");
    console.log("All captured relevant requests:", apiRequests);
  }

  await browser.close();
})();
