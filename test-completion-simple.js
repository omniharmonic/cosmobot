#!/usr/bin/env node

const API_BASE = 'http://localhost:3000';

async function testQuizCompletion() {
  console.log('Testing simple quiz completion to check exact response...\n');

  try {
    // Complete the quiz flow quickly and check the completion response
    let sessionId = 'test_completion_simple';
    let conversationHistory = [];

    // 1. Start quiz
    const startResp = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'start_quiz',
        conversationHistory: [],
        sessionId
      })
    });
    const startData = await startResp.json();
    conversationHistory.push(startData.message);

    // 2. Trigger quiz start
    const nameResp = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Start Quiz',
        conversationHistory,
        sessionId
      })
    });
    const nameData = await nameResp.json();
    conversationHistory.push(nameData.message);

    // 3. Provide name
    const profileResp = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'intro_welcome:TestUser',
        conversationHistory,
        sessionId
      })
    });
    const profileData = await profileResp.json();
    const profileId = profileData.profile?.id;
    conversationHistory.push(profileData.message);
    console.log('Profile created:', profileId);

    // 4-7. Answer all quiz questions quickly
    let currentData = profileData;
    for (let i = 0; i < 4; i++) {
      if (currentData.message.buttons && currentData.message.buttons.length > 0) {
        const answer = currentData.message.buttons[0].label;

        const resp = await fetch(`${API_BASE}/api/chat/onboarding`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: answer,
            profileId,
            conversationHistory,
            sessionId
          })
        });
        currentData = await resp.json();
        conversationHistory.push(currentData.message);

        console.log(`Question ${i + 1} answered`);

        // Check if this is the completion
        if (currentData.completed || currentData.message.content.includes('Amazing') || currentData.message.content.includes('confidence')) {
          console.log('\n🎉 QUIZ COMPLETED! Here is the response:');
          console.log('=====================================');
          console.log('Content:', currentData.message.content);
          console.log('Buttons:', currentData.message.buttons?.map(b => ({ label: b.label, value: b.value })));
          console.log('Profile archetype:', currentData.profile?.primary_archetype);
          console.log('Completed flag:', currentData.completed);
          console.log('Metadata:', currentData.metadata);
          break;
        }
      } else {
        console.log('No buttons available, stopping');
        break;
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testQuizCompletion();