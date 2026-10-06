// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts
import { test, expect, url, addProductFromList } from './fixtures';

test.describe('1. PRIMARY Tests', () => {
  test('[Primary] Add products to cart and verify cart contents', async ({ page }) => {
    await page.goto(url('/products'));

    // 1. Hover first two products, click Add to cart, choose 'Continue Shopping' after first and 'View Cart' after second
    await addProductFromList(page, 0);
    await expect(page.getByRole('heading', { name: 'Added!' })).toBeVisible();
    await page.getByRole('button', { name: 'Continue Shopping' }).click();
    await expect(page.getByRole('heading', { name: 'Added!' })).toBeHidden();

    await addProductFromList(page, 1);
    await page.getByRole('link', { name: 'View Cart' }).click();

    await expect(page).toHaveURL(url('/view_cart'));
    const blueTop = page.getByRole('row', { name: /Blue Top/ });
    const tshirt = page.getByRole('row', { name: /Men Tshirt/ });
    // price Rs. 500, quantity 1, total = price x quantity
    await expect(blueTop).toContainText('Rs. 500');
    await expect(blueTop.getByRole('button', { name: '1', exact: true })).toBeVisible();
    await expect(blueTop.getByText('Rs. 500')).toHaveCount(2);
    // price Rs. 400, quantity 1, total = price x quantity
    await expect(tshirt).toContainText('Rs. 400');
    await expect(tshirt.getByRole('button', { name: '1', exact: true })).toBeVisible();
    await expect(tshirt.getByText('Rs. 400')).toHaveCount(2);
  });
});
