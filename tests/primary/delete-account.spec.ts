// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts
import { test, expect, url, login, loginAndVerify } from '../helpers/fixtures';

test.describe('1. PRIMARY Tests', () => {
  test('[Primary] Delete account', async ({ page, apiUser: user }) => {
    // 1. Precondition: a unique user created via API and logged in
    await loginAndVerify(page, user);

    // 2. Click 'Delete Account'
    await page.getByRole('link', { name: 'Delete Account' }).click();
    await expect(page.getByRole('heading', { name: 'Account Deleted!' })).toBeVisible();

    // 3. Click Continue
    await page.getByRole('link', { name: 'Continue' }).click();
    await expect(page).toHaveURL(url('/'));
    await expect(page.getByRole('link', { name: 'Signup / Login' })).toBeVisible();

    // 4. Attempt to log in with the deleted account's credentials
    await login(page, user);
    await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
  });
});
