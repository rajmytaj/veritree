// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts
import { test, expect, url } from './fixtures';

test.describe('1. PRIMARY Tests', () => {
  test('[Primary] Change quantity on product detail and add to cart', async ({ page }) => {
    // 1. Open a product detail page, set quantity to 4, click Add to cart, View Cart
    await page.goto(url('/product_details/1'));
    await expect(page.getByRole('heading', { name: 'Blue Top' })).toBeVisible();
    await page.getByRole('spinbutton').fill('4');
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await page.getByRole('link', { name: 'View Cart' }).click();

    await expect(page).toHaveURL(url('/view_cart'));
    const row = page.getByRole('row', { name: /Blue Top/ });
    await expect(row.getByRole('button', { name: '4', exact: true })).toBeVisible();
    await expect(row.getByText('Rs. 500')).toBeVisible();
    // total = 4 x 500
    await expect(row.getByText('Rs. 2000')).toBeVisible();
  });
});
