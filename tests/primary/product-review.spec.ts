// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts
import { test, expect, url } from './fixtures';

test.describe('1. PRIMARY Tests', () => {
  test('[Primary] Add review on a product', async ({ page }) => {
    await page.goto(url('/product_details/1'));
    await expect(page.getByRole('link', { name: 'Write Your Review' })).toBeVisible();
    const name = page.getByRole('textbox', { name: 'Your Name' });
    const email = page.getByRole('textbox', { name: 'Email Address', exact: true });
    const review = page.getByRole('textbox', { name: 'Add Review Here!' });
    const submit = page.getByRole('button', { name: 'Submit' });

    // 1. Open product detail, in 'Write Your Review' enter name, email, review text and click Submit
    await name.fill('Tester');
    await email.fill('tester@example.com');
    await review.fill('Great product, would buy again.');
    await submit.click();
    await expect(page.getByText('Thank you for your review.')).toBeVisible();

    // 2. Submit with empty or invalid email
    await page.goto(url('/product_details/1'));
    await name.fill('Tester');
    await review.fill('Another review');
    await submit.click();
    expect(await email.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
    // The success text exists in the DOM but stays hidden until a valid submit
    await expect(page.getByText('Thank you for your review.')).toBeHidden();

    await email.fill('not-an-email');
    await submit.click();
    expect(await email.evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBe(true);
    await expect(page.getByText('Thank you for your review.')).toBeHidden();
  });
});
