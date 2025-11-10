import { test, expect } from '@playwright/test';

test.describe('Chat Interface E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display welcome message and buttons on initial load', async ({ page }) => {
    // Check that the page loads
    await expect(page).toHaveTitle(/OpenCivics/);

    // Check header with logo
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('img[alt="OpenCivics"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('OpenCivics');

    // Check theme toggle
    await expect(page.locator('button[aria-label*="Switch to"]')).toBeVisible();

    // Wait for welcome message to appear
    await expect(page.locator('.chat-messages')).toBeVisible();

    // Should have welcome message
    await expect(page.locator('.message-content')).toContainText('Welcome to OpenCivics');

    // Should have action buttons
    await expect(page.locator('button:has-text("Start Quiz")')).toBeVisible();
    await expect(page.locator('button:has-text("Learn More")')).toBeVisible();
    await expect(page.locator('button:has-text("Explore Resources")')).toBeVisible();

    // Check chat input is present
    await expect(page.locator('.chat-input')).toBeVisible();
    await expect(page.locator('.chat-send-button')).toBeVisible();
  });

  test('should handle Start Quiz flow', async ({ page }) => {
    // Wait for initial load
    await expect(page.locator('button:has-text("Start Quiz")')).toBeVisible();

    // Click Start Quiz button
    await page.locator('button:has-text("Start Quiz")').click();

    // Should show user message
    await expect(page.locator('.chat-message.user')).toContainText('Start Quiz');

    // Wait for bot response (typing indicator may be too fast to catch)
    await page.waitForTimeout(1000);

    // Wait for bot response asking for name
    await expect(page.locator('.chat-message.bot').last().locator('.message-content')).toContainText('what should I call you?');

    // Should show name input field
    await expect(page.locator('.message-input')).toBeVisible();
    await expect(page.locator('input[placeholder*="Enter your name"]')).toBeVisible();
  });

  test('should complete name input and show resource question', async ({ page }) => {
    // Start quiz
    await page.locator('button:has-text("Start Quiz")').click();

    // Wait for name input
    await expect(page.locator('input[placeholder*="Enter your name"]')).toBeVisible();

    // Enter name
    await page.locator('input[placeholder*="Enter your name"]').fill('John Doe');
    await page.locator('.message-submit-button').click();

    // Should show user message with name
    await expect(page.locator('.chat-message.user').last()).toContainText('John Doe');

    // Wait for bot response with resource question
    await expect(page.locator('.chat-message.bot').last().locator('.message-content')).toContainText('Great to meet you, John Doe!');
    await expect(page.locator('.chat-message.bot').last().locator('.message-content')).toContainText('what resource would you most naturally contribute?');

    // Should show resource options
    await expect(page.locator('button:has-text("Time to learn and explore")')).toBeVisible();
    await expect(page.locator('button:has-text("Time to organize and facilitate")')).toBeVisible();
    await expect(page.locator('button:has-text("Skills to build tools and systems")')).toBeVisible();
    await expect(page.locator('button:has-text("Financial resources to fund innovation")')).toBeVisible();
    await expect(page.locator('button:has-text("A combination of the above")')).toBeVisible();
  });

  test('should handle resource selection and continue quiz flow', async ({ page }) => {
    // Complete name entry
    await page.locator('button:has-text("Start Quiz")').click();
    await expect(page.locator('input[placeholder*="Enter your name"]')).toBeVisible();
    await page.locator('input[placeholder*="Enter your name"]').fill('John Doe');
    await page.locator('.message-submit-button').click();

    // Wait for resource options
    await expect(page.locator('button:has-text("Time to learn and explore")')).toBeVisible();

    // Select a resource option
    await page.locator('button:has-text("Time to learn and explore")').click();

    // Should show user selection
    await expect(page.locator('.chat-message.user').last()).toContainText('Time to learn and explore');

    // Should continue with next question (participation_mode)
    await expect(page.locator('.chat-message.bot').last().locator('.message-content')).toContainText('How do you see yourself participating');

    // Should show participation options
    await expect(page.locator('button:has-text("Learning & exploring")')).toBeVisible();
    await expect(page.locator('button:has-text("Building & prototyping")')).toBeVisible();
    await expect(page.locator('button:has-text("Organizing & weaving")')).toBeVisible();
    await expect(page.locator('button:has-text("Funding & resourcing")')).toBeVisible();
    await expect(page.locator('button:has-text("Still exploring")')).toBeVisible();
  });

  test('should complete full quiz flow', async ({ page }) => {
    // Start and complete name
    await page.locator('button:has-text("Start Quiz")').click();
    await expect(page.locator('input[placeholder*="Enter your name"]')).toBeVisible();
    await page.locator('input[placeholder*="Enter your name"]').fill('Jane Smith');
    await page.locator('.message-submit-button').click();

    // Select first resource option
    await expect(page.locator('button:has-text("Skills and expertise to build tools, systems, or infrastructure")')).toBeVisible();
    await page.locator('button:has-text("Skills and expertise to build tools, systems, or infrastructure")').click();

    // Answer participation question
    await expect(page.locator('button:has-text("Building & prototyping")')).toBeVisible();
    await page.locator('button:has-text("Building & prototyping")').click();

    // Answer engagement stage question
    await expect(page.locator('button:has-text("Building — Already working on a civic project")')).toBeVisible();
    await page.locator('button:has-text("Building — Already working on a civic project")').click();

    // Answer time commitment question
    await expect(page.locator('button:has-text("Dedicated — Multiple hours per week")')).toBeVisible();
    await page.locator('button:has-text("Dedicated — Multiple hours per week")').click();

    // Should complete and show archetype analysis
    await expect(page.locator('.chat-message.bot').last().locator('.message-content')).toContainText('Based on your responses');
    await expect(page.locator('.chat-message.bot').last().locator('.message-content')).toContainText('allies');
  });

  test('should handle theme switching', async ({ page }) => {
    // Check initial theme
    const html = page.locator('html');
    await expect(html).toHaveClass(/light/);

    // Click theme toggle
    await page.locator('button[aria-label*="Switch to"]').click();

    // Should switch to dark mode
    await expect(html).toHaveClass(/dark/);

    // Click again to switch back
    await page.locator('button[aria-label*="Switch to"]').click();

    // Should switch back to light mode
    await expect(html).toHaveClass(/light/);
  });

  test('should handle direct text input in chat', async ({ page }) => {
    // Wait for initial load
    await expect(page.locator('.chat-input')).toBeVisible();

    // Type a custom message
    await page.locator('.chat-input').fill('Hello, I want to learn about OpenCivics');
    await page.locator('.chat-send-button').click();

    // Should show user message
    await expect(page.locator('.chat-message.user')).toContainText('Hello, I want to learn about OpenCivics');

    // Should get a bot response
    await expect(page.locator('.chat-message.bot').last().locator('.message-content')).toContainText('Tell me more about what brings you to OpenCivics');

    // Should show textarea for longer response
    await expect(page.locator('textarea[placeholder*="Share your thoughts"]')).toBeVisible();
  });

  test('should show error handling for failed API calls', async ({ page }) => {
    // Intercept API calls to simulate failure
    await page.route('/api/chat/onboarding', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' })
      });
    });

    // Try to start quiz
    await page.locator('button:has-text("Start Quiz")').click();

    // Should show error fallback message
    await expect(page.locator('.chat-message.bot').last().locator('.message-content')).toContainText('I apologize, but I encountered an issue');
  });

  test('should persist conversation history', async ({ page }) => {
    // Complete a few interactions
    await page.locator('button:has-text("Start Quiz")').click();
    await expect(page.locator('input[placeholder*="Enter your name"]')).toBeVisible();
    await page.locator('input[placeholder*="Enter your name"]').fill('Test User');
    await page.locator('.message-submit-button').click();

    // Check that all messages are still visible
    await expect(page.locator('.chat-message')).toHaveCount.greaterThan(2);
    await expect(page.locator('.chat-message.user')).toContainText('Start Quiz');
    await expect(page.locator('.chat-message.user')).toContainText('Test User');
  });

  test('should handle browser refresh gracefully', async ({ page }) => {
    // Start interaction
    await page.locator('button:has-text("Start Quiz")').click();

    // Refresh page
    await page.reload();

    // Should return to initial state
    await expect(page.locator('button:has-text("Start Quiz")')).toBeVisible();
    await expect(page.locator('.message-content')).toContainText('Welcome to OpenCivics');
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that interface is still functional
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('.chat-messages')).toBeVisible();
    await expect(page.locator('.chat-input-container')).toBeVisible();

    // Try basic interaction
    await page.locator('button:has-text("Start Quiz")').click();
    await expect(page.locator('input[placeholder*="Enter your name"]')).toBeVisible();
  });
});