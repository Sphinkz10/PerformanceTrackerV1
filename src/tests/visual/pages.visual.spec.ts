import { test, expect } from '@playwright/test';

/**
 * VISUAL REGRESSION TESTS - MAIN PAGES
 * 
 * Day 21: Visual testing for all main pages
 * 
 * Tests:
 * - Screenshot comparison across devices
 * - Layout consistency
 * - Responsive behavior
 * - Component rendering
 */

const pages = [
  { name: 'Dashboard', path: '/' },
  { name: 'Athletes', path: '/athletes' },
  { name: 'Calendar', path: '/calendar' },
  { name: 'DataOS', path: '/data-os' },
  { name: 'FormCenter', path: '/forms' },
  { name: 'Messages', path: '/messages' },
  { name: 'LiveCommand', path: '/live' },
  { name: 'Reports', path: '/reports' },
  { name: 'Lab', path: '/lab' },
  { name: 'Settings', path: '/settings' },
];

// Test each page on all devices
pages.forEach(({ name, path }) => {
  test.describe(`${name} Page`, () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to page
      await page.goto(path);
      
      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');
      
      // Wait for any animations to complete
      await page.waitForTimeout(500);
    });

    test(`should render correctly - full page`, async ({ page }) => {
      // Take full page screenshot
      await expect(page).toHaveScreenshot(`${name.toLowerCase()}-full.png`, {
        fullPage: true,
      });
    });

    test(`should render correctly - above fold`, async ({ page }) => {
      // Take viewport screenshot (above the fold)
      await expect(page).toHaveScreenshot(`${name.toLowerCase()}-viewport.png`);
    });

    test(`should have correct header`, async ({ page }) => {
      // Screenshot just the header
      const header = page.locator('header, [role="banner"]').first();
      if (await header.count() > 0) {
        await expect(header).toHaveScreenshot(`${name.toLowerCase()}-header.png`);
      }
    });

    test(`should have correct navigation`, async ({ page }) => {
      // Screenshot navigation (if visible)
      const nav = page.locator('nav, [role="navigation"]').first();
      if (await nav.count() > 0 && await nav.isVisible()) {
        await expect(nav).toHaveScreenshot(`${name.toLowerCase()}-nav.png`);
      }
    });

    test(`should have correct main content area`, async ({ page }) => {
      // Screenshot main content
      const main = page.locator('main, [role="main"]').first();
      if (await main.count() > 0) {
        await expect(main).toHaveScreenshot(`${name.toLowerCase()}-main.png`);
      }
    });
  });
});

// Specific component tests
test.describe('Critical Components', () => {
  test('Stat Cards on Dashboard', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const statCards = page.locator('[class*="stat"], [class*="kpi"]').first();
    if (await statCards.count() > 0) {
      await expect(statCards).toHaveScreenshot('stat-cards.png');
    }
  });

  test('Calendar Grid', async ({ page }) => {
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
    
    const calendarGrid = page.locator('[class*="calendar"], [role="grid"]').first();
    if (await calendarGrid.count() > 0) {
      await expect(calendarGrid).toHaveScreenshot('calendar-grid.png');
    }
  });

  test('Athletes Grid', async ({ page }) => {
    await page.goto('/athletes');
    await page.waitForLoadState('networkidle');
    
    const athletesGrid = page.locator('[class*="grid"]').first();
    if (await athletesGrid.count() > 0) {
      await expect(athletesGrid).toHaveScreenshot('athletes-grid.png');
    }
  });

  test('DataOS Library', async ({ page }) => {
    await page.goto('/data-os');
    await page.waitForLoadState('networkidle');
    
    // Wait for library tab to be active
    await page.waitForTimeout(500);
    
    const library = page.locator('main').first();
    await expect(library).toHaveScreenshot('dataos-library.png');
  });

  test('Form Builder', async ({ page }) => {
    await page.goto('/forms');
    await page.waitForLoadState('networkidle');
    
    const formArea = page.locator('main').first();
    await expect(formArea).toHaveScreenshot('form-center.png');
  });
});

// Interaction states
test.describe('Interactive States', () => {
  test('Button hover states', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const button = page.locator('button').first();
    if (await button.count() > 0) {
      // Normal state
      await expect(button).toHaveScreenshot('button-normal.png');
      
      // Hover state
      await button.hover();
      await page.waitForTimeout(200);
      await expect(button).toHaveScreenshot('button-hover.png');
    }
  });

  test('Input focus states', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const input = page.locator('input[type="text"], input[type="search"]').first();
    if (await input.count() > 0) {
      // Normal state
      await expect(input).toHaveScreenshot('input-normal.png');
      
      // Focus state
      await input.focus();
      await page.waitForTimeout(200);
      await expect(input).toHaveScreenshot('input-focus.png');
    }
  });

  test('Tab active states', async ({ page }) => {
    await page.goto('/data-os');
    await page.waitForLoadState('networkidle');
    
    const tabBar = page.locator('[role="tablist"]').first();
    if (await tabBar.count() > 0) {
      await expect(tabBar).toHaveScreenshot('tabs-state.png');
    }
  });
});

// Dark mode (if applicable)
test.describe('Color Schemes', () => {
  test('Light mode appearance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('light-mode.png');
  });

  // Uncomment if dark mode is implemented
  // test('Dark mode appearance', async ({ page }) => {
  //   await page.emulateMedia({ colorScheme: 'dark' });
  //   await page.goto('/');
  //   await page.waitForLoadState('networkidle');
  //   
  //   await expect(page).toHaveScreenshot('dark-mode.png');
  // });
});
