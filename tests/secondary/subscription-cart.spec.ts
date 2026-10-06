// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../primary/fixtures';

test.describe('2. SECONDARY Tests', () => {
  test('[Secondary] Subscription on cart page', async ({ page }) => {
    await page.addLocatorHandler(page.getByRole('button', { name: 'Consent' }), async (btn) => {
      await btn.click();
    });

    // 1. Open cart page, scroll to footer, subscribe with valid email
    await page.goto('https://automationexercise.com/');
    await page.getByRole('link', { name: 'Cart' }).first().click();
    await expect(page).toHaveURL(/\/view_cart/);

    const emailInput = page.getByRole('textbox', { name: 'Your email address' });
    await emailInput.scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: 'Subscription' })).toBeVisible();
    await emailInput.fill(`sub.${Date.now()}@example.com`);
    await page.locator('#subscribe').click();

    // expect: success message shown
    await expect(page.getByText('You have been successfully subscribed!')).toBeVisible();
  });
});
