import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(3000); // Allow time for 3D assets

  // Measure scroll
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log('Scroll Height:', scrollHeight);

  // Take a shot at 25% scroll (First Project Card)
  await page.mouse.wheel(0, 2000);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verification/scroll_25.png' });

  // Take a shot at 50% scroll (Middle Project Card)
  await page.mouse.wheel(0, 4000);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verification/scroll_50.png' });

  // Take a shot at the bottom (Contact section)
  await page.mouse.wheel(0, 8000);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verification/scroll_100.png' });

  await browser.close();
})();
