-- OpenCivics Onboarding Assistant Database Schema
-- Initial migration with all core tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE archetype AS ENUM ('allies', 'innovators', 'organizers', 'patrons');
CREATE TYPE consortium_role AS ENUM ('ally', 'citizen', 'contributor', 'patron');
CREATE TYPE time_commitment AS ENUM ('casual', 'regular', 'dedicated', 'full_time');
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');
CREATE TYPE conversation_type AS ENUM ('quiz', 'general', 'resource_query', 'blueprint_composition');

-- Core profile table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Basic info (collected during quiz)
  name TEXT,
  email TEXT,
  location TEXT,

  -- Archetype classification
  primary_archetype archetype NOT NULL,
  primary_confidence NUMERIC(3,2), -- 0.00-1.00
  secondary_archetype archetype,
  archetype_reasoning TEXT,

  -- Consortium role
  consortium_role consortium_role,

  -- Quiz metadata
  quiz_completed BOOLEAN DEFAULT FALSE,
  quiz_started_at TIMESTAMPTZ,
  quiz_completed_at TIMESTAMPTZ,
  quiz_version TEXT, -- e.g., 'v1.0'

  -- Generated outputs
  profile_image_url TEXT,
  onboarding_summary TEXT,

  -- Engagement tracking
  engagement_actions JSONB DEFAULT '[]'::jsonb, -- Array of actions taken
  last_active_at TIMESTAMPTZ,

  -- Extensibility
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Quiz responses (detailed structured data)
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Question metadata
  question_id TEXT NOT NULL,
  question_text TEXT,
  question_type TEXT, -- single_select, multi_select, text, conversation, etc.

  -- Response data
  response_value JSONB NOT NULL, -- Flexible storage
  response_raw_text TEXT, -- For conversation/text responses

  -- Analytics
  question_order INTEGER,
  time_spent_seconds INTEGER,

  UNIQUE(profile_id, question_id)
);

-- Interest mappings (derived from responses)
CREATE TABLE profile_interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Civic sectors
  civic_sectors TEXT[] NOT NULL, -- Array of selected sectors
  primary_civic_sector TEXT, -- The top interest

  -- Innovation domains
  innovation_domains TEXT[], -- Array of selected domains

  -- Skills & capacity
  skills TEXT[],
  time_commitment time_commitment,

  UNIQUE(profile_id)
);

-- Resource recommendations
CREATE TABLE resource_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Resource from Notion
  notion_page_id TEXT NOT NULL,
  resource_title TEXT,
  resource_url TEXT,
  resource_type TEXT, -- pattern, protocol, playbook, civic_stack
  resource_description TEXT,

  -- Relevance
  relevance_score NUMERIC(3,2), -- 0.00-1.00
  recommendation_reason TEXT,

  -- User interaction
  viewed BOOLEAN DEFAULT FALSE,
  viewed_at TIMESTAMPTZ,
  rated_helpful BOOLEAN,

  UNIQUE(profile_id, notion_page_id)
);

-- Conversation history (for chat feature)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Message
  message_role message_role NOT NULL,
  message_content TEXT NOT NULL,

  -- Context
  conversation_type conversation_type,
  session_id UUID, -- For grouping related messages

  -- LLM metadata
  gemini_model TEXT,
  tokens_used INTEGER,

  -- Debugging
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX idx_profiles_archetype ON profiles(primary_archetype);
CREATE INDEX idx_profiles_quiz_completed ON profiles(quiz_completed, created_at DESC);
CREATE INDEX idx_quiz_responses_profile ON quiz_responses(profile_id, question_order);
CREATE INDEX idx_interests_profile ON profile_interests(profile_id);
CREATE INDEX idx_resources_profile ON resource_recommendations(profile_id, viewed);
CREATE INDEX idx_conversations_profile_session ON conversations(profile_id, session_id, created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Policies (for now, allow all access - can be restricted later)
CREATE POLICY "Enable all access for profiles" ON profiles FOR ALL USING (true);
CREATE POLICY "Enable all access for quiz_responses" ON quiz_responses FOR ALL USING (true);
CREATE POLICY "Enable all access for profile_interests" ON profile_interests FOR ALL USING (true);
CREATE POLICY "Enable all access for resource_recommendations" ON resource_recommendations FOR ALL USING (true);
CREATE POLICY "Enable all access for conversations" ON conversations FOR ALL USING (true);

-- Storage bucket for profile images
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'profile-images', true);

-- Storage policy to allow public access to profile images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'profile-images' );

CREATE POLICY "Anyone can upload a profile image"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'profile-images' );

CREATE POLICY "Anyone can update a profile image"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'profile-images' );

-- Comments for documentation
COMMENT ON TABLE profiles IS 'Core user profiles with archetype classification';
COMMENT ON TABLE quiz_responses IS 'Individual quiz question responses';
COMMENT ON TABLE profile_interests IS 'User interests and skills mapping';
COMMENT ON TABLE resource_recommendations IS 'Personalized resource recommendations';
COMMENT ON TABLE conversations IS 'Chat conversation history';

COMMENT ON COLUMN profiles.primary_archetype IS 'Main participation archetype (allies, innovators, organizers, patrons)';
COMMENT ON COLUMN profiles.primary_confidence IS 'Confidence score for archetype classification (0.00-1.00)';
COMMENT ON COLUMN profiles.engagement_actions IS 'JSON array of engagement actions taken by user';
COMMENT ON COLUMN quiz_responses.response_value IS 'JSON value of the response (string, array, object, etc.)';
COMMENT ON COLUMN resource_recommendations.relevance_score IS 'AI-generated relevance score (0.00-1.00)';

-- Sample data for testing (optional)
-- This would be removed in production migration

-- Insert a sample archetype for testing
INSERT INTO profiles (
  primary_archetype,
  primary_confidence,
  name,
  quiz_completed,
  quiz_version,
  engagement_actions,
  metadata
) VALUES (
  'allies',
  0.85,
  'Test User',
  true,
  'v1.0',
  '[{"type": "quiz_completion", "completed_at": "2024-11-08T08:00:00Z"}]'::jsonb,
  '{"test": true}'::jsonb
);

-- Success message
SELECT 'OpenCivics database schema created successfully!' as message;