#!/usr/bin/env node

const API_BASE = 'http://localhost:3000';

async function testQuizFlow() {
  console.log('Testing complete quiz flow (with proper labels)...\n');

  try {
    // Step 1: Start quiz
    console.log('1. Starting quiz...');
    const startResponse = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'start_quiz',
        conversationHistory: [],
        sessionId: 'test_session_quiz_789'
      })
    });

    const startData = await startResponse.json();
    console.log('✓ Quiz started:', startData.message.content);

    // Step 2: Click Start Quiz button to get the name question
    console.log('\n2. Clicking Start Quiz button...');
    const nameResponse = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Start Quiz',  // This should be the button label
        conversationHistory: [
          {
            role: 'user',
            content: 'start_quiz',
            timestamp: new Date()
          },
          startData.message
        ],
        sessionId: 'test_session_quiz_789'
      })
    });

    const nameData = await nameResponse.json();
    console.log('✓ Name question:', nameData.message.content.substring(0, 100) + '...');

    // Step 3: Provide name
    console.log('\n3. Providing name...');
    const q1Response = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'intro_welcome:TestUser789',  // Provide actual name input
        conversationHistory: [
          {
            role: 'user',
            content: 'start_quiz',
            timestamp: new Date()
          },
          startData.message,
          {
            role: 'user',
            content: 'Start Quiz',
            timestamp: new Date()
          },
          nameData.message
        ],
        sessionId: 'test_session_quiz_789'
      })
    });

    const q1Data = await q1Response.json();
    console.log('✓ First quiz question:', q1Data.message.content.substring(0, 100) + '...');
    console.log('✓ Buttons available:', q1Data.message.buttons ? q1Data.message.buttons.map(b => b.label) : 'None');

    // Extract profile ID for subsequent requests
    const profileId = q1Data.profile?.id;
    console.log('✓ Profile ID:', profileId);

    if (!q1Data.message.buttons) {
      console.log('✗ No buttons for first quiz question');
      return;
    }

    // Step 4: Answer first quiz question (resource contribution)
    const firstAnswer = q1Data.message.buttons[0]; // Pick first option
    console.log(`\n4. Answering first quiz question with: "${firstAnswer.label}"`);

    const q2Response = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: firstAnswer.label,  // Send the button LABEL
        profileId: profileId,  // Include profile ID
        conversationHistory: [
          {
            role: 'user',
            content: 'start_quiz',
            timestamp: new Date()
          },
          startData.message,
          {
            role: 'user',
            content: 'Start Quiz',
            timestamp: new Date()
          },
          nameData.message,
          {
            role: 'user',
            content: 'TestUser789',
            timestamp: new Date()
          },
          q1Data.message
        ],
        sessionId: 'test_session_quiz_789'
      })
    });

    const q2Data = await q2Response.json();
    console.log('✓ Second quiz question:', q2Data.message.content.substring(0, 100) + '...');
    console.log('✓ Buttons available:', q2Data.message.buttons ? q2Data.message.buttons.map(b => b.label) : 'None');

    if (!q2Data.message.buttons) {
      console.log('✗ No buttons for second quiz question');
      return;
    }

    // Step 5: Answer second quiz question
    const secondAnswer = q2Data.message.buttons[0];
    console.log(`\n5. Answering second quiz question with: "${secondAnswer.label}"`);

    const q3Response = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: secondAnswer.label,
        profileId: profileId,  // Include profile ID
        conversationHistory: [
          {
            role: 'user',
            content: 'start_quiz',
            timestamp: new Date()
          },
          startData.message,
          {
            role: 'user',
            content: 'Start Quiz',
            timestamp: new Date()
          },
          nameData.message,
          {
            role: 'user',
            content: 'TestUser789',
            timestamp: new Date()
          },
          q1Data.message,
          {
            role: 'user',
            content: firstAnswer.label,
            timestamp: new Date()
          },
          q2Data.message
        ],
        sessionId: 'test_session_quiz_789'
      })
    });

    const q3Data = await q3Response.json();
    console.log('✓ Third quiz question:', q3Data.message.content.substring(0, 100) + '...');

    // Check if this is completion or another question
    if (q3Data.profile) {
      console.log('✓ Quiz completed! Profile created with archetype:', q3Data.profile.primary_archetype || 'Not detected');
    } else if (q3Data.message.buttons) {
      console.log('✓ More questions available, continuing...');

      // Continue with third question if available
      const thirdAnswer = q3Data.message.buttons[0];
      console.log(`\n6. Answering third quiz question with: "${thirdAnswer.label}"`);

      const completionResponse = await fetch(`${API_BASE}/api/chat/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: thirdAnswer.label,
          profileId: profileId,  // Include profile ID
          conversationHistory: [
            {
              role: 'user',
              content: 'start_quiz',
              timestamp: new Date()
            },
            startData.message,
            {
              role: 'user',
              content: 'Start Quiz',
              timestamp: new Date()
            },
            nameData.message,
            {
              role: 'user',
              content: 'TestUser789',
              timestamp: new Date()
            },
            q1Data.message,
            {
              role: 'user',
              content: firstAnswer.label,
              timestamp: new Date()
            },
            q2Data.message,
            {
              role: 'user',
              content: secondAnswer.label,
              timestamp: new Date()
            },
            q3Data.message
          ],
          sessionId: 'test_session_quiz_789'
        })
      });

      const completionData = await completionResponse.json();
      console.log('✓ Final response:', completionData.message.content.substring(0, 200) + '...');

      if (completionData.profile) {
        console.log('✓ Quiz completed! Profile created with archetype:', completionData.profile.primary_archetype || 'Not detected');
      } else {
        console.log('✗ Quiz did not complete - no profile created');
      }
    } else {
      console.log('✗ Unexpected response format');
    }

    console.log('\n🎉 Quiz flow test completed!');

  } catch (error) {
    console.error('\n❌ Quiz flow test failed:', error.message);
  }
}

testQuizFlow();