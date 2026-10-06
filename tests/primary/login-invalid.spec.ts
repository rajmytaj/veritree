// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts
import { test, expect, url } from '../helpers/fixtures';

test.describe('1. PRIMARY Tests', () => {
  test('[Primary] Login with invalid credentials', async ({ page }) => {
    await page.goto(url('/login'));
    const email = page.getByTestId('login-email');
    const password = page.getByTestId('login-password');
    const loginButton = page.getByTestId('login-button');

    // 1. Enter incorrect email/password and click Login
    await email.fill(`nobody.${Date.now()}@example.com`);
    await password.fill('wrong-password');
    await loginButton.click();
    await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Signup / Login' })).toBeVisible();

    // 2. Try empty fields and malformed email
    await page.goto(url('/login'));
    await loginButton.click();
    expect(await email.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
    await expect(page).toHaveURL(url('/login'));

    await email.fill('not-an-email');
    await password.fill('whatever');
    await loginButton.click();
    expect(await email.evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBe(true);
    await expect(page).toHaveURL(url('/login'));
    await expect(page.getByText('Your email or password is incorrect!')).toHaveCount(0);
  });
});
