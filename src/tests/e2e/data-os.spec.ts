import { test, expect } from '@playwright/test';

test.describe('Data OS V2', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-os-v2');
  });

  test('should display all data OS modules', async ({ page }) => {
    // Check all module tabs are visible
    await expect(page.locator('text=Library')).toBeVisible();
    await expect(page.locator('text=LiveBoard')).toBeVisible();
    await expect(page.locator('text=Automation')).toBeVisible();
    await expect(page.locator('text=Insights')).toBeVisible();
    await expect(page.locator('text=Wizard')).toBeVisible();
  });

  test('should switch between modules', async ({ page }) => {
    // Start on Library
    await expect(page.locator('text=Catálogo de Métricas')).toBeVisible();
    
    // Switch to LiveBoard
    await page.click('button:has-text("LiveBoard")');
    await expect(page.locator('text=Dashboard Personalizado')).toBeVisible();
    
    // Switch to Automation
    await page.click('button:has-text("Automation")');
    await expect(page.locator('text=Regras de Automação')).toBeVisible();
    
    // Switch to Insights
    await page.click('button:has-text("Insights")');
    await expect(page.locator('text=Análise de Dados')).toBeVisible();
  });

  test('should display metrics in library', async ({ page }) => {
    // Should show metric categories
    await expect(page.locator('text=Performance')).toBeVisible();
    await expect(page.locator('text=Wellness')).toBeVisible();
  });

  test('should open metric wizard', async ({ page }) => {
    // Click on Wizard tab
    await page.click('button:has-text("Wizard")');
    
    // Should show wizard interface
    await expect(page.locator('text=Criar Métrica')).toBeVisible();
  });
});
