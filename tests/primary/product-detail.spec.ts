// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts
import { test, expect, url } from '../helpers/fixtures';

test.describe('1. PRIMARY Tests', () => {
  test('[Primary] Browse all products and view product detail', async ({ page }) => {
    await page.goto(url('/'));

    // 1. Click Products in header
    await page.getByRole('link', { name: 'Products' }).click();
    await expect(page).toHaveURL(url('/products'));
    await expect(page.getByRole('heading', { name: 'All Products' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'ecommerce website products' }).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /^Rs\. \d+$/ }).first()).toBeVisible();
    await expect(page.getByText('Blue Top').first()).toBeVisible();
    await expect(page.getByText('Add to cart').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'View Product' }).first()).toBeVisible();

    // 2. Click 'View Product' on the first product
    await page.getByRole('link', { name: 'View Product' }).first().click();
    await expect(page).toHaveURL(/\/product_details\/\d+/);
    await expect(page.getByRole('heading', { name: 'Blue Top' })).toBeVisible();
    await expect(page.getByText('Category: Women > Tops')).toBeVisible();
    await expect(page.getByText('Rs. 500')).toBeVisible();
    await expect(page.getByText('Availability: In Stock')).toBeVisible();
    await expect(page.getByText('Condition: New')).toBeVisible();
    await expect(page.getByText('Brand: Polo')).toBeVisible();
    await expect(page.getByRole('spinbutton')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  });
});
