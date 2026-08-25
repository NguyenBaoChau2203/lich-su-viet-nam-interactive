import { expect, test } from '@playwright/test';

test('foundation page clearly identifies itself as a technical placeholder', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Lịch sử Việt Nam — nền tảng kỹ thuật',
  );
  await expect(page.getByText(/Thiết kế sản phẩm chính thức/)).toBeVisible();
});
