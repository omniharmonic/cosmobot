# OpenCivics Onboarding Assistant
## Implementation Plan - Executive Summary

---

## Overview

This comprehensive implementation plan breaks down the development of the OpenCivics Intelligent Onboarding Assistant into **12 distinct phases** with **atomic, developer-ready tasks**.

**Total Implementation Time**: 6-7 weeks for MVP  
**Team Size**: 3.5 developers (1 Frontend, 1 Backend, 1 Full-Stack, 0.5 DevOps)

---

## Plan Structure

The complete plan is divided into three documents:

### Part 1: Foundation & Core Quiz
- **Phase 0**: Foundation & Infrastructure (Weeks 0-1)
- **Phase 1**: Database & Data Layer (Week 1)
- **Phase 2**: Core Quiz Engine (Weeks 2-3)

### Part 2: AI & Integration
- **Phase 3**: AI Integration Layer (Week 3)
- **Phase 4**: Archetype Detection System (Weeks 3-4)
- **Phase 5**: Notion Integration (Week 4)

### Part 3: Profile, UI & Launch
- **Phase 6**: Profile Generation (Week 4)
- **Phase 7**: Results & Recommendations (Week 4)
- **Phase 8**: Chat Interface (Weeks 5-6)
- **Phase 9**: UI/UX Implementation (Weeks 5-6)
- **Phase 10**: Testing & QA (Week 6)
- **Phase 11**: Deployment & Launch (Week 6)
- **Phase 12**: Post-MVP Features (Weeks 7+)

---

## Key Features of This Plan

### 1. **Atomic Work Units**
Each sub-task is designed to be:
- Completable by a single developer
- 1-8 hours of focused work
- Clearly defined acceptance criteria
- Independently testable

### 2. **Clear Dependencies**
Every task explicitly lists:
- Prerequisites
- Parallel work opportunities
- Blocking dependencies
- Integration points

### 3. **Practical Implementation**
Includes actual code implementations for:
- All core services and repositories
- Database schemas and migrations
- API endpoints with validation
- TypeScript type definitions
- React components

### 4. **Built-in Quality**
Each phase includes:
- Unit test requirements
- Error handling patterns
- Performance considerations
- Security best practices

---

## Phase Breakdown

### Phase 0: Foundation (3-5 days)
**Goal**: Development environment and core infrastructure

**Key Deliverables**:
- Next.js 14 project setup
- Supabase, Gemini, Notion integrations
- TypeScript types and utilities
- Error handling infrastructure

**Critical Path**: None (can start immediately)

---

### Phase 1: Database (2-3 days)
**Goal**: Data persistence layer

**Key Deliverables**:
- Database schema (profiles, quiz responses, interactions, chat)
- Repository pattern implementation
- Data access layer with proper typing

**Critical Path**: Phase 0 complete

---

### Phase 2: Core Quiz (5-7 days)
**Goal**: Interactive quiz system

**Key Deliverables**:
- Quiz configuration with all questions
- Conditional logic engine
- State management
- API endpoints (start, response, complete)

**Critical Path**: Phase 1 complete

---

### Phase 3: AI Integration (3-4 days)
**Goal**: Gemini AI connectivity

**Key Deliverables**:
- Prompt engineering for archetype analysis
- Summary generation service
- Conversational response analyzer

**Critical Path**: Phase 0 complete (can run parallel with Phase 2)

---

### Phase 4: Archetype Detection (4-6 days)
**Goal**: Hybrid algorithmic + AI detection

**Key Deliverables**:
- Weighted scoring engine
- AI validation layer
- Synthetic test profiles (50+)
- >85% accuracy validation

**Critical Path**: Phases 2 and 3 complete

---

### Phase 5: Notion Integration (2-3 days)
**Goal**: Resource recommendation engine

**Key Deliverables**:
- Notion repositories (sectors, domains, resources)
- Resource recommendation service
- Caching strategy

**Critical Path**: Phase 0 complete (can run parallel with Phases 2-4)

---

### Phase 6: Profile Generation (3-4 days)
**Goal**: Profile images and summaries

**Key Deliverables**:
- Canvas-based image generator
- Archetype-specific visual design
- Supabase Storage integration
- Profile completion orchestration

**Critical Path**: Phases 3 and 4 complete

---

### Phase 7: Results & Recommendations (3-4 days)
**Goal**: Results page and resource APIs

**Key Deliverables**:
- Profile results endpoint
- Resource search API
- Resource interaction tracking

**Critical Path**: Phases 4, 5, and 6 complete

---

### Phase 8: Chat Interface (5-7 days)
**Goal**: AI chat with Notion knowledge

**Key Deliverables**:
- Chat session management
- AI response generation
- Notion knowledge retrieval
- Chat API endpoint

**Critical Path**: Phase 3 complete

---

### Phase 9: UI/UX (4-5 days)
**Goal**: Complete frontend implementation

**Key Deliverables**:
- Terminal aesthetic components
- Quiz interface (all question types)
- Results page
- Profile cards and resource cards

**Critical Path**: Phases 2 and 7 complete

---

### Phase 10: Testing (4-5 days)
**Goal**: Quality assurance

**Key Deliverables**:
- Unit tests (80%+ coverage)
- Integration tests
- End-to-end quiz flow test
- Beta user testing (20+ users)

**Critical Path**: All development phases complete

---

### Phase 11: Deployment (2-3 days)
**Goal**: Production launch

**Key Deliverables**:
- Vercel deployment
- Custom domain setup
- Monitoring and analytics
- Error tracking

**Critical Path**: Phase 10 complete

---

### Phase 12: Post-MVP (Ongoing)
**Goal**: Extended features

**Key Deliverables**:
- Analytics dashboard
- Email automation
- Telegram bot
- Advanced features

**Critical Path**: MVP launched

---

## Critical Dependencies Matrix

| Phase | Must Complete Before | Can Work Parallel With |
|-------|---------------------|------------------------|
| 0 | None | All others |
| 1 | 0 | 2, 3, 5 |
| 2 | 1 | 3, 5 |
| 3 | 0 | 1, 2, 5 |
| 4 | 2, 3 | 5, 6 (partial) |
| 5 | 0 | 1, 2, 3, 4 |
| 6 | 3, 4 | 5, 8 |
| 7 | 4, 5, 6 | 8, 9 |
| 8 | 3 | 4, 5, 6, 7, 9 |
| 9 | 2, 7 | 8 |
| 10 | 1-9 | None |
| 11 | 10 | None |
| 12 | 11 | None |

---

## Team Allocation

### Week 1: Foundation & Database
- **Backend Dev**: Database schema, repositories (Phase 1)
- **Full-Stack Dev**: Project setup, integrations (Phase 0)
- **Frontend Dev**: Start UI components planning

### Weeks 2-3: Quiz & AI
- **Backend Dev**: Quiz service, API endpoints (Phase 2)
- **Full-Stack Dev**: AI integration, archetype detection (Phases 3, 4)
- **Frontend Dev**: Quiz UI components (Phase 9 partial)

### Week 4: Integration & Profiles
- **Backend Dev**: Complete archetype testing (Phase 4)
- **Full-Stack Dev**: Notion integration, profile generation (Phases 5, 6)
- **Frontend Dev**: Results page components (Phase 9 partial)

### Weeks 5-6: Chat, UI & Launch
- **Backend Dev**: Chat service, final APIs (Phase 8)
- **Full-Stack Dev**: Testing, deployment (Phases 10, 11)
- **Frontend Dev**: UI polish, all pages (Phase 9)

---

## Risk Mitigation Strategy

### High-Risk Items

1. **Archetype Detection Accuracy**
   - **Risk**: <85% accuracy
   - **Mitigation**: Extensive testing with 50+ profiles, AI validation layer
   - **Fallback**: Algorithmic-only detection
   - **Owner**: Backend Developer

2. **Quiz Completion Rate**
   - **Risk**: <70% completion
   - **Mitigation**: User testing, progress saving, skip options
   - **Fallback**: Shorten quiz
   - **Owner**: Product Manager

3. **API Rate Limits**
   - **Risk**: Gemini/Notion rate limits exceeded
   - **Mitigation**: Caching, Flash model usage, rate limiting
   - **Fallback**: Graceful degradation
   - **Owner**: Full-Stack Developer

### Medium-Risk Items

1. **Database Performance**
   - **Mitigation**: Proper indexing, query optimization
   - **Monitoring**: Slow query alerts

2. **UI/UX Complexity**
   - **Mitigation**: MVP-first approach, parallel development
   - **Buffer**: Extra week allocated

---

## Success Metrics

### Development Metrics
- [ ] All phases completed on schedule
- [ ] 80%+ code coverage
- [ ] Zero critical bugs in production
- [ ] <2s average page load time

### Launch Metrics (Week 1)
- [ ] 100+ quiz completions
- [ ] >70% completion rate
- [ ] >85% archetype confidence average
- [ ] <5% error rate

### Month 1 Metrics
- [ ] 500+ profiles created
- [ ] >40% take action (newsletter/event signup)
- [ ] >20% share profile
- [ ] >60% resource click-through

---

## Daily Workflow

### Morning Standup (15 min)
- What did you complete yesterday?
- What are you working on today?
- Any blockers?

### Development Cycle
1. Pick next sub-task from current phase
2. Read acceptance criteria
3. Implement with tests
4. Create PR with description
5. Code review
6. Merge to staging
7. Test on staging
8. Mark complete

### End of Day
- Update task status
- Document any blockers
- Commit all work

---

## Code Review Checklist

- [ ] Follows TypeScript best practices
- [ ] Proper error handling
- [ ] Input validation (Zod)
- [ ] Tests included
- [ ] No console.logs in production code
- [ ] Proper typing (no `any`)
- [ ] Comments for complex logic
- [ ] Performance considerations
- [ ] Security considerations

---

## Definition of Done

A task is "done" when:
- [ ] Code is written and typed
- [ ] Unit tests pass
- [ ] Integration tests pass (if applicable)
- [ ] Code is reviewed and approved
- [ ] Merged to main branch
- [ ] Deployed to staging
- [ ] Tested on staging
- [ ] Documentation updated

---

## Communication Channels

### Daily
- **Standup**: Daily at 9 AM
- **Slack**: Real-time questions
- **GitHub**: Code reviews, issues

### Weekly
- **Sprint Planning**: Monday 10 AM
- **Sprint Review**: Friday 4 PM
- **Retrospective**: Friday 4:30 PM

---

## Next Steps

1. **Review this plan** with the full team
2. **Set up tools** (GitHub, Slack, project board)
3. **Assign ownership** for each phase
4. **Begin Phase 0** immediately
5. **Daily standups** starting Day 1

---

## Document Links

- **Part 1**: Foundation & Core Quiz (Phases 0-2)
- **Part 2**: AI & Integration (Phases 3-5)
- **Part 3**: Profile, UI & Launch (Phases 6-12)

- **Technical Architecture**: See project files
- **Product Requirements**: See project files
- **Quick Start Guide**: See project files

---

## Questions?

Contact the technical lead or engineering team for clarification on any task or dependency.

**Ready to build the civic stack!** 🚀

---

**Document Version**: 1.0  
**Created**: November 2025  
**Status**: Ready for Review

# OpenCivics Onboarding Assistant
## Detailed Implementation Plan v1.0

---

## Document Control

| Version | Date | Author | Status |
|---------|------|--------|--------|
| 1.0 | November 2025 | OpenCivics Engineering | Draft |

**Purpose**: Comprehensive development roadmap with sequenced tasks and dependencies  
**Audience**: Engineering team, project managers, technical leadership

---

## Table of Contents

1. [Implementation Overview](#1-implementation-overview)
2. [Phase 0: Foundation & Infrastructure](#phase-0-foundation--infrastructure-weeks-0-1)
3. [Phase 1: Database & Data Layer](#phase-1-database--data-layer-week-1)
4. [Phase 2: Core Quiz Engine](#phase-2-core-quiz-engine-weeks-2-3)
5. [Phase 3: AI Integration Layer](#phase-3-ai-integration-layer-week-3)
6. [Phase 4: Archetype Detection System](#phase-4-archetype-detection-system-weeks-3-4)
7. [Phase 5: Notion Integration](#phase-5-notion-integration-week-4)
8. [Phase 6: Profile Generation](#phase-6-profile-generation-week-4)
9. [Phase 7: Results & Recommendations](#phase-7-results--recommendations-week-4)
10. [Phase 8: Chat Interface](#phase-8-chat-interface-weeks-5-6)
11. [Phase 9: UI/UX Polish](#phase-9-uiux-polish-weeks-5-6)
12. [Phase 10: Testing & QA](#phase-10-testing--qa-week-6)
13. [Phase 11: Deployment & Launch](#phase-11-deployment--launch-week-6)
14. [Phase 12: Post-MVP Features](#phase-12-post-mvp-features-weeks-7)
15. [Dependencies Matrix](#dependencies-matrix)
16. [Risk Mitigation](#risk-mitigation)

---

## 1. Implementation Overview

### 1.1 Development Approach

- **Architecture Pattern**: Layered architecture (Presentation → API → Service → Integration → Data)
- **Work Unit Size**: Each sub-task is 2-8 hours of focused work
- **Testing Strategy**: Test-driven development for critical paths
- **Review Process**: PR review required for all code changes
- **Deployment**: Continuous deployment to staging, manual promotion to production

### 1.2 Team Structure Assumptions

- **1 Frontend Developer**: UI components, pages, client-side logic
- **1 Backend Developer**: API routes, services, data layer
- **1 Full-Stack Developer**: Integration work, AI/Notion connections
- **0.5 DevOps Engineer**: Infrastructure, deployment, monitoring

### 1.3 Timeline Summary

| Phase | Duration | Parallel Work | Dependencies |
|-------|----------|---------------|--------------|
| Phase 0 | 3-5 days | High | None |
| Phase 1 | 2-3 days | Medium | Phase 0 complete |
| Phase 2 | 5-7 days | High | Phase 1 complete |
| Phase 3 | 3-4 days | Medium | Phase 0 complete |
| Phase 4 | 4-6 days | Low | Phases 2, 3 complete |
| Phase 5 | 2-3 days | Medium | Phase 0 complete |
| Phase 6 | 3-4 days | Medium | Phases 3, 4 complete |
| Phase 7 | 3-4 days | Medium | Phases 5, 6 complete |
| Phase 8 | 5-7 days | Medium | Phase 3 complete |
| Phase 9 | 4-5 days | High | Phases 2, 7 complete |
| Phase 10 | 4-5 days | Low | All dev phases complete |
| Phase 11 | 2-3 days | Low | Phase 10 complete |

**Total Duration**: 6-7 weeks for MVP

---

## Phase 0: Foundation & Infrastructure (Weeks 0-1)

**Goal**: Set up development environment, tooling, and core infrastructure  
**Dependencies**: None  
**Estimated Duration**: 3-5 days

### Task 0.1: Project Initialization

#### Sub-task 0.1.1: Next.js Project Setup
**Owner**: Full-Stack Developer  
**Estimated Time**: 2 hours  
**Dependencies**: None

**Acceptance Criteria**:
- [x] Next.js 14 project initialized with App Router
- [x] TypeScript configured with strict mode
- [x] ESLint and Prettier configured
- [x] Git repository initialized with .gitignore
- [x] README.md with setup instructions

**Implementation Steps**:
```bash
# Commands to execute
npx create-next-app@latest opencivics-onboarding \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

# Configure tsconfig.json
# Configure .eslintrc.json
# Configure .prettierrc
# Create .env.local.example
```

**Files Created**:
- `package.json`
- `tsconfig.json`
- `.eslintrc.json`
- `.prettierrc`
- `.env.local.example`
- `README.md`

---

#### Sub-task 0.1.2: Install Core Dependencies
**Owner**: Full-Stack Developer  
**Estimated Time**: 1 hour  
**Dependencies**: 0.1.1 complete

**Acceptance Criteria**:
- [x] All required npm packages installed
- [x] Package.json includes all dependencies from tech stack
- [x] No dependency conflicts or warnings

**Dependencies to Install**:
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.38.0",
    "@google/generative-ai": "^0.1.3",
    "@notionhq/client": "^2.2.14",
    "zod": "^3.22.4",
    "swr": "^2.2.4",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.1.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0"
  }
}
```

---

#### Sub-task 0.1.3: Directory Structure Setup
**Owner**: Full-Stack Developer  
**Estimated Time**: 1 hour  
**Dependencies**: 0.1.1 complete

**Acceptance Criteria**:
- [x] Complete directory structure created per architecture
- [x] Index files created with barrel exports
- [x] .gitkeep files in empty directories

**Directory Structure**:
```
opencivics-onboarding/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   ├── quiz/
│   │   └── page.tsx
│   ├── results/
│   │   └── [profileId]/
│   │       └── page.tsx
│   ├── chat/
│   │   └── page.tsx
│   └── api/
│       ├── quiz/
│       │   ├── start/
│       │   │   └── route.ts
│       │   ├── response/
│       │   │   └── route.ts
│       │   └── complete/
│       │       └── route.ts
│       ├── resources/
│       │   └── search/
│       │       └── route.ts
│       ├── chat/
│       │   └── route.ts
│       └── profile/
│           └── image/
│               └── route.ts
├── components/
│   ├── terminal/
│   ├── quiz/
│   ├── profile/
│   ├── chat/
│   └── ui/
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── gemini/
│   ├── notion/
│   ├── services/
│   ├── repositories/
│   ├── validators/
│   ├── models/
│   └── utils/
├── hooks/
├── types/
├── styles/
└── public/
```

**Implementation**:
- Create all directories
- Add index.ts barrel exports where needed
- Add .gitkeep to empty directories

---

### Task 0.2: Environment Configuration

#### Sub-task 0.2.1: Supabase Project Setup
**Owner**: Backend Developer  
**Estimated Time**: 2 hours  
**Dependencies**: None

**Acceptance Criteria**:
- [x] Supabase project created
- [x] Project URL and anon key obtained
- [x] Service role key obtained (for server-side)
- [x] Database accessible via Supabase Studio
- [x] .env.local configured with Supabase credentials

**Implementation Steps**:
1. Create Supabase project at https://supabase.com
2. Note project URL and keys
3. Configure .env.local:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```
4. Test connection from local environment

**Files Modified**:
- `.env.local`

---

#### Sub-task 0.2.2: Gemini API Setup
**Owner**: Full-Stack Developer  
**Estimated Time**: 1 hour  
**Dependencies**: None

**Acceptance Criteria**:
- [x] Google AI Studio account created
- [x] Gemini API key obtained
- [x] API key configured in environment
- [x] Test API call successful

**Implementation Steps**:
1. Create account at https://aistudio.google.com
2. Generate API key
3. Add to .env.local:
```bash
GEMINI_API_KEY=AIzaSy...
```
4. Test with simple API call

**Files Modified**:
- `.env.local`

---

#### Sub-task 0.2.3: Notion Integration Setup
**Owner**: Full-Stack Developer  
**Estimated Time**: 2 hours  
**Dependencies**: None

**Acceptance Criteria**:
- [x] Notion integration created
- [x] Integration token obtained
- [x] Test databases shared with integration
- [x] Database IDs configured in environment
- [x] Test query successful

**Implementation Steps**:
1. Create Notion integration at https://www.notion.so/my-integrations
2. Share test databases with integration
3. Get database IDs from database URLs
4. Configure .env.local:
```bash
NOTION_API_KEY=secret_...
NOTION_CIVIC_SECTORS_DB=29b06d2570f280deabadc4f7031f0564
NOTION_INNOVATION_DOMAINS_DB=29806d2570f280ac9ba8d37aadb23610
NOTION_RESOURCES_DB=xxxxx
```
5. Test query using Notion SDK

**Files Modified**:
- `.env.local`

---

### Task 0.3: Core Infrastructure Code

#### Sub-task 0.3.1: Supabase Client Configuration
**Owner**: Backend Developer  
**Estimated Time**: 2 hours  
**Dependencies**: 0.2.1 complete

**Acceptance Criteria**:
- [x] Client-side Supabase client created
- [x] Server-side Supabase client created
- [x] TypeScript types exported
- [x] Connection tested successfully

**Files Created**:
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/types.ts`

**Implementation**: `lib/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Implementation**: `lib/supabase/server.ts`
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
```

---

#### Sub-task 0.3.2: Gemini Client Configuration
**Owner**: Full-Stack Developer  
**Estimated Time**: 2 hours  
**Dependencies**: 0.2.2 complete

**Acceptance Criteria**:
- [x] Gemini client wrapper created
- [x] Error handling implemented
- [x] Rate limiting considered
- [x] TypeScript types defined

**Files Created**:
- `lib/gemini/client.ts`
- `lib/gemini/types.ts`

**Implementation**: `lib/gemini/client.ts`
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface GeminiConfig {
  model?: 'gemini-1.5-flash' | 'gemini-1.5-pro'
  temperature?: number
  maxOutputTokens?: number
}

export async function generateContent(
  prompt: string,
  config: GeminiConfig = {}
) {
  const {
    model = 'gemini-1.5-flash',
    temperature = 0.7,
    maxOutputTokens = 2048,
  } = config

  try {
    const geminiModel = genAI.getGenerativeModel({
      model,
      generationConfig: {
        temperature,
        maxOutputTokens,
      },
    })

    const result = await geminiModel.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini API error:', error)
    throw new Error('Failed to generate content with Gemini')
  }
}

export async function generateContentWithJSON<T>(
  prompt: string,
  config: GeminiConfig = {}
): Promise<T> {
  const text = await generateContent(prompt, config)
  
  // Extract JSON from markdown code blocks if present
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/)
  const jsonText = jsonMatch ? jsonMatch[1] : text
  
  try {
    return JSON.parse(jsonText) as T
  } catch (error) {
    console.error('Failed to parse JSON from Gemini response:', text)
    throw new Error('Invalid JSON response from Gemini')
  }
}
```

---

#### Sub-task 0.3.3: Notion Client Configuration
**Owner**: Full-Stack Developer  
**Estimated Time**: 2 hours  
**Dependencies**: 0.2.3 complete

**Acceptance Criteria**:
- [x] Notion client wrapper created
- [x] Helper methods for common queries
- [x] Error handling implemented
- [x] TypeScript types defined

**Files Created**:
- `lib/notion/client.ts`
- `lib/notion/types.ts`

**Implementation**: `lib/notion/client.ts`
```typescript
import { Client } from '@notionhq/client'
import type { 
  PageObjectResponse,
  DatabaseObjectResponse 
} from '@notionhq/client/build/src/api-endpoints'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export async function queryDatabase(
  databaseId: string,
  filter?: any,
  sorts?: any[]
) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter,
      sorts,
    })
    return response.results as PageObjectResponse[]
  } catch (error) {
    console.error('Notion query error:', error)
    throw new Error('Failed to query Notion database')
  }
}

export async function getPage(pageId: string) {
  try {
    const page = await notion.pages.retrieve({
      page_id: pageId,
    })
    return page as PageObjectResponse
  } catch (error) {
    console.error('Notion get page error:', error)
    throw new Error('Failed to retrieve Notion page')
  }
}

export async function searchPages(query: string) {
  try {
    const response = await notion.search({
      query,
      filter: {
        property: 'object',
        value: 'page',
      },
    })
    return response.results as PageObjectResponse[]
  } catch (error) {
    console.error('Notion search error:', error)
    throw new Error('Failed to search Notion')
  }
}

// Helper to extract property values
export function getPropertyValue(
  page: PageObjectResponse,
  propertyName: string
): any {
  const property = page.properties[propertyName]
  
  if (!property) return null
  
  switch (property.type) {
    case 'title':
      return property.title[0]?.plain_text || ''
    case 'rich_text':
      return property.rich_text[0]?.plain_text || ''
    case 'select':
      return property.select?.name || null
    case 'multi_select':
      return property.multi_select.map(s => s.name)
    case 'number':
      return property.number
    case 'checkbox':
      return property.checkbox
    case 'url':
      return property.url
    case 'email':
      return property.email
    case 'phone_number':
      return property.phone_number
    case 'date':
      return property.date?.start || null
    default:
      return null
  }
}
```

---

#### Sub-task 0.3.4: Base TypeScript Types
**Owner**: Backend Developer  
**Estimated Time**: 2 hours  
**Dependencies**: 0.1.1 complete

**Acceptance Criteria**:
- [x] Core domain types defined
- [x] API request/response types defined
- [x] Shared types exported from central location

**Files Created**:
- `types/index.ts`
- `types/quiz.ts`
- `types/profile.ts`
- `types/archetype.ts`

**Implementation**: `types/archetype.ts`
```typescript
export type Archetype = 'allies' | 'innovators' | 'organizers' | 'patrons'

export interface ArchetypeScore {
  allies: number
  innovators: number
  organizers: number
  patrons: number
}

export interface ArchetypeResult {
  primary: Archetype
  confidence: number
  scores: ArchetypeScore
  secondary: Archetype[]
  reasoning?: string
}

export const ARCHETYPE_DESCRIPTIONS: Record<Archetype, string> = {
  allies: 'The Fundamentals Layer - Those who sense the call and want to orient',
  innovators: 'The Capacity Layer - Builders of tools, protocols, and infrastructure',
  organizers: 'The Field Layer - Coordinators and community weavers',
  patrons: 'The Capital Layer - Funders and resource providers',
}
```

**Implementation**: `types/quiz.ts`
```typescript
import type { Archetype } from './archetype'

export type QuestionType = 
  | 'single_select' 
  | 'multi_select' 
  | 'text_input' 
  | 'conversation'

export interface QuestionOption {
  value: string
  label: string
  archetype?: Archetype
  weight?: number
}

export interface Question {
  id: string
  type: QuestionType
  text: string
  purpose: string[]
  required: boolean
  options?: QuestionOption[]
  validation?: {
    minSelections?: number
    maxSelections?: number
    minLength?: number
    maxLength?: number
  }
  showIf?: string // Conditional logic expression
  archetypeSignals?: Record<string, Archetype>
}

export interface QuizConfig {
  version: string
  questions: Question[]
}

export interface QuizResponse {
  questionId: string
  value: string | string[]
  timestamp: string
}

export interface QuizSession {
  id: string
  profileId?: string
  currentQuestionIndex: number
  responses: QuizResponse[]
  startedAt: string
  completedAt?: string
}
```

**Implementation**: `types/profile.ts`
```typescript
import type { Archetype, ArchetypeScore } from './archetype'

export interface CivicInterests {
  civicSectors: string[]
  innovationDomains: string[]
  skills: string[]
}

export interface Profile {
  id: string
  name?: string
  email?: string
  archetype: Archetype
  archetypeConfidence: number
  archetypeScores: ArchetypeScore
  secondaryArchetypes: Archetype[]
  civicInterests: CivicInterests
  engagementStage: string
  timeCommitment: string
  location?: string
  background?: string
  currentWork?: string
  onboardingSummary?: string
  profileImageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface ProfileCreateInput {
  name?: string
  email?: string
}

export interface ProfileUpdateInput {
  archetype?: Archetype
  archetypeConfidence?: number
  archetypeScores?: ArchetypeScore
  secondaryArchetypes?: Archetype[]
  civicInterests?: Partial<CivicInterests>
  engagementStage?: string
  timeCommitment?: string
  location?: string
  background?: string
  currentWork?: string
  onboardingSummary?: string
  profileImageUrl?: string
}
```

---

### Task 0.4: Utility Functions

#### Sub-task 0.4.1: Common Utilities
**Owner**: Full-Stack Developer  
**Estimated Time**: 2 hours  
**Dependencies**: 0.1.1 complete

**Acceptance Criteria**:
- [x] String utilities created
- [x] Date utilities created
- [x] Validation utilities created
- [x] All functions unit tested

**Files Created**:
- `lib/utils/string.ts`
- `lib/utils/date.ts`
- `lib/utils/validation.ts`
- `lib/utils/index.ts`

**Implementation**: `lib/utils/string.ts`
```typescript
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}
```

**Implementation**: `lib/utils/validation.ts`
```typescript
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function sanitizeInput(input: string): string {
  // Remove potentially harmful characters
  return input
    .replace(/[<>]/g, '')
    .trim()
}
```

---

#### Sub-task 0.4.2: Error Handling Utilities
**Owner**: Backend Developer  
**Estimated Time**: 2 hours  
**Dependencies**: 0.1.1 complete

**Acceptance Criteria**:
- [x] Custom error classes created
- [x] Error response formatter created
- [x] API error handler middleware created

**Files Created**:
- `lib/errors/index.ts`
- `lib/errors/api-error.ts`
- `lib/utils/error-handler.ts`

**Implementation**: `lib/errors/api-error.ts`
```typescript
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export class ValidationError extends APIError {
  constructor(message: string, public fields?: Record<string, string>) {
    super(message, 400, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends APIError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends APIError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}
```

**Implementation**: `lib/utils/error-handler.ts`
```typescript
import { NextResponse } from 'next/server'
import { APIError } from '@/lib/errors/api-error'
import { ZodError } from 'zod'

export function handleAPIError(error: unknown) {
  console.error('API Error:', error)

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
          ...(error instanceof ValidationError && { fields: error.fields }),
        },
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          fields: error.flatten().fieldErrors,
        },
      },
      { status: 400 }
    )
  }

  // Generic error
  return NextResponse.json(
    {
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
    },
    { status: 500 }
  )
}
```

---

## Phase 1: Database & Data Layer (Week 1)

**Goal**: Create database schema, repositories, and data access layer  
**Dependencies**: Phase 0 complete  
**Estimated Duration**: 2-3 days

### Task 1.1: Database Schema

#### Sub-task 1.1.1: Profiles Table Schema
**Owner**: Backend Developer  
**Estimated Time**: 2 hours  
**Dependencies**: 0.2.1 complete

**Acceptance Criteria**:
- [x] Profiles table created in Supabase
- [x] All fields match specification
- [x] Indexes created for performance
- [x] RLS policies configured
- [x] Schema tested with sample data

**Implementation**: SQL Migration
```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic info
  name TEXT,
  email TEXT UNIQUE,
  
  -- Archetype
  primary_archetype TEXT NOT NULL CHECK (
    primary_archetype IN ('allies', 'innovators', 'organizers', 'patrons')
  ),
  archetype_confidence DECIMAL(3,2) NOT NULL CHECK (
    archetype_confidence >= 0 AND archetype_confidence <= 1
  ),
  archetype_scores JSONB NOT NULL,
  secondary_archetypes TEXT[] DEFAULT '{}',
  
  -- Interests
  civic_sectors TEXT[] DEFAULT '{}',
  innovation_domains TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  
  -- Engagement
  engagement_stage TEXT,
  time_commitment TEXT,
  participation_mode TEXT,
  
  -- Profile data
  location TEXT,
  background TEXT,
  current_work TEXT,
  
  -- Generated content
  onboarding_summary TEXT,
  profile_image_url TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_archetype ON profiles(primary_archetype);
CREATE INDEX idx_profiles_email ON profiles(email) WHERE email IS NOT NULL;
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX idx_profiles_civic_sectors ON profiles USING GIN(civic_sectors);
CREATE INDEX idx_profiles_innovation_domains ON profiles USING GIN(innovation_domains);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS policies (initially permissive for MVP)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Profiles are insertable by everyone"
  ON profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Profiles are updatable by owner"
  ON profiles FOR UPDATE
  USING (true); -- Will add auth later
```

**Files Created**:
- `supabase/migrations/001_create_profiles.sql`

---

#### Sub-task 1.1.2: Quiz Responses Table Schema
**Owner**: Backend Developer  
**Estimated Time**: 1.5 hours  
**Dependencies**: 1.1.1 complete

**Acceptance Criteria**:
- [x] Quiz responses table created
- [x] Foreign key to profiles configured
- [x] Indexes created
- [x] RLS policies configured

**Implementation**: SQL Migration
```sql
-- Create quiz_responses table
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_type TEXT NOT NULL,
  response_value JSONB NOT NULL, -- Supports single/multi values
  archetype_signals JSONB, -- Archetype weights from this response
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_quiz_responses_profile ON quiz_responses(profile_id);
CREATE INDEX idx_quiz_responses_question ON quiz_responses(question_id);
CREATE INDEX idx_quiz_responses_created_at ON quiz_responses(created_at DESC);

-- RLS policies
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quiz responses are viewable by everyone"
  ON quiz_responses FOR SELECT
  USING (true);

CREATE POLICY "Quiz responses are insertable by everyone"
  ON quiz_responses FOR INSERT
  WITH CHECK (true);
```

**Files Created**:
- `supabase/migrations/002_create_quiz_responses.sql`

---

#### Sub-task 1.1.3: Resource Interactions Table Schema
**Owner**: Backend Developer  
**Estimated Time**: 1.5 hours  
**Dependencies**: 1.1.1 complete

**Acceptance Criteria**:
- [x] Resource interactions table created
- [x] Proper indexing for analytics queries
- [x] RLS policies configured

**Implementation**: SQL Migration
```sql
-- Create resource_interactions table
CREATE TABLE resource_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL CHECK (
    resource_type IN ('notion_page', 'event', 'link', 'download')
  ),
  resource_id TEXT NOT NULL, -- Notion page ID or external URL
  resource_title TEXT,
  interaction_type TEXT NOT NULL CHECK (
    interaction_type IN ('view', 'click', 'download', 'share', 'bookmark')
  ),
  metadata JSONB, -- Additional context
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_resource_interactions_profile ON resource_interactions(profile_id);
CREATE INDEX idx_resource_interactions_resource ON resource_interactions(resource_id);
CREATE INDEX idx_resource_interactions_type ON resource_interactions(interaction_type);
CREATE INDEX idx_resource_interactions_created_at ON resource_interactions(created_at DESC);

-- RLS policies
ALTER TABLE resource_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Resource interactions are viewable by everyone"
  ON resource_interactions FOR SELECT
  USING (true);

CREATE POLICY "Resource interactions are insertable by everyone"
  ON resource_interactions FOR INSERT
  WITH CHECK (true);
```

**Files Created**:
- `supabase/migrations/003_create_resource_interactions.sql`

---

#### Sub-task 1.1.4: Chat Sessions Table Schema
**Owner**: Backend Developer  
**Estimated Time**: 1.5 hours  
**Dependencies**: 1.1.1 complete

**Acceptance Criteria**:
- [x] Chat sessions and messages tables created
- [x] Proper indexing for chat queries
- [x] RLS policies configured

**Implementation**: SQL Migration
```sql
-- Create chat_sessions table
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (
    session_type IN ('onboarding', 'general', 'resource_inquiry')
  ),
  context JSONB, -- Archetype, interests, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB, -- Token count, model used, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_chat_sessions_profile ON chat_sessions(profile_id);
CREATE INDEX idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Updated at trigger
CREATE TRIGGER chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS policies
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chat sessions are viewable by everyone"
  ON chat_sessions FOR SELECT
  USING (true);

CREATE POLICY "Chat sessions are insertable by everyone"
  ON chat_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Chat messages are viewable by everyone"
  ON chat_messages FOR SELECT
  USING (true);

CREATE POLICY "Chat messages are insertable by everyone"
  ON chat_messages FOR INSERT
  WITH CHECK (true);
```

**Files Created**:
- `supabase/migrations/004_create_chat_tables.sql`

---

### Task 1.2: Repository Layer

#### Sub-task 1.2.1: Profile Repository
**Owner**: Backend Developer  
**Estimated Time**: 3 hours  
**Dependencies**: 1.1.1 complete

**Acceptance Criteria**:
- [x] CRUD operations for profiles implemented
- [x] All methods properly typed
- [x] Error handling implemented
- [x] Unit tests written

**Files Created**:
- `lib/repositories/profile-repository.ts`
- `lib/repositories/__tests__/profile-repository.test.ts`

**Implementation**: `lib/repositories/profile-repository.ts`
```typescript
import { createClient } from '@/lib/supabase/server'
import type { 
  Profile, 
  ProfileCreateInput, 
  ProfileUpdateInput 
} from '@/types/profile'
import { NotFoundError } from '@/lib/errors/api-error'

export class ProfileRepository {
  private supabase

  constructor() {
    this.supabase = createClient()
  }

  async create(input: ProfileCreateInput): Promise<Profile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .insert({
        name: input.name,
        email: input.email,
        // Temporary placeholder values until quiz completes
        primary_archetype: 'allies',
        archetype_confidence: 0,
        archetype_scores: { allies: 0, innovators: 0, organizers: 0, patrons: 0 },
      })
      .select()
      .single()

    if (error) {
      console.error('Profile creation error:', error)
      throw new Error('Failed to create profile')
    }

    return this.mapToProfile(data)
  }

  async findById(id: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      console.error('Profile fetch error:', error)
      throw new Error('Failed to fetch profile')
    }

    return this.mapToProfile(data)
  }

  async findByEmail(email: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      console.error('Profile fetch error:', error)
      throw new Error('Failed to fetch profile')
    }

    return this.mapToProfile(data)
  }

  async update(id: string, input: ProfileUpdateInput): Promise<Profile> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update({
        ...(input.archetype && { primary_archetype: input.archetype }),
        ...(input.archetypeConfidence !== undefined && { 
          archetype_confidence: input.archetypeConfidence 
        }),
        ...(input.archetypeScores && { archetype_scores: input.archetypeScores }),
        ...(input.secondaryArchetypes && { 
          secondary_archetypes: input.secondaryArchetypes 
        }),
        ...(input.civicInterests && {
          civic_sectors: input.civicInterests.civicSectors,
          innovation_domains: input.civicInterests.innovationDomains,
          skills: input.civicInterests.skills,
        }),
        ...(input.engagementStage && { engagement_stage: input.engagementStage }),
        ...(input.timeCommitment && { time_commitment: input.timeCommitment }),
        ...(input.location && { location: input.location }),
        ...(input.background && { background: input.background }),
        ...(input.currentWork && { current_work: input.currentWork }),
        ...(input.onboardingSummary && { 
          onboarding_summary: input.onboardingSummary 
        }),
        ...(input.profileImageUrl && { profile_image_url: input.profileImageUrl }),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Profile update error:', error)
      throw new Error('Failed to update profile')
    }

    return this.mapToProfile(data)
  }

  async updateLastActive(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('profiles')
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      console.error('Last active update error:', error)
      // Don't throw - this is non-critical
    }
  }

  async listByArchetype(archetype: string, limit = 50): Promise<Profile[]> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('primary_archetype', archetype)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Profile list error:', error)
      throw new Error('Failed to list profiles')
    }

    return data.map(this.mapToProfile)
  }

  async getStats() {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('primary_archetype')

    if (error) {
      console.error('Profile stats error:', error)
      throw new Error('Failed to get profile stats')
    }

    const archetypeCounts = data.reduce((acc, profile) => {
      acc[profile.primary_archetype] = (acc[profile.primary_archetype] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: data.length,
      byArchetype: archetypeCounts,
    }
  }

  private mapToProfile(data: any): Profile {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      archetype: data.primary_archetype,
      archetypeConfidence: parseFloat(data.archetype_confidence),
      archetypeScores: data.archetype_scores,
      secondaryArchetypes: data.secondary_archetypes || [],
      civicInterests: {
        civicSectors: data.civic_sectors || [],
        innovationDomains: data.innovation_domains || [],
        skills: data.skills || [],
      },
      engagementStage: data.engagement_stage,
      timeCommitment: data.time_commitment,
      location: data.location,
      background: data.background,
      currentWork: data.current_work,
      onboardingSummary: data.onboarding_summary,
      profileImageUrl: data.profile_image_url,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }
}
```

---

#### Sub-task 1.2.2: Quiz Response Repository
**Owner**: Backend Developer  
**Estimated Time**: 2 hours  
**Dependencies**: 1.1.2 complete

**Acceptance Criteria**:
- [x] Save and retrieve quiz responses
- [x] Bulk operations supported
- [x] Proper error handling

**Files Created**:
- `lib/repositories/quiz-response-repository.ts`

**Implementation**: `lib/repositories/quiz-response-repository.ts`
```typescript
import { createClient } from '@/lib/supabase/server'
import type { QuizResponse } from '@/types/quiz'

interface QuizResponseRecord {
  id: string
  profile_id: string
  question_id: string
  question_type: string
  response_value: any
  archetype_signals?: any
  created_at: string
}

export class QuizResponseRepository {
  private supabase

  constructor() {
    this.supabase = createClient()
  }

  async save(
    profileId: string,
    questionId: string,
    questionType: string,
    value: string | string[],
    archetypeSignals?: Record<string, number>
  ): Promise<void> {
    const { error } = await this.supabase
      .from('quiz_responses')
      .insert({
        profile_id: profileId,
        question_id: questionId,
        question_type: questionType,
        response_value: value,
        archetype_signals: archetypeSignals,
      })

    if (error) {
      console.error('Quiz response save error:', error)
      throw new Error('Failed to save quiz response')
    }
  }

  async saveMany(
    profileId: string,
    responses: Array<{
      questionId: string
      questionType: string
      value: string | string[]
      archetypeSignals?: Record<string, number>
    }>
  ): Promise<void> {
    const records = responses.map(r => ({
      profile_id: profileId,
      question_id: r.questionId,
      question_type: r.questionType,
      response_value: r.value,
      archetype_signals: r.archetypeSignals,
    }))

    const { error } = await this.supabase
      .from('quiz_responses')
      .insert(records)

    if (error) {
      console.error('Bulk quiz response save error:', error)
      throw new Error('Failed to save quiz responses')
    }
  }

  async getByProfileId(profileId: string): Promise<QuizResponseRecord[]> {
    const { data, error } = await this.supabase
      .from('quiz_responses')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Quiz response fetch error:', error)
      throw new Error('Failed to fetch quiz responses')
    }

    return data
  }

  async getByQuestionId(
    profileId: string, 
    questionId: string
  ): Promise<QuizResponseRecord | null> {
    const { data, error } = await this.supabase
      .from('quiz_responses')
      .select('*')
      .eq('profile_id', profileId)
      .eq('question_id', questionId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      console.error('Quiz response fetch error:', error)
      throw new Error('Failed to fetch quiz response')
    }

    return data
  }

  async deleteByProfileId(profileId: string): Promise<void> {
    const { error } = await this.supabase
      .from('quiz_responses')
      .delete()
      .eq('profile_id', profileId)

    if (error) {
      console.error('Quiz response delete error:', error)
      throw new Error('Failed to delete quiz responses')
    }
  }
}
```

---

#### Sub-task 1.2.3: Resource Interaction Repository
**Owner**: Backend Developer  
**Estimated Time**: 2 hours  
**Dependencies**: 1.1.3 complete

**Acceptance Criteria**:
- [ ] Track resource interactions
- [ ] Query interactions by profile and resource
- [ ] Support analytics queries

**Files Created**:
- `lib/repositories/resource-interaction-repository.ts`

**Implementation**: `lib/repositories/resource-interaction-repository.ts`
```typescript
import { createClient } from '@/lib/supabase/server'

export interface ResourceInteraction {
  id: string
  profileId: string
  resourceType: 'notion_page' | 'event' | 'link' | 'download'
  resourceId: string
  resourceTitle?: string
  interactionType: 'view' | 'click' | 'download' | 'share' | 'bookmark'
  metadata?: Record<string, any>
  createdAt: string
}

export class ResourceInteractionRepository {
  private supabase

  constructor() {
    this.supabase = createClient()
  }

  async track(interaction: Omit<ResourceInteraction, 'id' | 'createdAt'>): Promise<void> {
    const { error } = await this.supabase
      .from('resource_interactions')
      .insert({
        profile_id: interaction.profileId,
        resource_type: interaction.resourceType,
        resource_id: interaction.resourceId,
        resource_title: interaction.resourceTitle,
        interaction_type: interaction.interactionType,
        metadata: interaction.metadata,
      })

    if (error) {
      console.error('Resource interaction tracking error:', error)
      // Don't throw - tracking is non-critical
    }
  }

  async getByProfileId(
    profileId: string,
    limit = 50
  ): Promise<ResourceInteraction[]> {
    const { data, error } = await this.supabase
      .from('resource_interactions')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Resource interaction fetch error:', error)
      throw new Error('Failed to fetch resource interactions')
    }

    return data.map(this.mapToInteraction)
  }

  async getByResourceId(
    resourceId: string,
    limit = 100
  ): Promise<ResourceInteraction[]> {
    const { data, error } = await this.supabase
      .from('resource_interactions')
      .select('*')
      .eq('resource_id', resourceId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Resource interaction fetch error:', error)
      throw new Error('Failed to fetch resource interactions')
    }

    return data.map(this.mapToInteraction)
  }

  async getPopularResources(
    limit = 10,
    interactionType?: string
  ): Promise<Array<{ resourceId: string; count: number }>> {
    let query = this.supabase
      .from('resource_interactions')
      .select('resource_id')

    if (interactionType) {
      query = query.eq('interaction_type', interactionType)
    }

    const { data, error } = await query

    if (error) {
      console.error('Popular resources fetch error:', error)
      throw new Error('Failed to fetch popular resources')
    }

    // Group by resource_id and count
    const counts = data.reduce((acc, item) => {
      acc[item.resource_id] = (acc[item.resource_id] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(counts)
      .map(([resourceId, count]) => ({ resourceId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  private mapToInteraction(data: any): ResourceInteraction {
    return {
      id: data.id,
      profileId: data.profile_id,
      resourceType: data.resource_type,
      resourceId: data.resource_id,
      resourceTitle: data.resource_title,
      interactionType: data.interaction_type,
      metadata: data.metadata,
      createdAt: data.created_at,
    }
  }
}
```

---

## Phase 2: Core Quiz Engine (Weeks 2-3)

**Goal**: Build the interactive quiz system with state management  
**Dependencies**: Phase 1 complete  
**Estimated Duration**: 5-7 days

### Task 2.1: Quiz Configuration

#### Sub-task 2.1.1: Quiz Question Configuration
**Owner**: Full-Stack Developer  
**Estimated Time**: 4 hours  
**Dependencies**: Phase 1 complete

**Acceptance Criteria**:
- [ ] All quiz questions defined in configuration
- [ ] Conditional logic implemented
- [ ] Archetype signals configured
- [ ] Validation rules defined

**Files Created**:
- `lib/quiz/config.ts`
- `lib/quiz/questions.ts`

**Implementation**: `lib/quiz/questions.ts`
```typescript
import type { Question } from '@/types/quiz'

export const QUIZ_QUESTIONS: Question[] = [
  // Section 1: Introduction
  {
    id: 'intro_name',
    type: 'text_input',
    text: 'Welcome to OpenCivics! Before we begin, what should we call you?',
    purpose: ['profile_enrichment'],
    required: false,
    validation: {
      maxLength: 100,
    },
  },
  
  {
    id: 'intro_motivation',
    type: 'conversation',
    text: 'What brings you to OpenCivics today? What are you hoping to explore or achieve?',
    purpose: ['archetype_detection', 'engagement_planning'],
    required: true,
    validation: {
      minLength: 10,
      maxLength: 500,
    },
    archetypeSignals: {
      learn: 'allies',
      understand: 'allies',
      curious: 'allies',
      build: 'innovators',
      create: 'innovators',
      develop: 'innovators',
      organize: 'organizers',
      coordinate: 'organizers',
      'bring together': 'organizers',
      fund: 'patrons',
      support: 'patrons',
      invest: 'patrons',
    },
  },

  // Section 2: Archetype Detection
  {
    id: 'resource_contribution_primary',
    type: 'single_select',
    text: 'If you were to get involved with OpenCivics, what resource would you most naturally contribute?',
    purpose: ['archetype_detection'],
    required: true,
    options: [
      {
        value: 'time_learning',
        label: 'Time to learn and explore civic innovation',
        archetype: 'allies',
        weight: 1.0,
      },
      {
        value: 'time_organizing',
        label: 'Time to coordinate, facilitate, and bring people together',
        archetype: 'organizers',
        weight: 1.0,
      },
      {
        value: 'skills_building',
        label: 'Skills and expertise to build tools, systems, or infrastructure',
        archetype: 'innovators',
        weight: 1.0,
      },
      {
        value: 'capital_funding',
        label: 'Financial resources to fund civic innovation and infrastructure',
        archetype: 'patrons',
        weight: 1.0,
      },
      {
        value: 'hybrid_multiple',
        label: 'A combination of the above',
        weight: 0.0,
      },
    ],
  },

  {
    id: 'resource_contribution_multiple',
    type: 'multi_select',
    text: 'Which of these resources can you contribute? (Select all that apply)',
    purpose: ['archetype_detection'],
    required: true,
    showIf: 'resource_contribution_primary === "hybrid_multiple"',
    options: [
      {
        value: 'time_learning',
        label: 'Time to learn and explore',
        archetype: 'allies',
        weight: 0.7,
      },
      {
        value: 'time_organizing',
        label: 'Time to organize and facilitate',
        archetype: 'organizers',
        weight: 0.7,
      },
      {
        value: 'skills_technical',
        label: 'Technical skills (coding, design, etc.)',
        archetype: 'innovators',
        weight: 0.7,
      },
      {
        value: 'capital',
        label: 'Financial capital',
        archetype: 'patrons',
        weight: 0.7,
      },
    ],
    validation: {
      minSelections: 2,
      maxSelections: 4,
    },
  },

  {
    id: 'participation_mode',
    type: 'single_select',
    text: 'Which mode of participation resonates most with you?',
    purpose: ['archetype_detection'],
    required: true,
    options: [
      {
        value: 'learning',
        label: 'Learning - Exploring new ideas and frameworks',
        archetype: 'allies',
        weight: 1.0,
      },
      {
        value: 'building',
        label: 'Building - Creating tools, protocols, or infrastructure',
        archetype: 'innovators',
        weight: 1.0,
      },
      {
        value: 'organizing',
        label: 'Organizing - Coordinating people and projects',
        archetype: 'organizers',
        weight: 1.0,
      },
      {
        value: 'funding',
        label: 'Funding - Providing financial support and resources',
        archetype: 'patrons',
        weight: 1.0,
      },
    ],
  },

  {
    id: 'engagement_stage',
    type: 'single_select',
    text: 'Where are you in your civic innovation journey?',
    purpose: ['archetype_detection', 'engagement_planning'],
    required: true,
    options: [
      {
        value: 'new_curious',
        label: 'Just starting - curious and exploring',
        archetype: 'allies',
        weight: 0.9,
      },
      {
        value: 'learning_active',
        label: 'Actively learning - diving into concepts',
        archetype: 'allies',
        weight: 0.8,
      },
      {
        value: 'building_something',
        label: 'Building something - have a specific project',
        archetype: 'innovators',
        weight: 0.9,
      },
      {
        value: 'organizing_locally',
        label: 'Organizing locally - coordinating initiatives',
        archetype: 'organizers',
        weight: 0.9,
      },
      {
        value: 'funding_supporting',
        label: 'Funding or supporting - looking to invest resources',
        archetype: 'patrons',
        weight: 0.9,
      },
      {
        value: 'experienced_looking',
        label: 'Experienced practitioner - looking to deepen impact',
        weight: 0.6,
      },
    ],
  },

  // Section 3: Interest Mapping
  {
    id: 'civic_sectors',
    type: 'multi_select',
    text: 'Which civic sectors interest you most? (Select up to 5)',
    purpose: ['interest_mapping'],
    required: true,
    options: [
      { value: 'governance', label: 'Governance & Democracy' },
      { value: 'education', label: 'Education' },
      { value: 'health', label: 'Health & Wellbeing' },
      { value: 'environment', label: 'Environment & Climate' },
      { value: 'economy', label: 'Economy & Work' },
      { value: 'culture', label: 'Culture & Arts' },
      { value: 'infrastructure', label: 'Infrastructure & Urban Planning' },
      { value: 'justice', label: 'Justice & Equity' },
      { value: 'community', label: 'Community & Social Cohesion' },
      { value: 'technology', label: 'Technology & Digital' },
    ],
    validation: {
      minSelections: 1,
      maxSelections: 5,
    },
  },

  {
    id: 'innovation_domains',
    type: 'multi_select',
    text: 'Which approaches to civic innovation resonate with you? (Select up to 5)',
    purpose: ['interest_mapping'],
    required: true,
    options: [
      { value: 'network_governance', label: 'Network Governance' },
      { value: 'open_protocols', label: 'Open Protocols & Standards' },
      { value: 'participatory_budgeting', label: 'Participatory Budgeting' },
      { value: 'civic_tech', label: 'Civic Technology' },
      { value: 'community_organizing', label: 'Community Organizing' },
      { value: 'social_innovation', label: 'Social Innovation' },
      { value: 'regenerative_systems', label: 'Regenerative Systems' },
      { value: 'digital_commons', label: 'Digital Commons' },
      { value: 'cooperative_economics', label: 'Cooperative Economics' },
      { value: 'deliberative_democracy', label: 'Deliberative Democracy' },
    ],
    validation: {
      minSelections: 1,
      maxSelections: 5,
    },
  },

  // Section 4: Skills & Capacity
  {
    id: 'skills',
    type: 'multi_select',
    text: 'What skills or expertise can you bring? (Select all that apply)',
    purpose: ['profile_enrichment', 'archetype_validation'],
    required: false,
    options: [
      { value: 'technical_engineering', label: 'Software Engineering', archetype: 'innovators', weight: 0.5 },
      { value: 'technical_design', label: 'UX/UI Design', archetype: 'innovators', weight: 0.5 },
      { value: 'technical_data', label: 'Data Science & Analysis', archetype: 'innovators', weight: 0.5 },
      { value: 'facilitation', label: 'Facilitation & Mediation', archetype: 'organizers', weight: 0.5 },
      { value: 'community_building', label: 'Community Building', archetype: 'organizers', weight: 0.5 },
      { value: 'project_management', label: 'Project Management', archetype: 'organizers', weight: 0.3 },
      { value: 'fundraising', label: 'Fundraising & Development', archetype: 'patrons', weight: 0.4 },
      { value: 'grant_writing', label: 'Grant Writing', archetype: 'patrons', weight: 0.3 },
      { value: 'research', label: 'Research & Analysis', archetype: 'allies', weight: 0.3 },
      { value: 'writing', label: 'Writing & Communication' },
      { value: 'policy', label: 'Policy & Advocacy' },
      { value: 'education', label: 'Teaching & Training' },
    ],
  },

  {
    id: 'time_commitment',
    type: 'single_select',
    text: 'How much time can you commit to civic innovation work?',
    purpose: ['engagement_planning'],
    required: true,
    options: [
      {
        value: 'exploring',
        label: 'Just exploring - a few hours per month',
      },
      {
        value: 'part_time',
        label: 'Part-time involvement - 5-10 hours per month',
      },
      {
        value: 'active',
        label: 'Active participant - 10-20 hours per month',
      },
      {
        value: 'dedicated',
        label: 'Dedicated contributor - 20+ hours per month',
      },
      {
        value: 'professional',
        label: 'Professional role - this is my primary work',
      },
    ],
  },

  // Section 5: Context & Background
  {
    id: 'location',
    type: 'text_input',
    text: 'Where are you based? (Optional - helps us connect you locally)',
    purpose: ['profile_enrichment', 'matching'],
    required: false,
    validation: {
      maxLength: 100,
    },
  },

  {
    id: 'background',
    type: 'conversation',
    text: 'Tell us a bit about yourself - your background, interests, or what drives your civic engagement. (Optional but helps us understand you better!)',
    purpose: ['profile_enrichment', 'archetype_validation'],
    required: false,
    validation: {
      maxLength: 1000,
    },
  },

  {
    id: 'current_work',
    type: 'conversation',
    text: 'Are you currently working on any civic projects, initiatives, or funding strategies? Tell us about it!',
    purpose: ['profile_enrichment', 'matching'],
    required: false,
    showIf: 'engagement_stage IN ["building_something", "organizing_locally", "funding_supporting", "experienced_looking"]',
    validation: {
      maxLength: 1000,
    },
  },
]

export const QUIZ_CONFIG = {
  version: '1.0',
  questions: QUIZ_QUESTIONS,
}
```

---

#### Sub-task 2.1.2: Quiz Conditional Logic Engine
**Owner**: Backend Developer  
**Estimated Time**: 3 hours  
**Dependencies**: 2.1.1 complete

**Acceptance Criteria**:
- [ ] Parse and evaluate showIf conditions
- [ ] Handle complex boolean logic
- [ ] Support various comparison operators
- [ ] Unit tests for all logic cases

**Files Created**:
- `lib/quiz/conditional-logic.ts`
- `lib/quiz/__tests__/conditional-logic.test.ts`

**Implementation**: `lib/quiz/conditional-logic.ts`
```typescript
import type { QuizResponse } from '@/types/quiz'

export function evaluateCondition(
  condition: string,
  responses: QuizResponse[]
): boolean {
  // Simple expression evaluator for quiz conditions
  // Supports: ===, IN, AND, OR
  
  const responseMap = responses.reduce((acc, response) => {
    acc[response.questionId] = response.value
    return acc
  }, {} as Record<string, string | string[]>)

  try {
    // Replace question IDs with actual values
    let expression = condition
    
    // Handle IN operator: question_id IN ["value1", "value2"]
    const inMatch = expression.match(/(\w+)\s+IN\s+\[(.*?)\]/)
    if (inMatch) {
      const [, questionId, values] = inMatch
      const questionValue = responseMap[questionId]
      const allowedValues = values.split(',').map(v => v.trim().replace(/['"]/g, ''))
      
      if (Array.isArray(questionValue)) {
        return questionValue.some(v => allowedValues.includes(v))
      }
      return allowedValues.includes(questionValue as string)
    }

    // Handle equality: question_id === "value"
    const eqMatch = expression.match(/(\w+)\s+===\s+["'](.+?)["']/)
    if (eqMatch) {
      const [, questionId, expectedValue] = eqMatch
      const questionValue = responseMap[questionId]
      return questionValue === expectedValue
    }

    return false
  } catch (error) {
    console.error('Condition evaluation error:', error, condition)
    return false
  }
}

export function shouldShowQuestion(
  questionId: string,
  showIf: string | undefined,
  responses: QuizResponse[]
): boolean {
  if (!showIf) return true
  return evaluateCondition(showIf, responses)
}

export function getNextQuestion(
  questions: any[],
  currentIndex: number,
  responses: QuizResponse[]
): { question: any; index: number } | null {
  for (let i = currentIndex + 1; i < questions.length; i++) {
    const question = questions[i]
    if (shouldShowQuestion(question.id, question.showIf, responses)) {
      return { question, index: i }
    }
  }
  return null
}

export function getPreviousQuestion(
  questions: any[],
  currentIndex: number,
  responses: QuizResponse[]
): { question: any; index: number } | null {
  for (let i = currentIndex - 1; i >= 0; i--) {
    const question = questions[i]
    if (shouldShowQuestion(question.id, question.showIf, responses)) {
      return { question, index: i }
    }
  }
  return null
}
```

---

### Task 2.2: Quiz State Management

#### Sub-task 2.2.1: Quiz Session Service
**Owner**: Backend Developer  
**Estimated Time**: 4 hours  
**Dependencies**: 2.1.1, Phase 1 complete

**Acceptance Criteria**:
- [ ] Start quiz session
- [ ] Save responses incrementally
- [ ] Track progress
- [ ] Handle session resumption
- [ ] Unit tests written

**Files Created**:
- `lib/services/quiz-service.ts`
- `lib/services/__tests__/quiz-service.test.ts`

**Implementation**: `lib/services/quiz-service.ts`
```typescript
import { ProfileRepository } from '@/lib/repositories/profile-repository'
import { QuizResponseRepository } from '@/lib/repositories/quiz-response-repository'
import { QUIZ_CONFIG } from '@/lib/quiz/config'
import { 
  shouldShowQuestion, 
  getNextQuestion, 
  getPreviousQuestion 
} from '@/lib/quiz/conditional-logic'
import type { QuizResponse, QuizSession, Question } from '@/types/quiz'

export class QuizService {
  private profileRepo: ProfileRepository
  private responseRepo: QuizResponseRepository

  constructor() {
    this.profileRepo = new ProfileRepository()
    this.responseRepo = new QuizResponseRepository()
  }

  async startQuiz(name?: string, email?: string): Promise<QuizSession> {
    // Create profile
    const profile = await this.profileRepo.create({ name, email })

    // Initialize session
    const session: QuizSession = {
      id: profile.id,
      profileId: profile.id,
      currentQuestionIndex: 0,
      responses: [],
      startedAt: new Date().toISOString(),
    }

    return session
  }

  async saveResponse(
    profileId: string,
    questionId: string,
    value: string | string[]
  ): Promise<void> {
    const question = QUIZ_CONFIG.questions.find(q => q.id === questionId)
    if (!question) {
      throw new Error(`Question not found: ${questionId}`)
    }

    // Calculate archetype signals from response
    const archetypeSignals = this.calculateArchetypeSignals(question, value)

    // Save to database
    await this.responseRepo.save(
      profileId,
      questionId,
      question.type,
      value,
      archetypeSignals
    )
  }

  async getSession(profileId: string): Promise<QuizSession> {
    const responses = await this.responseRepo.getByProfileId(profileId)
    const profile = await this.profileRepo.findById(profileId)

    if (!profile) {
      throw new Error('Profile not found')
    }

    // Convert DB responses to QuizResponse format
    const quizResponses: QuizResponse[] = responses.map(r => ({
      questionId: r.question_id,
      value: r.response_value,
      timestamp: r.created_at,
    }))

    // Determine current question index
    const currentQuestionIndex = this.getCurrentQuestionIndex(quizResponses)

    return {
      id: profileId,
      profileId,
      currentQuestionIndex,
      responses: quizResponses,
      startedAt: profile.createdAt,
      completedAt: profile.updatedAt !== profile.createdAt ? profile.updatedAt : undefined,
    }
  }

  async getNextQuestion(
    profileId: string
  ): Promise<{ question: Question; index: number; progress: number } | null> {
    const session = await this.getSession(profileId)
    
    const next = getNextQuestion(
      QUIZ_CONFIG.questions,
      session.currentQuestionIndex,
      session.responses
    )

    if (!next) return null

    const progress = this.calculateProgress(session.responses)

    return {
      question: next.question,
      index: next.index,
      progress,
    }
  }

  async getPreviousQuestion(
    profileId: string
  ): Promise<{ question: Question; index: number } | null> {
    const session = await this.getSession(profileId)
    
    return getPreviousQuestion(
      QUIZ_CONFIG.questions,
      session.currentQuestionIndex,
      session.responses
    )
  }

  async isQuizComplete(profileId: string): Promise<boolean> {
    const session = await this.getSession(profileId)
    
    // Check if all required questions have been answered
    const requiredQuestions = QUIZ_CONFIG.questions.filter(q => q.required)
    const answeredQuestions = new Set(session.responses.map(r => r.questionId))

    for (const question of requiredQuestions) {
      if (!shouldShowQuestion(question.id, question.showIf, session.responses)) {
        continue
      }
      if (!answeredQuestions.has(question.id)) {
        return false
      }
    }

    return true
  }

  private getCurrentQuestionIndex(responses: QuizResponse[]): number {
    if (responses.length === 0) return 0

    const answeredQuestionIds = new Set(responses.map(r => r.questionId))
    
    for (let i = 0; i < QUIZ_CONFIG.questions.length; i++) {
      const question = QUIZ_CONFIG.questions[i]
      if (!shouldShowQuestion(question.id, question.showIf, responses)) {
        continue
      }
      if (!answeredQuestionIds.has(question.id)) {
        return i
      }
    }

    return QUIZ_CONFIG.questions.length - 1
  }

  private calculateProgress(responses: QuizResponse[]): number {
    // Count questions that should be shown based on responses
    const relevantQuestions = QUIZ_CONFIG.questions.filter(q =>
      shouldShowQuestion(q.id, q.showIf, responses)
    )

    if (relevantQuestions.length === 0) return 0

    const answered = responses.length
    const total = relevantQuestions.length

    return Math.round((answered / total) * 100)
  }

  private calculateArchetypeSignals(
    question: Question,
    value: string | string[]
  ): Record<string, number> | undefined {
    if (!question.options) return undefined

    const signals: Record<string, number> = {
      allies: 0,
      innovators: 0,
      organizers: 0,
      patrons: 0,
    }

    const values = Array.isArray(value) ? value : [value]

    for (const val of values) {
      const option = question.options.find(opt => opt.value === val)
      if (option && option.archetype && option.weight) {
        signals[option.archetype] += option.weight
      }
    }

    return signals
  }
}
```

---

### Task 2.3: Quiz API Endpoints

#### Sub-task 2.3.1: Start Quiz Endpoint
**Owner**: Backend Developer  
**Estimated Time**: 2 hours  
**Dependencies**: 2.2.1 complete

**Acceptance Criteria**:
- [ ] POST /api/quiz/start endpoint created
- [ ] Returns profile ID and first question
- [ ] Input validation with Zod
- [ ] Error handling implemented

**Files Created**:
- `app/api/quiz/start/route.ts`
- `lib/validators/quiz-validators.ts`

**Implementation**: `lib/validators/quiz-validators.ts`
```typescript
import { z } from 'zod'

export const startQuizSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email().optional(),
})

export const saveResponseSchema = z.object({
  profileId: z.string().uuid(),
  questionId: z.string(),
  value: z.union([z.string(), z.array(z.string())]),
})

export const getQuestionSchema = z.object({
  profileId: z.string().uuid(),
})
```

**Implementation**: `app/api/quiz/start/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { QuizService } from '@/lib/services/quiz-service'
import { startQuizSchema } from '@/lib/validators/quiz-validators'
import { handleAPIError } from '@/lib/utils/error-handler'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = startQuizSchema.parse(body)

    const quizService = new QuizService()
    const session = await quizService.startQuiz(validated.name, validated.email)

    // Get first question
    const next = await quizService.getNextQuestion(session.profileId)

    return NextResponse.json({
      profileId: session.profileId,
      question: next?.question,
      questionIndex: next?.index ?? 0,
      progress: next?.progress ?? 0,
    })
  } catch (error) {
    return handleAPIError(error)
  }
}
```

---

#### Sub-task 2.3.2: Save Response Endpoint
**Owner**: Backend Developer  
**Estimated Time**: 2 hours  
**Dependencies**: 2.2.1 complete

**Acceptance Criteria**:
- [ ] POST /api/quiz/response endpoint created
- [ ] Saves response and returns next question
- [ ] Handles conditional logic
- [ ] Returns progress percentage

**Files Created**:
- `app/api/quiz/response/route.ts`

**Implementation**: `app/api/quiz/response/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { QuizService } from '@/lib/services/quiz-service'
import { saveResponseSchema } from '@/lib/validators/quiz-validators'
import { handleAPIError } from '@/lib/utils/error-handler'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = saveResponseSchema.parse(body)

    const quizService = new QuizService()
    
    // Save the response
    await quizService.saveResponse(
      validated.profileId,
      validated.questionId,
      validated.value
    )

    // Check if quiz is complete
    const isComplete = await quizService.isQuizComplete(validated.profileId)

    if (isComplete) {
      return NextResponse.json({
        complete: true,
        profileId: validated.profileId,
      })
    }

    // Get next question
    const next = await quizService.getNextQuestion(validated.profileId)

    if (!next) {
      return NextResponse.json({
        complete: true,
        profileId: validated.profileId,
      })
    }

    return NextResponse.json({
      complete: false,
      question: next.question,
      questionIndex: next.index,
      progress: next.progress,
    })
  } catch (error) {
    return handleAPIError(error)
  }
}
```

---

#### Sub-task 2.3.3: Complete Quiz Endpoint
**Owner**: Backend Developer  
**Estimated Time**: 2 hours  
**Dependencies**: 2.2.1 complete

**Acceptance Criteria**:
- [ ] POST /api/quiz/complete endpoint created
- [ ] Triggers archetype detection
- [ ] Returns detected archetype
- [ ] Handles incomplete quiz error

**Files Created**:
- `app/api/quiz/complete/route.ts`

**Implementation**: `app/api/quiz/complete/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { QuizService } from '@/lib/services/quiz-service'
import { ArchetypeDetectionService } from '@/lib/services/archetype-detection-service'
import { getQuestionSchema } from '@/lib/validators/quiz-validators'
import { handleAPIError } from '@/lib/utils/error-handler'
import { ValidationError } from '@/lib/errors/api-error'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = getQuestionSchema.parse(body)

    const quizService = new QuizService()
    const isComplete = await quizService.isQuizComplete(validated.profileId)

    if (!isComplete) {
      throw new ValidationError('Quiz is not yet complete')
    }

    // Trigger archetype detection (will implement in Phase 4)
    const archetypeService = new ArchetypeDetectionService()
    const result = await archetypeService.detectArchetype(validated.profileId)

    return NextResponse.json({
      profileId: validated.profileId,
      archetype: result,
    })
  } catch (error) {
    return handleAPIError(error)
  }
}
```

---

*[Continue to Phase 3 in next section...]*

---

## Dependencies Matrix

| Task | Depends On | Can Work In Parallel With |
|------|-----------|---------------------------|
| 0.1.x | None | 0.2.x, 0.3.x |
| 0.2.x | None | 0.1.x, 0.3.x, 0.4.x |
| 0.3.x | 0.1.1, 0.2.x | 0.4.x |
| 0.4.x | 0.1.1 | 0.2.x, 0.3.x |
| 1.1.x | 0.2.1 | 0.3.x, 0.4.x |
| 1.2.x | 1.1.x | None |
| 2.1.x | Phase 1 | None |
| 2.2.x | 2.1.1, Phase 1 | None |
| 2.3.x | 2.2.1 | None |

---

## Risk Mitigation

### Technical Risks

1. **Gemini API Rate Limits**
   - Mitigation: Implement caching, use Flash model for non-critical tasks
   - Fallback: Local algorithmic detection if API fails

2. **Notion API Performance**
   - Mitigation: Cache frequently accessed data, background sync
   - Fallback: Static resource data

3. **Database Performance**
   - Mitigation: Proper indexing, query optimization
   - Monitoring: Set up alerts for slow queries

### Schedule Risks

1. **Complex Archetype Detection**
   - Buffer: 2-3 extra days allocated
   - Mitigation: Start with simple algorithmic approach, enhance with AI

2. **UI/UX Polish Takes Longer**
   - Mitigation: Parallel workstream, MVP-first approach
   - Buffer: Extra week in Phase 9

---

# OpenCivics Onboarding Assistant
## Detailed Implementation Plan v1.0 - Part 2

**Continuation from Part 1**

---

## Phase 3: AI Integration Layer (Week 3)

**Goal**: Integrate Gemini AI for archetype validation and content generation  
**Dependencies**: Phase 0 complete  
**Estimated Duration**: 3-4 days

### Task 3.1: Archetype Analysis Prompts

#### Sub-task 3.1.1: Prompt Engineering for Archetype Detection
**Owner**: Full-Stack Developer  
**Estimated Time**: 3 hours  
**Dependencies**: 0.3.2 complete

**Acceptance Criteria**:
- [x] Archetype analysis prompt created
- [x] JSON response format validated
- [x] Tested with sample responses
- [x] Accuracy >85% on test cases

**Files Created**:
- `lib/gemini/prompts/archetype-analysis.ts`

**Implementation**: `lib/gemini/prompts/archetype-analysis.ts`
```typescript
import type { QuizResponse } from '@/types/quiz'
import type { ArchetypeScore } from '@/types/archetype'

export function buildArchetypeAnalysisPrompt(
  responses: QuizResponse[],
  algorithmicScores: ArchetypeScore
): string {
  const responsesText = responses
    .map(r => `Question: ${r.questionId}\nAnswer: ${JSON.stringify(r.value)}`)
    .join('\n\n')

  return `You are an expert civic engagement analyst for OpenCivics.

Based on these quiz responses, validate and refine the archetype classification.

QUIZ RESPONSES:
${responsesText}

ALGORITHMIC SCORES:
${JSON.stringify(algorithmicScores, null, 2)}

ARCHETYPE DEFINITIONS:
- **Allies** (Fundamentals Layer): Those who sense the call and want to orient. They are learning-mode participants, new to civic innovation, exploring frameworks and ideas. They bring time for learning and curiosity.

- **Innovators** (Capacity Layer): Builders of tools, protocols, and infrastructure. They bring technical skills, design expertise, and builder mindset. They are creating tangible systems and solutions.

- **Organizers** (Field Layer): Coordinators and community weavers. They bring facilitation skills, relationship building, and coordination capacity. They are organizing people, initiatives, and movements.

- **Patrons** (Capital Layer): Funders and resource providers. They bring financial capital, funding expertise, and strategic support. They are investing in civic infrastructure and innovation.

TASK:
Analyze the responses holistically and provide:
1. Validation of the primary archetype (or suggest a different one)
2. Confidence score (0-1)
3. Refined archetype scores for all four archetypes
4. Secondary archetypes if applicable (score > 0.2)
5. Brief reasoning for the classification

Respond with ONLY a valid JSON object in this exact format:
{
  "primary": "allies" | "innovators" | "organizers" | "patrons",
  "confidence": 0.95,
  "scores": {
    "allies": 0.15,
    "innovators": 0.05,
    "organizers": 0.05,
    "patrons": 0.75
  },
  "secondary": ["organizers"],
  "reasoning": "Brief explanation of the classification"
}

DO NOT include any text outside the JSON object.
DO NOT use markdown code blocks.
ENSURE all scores sum to approximately 1.0.
`
}

export function buildConversationalAnalysisPrompt(
  question: string,
  answer: string
): string {
  return `Analyze this quiz response for archetype signals.

Question: ${question}
Answer: ${answer}

Identify keywords and themes that suggest:
- Allies signals: learning, exploring, understanding, curious, new
- Innovators signals: building, creating, developing, technical, design
- Organizers signals: coordinating, facilitating, organizing, community, bringing together
- Patrons signals: funding, supporting, investing, capital, resources

Respond with ONLY a valid JSON object:
{
  "signals": {
    "allies": ["keyword1", "keyword2"],
    "innovators": [],
    "organizers": ["keyword3"],
    "patrons": []
  },
  "dominantArchetype": "allies" | "innovators" | "organizers" | "patrons" | null
}
`
}
```

---

#### Sub-task 3.1.2: Summary Generation Prompt
**Owner**: Full-Stack Developer  
**Estimated Time**: 2 hours  
**Dependencies**: 0.3.2 complete

**Acceptance Criteria**:
- [x] Summary generation prompt created
- [x] Outputs personalized onboarding summary
- [x] Includes archetype description
- [x] Includes action items

**Files Created**:
- `lib/gemini/prompts/summary-generation.ts`

**Implementation**: `lib/gemini/prompts/summary-generation.ts`
```typescript
import type { Profile } from '@/types/profile'
import { ARCHETYPE_DESCRIPTIONS } from '@/types/archetype'

export function buildSummaryPrompt(profile: Profile): string {
  return `You are an expert civic engagement guide for OpenCivics.

Create a warm, personalized onboarding summary for this participant.

PARTICIPANT PROFILE:
- Name: ${profile.name || 'there'}
- Primary Archetype: ${profile.archetype}
- Confidence: ${Math.round(profile.archetypeConfidence * 100)}%
- Secondary Archetypes: ${profile.secondaryArchetypes.join(', ') || 'none'}
- Civic Sectors: ${profile.civicInterests.civicSectors.join(', ')}
- Innovation Domains: ${profile.civicInterests.innovationDomains.join(', ')}
- Engagement Stage: ${profile.engagementStage}
- Time Commitment: ${profile.timeCommitment}
${profile.background ? `- Background: ${profile.background}` : ''}
${profile.currentWork ? `- Current Work: ${profile.currentWork}` : ''}

ARCHETYPE DESCRIPTION:
${ARCHETYPE_DESCRIPTIONS[profile.archetype]}

TASK:
Write a 2-3 paragraph personalized summary that:
1. Welcomes them warmly to OpenCivics
2. Affirms their archetype and what it means
3. Highlights their specific interests and how they connect to OpenCivics
4. Suggests 2-3 concrete next steps based on their archetype and stage

TONE: Warm, encouraging, specific, actionable
LENGTH: 200-300 words
FORMAT: Plain text paragraphs (no markdown, no bullet points in the summary itself)

Include a section at the end titled "Your Next Steps:" with 3 specific actions.
`
}
```

---

### Task 3.2: Content Generation Services

#### Sub-task 3.2.1: Summary Generator Service
**Owner**: Full-Stack Developer  
**Estimated Time**: 3 hours  
**Dependencies**: 3.1.2, 0.3.2 complete

**Acceptance Criteria**:
- [x] Service generates summaries via Gemini
- [x] Handles errors gracefully
- [x] Caches results
- [x] Updates profile with summary

**Files Created**:
- `lib/services/summary-generator-service.ts`

**Implementation**: `lib/services/summary-generator-service.ts`
```typescript
import { ProfileRepository } from '@/lib/repositories/profile-repository'
import { generateContent } from '@/lib/gemini/client'
import { buildSummaryPrompt } from '@/lib/gemini/prompts/summary-generation'

export class SummaryGeneratorService {
  private profileRepo: ProfileRepository

  constructor() {
    this.profileRepo = new ProfileRepository()
  }

  async generateSummary(profileId: string): Promise<string> {
    // Get profile
    const profile = await this.profileRepo.findById(profileId)
    if (!profile) {
      throw new Error('Profile not found')
    }

    // Check if summary already exists
    if (profile.onboardingSummary) {
      return profile.onboardingSummary
    }

    // Generate with Gemini
    const prompt = buildSummaryPrompt(profile)
    const summary = await generateContent(prompt, {
      model: 'gemini-1.5-flash',
      temperature: 0.8,
      maxOutputTokens: 1024,
    })

    // Save to profile
    await this.profileRepo.update(profileId, {
      onboardingSummary: summary,
    })

    return summary
  }

  async regenerateSummary(profileId: string): Promise<string> {
    const profile = await this.profileRepo.findById(profileId)
    if (!profile) {
      throw new Error('Profile not found')
    }

    const prompt = buildSummaryPrompt(profile)
    const summary = await generateContent(prompt, {
      model: 'gemini-1.5-flash',
      temperature: 0.8,
      maxOutputTokens: 1024,
    })

    await this.profileRepo.update(profileId, {
      onboardingSummary: summary,
    })

    return summary
  }
}
```

---

#### Sub-task 3.2.2: Conversational Response Analyzer
**Owner**: Full-Stack Developer  
**Estimated Time**: 2 hours  
**Dependencies**: 3.1.1, 0.3.2 complete

**Acceptance Criteria**:
- [x] Analyzes open-ended responses for signals
- [x] Returns structured archetype signals
- [x] Handles API errors

**Files Created**:
- `lib/services/conversational-analyzer-service.ts`

**Implementation**: `lib/services/conversational-analyzer-service.ts`
```typescript
import { generateContentWithJSON } from '@/lib/gemini/client'
import { buildConversationalAnalysisPrompt } from '@/lib/gemini/prompts/archetype-analysis'

interface ConversationalAnalysisResult {
  signals: {
    allies: string[]
    innovators: string[]
    organizers: string[]
    patrons: string[]
  }
  dominantArchetype: string | null
}

export class ConversationalAnalyzerService {
  async analyze(
    question: string,
    answer: string
  ): Promise<ConversationalAnalysisResult> {
    if (!answer || answer.length < 10) {
      return {
        signals: {
          allies: [],
          innovators: [],
          organizers: [],
          patrons: [],
        },
        dominantArchetype: null,
      }
    }

    try {
      const prompt = buildConversationalAnalysisPrompt(question, answer)
      const result = await generateContentWithJSON<ConversationalAnalysisResult>(
        prompt,
        {
          model: 'gemini-1.5-flash',
          temperature: 0.3,
          maxOutputTokens: 512,
        }
      )

      return result
    } catch (error) {
      console.error('Conversational analysis error:', error)
      // Return empty result on error
      return {
        signals: {
          allies: [],
          innovators: [],
          organizers: [],
          patrons: [],
        },
        dominantArchetype: null,
      }
    }
  }

  async analyzeMultiple(
    responses: Array<{ question: string; answer: string }>
  ): Promise<Map<string, ConversationalAnalysisResult>> {
    const results = new Map<string, ConversationalAnalysisResult>()

    for (const { question, answer } of responses) {
      const result = await this.analyze(question, answer)
      results.set(question, result)
    }

    return results
  }
}
```

---

## Phase 4: Archetype Detection System (Weeks 3-4)

**Goal**: Implement complete archetype detection with AI validation  
**Dependencies**: Phases 2, 3 complete  
**Estimated Duration**: 4-6 days

### Task 4.1: Algorithmic Scoring

#### Sub-task 4.1.1: Score Calculation Engine
**Owner**: Backend Developer  
**Estimated Time**: 4 hours  
**Dependencies**: Phase 2 complete

**Acceptance Criteria**:
- [ ] Calculates archetype scores from responses
- [ ] Handles weighted scoring
- [ ] Processes conversational responses
- [ ] Returns normalized scores

**Files Created**:
- `lib/services/scoring-engine.ts`

**Implementation**: `lib/services/scoring-engine.ts`
```typescript
import { QuizResponseRepository } from '@/lib/repositories/quiz-response-repository'
import { ConversationalAnalyzerService } from './conversational-analyzer-service'
import { QUIZ_CONFIG } from '@/lib/quiz/config'
import type { ArchetypeScore, Archetype } from '@/types/archetype'

export class ScoringEngine {
  private responseRepo: QuizResponseRepository
  private conversationalAnalyzer: ConversationalAnalyzerService

  constructor() {
    this.responseRepo = new QuizResponseRepository()
    this.conversationalAnalyzer = new ConversationalAnalyzerService()
  }

  async calculateScores(profileId: string): Promise<ArchetypeScore> {
    // Get all responses
    const responses = await this.responseRepo.getByProfileId(profileId)

    // Initialize scores
    const scores: ArchetypeScore = {
      allies: 0,
      innovators: 0,
      organizers: 0,
      patrons: 0,
    }

    // Process each response
    for (const response of responses) {
      // Get question config
      const question = QUIZ_CONFIG.questions.find(
        q => q.id === response.question_id
      )
      if (!question) continue

      // Add archetype signals from stored data
      if (response.archetype_signals) {
        const signals = response.archetype_signals as Record<string, number>
        Object.entries(signals).forEach(([archetype, weight]) => {
          if (archetype in scores) {
            scores[archetype as Archetype] += weight
          }
        })
      }

      // For conversational questions, add AI-detected signals
      if (question.type === 'conversation' && response.response_value) {
        const analysis = await this.conversationalAnalyzer.analyze(
          question.text,
          response.response_value as string
        )

        // Weight conversational signals lower (0.3)
        Object.entries(analysis.signals).forEach(([archetype, keywords]) => {
          if (keywords.length > 0 && archetype in scores) {
            scores[archetype as Archetype] += 0.3
          }
        })
      }
    }

    // Normalize scores to sum to 1.0
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0)
    
    if (total > 0) {
      Object.keys(scores).forEach(archetype => {
        scores[archetype as Archetype] = scores[archetype as Archetype] / total
      })
    }

    return scores
  }

  async getInterestMapping(profileId: string): Promise<{
    civicSectors: string[]
    innovationDomains: string[]
    skills: string[]
  }> {
    const responses = await this.responseRepo.getByProfileId(profileId)

    const interests = {
      civicSectors: [] as string[],
      innovationDomains: [] as string[],
      skills: [] as string[],
    }

    // Extract from relevant questions
    const sectorResponse = responses.find(r => r.question_id === 'civic_sectors')
    if (sectorResponse && Array.isArray(sectorResponse.response_value)) {
      interests.civicSectors = sectorResponse.response_value
    }

    const domainResponse = responses.find(r => r.question_id === 'innovation_domains')
    if (domainResponse && Array.isArray(domainResponse.response_value)) {
      interests.innovationDomains = domainResponse.response_value
    }

    const skillsResponse = responses.find(r => r.question_id === 'skills')
    if (skillsResponse && Array.isArray(skillsResponse.response_value)) {
      interests.skills = skillsResponse.response_value
    }

    return interests
  }

  async getEngagementData(profileId: string): Promise<{
    engagementStage?: string
    timeCommitment?: string
    location?: string
    background?: string
    currentWork?: string
  }> {
    const responses = await this.responseRepo.getByProfileId(profileId)

    const data: any = {}

    const engagementResponse = responses.find(
      r => r.question_id === 'engagement_stage'
    )
    if (engagementResponse) {
      data.engagementStage = engagementResponse.response_value
    }

    const timeResponse = responses.find(r => r.question_id === 'time_commitment')
    if (timeResponse) {
      data.timeCommitment = timeResponse.response_value
    }

    const locationResponse = responses.find(r => r.question_id === 'location')
    if (locationResponse) {
      data.location = locationResponse.response_value
    }

    const backgroundResponse = responses.find(r => r.question_id === 'background')
    if (backgroundResponse) {
      data.background = backgroundResponse.response_value
    }

    const currentWorkResponse = responses.find(r => r.question_id === 'current_work')
    if (currentWorkResponse) {
      data.currentWork = currentWorkResponse.response_value
    }

    return data
  }
}
```

---

#### Sub-task 4.1.2: Archetype Detection Service
**Owner**: Backend Developer  
**Estimated Time**: 4 hours  
**Dependencies**: 4.1.1, 3.1.1 complete

**Acceptance Criteria**:
- [ ] Combines algorithmic and AI detection
- [ ] Updates profile with archetype
- [ ] Returns complete archetype result
- [ ] Handles edge cases (ties, low confidence)

**Files Created**:
- `lib/services/archetype-detection-service.ts`

**Implementation**: `lib/services/archetype-detection-service.ts`
```typescript
import { ProfileRepository } from '@/lib/repositories/profile-repository'
import { QuizResponseRepository } from '@/lib/repositories/quiz-response-repository'
import { ScoringEngine } from './scoring-engine'
import { generateContentWithJSON } from '@/lib/gemini/client'
import { buildArchetypeAnalysisPrompt } from '@/lib/gemini/prompts/archetype-analysis'
import type { ArchetypeResult, Archetype, ArchetypeScore } from '@/types/archetype'

export class ArchetypeDetectionService {
  private profileRepo: ProfileRepository
  private responseRepo: QuizResponseRepository
  private scoringEngine: ScoringEngine

  constructor() {
    this.profileRepo = new ProfileRepository()
    this.responseRepo = new QuizResponseRepository()
    this.scoringEngine = new ScoringEngine()
  }

  async detectArchetype(profileId: string): Promise<ArchetypeResult> {
    // Step 1: Calculate algorithmic scores
    const algorithmicScores = await this.scoringEngine.calculateScores(profileId)

    // Step 2: Get all quiz responses for AI validation
    const responses = await this.responseRepo.getByProfileId(profileId)
    const quizResponses = responses.map(r => ({
      questionId: r.question_id,
      value: r.response_value,
      timestamp: r.created_at,
    }))

    // Step 3: AI validation with Gemini
    let aiResult: ArchetypeResult
    try {
      const prompt = buildArchetypeAnalysisPrompt(quizResponses, algorithmicScores)
      aiResult = await generateContentWithJSON<ArchetypeResult>(prompt, {
        model: 'gemini-1.5-pro', // Use Pro for higher accuracy
        temperature: 0.2,
        maxOutputTokens: 1024,
      })
    } catch (error) {
      console.error('AI archetype detection failed, using algorithmic only:', error)
      // Fallback to algorithmic
      aiResult = this.algorithmicFallback(algorithmicScores)
    }

    // Step 4: Get interest mapping and engagement data
    const interests = await this.scoringEngine.getInterestMapping(profileId)
    const engagementData = await this.scoringEngine.getEngagementData(profileId)

    // Step 5: Update profile
    await this.profileRepo.update(profileId, {
      archetype: aiResult.primary,
      archetypeConfidence: aiResult.confidence,
      archetypeScores: aiResult.scores,
      secondaryArchetypes: aiResult.secondary,
      civicInterests: interests,
      ...engagementData,
    })

    return aiResult
  }

  private algorithmicFallback(scores: ArchetypeScore): ArchetypeResult {
    // Find primary archetype (highest score)
    const entries = Object.entries(scores) as [Archetype, number][]
    entries.sort((a, b) => b[1] - a[1])

    const primary = entries[0][0]
    const confidence = entries[0][1]

    // Find secondary archetypes (score > 0.2)
    const secondary = entries
      .slice(1)
      .filter(([, score]) => score > 0.2)
      .map(([archetype]) => archetype)

    return {
      primary,
      confidence,
      scores,
      secondary,
      reasoning: 'Algorithmic detection (AI validation unavailable)',
    }
  }

  async redetectArchetype(profileId: string): Promise<ArchetypeResult> {
    // Force re-detection (useful for testing/refinement)
    return this.detectArchetype(profileId)
  }
}
```

---

### Task 4.2: Testing & Validation

#### Sub-task 4.2.1: Synthetic Test Profiles
**Owner**: Backend Developer  
**Estimated Time**: 3 hours  
**Dependencies**: 4.1.2 complete

**Acceptance Criteria**:
- [ ] 50+ synthetic test profiles created
- [ ] Covers all archetypes
- [ ] Includes hybrid profiles
- [ ] Includes edge cases

**Files Created**:
- `lib/testing/synthetic-profiles.ts`
- `scripts/test-archetype-detection.ts`

**Implementation**: `lib/testing/synthetic-profiles.ts`
```typescript
export const SYNTHETIC_PROFILES = [
  // Clear Allies
  {
    name: 'Ally Profile 1',
    expectedArchetype: 'allies',
    responses: {
      intro_motivation: 'I want to learn about civic innovation and understand how I can get involved',
      resource_contribution_primary: 'time_learning',
      participation_mode: 'learning',
      engagement_stage: 'new_curious',
      civic_sectors: ['governance', 'education'],
      innovation_domains: ['participatory_budgeting', 'deliberative_democracy'],
      time_commitment: 'exploring',
    },
  },
  
  // Clear Innovators
  {
    name: 'Innovator Profile 1',
    expectedArchetype: 'innovators',
    responses: {
      intro_motivation: 'I want to build tools and infrastructure for civic participation',
      resource_contribution_primary: 'skills_building',
      participation_mode: 'building',
      engagement_stage: 'building_something',
      civic_sectors: ['governance', 'technology'],
      innovation_domains: ['civic_tech', 'open_protocols'],
      skills: ['technical_engineering', 'technical_design'],
      time_commitment: 'active',
    },
  },

  // Clear Organizers
  {
    name: 'Organizer Profile 1',
    expectedArchetype: 'organizers',
    responses: {
      intro_motivation: 'I bring people together and coordinate local initiatives',
      resource_contribution_primary: 'time_organizing',
      participation_mode: 'organizing',
      engagement_stage: 'organizing_locally',
      civic_sectors: ['community', 'governance'],
      innovation_domains: ['community_organizing', 'participatory_budgeting'],
      skills: ['facilitation', 'community_building'],
      time_commitment: 'dedicated',
    },
  },

  // Clear Patrons
  {
    name: 'Patron Profile 1',
    expectedArchetype: 'patrons',
    responses: {
      intro_motivation: 'I want to fund civic innovation and support infrastructure development',
      resource_contribution_primary: 'capital_funding',
      participation_mode: 'funding',
      engagement_stage: 'funding_supporting',
      civic_sectors: ['governance', 'economy'],
      innovation_domains: ['network_governance', 'cooperative_economics'],
      skills: ['fundraising', 'grant_writing'],
      time_commitment: 'active',
    },
  },

  // Hybrid: Innovator-Organizer
  {
    name: 'Hybrid Innovator-Organizer',
    expectedArchetype: 'innovators',
    expectedSecondary: ['organizers'],
    responses: {
      intro_motivation: 'I build civic tech tools and organize developer communities',
      resource_contribution_primary: 'hybrid_multiple',
      resource_contribution_multiple: ['skills_technical', 'time_organizing'],
      participation_mode: 'building',
      engagement_stage: 'building_something',
      civic_sectors: ['technology', 'community'],
      innovation_domains: ['civic_tech', 'digital_commons'],
      skills: ['technical_engineering', 'community_building'],
      time_commitment: 'dedicated',
    },
  },

  // Edge case: Uncertain
  {
    name: 'Uncertain Profile',
    expectedArchetype: null, // Could be any
    responses: {
      intro_motivation: 'Not sure yet, just exploring',
      resource_contribution_primary: 'hybrid_multiple',
      resource_contribution_multiple: ['time_learning', 'skills_technical'],
      participation_mode: 'learning',
      engagement_stage: 'new_curious',
      civic_sectors: ['governance'],
      innovation_domains: ['participatory_budgeting'],
      time_commitment: 'exploring',
    },
  },
]
```

**Implementation**: `scripts/test-archetype-detection.ts`
```typescript
import { ArchetypeDetectionService } from '@/lib/services/archetype-detection-service'
import { ProfileRepository } from '@/lib/repositories/profile-repository'
import { QuizResponseRepository } from '@/lib/repositories/quiz-response-repository'
import { SYNTHETIC_PROFILES } from '@/lib/testing/synthetic-profiles'

async function testArchetypeDetection() {
  const archetypeService = new ArchetypeDetectionService()
  const profileRepo = new ProfileRepository()
  const responseRepo = new QuizResponseRepository()

  const results = []

  for (const testProfile of SYNTHETIC_PROFILES) {
    console.log(`\nTesting: ${testProfile.name}`)
    console.log(`Expected: ${testProfile.expectedArchetype}`)

    // Create profile
    const profile = await profileRepo.create({
      name: testProfile.name,
    })

    // Save responses
    for (const [questionId, value] of Object.entries(testProfile.responses)) {
      await responseRepo.save(profile.id, questionId, 'single_select', value)
    }

    // Detect archetype
    const result = await archetypeService.detectArchetype(profile.id)

    console.log(`Detected: ${result.primary} (${Math.round(result.confidence * 100)}%)`)
    console.log(`Scores:`, result.scores)
    console.log(`Secondary:`, result.secondary)

    const isCorrect = result.primary === testProfile.expectedArchetype
    console.log(isCorrect ? '✅ PASS' : '❌ FAIL')

    results.push({
      name: testProfile.name,
      expected: testProfile.expectedArchetype,
      detected: result.primary,
      confidence: result.confidence,
      correct: isCorrect,
    })

    // Cleanup
    await responseRepo.deleteByProfileId(profile.id)
  }

  // Summary
  console.log('\n\n=== SUMMARY ===')
  const accuracy = results.filter(r => r.correct).length / results.length
  console.log(`Accuracy: ${Math.round(accuracy * 100)}%`)
  console.log(`Total Tests: ${results.length}`)
  console.log(`Passed: ${results.filter(r => r.correct).length}`)
  console.log(`Failed: ${results.filter(r => !r.correct).length}`)

  // Show failures
  const failures = results.filter(r => !r.correct)
  if (failures.length > 0) {
    console.log('\n=== FAILURES ===')
    failures.forEach(f => {
      console.log(`${f.name}: Expected ${f.expected}, got ${f.detected}`)
    })
  }
}

testArchetypeDetection().catch(console.error)
```

---

## Phase 5: Notion Integration (Week 4)

**Goal**: Connect to Notion databases and build resource recommendation engine  
**Dependencies**: Phase 0 complete  
**Estimated Duration**: 2-3 days

### Task 5.1: Notion Data Access

#### Sub-task 5.1.1: Civic Sectors Repository
**Owner**: Full-Stack Developer  
**Estimated Time**: 2 hours  
**Dependencies**: 0.3.3 complete

**Acceptance Criteria**:
- [x] Query civic sectors from Notion
- [x] Cache results for performance
- [x] Return structured data

**Files Created**:
- `lib/repositories/civic-sectors-repository.ts`

**Implementation**: `lib/repositories/civic-sectors-repository.ts`
```typescript
import { queryDatabase, getPropertyValue } from '@/lib/notion/client'

export interface CivicSector {
  id: string
  name: string
  description: string
  examples: string[]
  notionUrl: string
}

export class CivicSectorsRepository {
  private cache: CivicSector[] | null = null
  private cacheTimestamp: number | null = null
  private CACHE_TTL = 1000 * 60 * 60 // 1 hour

  async getAll(): Promise<CivicSector[]> {
    // Check cache
    if (
      this.cache &&
      this.cacheTimestamp &&
      Date.now() - this.cacheTimestamp < this.CACHE_TTL
    ) {
      return this.cache
    }

    // Query Notion
    const pages = await queryDatabase(
      process.env.NOTION_CIVIC_SECTORS_DB!
    )

    const sectors = pages.map(page => ({
      id: page.id,
      name: getPropertyValue(page, 'Name') as string,
      description: getPropertyValue(page, 'Description') as string,
      examples: getPropertyValue(page, 'Examples') as string[],
      notionUrl: page.url,
    }))

    // Update cache
    this.cache = sectors
    this.cacheTimestamp = Date.now()

    return sectors
  }

  async getByName(name: string): Promise<CivicSector | null> {
    const sectors = await this.getAll()
    return sectors.find(s => s.name.toLowerCase() === name.toLowerCase()) || null
  }

  async getByIds(ids: string[]): Promise<CivicSector[]> {
    const sectors = await this.getAll()
    return sectors.filter(s => ids.includes(s.id))
  }

  clearCache(): void {
    this.cache = null
    this.cacheTimestamp = null
  }
}
```

---

#### Sub-task 5.1.2: Innovation Domains Repository
**Owner**: Full-Stack Developer  
**Estimated Time**: 2 hours  
**Dependencies**: 0.3.3 complete

**Acceptance Criteria**:
- [x] Query innovation domains from Notion
- [x] Cache results
- [x] Return structured data

**Files Created**:
- `lib/repositories/innovation-domains-repository.ts`

**Implementation**: Similar to `civic-sectors-repository.ts` but for innovation domains

---

#### Sub-task 5.1.3: Resources Repository
**Owner**: Full-Stack Developer  
**Estimated Time**: 3 hours  
**Dependencies**: 0.3.3 complete

**Acceptance Criteria**:
- [x] Query resources from Notion
- [x] Filter by tags/sectors/archetypes
- [x] Support search functionality
- [x] Cache frequently accessed resources

**Files Created**:
- `lib/repositories/resources-repository.ts`

**Implementation**: `lib/repositories/resources-repository.ts`
```typescript
import { queryDatabase, searchPages, getPropertyValue } from '@/lib/notion/client'
import type { Archetype } from '@/types/archetype'

export interface Resource {
  id: string
  title: string
  type: 'pattern' | 'playbook' | 'protocol' | 'article' | 'event' | 'tool'
  description: string
  archetypes: Archetype[]
  civicSectors: string[]
  innovationDomains: string[]
  tags: string[]
  url: string
  notionUrl: string
}

export class ResourcesRepository {
  async search(query: string, limit = 20): Promise<Resource[]> {
    const pages = await searchPages(query)
    return pages.slice(0, limit).map(this.mapToResource)
  }

  async getByArchetype(
    archetype: Archetype,
    limit = 10
  ): Promise<Resource[]> {
    const pages = await queryDatabase(
      process.env.NOTION_RESOURCES_DB!,
      {
        property: 'Archetypes',
        multi_select: {
          contains: archetype,
        },
      },
      [{ property: 'Priority', direction: 'descending' }]
    )

    return pages.slice(0, limit).map(this.mapToResource)
  }

  async getByInterests(
    civicSectors: string[],
    innovationDomains: string[],
    limit = 10
  ): Promise<Resource[]> {
    // Query for resources matching interests
    const sectorFilter = civicSectors.length > 0 ? {
      or: civicSectors.map(sector => ({
        property: 'Civic Sectors',
        multi_select: { contains: sector },
      })),
    } : null

    const domainFilter = innovationDomains.length > 0 ? {
      or: innovationDomains.map(domain => ({
        property: 'Innovation Domains',
        multi_select: { contains: domain },
      })),
    } : null

    const filter = sectorFilter && domainFilter
      ? { or: [sectorFilter, domainFilter] }
      : sectorFilter || domainFilter

    if (!filter) return []

    const pages = await queryDatabase(
      process.env.NOTION_RESOURCES_DB!,
      filter,
      [{ property: 'Priority', direction: 'descending' }]
    )

    return pages.slice(0, limit).map(this.mapToResource)
  }

  async getRecommended(
    archetype: Archetype,
    civicSectors: string[],
    innovationDomains: string[],
    limit = 15
  ): Promise<Resource[]> {
    // Get resources by archetype
    const archetypeResources = await this.getByArchetype(archetype, 10)

    // Get resources by interests
    const interestResources = await this.getByInterests(
      civicSectors,
      innovationDomains,
      10
    )

    // Combine and deduplicate
    const resourceMap = new Map<string, Resource>()
    
    archetypeResources.forEach(r => resourceMap.set(r.id, r))
    interestResources.forEach(r => resourceMap.set(r.id, r))

    const combined = Array.from(resourceMap.values())

    // Sort by relevance (simple: archetype resources first)
    combined.sort((a, b) => {
      const aIsArchetype = a.archetypes.includes(archetype)
      const bIsArchetype = b.archetypes.includes(archetype)
      if (aIsArchetype && !bIsArchetype) return -1
      if (!aIsArchetype && bIsArchetype) return 1
      return 0
    })

    return combined.slice(0, limit)
  }

  private mapToResource(page: any): Resource {
    return {
      id: page.id,
      title: getPropertyValue(page, 'Title') as string,
      type: getPropertyValue(page, 'Type') as Resource['type'],
      description: getPropertyValue(page, 'Description') as string,
      archetypes: getPropertyValue(page, 'Archetypes') as Archetype[],
      civicSectors: getPropertyValue(page, 'Civic Sectors') as string[],
      innovationDomains: getPropertyValue(page, 'Innovation Domains') as string[],
      tags: getPropertyValue(page, 'Tags') as string[],
      url: getPropertyValue(page, 'URL') as string,
      notionUrl: page.url,
    }
  }
}
```

---

### Task 5.2: Resource Recommendation Service

#### Sub-task 5.2.1: Recommendation Engine
**Owner**: Full-Stack Developer  
**Estimated Time**: 3 hours  
**Dependencies**: 5.1.3, Phase 4 complete

**Acceptance Criteria**:
- [x] Recommends resources based on profile
- [x] Prioritizes by relevance
- [x] Handles multiple filtering criteria
- [x] Returns diverse resource types

**Files Created**:
- `lib/services/resource-recommendation-service.ts`

**Implementation**: `lib/services/resource-recommendation-service.ts`
```typescript
import { ProfileRepository } from '@/lib/repositories/profile-repository'
import { ResourcesRepository } from '@/lib/repositories/resources-repository'
import { ResourceInteractionRepository } from '@/lib/repositories/resource-interaction-repository'
import type { Resource } from '@/lib/repositories/resources-repository'

export class ResourceRecommendationService {
  private profileRepo: ProfileRepository
  private resourcesRepo: ResourcesRepository
  private interactionRepo: ResourceInteractionRepository

  constructor() {
    this.profileRepo = new ProfileRepository()
    this.resourcesRepo = new ResourcesRepository()
    this.interactionRepo = new ResourceInteractionRepository()
  }

  async getRecommendations(
    profileId: string,
    limit = 15
  ): Promise<Resource[]> {
    // Get profile
    const profile = await this.profileRepo.findById(profileId)
    if (!profile) {
      throw new Error('Profile not found')
    }

    // Get recommended resources
    const resources = await this.resourcesRepo.getRecommended(
      profile.archetype,
      profile.civicInterests.civicSectors,
      profile.civicInterests.innovationDomains,
      limit * 2 // Get more for filtering
    )

    // Filter out already viewed resources (optional)
    const interactions = await this.interactionRepo.getByProfileId(profileId)
    const viewedIds = new Set(
      interactions
        .filter(i => i.interactionType === 'view')
        .map(i => i.resourceId)
    )

    const filtered = resources.filter(r => !viewedIds.has(r.id))

    // Ensure diversity of resource types
    const diverse = this.ensureDiversity(filtered, limit)

    return diverse
  }

  async getByEngagementStage(
    profileId: string
  ): Promise<Resource[]> {
    const profile = await this.profileRepo.findById(profileId)
    if (!profile) {
      throw new Error('Profile not found')
    }

    // Different resources based on engagement stage
    const stageMapping: Record<string, string[]> = {
      new_curious: ['getting_started', 'intro', 'overview'],
      learning_active: ['deep_dive', 'framework', 'theory'],
      building_something: ['tool', 'protocol', 'playbook'],
      organizing_locally: ['playbook', 'case_study', 'facilitation'],
      funding_supporting: ['impact', 'metrics', 'case_study'],
    }

    const tags = stageMapping[profile.engagementStage || 'new_curious'] || []

    // Search for resources with these tags
    // (Simplified - would need more sophisticated filtering in production)
    return this.getRecommendations(profileId, 10)
  }

  private ensureDiversity(
    resources: Resource[],
    limit: number
  ): Resource[]{
    const result: Resource[] = []
    const typeCount: Record<string, number> = {}

    for (const resource of resources) {
      if (result.length >= limit) break

      const count = typeCount[resource.type] || 0
      
      // Limit each type to max 40% of total
      if (count < limit * 0.4) {
        result.push(resource)
        typeCount[resource.type] = count + 1
      }
    }

    // If we didn't get enough, fill with remaining
    if (result.length < limit) {
      const remaining = resources.filter(r => !result.includes(r))
      result.push(...remaining.slice(0, limit - result.length))
    }

    return result
  }

  async trackInteraction(
    profileId: string,
    resourceId: string,
    type: 'view' | 'click' | 'download' | 'share' | 'bookmark',
    resourceTitle?: string
  ): Promise<void> {
    await this.interactionRepo.track({
      profileId,
      resourceType: 'notion_page',
      resourceId,
      resourceTitle,
      interactionType: type,
    })
  }
}
```

---

*Continue with Phases 6-12 in OpenCivics_Implementation_Plan_Part3.md*

**End of Part 2**

# OpenCivics Onboarding Assistant
## Detailed Implementation Plan v1.0 - Part 3

**Continuation from Part 2**

---

## Phase 6: Profile Generation (Week 4)

**Goal**: Generate profile images and complete onboarding summaries  
**Dependencies**: Phases 3, 4 complete  
**Estimated Duration**: 3-4 days

### Task 6.1: Profile Image Generation

#### Sub-task 6.1.1: Image Generation Service
**Owner**: Full-Stack Developer  
**Estimated Time**: 4 hours  
**Dependencies**: Phase 4 complete

**Acceptance Criteria**:
- [ ] Generates unique profile images
- [ ] Incorporates archetype visual identity
- [ ] Saves to Supabase Storage
- [ ] Returns public URL

**Files Created**:
- `lib/services/profile-image-service.ts`
- `lib/image/generator.ts`

**Implementation**: `lib/services/profile-image-service.ts`
```typescript
import { ProfileRepository } from '@/lib/repositories/profile-repository'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/profile'

export class ProfileImageService {
  private profileRepo: ProfileRepository
  private supabase

  constructor() {
    this.profileRepo = new ProfileRepository()
    this.supabase = createClient()
  }

  async generateImage(profileId: string): Promise<string> {
    const profile = await this.profileRepo.findById(profileId)
    if (!profile) {
      throw new Error('Profile not found')
    }

    // Check if image already exists
    if (profile.profileImageUrl) {
      return profile.profileImageUrl
    }

    // Generate image based on archetype
    const imageBuffer = await this.createArchetypeImage(profile)

    // Upload to Supabase Storage
    const fileName = `${profileId}.png`
    const { data, error } = await this.supabase.storage
      .from('profile-images')
      .upload(fileName, imageBuffer, {
        contentType: 'image/png',
        upsert: true,
      })

    if (error) {
      console.error('Image upload error:', error)
      throw new Error('Failed to upload profile image')
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = this.supabase.storage.from('profile-images').getPublicUrl(fileName)

    // Update profile
    await this.profileRepo.update(profileId, {
      profileImageUrl: publicUrl,
    })

    return publicUrl
  }

  private async createArchetypeImage(profile: Profile): Promise<Buffer> {
    // Use Canvas or similar to create image
    // This is a placeholder - actual implementation would use node-canvas or similar
    
    const { createCanvas } = await import('canvas')
    const canvas = createCanvas(1200, 630)
    const ctx = canvas.getContext('2d')

    // Archetype color schemes
    const colors = {
      allies: { bg: '#E3F2FD', primary: '#1976D2', accent: '#64B5F6' },
      innovators: { bg: '#F3E5F5', primary: '#7B1FA2', accent: '#BA68C8' },
      organizers: { bg: '#E8F5E9', primary: '#388E3C', accent: '#81C784' },
      patrons: { bg: '#FFF3E0', primary: '#F57C00', accent: '#FFB74D' },
    }

    const scheme = colors[profile.archetype]

    // Background
    ctx.fillStyle = scheme.bg
    ctx.fillRect(0, 0, 1200, 630)

    // Terminal aesthetic overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'
    for (let i = 0; i < 630; i += 2) {
      ctx.fillRect(0, i, 1200, 1)
    }

    // Archetype badge
    ctx.fillStyle = scheme.primary
    ctx.beginPath()
    ctx.arc(150, 315, 80, 0, Math.PI * 2)
    ctx.fill()

    // Profile name
    ctx.fillStyle = scheme.primary
    ctx.font = 'bold 48px monospace'
    ctx.fillText(profile.name || 'OpenCivics Participant', 260, 280)

    // Archetype name
    ctx.font = 'bold 72px monospace'
    ctx.fillStyle = scheme.accent
    ctx.fillText(profile.archetype.toUpperCase(), 260, 360)

    // Civic interests tags
    ctx.font = '24px monospace'
    ctx.fillStyle = scheme.primary
    const interests = profile.civicInterests.civicSectors.slice(0, 3)
    const tags = interests.map(i => `#${i}`).join('  ')
    ctx.fillText(tags, 260, 420)

    // OpenCivics branding
    ctx.font = '20px monospace'
    ctx.fillStyle = '#666'
    ctx.fillText('OPENCIVICS.CO', 260, 560)

    return canvas.toBuffer('image/png')
  }
}
```

---

### Task 6.2: Complete Profile Generation

#### Sub-task 6.2.1: Profile Completion Service
**Owner**: Backend Developer  
**Estimated Time**: 3 hours  
**Dependencies**: 6.1.1, Task 3.2 complete

**Acceptance Criteria**:
- [ ] Orchestrates all profile generation steps
- [ ] Generates summary
- [ ] Generates image
- [ ] Updates profile atomically
- [ ] Handles errors gracefully

**Files Created**:
- `lib/services/profile-completion-service.ts`

**Implementation**: `lib/services/profile-completion-service.ts`
```typescript
import { ArchetypeDetectionService } from './archetype-detection-service'
import { SummaryGeneratorService } from './summary-generator-service'
import { ProfileImageService } from './profile-image-service'
import { ProfileRepository } from '@/lib/repositories/profile-repository'

export class ProfileCompletionService {
  private archetypeService: ArchetypeDetectionService
  private summaryService: SummaryGeneratorService
  private imageService: ProfileImageService
  private profileRepo: ProfileRepository

  constructor() {
    this.archetypeService = new ArchetypeDetectionService()
    this.summaryService = new SummaryGeneratorService()
    this.imageService = new ProfileImageService()
    this.profileRepo = new ProfileRepository()
  }

  async completeProfile(profileId: string): Promise<{
    archetype: any
    summary: string
    imageUrl: string
  }> {
    try {
      // Step 1: Detect archetype
      console.log('Detecting archetype...')
      const archetypeResult = await this.archetypeService.detectArchetype(
        profileId
      )

      // Step 2: Generate summary
      console.log('Generating summary...')
      const summary = await this.summaryService.generateSummary(profileId)

      // Step 3: Generate profile image
      console.log('Generating profile image...')
      const imageUrl = await this.imageService.generateImage(profileId)

      // Update last active
      await this.profileRepo.updateLastActive(profileId)

      return {
        archetype: archetypeResult,
        summary,
        imageUrl,
      }
    } catch (error) {
      console.error('Profile completion error:', error)
      throw new Error('Failed to complete profile')
    }
  }

  async regenerateProfile(profileId: string): Promise<void> {
    // Force regeneration of all profile elements
    await this.archetypeService.redetectArchetype(profileId)
    await this.summaryService.regenerateSummary(profileId)
    await this.imageService.generateImage(profileId)
  }
}
```

---

## Phase 7: Results & Recommendations (Week 4)

**Goal**: Build results page with recommendations  
**Dependencies**: Phases 4, 5, 6 complete  
**Estimated Duration**: 3-4 days

### Task 7.1: Results API

#### Sub-task 7.1.1: Get Profile Results Endpoint
**Owner**: Backend Developer  
**Estimated Time**: 2 hours  
**Dependencies**: Phase 6 complete

**Acceptance Criteria**:
- [ ] GET /api/profile/[id] endpoint created
- [ ] Returns complete profile with archetype
- [ ] Includes recommendations
- [ ] Handles not found errors

**Files Created**:
- `app/api/profile/[id]/route.ts`

**Implementation**: `app/api/profile/[id]/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { ProfileRepository } from '@/lib/repositories/profile-repository'
import { ResourceRecommendationService } from '@/lib/services/resource-recommendation-service'
import { handleAPIError } from '@/lib/utils/error-handler'
import { NotFoundError } from '@/lib/errors/api-error'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const profileRepo = new ProfileRepository()
    const profile = await profileRepo.findById(params.id)

    if (!profile) {
      throw new NotFoundError('Profile not found')
    }

    // Get recommendations
    const recommendationService = new ResourceRecommendationService()
    const recommendations = await recommendationService.getRecommendations(
      params.id,
      15
    )

    return NextResponse.json({
      profile,
      recommendations,
    })
  } catch (error) {
    return handleAPIError(error)
  }
}
```

---

### Task 7.2: Resource Search API

#### Sub-task 7.2.1: Resource Search Endpoint
**Owner**: Backend Developer  
**Estimated Time**: 2 hours  
**Dependencies**: Phase 5 complete

**Acceptance Criteria**:
- [ ] POST /api/resources/search endpoint created
- [ ] Supports keyword search
- [ ] Supports filtering by archetype/sector
- [ ] Returns paginated results

**Files Created**:
- `app/api/resources/search/route.ts`

**Implementation**: `app/api/resources/search/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { ResourcesRepository } from '@/lib/repositories/resources-repository'
import { handleAPIError } from '@/lib/utils/error-handler'
import { z } from 'zod'

const searchSchema = z.object({
  query: z.string().optional(),
  archetype: z.enum(['allies', 'innovators', 'organizers', 'patrons']).optional(),
  civicSectors: z.array(z.string()).optional(),
  innovationDomains: z.array(z.string()).optional(),
  limit: z.number().min(1).max(50).default(20),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = searchSchema.parse(body)

    const resourcesRepo = new ResourcesRepository()
    let resources

    if (validated.query) {
      resources = await resourcesRepo.search(validated.query, validated.limit)
    } else if (validated.archetype) {
      resources = await resourcesRepo.getByArchetype(
        validated.archetype,
        validated.limit
      )
    } else if (validated.civicSectors || validated.innovationDomains) {
      resources = await resourcesRepo.getByInterests(
        validated.civicSectors || [],
        validated.innovationDomains || [],
        validated.limit
      )
    } else {
      // Default: return recent/featured
      resources = []
    }

    return NextResponse.json({ resources })
  } catch (error) {
    return handleAPIError(error)
  }
}
```

---

## Phase 8: Chat Interface (Weeks 5-6)

**Goal**: Build AI chat interface with Notion knowledge integration  
**Dependencies**: Phase 3 complete  
**Estimated Duration**: 5-7 days

### Task 8.1: Chat Service

#### Sub-task 8.1.1: Chat Session Manager
**Owner**: Full-Stack Developer  
**Estimated Time**: 3 hours  
**Dependencies**: Phase 1 complete

**Acceptance Criteria**:
- [ ] Creates and manages chat sessions
- [ ] Stores messages in database
- [ ] Retrieves conversation history
- [ ] Handles context management

**Files Created**:
- `lib/services/chat-service.ts`

**Implementation**: `lib/services/chat-service.ts`
```typescript
import { createClient } from '@/lib/supabase/server'
import { ProfileRepository } from '@/lib/repositories/profile-repository'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export class ChatService {
  private supabase
  private profileRepo: ProfileRepository

  constructor() {
    this.supabase = createClient()
    this.profileRepo = new ProfileRepository()
  }

  async createSession(
    profileId?: string,
    sessionType: 'onboarding' | 'general' | 'resource_inquiry' = 'general'
  ): Promise<string> {
    // Get profile context if available
    let context = {}
    if (profileId) {
      const profile = await this.profileRepo.findById(profileId)
      if (profile) {
        context = {
          archetype: profile.archetype,
          civicSectors: profile.civicInterests.civicSectors,
          innovationDomains: profile.civicInterests.innovationDomains,
        }
      }
    }

    const { data, error } = await this.supabase
      .from('chat_sessions')
      .insert({
        profile_id: profileId,
        session_type: sessionType,
        context,
      })
      .select()
      .single()

    if (error) {
      console.error('Chat session creation error:', error)
      throw new Error('Failed to create chat session')
    }

    return data.id
  }

  async addMessage(
    sessionId: string,
    role: ChatMessage['role'],
    content: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const { error } = await this.supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role,
        content,
        metadata,
      })

    if (error) {
      console.error('Chat message save error:', error)
      throw new Error('Failed to save message')
    }

    // Update session timestamp
    await this.supabase
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId)
  }

  async getMessages(
    sessionId: string,
    limit = 50
  ): Promise<ChatMessage[]> {
    const { data, error } = await this.supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('Chat messages fetch error:', error)
      throw new Error('Failed to fetch messages')
    }

    return data.map(msg => ({
      role: msg.role,
      content: msg.content,
    }))
  }

  async getRecentSessions(
    profileId: string,
    limit = 10
  ): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('chat_sessions')
      .select('*')
      .eq('profile_id', profileId)
      .order('updated_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Chat sessions fetch error:', error)
      throw new Error('Failed to fetch chat sessions')
    }

    return data
  }
}
```

---

#### Sub-task 8.1.2: Chat AI Handler
**Owner**: Full-Stack Developer  
**Estimated Time**: 4 hours  
**Dependencies**: 8.1.1, Phase 3, Phase 5 complete

**Acceptance Criteria**:
- [ ] Generates contextual responses
- [ ] Retrieves relevant Notion resources
- [ ] Maintains conversation context
- [ ] Handles knowledge queries

**Files Created**:
- `lib/services/chat-ai-handler.ts`

**Implementation**: `lib/services/chat-ai-handler.ts`
```typescript
import { generateContent } from '@/lib/gemini/client'
import { ResourcesRepository } from '@/lib/repositories/resources-repository'
import type { ChatMessage } from './chat-service'

export class ChatAIHandler {
  private resourcesRepo: ResourcesRepository

  constructor() {
    this.resourcesRepo = new ResourcesRepository()
  }

  async generateResponse(
    messages: ChatMessage[],
    context?: Record<string, any>
  ): Promise<string> {
    // Build conversation history
    const conversationHistory = messages
      .map(msg => {
        const role = msg.role === 'user' ? 'User' : 'Assistant'
        return `${role}: ${msg.content}`
      })
      .join('\n\n')

    // Build system prompt
    const systemPrompt = this.buildSystemPrompt(context)

    // Check if user is asking about resources
    const lastUserMessage = messages
      .filter(m => m.role === 'user')
      .pop()?.content || ''
    
    let resourceContext = ''
    if (this.isResourceQuery(lastUserMessage)) {
      const resources = await this.searchResources(lastUserMessage, context)
      if (resources.length > 0) {
        resourceContext = '\n\nRELEVANT RESOURCES FROM OPENCIVICS COMMONS:\n' +
          resources.map(r => `- ${r.title}: ${r.description}\n  URL: ${r.url}`)
            .join('\n')
      }
    }

    // Generate response
    const prompt = `${systemPrompt}\n\nCONVERSATION HISTORY:\n${conversationHistory}${resourceContext}\n\nAssistant:`

    const response = await generateContent(prompt, {
      model: 'gemini-1.5-flash',
      temperature: 0.7,
      maxOutputTokens: 1024,
    })

    return response
  }

  private buildSystemPrompt(context?: Record<string, any>): string {
    let prompt = `You are a helpful AI assistant for OpenCivics, a platform for civic innovation and participatory governance.

Your role is to:
- Help users understand civic innovation concepts
- Guide them to relevant resources and opportunities
- Answer questions about OpenCivics and the civic ecosystem
- Be warm, encouraging, and specific in your responses

Keep responses concise and actionable.`

    if (context?.archetype) {
      prompt += `\n\nCONTEXT: The user is classified as a "${context.archetype}" archetype.`
    }

    if (context?.civicSectors?.length > 0) {
      prompt += `\nTheir civic interests include: ${context.civicSectors.join(', ')}.`
    }

    return prompt
  }

  private isResourceQuery(message: string): boolean {
    const resourceKeywords = [
      'resource', 'learn', 'read', 'guide', 'pattern', 'playbook',
      'protocol', 'example', 'case study', 'tool', 'recommend',
    ]

    const lowerMessage = message.toLowerCase()
    return resourceKeywords.some(keyword => lowerMessage.includes(keyword))
  }

  private async searchResources(
    query: string,
    context?: Record<string, any>
  ): Promise<any[]> {
    // Try keyword search first
    let resources = await this.resourcesRepo.search(query, 5)

    // If no results and context available, search by interests
    if (resources.length === 0 && context?.archetype) {
      resources = await this.resourcesRepo.getByArchetype(
        context.archetype,
        5
      )
    }

    return resources
  }
}
```

---

### Task 8.2: Chat API

#### Sub-task 8.2.1: Chat Endpoint
**Owner**: Backend Developer  
**Estimated Time**: 3 hours  
**Dependencies**: 8.1.2 complete

**Acceptance Criteria**:
- [ ] POST /api/chat endpoint created
- [ ] Handles new and existing sessions
- [ ] Returns AI response
- [ ] Supports streaming (optional)

**Files Created**:
- `app/api/chat/route.ts`

**Implementation**: `app/api/chat/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { ChatService } from '@/lib/services/chat-service'
import { ChatAIHandler } from '@/lib/services/chat-ai-handler'
import { handleAPIError } from '@/lib/utils/error-handler'
import { z } from 'zod'

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  sessionId: z.string().uuid().optional(),
  profileId: z.string().uuid().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = chatSchema.parse(body)

    const chatService = new ChatService()
    const chatAI = new ChatAIHandler()

    // Create or get session
    let sessionId = validated.sessionId
    if (!sessionId) {
      sessionId = await chatService.createSession(validated.profileId)
    }

    // Add user message
    await chatService.addMessage(sessionId, 'user', validated.message)

    // Get conversation history
    const messages = await chatService.getMessages(sessionId)

    // Get session context (if profile available)
    let context
    if (validated.profileId) {
      // Would fetch profile context here
      context = {}
    }

    // Generate AI response
    const aiResponse = await chatAI.generateResponse(messages, context)

    // Save AI response
    await chatService.addMessage(sessionId, 'assistant', aiResponse)

    return NextResponse.json({
      sessionId,
      response: aiResponse,
    })
  } catch (error) {
    return handleAPIError(error)
  }
}
```

---

## Phase 9: UI/UX Implementation (Weeks 5-6)

**Goal**: Build all frontend components and pages  
**Dependencies**: Phases 2, 7 complete  
**Estimated Duration**: 4-5 days

### Task 9.1: Terminal UI Components

#### Sub-task 9.1.1: Terminal Layout Component
**Owner**: Frontend Developer  
**Estimated Time**: 3 hours  
**Dependencies**: Phase 0 complete

**Acceptance Criteria**:
- [ ] Terminal aesthetic layout created
- [ ] Scanline effect implemented
- [ ] Monospace font integrated
- [ ] Responsive design

**Files Created**:
- `components/terminal/TerminalLayout.tsx`
- `components/terminal/ScanlineOverlay.tsx`
- `styles/terminal.css`

**Implementation**: `components/terminal/TerminalLayout.tsx`
```typescript
'use client'

import { ReactNode } from 'react'
import ScanlineOverlay from './ScanlineOverlay'

interface TerminalLayoutProps {
  children: ReactNode
  showScanlines?: boolean
}

export default function TerminalLayout({
  children,
  showScanlines = true,
}: TerminalLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {showScanlines && <ScanlineOverlay />}
      
      {/* CRT effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-green-400/5 to-transparent animate-scan" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 border-b border-green-400/30 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                <span className="text-green-300">OPEN</span>
                <span className="text-green-500">CIVICS</span>
              </h1>
              <p className="text-green-400/60 text-sm">
                $ CIVIC INNOVATION NETWORK_v1.0
              </p>
            </div>
            <div className="text-right text-sm text-green-400/60">
              <div>SYSTEM ACTIVE</div>
              <div>{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-green-400/30 text-center text-green-400/60 text-sm">
          <p>© 2025 OpenCivics · Building the civic stack</p>
        </footer>
      </div>
    </div>
  )
}
```

**Implementation**: `components/terminal/ScanlineOverlay.tsx`
```typescript
export default function ScanlineOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Scanlines */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)',
        }}
      />
      
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.7))',
        }}
      />
    </div>
  )
}
```

---

### Task 9.2: Quiz Components

#### Sub-task 9.2.1: Question Renderer Components
**Owner**: Frontend Developer  
**Estimated Time**: 5 hours  
**Dependencies**: Phase 2 complete

**Acceptance Criteria**:
- [ ] Single select component
- [ ] Multi select component
- [ ] Text input component
- [ ] Conversation input component
- [ ] Progress indicator

**Files Created**:
- `components/quiz/QuestionRenderer.tsx`
- `components/quiz/SingleSelect.tsx`
- `components/quiz/MultiSelect.tsx`
- `components/quiz/TextInput.tsx`
- `components/quiz/ConversationInput.tsx`
- `components/quiz/ProgressBar.tsx`

**Implementation**: `components/quiz/QuestionRenderer.tsx`
```typescript
'use client'

import { Question, QuestionOption } from '@/types/quiz'
import SingleSelect from './SingleSelect'
import MultiSelect from './MultiSelect'
import TextInput from './TextInput'
import ConversationInput from './ConversationInput'

interface QuestionRendererProps {
  question: Question
  value?: string | string[]
  onChange: (value: string | string[]) => void
  onSubmit: () => void
}

export default function QuestionRenderer({
  question,
  value,
  onChange,
  onSubmit,
}: QuestionRendererProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && question.type !== 'conversation') {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Question text */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-green-300">
          {question.text}
        </h2>
        {!question.required && (
          <p className="text-green-400/60 text-sm">Optional</p>
        )}
      </div>

      {/* Input based on question type */}
      <div onKeyPress={handleKeyPress}>
        {question.type === 'single_select' && question.options && (
          <SingleSelect
            options={question.options}
            value={value as string}
            onChange={onChange as (value: string) => void}
          />
        )}

        {question.type === 'multi_select' && question.options && (
          <MultiSelect
            options={question.options}
            value={(value as string[]) || []}
            onChange={onChange as (value: string[]) => void}
            minSelections={question.validation?.minSelections}
            maxSelections={question.validation?.maxSelections}
          />
        )}

        {question.type === 'text_input' && (
          <TextInput
            value={(value as string) || ''}
            onChange={onChange as (value: string) => void}
            placeholder="Type your answer..."
            maxLength={question.validation?.maxLength}
          />
        )}

        {question.type === 'conversation' && (
          <ConversationInput
            value={(value as string) || ''}
            onChange={onChange as (value: string) => void}
            placeholder="Share your thoughts..."
            minLength={question.validation?.minLength}
            maxLength={question.validation?.maxLength}
          />
        )}
      </div>

      {/* Submit button */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={onSubmit}
          disabled={!value || (Array.isArray(value) && value.length === 0)}
          className="px-6 py-3 bg-green-400/20 hover:bg-green-400/30 border border-green-400 text-green-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {question.required ? 'CONTINUE →' : 'SKIP →'}
        </button>
      </div>
    </div>
  )
}
```

---

### Task 9.3: Results Page

#### Sub-task 9.3.1: Results Page Component
**Owner**: Frontend Developer  
**Estimated Time**: 4 hours  
**Dependencies**: Phase 7 complete

**Acceptance Criteria**:
- [ ] Displays archetype result
- [ ] Shows confidence and scores
- [ ] Displays profile image
- [ ] Shows onboarding summary
- [ ] Lists recommended resources
- [ ] Social sharing buttons

**Files Created**:
- `app/results/[profileId]/page.tsx`
- `components/profile/ProfileCard.tsx`
- `components/profile/ArchetypeBadge.tsx`
- `components/profile/ResourceCard.tsx`

**Implementation**: `app/results/[profileId]/page.tsx`
```typescript
import { notFound } from 'next/navigation'
import TerminalLayout from '@/components/terminal/TerminalLayout'
import ProfileCard from '@/components/profile/ProfileCard'
import ResourceCard from '@/components/profile/ResourceCard'

async function getProfileResults(profileId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/profile/${profileId}`,
    { cache: 'no-store' }
  )

  if (!res.ok) return null

  return res.json()
}

export default async function ResultsPage({
  params,
}: {
  params: { profileId: string }
}) {
  const data = await getProfileResults(params.profileId)

  if (!data) {
    notFound()
  }

  const { profile, recommendations } = data

  return (
    <TerminalLayout>
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-green-300">YOUR CIVIC IDENTITY</span>
          </h1>
          <p className="text-green-400/80">
            Here's what we discovered about your participation style
          </p>
        </div>

        {/* Profile Card */}
        <ProfileCard profile={profile} />

        {/* Onboarding Summary */}
        {profile.onboardingSummary && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-green-300">
              YOUR ONBOARDING GUIDE
            </h2>
            <div className="bg-green-400/5 border border-green-400/30 p-8 rounded">
              <div className="prose prose-invert prose-green max-w-none">
                {profile.onboardingSummary.split('\n\n').map((para: string, i: number) => (
                  <p key={i} className="text-green-100 mb-4">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recommended Resources */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-green-300">
            RECOMMENDED FOR YOU
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {recommendations.map((resource: any) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6 text-green-300">
            WHAT'S NEXT?
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="/chat"
              className="block p-6 bg-green-400/10 hover:bg-green-400/20 border border-green-400/30 transition-colors"
            >
              <div className="text-3xl mb-2">💬</div>
              <div className="font-bold mb-1">CHAT WITH US</div>
              <div className="text-sm text-green-400/70">
                Ask questions and explore
              </div>
            </a>
            
            <a
              href={`https://opencivics.co/consortium?ref=${params.profileId}`}
              className="block p-6 bg-green-400/10 hover:bg-green-400/20 border border-green-400/30 transition-colors"
            >
              <div className="text-3xl mb-2">🌐</div>
              <div className="font-bold mb-1">JOIN CONSORTIUM</div>
              <div className="text-sm text-green-400/70">
                Become an active member
              </div>
            </a>
            
            <button
              onClick={() => {
                navigator.share?.({
                  title: `My OpenCivics Identity: ${profile.archetype}`,
                  text: `I just discovered my civic participation archetype!`,
                  url: window.location.href,
                })
              }}
              className="block p-6 bg-green-400/10 hover:bg-green-400/20 border border-green-400/30 transition-colors"
            >
              <div className="text-3xl mb-2">📤</div>
              <div className="font-bold mb-1">SHARE</div>
              <div className="text-sm text-green-400/70">
                Spread the word
              </div>
            </button>
          </div>
        </div>
      </div>
    </TerminalLayout>
  )
}
```

---

## Phase 10: Testing & QA (Week 6)

**Goal**: Comprehensive testing and quality assurance  
**Dependencies**: All dev phases complete  
**Estimated Duration**: 4-5 days

### Task 10.1: Unit Testing

#### Sub-task 10.1.1: Service Layer Tests
**Owner**: Backend Developer  
**Estimated Time**: 8 hours  
**Dependencies**: Phases 2-8 complete

**Acceptance Criteria**:
- [ ] 80%+ code coverage for services
- [ ] All critical paths tested
- [ ] Edge cases covered
- [ ] Mock external dependencies

**Files Created**:
- `lib/services/__tests__/*.test.ts`

---

### Task 10.2: Integration Testing

#### Sub-task 10.2.1: End-to-End Quiz Flow Test
**Owner**: Full-Stack Developer  
**Estimated Time**: 4 hours  
**Dependencies**: Phase 10.1 complete

**Acceptance Criteria**:
- [ ] Full quiz completion tested
- [ ] Archetype detection validated
- [ ] Profile generation tested
- [ ] Results page rendered correctly

---

### Task 10.3: User Acceptance Testing

#### Sub-task 10.3.1: Beta User Testing
**Owner**: Product/QA  
**Estimated Time**: 3 days  
**Dependencies**: Phase 10.2 complete

**Acceptance Criteria**:
- [ ] 20+ beta users complete quiz
- [ ] Feedback collected
- [ ] Bugs documented
- [ ] Critical issues fixed

---

## Phase 11: Deployment & Launch (Week 6)

**Goal**: Deploy to production and launch  
**Dependencies**: Phase 10 complete  
**Estimated Duration**: 2-3 days

### Task 11.1: Production Deployment

#### Sub-task 11.1.1: Vercel Deployment
**Owner**: DevOps/Full-Stack  
**Estimated Time**: 3 hours  
**Dependencies**: Phase 10 complete

**Acceptance Criteria**:
- [ ] Production environment configured
- [ ] Environment variables set
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Deployment successful

---

### Task 11.2: Monitoring Setup

#### Sub-task 11.2.1: Error Tracking & Analytics
**Owner**: DevOps  
**Estimated Time**: 3 hours  
**Dependencies**: 11.1.1 complete

**Acceptance Criteria**:
- [ ] Error tracking configured (Sentry)
- [ ] Analytics configured (Plausible/Posthog)
- [ ] Uptime monitoring active
- [ ] Alert notifications setup

---

## Phase 12: Post-MVP Features (Weeks 7+)

**Goal**: Extended features and enhancements  
**Dependencies**: MVP launched  
**Estimated Duration**: Ongoing

### Task 12.1: Analytics Dashboard

#### Sub-task 12.1.1: Admin Dashboard
**Owner**: Full-Stack Developer  
**Estimated Time**: 2 days  
**Dependencies**: MVP launched

**Features**:
- Archetype distribution charts
- Completion funnel visualization
- Resource engagement metrics
- Geographic distribution map

---

### Task 12.2: Telegram Bot

#### Sub-task 12.2.1: Bot Setup & Quiz Port
**Owner**: Backend Developer  
**Estimated Time**: 1 week  
**Dependencies**: MVP launched

**Features**:
- Telegram bot API integration
- Inline keyboard quiz flow
- Profile sharing via Telegram
- Resource recommendations in DMs

---

### Task 12.3: Email Follow-up Sequences

#### Sub-task 12.3.1: Email Automation
**Owner**: Full-Stack Developer  
**Estimated Time**: 3 days  
**Dependencies**: MVP launched

**Features**:
- Welcome email after quiz
- Weekly resource recommendations
- Event notifications
- Engagement re-activation

---

## Implementation Timeline Gantt Chart

```
Week 1: Foundation & Database
├─ Phase 0: Foundation ████████
└─ Phase 1: Database   ████████

Week 2-3: Core Quiz & AI
├─ Phase 2: Quiz Engine     ████████████
├─ Phase 3: AI Integration  ████████
└─ Phase 4: Archetype Det   ████████

Week 4: Integration & Results
├─ Phase 5: Notion      ████████
├─ Phase 6: Profile Gen ████████
└─ Phase 7: Results     ████████

Week 5-6: Chat & UI
├─ Phase 8: Chat        ████████████
├─ Phase 9: UI/UX       ████████████
├─ Phase 10: Testing    ████████
└─ Phase 11: Deploy     ████

Week 7+: Post-MVP
└─ Phase 12: Extended   ████████████████
```

---

## Daily Standup Template

```markdown
### Daily Standup - [Date]

**Yesterday:**
- Completed: [tasks]
- Blockers: [any issues]

**Today:**
- Working on: [current tasks]
- Expected completion: [sub-tasks]

**Blockers:**
- [any blockers or dependencies]

**Questions:**
- [questions for team]
```

---

## Sprint Planning Template

```markdown
### Sprint [N] - [Dates]

**Goal:** [Sprint objective]

**Committed Tasks:**
- [ ] Task ID - Description (Est: Xh) [@owner]
- [ ] Task ID - Description (Est: Xh) [@owner]

**Total Capacity:** [hours]
**Total Committed:** [hours]

**Definition of Done:**
- Code reviewed and merged
- Tests passing
- Deployed to staging
- Documentation updated
```

---

## Risk Register

| Risk | Probability | Impact | Mitigation | Owner |
|------|------------|--------|------------|-------|
| Gemini API rate limits | Medium | High | Caching + fallback logic | Backend Dev |
| Low quiz completion | Medium | High | User testing + iterations | Product |
| Slow Notion queries | Medium | Medium | Caching + background sync | Full-Stack |
| Inaccurate archetype | Low | High | Testing + AI tuning | Backend Dev |

---

## Success Metrics Dashboard

**Launch Metrics (Week 1):**
- [ ] 100+ quiz completions
- [ ] >70% completion rate
- [ ] <5% error rate
- [ ] <2s average page load

**Month 1 Metrics:**
- [ ] 500+ profiles created
- [ ] >85% archetype confidence avg
- [ ] >40% take action (newsletter/event)
- [ ] >20% share profile

---

**END OF IMPLEMENTATION PLAN**

---

## Appendix A: Technology Stack Reference

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript 5
- Tailwind CSS 3
- SWR (data fetching)

### Backend
- Next.js API Routes
- Supabase (PostgreSQL)
- Zod (validation)

### AI & Integration
- Google Gemini API
- Notion API
- Supabase Storage

### Infrastructure
- Vercel (hosting)
- Supabase (managed DB)
- GitHub (version control)

### Monitoring
- Sentry (errors)
- Plausible (analytics)
- Vercel Analytics

---

## Appendix B: Useful Commands

```bash
# Development
npm run dev

# Build
npm run build

# Test
npm test
npm run test:watch

# Database migrations
npx supabase migration new [name]
npx supabase db push

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

---

## Appendix C: Environment Variables Checklist

```bash
# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Supabase (server)
SUPABASE_SERVICE_ROLE_KEY=

# AI
GEMINI_API_KEY=

# Notion
NOTION_API_KEY=
NOTION_CIVIC_SECTORS_DB=
NOTION_INNOVATION_DOMAINS_DB=
NOTION_RESOURCES_DB=

# Optional
SENTRY_DSN=
PLAUSIBLE_DOMAIN=
```

---

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Maintained By:** OpenCivics Engineering Team