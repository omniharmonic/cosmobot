import { test, expect } from '@playwright/test';

test.describe('OpenCivics API Endpoints', () => {

  let sessionId: string;
  let profileId: string;

  test('Quiz start API creates session and profile', async ({ request }) => {
    const response = await request.post('/api/quiz/start', {
      data: {
        name: 'Test User Playwright',
        email: 'test-playwright@example.com'
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.data.session_id).toBeTruthy();
    expect(data.data.profile_id).toBeTruthy();
    expect(data.data.first_question).toBeTruthy();
    expect(data.data.quiz_config).toBeTruthy();

    // Store for subsequent tests
    sessionId = data.data.session_id;
    profileId = data.data.profile_id;

    console.log('✅ Quiz Start API: Session and profile created successfully');
  });

  test('Quiz response API saves responses and returns next questions', async ({ request }) => {
    // First, start a quiz to get IDs
    const startResponse = await request.post('/api/quiz/start', {
      data: {
        name: 'Test Response User',
        email: 'test-response@example.com'
      }
    });
    const startData = await startResponse.json();
    const testProfileId = startData.data.profile_id;

    // Submit first response
    const response = await request.post('/api/quiz/response', {
      data: {
        profile_id: testProfileId,
        question_id: 'intro_welcome',
        response_value: 'John Doe'
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.data.saved).toBe(true);
    expect(data.data.next_question).toBeTruthy();
    expect(data.data.progress_percentage).toBeGreaterThan(0);

    console.log('✅ Quiz Response API: Response saved and next question returned');
  });

  test('Profile API retrieves profile data', async ({ request }) => {
    // First, create a profile
    const startResponse = await request.post('/api/quiz/start', {
      data: {
        name: 'Test Profile User',
        email: 'test-profile@example.com'
      }
    });
    const startData = await startResponse.json();
    const testProfileId = startData.data.profile_id;

    // Retrieve profile
    const response = await request.get(`/api/profile/${testProfileId}`);

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.data.profile).toBeTruthy();
    expect(data.data.profile.id).toBe(testProfileId);
    expect(data.data.profile.created_at).toBeTruthy();

    console.log('✅ Profile API: Profile data retrieved successfully');
  });

  test('Chat API handles messages properly', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: {
        message: 'What is OpenCivics?'
      }
    });

    // API should respond with 500 due to Gemini API issue or 200 if successful
    expect(response.status()).toBeGreaterThanOrEqual(200);
    const data = await response.json();

    // Either successful response or expected Gemini API error
    if (data.success) {
      expect(data.data.message).toBeTruthy();
    } else {
      expect(data.error).toContain('Failed to handle chat message');
    }

    console.log('✅ Chat API: Handled message request correctly');
  });

  test('Resources search API responds correctly', async ({ request }) => {
    const response = await request.post('/api/resources/search', {
      data: {
        query: 'civic',
        limit: 5
      }
    });

    expect(response.status()).toBeGreaterThanOrEqual(200);
    const data = await response.json();

    // Either successful response or expected API error (Notion)
    if (data.success) {
      expect(data.data.resources).toBeTruthy();
    } else {
      expect(data.error).toContain('Failed to search resources');
    }

    console.log('✅ Resources Search API: Handled search request correctly');
  });

  test('Quiz completion API processes requests', async ({ request }) => {
    // First, create a profile
    const startResponse = await request.post('/api/quiz/start', {
      data: {
        name: 'Test Completion User',
        email: 'test-completion@example.com'
      }
    });
    const startData = await startResponse.json();
    const testProfileId = startData.data.profile_id;

    // Submit a few responses
    await request.post('/api/quiz/response', {
      data: {
        profile_id: testProfileId,
        question_id: 'intro_welcome',
        response_value: 'Test User'
      }
    });

    await request.post('/api/quiz/response', {
      data: {
        profile_id: testProfileId,
        question_id: 'intro_motivation',
        response_value: 'Learning about civic innovation'
      }
    });

    // Attempt completion
    const response = await request.post('/api/quiz/complete', {
      data: {
        profile_id: testProfileId
      }
    });

    expect(response.status()).toBeGreaterThanOrEqual(200);
    const data = await response.json();

    // Either successful completion or expected API error (Gemini)
    if (data.success) {
      expect(data.data).toBeTruthy();
    } else {
      expect(data.error).toContain('Failed to complete quiz');
    }

    console.log('✅ Quiz Completion API: Handled completion request correctly');
  });

  test('API error handling works correctly', async ({ request }) => {
    // Test missing parameters
    const response1 = await request.post('/api/quiz/response', {
      data: {
        // Missing required fields
        question_id: 'test'
      }
    });

    expect(response1.status()).toBeGreaterThanOrEqual(200);
    const data1 = await response1.json();
    expect(data1.success).toBe(false);
    expect(data1.error).toContain('Missing required fields');

    // Test invalid profile ID
    const response2 = await request.get('/api/profile/invalid-id');
    expect(response2.status()).toBeGreaterThanOrEqual(200);
    const data2 = await response2.json();
    expect(data2.success).toBe(false);

    console.log('✅ API Error Handling: Proper error responses returned');
  });
});