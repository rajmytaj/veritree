// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('2. SECONDARY Tests', () => {
  test('[Secondary] Non-existent page (404)', async ({ page }) => {
    await page.addLocatorHandler(page.getByRole('button', { name: 'Consent' }), async (btn) => {
      await btn.click();
    });

    // 1. Open /does-not-exist
    // NOTE: the live site does not serve a 404 page; it redirects unknown paths to the home page.
    await page.goto('https://automationexercise.com/does-not-exist');

    // expect: graceful handling with no stack trace
    await expect(page).toHaveURL('https://automationexercise.com/');
    await expect(page.getByRole('link', { name: 'Home' }).first()).toBeVisible();
    await expect(page.getByText(/Traceback|Exception|stack trace|Server Error/i)).toBeHidden();
  });
});
