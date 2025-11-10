#!/usr/bin/env node

const API_BASE = 'http://localhost:3000';

async function testNotionRecommendations() {
  console.log('Testing quiz completion with Notion recommendations...\n');

  try {
    // Step 1: Start quiz
    console.log('1. Starting quiz...');
    const startResponse = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'start_quiz',
        conversationHistory: [],
        sessionId: 'test_session_notion_001'
      })
    });

    const startData = await startResponse.json();
    console.log('✓ Quiz started');

    // Step 2: Click Start Quiz button
    console.log('2. Starting quiz flow...');
    const nameResponse = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Start Quiz',
        conversationHistory: [startData.message],
        sessionId: 'test_session_notion_001'
      })
    });

    const nameData = await nameResponse.json();
    console.log('✓ Name collection started');

    // Step 3: Provide name
    console.log('3. Providing name...');
    const q1Response = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'intro_welcome:TestUser_NotionTest',
        conversationHistory: [startData.message, nameData.message],
        sessionId: 'test_session_notion_001'
      })
    });

    const q1Data = await q1Response.json();
    const profileId = q1Data.profile?.id;
    console.log('✓ Name provided, profile created:', profileId);

    if (!q1Data.message.buttons) {
      throw new Error('No buttons in first quiz question');
    }

    // Step 4: Answer resource contribution question
    console.log('4. Answering resource contribution...');
    const firstAnswer = q1Data.message.buttons[0]; // "Time to learn and explore civic innovation"

    const q2Response = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: firstAnswer.label,
        profileId: profileId,
        conversationHistory: [startData.message, nameData.message, q1Data.message],
        sessionId: 'test_session_notion_001'
      })
    });

    const q2Data = await q2Response.json();
    console.log('✓ First question answered');

    let currentData = q2Data;
    let conversationHistory = [startData.message, nameData.message, q1Data.message];

    // Continue through remaining questions quickly
    for (let i = 0; i < 3; i++) {
      console.log(`${5 + i}. Answering question ${i + 2}...`);

      if (!currentData.message.buttons) {
        // This means we've reached completion!
        console.log('🎉 Quiz completed! Checking results...');

        // Check if we got proper archetype results
        if (currentData.message.content.includes('Amazing') && currentData.message.content.includes('confidence')) {
          console.log('✓ Archetype results displayed properly');

          // Check if we have explore interests button
          const exploreButton = currentData.message.buttons?.find(b => b.value === 'explore_interests');
          if (exploreButton) {
            console.log('✓ Interest exploration option available');

            // Test interest exploration
            console.log('\n7. Testing interest exploration...');
            conversationHistory.push(currentData.message);
            const interestResponse = await fetch(`${API_BASE}/api/chat/onboarding`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: 'explore_interests',
                profileId: profileId,
                conversationHistory: conversationHistory,
                sessionId: 'test_session_notion_001'
              })
            });

            const interestData = await interestResponse.json();
            console.log('✓ Interest exploration started');

            if (interestData.message.inputField) {
              console.log('✓ Interest input field provided');

              // Provide interests
              const interestInput = 'interest_exploration:I am passionate about regenerative economics, blockchain governance, and community organizing. I want to help build tools for collective decision making.';

              const recommendationResponse = await fetch(`${API_BASE}/api/chat/onboarding`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  message: interestInput,
                  profileId: profileId,
                  conversationHistory: [startData.message, nameData.message, q1Data.message, q2Data.message, interestData.message],
                  sessionId: 'test_session_notion_001'
                })
              });

              const recommendationData = await recommendationResponse.json();

              if (recommendationData.message.content.includes('resources') || recommendationData.message.content.includes('found')) {
                console.log('✓ Resource recommendations provided!');
                console.log('Content preview:', recommendationData.message.content.substring(0, 200) + '...');
              } else {
                console.log('⚠️  No clear resource recommendations found');
              }
            } else {
              console.log('✗ No interest input field provided');
            }
          } else {
            console.log('✗ No explore interests button found');
          }
        } else {
          console.log('✗ Archetype results not properly displayed');
          console.log('Content:', q2Data.message.content.substring(0, 200));
        }

        break;
      }

      // Continue with next question if buttons exist
      const nextAnswer = currentData.message.buttons[0];
      conversationHistory.push(currentData.message);

      const nextResponse = await fetch(`${API_BASE}/api/chat/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: nextAnswer.label,
          profileId: profileId,
          conversationHistory: conversationHistory,
          sessionId: 'test_session_notion_001'
        })
      });

      currentData = await nextResponse.json();
    }

    console.log('\n🎉 Test completed!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

testNotionRecommendations();