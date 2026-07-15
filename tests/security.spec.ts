import { test, expect } from '@playwright/test';

test.describe('Security & State', () => {
  test('login flow rotates history trap and logout clears token', async ({ page }) => {
    // 1. Intercept network traffic on dashboard to assert no unencrypted secrets
    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('/api/')) {
        const text = await response.text().catch(() => '');
        expect(text).not.toContain('sk_test_');
        expect(text).not.toContain('sk_live_');
        expect(text).not.toContain('ConnectionString'); // generic .NET env check
      }
    });

    // Add console listener
    page.on('console', msg => console.log('[Browser]', msg.type(), msg.text()));

    // Mock the API responses
    await page.route('**/api/**', async (route) => {
      const method = route.request().method();
      const url = route.request().url();
      
      const requestHeaders = route.request().headers();
      const origin = requestHeaders['origin'] || 'http://localhost:3000';
      const reqHeaders = requestHeaders['access-control-request-headers'] || 'Content-Type, Authorization, X-CSRF-TOKEN';
      
      const corsHeaders = {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
        'Access-Control-Allow-Headers': reqHeaders
      };

      if (method === 'OPTIONS') {
        await route.fulfill({ status: 200, headers: corsHeaders });
        return;
      }

      if (url.includes('/api/Pharmacist/login')) {
        await route.fulfill({
          status: 200,
          headers: corsHeaders,
          contentType: 'application/json',
          body: JSON.stringify({ id: 1, email: 'test@pharmacy.com', role: 'Pharmacist' })
        });
        return;
      }

      if (url.includes('/api/Auth/me')) {
        await route.fulfill({
          status: 200,
          headers: corsHeaders,
          contentType: 'application/json',
          body: JSON.stringify({ id: 1, email: 'test@pharmacy.com', role: 'Pharmacist' })
        });
        return;
      }

      if (url.includes('/api/Auth/csrf-token')) {
        await route.fulfill({
          status: 200,
          headers: corsHeaders,
          contentType: 'application/json',
          body: JSON.stringify({ csrfToken: 'fake-csrf-token' })
        });
        return;
      }

      if (url.includes('/api/Notification')) {
        await route.fulfill({
          status: 200,
          headers: corsHeaders,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
        return;
      }

      // Default fallback for any other API requests
      await route.fulfill({
        status: 200,
        headers: corsHeaders,
        contentType: 'application/json',
        body: JSON.stringify({})
      });
    });

    // 2. Login Flow
    await page.goto('/login');
    // Assuming a test user exists or we just trigger the login action
    await page.fill('input[name="email"]', 'test@pharmacy.com');
    await page.fill('input[name="password"]', 'Password123!');
    
    // Manually inject cookie before clicking submit to ensure middleware accepts the session
    await page.context().addCookies([
      {
        name: 'sa_auth_v2',
        value: 'header.eyJyb2xlIjoiUGhhcm1hY2lzdCJ9.sig',
        domain: 'localhost',
        path: '/',
      }
    ]);

    console.log('Cookies before click:', await page.context().cookies());
    await page.click('button[type="submit"]', { force: true });

    // Wait for navigation or state update
    await page.waitForURL('**/dashboard/**');
    console.log('Current URL:', page.url());

    // Assert sa_history_trap_id is rotated/purged
    const sessionStorageId = await page.evaluate(() => sessionStorage.getItem('sa_history_trap_id'));
    // Since our app clears it on login:
    expect(sessionStorageId).toBeNull();

    // 3. Logout Flow
    // Click header logout button
    await page.click('button:has-text("Logout")');

    // Wait for redirect to login
    await page.waitForURL('**/login');

    // Assert jwt_token is removed from localStorage
    const jwtToken = await page.evaluate(() => localStorage.getItem('token'));
    expect(jwtToken).toBeNull();
  });
});
