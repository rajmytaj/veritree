// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../primary/fixtures';

test.describe('2. SECONDARY Tests', () => {
  test('[Secondary] Download invoice after purchase', async ({ page }) => {
    test.setTimeout(90_000);
    const name = `Invoice User ${Date.now()}`;
    const email = `invoice.${Date.now()}@example.com`;
    await page.addLocatorHandler(page.getByRole('button', { name: 'Consent' }), async (btn) => {
      await btn.click();
    });

    try {
      // Precondition: register a unique user
      await page.goto('https://automationexercise.com/login');
      await page.getByTestId('signup-name').fill(name);
      await page.getByTestId('signup-email').fill(email);
      await page.getByTestId('signup-button').click();
      await expect(page.getByText('Enter Account Information')).toBeVisible();
      await page.getByLabel('Mr.').check();
      await page.getByTestId('password').fill('Passw0rd!123');
      await page.getByTestId('days').selectOption('1');
      await page.getByTestId('months').selectOption('January');
      await page.getByTestId('years').selectOption('1990');
      await page.getByTestId('first_name').fill('Invoice');
      await page.getByTestId('last_name').fill('Tester');
      await page.getByTestId('address').fill('1 Test Street');
      await page.getByTestId('country').selectOption('Canada');
      await page.getByTestId('state').fill('BC');
      await page.getByTestId('city').fill('Vancouver');
      await page.getByTestId('zipcode').fill('V6B 1A1');
      await page.getByTestId('mobile_number').fill('6045550100');
      await page.getByTestId('create-account').click();
      await expect(page.getByText('Account Created!')).toBeVisible();
      await page.getByTestId('continue-button').click();
      await expect(page.getByText(`Logged in as ${name}`)).toBeVisible();

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
      // Cleanup: delete the account
      await page.goto('https://automationexercise.com/delete_account');
    }
  });
});
