// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts

import { test, expect, newUser, createUserViaApi, deleteUserViaApi, loginAndVerify } from '../helpers/fixtures';

test.describe('2. SECONDARY Tests', () => {
  test('[Secondary] Download invoice after purchase', async ({ page, request }) => {
    test.setTimeout(90_000);
    const user = {
      ...newUser(),
      name: `Invoice User ${Date.now()}`,
      firstName: 'Invoice',
      lastName: 'Tester',
      address: '1 Test Street',
      state: 'BC',
      city: 'Vancouver',
      zipcode: 'V6B 1A1',
      mobile: '6045550100',
    };

    try {
      // Precondition: create a unique user via API and log in
      await createUserViaApi(request, user);
      await loginAndVerify(page, user);

      // Add a product and go through checkout
      await page.goto('https://automationexercise.com/product_details/1');
      await page.getByRole('button', { name: 'Add to cart' }).click();
      await page.getByRole('link', { name: 'View Cart' }).click();
      await page.getByText('Proceed To Checkout').click();
      await expect(page.getByRole('heading', { name: 'Address Details' })).toBeVisible();
      await page.getByRole('link', { name: 'Place Order' }).click();

      await page.getByTestId('name-on-card').fill('Invoice Tester');
      await page.getByTestId('card-number').fill('4111111111111111');
      await page.getByTestId('cvc').fill('123');
      await page.getByTestId('expiry-month').fill('12');
      await page.getByTestId('expiry-year').fill('2030');
      await page.getByTestId('pay-button').click();
      await expect(page.getByText('Congratulations! Your order has been confirmed!')).toBeVisible();

      // 1. Complete an order and click Download Invoice
      const downloadPromise = page.waitForEvent('download');
      await page.getByRole('link', { name: 'Download Invoice' }).click();
      const download = await downloadPromise;

      // expect: invoice file downloads containing order details
      expect(download.suggestedFilename()).toMatch(/invoice/i);
      const stream = await download.createReadStream();
      let content = '';
      for await (const chunk of stream) content += chunk.toString();
      // The invoice greets the billing first/last name, not the account name
      expect(content).toContain('Invoice Tester');
      expect(content).toMatch(/total purchase amount/i);
    } finally {
      // Cleanup: delete the account via API
      await deleteUserViaApi(request, user);
    }
  });
});
