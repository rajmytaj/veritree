import { test as base, expect, selectors, type APIRequestContext, type Page } from '@playwright/test';

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

/** Creates the account through POST /api/createAccount. The API reports its result in the JSON body (responseCode). */
export async function createUserViaApi(request: APIRequestContext, user: User) {
  const response = await request.post(url('/api/createAccount'), {
    form: {
      name: user.name,
      email: user.email,
      password: user.password,
      title: 'Mr',
      birth_date: '10',
      birth_month: '5',
      birth_year: '1990',
      firstname: user.firstName,
      lastname: user.lastName,
      company: user.company,
      address1: user.address,
      address2: '',
      country: user.country,
      zipcode: user.zipcode,
      state: user.state,
      city: user.city,
      mobile_number: user.mobile,
    },
  });
  const body = JSON.parse(await response.text());
  expect(body.responseCode, `createAccount: ${body.message}`).toBe(201);
}

/** Best-effort DELETE /api/deleteAccount; tolerates an account that is already gone and never throws. */
export async function deleteUserViaApi(request: APIRequestContext, user: Pick<User, 'email' | 'password'>) {
  try {
    await request.delete(url('/api/deleteAccount'), {
      form: { email: user.email, password: user.password },
      timeout: 15_000,
    });
  } catch {
    // best-effort cleanup
  }
}

export const test = base.extend<{ user: User; apiUser: User }>({
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

  // A unique user that is NOT created up front (for tests that register through the UI).
  // Teardown deletes the account via the API if it exists.
  user: async ({ request }, use) => {
    const user = newUser();
    await use(user);
    await deleteUserViaApi(request, user);
  },

  // A unique user created through the API before the test and deleted via the API afterwards
  // (tolerates the test having already deleted it).
  apiUser: async ({ request }, use) => {
    const user = newUser();
    await createUserViaApi(request, user);
    await use(user);
    await deleteUserViaApi(request, user);
  },
});

export { expect };

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

/** Logs in through the UI form and waits until the header shows the logged-in user. */
export async function loginAndVerify(page: Page, user: User) {
  await login(page, user);
  await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();
}

/** Adds product N via the product list (hover, then overlay Add to cart). index is zero-based. */
export async function addProductFromList(page: Page, index: number) {
  await page.getByRole('img', { name: 'ecommerce website products' }).nth(index).hover();
  // Each card renders two "Add to cart" texts: the visible one and the hover overlay.
  await page.getByText('Add to cart').nth(index * 2 + 1).click();
}
