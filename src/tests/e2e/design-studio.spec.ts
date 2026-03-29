import { test, expect } from '@playwright/test';

test.describe('Design Studio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/design-studio');
  });

  test('should display design studio modules', async ({ page }) => {
    // Check all module cards are visible
    await expect(page.locator('text=Exercise Creator')).toBeVisible();
    await expect(page.locator('text=Workout Builder')).toBeVisible();
    await expect(page.locator('text=Plan Builder')).toBeVisible();
    await expect(page.locator('text=Load Calculator')).toBeVisible();
    await expect(page.locator('text=Template Analyzer')).toBeVisible();
  });

  test('should navigate to workout builder', async ({ page }) => {
    // Click on Workout Builder card
    await page.click('text=Workout Builder');
    
    // Should show workout builder interface
    await expect(page.locator('text=Construtor de Treinos')).toBeVisible();
    
    // Should have create button
    await expect(page.locator('text=Novo Treino')).toBeVisible();
  });

  test('should navigate to exercise creator', async ({ page }) => {
    // Click on Exercise Creator card
    await page.click('text=Exercise Creator');
    
    // Should show exercise creator
    await expect(page.locator('text=Criador de Exercícios')).toBeVisible();
  });

  test('should open load calculator', async ({ page }) => {
    // Click on Load Calculator
    await page.click('text=Load Calculator');
    
    // Should show calculator interface
    await expect(page.locator('text=Calculadora de Cargas')).toBeVisible();
  });
});
