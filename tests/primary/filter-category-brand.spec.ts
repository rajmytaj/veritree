// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts
import { test, expect, url } from './fixtures';

test.describe('1. PRIMARY Tests', () => {
  test('[Primary] Filter products by category and brand', async ({ page }) => {
    await page.goto(url('/products'));

    // 1. Expand Category sidebar, choose Women > Dress
    // (category link names carry a leading icon glyph, hence the regexes; "Men" is also a substring of "Women")
    await page.getByRole('link', { name: /^\W*Women\s*$/ }).click();
    await page.getByRole('link', { name: 'Dress', exact: true }).click();
    await expect(page).toHaveURL(url('/category_products/1'));
    await expect(page.getByRole('heading', { name: /Women\s*-\s*Dress Products/i })).toBeVisible();
    await expect(page.getByRole('link', { name: 'View Product' }).first()).toBeVisible();
    // Only dresses are listed: every product name contains "Dress"
    const names = page.getByRole('paragraph').filter({ hasText: /dress/i });
    expect(await names.count()).toBeGreaterThanOrEqual(await page.getByRole('link', { name: 'View Product' }).count());

    // 2. Choose Men > Tshirts, then a brand (e.g. Polo)
    await page.getByRole('link', { name: /^\W*Men\s*$/ }).click();
    await page.getByRole('link', { name: 'Tshirts', exact: true }).click();
    await expect(page.getByRole('heading', { name: /Men\s*-\s*Tshirts Products/i })).toBeVisible();

    await page.getByRole('link', { name: /\) Polo$/ }).click();
    await expect(page).toHaveURL(url('/brand_products/Polo'));
    await expect(page.getByRole('heading', { name: /Brand\s*-\s*Polo Products/i })).toBeVisible();
    await expect(page.getByRole('link', { name: 'View Product' }).first()).toBeVisible();
  });
});
