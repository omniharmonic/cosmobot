#!/usr/bin/env node

const API_BASE = 'http://localhost:3000';

async function testQuizFlow() {
  console.log('Testing complete quiz flow...\n');

  try {
    // Step 1: Start quiz
    console.log('1. Starting quiz...');
    const startResponse = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'start_quiz',
        conversationHistory: [],
        sessionId: 'test_session_quiz_456'
      })
    });

    if (!startResponse.ok) {
      throw new Error(`Start failed: ${startResponse.status} ${startResponse.statusText}`);
    }

    const startData = await startResponse.json();
    console.log('✓ Quiz started:', startData.message.content);

    if (!startData.message.buttons) {
      console.log('✗ Expected buttons for quiz start');
      return;
    }

    // Step 2: Click Start Quiz button
    console.log('\n2. Clicking Start Quiz button...');
    const q1Response = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'start_quiz',
        conversationHistory: [startData.message],
        sessionId: 'test_session_quiz_456'
      })
    });

    if (!q1Response.ok) {
      throw new Error(`Q1 failed: ${q1Response.status} ${q1Response.statusText}`);
    }

    const q1Data = await q1Response.json();
    console.log('✓ Question 1:', q1Data.message.content.substring(0, 100) + '...');

    // Check if this is name collection (inputField) or a question (buttons)
    let answer1;
    if (q1Data.message.inputField) {
      console.log('✓ Name input detected');
      answer1 = `${q1Data.message.inputField.questionId}:TestUser`;
    } else if (q1Data.message.buttons) {
      // Step 3: Answer Q1 (pick first option)
      answer1 = q1Data.message.buttons[0].value;
    } else {
      console.log('✗ Expected buttons or inputField for question 1');
      return;
    }
    console.log(`\n3. Answering Q1 with: ${answer1}`);

    const q2Response = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: answer1,
        conversationHistory: [startData.message, q1Data.message],
        sessionId: 'test_session_quiz_456'
      })
    });

    if (!q2Response.ok) {
      throw new Error(`Q2 failed: ${q2Response.status} ${q2Response.statusText}`);
    }

    const q2Data = await q2Response.json();
    console.log('✓ Question 2:', q2Data.message.content.substring(0, 100) + '...');

    // Continue through Q3
    let answer2;
    if (q2Data.message.inputField) {
      answer2 = `${q2Data.message.inputField.questionId}:TestAnswer2`;
    } else if (q2Data.message.buttons) {
      answer2 = q2Data.message.buttons[0].value;
    } else {
      console.log('✗ Expected buttons or inputField for question 2');
      return;
    }
    console.log(`\n4. Answering Q2 with: ${answer2}`);

    const q3Response = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: answer2,
        conversationHistory: [startData.message, q1Data.message, q2Data.message],
        sessionId: 'test_session_quiz_456'
      })
    });

    const q3Data = await q3Response.json();
    console.log('✓ Question 3:', q3Data.message.content.substring(0, 100) + '...');

    // Continue through Q4 - this is where it was failing
    let answer3;
    if (q3Data.message.inputField) {
      answer3 = `${q3Data.message.inputField.questionId}:TestAnswer3`;
    } else if (q3Data.message.buttons) {
      answer3 = q3Data.message.buttons[0].value;
    } else {
      console.log('✗ Expected buttons or inputField for question 3');
      return;
    }
    console.log(`\n5. Answering Q3 with: ${answer3}`);

    const q4Response = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: answer3,
        conversationHistory: [startData.message, q1Data.message, q2Data.message, q3Data.message],
        sessionId: 'test_session_quiz_456'
      })
    });

    const q4Data = await q4Response.json();
    console.log('✓ Question 4:', q4Data.message.content.substring(0, 100) + '...');

    // Answer Q4 - this is where completion should happen
    let answer4;
    if (q4Data.message.inputField) {
      answer4 = `${q4Data.message.inputField.questionId}:TestAnswer4`;
    } else if (q4Data.message.buttons) {
      answer4 = q4Data.message.buttons[0].value;
    } else {
      console.log('✗ Expected buttons or inputField for question 4');
      return;
    }
    console.log(`\n6. Answering Q4 with: ${answer4}`);

    const completionResponse = await fetch(`${API_BASE}/api/chat/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: answer4,
        conversationHistory: [startData.message, q1Data.message, q2Data.message, q3Data.message, q4Data.message],
        sessionId: 'test_session_quiz_456'
      })
    });

    const completionData = await completionResponse.json();
    console.log('✓ Quiz completion response:', completionData.message.content.substring(0, 200) + '...');

    if (completionData.profile) {
      console.log('✓ Profile created:', completionData.profile.archetype);
    } else {
      console.log('✗ No profile created');
    }

    console.log('\n🎉 Quiz flow test completed successfully!');

  } catch (error) {
    console.error('\n❌ Quiz flow test failed:', error.message);
    if (error.response) {
      console.error('Response:', await error.response.text());
    }
  }
}

testQuizFlow();