const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Login first (since /luna-dashboard might be protected)
  await page.goto('http://localhost:3000/login-v2');

  // Try directly going to the studio just in case it's a direct route or isolated
  await page.goto('http://localhost:3000/luna-design-studio');

  // Wait a bit
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'luna_dnd_test.png', fullPage: true });
  await browser.close();
})();
