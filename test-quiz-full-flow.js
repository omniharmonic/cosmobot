#!/usr/bin/env node

/**
 * Complete Quiz Flow Test - Answers ALL questions
 * Tests the quiz from start to finish with all required questions
 */

const BASE_URL = 'http://localhost:3000';

// Generate a unique session ID for this test
const sessionId = `test_session_${Date.now()}`;
let conversationHistory = [];
let profileId = null;

console.log('🧪 Starting FULL quiz flow test...');
console.log('Session ID:', sessionId);
console.log('');

/**
 * Send a message to the chat API
 */
async function sendMessage(message, description) {
  console.log(`\n📤 ${description}`);
  console.log(`Message: "${message}"`);
  
  const requestBody = {
    message,
    conversationHistory,
    profileId,
    sessionId
  };
  
  const response = await fetch(`${BASE_URL}/api/chat/onboarding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  
  const data = await response.json();
  
  // Update conversation history
  conversationHistory.push({
    role: 'user',
    content: message,
    timestamp: new Date()
  });
  
  if (data.message) {
    conversationHistory.push(data.message);
  }
  
  // Update profile ID if provided
  if (data.profile?.id) {
    profileId = data.profile.id;
  }
  
  console.log(`✅ Response: ${data.message?.content?.substring(0, 100)}...`);
  
  if (data.completed) {
    console.log('🎉 Quiz marked as COMPLETED!');
  }
  
  if (data.profile?.primary_archetype) {
    console.log(`🎯 Archetype: ${data.profile.primary_archetype}`);
  }
  
  return data;
}

/**
 * Run the complete quiz flow test with ALL questions
 */
async function runTest() {
  try {
    console.log('\n═══ STEP 1: Start Quiz ═══');
    await sendMessage('start_quiz', 'Starting quiz');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('\n═══ STEP 2: Provide Name ═══');
    await sendMessage('Test User', 'Providing name');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('\n═══ STEP 3: Intro Motivation (Q1) ═══');
    await sendMessage('I want to learn about civic innovation and help build better communities', 'Answering motivation question');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('\n═══ STEP 4: Resource Contribution (Q2) ═══');
    await sendMessage('time_learning', 'Selecting time to learn');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('\n═══ STEP 5: Participation Mode (Q3) ═══');
    await sendMessage('learning', 'Selecting learning mode');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('\n═══ STEP 6: Engagement Stage (Q4) ═══');
    await sendMessage('new_curious', 'Selecting brand new stage');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('\n═══ STEP 7: Civic Sectors (Q5) ═══');
    await sendMessage('governance,civic_engagement,education', 'Selecting civic sectors');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('\n═══ STEP 8: Time Commitment (Q6) ═══');
    const finalResponse = await sendMessage('casual', 'Selecting casual commitment');
    
    // Verify completion
    console.log('\n═══════════════════════════════════════');
    console.log('FINAL VERIFICATION');
    console.log('═══════════════════════════════════════');
    
    if (finalResponse.completed) {
      console.log('✅ Quiz completed successfully!');
    } else {
      console.log('⚠️  Quiz not marked as completed');
    }
    
    if (finalResponse.profile?.primary_archetype) {
      console.log(`✅ Archetype detected: ${finalResponse.profile.primary_archetype}`);
      console.log(`   Confidence: ${Math.round((finalResponse.profile.primary_confidence || 0) * 100)}%`);
    } else {
      console.log('⚠️  No archetype detected');
    }
    
    console.log('\n═══════════════════════════════════════');
    console.log('TEST SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`✅ Session ID: ${sessionId}`);
    console.log(`✅ Profile ID: ${profileId}`);
    console.log(`✅ Messages sent: ${conversationHistory.filter(m => m.role === 'user').length}`);
    console.log(`✅ Bot responses: ${conversationHistory.filter(m => m.role === 'bot').length}`);
    console.log(`✅ Archetype: ${finalResponse.profile?.primary_archetype || 'N/A'}`);
    console.log(`✅ Completed: ${finalResponse.completed ? 'YES' : 'NO'}`);
    
    console.log('\n🎉 Test completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error.message);
    console.error('\nStack:', error.stack);
    process.exit(1);
  }
}

// Run the test
runTest();

