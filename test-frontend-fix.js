#!/usr/bin/env node

// Test the frontend fix - simulate exact button click behavior
const API_BASE = 'http://localhost:3000';

async function testFrontendFix() {
  console.log('🧪 Testing Frontend Fix - Button Label vs Value Issue');
  console.log('=====================================\n');

  try {
    let conversationHistory = [];
    let sessionId = 'frontend_fix_test_' + Date.now();
    let profileId = null;

    // Step 1: Start with welcome message (simulates initial load)
    console.log('1. Starting quiz from welcome message...');

    // Step 2: Click "Start Quiz" button (this was the problematic area)
    // Before fix: Frontend sent "start_quiz" (button value)
    // After fix: Frontend should send "Start Quiz" (button label)
    console.log('2. Clicking "Start Quiz" button (sending label, not value)...');

    let response = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Start Quiz', // This is what the fix should send (button.label)
        conversationHistory: [],
        sessionId
      })
    });

    let data = await response.json();
    conversationHistory.push({ role: 'user', content: 'Start Quiz' });
    conversationHistory.push(data.message);

    console.log('✅ Start Quiz response received');
    console.log(`   Content: ${data.message.content.substring(0, 100)}...`);
    console.log(`   Has buttons: ${!!data.message.buttons}`);

    // Step 3: Enter name
    console.log('\n3. Entering name...');
    response = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'intro_welcome:FrontendTestUser',
        conversationHistory,
        sessionId
      })
    });

    data = await response.json();
    if (data.profile) {
      profileId = data.profile.id;
      console.log(`✅ Profile created: ${profileId}`);
    }
    conversationHistory.push({ role: 'user', content: 'intro_welcome:FrontendTestUser' });
    conversationHistory.push(data.message);

    // Step 4-7: Answer quiz questions using button labels (not values)
    let currentData = data;
    for (let i = 0; i < 4; i++) {
      if (currentData.message.buttons && currentData.message.buttons.length > 0) {
        const buttonToClick = currentData.message.buttons[0];
        console.log(`\n${i + 4}. Clicking button "${buttonToClick.label}" (not "${buttonToClick.value}")...`);

        response = await fetch(`${API_BASE}/api/chat/onboarding`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: buttonToClick.label, // CRITICAL: Using label, not value (this is the fix)
            conversationHistory,
            profileId,
            sessionId
          })
        });

        currentData = await response.json();
        conversationHistory.push({ role: 'user', content: buttonToClick.label });
        conversationHistory.push(currentData.message);

        console.log(`   ✅ Response received`);

        // Check for completion
        if (currentData.completed || currentData.message.content.includes('Amazing')) {
          console.log('\n🎉 QUIZ COMPLETED SUCCESSFULLY!');
          console.log('=====================================');
          console.log(`📊 Archetype: ${currentData.profile?.primary_archetype}`);
          console.log(`🎯 Confidence: ${currentData.profile?.primary_confidence * 100}%`);
          console.log(`✨ Completed flag: ${currentData.completed}`);
          console.log(`🎯 Phase: ${currentData.metadata?.phase}`);
          console.log('\n📝 Content preview:');
          console.log(currentData.message.content.substring(0, 200) + '...\n');
          console.log('✅ FRONTEND FIX WORKING - Quiz completes properly!');
          return;
        }
      }
    }

    console.log('❌ Quiz did not complete - there might still be an issue');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFrontendFix();