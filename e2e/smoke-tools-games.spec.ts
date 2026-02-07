import { test, expect } from '@playwright/test';
import paths from './paths.json' with { type: 'json' };

const { toolPaths, gamePaths } = paths;

for (const path of toolPaths) {
  test(`tool ${path} loads and shows main content`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('#main-content')).toBeVisible({ timeout: 15_000 });
  });
}

for (const path of gamePaths) {
  test(`game ${path} loads and shows main content`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('#main-content')).toBeVisible({ timeout: 15_000 });
  });
}
