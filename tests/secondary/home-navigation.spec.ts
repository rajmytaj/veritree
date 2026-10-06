// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../primary/fixtures';

test.describe('2. SECONDARY Tests', () => {
  test('[Secondary] Verify home page sections and navigation links', async ({ page }) => {
    await page.addLocatorHandler(page.getByRole('button', { name: 'Consent' }), async (btn) => {
      await btn.click();
    });

    // 1. Load home; check header links
    await page.goto('https://automationexercise.com/');
    await expect(page).toHaveTitle('Automation Exercise');

    const nav = page.getByRole('banner');
    const internalLinks: Array<[string, RegExp]> = [
      ['Products', /\/products$/],
      ['Cart', /\/view_cart$/],
      ['Signup / Login', /\/login$/],
      ['Test Cases', /\/test_cases$/],
      ['API Testing', /\/api_list$/],
      ['Contact us', /\/contact_us$/],
    ];
    for (const [name, url] of internalLinks) {
      await nav.getByRole('link', { name }).click();
      await expect(page).toHaveURL(url);
      await nav.getByRole('link', { name: 'Home' }).click();
      await expect(page).toHaveURL('https://automationexercise.com/');
    }
    // Video Tutorials is an external YouTube link; verify its target without leaving the site
    await expect(nav.getByRole('link', { name: 'Video Tutorials' })).toHaveAttribute(
      'href',
      /youtube\.com\/c\/AutomationExercise/
    );

    // 2. Verify slider, category sidebar, brands sidebar, Features Items, recommended items
    await expect(page.locator('#slider-carousel')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Full-Fledged practice website for Automation Engineers' }).first()
    ).toBeVisible();

    const sidebar = page.locator('.left-sidebar');
    await expect(sidebar.getByRole('heading', { name: 'Category' })).toBeVisible();
    // Case-sensitive, end-anchored so 'Men' does not also match 'Women'
    for (const cat of [/^\W*Women\s*$/, /^\W*Men\s*$/, /^\W*Kids\s*$/]) {
      await expect(sidebar.getByRole('link', { name: cat })).toBeVisible();
    }
    await expect(sidebar.getByRole('heading', { name: 'Brands' })).toBeVisible();
    for (const brand of ['Polo', 'H&M', 'Madame', 'Biba']) {
      await expect(sidebar.getByRole('link', { name: brand })).toBeVisible();
    }

    await expect(page.getByRole('heading', { name: 'Features Items' })).toBeVisible();
    expect(await page.locator('.features_items .productinfo').count()).toBeGreaterThan(0);

    await expect(page.getByRole('heading', { name: 'recommended items' })).toBeVisible();
    expect(await page.locator('#recommended-item-carousel .productinfo').count()).toBeGreaterThan(0);
  });
});
