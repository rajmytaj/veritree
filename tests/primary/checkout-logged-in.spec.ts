// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts
import { test, expect, url, registerUser } from './fixtures';

test.describe('1. PRIMARY Tests', () => {
  test('[Primary] Checkout as logged-in user and verify address', async ({ page, user }) => {
    // 1. Register and log in, add product, proceed to checkout
    await registerUser(page, user);
    await page.goto(url('/product_details/1'));
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await page.getByRole('link', { name: 'View Cart' }).click();
    await page.getByText('Proceed To Checkout').click();
    await expect(page).toHaveURL(url('/checkout'));

    for (const heading of ['Your delivery address', 'Your billing address']) {
      const address = page.getByRole('list').filter({ has: page.getByRole('heading', { name: heading }) });
      await expect(address).toContainText(user.name);
      await expect(address).toContainText(user.company);
      await expect(address).toContainText(user.address);
      await expect(address).toContainText(`${user.city} ${user.state} ${user.zipcode}`);
      await expect(address).toContainText(user.country);
      await expect(address).toContainText(user.mobile);
    }
    const blueTop = page.getByRole('row', { name: /Blue Top/ });
    await expect(blueTop).toContainText('Rs. 500');
    await expect(page.getByRole('row', { name: /Total Amount/ })).toContainText('Rs. 500');

    // 2. Place order with valid payment details, download invoice, click Continue
    await page.getByRole('textbox').first().fill('Order placed by automated test');
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

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('link', { name: 'Download Invoice' }).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/invoice/i);

    await page.getByRole('link', { name: 'Continue' }).click();
    await expect(page).toHaveURL(url('/'));
    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();
  });
});
