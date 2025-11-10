#!/usr/bin/env node

const API_BASE = 'http://localhost:3000';

async function testAllButtonsWorking() {
  console.log('🧪 COMPREHENSIVE BUTTON TEST');
  console.log('========================================\n');

  try {
    let sessionId = 'comprehensive_test_' + Date.now();

    // Test 1: Learn More Button
    console.log('1️⃣ Testing "Learn More" button...');
    let response = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Learn More',
        conversationHistory: [],
        sessionId: sessionId + '_learn'
      })
    });

    let data = await response.json();
    const learnMoreWorking = data.message.content.includes('Welcome to OpenCivics!') &&
                            data.message.buttons &&
                            data.message.buttons.some(b => b.label === 'Take the Quiz');

    console.log(`   ${learnMoreWorking ? '✅' : '❌'} Learn More: ${learnMoreWorking ? 'WORKING' : 'BROKEN'}`);
    if (learnMoreWorking) {
      console.log(`   Content: ${data.message.content.substring(0, 60)}...`);
      console.log(`   Buttons: ${data.message.buttons.map(b => b.label).join(', ')}`);
    }

    // Test 2: Explore Resources Button
    console.log('\n2️⃣ Testing "Explore Resources" button...');
    response = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Explore Resources',
        conversationHistory: [],
        sessionId: sessionId + '_explore'
      })
    });

    data = await response.json();
    const exploreWorking = data.message.content.includes('Explore Civic Innovation Resources') &&
                          data.message.content.includes('Regenerative Economics Framework') &&
                          data.message.buttons &&
                          data.message.buttons.some(b => b.label === 'Take Quiz for Personalized Recs');

    console.log(`   ${exploreWorking ? '✅' : '❌'} Explore Resources: ${exploreWorking ? 'WORKING' : 'BROKEN'}`);
    if (exploreWorking) {
      console.log(`   Content: Shows resource library with mock resources`);
      console.log(`   Buttons: ${data.message.buttons.map(b => b.label).join(', ')}`);
    }

    // Test 3: Start Quiz Button (from Learn More response)
    console.log('\n3️⃣ Testing "Start Quiz" button (from Learn More)...');
    response = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Take the Quiz',
        conversationHistory: [],
        sessionId: sessionId + '_quiz_start'
      })
    });

    data = await response.json();
    const quizStartWorking = data.message.content.includes('Welcome to OpenCivics') &&
                            data.message.buttons &&
                            data.message.buttons.some(b => b.label === 'Start Quiz');

    console.log(`   ${quizStartWorking ? '✅' : '❌'} Start Quiz: ${quizStartWorking ? 'WORKING' : 'BROKEN'}`);

    // Test 4: Full Quiz Flow (Quick Test)
    console.log('\n4️⃣ Testing complete quiz flow...');
    let quizSessionId = sessionId + '_full_quiz';
    let conversationHistory = [];

    // Start quiz
    response = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Start Quiz',
        conversationHistory: [],
        sessionId: quizSessionId
      })
    });
    data = await response.json();
    conversationHistory.push(data.message);

    // Enter name
    response = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'intro_welcome:TestUser',
        conversationHistory,
        sessionId: quizSessionId
      })
    });
    data = await response.json();
    let profileId = data.profile?.id;
    conversationHistory.push(data.message);

    // Answer one quiz question
    if (data.message.buttons && data.message.buttons.length > 0) {
      const answerLabel = data.message.buttons[0].label;
      response = await fetch(`${API_BASE}/api/chat/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: answerLabel,
          conversationHistory,
          profileId,
          sessionId: quizSessionId
        })
      });
      data = await response.json();
    }

    const quizFlowWorking = profileId && data.message.content.length > 0;
    console.log(`   ${quizFlowWorking ? '✅' : '❌'} Quiz Flow: ${quizFlowWorking ? 'WORKING' : 'BROKEN'}`);
    if (quizFlowWorking) {
      console.log(`   Profile created: ${profileId}`);
      console.log(`   Quiz proceeding normally`);
    }

    // Overall Result
    console.log('\n🎯 TEST RESULTS SUMMARY');
    console.log('========================================');
    const allWorking = learnMoreWorking && exploreWorking && quizStartWorking && quizFlowWorking;

    console.log(`Learn More Button:     ${learnMoreWorking ? '✅ WORKING' : '❌ BROKEN'}`);
    console.log(`Explore Resources:     ${exploreWorking ? '✅ WORKING' : '❌ BROKEN'}`);
    console.log(`Start Quiz Button:     ${quizStartWorking ? '✅ WORKING' : '❌ BROKEN'}`);
    console.log(`Quiz Flow:             ${quizFlowWorking ? '✅ WORKING' : '❌ BROKEN'}`);
    console.log(`\n🎉 OVERALL STATUS:     ${allWorking ? '✅ ALL BUTTONS WORKING!' : '❌ SOME ISSUES REMAIN'}`);

    if (allWorking) {
      console.log('\n🚀 The frontend fix is successful! All button functionality restored.');
    } else {
      console.log('\n⚠️  Some issues still need attention.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAllButtonsWorking();