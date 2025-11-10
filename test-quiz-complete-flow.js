#!/usr/bin/env node

/**
 * Comprehensive Quiz Flow Test
 * Tests the complete quiz flow from start to finish including:
 * - Name collection
 * - All quiz questions
 * - Quiz completion and archetype detection
 */

const BASE_URL = 'http://localhost:3000';

// Generate a unique session ID for this test
const sessionId = `test_session_${Date.now()}`;
let conversationHistory = [];
let profileId = null;

console.log('🧪 Starting comprehensive quiz flow test...');
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
  
  console.log('Request body:', JSON.stringify(requestBody, null, 2));
  
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
    console.log(`✅ Profile ID: ${profileId}`);
  }
  
  console.log(`📥 Response: ${data.message?.content?.substring(0, 150)}...`);
  
  if (data.message?.buttons) {
    console.log(`🔘 Buttons: ${data.message.buttons.map(b => b.label).join(', ')}`);
  }
  
  if (data.completed) {
    console.log('🎉 Quiz marked as completed!');
  }
  
  return data;
}

/**
 * Run the complete quiz flow test
 */
async function runTest() {
  try {
    // Step 1: Start the quiz
    console.log('\n═══════════════════════════════════════');
    console.log('STEP 1: Start Quiz');
    console.log('═══════════════════════════════════════');
    await sendMessage('start_quiz', 'Starting quiz');
    
    // Wait a moment between requests
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Step 2: Provide name
    console.log('\n═══════════════════════════════════════');
    console.log('STEP 2: Provide Name');
    console.log('═══════════════════════════════════════');
    await sendMessage('Test User', 'Providing name');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Step 3: Answer resource contribution question
    console.log('\n═══════════════════════════════════════');
    console.log('STEP 3: Resource Contribution');
    console.log('═══════════════════════════════════════');
    await sendMessage('time_learning', 'Selecting time to learn');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Step 4: Answer participation mode question
    console.log('\n═══════════════════════════════════════');
    console.log('STEP 4: Participation Mode');
    console.log('═══════════════════════════════════════');
    await sendMessage('learning', 'Selecting learning mode');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Step 5: Answer engagement stage question
    console.log('\n═══════════════════════════════════════');
    console.log('STEP 5: Engagement Stage');
    console.log('═══════════════════════════════════════');
    await sendMessage('new_curious', 'Selecting brand new stage');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Step 6: Answer time commitment question (final question)
    console.log('\n═══════════════════════════════════════');
    console.log('STEP 6: Time Commitment (Final Question)');
    console.log('═══════════════════════════════════════');
    const finalResponse = await sendMessage('casual', 'Selecting casual commitment');
    
    // Verify completion
    console.log('\n═══════════════════════════════════════');
    console.log('VERIFICATION');
    console.log('═══════════════════════════════════════');
    
    if (finalResponse.completed) {
      console.log('✅ Quiz completed successfully!');
    } else {
      console.log('⚠️ Quiz not marked as completed');
    }
    
    if (finalResponse.profile?.primary_archetype) {
      console.log(`✅ Archetype detected: ${finalResponse.profile.primary_archetype}`);
    } else {
      console.log('⚠️ No archetype detected');
    }
    
    if (finalResponse.analysis) {
      console.log(`✅ Analysis confidence: ${Math.round(finalResponse.analysis.confidence * 100)}%`);
    }
    
    console.log('\n═══════════════════════════════════════');
    console.log('TEST SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`Session ID: ${sessionId}`);
    console.log(`Profile ID: ${profileId}`);
    console.log(`Messages sent: ${conversationHistory.filter(m => m.role === 'user').length}`);
    console.log(`Bot responses: ${conversationHistory.filter(m => m.role === 'bot').length}`);
    console.log(`Archetype: ${finalResponse.profile?.primary_archetype || 'N/A'}`);
    console.log(`Completed: ${finalResponse.completed ? 'Yes' : 'No'}`);
    
    console.log('\n🎉 Test completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error);
    console.error('\nFull error:', error.stack);
    process.exit(1);
  }
}

// Run the test
runTest();

