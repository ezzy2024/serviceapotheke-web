const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1024 }
  });
  const page = await context.newPage();

  console.log("Logging in...");
  await page.goto('https://serviceapotheke.tech/login');
  await page.click('button:has-text("Apotheke")');
  await page.fill('input[name="email"]', 'apotheke@example.com');
  await page.fill('input[name="password"]', 'apotheke123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  await page.goto('https://serviceapotheke.tech/dashboard/pharmacy');
  await page.waitForTimeout(5000); // Wait longer for the news to load via API
  await page.waitForTimeout(3000); // Wait for news to load

  console.log("Taking screenshot of the pharmacy dashboard...");
  await page.screenshot({ path: 'C:\\Users\\ezzel\\.gemini\\antigravity\\brain\\b0be1aab-3321-4ff6-8f1a-b1af47672daf\\live_screenshot_news_widget.png' });

  await browser.close();
  console.log("Done.");
})();
