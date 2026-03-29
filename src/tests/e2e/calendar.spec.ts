import { test, expect } from '@playwright/test';

test.describe('Calendar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calendar');
  });

  test('should display calendar with all views', async ({ page }) => {
    // Check calendar loads
    await expect(page.locator('text=Calendário')).toBeVisible();

    // Test Month view (default)
    await expect(page.locator('[data-view="month"]')).toBeVisible();

    // Switch to Week view
    await page.click('button:has-text("Semana")');
    await expect(page.locator('[data-view="week"]')).toBeVisible();

    // Switch to Day view
    await page.click('button:has-text("Dia")');
    await expect(page.locator('[data-view="day"]')).toBeVisible();

    // Switch to List view
    await page.click('button:has-text("Lista")');
    await expect(page.locator('[data-view="list"]')).toBeVisible();
  });

  test('should open create event panel', async ({ page }) => {
    // Click create event button
    await page.click('text=Novo Evento');

    // Panel should open
    await expect(page.locator('text=Criar Evento')).toBeVisible();
    
    // Should have mode tabs
    await expect(page.locator('text=Treino Individual')).toBeVisible();
    await expect(page.locator('text=Plano de Treino')).toBeVisible();
    await expect(page.locator('text=Aula em Grupo')).toBeVisible();
  });

  test('should navigate between months', async ({ page }) => {
    // Click next month
    await page.click('[aria-label="Next month"]');
    
    // Wait for calendar to update
    await page.waitForTimeout(500);
    
    // Click previous month
    await page.click('[aria-label="Previous month"]');
    
    // Click today button
    await page.click('text=Hoje');
  });

  test('should filter events', async ({ page }) => {
    // Open filters
    await page.click('text=Filtros');
    
    // Panel should open
    await expect(page.locator('text=Filtrar Eventos')).toBeVisible();
    
    // Toggle event type filter
    await page.click('input[type="checkbox"][value="workout"]');
    
    // Close filters
    await page.click('button:has-text("Fechar")');
  });

  test('should search for events', async ({ page }) => {
    // Type in search box
    await page.fill('input[placeholder*="Procurar"]', 'Treino');
    
    // Wait for debounce
    await page.waitForTimeout(500);
    
    // Clear search
    await page.fill('input[placeholder*="Procurar"]', '');
  });
});
