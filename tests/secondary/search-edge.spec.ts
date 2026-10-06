// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts

import type { Page } from '@playwright/test';
import { test, expect } from '../primary/fixtures';

test.describe('2. SECONDARY Tests', () => {
  test('[Secondary] Product search with special characters and case', async ({ page }) => {
    await page.addLocatorHandler(page.getByRole('button', { name: 'Consent' }), async (btn) => {
      await btn.click();
    });

    // Any JS dialog (e.g. from script injection) is a failure
    let dialogSeen = false;
    page.on('dialog', async (dialog) => {
      dialogSeen = true;
      await dialog.dismiss();
    });

    await page.goto('https://automationexercise.com/products');

    const search = async (term: string, heading = 'Searched Products') => {
      await page.getByRole('textbox', { name: 'Search Product' }).fill(term);
      await page.locator('#submit_search').click();
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    };
    const resultNames = async (p: Page) =>
      (await p.locator('.features_items .productinfo p').allInnerTexts()).map((t) => t.trim()).sort();

    // 1. Search with uppercase, lowercase, whitespace, symbols and very long strings
    await search('tshirt');
    const lower = await resultNames(page);
    expect(lower.length).toBeGreaterThan(0);

    // expect: case-insensitive results
    await search('TSHIRT');
    expect(await resultNames(page)).toEqual(lower);
    await search('TsHiRt');
    expect(await resultNames(page)).toEqual(lower);

    // whitespace only: no crash; the site trims it and falls back to the full "All Products" listing
    await search('   ', 'All Products');

    // symbols and script injection: no results, no crash, no script execution
    for (const term of ['!@#$%^&*()', "' OR 1=1 --", '<script>alert(1)</script>', '<img src=x onerror=alert(1)>']) {
      await search(term);
      expect(await page.locator('.features_items .productinfo').count()).toBe(0);
      await expect(page.getByText(/Traceback|Exception|Server Error/i)).toBeHidden();
    }

    // very long string
    await search('a'.repeat(1000));
    expect(await page.locator('.features_items .productinfo').count()).toBe(0);
    await expect(page.getByRole('heading', { name: 'Searched Products' })).toBeVisible();

    expect(dialogSeen).toBe(false);
  });
});
