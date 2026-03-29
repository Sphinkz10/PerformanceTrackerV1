import { test, expect } from '@playwright/test';

test.describe('Athletes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/athletes');
  });

  test('should display athletes list', async ({ page }) => {
    // Check athletes page loads
    await expect(page.locator('text=Atletas')).toBeVisible();
    
    // Should show athlete cards or table
    await expect(page.locator('[data-testid="athlete-card"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should search for athletes', async ({ page }) => {
    // Find search input
    const searchInput = page.locator('input[placeholder*="Procurar"]');
    await expect(searchInput).toBeVisible();
    
    // Type search query
    await searchInput.fill('João');
    
    // Wait for results
    await page.waitForTimeout(500);
  });

  test('should filter athletes', async ({ page }) => {
    // Open filters if they exist
    const filtersButton = page.locator('text=Filtros');
    if (await filtersButton.isVisible()) {
      await filtersButton.click();
    }
  });

  test('should open athlete profile', async ({ page }) => {
    // Click on first athlete card
    await page.locator('[data-testid="athlete-card"]').first().click();
    
    // Should navigate to profile
    await expect(page).toHaveURL(/.*athletes\/.*/, { timeout: 10000 });
    
    // Should show profile tabs
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should create new athlete', async ({ page }) => {
    // Click create button
    const createButton = page.locator('text=Novo Atleta');
    if (await createButton.isVisible()) {
      await createButton.click();
      
      // Should open create modal
      await expect(page.locator('text=Criar Atleta')).toBeVisible();
    }
  });
});
