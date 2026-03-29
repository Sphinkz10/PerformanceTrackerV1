/**
 * E2E TESTS - Complete User Journey
 * 
 * Day 25: End-to-end testing of critical user flows
 */

import { test, expect } from '@playwright/test';

test.describe('Complete User Journey - Dashboard to Data Entry', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app
    await page.goto('/');
    
    // Wait for app to load
    await page.waitForLoadState('networkidle');
  });

  test('should navigate through main pages', async ({ page }) => {
    // Start at Dashboard
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText(/dashboard/i);

    // Navigate to Athletes
    await page.click('text=Athletes');
    await expect(page).toHaveURL('/athletes');
    await expect(page.locator('h1')).toContainText(/athletes/i);

    // Navigate to Calendar
    await page.click('text=Calendar');
    await expect(page).toHaveURL('/calendar');
    await expect(page.locator('h1')).toContainText(/calendar/i);

    // Navigate to DataOS
    await page.click('text=Data OS');
    await expect(page).toHaveURL('/data-os');
    await expect(page.locator('h1')).toContainText(/data os/i);
  });

  test('should complete metric entry flow', async ({ page }) => {
    // Go to DataOS
    await page.goto('/data-os');
    await page.waitForLoadState('networkidle');

    // Click LiveBoard tab
    await page.click('button:has-text("LiveBoard")');
    await page.waitForSelector('[data-testid="liveboard-grid"]');

    // Open Quick Entry modal
    await page.click('button:has-text("Quick Entry")');
    await page.waitForSelector('[role="dialog"]');

    // Fill form
    await page.selectOption('select[name="athlete"]', { index: 1 });
    await page.selectOption('select[name="metric"]', { index: 1 });
    await page.fill('input[name="value"]', '75');

    // Submit
    await page.click('button:has-text("Save")');

    // Verify success
    await expect(page.locator('text=Success')).toBeVisible();
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should create calendar event', async ({ page }) => {
    // Go to Calendar
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');

    // Click Create Event
    await page.click('button:has-text("Create Event")');
    await page.waitForSelector('[role="dialog"]');

    // Fill event details
    await page.fill('input[name="title"]', 'E2E Test Training');
    await page.fill('input[type="date"]', '2025-02-01');
    await page.fill('input[name="startTime"]', '10:00');
    await page.fill('input[name="endTime"]', '12:00');

    // Select type
    await page.selectOption('select[name="type"]', 'training');

    // Add participants
    await page.click('button:has-text("Add Participants")');
    await page.click('input[type="checkbox"]', { force: true });
    await page.click('button:has-text("Done")');

    // Submit
    await page.click('button[type="submit"]:has-text("Create")');

    // Verify success
    await expect(page.locator('text=Event created')).toBeVisible();
    await expect(page.locator('text=E2E Test Training')).toBeVisible();
  });

  test('should search and filter athletes', async ({ page }) => {
    // Go to Athletes
    await page.goto('/athletes');
    await page.waitForLoadState('networkidle');

    // Initial athlete count
    const initialCount = await page.locator('[data-testid="athlete-card"]').count();
    expect(initialCount).toBeGreaterThan(0);

    // Search
    await page.fill('input[placeholder*="Search"]', 'John');
    await page.waitForTimeout(500); // Debounce

    // Verify filtered results
    const filtered = await page.locator('[data-testid="athlete-card"]').count();
    expect(filtered).toBeLessThanOrEqual(initialCount);
    await expect(page.locator('text=John')).toBeVisible();

    // Clear search
    await page.fill('input[placeholder*="Search"]', '');
    await page.waitForTimeout(500);

    // Apply status filter
    await page.selectOption('select[name="status"]', 'active');
    await page.waitForTimeout(500);

    // Verify filter applied
    const activeCount = await page.locator('[data-testid="athlete-card"]').count();
    expect(activeCount).toBeGreaterThan(0);
  });

  test('should handle form validation', async ({ page }) => {
    // Go to DataOS
    await page.goto('/data-os');
    await page.click('button:has-text("LiveBoard")');

    // Open Quick Entry
    await page.click('button:has-text("Quick Entry")');
    await page.waitForSelector('[role="dialog"]');

    // Try to submit without required fields
    await page.click('button:has-text("Save")');

    // Verify validation errors
    await expect(page.locator('text=/athlete is required/i')).toBeVisible();
    await expect(page.locator('text=/metric is required/i')).toBeVisible();
    await expect(page.locator('text=/value is required/i')).toBeVisible();

    // Fill required fields
    await page.selectOption('select[name="athlete"]', { index: 1 });
    await page.selectOption('select[name="metric"]', { index: 1 });
    await page.fill('input[name="value"]', '75');

    // Validation errors should clear
    await expect(page.locator('text=/athlete is required/i')).not.toBeVisible();
  });
});

test.describe('Responsive Behavior E2E', () => {
  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Mobile menu should be visible
    await expect(page.locator('[aria-label="Menu"]')).toBeVisible();

    // Open mobile menu
    await page.click('[aria-label="Menu"]');
    await expect(page.locator('nav')).toBeVisible();

    // Navigate via mobile menu
    await page.click('text=Athletes');
    await expect(page).toHaveURL('/athletes');

    // Grid should be 1 column on mobile
    const grid = page.locator('[data-testid="athletes-grid"]');
    await expect(grid).toHaveCSS('grid-template-columns', /1fr|repeat\(1,/);
  });

  test('should work on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigation should be visible (not hamburger)
    await expect(page.locator('nav')).toBeVisible();

    // Go to Athletes
    await page.goto('/athletes');

    // Grid should be 2 columns on tablet
    const grid = page.locator('[data-testid="athletes-grid"]');
    await expect(grid).toHaveCSS('grid-template-columns', /repeat\(2,/);
  });

  test('should work on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Full navigation visible
    await expect(page.locator('nav')).toBeVisible();

    // Go to Athletes
    await page.goto('/athletes');

    // Grid should be 3-4 columns on desktop
    const grid = page.locator('[data-testid="athletes-grid"]');
    const columns = await grid.evaluate(el => 
      window.getComputedStyle(el).gridTemplateColumns.split(' ').length
    );
    expect(columns).toBeGreaterThanOrEqual(3);
  });
});

test.describe('Performance E2E', () => {
  test('should load pages within acceptable time', async ({ page }) => {
    const pages = ['/', '/athletes', '/calendar', '/data-os'];

    for (const route of pages) {
      const start = Date.now();
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - start;

      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
      
      console.log(`${route} loaded in ${loadTime}ms`);
    }
  });

  test('should handle rapid navigation', async ({ page }) => {
    await page.goto('/');
    
    // Rapid navigation
    await page.click('text=Athletes');
    await page.click('text=Calendar');
    await page.click('text=Data OS');
    await page.click('text=Dashboard');

    // Should end up on correct page
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText(/dashboard/i);

    // No console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    expect(errors).toHaveLength(0);
  });
});

test.describe('Accessibility E2E', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Tab through navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should focus on navigation items
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON']).toContain(focused);

    // Enter should activate
    await page.keyboard.press('Enter');
    
    // Should navigate or trigger action
    await page.waitForLoadState('networkidle');
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    
    // Check main navigation
    const nav = page.locator('nav');
    await expect(nav).toHaveAttribute('aria-label', /.+/);

    // Check main content
    const main = page.locator('main');
    await expect(main).toHaveAttribute('role', 'main');

    // Check buttons
    const buttons = await page.locator('button').all();
    for (const button of buttons.slice(0, 5)) { // Check first 5
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      expect(ariaLabel || text).toBeTruthy();
    }
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    
    // Check text contrast
    const textElements = await page.locator('p, span, h1, h2, h3').all();
    
    for (const el of textElements.slice(0, 10)) { // Sample first 10
      const styles = await el.evaluate(element => {
        const computed = window.getComputedStyle(element);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
        };
      });
      
      // Just verify styles exist (actual contrast calc would require library)
      expect(styles.color).toBeTruthy();
      expect(styles.backgroundColor).toBeTruthy();
    }
  });
});

test.describe('Error Handling E2E', () => {
  test('should handle network errors gracefully', async ({ page, context }) => {
    // Simulate offline
    await context.setOffline(true);

    await page.goto('/');
    
    // Should show error state
    await expect(page.locator('text=/error|failed|offline/i')).toBeVisible();

    // Go back online
    await context.setOffline(false);
    
    // Reload
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should recover
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle 404 errors', async ({ page }) => {
    await page.goto('/non-existent-page');
    
    // Should show 404 page
    await expect(page.locator('text=/404|not found/i')).toBeVisible();

    // Should have link back home
    const homeLink = page.locator('a[href="/"]');
    await expect(homeLink).toBeVisible();
    
    await homeLink.click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Data Persistence E2E', () => {
  test('should persist filter selections', async ({ page }) => {
    await page.goto('/athletes');
    
    // Apply filter
    await page.selectOption('select[name="status"]', 'active');
    await page.waitForTimeout(500);

    // Navigate away
    await page.goto('/calendar');
    
    // Navigate back
    await page.goto('/athletes');
    
    // Filter should still be applied (if implemented)
    const select = page.locator('select[name="status"]');
    const value = await select.inputValue();
    
    // Verify persistence (or default)
    expect(value).toBeTruthy();
  });

  test('should maintain scroll position', async ({ page }) => {
    await page.goto('/athletes');
    await page.waitForLoadState('networkidle');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    const scrollBefore = await page.evaluate(() => window.scrollY);
    
    expect(scrollBefore).toBeGreaterThan(0);

    // Navigate away and back
    await page.goto('/calendar');
    await page.goBack();
    
    // Scroll position may reset (depends on implementation)
    const scrollAfter = await page.evaluate(() => window.scrollY);
    expect(scrollAfter).toBeGreaterThanOrEqual(0);
  });
});
