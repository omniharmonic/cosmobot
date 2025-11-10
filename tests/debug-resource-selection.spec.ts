import { test, expect } from '@playwright/test';

test('debug resource selection step by step', async ({ page }) => {
  // Listen to network requests to see API calls
  page.on('request', request => {
    if (request.url().includes('/api/chat/onboarding')) {
      console.log('API Request:', request.method(), request.url());
    }
  });

  page.on('response', async response => {
    if (response.url().includes('/api/chat/onboarding')) {
      const responseData = await response.json();
      console.log('API Response:', JSON.stringify(responseData, null, 2));
    }
  });

  await page.goto('/');

  // Wait for welcome message
  await expect(page.locator('.message-content')).toContainText('Welcome to OpenCivics');

  // Click Start Quiz
  console.log('Clicking Start Quiz...');
  await page.locator('button:has-text("Start Quiz")').click();

  // Wait for name input
  await expect(page.locator('input[placeholder*="Enter your name"]')).toBeVisible();

  // Enter name
  console.log('Entering name...');
  await page.locator('input[placeholder*="Enter your name"]').fill('Test User');
  await page.locator('.message-submit-button').click();

  // Wait for resource options
  await expect(page.locator('button:has-text("Time to learn and explore")')).toBeVisible();

  // Click resource option
  console.log('Selecting resource option...');
  await page.locator('button:has-text("Time to learn and explore")').click();

  // Wait to see what happens
  await page.waitForTimeout(3000);

  // Check final state
  const messages = await page.locator('.chat-message').count();
  console.log('Total messages after resource selection:', messages);
});