// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts
import { test, expect, url, registerUser, login } from './fixtures';

test.describe('1. PRIMARY Tests', () => {
  test('[Primary] Cart persists after login', async ({ page, user }) => {
    // Precondition: an existing account, logged out
    await registerUser(page, user);
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();

    // 1. Add product as guest, then log in with an existing account, open cart
    await page.goto(url('/product_details/1'));
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await page.getByRole('button', { name: 'Continue Shopping' }).click();

    await login(page, user);
    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();
    await page.getByRole('link', { name: 'Cart' }).click();

    await expect(page).toHaveURL(url('/view_cart'));
    await expect(page.getByRole('row', { name: /Blue Top/ })).toBeVisible();
  });
});
