import { test as base, expect, selectors, type Page } from '@playwright/test';

// The site exposes stable data-qa attributes on form controls whose <label>s are not associated with the inputs.
selectors.setTestIdAttribute('data-qa');

export const BASE_URL = 'https://automationexercise.com';
export const url = (path: string) => `${BASE_URL}${path}`;

export interface User {
  name: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  state: string;
  city: string;
  zipcode: string;
  country: string;
  mobile: string;
}

export function newUser(): User {
  const stamp = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    name: 'Test User',
    email: `pw.test.${stamp}@example.com`,
    password: 'Passw0rd!123',
    firstName: 'Test',
    lastName: 'User',
    company: 'Acme Inc',
    address: '123 Main Street',
    state: 'Ontario',
    city: 'Toronto',
    zipcode: 'M5V1A1',
    country: 'Canada',
    mobile: '5551234567',
  };
}

// Third-party ad hosts. Their interstitials (#google_vignette) swallow clicks and redirect the page,
// so they are blocked for every test. This is the main "ad overlay" handling for the suite.
const AD_HOST_PATTERN =
  /(googlesyndication|doubleclick|googleadservices|adservice\.google|googletagmanager|google-analytics|fundingchoicesmessages|adsbygoogle|adnxs|taboola|outbrain|criteo|amazon-adsystem)/i;

export const test = base.extend<{ user: User }>({
  page: async ({ page }, use) => {
    await page.route('**/*', (route) => {
      if (AD_HOST_PATTERN.test(new URL(route.request().url()).hostname)) {
        return route.abort();
      }
      return route.continue();
    });
    // Fallback: dismiss the cookie/consent dialog if it ever appears and blocks clicks.
    await page.addLocatorHandler(page.getByRole('button', { name: 'Consent' }), async (consent) => {
      await consent.click();
    });
    await use(page);
  },

  // A unique user. Teardown deletes the account if it still exists.
  user: async ({ page }, use) => {
    const user = newUser();
    await use(user);
    await deleteAccountIfExists(page, user);
  },
});

export { expect };

/** Registers `user` through the UI. Ends on the home page, logged in. */
export async function registerUser(page: Page, user: User) {
  await page.goto(url('/login'));
  await page.getByTestId('signup-name').fill(user.name);
  await page.getByTestId('signup-email').fill(user.email);
  await page.getByTestId('signup-button').click();
  await expect(page.getByRole('heading', { name: 'Enter Account Information' })).toBeVisible();
  await fillAccountForm(page, user);
  await page.getByTestId('create-account').click();
  await expect(page.getByRole('heading', { name: 'Account Created!' })).toBeVisible();
  await page.getByRole('link', { name: 'Continue' }).click();
  await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();
}

/** Fills the "Enter Account Information" form (does not submit). */
export async function fillAccountForm(page: Page, user: User) {
  await page.getByRole('radio', { name: 'Mr.' }).check();
  await page.getByTestId('password').fill(user.password);
  await page.getByTestId('days').selectOption('10');
  await page.getByTestId('months').selectOption('5');
  await page.getByTestId('years').selectOption('1990');
  await page.getByRole('checkbox', { name: 'Sign up for our newsletter!' }).check();
  await page.getByRole('checkbox', { name: 'Receive special offers from our partners!' }).check();
  await page.getByTestId('first_name').fill(user.firstName);
  await page.getByTestId('last_name').fill(user.lastName);
  await page.getByTestId('company').fill(user.company);
  await page.getByTestId('address').fill(user.address);
  await page.getByTestId('country').selectOption(user.country);
  await page.getByTestId('state').fill(user.state);
  await page.getByTestId('city').fill(user.city);
  await page.getByTestId('zipcode').fill(user.zipcode);
  await page.getByTestId('mobile_number').fill(user.mobile);
}

export async function login(page: Page, user: Pick<User, 'email' | 'password'>) {
  await page.goto(url('/login'));
  await page.getByTestId('login-email').fill(user.email);
  await page.getByTestId('login-password').fill(user.password);
  await page.getByTestId('login-button').click();
}

/** Clicks Delete Account while logged in and confirms the result page. */
export async function deleteAccount(page: Page) {
  await page.getByRole('link', { name: 'Delete Account' }).click();
  await expect(page.getByRole('heading', { name: 'Account Deleted!' })).toBeVisible();
}

/** Teardown helper: logs in and deletes the account; silently does nothing if the account is already gone. */
export async function deleteAccountIfExists(page: Page, user: User) {
  try {
    await page.context().clearCookies();
    await login(page, user);
    const loggedIn = page.getByText(`Logged in as ${user.name}`);
    const failed = page.getByText('Your email or password is incorrect!');
    await loggedIn.or(failed).first().waitFor({ timeout: 10_000 });
    if (await loggedIn.isVisible()) {
      await page.getByRole('link', { name: 'Delete Account' }).click();
      await page.getByRole('heading', { name: 'Account Deleted!' }).waitFor({ timeout: 10_000 });
    }
  } catch {
    // best-effort cleanup
  }
}

/** Adds product N via the product list (hover, then overlay Add to cart). index is zero-based. */
export async function addProductFromList(page: Page, index: number) {
  await page.getByRole('img', { name: 'ecommerce website products' }).nth(index).hover();
  // Each card renders two "Add to cart" texts: the visible one and the hover overlay.
  await page.getByText('Add to cart').nth(index * 2 + 1).click();
}
