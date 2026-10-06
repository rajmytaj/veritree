// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts
import { test, expect, url, fillAccountForm, deleteAccount } from '../helpers/fixtures';

test.describe('1. PRIMARY Tests', () => {
  test('[Primary] Checkout while registering during checkout (guest flow)', async ({ page, user }) => {
    // 1. Add product, view cart, click 'Proceed To Checkout'
    await page.goto(url('/product_details/1'));
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await page.getByRole('link', { name: 'View Cart' }).click();
    await page.getByText('Proceed To Checkout').click();
    await expect(page.getByRole('link', { name: 'Register / Login' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue On Cart' })).toBeVisible();

    // 2. Click Register / Login, sign up, create account, return to cart, Proceed To Checkout
    await page.getByRole('link', { name: 'Register / Login' }).click();
    await page.getByTestId('signup-name').fill(user.name);
    await page.getByTestId('signup-email').fill(user.email);
    await page.getByTestId('signup-button').click();
    await fillAccountForm(page, user);
    await page.getByTestId('create-account').click();
    await expect(page.getByRole('heading', { name: 'Account Created!' })).toBeVisible();
    await page.getByRole('link', { name: 'Continue' }).click();
    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();

    await page.getByRole('link', { name: 'Cart' }).click();
    await page.getByText('Proceed To Checkout').click();
    await expect(page).toHaveURL(url('/checkout'));
    await expect(page.getByRole('heading', { name: 'Address Details' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Review Your Order' })).toBeVisible();
    const delivery = page.getByRole('list').filter({ has: page.getByRole('heading', { name: 'Your delivery address' }) });
    await expect(delivery).toContainText(user.name);
    await expect(delivery).toContainText(user.address);
    await expect(delivery).toContainText(`${user.city} ${user.state} ${user.zipcode}`);
    await expect(delivery).toContainText(user.country);
    await expect(delivery).toContainText(user.mobile);
    await expect(page.getByRole('row', { name: /Blue Top/ })).toContainText('Rs. 500');

    // 3. Enter comment, click Place Order, enter card name, number, CVC, expiry and click 'Pay and Confirm Order'
    await page.getByRole('textbox').first().fill('Please deliver in the morning');
    await page.getByRole('link', { name: 'Place Order' }).click();
    await expect(page).toHaveURL(url('/payment'));
    await page.getByTestId('name-on-card').fill(user.name);
    await page.getByTestId('card-number').fill('4111111111111111');
    await page.getByTestId('cvc').fill('123');
    await page.getByTestId('expiry-month').fill('12');
    await page.getByTestId('expiry-year').fill('2030');
    await page.getByRole('button', { name: 'Pay and Confirm Order' }).click();
    await expect(page.getByRole('heading', { name: 'Order Placed!' })).toBeVisible();
    await expect(page.getByText('Congratulations! Your order has been confirmed!')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Download Invoice' })).toBeVisible();

    // 4. Delete the account
    // (the UI deletion is verified below; the `user` fixture teardown also deletes via API as a safety net)
    await deleteAccount(page);
  });
});
