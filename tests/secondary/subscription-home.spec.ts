// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('2. SECONDARY Tests', () => {
  test('[Secondary] Subscription on home page', async ({ page }) => {
    await page.addLocatorHandler(page.getByRole('button', { name: 'Consent' }), async (btn) => {
      await btn.click();
    });
    await page.goto('https://automationexercise.com/');

    // 1. Scroll to footer, enter valid email in Subscription and click arrow
    const emailInput = page.getByRole('textbox', { name: 'Your email address' });
    await emailInput.scrollIntoViewIfNeeded();
    await expect(page.getByRole('heading', { name: 'Subscription' })).toBeVisible();
    await emailInput.fill(`sub.${Date.now()}@example.com`);
    await page.locator('#subscribe').click();
    await expect(page.getByText('You have been successfully subscribed!')).toBeVisible();

    // 2. Submit invalid email
    await page.reload();
    await emailInput.scrollIntoViewIfNeeded();
    await emailInput.fill('not-an-email');
    await page.locator('#subscribe').click();
    expect(await emailInput.evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBe(true);
    await expect(page.getByText('You have been successfully subscribed!')).toBeHidden();
  });
});
