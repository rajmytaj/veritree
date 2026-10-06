# Automation Exercise Test Plan

## Application Overview

Test plan for https://automationexercise.com, an e-commerce practice site. Scenarios are split into PRIMARY (critical account and revenue flows) and SECONDARY (edge cases, ancillary and informational pages). Every scenario assumes a fresh state: new browser context, no cookies, not logged in, empty cart. Scenarios needing an account register a unique user (timestamped email) and delete it afterward. Note: the site shows ad iframes and has console errors from third-party ads; ignore these, and dismiss ad overlays or the consent dialog if they block clicks.

## Test Scenarios

### 1. PRIMARY Tests

**Seed:** `tests/seed.spec.ts`

#### 1.1. [Primary] Register new user

**File:** `tests/primary/register.spec.ts`

**Steps:**
  1. Open home page, click 'Signup / Login'
    - expect: 'New User Signup!' heading is visible
  2. Enter name and unique email, click Signup
    - expect: 'Enter Account Information' page is shown
  3. Fill title, password, DOB, newsletter/offers checkboxes, first/last name, company, address, country, state, city, zipcode, mobile; click 'Create Account'
    - expect: 'Account Created!' is shown
  4. Click Continue
    - expect: 'Logged in as <name>' appears in header
  5. Cleanup (teardown, not part of the assertions): delete the created account

#### 1.2. [Primary] Delete account

**File:** `tests/primary/delete-account.spec.ts`

**Steps:**
  1. Precondition: register a unique user and be logged in (via setup helper)
    - expect: 'Logged in as <name>' appears in header
  2. Click 'Delete Account'
    - expect: 'Account Deleted!' is shown
  3. Click Continue
    - expect: Home page is shown with user logged out ('Signup / Login' visible)
  4. Attempt to log in with the deleted account's credentials
    - expect: Error 'Your email or password is incorrect!' is shown

#### 1.3. [Primary] Register with existing email

**File:** `tests/primary/register-existing-email.spec.ts`

**Steps:**
  1. Register a user, log out, then attempt signup again with the same email
    - expect: Error 'Email Address already exist!' is shown; no new account created

#### 1.4. [Primary] Login with valid credentials and logout

**File:** `tests/primary/login-logout.spec.ts`

**Steps:**
  1. Register user, logout, go to Signup / Login, enter valid email and password, click Login
    - expect: 'Logged in as <name>' visible
  2. Click Logout
    - expect: Redirected to /login; 'Login to your account' visible; Logout link gone

#### 1.5. [Primary] Login with invalid credentials

**File:** `tests/primary/login-invalid.spec.ts`

**Steps:**
  1. Enter incorrect email/password and click Login
    - expect: Error 'Your email or password is incorrect!' shown; user stays logged out
  2. Try empty fields and malformed email
    - expect: Browser required-field/email validation blocks submission

#### 1.6. [Primary] Browse all products and view product detail

**File:** `tests/primary/product-detail.spec.ts`

**Steps:**
  1. Click Products in header
    - expect: 'All Products' page lists products with image, price, name and Add to cart
  2. Click 'View Product' on the first product
    - expect: Detail page shows name, category, price, availability, condition, brand, quantity input and Add to cart

#### 1.7. [Primary] Search for a product

**File:** `tests/primary/search.spec.ts`

**Steps:**
  1. On Products page, type 'Tshirt' in search and click search
    - expect: 'Searched Products' heading; all results relate to the term
  2. Search for a nonsense term (e.g. 'zzzzqq')
    - expect: No products shown; no errors

#### 1.8. [Primary] Filter products by category and brand

**File:** `tests/primary/filter-category-brand.spec.ts`

**Steps:**
  1. Expand Category sidebar, choose Women > Dress
    - expect: Page title 'Women - Dress Products' and only dresses listed
  2. Choose Men > Tshirts, then a brand (e.g. Polo)
    - expect: Page shows 'Brand - Polo Products' with matching items only

#### 1.9. [Primary] Add products to cart and verify cart contents

**File:** `tests/primary/add-to-cart.spec.ts`

**Steps:**
  1. Hover first two products, click Add to cart, choose 'Continue Shopping' after first and 'View Cart' after second
    - expect: Cart lists both products with correct price, quantity 1 and total = price x quantity

#### 1.10. [Primary] Change quantity on product detail and add to cart

**File:** `tests/primary/cart-quantity.spec.ts`

**Steps:**
  1. Open a product detail page, set quantity to 4, click Add to cart, View Cart
    - expect: Cart shows quantity 4 and total = 4 x unit price

#### 1.11. [Primary] Remove product from cart

**File:** `tests/primary/remove-from-cart.spec.ts`

**Steps:**
  1. Add a product, open cart, click the X delete button
    - expect: Product removed; 'Cart is empty!' message with link to products

#### 1.12. [Primary] Checkout while registering during checkout (guest flow)

**File:** `tests/primary/checkout-register.spec.ts`

**Steps:**
  1. Add product, view cart, click 'Proceed To Checkout'
    - expect: Modal offers 'Register / Login' or 'Continue On Cart'
  2. Click Register / Login, sign up, create account, return to cart, Proceed To Checkout
    - expect: Address Details and Review Your Order show correct address and products
  3. Enter comment, click Place Order, enter card name, number, CVC, expiry and click 'Pay and Confirm Order'
    - expect: 'Order Placed!' / success message shown; Download Invoice available
  4. Delete the account
    - expect: 'Account Deleted!' shown

#### 1.13. [Primary] Checkout as logged-in user and verify address

**File:** `tests/primary/checkout-logged-in.spec.ts`

**Steps:**
  1. Register and log in, add product, proceed to checkout
    - expect: Delivery and billing addresses match registration data; total is correct
  2. Place order with valid payment details, download invoice, click Continue
    - expect: Order confirmed; invoice downloads; returns to home page

#### 1.14. [Primary] Payment form validation

**File:** `tests/primary/payment-validation.spec.ts`

**Steps:**
  1. Reach payment page and submit with empty fields, then with only some fields
    - expect: Browser required-field validation blocks submit; order not placed

#### 1.15. [Primary] Cart persists after login

**File:** `tests/primary/cart-persist-login.spec.ts`

**Steps:**
  1. Add product as guest, then log in with an existing account, open cart
    - expect: Previously added product is still in the cart

#### 1.16. [Primary] Add review on a product

**File:** `tests/primary/product-review.spec.ts`

**Steps:**
  1. Open product detail, in 'Write Your Review' enter name, email, review text and click Submit
    - expect: 'Thank you for your review.' success message shown
  2. Submit with empty or invalid email
    - expect: Validation prevents submission

### 2. SECONDARY Tests

**Seed:** `tests/seed.spec.ts`

#### 2.1. [Secondary] Contact Us form with file upload

**File:** `tests/secondary/contact-us.spec.ts`

**Steps:**
  1. Open Contact us, fill name, email, subject, message, upload a file, click Submit and accept the confirm dialog
    - expect: 'Success! Your details have been submitted successfully.' shown; Home button returns to home
  2. Submit with empty fields or invalid email
    - expect: Validation prevents submission

#### 2.2. [Secondary] Subscription on home page

**File:** `tests/secondary/subscription-home.spec.ts`

**Steps:**
  1. Scroll to footer, enter valid email in Subscription and click arrow
    - expect: 'You have been successfully subscribed!' shown
  2. Submit invalid email
    - expect: Validation prevents submission

#### 2.3. [Secondary] Subscription on cart page

**File:** `tests/secondary/subscription-cart.spec.ts`

**Steps:**
  1. Open cart page, scroll to footer, subscribe with valid email
    - expect: Success message shown

#### 2.4. [Secondary] Verify home page sections and navigation links

**File:** `tests/secondary/home-navigation.spec.ts`

**Steps:**
  1. Load home; check header links (Home, Products, Cart, Signup/Login, Test Cases, API Testing, Video Tutorials, Contact us)
    - expect: Each link navigates to correct URL
  2. Verify slider, category sidebar, brands sidebar, Features Items, recommended items
    - expect: All visible and populated

#### 2.5. [Secondary] View category products from home sidebar

**File:** `tests/secondary/home-category.spec.ts`

**Steps:**
  1. Click category and subcategory links in left sidebar and brands list
    - expect: Matching listings load with correct headings

#### 2.6. [Secondary] Add recommended items to cart

**File:** `tests/secondary/recommended-items.spec.ts`

**Steps:**
  1. Scroll to 'Recommended Items', click Add To Cart, View Cart
    - expect: Product appears in cart

#### 2.7. [Secondary] Scroll to top via arrow and subscription-free scroll

**File:** `tests/secondary/scroll-up.spec.ts`

**Steps:**
  1. Scroll to bottom, click the scroll-up arrow (and repeat by scrolling manually)
    - expect: Page returns to top and header slogan 'Full-Fledged practice website for Automation Engineers' is visible

#### 2.8. [Secondary] Download invoice after purchase

**File:** `tests/secondary/invoice-download.spec.ts`

**Steps:**
  1. Complete an order and click Download Invoice
    - expect: Invoice file downloads containing order details

#### 2.9. [Secondary] Empty cart state and unauthorised checkout guard

**File:** `tests/secondary/empty-cart.spec.ts`

**Steps:**
  1. Open /view_cart with nothing added
    - expect: 'Cart is empty!' with link to products
  2. Navigate directly to /checkout or /payment while logged out
    - expect: Redirected to login or empty-cart state; no order created

#### 2.10. [Secondary] Signup form validation and field edge cases

**File:** `tests/secondary/signup-validation.spec.ts`

**Steps:**
  1. Submit signup with empty name/email, invalid email, then account form missing mandatory fields
    - expect: Validation blocks each submission

#### 2.11. [Secondary] Product search with special characters and case

**File:** `tests/secondary/search-edge.spec.ts`

**Steps:**
  1. Search with uppercase, lowercase, whitespace, symbols and very long strings
    - expect: Case-insensitive results; no crash or script injection

#### 2.12. [Secondary] Product detail via direct URL and invalid ID

**File:** `tests/secondary/product-direct-url.spec.ts`

**Steps:**
  1. Open /product_details/1 then /product_details/99999
    - expect: Valid ID shows product; invalid ID shows graceful empty/error page

#### 2.13. [Secondary] Non-existent page (404)

**File:** `tests/secondary/not-found.spec.ts`

**Steps:**
  1. Open /does-not-exist
    - expect: A 404 / not-found page is shown with no stack trace

#### 2.14. [Secondary] Responsive layout

**File:** `tests/secondary/responsive.spec.ts`

**Steps:**
  1. Resize viewport to mobile width (375px) and open home and products pages
    - expect: Navigation collapses to a menu; no horizontal overflow; products remain usable
