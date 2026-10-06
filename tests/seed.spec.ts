import { test, expect } from '@playwright/test';

// Seed: opens the home page and auto-dismisses the cookie "Consent" dialog
// so consent/ad overlays never block clicks in scenarios that start from here.
test.describe('Home page seed', () => {
  test('seed', async ({ page }) => {
    await page.addLocatorHandler(
      page.getByRole('button', { name: 'Consent' }),
      async (consent) => {
        await consent.click();
      }
    );

    await page.goto('https://automationexercise.com');

    await expect(page).toHaveTitle('Automation Exercise');
    await expect(page.getByRole('link', { name: /Signup \/ Login/ })).toBeVisible();
  });
});
