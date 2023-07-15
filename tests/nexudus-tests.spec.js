/// <reference types="playwright" />

// @ts-check
const { test, expect } = require("@playwright/test");

const invalidUserName = 'bad@example.com';
const invalidPassword = 'badpassword';
const validUserName = 'adrian+1004930927@nexudus.com';
const validPassword = 'i0i1lgVD8OK8';

test.describe('Login Page', () => {

    test('001 - shows clear error message when invalid details are provided', async({ page }) => {
        await logUserIn(page, invalidUserName, invalidPassword);

        await page.locator('//div[contains(@class, "euiCallOut--Danger")]/div').isVisible();

        await expect(page.locator('div').filter({ hasText: 'The email or password is incorrect' }).first()).toBeVisible();
    });

    test('002 - logs user in when valid details are provided', async({ page }) => {
        await logUserIn(page, validUserName, validPassword);

        await expect(page.getByTitle('Dashboard')).toBeVisible();

    });


});

test.describe('Products Page', () => {

    test('003 - should allow user to add and delete a product from products list', async({ page }) => {
        await logUserIn(page, validUserName, validPassword);

        await expect(page.getByTitle('Dashboard')).toBeVisible();

        await page.goto('/billing/products');

        await expect(page.locator('button').filter({ hasText: 'Add product'})).toBeVisible({ timeout: 10000});

        await page.locator('button').filter({ hasText: 'Add product'}).click();

        await page.locator('button').filter({ hasText: 'Manual entry'}).click();

        await expect(page.getByRole('heading', { name: 'Add product' }).getByText('Add product')).toBeVisible();

        const productName = 'Hello World Product ' + Date.now().toString();
        console.log(productName);
        await page.getByLabel('Product name').fill(productName);
        await page.getByLabel('Product description').type('This is a Hello World Product');
        await page.keyboard.down('Tab');
        await page.getByLabel('Unit price').clear();
        await page.getByLabel('Unit price').fill('1.99');
        
        await delay(2000);
        await page.getByRole('button', { name: 'Save changes' }).click();
        await delay(2000);
        
        if (await page.locator('button').filter({ hasText: 'Manual entry'}).isVisible({ timeout: 3000 })) {
            await page.getByRole('button', { name: 'Close', exact: true }).click();
            await expect(page.locator('button').filter({ hasText: 'Manual entry'})).toBeHidden({ timeout: 10000});
        }
        
        await expect(page.locator('button').filter({ hasText: 'Add product'})).toBeVisible({ timeout: 10000});
        await expect(page.getByLabel('Search this table')).toBeVisible();
        await page.getByLabel('Search this table').type(productName);

        await expect(page.getByRole('table').getByRole('row')).toHaveCount(2, {timeout: 10000});
        await expect(page.getByRole('table').getByRole('row').nth(1).getByRole('cell').nth(1)).toContainText(productName);

        await page.getByRole('table').getByRole('row').nth(1).getByRole('checkbox').check();
        await page.getByRole('button', { name: 'Delete 1 record' }).click();
        await page.getByRole('button', { name: 'Yes, do it' }).click();
        await expect(page.getByRole('button', { name: 'Delete 1 record' })).toBeHidden({ timeout: 10000 });
        
        await expect(page.locator('button').filter({ hasText: 'Add product'})).toBeVisible({ timeout: 10000});
        await expect(page.getByRole('table').getByRole('row').nth(1).getByRole('cell')).toContainText('No items found');
    });
});

/**
 * @param {import("playwright-core").Page} page
 * @param {string} username
 * @param {string} password
 */
async function logUserIn(page, username, password) {
    await page.goto('/');

    await expect(page).toHaveTitle(/Sign in to Nexudus Platform/);

    await page.getByRole("textbox", { name: 'Email' }).fill(username);

    await page.getByRole("textbox", { name: 'Password' }).fill(password);

    await page.getByRole("button").filter({ hasText: "Sign in", hasNotText: "Active Directory" }).click();

}

// some delay needs to be injected, as the website performance is poor, and playwright actions are more rapid
// this allows the slow transitions to catch up in transitions, especially around saving products
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
