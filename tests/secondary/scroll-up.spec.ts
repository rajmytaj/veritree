// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../primary/fixtures';

test.describe('2. SECONDARY Tests', () => {
  test('[Secondary] Scroll to top via arrow and subscription-free scroll', async ({ page }) => {
    await page.addLocatorHandler(page.getByRole('button', { name: 'Consent' }), async (btn) => {
      await btn.click();
    });
    await page.goto('https://automationexercise.com/');
    const slogan = page.getByRole('heading', { name: 'Full-Fledged practice website for Automation Engineers' }).first();

    // 1. Scroll to bottom, click the scroll-up arrow
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByRole('heading', { name: 'Subscription' })).toBeInViewport();
    await page.locator('#scrollUp').click();

    // expect: page returns to top and slogan is visible
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(slogan).toBeVisible();

    // ...and repeat by scrolling manually
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByRole('heading', { name: 'Subscription' })).toBeInViewport();
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(slogan).toBeVisible();
  });
});
