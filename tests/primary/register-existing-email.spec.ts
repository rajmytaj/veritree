// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts
import { test, expect, registerUser } from './fixtures';

test.describe('1. PRIMARY Tests', () => {
  test('[Primary] Register with existing email', async ({ page, user }) => {
    // 1. Register a user, log out, then attempt signup again with the same email
    await registerUser(page, user);
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();

    await page.getByTestId('signup-name').fill('Another Name');
    await page.getByTestId('signup-email').fill(user.email);
    await page.getByTestId('signup-button').click();

    await expect(page.getByText('Email Address already exist!')).toBeVisible();
    // No new account created: still on the login page, account form not shown
    await expect(page).toHaveURL(/\/signup$/);
    await expect(page.getByRole('heading', { name: 'Enter Account Information' })).toHaveCount(0);
  });
});
