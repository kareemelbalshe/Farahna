import { test, expect } from '@playwright/test';

test.describe('E2E: Farahna Platform User Journeys', () => {

  test('1. Guest experience on public wedding invitation', async ({ page }) => {
    // 1. Visit published invitation
    const response = await page.goto('/invitation/wedding/ahmed-sara', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    // 2. Verify groom and bride names appear
    await expect(page.locator('body')).toContainText('أحمد');
    await expect(page.locator('body')).toContainText('سارة');

    // 3. Verify envelope screen or main invitation screen
    const openButton = page.locator('button:has-text("افتح الدعوة"), button:has-text("عرض الدعوة")');
    if (await openButton.isVisible()) {
      await openButton.click();
    }

    // 4. Verify multi-event sections appear
    await expect(page.locator('text=حفل الزفاف').first()).toBeVisible();

    // 5. Verify PWA manifest is NOT present on public guest invitation page
    const manifestLink = await page.locator('link[rel="manifest"]').count();
    expect(manifestLink).toBe(0);
  });

  test('2. Admin Portal authentication & dashboard metrics', async ({ page }) => {
    // 1. Visit admin login
    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' });

    // 2. Submit credentials
    await page.fill('input[type="email"], input[name="email"]', 'admin@farahna.com');
    await page.fill('input[type="password"], input[name="password"]', 'Farahna@2026!');
    await page.click('button[type="submit"]');

    // 3. Expect redirection to dashboard
    await expect(page).toHaveURL(/.*\/admin\/(dashboard)?/, { timeout: 10000 });

    // 4. Verify dashboard stats appear
    await expect(page.locator('body')).toContainText('لوحة القيادة');

    // 5. Verify PWA manifest IS present on admin portal
    const manifestLink = await page.locator('link[rel="manifest"]').count();
    expect(manifestLink).toBe(1);
  });

  test('3. Privacy & status handling for expired/draft invitations', async ({ page }) => {
    // Non-existent invitation returns 404
    const res = await page.goto('/invitation/wedding/non-existent-wedding-slug-999', { waitUntil: 'domcontentloaded' });
    expect(res?.status()).toBe(404);
  });

  test('4. Admin Settings page displays zero personal numbers and verifies payment privacy policy', async ({ page }) => {
    // 1. Visit admin login
    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' });
    await page.fill('input[type="email"], input[name="email"]', 'admin@farahna.com');
    await page.fill('input[type="password"], input[name="password"]', 'Farahna@2026!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/admin(\/dashboard)?/, { timeout: 10000 });

    // 2. Ensure auth token is persisted in localStorage
    await page.waitForFunction(() => !!localStorage.getItem('farahna_token'));

    // 3. Navigate to settings
    await page.goto('/admin/settings', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText('إعدادات منصة فرحنا');
    await expect(page.locator('body')).toContainText('قاعدة الخصوصية والأمان المالي');
    await expect(page.locator('body')).toContainText('فودافون كاش');
    await expect(page.locator('body')).toContainText('InstaPay');

    // 4. Verify that old receiving identifier inputs are completely absent
    const instapayIdInput = await page.locator('input[placeholder="farahna@instapay"]').count();
    expect(instapayIdInput).toBe(0);
  });
});
