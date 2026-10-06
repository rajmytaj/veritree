// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../primary/fixtures';

test.describe('2. SECONDARY Tests', () => {
  test('[Secondary] Signup form validation and field edge cases', async ({ page }) => {
    await page.addLocatorHandler(page.getByRole('button', { name: 'Consent' }), async (btn) => {
      await btn.click();
    });

    // 1. Submit signup with empty name/email
    await page.goto('https://automationexercise.com/login');
    const name = page.getByTestId('signup-name');
    const email = page.getByTestId('signup-email');
    await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();

    await page.getByTestId('signup-button').click();
    await expect(page).toHaveURL(/\/login/);
    expect(await name.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);

    // name only, email missing
    await name.fill('Validation User');
    await page.getByTestId('signup-button').click();
    await expect(page).toHaveURL(/\/login/);
    expect(await email.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);

    // invalid email
    await email.fill('not-an-email');
    await page.getByTestId('signup-button').click();
    await expect(page).toHaveURL(/\/login/);
    expect(await email.evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBe(true);

    // 2. Account form missing mandatory fields
    await email.fill(`validation.${Date.now()}@example.com`);
    await page.getByTestId('signup-button').click();
    await expect(page.getByText('Enter Account Information')).toBeVisible();

    await page.getByTestId('create-account').click();
    await expect(page).toHaveURL(/\/signup/);
    await expect(page.getByText('Account Created!')).toBeHidden();
    expect(await page.getByTestId('password').evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);

    // password only: first name still mandatory
    await page.getByTestId('password').fill('Passw0rd!123');
    await page.getByTestId('create-account').click();
    await expect(page).toHaveURL(/\/signup/);
    expect(await page.getByTestId('first_name').evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
    await expect(page.getByText('Account Created!')).toBeHidden();
  });
});
