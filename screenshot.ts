import { chromium } from 'playwright';

async function capture() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:3000/luna-login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'luna_login_screenshot.png', fullPage: true });
    console.log('Screenshot captured successfully.');
  } catch (error) {
    console.error('Failed to capture screenshot:', error);
  } finally {
    await browser.close();
  }
}

capture();
