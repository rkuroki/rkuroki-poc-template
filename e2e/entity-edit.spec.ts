import { test, expect, Page } from '@playwright/test';

/**
 * Helper: logs in as admin via the /mgmt login page (session cookie set).
 * The test DB is seeded with admin / password "admin".
 */
async function loginAsAdmin(page: Page) {
  await page.goto('/mgmt');
  await page.locator('input[name="username"]').fill('admin');
  await page.locator('input[name="password"]').fill('admin123');
  await page.locator('button[type="submit"]').click();
  await page.waitForURL('/home');
}

// ─────────────────────────────────────────────────────────────────────────────
// Navigation: clicking "Editar" should go to /crud/{entity}/{mne}
// ─────────────────────────────────────────────────────────────────────────────
test.describe('CRUD edit page navigation', () => {
  test('Edit link navigates to /crud/pageurls/{mne}', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/home/pageurls');

    // Click the first Edit link in the table
    const firstEditLink = page.getByRole('link', { name: 'Editar' }).first();
    await expect(firstEditLink).toBeVisible();
    const href = await firstEditLink.getAttribute('href');
    expect(href).toMatch(/^\/crud\/pageurls\//);

    await firstEditLink.click();
    await expect(page).toHaveURL(/\/crud\/pageurls\//);
    await expect(page.locator('h1')).toContainText('Editar PageUrl');
  });

  test('Edit link for users navigates to /crud/users/{mne}', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/home/users');

    const firstEditLink = page.getByRole('link', { name: 'Editar' }).first();
    await expect(firstEditLink).toBeVisible();
    const href = await firstEditLink.getAttribute('href');
    expect(href).toMatch(/^\/crud\/users\//);

    await firstEditLink.click();
    await expect(page).toHaveURL(/\/crud\/users\//);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Access control: non-owner gets Forbidden screen
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Entity edit page - access control', () => {
  test('Admin can access any entity edit page', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/home/pageurls');

    const firstEditLink = page.getByRole('link', { name: 'Editar' }).first();
    await firstEditLink.click();

    // Should NOT see Forbidden
    await expect(page.locator('h2')).not.toContainText('Acesso Negado');
    // Should see the form
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Unknown entity returns 404', async ({ page }) => {
    await loginAsAdmin(page);
    const response = await page.goto('/crud/nonexistent_entity/some-mne');
    expect(response?.status()).toBe(404);
  });

  test('Unknown mnemonic returns 404', async ({ page }) => {
    await loginAsAdmin(page);
    const response = await page.goto('/crud/pageurls/this-mne-do-not-exist');
    expect(response?.status()).toBe(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Validation: submitting empty / invalid data shows Zod errors below submit
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Entity edit page - validation feedback', () => {
  test('Submitting empty URL field shows validation error below submit button', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/home/pageurls');

    const firstEditLink = page.getByRole('link', { name: 'Editar' }).first();
    await firstEditLink.click();
    await expect(page).toHaveURL(/\/crud\/pageurls\//);

    // Clear the URL field and submit
    await page.locator('input[name="url"]').fill('');
    await page.locator('input[name="path"]').fill('/some/path');
    await page.locator('button[type="submit"]').click();

    // Error list should appear BELOW the submit button
    const errorSection = page.locator('div.bg-red-50');
    await expect(errorSection).toBeVisible();
    await expect(errorSection).toContainText('url');
  });

  test('Submitting invalid URL shows validation error', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/home/pageurls');

    const firstEditLink = page.getByRole('link', { name: 'Editar' }).first();
    await firstEditLink.click();

    await page.locator('input[name="url"]').fill('not-a-valid-url');
    await page.locator('input[name="path"]').fill('/ok');
    await page.locator('button[type="submit"]').click();

    const errorSection = page.locator('div.bg-red-50');
    await expect(errorSection).toBeVisible();
  });

  test('Submitting empty note field shows validation error', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/home/notes');

    const firstEditLink = page.getByRole('link', { name: 'Editar' }).first();
    await firstEditLink.click();
    await expect(page).toHaveURL(/\/crud\/notes\//);

    await page.locator('input[name="note"], textarea[name="note"]').fill('');
    await page.locator('button[type="submit"]').click();

    const errorSection = page.locator('div.bg-red-50');
    await expect(errorSection).toBeVisible();
  });

  test('Submitting valid data saves successfully', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/home/pageurls');

    const firstEditLink = page.getByRole('link', { name: 'Editar' }).first();
    await firstEditLink.click();

    await page.locator('input[name="url"]').fill('https://example.com');
    await page.locator('input[name="path"]').fill('/example');
    await page.locator('button[type="submit"]').click();

    // Success message should appear
    const successSection = page.locator('div.bg-green-50');
    await expect(successSection).toBeVisible();
    await expect(successSection).toContainText('sucesso');
  });
});
