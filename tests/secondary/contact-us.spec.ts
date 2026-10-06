// spec: specs/automationexercise.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../helpers/fixtures';

test.describe('2. SECONDARY Tests', () => {
  test('[Secondary] Contact Us form with file upload', async ({ page }) => {
    // Dismiss the cookie consent dialog if it appears
    await page.addLocatorHandler(page.getByRole('button', { name: 'Consent' }), async (btn) => {
      await btn.click();
    });

    // 1. Open Contact us, fill name, email, subject, message, upload a file, click Submit and accept the confirm dialog
    await page.goto('https://automationexercise.com/');
    await page.getByRole('link', { name: 'Contact us' }).click();
    await expect(page).toHaveURL(/\/contact_us/);
    await expect(page.getByRole('heading', { name: 'Get In Touch' })).toBeVisible();

    await page.getByPlaceholder('Name').fill('Test User');
    await page.getByPlaceholder('Email', { exact: true }).fill('test.user@example.com');
    await page.getByPlaceholder('Subject').fill('Automated contact test');
    await page.getByPlaceholder('Your Message Here').fill('This is an automated message.');
    await page.locator('input[name="upload_file"]').setInputFiles({
      name: 'sample.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('sample upload content'),
    });

    page.once('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Submit' }).click();

    // expect: success message shown; Home button returns to home
    // (scoped: the footer subscription alert contains the same text)
    await expect(
      page.locator('#contact-page').getByText('Success! Your details have been submitted successfully.')
    ).toBeVisible();
    await page.getByRole('link', { name: 'Home' }).first().click();
    await expect(page).toHaveURL('https://automationexercise.com/');
  });

  test('[Secondary] Contact Us form validation', async ({ page }) => {
    await page.addLocatorHandler(page.getByRole('button', { name: 'Consent' }), async (btn) => {
      await btn.click();
    });

    // 2. Submit with empty fields or invalid email
    await page.goto('https://automationexercise.com/contact_us');
    const email = page.getByPlaceholder('Email', { exact: true });

    // Empty fields: native required validation blocks submission
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page).toHaveURL(/\/contact_us/);
    expect(await email.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
    await expect(page.getByText('Success! Your details have been submitted successfully.')).toBeHidden();

    // Invalid email: native type validation blocks submission
    await page.getByPlaceholder('Name').fill('Test User');
    await email.fill('not-an-email');
    await page.getByPlaceholder('Subject').fill('Subject');
    await page.getByPlaceholder('Your Message Here').fill('Message');
    await page.getByRole('button', { name: 'Submit' }).click();
    expect(await email.evaluate((el: HTMLInputElement) => el.validity.typeMismatch)).toBe(true);
    await expect(page.getByText('Success! Your details have been submitted successfully.')).toBeHidden();
  });
});
