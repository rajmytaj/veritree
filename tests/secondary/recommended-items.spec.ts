// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('2. SECONDARY Tests', () => {
  test('[Secondary] Add recommended items to cart', async ({ page }) => {
    await page.addLocatorHandler(page.getByRole('button', { name: 'Consent' }), async (btn) => {
      await btn.click();
    });
    await page.goto('https://automationexercise.com/');

    // 1. Scroll to 'Recommended Items', click Add To Cart, View Cart
    const heading = page.getByRole('heading', { name: 'recommended items' });
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();

    const carousel = page.locator('#recommended-item-carousel');
    const item = carousel.locator('.active .productinfo').first();
    const productName = (await item.getByRole('paragraph').innerText()).trim();
    await item.getByText('Add to cart').click();
    await page.getByRole('link', { name: 'View Cart' }).click();

    // expect: product appears in cart
    await expect(page).toHaveURL(/\/view_cart/);
    await expect(page.getByRole('link', { name: productName })).toBeVisible();
  });
});
