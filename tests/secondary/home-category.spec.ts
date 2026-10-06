// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../helpers/fixtures';

test.describe('2. SECONDARY Tests', () => {
  test('[Secondary] View category products from home sidebar', async ({ page }) => {
    await page.addLocatorHandler(page.getByRole('button', { name: 'Consent' }), async (btn) => {
      await btn.click();
    });
    await page.goto('https://automationexercise.com/');
    const sidebar = page.locator('.left-sidebar');

    // 1. Click category and subcategory links in left sidebar and brands list
    await sidebar.getByRole('link', { name: /^\W*Women\s*$/ }).click();
    await sidebar.locator('#Women').getByRole('link', { name: 'Dress' }).click();
    await expect(page).toHaveURL(/\/category_products\/1$/);
    await expect(page.getByRole('heading', { name: 'Women - Dress Products' })).toBeVisible();

    await sidebar.getByRole('link', { name: /^\W*Men\s*$/ }).click();
    await sidebar.locator('#Men').getByRole('link', { name: 'Tshirts' }).click();
    await expect(page).toHaveURL(/\/category_products\/3$/);
    await expect(page.getByRole('heading', { name: 'Men - Tshirts Products' })).toBeVisible();

    await sidebar.getByRole('link', { name: /^\W*Kids\s*$/ }).click();
    await sidebar.locator('#Kids').getByRole('link', { name: 'Tops & Shirts' }).click();
    await expect(page).toHaveURL(/\/category_products\/5$/);
    await expect(page.getByRole('heading', { name: 'Kids - Tops & Shirts Products' })).toBeVisible();

    await sidebar.getByRole('link', { name: /Polo/ }).click();
    await expect(page).toHaveURL(/\/brand_products\/Polo$/);
    await expect(page.getByRole('heading', { name: 'Brand - Polo Products' })).toBeVisible();

    await sidebar.getByRole('link', { name: /Biba/ }).click();
    await expect(page).toHaveURL(/\/brand_products\/Biba$/);
    await expect(page.getByRole('heading', { name: 'Brand - Biba Products' })).toBeVisible();
  });
});
