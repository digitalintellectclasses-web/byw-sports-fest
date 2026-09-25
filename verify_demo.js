const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log("Navigating to https://web-app-psi-self.vercel.app ...");
  await page.goto('https://web-app-psi-self.vercel.app');
  
  // Wait for the modal or button
  console.log("Waiting for Demo button...");
  await page.waitForSelector('text=Explore Demo Version', { timeout: 10000 });
  
  console.log("Clicking Demo button...");
  await page.click('text=Explore Demo Version');
  
  console.log("Waiting for reload/navigation...");
  // Wait for the button to disappear or page to load
  await page.waitForTimeout(3000);
  
  console.log("Navigating to Standings page to verify data...");
  await page.goto('https://web-app-psi-self.vercel.app/standings');
  
  // Wait for rows to load in standings table
  await page.waitForSelector('table tbody tr', { timeout: 10000 });
  
  console.log("Taking screenshot...");
  await page.screenshot({ path: 'demo_verification.png', fullPage: true });
  
  console.log("Done.");
  await browser.close();
})().catch(err => {
  console.error("ERROR:", err);
  process.exit(1);
});
