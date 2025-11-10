#!/usr/bin/env node

/**
 * Complete Quiz Test - Answers ALL questions including optional ones
 */

const BASE_URL = 'http://localhost:3000';

const sessionId = `test_session_${Date.now()}`;
let conversationHistory = [];
let profileId = null;
let questionCount = 0;

console.log('🧪 Starting COMPLETE quiz flow test...');
console.log('Session ID:', sessionId);
console.log('');

async function sendMessage(message, description) {
  questionCount++;
  console.log(`\n[Q${questionCount}] 📤 ${description}`);
  
  const response = await fetch(`${BASE_URL}/api/chat/onboarding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      conversationHistory,
      profileId,
      sessionId
    })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }
  
  const data = await response.json();
  
  conversationHistory.push({ role: 'user', content: message, timestamp: new Date() });
  if (data.message) {
    conversationHistory.push(data.message);
  }
  if (data.profile?.id) {
    profileId = data.profile.id;
  }
  
  console.log(`✅ ${data.message?.content?.substring(0, 80).replace(/\n/g, ' ')}...`);
  
  if (data.completed) {
    console.log('🎉 QUIZ COMPLETED!');
    console.log(`🎯 Archetype: ${data.profile?.primary_archetype}`);
    console.log(`📊 Confidence: ${Math.round((data.profile?.primary_confidence || 0) * 100)}%`);
  }
  
  return data;
}

async function runTest() {
  try {
    await sendMessage('start_quiz', 'Start quiz');
    await sendMessage('Test User', 'Provide name');
    await sendMessage('I want to learn about civic innovation', 'Motivation');
    await sendMessage('time_learning', 'Resource: time to learn');
    await sendMessage('learning', 'Participation: learning');
    await sendMessage('new_curious', 'Stage: brand new');
    await sendMessage('governance,civic_engagement,education', 'Sectors');
    await sendMessage('casual', 'Time commitment');
    await sendMessage('San Francisco', 'Location');
    const final = await sendMessage('I am curious about open civics and want to learn more', 'Experience background');
    
    console.log('\n═══════════════════════════════════════');
    console.log('FINAL STATUS');
    console.log('═══════════════════════════════════════');
    console.log(`✅ Completed: ${final.completed ? 'YES' : 'NO'}`);
    console.log(`✅ Archetype: ${final.profile?.primary_archetype || 'N/A'}`);
    console.log(`✅ Profile ID: ${profileId}`);
    console.log(`✅ Total messages: ${questionCount}`);
    
    if (final.completed && final.profile?.primary_archetype) {
      console.log('\n🎉 SUCCESS: Quiz completed with archetype detection!');
      process.exit(0);
    } else {
      console.log('\n⚠️  INCOMPLETE: Quiz did not complete or archetype not detected');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTest();

