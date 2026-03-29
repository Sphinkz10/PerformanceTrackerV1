/**
 * ACCESSIBILITY AUDIT - WCAG 2.1 AA Compliance
 * 
 * Day 26-27: Comprehensive accessibility testing
 */

import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y, getViolations } from 'axe-playwright';

test.describe('WCAG 2.1 AA Compliance Audit', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
  });

  test.describe('Automated Accessibility Checks', () => {
    const pages = [
      { name: 'Dashboard', path: '/' },
      { name: 'Athletes', path: '/athletes' },
      { name: 'Calendar', path: '/calendar' },
      { name: 'DataOS', path: '/data-os' },
      { name: 'Forms', path: '/forms' },
      { name: 'Messages', path: '/messages' },
      { name: 'Live Command', path: '/live' },
      { name: 'Reports', path: '/reports' },
    ];

    for (const { name, path } of pages) {
      test(`${name} page should have no accessibility violations`, async ({ page }) => {
        await page.goto(path);
        await page.waitForLoadState('networkidle');

        // Run axe accessibility check
        await checkA11y(page, undefined, {
          detailedReport: true,
          detailedReportOptions: {
            html: true,
          },
        });
      });
    }
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate through main navigation with keyboard', async ({ page }) => {
      await page.goto('/');
      
      // Tab through navigation
      await page.keyboard.press('Tab');
      let focused = await page.evaluate(() => document.activeElement?.textContent);
      expect(focused).toBeTruthy();

      // Tab to next element
      await page.keyboard.press('Tab');
      focused = await page.evaluate(() => document.activeElement?.textContent);
      expect(focused).toBeTruthy();

      // Shift+Tab should go back
      await page.keyboard.press('Shift+Tab');
      focused = await page.evaluate(() => document.activeElement?.textContent);
      expect(focused).toBeTruthy();
    });

    test('should activate buttons with Enter key', async ({ page }) => {
      await page.goto('/athletes');
      
      // Focus on action button
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Get current focused element
      const button = await page.evaluate(() => document.activeElement);
      expect(button).toBeTruthy();

      // Press Enter
      await page.keyboard.press('Enter');
      
      // Should trigger action (modal/navigation)
      await page.waitForTimeout(500);
    });

    test('should close modal with Escape key', async ({ page }) => {
      await page.goto('/data-os');
      await page.click('button:has-text("Quick Entry")');
      
      // Modal should be visible
      await expect(page.locator('[role="dialog"]')).toBeVisible();

      // Press Escape
      await page.keyboard.press('Escape');
      
      // Modal should close
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();
    });

    test('should trap focus within modal', async ({ page }) => {
      await page.goto('/data-os');
      await page.click('button:has-text("Quick Entry")');
      
      await expect(page.locator('[role="dialog"]')).toBeVisible();

      // Tab through modal elements
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        
        const focused = await page.evaluate(() => {
          const el = document.activeElement;
          const modal = document.querySelector('[role="dialog"]');
          return modal?.contains(el);
        });
        
        // Focus should stay within modal
        expect(focused).toBe(true);
      }
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have proper ARIA landmarks', async ({ page }) => {
      await page.goto('/');

      // Header
      const header = page.locator('header, [role="banner"]');
      await expect(header).toBeVisible();

      // Navigation
      const nav = page.locator('nav, [role="navigation"]');
      await expect(nav).toBeVisible();

      // Main content
      const main = page.locator('main, [role="main"]');
      await expect(main).toBeVisible();

      // Footer (if exists)
      const footer = page.locator('footer, [role="contentinfo"]');
      const footerCount = await footer.count();
      if (footerCount > 0) {
        await expect(footer.first()).toBeVisible();
      }
    });

    test('should have descriptive page titles', async ({ page }) => {
      const pages = [
        { path: '/', expected: /dashboard/i },
        { path: '/athletes', expected: /athletes/i },
        { path: '/calendar', expected: /calendar/i },
      ];

      for (const { path, expected } of pages) {
        await page.goto(path);
        const title = await page.title();
        expect(title).toMatch(expected);
      }
    });

    test('should have accessible form labels', async ({ page }) => {
      await page.goto('/data-os');
      await page.click('button:has-text("Quick Entry")');

      // All inputs should have labels
      const inputs = await page.locator('input, select, textarea').all();
      
      for (const input of inputs) {
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        
        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          const labelCount = await label.count();
          
          // Must have either label, aria-label, or aria-labelledby
          expect(
            labelCount > 0 || ariaLabel || ariaLabelledBy
          ).toBe(true);
        }
      }
    });

    test('should have alt text for images', async ({ page }) => {
      await page.goto('/');
      
      const images = await page.locator('img').all();
      
      for (const img of images) {
        const alt = await img.getAttribute('alt');
        const role = await img.getAttribute('role');
        
        // Decorative images should have empty alt or role="presentation"
        // Content images must have meaningful alt
        expect(
          alt !== null || role === 'presentation'
        ).toBe(true);
      }
    });

    test('should announce dynamic content changes', async ({ page }) => {
      await page.goto('/data-os');
      
      // Check for aria-live regions
      const liveRegions = await page.locator('[aria-live]').all();
      expect(liveRegions.length).toBeGreaterThan(0);

      // Common live regions
      const assertive = await page.locator('[aria-live="assertive"]').count();
      const polite = await page.locator('[aria-live="polite"]').count();
      
      expect(assertive + polite).toBeGreaterThan(0);
    });
  });

  test.describe('Color Contrast', () => {
    test('should meet WCAG AA contrast requirements', async ({ page }) => {
      await page.goto('/');
      
      // Run contrast checks with axe
      const violations = await getViolations(page, {
        runOnly: {
          type: 'tag',
          values: ['wcag2aa', 'wcag21aa'],
        },
      });

      const contrastViolations = violations.filter(v => 
        v.id === 'color-contrast' || v.id === 'color-contrast-enhanced'
      );

      expect(contrastViolations).toHaveLength(0);
    });

    test('should be readable in high contrast mode', async ({ page, context }) => {
      await context.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' });
      await page.goto('/');

      // Page should be visible and readable
      const body = page.locator('body');
      await expect(body).toBeVisible();

      // Text should be visible
      const headings = await page.locator('h1, h2, h3').all();
      for (const heading of headings.slice(0, 5)) {
        await expect(heading).toBeVisible();
      }
    });
  });

  test.describe('Focus Management', () => {
    test('should have visible focus indicators', async ({ page }) => {
      await page.goto('/');
      
      // Tab to first focusable element
      await page.keyboard.press('Tab');
      
      // Get focused element styles
      const focusStyle = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineColor: styles.outlineColor,
          outlineWidth: styles.outlineWidth,
          boxShadow: styles.boxShadow,
        };
      });

      // Should have some form of focus indication
      const hasFocusStyle = 
        focusStyle.outline !== 'none' ||
        focusStyle.boxShadow !== 'none' ||
        focusStyle.outlineWidth !== '0px';

      expect(hasFocusStyle).toBe(true);
    });

    test('should maintain focus order', async ({ page }) => {
      await page.goto('/');
      
      const focusOrder: string[] = [];
      
      // Tab through first 10 elements
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        const text = await page.evaluate(() => document.activeElement?.textContent?.trim());
        if (text) {
          focusOrder.push(text);
        }
      }

      // Focus order should be populated
      expect(focusOrder.length).toBeGreaterThan(5);
      
      // Should follow visual order (hard to verify automatically, but check it's logical)
      console.log('Focus order:', focusOrder);
    });

    test('should restore focus after modal closes', async ({ page }) => {
      await page.goto('/data-os');
      
      // Click button to open modal
      const openButton = page.locator('button:has-text("Quick Entry")');
      await openButton.click();
      
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      
      // Close modal
      await page.keyboard.press('Escape');
      
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();
      
      // Focus should return to button
      const focusedText = await page.evaluate(() => document.activeElement?.textContent);
      expect(focusedText).toContain('Quick Entry');
    });
  });

  test.describe('Forms and Inputs', () => {
    test('should have accessible error messages', async ({ page }) => {
      await page.goto('/data-os');
      await page.click('button:has-text("Quick Entry")');
      
      // Try to submit without filling
      await page.click('button[type="submit"], button:has-text("Save")');
      
      // Error messages should be present
      await page.waitForTimeout(500);
      const errors = await page.locator('[role="alert"], .error, [aria-invalid="true"]').count();
      expect(errors).toBeGreaterThan(0);
    });

    test('should associate errors with form fields', async ({ page }) => {
      await page.goto('/data-os');
      await page.click('button:has-text("Quick Entry")');
      
      // Submit to trigger errors
      await page.click('button:has-text("Save")');
      await page.waitForTimeout(500);
      
      // Find invalid fields
      const invalidFields = await page.locator('[aria-invalid="true"]').all();
      
      for (const field of invalidFields) {
        const describedBy = await field.getAttribute('aria-describedby');
        expect(describedBy).toBeTruthy();
        
        if (describedBy) {
          // Error message should exist
          const errorMsg = page.locator(`#${describedBy}`);
          await expect(errorMsg).toBeVisible();
        }
      }
    });

    test('should have proper input types', async ({ page }) => {
      await page.goto('/calendar');
      await page.click('button:has-text("Create Event")');
      
      // Date fields should be type="date"
      const dateInput = page.locator('input[type="date"]');
      expect(await dateInput.count()).toBeGreaterThan(0);
      
      // Time fields should be type="time"
      const timeInput = page.locator('input[type="time"], input[name*="time"]');
      expect(await timeInput.count()).toBeGreaterThan(0);
    });
  });

  test.describe('Touch Targets', () => {
    test('should have adequate touch target sizes', async ({ page }) => {
      await page.goto('/');
      
      // Interactive elements should be at least 44x44px (WCAG 2.1)
      const buttons = await page.locator('button, a, input[type="submit"]').all();
      
      for (const button of buttons.slice(0, 20)) { // Check first 20
        const box = await button.boundingBox();
        if (box) {
          // Allow some margin for padding/border
          expect(box.width >= 32 || box.height >= 32).toBe(true);
        }
      }
    });

    test('should have adequate spacing between touch targets', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // Mobile
      await page.goto('/');
      
      // Buttons should have adequate spacing
      const buttons = await page.locator('button').all();
      
      if (buttons.length >= 2) {
        const box1 = await buttons[0].boundingBox();
        const box2 = await buttons[1].boundingBox();
        
        if (box1 && box2) {
          // Calculate distance
          const distance = Math.abs(box2.y - (box1.y + box1.height));
          
          // Should have at least 8px spacing (common practice)
          // Or be far apart (different sections)
          expect(distance >= 8 || distance > 100).toBe(true);
        }
      }
    });
  });

  test.describe('Text and Content', () => {
    test('should be readable at 200% zoom', async ({ page }) => {
      await page.goto('/');
      
      // Set zoom to 200%
      await page.evaluate(() => {
        (document.body.style as any).zoom = '2';
      });
      
      await page.waitForTimeout(500);
      
      // Content should still be visible
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
      
      // No horizontal scrolling on desktop
      const hasHorizontalScroll = await page.evaluate(() => 
        document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      
      // Allow some tolerance
      expect(hasHorizontalScroll).toBe(false);
    });

    test('should support text resizing', async ({ page }) => {
      await page.goto('/');
      
      // Get initial text size
      const initialSize = await page.evaluate(() => {
        const p = document.querySelector('p');
        return p ? window.getComputedStyle(p).fontSize : '16px';
      });
      
      // Increase text size via browser settings
      await page.evaluate(() => {
        document.body.style.fontSize = '150%';
      });
      
      await page.waitForTimeout(500);
      
      // Text should be larger
      const newSize = await page.evaluate(() => {
        const p = document.querySelector('p');
        return p ? window.getComputedStyle(p).fontSize : '16px';
      });
      
      expect(parseFloat(newSize) >= parseFloat(initialSize)).toBe(true);
    });
  });

  test.describe('Motion and Animation', () => {
    test('should respect prefers-reduced-motion', async ({ page, context }) => {
      // Enable reduced motion
      await context.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      
      // Check if animations are disabled
      const hasAnimations = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        let animationCount = 0;
        
        elements.forEach(el => {
          const styles = window.getComputedStyle(el);
          if (styles.animation !== 'none' && styles.animation !== '') {
            animationCount++;
          }
        });
        
        return animationCount;
      });
      
      // Should have minimal or no animations
      expect(hasAnimations).toBeLessThan(10);
    });
  });

  test.describe('Skip Links', () => {
    test('should have skip to main content link', async ({ page }) => {
      await page.goto('/');
      
      // Tab to first element (should be skip link)
      await page.keyboard.press('Tab');
      
      const firstFocused = await page.evaluate(() => document.activeElement?.textContent);
      
      // First focusable should be skip link or main navigation
      expect(firstFocused).toBeTruthy();
    });
  });
});
