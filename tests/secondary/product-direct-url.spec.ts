// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('2. SECONDARY Tests', () => {
  test('[Secondary] Product detail via direct URL and invalid ID', async ({ page }) => {
    await page.addLocatorHandler(page.getByRole('button', { name: 'Consent' }), async (btn) => {
      await btn.click();
    });

    // 1. Open /product_details/1
    await page.goto('https://automationexercise.com/product_details/1');
    // expect: valid ID shows product
    await expect(page.getByRole('heading', { name: 'Blue Top' })).toBeVisible();
    await expect(page.getByText('Category: Women > Tops')).toBeVisible();
    await expect(page.getByText('Rs. 500')).toBeVisible();
    await expect(page.getByText('Availability:')).toBeVisible();
    await expect(page.getByText('Brand: Polo')).toBeVisible();

    // 2. Open /product_details/99999
    // NOTE: the live site returns a page with an empty product (no name/category/price), not an error page.
    await page.goto('https://automationexercise.com/product_details/99999');
    await expect(page).toHaveURL(/\/product_details\/99999/);
    await expect(page.getByRole('heading', { name: 'Blue Top' })).toBeHidden();
    await expect(page.getByText('Rs. 500')).toBeHidden();
    await expect(page.getByText(/Traceback|Exception|stack trace/i)).toBeHidden();
    // Page chrome still works
    await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
  });
});
