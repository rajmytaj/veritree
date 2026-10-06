// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts
import { test, expect, url } from '../helpers/fixtures';

test.describe('1. PRIMARY Tests', () => {
  test('[Primary] Remove product from cart', async ({ page }) => {
    // 1. Add a product, open cart, click the X delete button
    await page.goto(url('/product_details/1'));
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await page.getByRole('link', { name: 'View Cart' }).click();
    const row = page.getByRole('row', { name: /Blue Top/ });
    await expect(row).toBeVisible();

    // The X is an href-less <a> with only an icon: it has no role or accessible name.
    await row.getByRole('cell').last().locator('a').click();

    await expect(row).toHaveCount(0);
    await expect(page.getByText('Cart is empty!')).toBeVisible();
    await expect(page.getByRole('link', { name: 'here' })).toBeVisible();
  });
});
