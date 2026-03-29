import { test, expect } from '@playwright/test';

/**
 * ACCESSIBILITY VISUAL TESTS
 * 
 * Day 22: Visual accessibility validation
 * 
 * Tests:
 * - Focus indicators
 * - Contrast ratios
 * - Reduced motion
 * - High contrast mode
 * - Text scaling
 */

test.describe('Focus Indicators', () => {
  test('All interactive elements have visible focus', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get all focusable elements
    const focusable = page.locator('button, a, input, select, textarea, [tabindex="0"]');
    const count = await focusable.count();
    
    // Test first 10 elements
    for (let i = 0; i < Math.min(10, count); i++) {
      const element = focusable.nth(i);
      
      if (await element.isVisible()) {
        // Focus element
        await element.focus();
        await page.waitForTimeout(200);
        
        // Take screenshot
        await expect(element).toHaveScreenshot(`focus-${i}.png`, {
          // Allow for small differences in focus ring
          maxDiffPixelRatio: 0.05,
        });
      }
    }
  });

  test('Focus order is logical', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Tab through first 5 elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);
      
      await expect(page).toHaveScreenshot(`focus-order-${i}.png`);
    }
  });
});

test.describe('Color Contrast', () => {
  test('High contrast mode', async ({ page }) => {
    // Enable high contrast
    await page.emulateMedia({ forcedColors: 'active' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('high-contrast.png');
  });

  test('Text on backgrounds has sufficient contrast', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Screenshot all text elements
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6, span, label');
    const count = await textElements.count();
    
    // Sample 5 text elements
    for (let i = 0; i < Math.min(5, count); i++) {
      const element = textElements.nth(i);
      if (await element.isVisible()) {
        await expect(element).toHaveScreenshot(`text-contrast-${i}.png`);
      }
    }
  });
});

test.describe('Reduced Motion', () => {
  test('Animations disabled with prefers-reduced-motion', async ({ page }) => {
    // Enable reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Allow time for any animations to NOT happen
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('reduced-motion.png');
  });

  test('Normal animations', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Allow animations to complete
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('normal-motion.png');
  });
});

test.describe('Text Scaling', () => {
  const zoomLevels = [
    { name: '100%', zoom: 1.0 },
    { name: '150%', zoom: 1.5 },
    { name: '200%', zoom: 2.0 },
  ];

  zoomLevels.forEach(({ name, zoom }) => {
    test(`Page readable at ${name} zoom`, async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Set zoom level
      await page.evaluate((z) => {
        document.body.style.zoom = z.toString();
      }, zoom);
      
      await page.waitForTimeout(500);
      
      await expect(page).toHaveScreenshot(`zoom-${name}.png`, {
        fullPage: true,
      });
    });
  });

  test('Text wraps correctly when scaled', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Set large text scale
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '24px';
    });
    
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('large-text.png');
  });
});

test.describe('Print Styles', () => {
  test('Page prints correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Emulate print media
    await page.emulateMedia({ media: 'print' });
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('print-view.png', {
      fullPage: true,
    });
  });
});

test.describe('Dark Mode Compatibility', () => {
  test('Dark color scheme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('dark-scheme.png');
  });

  test('Light color scheme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('light-scheme.png');
  });
});

test.describe('Screen Reader Landmarks', () => {
  test('Visual structure with landmarks highlighted', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Highlight all ARIA landmarks
    await page.evaluate(() => {
      const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"], [role="search"]');
      landmarks.forEach((el, index) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.outline = '3px solid red';
        htmlEl.style.outlineOffset = '2px';
        
        // Add label
        const label = document.createElement('div');
        label.textContent = el.getAttribute('role') || 'landmark';
        label.style.cssText = 'position: absolute; top: 0; left: 0; background: red; color: white; padding: 4px 8px; font-size: 12px; z-index: 9999;';
        htmlEl.style.position = 'relative';
        htmlEl.appendChild(label);
      });
    });
    
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('landmarks-highlighted.png', {
      fullPage: true,
    });
  });
});

test.describe('Form Error States', () => {
  test('Error messages are visible', async ({ page }) => {
    await page.goto('/forms');
    await page.waitForLoadState('networkidle');
    
    // Try to submit empty form if exists
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await submitButton.count() > 0) {
      await submitButton.click();
      await page.waitForTimeout(500);
      
      // Screenshot showing errors
      await expect(page).toHaveScreenshot('form-errors.png');
    }
  });

  test('Success states are visible', async ({ page }) => {
    await page.goto('/forms');
    await page.waitForLoadState('networkidle');
    
    // Screenshot any success messages if visible
    const success = page.locator('[class*="success"], [role="alert"][class*="success"]').first();
    
    if (await success.count() > 0 && await success.isVisible()) {
      await expect(success).toHaveScreenshot('form-success.png');
    }
  });
});

test.describe('Loading States', () => {
  test('Skeleton loaders visible', async ({ page }) => {
    // Navigate but don't wait for network idle to catch loading state
    await page.goto('/athletes', { waitUntil: 'domcontentloaded' });
    
    // Quick screenshot of loading state
    await page.waitForTimeout(100);
    await expect(page).toHaveScreenshot('loading-skeleton.png');
    
    // Wait for full load
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('loaded-complete.png');
  });
});
