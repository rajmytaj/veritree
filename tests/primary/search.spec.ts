// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts
import { test, expect, url } from '../helpers/fixtures';

test.describe('1. PRIMARY Tests', () => {
  test('[Primary] Search for a product', async ({ page }) => {
    await page.goto(url('/products'));
    const search = page.getByRole('textbox', { name: 'Search Product' });

    // 1. On Products page, type 'Tshirt' in search and click search
    await search.fill('Tshirt');
    await page.locator('#submit_search').click();
    await expect(page.getByRole('heading', { name: 'Searched Products' })).toBeVisible();
    const viewLinks = page.getByRole('link', { name: 'View Product' });
    await expect(viewLinks.first()).toBeVisible();
    // All results relate to the term (site names include "Tshirt", "T-Shirt", "T SHIRT")
    const productNames = page.getByRole('paragraph').filter({ hasText: /t[\s-]?shirt/i });
    expect(await productNames.count()).toBeGreaterThanOrEqual(await viewLinks.count());

    // 2. Search for a nonsense term (e.g. 'zzzzqq')
    await search.fill('zzzzqq');
    await page.locator('#submit_search').click();
    await expect(page.getByRole('heading', { name: 'Searched Products' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'View Product' })).toHaveCount(0);
    await expect(page.getByText('Add to cart')).toHaveCount(0);
  });
});
