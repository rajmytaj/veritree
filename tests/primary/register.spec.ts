// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts
import { test, expect, url, fillAccountForm, deleteAccountIfExists } from './fixtures';

test.describe('1. PRIMARY Tests', () => {
  test('[Primary] Register new user', async ({ page, user }) => {
    // 1. Open home page, click 'Signup / Login'
    await page.goto(url('/'));
    await page.getByRole('link', { name: 'Signup / Login' }).click();
    await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();

    // 2. Enter name and unique email, click Signup
    await page.getByTestId('signup-name').fill(user.name);
    await page.getByTestId('signup-email').fill(user.email);
    await page.getByTestId('signup-button').click();
    await expect(page.getByRole('heading', { name: 'Enter Account Information' })).toBeVisible();

    // 3. Fill title, password, DOB, newsletter/offers checkboxes, first/last name, company, address, country, state, city, zipcode, mobile; click 'Create Account'
    await fillAccountForm(page, user);
    await page.getByTestId('create-account').click();
    await expect(page.getByRole('heading', { name: 'Account Created!' })).toBeVisible();

    // 4. Click Continue
    await page.getByRole('link', { name: 'Continue' }).click();
    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();

    // 5. Cleanup (teardown, not part of the assertions): delete the created account
    // Handled by the `user` fixture teardown (deleteAccountIfExists).
  });
});
