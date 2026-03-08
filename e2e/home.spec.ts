import { test, expect } from '@playwright/test';

test('has title and login flow access', async ({ page }) => {
  await page.goto('/');

  // Assuming initial page might be public or direct to login 
  // Let's explicitly test the login page rendering properties we created.
  await page.goto('/login');
  
  await expect(page.locator('h1')).toContainText('Sign In / Register');
  
  // Ensure the form elements are rendering
  await expect(page.locator('input[name="phone"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});
