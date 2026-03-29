import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to main pages', async ({ page }) => {
    await page.goto('/');

    // Check home page loads
    await expect(page).toHaveTitle(/PerformTrack/i);

    // Navigate to Business Dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL(/.*business/);
    await expect(page.locator('h1')).toContainText(/Dashboard|Visão Geral/i);

    // Navigate to Calendar
    await page.click('text=Calendário');
    await expect(page).toHaveURL(/.*calendar/);
    
    // Navigate to Athletes
    await page.click('text=Atletas');
    await expect(page).toHaveURL(/.*athletes/);
    
    // Navigate to Design Studio
    await page.click('text=Design Studio');
    await expect(page).toHaveURL(/.*design-studio/);
  });

  test('should handle 404 pages', async ({ page }) => {
    const response = await page.goto('/non-existent-page');
    expect(response?.status()).toBe(404);
  });
});
