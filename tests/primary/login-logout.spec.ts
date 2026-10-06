// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts
import { test, expect, url } from '../helpers/fixtures';

test.describe('1. PRIMARY Tests', () => {
  test('[Primary] Login with valid credentials and logout', async ({ page, apiUser: user }) => {
    // 1. User created via API; go to Signup / Login, enter valid email and password, click Login
    await page.goto(url('/'));
    await page.getByRole('link', { name: 'Signup / Login' }).click();
    await page.getByTestId('login-email').fill(user.email);
    await page.getByTestId('login-password').fill(user.password);
    await page.getByTestId('login-button').click();
    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();

    // 2. Click Logout
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page).toHaveURL(url('/login'));
    await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toHaveCount(0);
  });
});
