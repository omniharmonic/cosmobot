# OpenCivics Onboarding Assistant - Quick Start Guide

## Overview
This guide provides the essential steps to implement the OpenCivics Intelligent Onboarding Assistant based on the comprehensive PRD.

---

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Gemini API key (Google AI Studio)
- Notion workspace with admin access

---

## Setup Steps

### 1. Initialize Next.js Project

```bash
npx create-next-app@latest opencivics-onboarding \
  --typescript \
  --tailwind \
  --app \
  --use-npm

cd opencivics-onboarding
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install @supabase/supabase-js @google/generative-ai @notionhq/client

# UI/Canvas for image generation
npm install canvas

# Utilities
npm install zod date-fns uuid
```

### 3. Environment Configuration

Create `.env.local`:

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Gemini
GEMINI_API_KEY=your-gemini-api-key

# Notion
NOTION_API_KEY=your-notion-integration-key
NOTION_CIVIC_SECTORS_DB=your-db-id
NOTION_INNOVATION_DOMAINS_DB=your-db-id
NOTION_RESOURCES_DB=your-db-id
```

### 4. Set Up Supabase Database

Run the SQL schema from the PRD (`Section 5.2 - Database Schema`):

```sql
-- Copy the entire schema from the PRD
-- Run in Supabase SQL editor
```

Key tables:
- `profiles`
- `quiz_responses`
- `profile_interests`
- `resource_recommendations`
- `conversations`

### 5. Configure Notion Databases

Create three Notion databases:

**Civic Sectors**:
- Properties: Name (title), Description (text)
- Import data from: `Civic_Sectors_29b06d2570f280deabadc4f7031f0564_all.csv`

**Innovation Domains**:
- Properties: Title (title), Description (text), Thumbnail (file)
- Import data from: `Open_Civic_Innovation_Domains_29806d2570f280ac9ba8d37aadb23610_all.csv`

**Resources** (Patterns, Playbooks, Protocols):
- Properties:
  - Title (title)
  - Type (select: Pattern, Playbook, Protocol, Civic Stack)
  - Description (rich text)
  - Civic Sectors (multi-select)
  - Innovation Domains (multi-select)
  - Archetype Relevance (multi-select: Allies, Innovators, Organizers, Patrons)
  - Status (select: Draft, Published)

Share databases with your Notion integration and copy database IDs to `.env.local`.

---

## Project Structure

```
opencivics-onboarding/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── quiz/
│   │   └── page.tsx               # Main quiz interface
│   ├── results/
│   │   └── [profileId]/
│   │       └── page.tsx           # Results/profile page
│   ├── chat/
│   │   └── page.tsx               # General chat interface
│   └── api/
│       ├── quiz/
│       │   ├── start/route.ts
│       │   ├── response/route.ts
│       │   └── complete/route.ts
│       ├── resources/
│       │   └── search/route.ts
│       ├── chat/route.ts
│       └── profile/
│           └── image/route.ts
├── components/
│   ├── terminal/
│   │   ├── TerminalLayout.tsx
│   │   ├── TerminalPrompt.tsx
│   │   └── ScanlineOverlay.tsx
│   ├── quiz/
│   │   ├── QuestionRenderer.tsx
│   │   ├── SingleSelect.tsx
│   │   ├── MultiSelect.tsx
│   │   ├── TextInput.tsx
│   │   └── ConversationInput.tsx
│   └── profile/
│       ├── ProfileCard.tsx
│       ├── ArchetypeBadge.tsx
│       └── ResourceCard.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── gemini/
│   │   ├── archetype-analyzer.ts
│   │   ├── summary-generator.ts
│   │   ├── chat-handler.ts
│   │   └── resource-recommender.ts
│   ├── notion/
│   │   └── client.ts
│   ├── image/
│   │   └── profile-generator.ts
│   └── quiz/
│       ├── config.ts              # Quiz configuration
│       ├── scoring.ts             # Archetype detection logic
│       └── types.ts               # TypeScript types
├── styles/
│   └── terminal-theme.scss
└── public/
    └── fonts/
        └── JetBrainsMono/
```

---

## Implementation Priority

### Week 1: Core Setup
1. ✅ Project initialization
2. ✅ Database setup (Supabase)
3. ✅ Notion databases configured
4. ✅ Basic UI components (terminal theme)
5. ✅ Quiz configuration system

### Week 2: Quiz Engine
1. Question renderer for all types
2. State management (quiz progress)
3. Response saving to Supabase
4. Conditional question logic
5. Progress tracking UI

### Week 3: Archetype Detection
1. Algorithmic scoring system
2. Gemini integration for validation
3. Prompt engineering for accuracy
4. Testing with synthetic profiles
5. Results page UI

### Week 4: Profile Generation
1. Civic identity image generator
2. Onboarding summary generator
3. Notion resource recommender
4. Complete results page
5. Social sharing features

---

## Key Implementation Files

### 1. Quiz Configuration (`lib/quiz/config.ts`)

```typescript
import { QuizConfig } from './types';

export const ONBOARDING_QUIZ_V1: QuizConfig = {
  id: 'onboarding_v1',
  version: '1.0.0',
  sections: [
    {
      id: 'introduction',
      title: 'Welcome to OpenCivics',
      questions: [
        {
          id: 'intro_name',
          order: 1,
          text: 'What should we call you?',
          type: 'text',
          required: false,
        },
        {
          id: 'intro_motivation',
          order: 2,
          text: 'What brings you to OpenCivics today?',
          type: 'conversation',
          required: true,
        },
      ],
    },
    {
      id: 'archetype_detection',
      title: 'How You Participate',
      questions: [
        {
          id: 'resource_contribution_primary',
          order: 3,
          text: 'What resource would you most naturally contribute?',
          type: 'single_select',
          required: true,
          options: [
            {
              value: 'time_learning',
              label: 'Time to learn and explore civic innovation',
              mapsToArchetype: 'allies',
              archetypeWeight: 1.0,
            },
            {
              value: 'time_organizing',
              label: 'Time to coordinate and bring people together',
              mapsToArchetype: 'organizers',
              archetypeWeight: 1.0,
            },
            {
              value: 'skills_building',
              label: 'Skills to build tools and systems',
              mapsToArchetype: 'innovators',
              archetypeWeight: 1.0,
            },
            {
              value: 'capital_funding',
              label: 'Financial resources to fund innovation',
              mapsToArchetype: 'patrons',
              archetypeWeight: 1.0,
            },
          ],
        },
        // ... more questions from PRD
      ],
    },
    // ... more sections
  ],
};
```

### 2. Archetype Scoring (`lib/quiz/scoring.ts`)

```typescript
import { QuizResponse } from './types';

export function calculateArchetypeScores(responses: QuizResponse[]) {
  const scores = {
    allies: 0,
    innovators: 0,
    organizers: 0,
    patrons: 0,
  };

  for (const response of responses) {
    const question = getQuestionById(response.question_id);
    
    if (question.type === 'single_select') {
      const option = question.options?.find(
        opt => opt.value === response.response_value
      );
      
      if (option?.mapsToArchetype && option.archetypeWeight) {
        scores[option.mapsToArchetype] += option.archetypeWeight;
      }
    }
    
    if (question.type === 'multi_select') {
      const selectedValues = response.response_value as string[];
      
      for (const value of selectedValues) {
        const option = question.options?.find(opt => opt.value === value);
        
        if (option?.mapsToArchetype && option.archetypeWeight) {
          scores[option.mapsToArchetype] += option.archetypeWeight;
        }
      }
    }
    
    // Natural language analysis would go through Gemini
  }

  // Normalize to confidence scores
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  
  if (total === 0) return null;

  const normalized = Object.fromEntries(
    Object.entries(scores).map(([arch, score]) => [
      arch,
      score / total,
    ])
  );

  const primary = Object.keys(normalized).reduce((a, b) =>
    normalized[a] > normalized[b] ? a : b
  );

  return {
    scores: normalized,
    primary_archetype: primary,
    primary_confidence: normalized[primary],
    secondary_archetype: findSecondary(normalized, primary),
  };
}

function findSecondary(
  scores: Record<string, number>,
  primary: string
): string | null {
  const candidates = Object.entries(scores)
    .filter(([arch, score]) => arch !== primary && score > 0.2)
    .sort(([, a], [, b]) => b - a);

  return candidates.length > 0 ? candidates[0][0] : null;
}
```

### 3. API Route Example (`app/api/quiz/complete/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { analyzeArchetype } from '@/lib/gemini/archetype-analyzer';
import { generateOnboardingSummary } from '@/lib/gemini/summary-generator';
import { searchResources } from '@/lib/notion/client';
import { generateCivicIdentityImage } from '@/lib/image/profile-generator';
import { calculateArchetypeScores } from '@/lib/quiz/scoring';

export async function POST(req: NextRequest) {
  const { profile_id } = await req.json();

  // 1. Fetch all quiz responses
  const { data: responses, error: responseError } = await supabase
    .from('quiz_responses')
    .select('*')
    .eq('profile_id', profile_id)
    .order('question_order');

  if (responseError) throw responseError;

  // 2. Calculate algorithmic archetype scores
  const algorithmicScores = calculateArchetypeScores(responses);

  // 3. Validate with Gemini
  const geminiAnalysis = await analyzeArchetype(
    responses,
    algorithmicScores
  );

  // 4. Extract interests from responses
  const interests = extractInterests(responses);

  // 5. Search Notion for relevant resources
  const resources = await searchResources({
    civicSectors: interests.civicSectors,
    innovationDomains: interests.innovationDomains,
    archetypes: [geminiAnalysis.validated_archetype],
    limit: 10,
  });

  // 6. Rank resources by relevance
  const rankedResources = await rankResourceRelevance(
    { ...geminiAnalysis, ...interests },
    resources
  );

  // 7. Generate civic identity image
  const imageBuffer = await generateCivicIdentityImage({
    name: interests.name,
    archetype: geminiAnalysis.validated_archetype,
    civicSectors: interests.civicSectors,
    innovationDomains: interests.innovationDomains,
    confidence: geminiAnalysis.confidence,
  });

  // 8. Upload image to Supabase Storage
  const imagePath = `${profile_id}-civic-identity.png`;
  await supabase.storage
    .from('profile-images')
    .upload(imagePath, imageBuffer, { upsert: true });

  const { data: { publicUrl: imageUrl } } = supabase.storage
    .from('profile-images')
    .getPublicUrl(imagePath);

  // 9. Generate onboarding summary
  const summary = await generateOnboardingSummary(
    { ...interests, archetype: geminiAnalysis.validated_archetype },
    geminiAnalysis,
    rankedResources.slice(0, 3)
  );

  // 10. Update profile in database
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      primary_archetype: geminiAnalysis.validated_archetype,
      primary_confidence: geminiAnalysis.confidence,
      secondary_archetype: geminiAnalysis.secondary_archetype,
      archetype_reasoning: geminiAnalysis.reasoning,
      consortium_role: geminiAnalysis.consortium_role_suggestion,
      profile_image_url: imageUrl,
      onboarding_summary: summary,
      quiz_completed: true,
      quiz_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', profile_id);

  if (updateError) throw updateError;

  // 11. Save resource recommendations
  for (const resource of rankedResources) {
    await supabase.from('resource_recommendations').insert({
      profile_id,
      notion_page_id: resource.id,
      resource_title: resource.title,
      resource_url: resource.url,
      resource_type: resource.type,
      resource_description: resource.description,
      relevance_score: resource.relevance_score,
      recommendation_reason: resource.recommendation_reason,
    });
  }

  // 12. Return complete profile
  return NextResponse.json({
    profile: {
      id: profile_id,
      archetype: geminiAnalysis.validated_archetype,
      confidence: geminiAnalysis.confidence,
      consortium_role: geminiAnalysis.consortium_role_suggestion,
      civic_sectors: interests.civicSectors,
      innovation_domains: interests.innovationDomains,
      onboarding_summary: summary,
      profile_image_url: imageUrl,
    },
    resources: rankedResources,
    next_steps: geminiAnalysis.recommended_next_steps,
  });
}
```

---

## Testing Checklist

### Unit Tests
- [ ] Archetype scoring algorithm
- [ ] Question conditional logic
- [ ] Resource search filters
- [ ] Image generation
- [ ] Data validation schemas

### Integration Tests
- [ ] Complete quiz flow
- [ ] Gemini API integration
- [ ] Notion API integration
- [ ] Supabase operations
- [ ] Profile generation end-to-end

### User Testing
- [ ] 20 diverse user testers
- [ ] Track completion rates
- [ ] Measure time to complete
- [ ] Validate archetype accuracy
- [ ] Gather qualitative feedback

---

## Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables (Vercel)
Add all `.env.local` variables to Vercel project settings.

### Post-Deployment
1. Test production URL
2. Verify Supabase connection
3. Test Gemini API integration
4. Test Notion API integration
5. Monitor error logs
6. Set up analytics

---

## Monitoring & Analytics

### Key Metrics to Track
- Quiz start rate
- Quiz completion rate
- Average completion time
- Drop-off points (question-level)
- Archetype distribution
- Confidence score distribution
- Resource click-through rate
- Social share rate

### Tools
- Vercel Analytics (built-in)
- Supabase Dashboard (query analytics)
- Custom event tracking in database
- Error monitoring (Sentry)

---

## Next Steps

After MVP launch:
1. Collect user feedback
2. Analyze completion funnel
3. Tune archetype detection
4. Refine questions based on data
5. Optimize Gemini prompts
6. Add A/B testing framework
7. Build Telegram bot integration
8. Expand resource library

---

## Support & Resources

- **PRD**: See complete PRD document for full specifications
- **Architecture**: Refer to technical architecture diagrams
- **Design**: Terminal aesthetic design system
- **Testing**: Archetype validation test suite

---

**Document Version**: 1.0  
**Last Updated**: November 2025
