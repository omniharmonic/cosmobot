import { test, expect } from '@playwright/test';

test('debug button click', async ({ page }) => {
  // Listen to console messages
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('/');

  // Wait for welcome message
  await expect(page.locator('.message-content')).toContainText('Welcome to OpenCivics');

  // Check if buttons are visible
  const startButton = page.locator('button:has-text("Start Quiz")');
  await expect(startButton).toBeVisible();

  console.log('About to click Start Quiz button...');
  await startButton.click();

  // Wait a moment to see what happens
  await page.waitForTimeout(3000);

  // Check current page state
  const messages = await page.locator('.chat-message').count();
  console.log('Number of messages after click:', messages);

  // Check if user message appeared
  const userMessage = page.locator('.chat-message.user');
  const hasUserMessage = await userMessage.count() > 0;
  console.log('Has user message:', hasUserMessage);

  if (hasUserMessage) {
    const userMessageText = await userMessage.textContent();
    console.log('User message text:', userMessageText);
  }
});