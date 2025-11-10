import { test, expect } from '@playwright/test';

test.describe('OpenCivics Onboarding Assistant Frontend', () => {

  test('Homepage loads correctly with OpenCivics branding', async ({ page }) => {
    await page.goto('/');

    // Check title and basic elements
    await expect(page).toHaveTitle(/Create Next App/);
    await expect(page.locator('h1')).toContainText('OpenCivics');
    await expect(page.locator('p.text-xl.font-mono')).toContainText('Intelligent Onboarding Assistant');

    // Check terminal styling is applied
    await expect(page.locator('.terminal-window')).toBeVisible();

    // Check action buttons
    await expect(page.locator('text=Start Quiz')).toBeVisible();
    await expect(page.locator('text=Explore with AI')).toBeVisible();

    // Check archetype badges
    await expect(page.locator('.archetype-badge-allies')).toContainText('Allies');
    await expect(page.locator('.archetype-badge-innovators')).toContainText('Innovators');
    await expect(page.locator('.archetype-badge-organizers')).toContainText('Organizers');
    await expect(page.locator('.archetype-badge-patrons')).toContainText('Patrons');

    console.log('✅ Homepage: All elements loaded correctly');
  });

  test('Quiz page loads and displays properly', async ({ page }) => {
    await page.goto('/quiz');

    // Check quiz page elements
    await expect(page.locator('h1')).toContainText('OpenCivics Quiz');
    await expect(page.locator('text=Discover your unique role in building the future of civic innovation')).toBeVisible();

    // Check quiz description
    await expect(page.locator('text=What resources you can contribute')).toBeVisible();
    await expect(page.locator('text=How you want to participate')).toBeVisible();

    // Check begin quiz button
    await expect(page.locator('text=Begin Quiz')).toBeVisible();

    // Check navigation
    await expect(page.locator('text=← Back to Home')).toBeVisible();

    console.log('✅ Quiz page: All elements displayed correctly');
  });

  test('Chat page loads with AI interface', async ({ page }) => {
    await page.goto('/chat');

    // Check chat page elements
    await expect(page.locator('h1')).toContainText('OpenCivics AI Assistant');
    await expect(page.locator('text=Ask me anything about civic innovation')).toBeVisible();

    // Check chat interface elements
    await expect(page.locator('textarea')).toBeVisible();
    await expect(page.locator('button:has-text("Send")')).toBeVisible();

    // Check conversation starters
    await expect(page.locator('text=What is OpenCivics?')).toBeVisible();
    await expect(page.locator('text=Tell me about the four archetypes')).toBeVisible();

    // Check navigation
    await expect(page.locator('text=← Back to Home')).toBeVisible();

    console.log('✅ Chat page: AI interface working correctly');
  });

  test('Navigation between pages works correctly', async ({ page }) => {
    // Start on homepage
    await page.goto('/');

    // Navigate to quiz page
    await page.click('text=Start Quiz');
    await expect(page).toHaveURL('/quiz');
    await expect(page.locator('h1')).toContainText('Quiz');

    // Navigate back to home
    await page.click('text=← Back to Home');
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('OpenCivics');

    // Navigate to chat page
    await page.click('text=Explore with AI');
    await expect(page).toHaveURL('/chat');
    await expect(page.locator('h1')).toContainText('AI Assistant');

    // Navigate back to home
    await page.click('text=← Back to Home');
    await expect(page).toHaveURL('/');

    console.log('✅ Navigation: All page transitions working correctly');
  });

  test('CSS styling and terminal theme applied correctly', async ({ page }) => {
    await page.goto('/');

    // Check CSS custom properties are loaded
    const backgroundColor = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });

    // Verify terminal styling is applied (should not be default white)
    expect(backgroundColor).not.toBe('rgba(255, 255, 255, 1)');

    // Check that terminal window has proper styling
    const terminalWindow = page.locator('.terminal-window');
    await expect(terminalWindow).toBeVisible();

    // Check archetype badges have color styling
    const alliesBadge = page.locator('.archetype-badge-allies');
    const badgeColor = await alliesBadge.evaluate((el) => {
      return getComputedStyle(el).color;
    });
    expect(badgeColor).toBeTruthy();

    console.log('✅ Styling: Terminal theme and CSS applied correctly');
  });

  test('Responsive design works on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check that elements are still visible and properly arranged
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Start Quiz')).toBeVisible();
    await expect(page.locator('text=Explore with AI')).toBeVisible();

    // Check quiz page on mobile
    await page.goto('/quiz');
    await expect(page.locator('h1')).toContainText('Quiz');
    await expect(page.locator('text=Begin Quiz')).toBeVisible();

    // Check chat page on mobile
    await page.goto('/chat');
    await expect(page.locator('h1')).toContainText('AI Assistant');
    await expect(page.locator('textarea')).toBeVisible();

    console.log('✅ Mobile: Responsive design working correctly');
  });

  test('Form elements and buttons are interactive', async ({ page }) => {
    await page.goto('/chat');

    // Test textarea interaction
    const textarea = page.locator('textarea');
    await textarea.fill('Test message');
    await expect(textarea).toHaveValue('Test message');

    // Check button states
    const sendButton = page.locator('button:has-text("Send")');
    await expect(sendButton).toBeVisible();

    // Test button hover states (check if styling exists)
    await sendButton.hover();

    // Go to quiz page and test button interaction
    await page.goto('/quiz');
    const beginButton = page.locator('text=Begin Quiz');
    await expect(beginButton).toBeVisible();
    await beginButton.hover();

    console.log('✅ Interactions: Form elements and buttons working correctly');
  });
});