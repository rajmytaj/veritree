// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('2. SECONDARY Tests', () => {
  test('[Secondary] Empty cart state and unauthorised checkout guard', async ({ page }) => {
    await page.addLocatorHandler(page.getByRole('button', { name: 'Consent' }), async (btn) => {
      await btn.click();
    });

    // 1. Open /view_cart with nothing added
    await page.goto('https://automationexercise.com/view_cart');
    await expect(page.getByText('Cart is empty!')).toBeVisible();
    await expect(page.getByRole('link', { name: 'here' })).toHaveAttribute('href', '/products');

    // 2. Navigate directly to /checkout or /payment while logged out
    // NOTE: the live site does not redirect to login; it renders the pages with no items/addresses and a Rs. 0 total.
    await page.goto('https://automationexercise.com/checkout');
    await expect(page.getByRole('heading', { name: 'Review Your Order' })).toBeVisible();
    await expect(page.getByText('Total Amount')).toBeVisible();
    await expect(page.getByText('Rs. 0')).toBeVisible();
    await expect(page.getByText('Logged in as')).toBeHidden();
    await expect(page.getByText('Order Placed!')).toBeHidden();

    await page.goto('https://automationexercise.com/payment');
    await expect(page.getByRole('heading', { name: 'Payment' }).first()).toBeVisible();
    await expect(page.getByText('Order Placed!')).toBeHidden();
    await expect(page.getByRole('link', { name: 'Download Invoice' })).toBeHidden();

    // No order was created: cart is still empty
    await page.goto('https://automationexercise.com/view_cart');
    await expect(page.getByText('Cart is empty!')).toBeVisible();
  });
});
