const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport for desktop
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Take a screenshot of the /register page for baseline comparison
  console.log('Navigating to /register...');
  await page.goto('http://localhost:3001/register', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'C:\\Users\\ezzel\\.gemini\\antigravity\\brain\\b0be1aab-3321-4ff6-8f1a-b1af47672daf\\register_baseline.png' });
  console.log('Saved register_baseline.png');

  // 2. Navigate to the redesigned /dashboard/pharmacist page
  console.log('Navigating to /dashboard/pharmacist...');
  await page.goto('http://localhost:3001/dashboard/pharmacist', { waitUntil: 'networkidle0' });
  
  // Verify Merken button is gone
  const bodyText = await page.evaluate(() => document.body.innerText);
  if (bodyText.includes('Merken')) {
    console.error('FAIL: "Merken" button was still found on the page!');
  } else {
    console.log('PASS: "Merken" button successfully removed.');
  }

  // Initial card count
  const initialCards = await page.evaluate(() => document.querySelectorAll('button').length); // Just a rough proxy, or count 'VAKANZEN'
  
  const textCount = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('strong')).find(e => e.textContent.includes('VAKANZEN'));
    return el ? el.textContent : 'Not found';
  });
  console.log('Initial shift count text:', textCount);

  // Take screenshot of the new Schicht-Radar design
  await page.screenshot({ path: 'C:\\Users\\ezzel\\.gemini\\antigravity\\brain\\b0be1aab-3321-4ff6-8f1a-b1af47672daf\\schicht_radar_redesign.png', fullPage: true });
  console.log('Saved schicht_radar_redesign.png');

  // 3. Apply a filter and verify the list shrinks
  console.log('Clicking a filter...');
  // Find the 'Ganztags (8-10h)' checkbox label and click it
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label'));
    const target = labels.find(l => l.innerText.includes('Ganztags'));
    if (target) target.click();
  });
  
  // Wait for react state update
  await new Promise(r => setTimeout(r, 1000));
  
  const filteredTextCount = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('strong')).find(e => e.textContent.includes('VAKANZEN'));
    return el ? el.textContent : 'Not found';
  });
  console.log('Filtered shift count text:', filteredTextCount);
  
  if (textCount !== filteredTextCount) {
    console.log('PASS: Applying the filter successfully shrunk the list.');
  } else {
    console.log('FAIL: Filter did not change the rendered card count.');
  }

  await browser.close();
})();
