// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('2. SECONDARY Tests', () => {
  test('[Secondary] Responsive layout', async ({ page }) => {
    await page.addLocatorHandler(page.getByRole('button', { name: 'Consent' }), async (btn) => {
      await btn.click();
    });

    // 1. Resize viewport to mobile width (375px) and open home and products pages
    await page.setViewportSize({ width: 375, height: 800 });
    const hasHorizontalOverflow = () =>
      page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);

    await page.goto('https://automationexercise.com/');
    // NOTE: the live site header has no hamburger toggle; the nav list stays in the DOM and stacks vertically.
    const nav = page.getByRole('banner');
    for (const name of ['Home', 'Products', 'Cart', 'Signup / Login', 'Contact us']) {
      await expect(nav.getByRole('link', { name })).toBeVisible();
    }
    await expect(page.locator('#slider-carousel')).toBeVisible();
    expect(await hasHorizontalOverflow()).toBe(false);

    await page.goto('https://automationexercise.com/products');
    await expect(page.getByRole('heading', { name: 'All Products' })).toBeVisible();
    expect(await hasHorizontalOverflow()).toBe(false);

    // products remain usable: search works and product detail is reachable
    await page.getByRole('textbox', { name: 'Search Product' }).fill('Tshirt');
    await page.locator('#submit_search').click();
    await expect(page.getByRole('heading', { name: 'Searched Products' })).toBeVisible();
    await page.getByRole('link', { name: 'View Product' }).first().click();
    await expect(page).toHaveURL(/\/product_details\/\d+/);
    await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  });
});
