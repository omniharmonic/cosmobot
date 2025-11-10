#!/usr/bin/env node

const API_BASE = 'http://localhost:3000';

async function testQuizStartFixed() {
  console.log('🧪 Testing Quiz Start Fix');
  console.log('============================\n');

  try {
    let sessionId = 'quiz_start_test_' + Date.now();

    // Test 1: Direct "Start Quiz" click (what was broken)
    console.log('1️⃣ Testing direct "Start Quiz" button click...');
    let response = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Start Quiz',
        conversationHistory: [],
        sessionId: sessionId + '_direct'
      })
    });

    let data = await response.json();
    const quizStarts = data.message.content.includes("what should I call you") &&
                      data.message.inputField &&
                      data.message.inputField.questionId === 'intro_welcome';

    console.log(`   ${quizStarts ? '✅' : '❌'} Start Quiz Button: ${quizStarts ? 'WORKING' : 'STILL BROKEN'}`);
    if (quizStarts) {
      console.log(`   ✅ Quiz properly starts with name collection`);
      console.log(`   Content: "${data.message.content}"`);
      console.log(`   Input type: ${data.message.inputField?.type}`);
    } else {
      console.log(`   ❌ Response: "${data.message.content}"`);
      console.log(`   ❌ Still showing welcome instead of starting quiz`);
    }

    // Test 2: Alternative quiz triggers
    console.log('\n2️⃣ Testing "Take the Quiz" variation...');
    response = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Take the Quiz',
        conversationHistory: [],
        sessionId: sessionId + '_take'
      })
    });

    data = await response.json();
    const takeQuizWorks = data.message.content.includes("what should I call you");

    console.log(`   ${takeQuizWorks ? '✅' : '❌'} "Take the Quiz": ${takeQuizWorks ? 'WORKING' : 'BROKEN'}`);

    // Test 3: Make sure other buttons still work
    console.log('\n3️⃣ Testing other buttons still work...');
    response = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Learn More',
        conversationHistory: [],
        sessionId: sessionId + '_learn'
      })
    });

    data = await response.json();
    const learnMoreWorks = data.message.content.includes("Welcome to OpenCivics!");

    console.log(`   ${learnMoreWorks ? '✅' : '❌'} "Learn More": ${learnMoreWorks ? 'WORKING' : 'BROKEN'}`);

    // Overall assessment
    console.log('\n🎯 FIX STATUS');
    console.log('=================');
    const allFixed = quizStarts && takeQuizWorks && learnMoreWorks;

    console.log(`Start Quiz Button:    ${quizStarts ? '✅ FIXED' : '❌ STILL BROKEN'}`);
    console.log(`Take Quiz Button:     ${takeQuizWorks ? '✅ WORKING' : '❌ BROKEN'}`);
    console.log(`Learn More Button:    ${learnMoreWorks ? '✅ WORKING' : '❌ BROKEN'}`);
    console.log(`\nOVERALL:             ${allFixed ? '✅ ALL BUTTONS WORKING!' : '❌ ISSUES REMAIN'}`);

    if (quizStarts) {
      console.log('\n🎉 SUCCESS! The quiz loop issue has been fixed!');
      console.log('   Users can now click "Start Quiz" and actually start the quiz.');
    } else {
      console.log('\n⚠️  The quiz is still looping. More debugging needed.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testQuizStartFixed();