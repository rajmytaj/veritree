// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts
import { test, expect, url, registerUser } from './fixtures';

test.describe('1. PRIMARY Tests', () => {
  test('[Primary] Payment form validation', async ({ page, user }) => {
    // Precondition: logged-in user with a product in the cart, on the payment page
    await registerUser(page, user);
    await page.goto(url('/product_details/1'));
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await page.getByRole('link', { name: 'View Cart' }).click();
    await page.getByText('Proceed To Checkout').click();
    await page.getByRole('link', { name: 'Place Order' }).click();
    await expect(page).toHaveURL(url('/payment'));

    const nameOnCard = page.getByTestId('name-on-card');
    const cardNumber = page.getByTestId('card-number');
    const cvc = page.getByTestId('cvc');
    const payButton = page.getByRole('button', { name: 'Pay and Confirm Order' });
    const isMissing = (locator: typeof nameOnCard) =>
      locator.evaluate((el: HTMLInputElement) => el.validity.valueMissing);

    // 1. Reach payment page and submit with empty fields, then with only some fields
    await payButton.click();
    expect(await isMissing(nameOnCard)).toBe(true);
    await expect(page).toHaveURL(url('/payment'));

    await nameOnCard.fill(user.name);
    await cardNumber.fill('4111111111111111');
    await payButton.click();
    expect(await isMissing(cvc)).toBe(true);
    await expect(page).toHaveURL(url('/payment'));

    // Order not placed
    await expect(page.getByRole('heading', { name: 'Order Placed!' })).toHaveCount(0);
    await expect(page.getByText('Congratulations! Your order has been confirmed!')).toHaveCount(0);
  });
});
