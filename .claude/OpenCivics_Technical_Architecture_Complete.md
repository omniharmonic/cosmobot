# OpenCivics Intelligent Onboarding Assistant
## Technical Architecture Document v1.0

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | November 2025 | OpenCivics Engineering | Initial architecture |

**Status**: Draft for Review  
**Classification**: Internal  
**Distribution**: Engineering Team, Technical Leadership

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architectural Overview](#2-architectural-overview)
3. [System Context](#3-system-context)
4. [Architectural Principles](#4-architectural-principles)
5. [Component Architecture](#5-component-architecture)
6. [Data Architecture](#6-data-architecture)
7. [API Architecture](#7-api-architecture)
8. [Integration Architecture](#8-integration-architecture)
9. [Security Architecture](#9-security-architecture)
10. [Infrastructure Architecture](#10-infrastructure-architecture)
11. [Scalability & Performance](#11-scalability--performance)
12. [Monitoring & Observability](#12-monitoring--observability)
13. [Error Handling & Resilience](#13-error-handling--resilience)
14. [Development & Deployment](#14-development--deployment)
15. [Technical Decisions](#15-technical-decisions)
16. [Migration & Evolution](#16-migration--evolution)

---

## 1. Executive Summary

### 1.1 Purpose

This document defines the technical architecture for the OpenCivics Intelligent Onboarding Assistant, a multi-platform AI-powered engagement system that identifies participant archetypes, maps civic interests, and provides personalized onboarding pathways.

### 1.2 Scope

**In Scope**:
- Web application (Next.js frontend + API)
- Database layer (Supabase PostgreSQL)
- AI integration (Gemini API)
- Knowledge base integration (Notion API)
- Profile image generation
- Chat interface
- Future: Telegram bot, Twitter bot

**Out of Scope**:
- Mobile native apps (mobile web only)
- Real-time collaboration features
- Video/audio processing
- Blockchain integration

### 1.3 Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Frontend Framework** | Next.js 14 (App Router) | SSR, API routes, optimal DX, Vercel integration |
| **Backend Pattern** | Serverless (API Routes) | Zero ops, infinite scale, cost-effective |
| **Database** | Supabase (PostgreSQL) | Managed Postgres, real-time, auth, storage |
| **AI Provider** | Google Gemini | Cost-effective, powerful, good ecosystem |
| **Knowledge CMS** | Notion API | Familiar to content team, structured data |
| **Hosting** | Vercel | Best Next.js hosting, edge network, DX |
| **Language** | TypeScript | Type safety, better DX, fewer runtime errors |
| **Styling** | Tailwind CSS | Utility-first, terminal aesthetic, fast |
| **State Management** | React Context + SWR | Simple, works with SSR, built-in caching |

### 1.4 System Characteristics

- **Availability**: 99.9% uptime target
- **Performance**: <2s page load, <500ms API response
- **Scalability**: Serverless auto-scaling, supports 10k+ concurrent users
- **Security**: HTTPS only, RLS, input validation, rate limiting
- **Maintainability**: Modular architecture, comprehensive typing, documented

---

## 2. Architectural Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Web Browser │  │  Telegram    │  │   Twitter    │        │
│  │  (Next.js)   │  │  Bot Client  │  │  Bot Client  │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
│         │                  │                  │                │
└─────────┼──────────────────┼──────────────────┼────────────────┘
          │                  │                  │
          │ HTTPS            │ HTTPS            │ HTTPS
          │                  │                  │
┌─────────┼──────────────────┼──────────────────┼────────────────┐
│         │       APPLICATION LAYER (Vercel)    │                │
├─────────┴──────────────────┴──────────────────┴────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │            Next.js Application (SSR + CSR)              │  │
│  ├─────────────────────────────────────────────────────────┤  │
│  │                                                         │  │
│  │  Frontend Components          API Routes (Serverless)  │  │
│  │  ├─ Quiz Interface            ├─ /api/quiz/*          │  │
│  │  ├─ Profile Display           ├─ /api/resources/*     │  │
│  │  ├─ Chat Interface            ├─ /api/chat            │  │
│  │  └─ Resource Browser          ├─ /api/profile/*       │  │
│  │                                └─ /api/webhooks/*      │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────┬────────────┬──────────────┬──────────────┬───────────────┘
      │            │              │              │
      │ SQL        │ HTTP         │ HTTP         │ HTTP
      │            │              │              │
┌─────┴────┐ ┌────┴─────┐  ┌─────┴──────┐ ┌────┴──────┐
│          │ │          │  │            │ │           │
│ Supabase │ │  Gemini  │  │   Notion   │ │  Canvas   │
│          │ │   API    │  │    API     │ │   (Node)  │
└──────────┘ └──────────┘  └────────────┘ └───────────┘
│ PostgreSQL  │ AI/LLM      │ Knowledge   │ Image Gen
│ Auth        │ Chat        │ Base        │
│ Storage     │ Analysis    │             │
└─────────────┴─────────────┴─────────────┴───────────

         ┌──────────────────────────────┐
         │    EXTERNAL SERVICES         │
         ├──────────────────────────────┤
         │ - Email (SendGrid/Resend)   │
         │ - Analytics (Vercel)         │
         │ - Monitoring (Sentry)        │
         │ - CDN (Vercel Edge)          │
         └──────────────────────────────┘
```

### 2.2 Architectural Style

**Primary Pattern**: **Serverless Microservices with BFF (Backend for Frontend)**

- **Frontend**: Server-Side Rendered (SSR) + Client-Side Rendering (CSR) hybrid
- **Backend**: Serverless functions (one per API route)
- **Database**: Managed PostgreSQL with connection pooling
- **Integrations**: External API calls from serverless functions
- **State**: Stateless serverless functions + client-side state

**Secondary Patterns**:
- **Repository Pattern**: Data access abstraction
- **Service Layer Pattern**: Business logic separation
- **Factory Pattern**: Object creation (questions, responses)
- **Strategy Pattern**: Archetype detection algorithms
- **Observer Pattern**: Real-time updates (Supabase Realtime)

### 2.3 Technology Stack

#### Frontend
```typescript
{
  "framework": "Next.js 14.2+",
  "language": "TypeScript 5.3+",
  "ui": {
    "styling": "Tailwind CSS 3.4+",
    "components": "React 18.2+",
    "forms": "React Hook Form",
    "validation": "Zod"
  },
  "state": {
    "global": "React Context API",
    "server": "SWR (stale-while-revalidate)",
    "forms": "React Hook Form"
  },
  "routing": "Next.js App Router"
}
```

#### Backend
```typescript
{
  "runtime": "Node.js 20.x",
  "framework": "Next.js API Routes",
  "language": "TypeScript 5.3+",
  "validation": "Zod",
  "database": {
    "orm": "Supabase JS Client",
    "driver": "PostgreSQL"
  },
  "ai": {
    "provider": "Google Gemini",
    "sdk": "@google/generative-ai"
  },
  "cms": {
    "provider": "Notion",
    "sdk": "@notionhq/client"
  }
}
```

#### Infrastructure
```yaml
hosting:
  platform: Vercel
  regions: Global (Edge Network)
  compute: Serverless Functions
  
database:
  provider: Supabase
  engine: PostgreSQL 15+
  features:
    - Row Level Security (RLS)
    - Realtime subscriptions
    - Storage (for images)
    - Auth (future)
  
cdn:
  provider: Vercel Edge Network
  locations: Global
  
monitoring:
  errors: Sentry
  analytics: Vercel Analytics
  logs: Vercel Logs
```

---

## 3. System Context

### 3.1 System Context Diagram

```
                    ┌─────────────────────┐
                    │                     │
                    │   End Users         │
                    │   (Participants)    │
                    │                     │
                    └──────────┬──────────┘
                               │
                               │ Browse/Interact
                               │
              ┌────────────────┴────────────────┐
              │                                  │
              │   OpenCivics Onboarding         │
              │   Assistant                     │
              │                                  │
              └────┬─────────┬─────────┬────────┘
                   │         │         │
         ┌─────────┘         │         └──────────┐
         │                   │                    │
         │                   │                    │
    ┌────┴────┐        ┌────┴─────┐        ┌────┴────┐
    │         │        │          │        │         │
    │ Supabase│        │  Gemini  │        │ Notion  │
    │ (Data)  │        │   (AI)   │        │  (CMS)  │
    │         │        │          │        │         │
    └─────────┘        └──────────┘        └─────────┘
         │                   │                    │
         │                   │                    │
    ┌────┴────┐        ┌────┴─────┐        ┌────┴────┐
    │ Profile │        │ Archetype│        │ Civic   │
    │ Storage │        │ Analysis │        │ Resources│
    │         │        │ Chat     │        │ Patterns │
    └─────────┘        └──────────┘        └─────────┘

    External Integrations (Future):
    - Email Service (SendGrid/Resend)
    - Calendar (Google Calendar API)
    - Newsletter (Mailchimp/ConvertKit)
    - Social (Twitter API, Telegram API)
```

### 3.2 User Personas (Technical)

#### Primary Users
1. **New Visitors**: Anonymous → Want to take quiz
2. **Quiz Takers**: Session-based → Completing onboarding
3. **Engaged Participants**: Authenticated (future) → Returning for resources/chat

#### System Users
1. **Content Managers**: Notion access → Managing resources
2. **Administrators**: Database access → Monitoring, analytics
3. **Developers**: Code access → Building features

### 3.3 External Dependencies

| System | Purpose | Criticality | Fallback |
|--------|---------|-------------|----------|
| **Supabase** | Database, auth, storage | Critical | None (graceful degradation) |
| **Gemini API** | AI analysis, chat | High | Fallback to algorithmic only |
| **Notion API** | Resource library | Medium | Cached/static data |
| **Vercel** | Hosting, deployment | Critical | None (backup hosting plan) |
| **Canvas (Node)** | Image generation | Medium | Pre-generated templates |

---

## 4. Architectural Principles

### 4.1 Core Principles

#### 1. **Serverless-First**
- All backend logic runs in serverless functions
- No long-running processes or state between requests
- Leverage managed services (Supabase, Gemini, Notion)
- Auto-scaling with zero operational overhead

**Benefits**: Lower costs, infinite scale, zero ops  
**Tradeoffs**: Cold starts, execution time limits (10s on Vercel)

#### 2. **Type Safety Everywhere**
- TypeScript for 100% of code (frontend + backend)
- Zod schemas for runtime validation
- Shared types between client and server
- No `any` types in production code

**Benefits**: Fewer runtime errors, better DX, self-documenting  
**Tradeoffs**: Slightly more verbose code, learning curve

#### 3. **Security by Default**
- HTTPS only (enforced by Vercel)
- Row Level Security (RLS) on all Supabase tables
- Input validation on all API routes
- Rate limiting on public endpoints
- No secrets in client code

**Benefits**: Secure by design, reduced attack surface  
**Tradeoffs**: More complex data access patterns

#### 4. **Progressive Enhancement**
- Core functionality works without JavaScript
- Enhanced experience with JavaScript enabled
- Graceful degradation for older browsers
- Mobile-first responsive design

**Benefits**: Accessibility, broader reach, better SEO  
**Tradeoffs**: More complex frontend logic

#### 5. **Separation of Concerns**
- Clear boundaries between layers
- Business logic in services, not controllers
- Data access in repositories, not services
- Presentation logic in components, not pages

**Benefits**: Maintainability, testability, flexibility  
**Tradeoffs**: More files, more abstraction

#### 6. **Fail-Safe Defaults**
- API failures return cached/static data
- Missing resources show placeholder content
- Errors are logged but don't break UX
- Optimistic UI updates with rollback

**Benefits**: Better UX, higher perceived reliability  
**Tradeoffs**: More error handling code

### 4.2 Design Constraints

| Constraint | Implication | Mitigation |
|------------|-------------|------------|
| **Serverless Function Timeout** | Max 10s execution on Vercel Hobby, 60s on Pro | Async processing for long tasks |
| **Cold Starts** | First request may be slow (100-500ms) | Edge functions for critical paths |
| **Database Connections** | Limited connection pool in serverless | Supabase connection pooling |
| **API Rate Limits** | Gemini: 60 req/min, Notion: 3 req/s | Request queuing, caching |
| **Image Size** | Generated images ~200KB | Optimize PNG compression |
| **Bundle Size** | Affects page load time | Code splitting, tree shaking |

### 4.3 Quality Attributes

```
Performance:     ████████░░ 8/10 (Fast, edge-optimized)
Scalability:     ██████████ 10/10 (Serverless auto-scales)
Availability:    █████████░ 9/10 (Managed services, multi-region)
Security:        █████████░ 9/10 (RLS, validation, HTTPS)
Maintainability: ████████░░ 8/10 (TypeScript, modular)
Testability:     ███████░░░ 7/10 (Unit + integration tests)
Observability:   ████████░░ 8/10 (Logging, monitoring, tracing)
```

---

## 5. Component Architecture

### 5.1 System Decomposition

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Pages      │  │  Components  │  │    Hooks     │    │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤    │
│  │ - Landing    │  │ - Terminal   │  │ - useQuiz    │    │
│  │ - Quiz       │  │ - Question   │  │ - useChat    │    │
│  │ - Results    │  │ - Profile    │  │ - useProfile │    │
│  │ - Chat       │  │ - Resource   │  │ - useAuth    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ API Calls (fetch/SWR)
                             │
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Quiz Routes  │  │Resource Routes│ │ Profile Routes│   │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤    │
│  │ - start      │  │ - search     │  │ - image      │    │
│  │ - response   │  │ - recommend  │  │ - update     │    │
│  │ - complete   │  │              │  │              │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                  │                  │            │
│         └──────────────────┴──────────────────┘            │
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────┐
│                   SERVICE LAYER                             │
├────────────────────────────┼────────────────────────────────┤
│                            │                                │
│  ┌─────────────────────────┴─────────────────────────┐    │
│  │            Core Services                          │    │
│  ├───────────────────────────────────────────────────┤    │
│  │                                                   │    │
│  │  QuizService          ProfileService             │    │
│  │  - startQuiz          - createProfile            │    │
│  │  - saveResponse       - updateProfile            │    │
│  │  - calculateScore     - getProfile               │    │
│  │                                                   │    │
│  │  ArchetypeService     ResourceService            │    │
│  │  - detectArchetype    - searchResources          │    │
│  │  - validateWithAI     - rankByRelevance          │    │
│  │  - mapToRole          - getRecommendations       │    │
│  │                                                   │    │
│  │  ImageService         ChatService                │    │
│  │  - generateProfile    - handleMessage            │    │
│  │  - uploadToStorage    - getHistory               │    │
│  │                                                   │    │
│  └───────────────────────────────────────────────────┘    │
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────┐
│                    INTEGRATION LAYER                        │
├────────────────────────────┼────────────────────────────────┤
│                            │                                │
│  ┌──────────────┐  ┌──────┴──────┐  ┌──────────────┐     │
│  │   Gemini     │  │   Notion    │  │  Supabase    │     │
│  │   Client     │  │   Client    │  │   Client     │     │
│  ├──────────────┤  ├─────────────┤  ├──────────────┤     │
│  │ - analyze    │  │ - search    │  │ - query      │     │
│  │ - generate   │  │ - fetch     │  │ - insert     │     │
│  │ - chat       │  │ - filter    │  │ - update     │     │
│  └──────────────┘  └─────────────┘  └──────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────┐
│                     DATA LAYER                              │
├────────────────────────────┼────────────────────────────────┤
│                            │                                │
│  ┌──────────────┐  ┌──────┴──────┐  ┌──────────────┐     │
│  │ Repositories │  │   Models    │  │   Schemas    │     │
│  ├──────────────┤  ├─────────────┤  ├──────────────┤     │
│  │ - Profile    │  │ - Profile   │  │ - Zod        │     │
│  │ - Quiz       │  │ - Response  │  │ - TypeScript │     │
│  │ - Resource   │  │ - Interest  │  │              │     │
│  └──────────────┘  └─────────────┘  └──────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Component Descriptions

#### 5.2.1 Presentation Layer

**Pages** (`app/*/page.tsx`)
- Route-level components
- Data fetching (server components)
- Layout composition
- SEO metadata

**Components** (`components/*`)
- Reusable UI elements
- Stateless where possible
- Well-typed props
- Accessibility compliant

**Hooks** (`hooks/*`)
- Shared logic extraction
- State management
- Side effects
- Data fetching wrappers

#### 5.2.2 API Layer

**Route Handlers** (`app/api/*/route.ts`)
- Request validation (Zod)
- Authentication/authorization
- Service orchestration
- Response formatting
- Error handling

**Middleware** (Next.js middleware)
- Rate limiting
- CORS headers
- Request logging
- Authentication (future)

#### 5.2.3 Service Layer

**Services** (`lib/services/*`)
- Business logic
- Workflow orchestration
- No direct DB access (use repositories)
- Pure functions where possible
- Well-tested

**Validators** (`lib/validators/*`)
- Zod schemas
- Runtime type checking
- Input sanitization

#### 5.2.4 Integration Layer

**Clients** (`lib/*/client.ts`)
- External API wrappers
- Connection pooling
- Error handling
- Retry logic
- Response mapping

#### 5.2.5 Data Layer

**Repositories** (`lib/repositories/*`)
- Data access abstraction
- CRUD operations
- Query building
- Transaction management

**Models** (`lib/models/*`)
- TypeScript interfaces
- Domain objects
- Business rules

### 5.3 Component Interaction Diagram (Quiz Flow)

```sequence
User -> Page: Load /quiz
Page -> QuizService: startQuiz()
QuizService -> ProfileRepo: createProfile()
ProfileRepo -> Supabase: INSERT profile
Supabase --> ProfileRepo: profileId
ProfileRepo --> QuizService: profileId
QuizService --> Page: quizConfig + profileId
Page --> User: Render first question

User -> Page: Submit answer
Page -> API: POST /api/quiz/response
API -> QuizService: saveResponse(profileId, response)
QuizService -> ResponseRepo: insert(response)
ResponseRepo -> Supabase: INSERT quiz_response
Supabase --> ResponseRepo: success
ResponseRepo --> QuizService: success
QuizService -> QuizService: getNextQuestion()
QuizService --> API: nextQuestion
API --> Page: nextQuestion
Page --> User: Render next question

User -> Page: Submit final answer
Page -> API: POST /api/quiz/complete
API -> QuizService: completeQuiz(profileId)
QuizService -> ResponseRepo: getAllResponses(profileId)
ResponseRepo -> Supabase: SELECT * FROM quiz_responses
Supabase --> ResponseRepo: responses[]
ResponseRepo --> QuizService: responses[]

QuizService -> ArchetypeService: detectArchetype(responses)
ArchetypeService -> ArchetypeService: calculateScores()
ArchetypeService -> GeminiClient: validateArchetype(responses, scores)
GeminiClient -> Gemini: API call
Gemini --> GeminiClient: validation
GeminiClient --> ArchetypeService: validated analysis

ArchetypeService --> QuizService: archetype + confidence
QuizService -> ResourceService: getRecommendations(profile)
ResourceService -> NotionClient: searchResources(sectors, domains)
NotionClient -> Notion: API call
Notion --> NotionClient: resources[]
NotionClient --> ResourceService: resources[]
ResourceService -> GeminiClient: rankRelevance(profile, resources)
GeminiClient -> Gemini: API call
Gemini --> GeminiClient: rankings
GeminiClient --> ResourceService: ranked resources
ResourceService --> QuizService: recommendations

QuizService -> ImageService: generateProfile(profile)
ImageService -> ImageService: renderCanvas()
ImageService -> Supabase: uploadImage()
Supabase --> ImageService: imageUrl
ImageService --> QuizService: imageUrl

QuizService -> GeminiClient: generateSummary(profile, resources)
GeminiClient -> Gemini: API call
Gemini --> GeminiClient: summary
GeminiClient --> QuizService: summary

QuizService -> ProfileRepo: updateProfile(profile)
ProfileRepo -> Supabase: UPDATE profile
Supabase --> ProfileRepo: success
ProfileRepo --> QuizService: success

QuizService --> API: complete profile + resources
API --> Page: profile + resources + summary
Page --> User: Show results
```

---

## 6. Data Architecture

### 6.1 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        profiles                             │
├─────────────────────────────────────────────────────────────┤
│ PK: id (UUID)                                              │
│     created_at (TIMESTAMPTZ)                               │
│     updated_at (TIMESTAMPTZ)                               │
│     name (TEXT)                                            │
│     email (TEXT)                                           │
│     location (TEXT)                                        │
│     primary_archetype (TEXT) ← NOT NULL                    │
│     primary_confidence (NUMERIC)                           │
│     secondary_archetype (TEXT)                             │
│     archetype_reasoning (TEXT)                             │
│     consortium_role (TEXT)                                 │
│     quiz_completed (BOOLEAN)                               │
│     quiz_started_at (TIMESTAMPTZ)                          │
│     quiz_completed_at (TIMESTAMPTZ)                        │
│     quiz_version (TEXT)                                    │
│     profile_image_url (TEXT)                               │
│     onboarding_summary (TEXT)                              │
│     engagement_actions (JSONB)                             │
│     last_active_at (TIMESTAMPTZ)                           │
│     metadata (JSONB)                                       │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ 1:N
                  │
┌─────────────────┴───────────────────────────────────────────┐
│                    quiz_responses                           │
├─────────────────────────────────────────────────────────────┤
│ PK: id (UUID)                                              │
│ FK: profile_id (UUID) → profiles.id                        │
│     created_at (TIMESTAMPTZ)                               │
│     question_id (TEXT) ← NOT NULL                          │
│     question_text (TEXT)                                   │
│     question_type (TEXT)                                   │
│     response_value (JSONB) ← NOT NULL                      │
│     response_raw_text (TEXT)                               │
│     question_order (INTEGER)                               │
│     time_spent_seconds (INTEGER)                           │
│     UNIQUE(profile_id, question_id)                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   profile_interests                         │
├─────────────────────────────────────────────────────────────┤
│ PK: id (UUID)                                              │
│ FK: profile_id (UUID) → profiles.id                        │
│     created_at (TIMESTAMPTZ)                               │
│     civic_sectors (TEXT[]) ← NOT NULL                      │
│     primary_civic_sector (TEXT)                            │
│     innovation_domains (TEXT[])                            │
│     skills (TEXT[])                                        │
│     time_commitment (TEXT)                                 │
│     UNIQUE(profile_id)                                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ N:1
                  │
┌─────────────────┴───────────────────────────────────────────┐
│                profiles (reference back)                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│               resource_recommendations                      │
├─────────────────────────────────────────────────────────────┤
│ PK: id (UUID)                                              │
│ FK: profile_id (UUID) → profiles.id                        │
│     created_at (TIMESTAMPTZ)                               │
│     notion_page_id (TEXT) ← NOT NULL                       │
│     resource_title (TEXT)                                  │
│     resource_url (TEXT)                                    │
│     resource_type (TEXT)                                   │
│     resource_description (TEXT)                            │
│     relevance_score (NUMERIC)                              │
│     recommendation_reason (TEXT)                           │
│     viewed (BOOLEAN) ← DEFAULT FALSE                       │
│     viewed_at (TIMESTAMPTZ)                                │
│     rated_helpful (BOOLEAN)                                │
│     UNIQUE(profile_id, notion_page_id)                     │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ N:1
                  │
┌─────────────────┴───────────────────────────────────────────┐
│                profiles (reference back)                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    conversations                            │
├─────────────────────────────────────────────────────────────┤
│ PK: id (UUID)                                              │
│ FK: profile_id (UUID) → profiles.id                        │
│     created_at (TIMESTAMPTZ)                               │
│     message_role (TEXT) ← NOT NULL (user/assistant/system) │
│     message_content (TEXT) ← NOT NULL                      │
│     conversation_type (TEXT)                               │
│     session_id (UUID)                                      │
│     gemini_model (TEXT)                                    │
│     tokens_used (INTEGER)                                  │
│     metadata (JSONB)                                       │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ N:1
                  │
┌─────────────────┴───────────────────────────────────────────┐
│                profiles (reference back)                    │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Data Models (TypeScript)

```typescript
// lib/models/profile.ts

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Basic info
  name?: string;
  email?: string;
  location?: string;
  
  // Archetype
  primary_archetype: Archetype;
  primary_confidence: number; // 0.00-1.00
  secondary_archetype?: Archetype;
  archetype_reasoning?: string;
  consortium_role?: ConsortiumRole;
  
  // Quiz metadata
  quiz_completed: boolean;
  quiz_started_at?: string;
  quiz_completed_at?: string;
  quiz_version?: string;
  
  // Generated outputs
  profile_image_url?: string;
  onboarding_summary?: string;
  
  // Engagement
  engagement_actions: EngagementAction[];
  last_active_at?: string;
  
  // Extensibility
  metadata: Record<string, unknown>;
}

export type Archetype = 'allies' | 'innovators' | 'organizers' | 'patrons';

export type ConsortiumRole = 'ally' | 'citizen' | 'contributor' | 'patron';

export interface EngagementAction {
  action: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// lib/models/quiz.ts

export interface QuizResponse {
  id: string;
  profile_id: string;
  created_at: string;
  
  question_id: string;
  question_text?: string;
  question_type: QuestionType;
  
  response_value: unknown; // JSON - varies by type
  response_raw_text?: string;
  
  question_order?: number;
  time_spent_seconds?: number;
}

export type QuestionType = 
  | 'single_select' 
  | 'multi_select' 
  | 'text' 
  | 'conversation'
  | 'scale';

export interface QuizQuestion {
  id: string;
  order: number;
  text: string;
  type: QuestionType;
  required: boolean;
  
  // For structured questions
  options?: QuestionOption[];
  
  // For scale questions
  scale?: {
    min: number;
    max: number;
    minLabel: string;
    maxLabel: string;
  };
  
  // Conditional logic
  showIf?: {
    questionId: string;
    condition: (value: unknown) => boolean;
  };
  
  // Archetype mapping
  archetypeWeights?: Partial<Record<Archetype, number>>;
  
  // Validation
  validation?: {
    minSelections?: number;
    maxSelections?: number;
    minLength?: number;
    maxLength?: number;
  };
}

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
  mapsToArchetype?: Archetype;
  archetypeWeight?: number;
  mapsToCivicSector?: string[];
  mapsToInnovationDomain?: string[];
}

// lib/models/resource.ts

export interface Resource {
  id: string; // Notion page ID
  title: string;
  description?: string;
  url: string;
  type: ResourceType;
  
  civic_sectors?: string[];
  innovation_domains?: string[];
  archetype_relevance?: Archetype[];
  
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
}

export type ResourceType = 
  | 'pattern' 
  | 'protocol' 
  | 'playbook' 
  | 'civic_stack'
  | 'primitive';

export interface ResourceRecommendation extends Resource {
  relevance_score: number;
  recommendation_reason: string;
  viewed?: boolean;
  viewed_at?: string;
  rated_helpful?: boolean;
}
```

### 6.3 Data Flow Diagrams

#### 6.3.1 Quiz Completion Data Flow

```
┌─────────┐
│  User   │
│ Submit  │
│ Answer  │
└────┬────┘
     │
     │ HTTP POST /api/quiz/response
     ↓
┌────────────────────────────────────┐
│   API Route Handler                │
│   - Validate input (Zod)           │
│   - Extract session/profile ID     │
└────┬───────────────────────────────┘
     │
     │ saveResponse()
     ↓
┌────────────────────────────────────┐
│   QuizService                      │
│   - Parse response                 │
│   - Determine next question        │
└────┬───────────────────────────────┘
     │
     │ insert()
     ↓
┌────────────────────────────────────┐
│   ResponseRepository               │
│   - Build INSERT query             │
│   - Execute with Supabase client   │
└────┬───────────────────────────────┘
     │
     │ SQL INSERT
     ↓
┌────────────────────────────────────┐
│   Supabase (PostgreSQL)            │
│   - Validate constraints           │
│   - Execute INSERT                 │
│   - Return row                     │
└────┬───────────────────────────────┘
     │
     │ Row data
     ↓
┌────────────────────────────────────┐
│   ResponseRepository               │
│   - Map to domain model            │
│   - Return QuizResponse            │
└────┬───────────────────────────────┘
     │
     │ QuizResponse
     ↓
┌────────────────────────────────────┐
│   QuizService                      │
│   - Check if quiz complete         │
│   - Get next question or done      │
└────┬───────────────────────────────┘
     │
     │ Next question / Complete signal
     ↓
┌────────────────────────────────────┐
│   API Route Handler                │
│   - Format response                │
│   - Return JSON                    │
└────┬───────────────────────────────┘
     │
     │ HTTP 200 JSON
     ↓
┌────────┐
│  User  │
│  Next  │
│Question│
└────────┘
```

#### 6.3.2 Archetype Detection Data Flow

```
┌──────────────┐
│ Complete Quiz│
│   Trigger    │
└──────┬───────┘
       │
       │ POST /api/quiz/complete
       ↓
┌──────────────────────────────┐
│ API Route                    │
│ - Get all responses          │
└──────┬───────────────────────┘
       │
       │ getAllResponses()
       ↓
┌──────────────────────────────┐
│ ResponseRepository           │
│ - Query Supabase             │
│ - Return QuizResponse[]      │
└──────┬───────────────────────┘
       │
       │ responses[]
       ↓
┌──────────────────────────────┐
│ ArchetypeService             │
│ - calculateAlgorithmicScores()│
└──────┬───────────────────────┘
       │
       │ Apply weights from quiz config
       │
       ↓
┌──────────────────────────────┐
│ Scoring Algorithm            │
│ - Sum weights per archetype  │
│ - Normalize to 0-1           │
│ - Identify primary/secondary │
└──────┬───────────────────────┘
       │
       │ { allies: 0.15, innovators: 0.70, ... }
       ↓
┌──────────────────────────────┐
│ ArchetypeService             │
│ - validateWithAI()           │
└──────┬───────────────────────┘
       │
       │ Send to Gemini
       ↓
┌──────────────────────────────┐
│ GeminiClient                 │
│ - Build prompt with:         │
│   * Responses                │
│   * Algorithmic scores       │
│   * Archetype definitions    │
│ - Call Gemini API            │
└──────┬───────────────────────┘
       │
       │ HTTPS POST
       ↓
┌──────────────────────────────┐
│ Gemini API                   │
│ - Analyze context            │
│ - Validate/refine archetype  │
│ - Return structured JSON     │
└──────┬───────────────────────┘
       │
       │ JSON validation result
       ↓
┌──────────────────────────────┐
│ GeminiClient                 │
│ - Parse JSON response        │
│ - Validate schema            │
│ - Return ArchetypeAnalysis   │
└──────┬───────────────────────┘
       │
       │ ArchetypeAnalysis
       ↓
┌──────────────────────────────┐
│ ArchetypeService             │
│ - Merge algorithmic + AI     │
│ - Determine final archetype  │
│ - Return classification      │
└──────┬───────────────────────┘
       │
       │ Final archetype + confidence
       ↓
┌──────────────────────────────┐
│ ProfileRepository            │
│ - UPDATE profile SET...      │
│ - Commit to database         │
└──────┬───────────────────────┘
       │
       │ Success
       ↓
┌──────────────┐
│ Return Result│
│  to User     │
└──────────────┘
```

### 6.4 Database Design Decisions

#### 6.4.1 Normalization

**Approach**: 3NF (Third Normal Form) with selective denormalization

**Normalized Tables**:
- `profiles` - One row per participant
- `quiz_responses` - One row per question answer
- `profile_interests` - One row per profile (1:1)
- `resource_recommendations` - Junction table (N:M with metadata)

**Denormalized Fields** (for performance):
- `profiles.archetype_reasoning` - Could be in separate table but queried together
- `profiles.onboarding_summary` - Generated text stored inline
- `quiz_responses.question_text` - Duplicate of config for historical tracking
- `resource_recommendations.resource_title` - Cached from Notion

**Rationale**: Optimize for read performance (profiles accessed frequently) while keeping quiz responses normalized for analytics.

#### 6.4.2 Indexing Strategy

```sql
-- Primary Keys (automatic B-tree index)
-- All tables have UUID primary key

-- Foreign Keys (for joins)
CREATE INDEX idx_quiz_responses_profile 
  ON quiz_responses(profile_id, question_order);

CREATE INDEX idx_profile_interests_profile 
  ON profile_interests(profile_id);

CREATE INDEX idx_resource_recommendations_profile 
  ON resource_recommendations(profile_id, viewed);

CREATE INDEX idx_conversations_profile_session 
  ON conversations(profile_id, session_id, created_at);

-- Filter/Search Indexes
CREATE INDEX idx_profiles_archetype 
  ON profiles(primary_archetype);

CREATE INDEX idx_profiles_quiz_completed 
  ON profiles(quiz_completed, created_at DESC);

-- Full-text search (future)
CREATE INDEX idx_profiles_name_trgm 
  ON profiles USING gin(name gin_trgm_ops);
```

**Rationale**:
- Profile-based queries are most common (user viewing their data)
- Quiz responses accessed by order for sequential display
- Archetype filtering for analytics
- Prepared for full-text search on names

#### 6.4.3 Data Retention

| Table | Retention | Policy |
|-------|-----------|--------|
| `profiles` | Indefinite | Soft delete (archived flag) |
| `quiz_responses` | Indefinite | Tied to profile |
| `profile_interests` | Indefinite | Updated in place |
| `resource_recommendations` | Indefinite | Historical tracking |
| `conversations` | 90 days | Auto-delete old messages |

**Cleanup Jobs** (Supabase cron):
```sql
-- Delete old conversation messages (runs daily)
DELETE FROM conversations 
WHERE created_at < NOW() - INTERVAL '90 days';

-- Archive inactive profiles (runs weekly)
UPDATE profiles 
SET metadata = metadata || '{"archived": true}'::jsonb
WHERE last_active_at < NOW() - INTERVAL '2 years';
```

---

## 7. API Architecture

### 7.1 API Design Principles

1. **RESTful where applicable**: Resources mapped to URLs
2. **JSON everywhere**: All requests/responses use JSON
3. **Versioning in URL**: `/api/v1/...` (future-proofing)
4. **Consistent error format**: Standard error schema
5. **Idempotency**: Safe to retry POST/PUT operations
6. **Pagination**: Cursor-based for large result sets

### 7.2 API Specification

#### 7.2.1 Quiz Endpoints

**POST /api/quiz/start**

Start a new quiz session.

```typescript
// Request
{} // No body required

// Response 200
{
  "session_id": "uuid",
  "profile_id": "uuid",
  "quiz_config": {
    "id": "onboarding_v1",
    "version": "1.0.0",
    "total_questions": 12
  },
  "first_question": {
    "id": "intro_name",
    "order": 1,
    "text": "What should we call you?",
    "type": "text",
    "required": false
  }
}

// Response 500
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Failed to initialize quiz",
    "details": {}
  }
}
```

**POST /api/quiz/response**

Submit an answer to a question.

```typescript
// Request
{
  "profile_id": "uuid",
  "question_id": "resource_contribution_primary",
  "response_value": "skills_building",
  "time_spent_seconds": 15
}

// Response 200
{
  "saved": true,
  "next_question": {
    "id": "participation_mode",
    "order": 4,
    "text": "How do you see yourself participating?",
    "type": "single_select",
    "options": [...]
  } | null, // null if quiz complete
  "is_complete": false,
  "progress": {
    "current": 3,
    "total": 12,
    "percent": 25
  }
}

// Response 400
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid response format",
    "details": {
      "field": "response_value",
      "issue": "Required field"
    }
  }
}
```

**POST /api/quiz/complete**

Process all responses and generate profile.

```typescript
// Request
{
  "profile_id": "uuid"
}

// Response 200
{
  "profile": {
    "id": "uuid",
    "archetype": "innovators",
    "confidence": 0.87,
    "secondary_archetype": "allies",
    "consortium_role": "contributor",
    "civic_sectors": ["technology", "governance"],
    "innovation_domains": ["open_protocols"],
    "profile_image_url": "https://...",
    "onboarding_summary": "You're an Innovator..."
  },
  "resources": [
    {
      "id": "notion-page-id",
      "title": "Open Protocol Pattern",
      "description": "...",
      "type": "pattern",
      "url": "https://...",
      "relevance_score": 0.95,
      "recommendation_reason": "Matches your interest in..."
    }
  ],
  "next_steps": [
    {
      "id": "join_dev_channel",
      "label": "Join Developer Channel",
      "url": "https://...",
      "priority": "high"
    }
  ]
}

// Response 422
{
  "error": {
    "code": "QUIZ_INCOMPLETE",
    "message": "Quiz not fully completed",
    "details": {
      "answered": 10,
      "required": 12
    }
  }
}
```

#### 7.2.2 Resource Endpoints

**GET /api/resources/search**

Search resources from Notion.

```typescript
// Request Query Params
?query=governance&civic_sectors=governance,education&limit=10

// Response 200
{
  "resources": [
    {
      "id": "notion-page-id",
      "title": "Participatory Governance Protocol",
      "description": "...",
      "type": "protocol",
      "civic_sectors": ["governance"],
      "innovation_domains": ["network_governance"],
      "url": "https://..."
    }
  ],
  "total": 47,
  "page": 1,
  "per_page": 10,
  "has_more": true
}
```

**POST /api/resources/recommend**

Get personalized recommendations.

```typescript
// Request
{
  "profile_id": "uuid",
  "limit": 5
}

// Response 200
{
  "recommendations": [
    {
      ...resource fields,
      "relevance_score": 0.92,
      "recommendation_reason": "Directly matches..."
    }
  ]
}
```

#### 7.2.3 Profile Endpoints

**GET /api/profile/:profileId**

Get profile details.

```typescript
// Response 200
{
  "profile": {
    "id": "uuid",
    "name": "Jane Doe",
    "archetype": "organizers",
    "confidence": 0.91,
    "civic_sectors": ["education", "community"],
    "profile_image_url": "https://...",
    "quiz_completed_at": "2025-11-15T10:30:00Z"
  }
}

// Response 404
{
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "Profile does not exist"
  }
}
```

**PATCH /api/profile/:profileId**

Update profile (future - requires auth).

```typescript
// Request
{
  "name": "Jane Smith",
  "location": "Denver, CO"
}

// Response 200
{
  "profile": { ...updated fields }
}
```

**POST /api/profile/image**

Generate civic identity image.

```typescript
// Request
{
  "profile_id": "uuid"
}

// Response 200
{
  "image_url": "https://supabase-storage.../profile.png"
}
```

#### 7.2.4 Chat Endpoints

**POST /api/chat**

Send message to AI assistant.

```typescript
// Request
{
  "message": "What is network governance?",
  "profile_id": "uuid", // optional
  "session_id": "uuid", // optional
  "include_notion_context": true
}

// Response 200
{
  "message": "Network governance is...",
  "resources": [
    // Related resources if found
  ],
  "follow_up_suggestions": [
    "Tell me more about bioregional coordination",
    "How can I get involved?"
  ],
  "tokens_used": 450
}
```

### 7.3 Error Handling

**Standard Error Format**:

```typescript
interface APIError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    timestamp?: string;
    request_id?: string;
  };
}
```

**Error Codes**:

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request format/data |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `CONFLICT` | 409 | Resource already exists |
| `QUIZ_INCOMPLETE` | 422 | Quiz not finished |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | External service down |

**Error Handling Flow**:

```typescript
// app/api/quiz/response/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { APIError } from '@/lib/errors';

const requestSchema = z.object({
  profile_id: z.string().uuid(),
  question_id: z.string(),
  response_value: z.unknown(),
  time_spent_seconds: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Parse and validate request
    const body = await req.json();
    const validated = requestSchema.parse(body);
    
    // 2. Business logic
    const result = await quizService.saveResponse(validated);
    
    // 3. Return success
    return NextResponse.json(result, { status: 200 });
    
  } catch (error) {
    // 4. Handle errors
    if (error instanceof z.ZodError) {
      return NextResponse.json<APIError>({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request format',
          details: error.errors,
        }
      }, { status: 400 });
    }
    
    if (error instanceof QuizNotFoundError) {
      return NextResponse.json<APIError>({
        error: {
          code: 'NOT_FOUND',
          message: error.message,
        }
      }, { status: 404 });
    }
    
    // Generic server error
    console.error('Unexpected error:', error);
    return NextResponse.json<APIError>({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      }
    }, { status: 500 });
  }
}
```

### 7.4 Rate Limiting

**Strategy**: Token bucket algorithm

**Limits**:
- Anonymous users: 100 requests / hour / IP
- Quiz endpoints: 20 requests / minute / session
- Chat endpoint: 10 requests / minute / session

**Implementation** (Vercel Edge Middleware):

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 h'),
});

export async function middleware(request: NextRequest) {
  // Get identifier (IP or session)
  const ip = request.ip ?? '127.0.0.1';
  
  // Check rate limit
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      {
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests',
          details: {
            limit,
            reset,
            remaining: 0,
          }
        }
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        }
      }
    );
  }
  
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', reset.toString());
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

---

## 8. Integration Architecture

### 8.1 External Service Integration Patterns

#### 8.1.1 Gemini API Integration

**Pattern**: Request-Response with Retry Logic

```typescript
// lib/gemini/client.ts
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { retry } from '@/lib/utils/retry';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export class GeminiClient {
  private model: GenerativeModel;
  
  constructor(modelName: string = 'gemini-1.5-pro') {
    this.model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    });
  }
  
  async generateContent(prompt: string): Promise<string> {
    return retry(
      async () => {
        const result = await this.model.generateContent(prompt);
        const response = result.response;
        return response.text();
      },
      {
        maxAttempts: 3,
        delayMs: 1000,
        backoffMultiplier: 2,
        retryableErrors: ['RATE_LIMIT', 'INTERNAL_ERROR'],
      }
    );
  }
  
  async generateContentStreaming(prompt: string): AsyncGenerator<string> {
    const result = await this.model.generateContentStream(prompt);
    
    for await (const chunk of result.stream) {
      yield chunk.text();
    }
  }
}

// Error handling
export class GeminiError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'GeminiError';
  }
}

// Retry utility
async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts: number;
    delayMs: number;
    backoffMultiplier: number;
    retryableErrors: string[];
  }
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      const isRetryable = 
        error instanceof GeminiError && 
        options.retryableErrors.includes(error.code);
      
      if (!isRetryable || attempt === options.maxAttempts) {
        throw error;
      }
      
      const delay = options.delayMs * Math.pow(options.backoffMultiplier, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}
```

**Circuit Breaker** (future enhancement):

```typescript
import CircuitBreaker from 'opossum';

const geminiBreaker = new CircuitBreaker(geminiClient.generateContent, {
  timeout: 30000, // 30s
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
});

geminiBreaker.fallback(() => {
  // Return cached or default response
  return 'Service temporarily unavailable. Please try again.';
});
```

#### 8.1.2 Notion API Integration

**Pattern**: Repository Pattern with Caching

```typescript
// lib/notion/client.ts
import { Client } from '@notionhq/client';
import { LRUCache } from 'lru-cache';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Cache for 5 minutes
const cache = new LRUCache<string, unknown>({
  max: 100,
  ttl: 1000 * 60 * 5,
});

export class NotionClient {
  async searchResources(params: {
    civicSectors?: string[];
    innovationDomains?: string[];
    archetypes?: string[];
    limit?: number;
  }): Promise<Resource[]> {
    const cacheKey = `resources:${JSON.stringify(params)}`;
    
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached as Resource[];
    }
    
    // Build filter
    const filter = this.buildFilter(params);
    
    try {
      const response = await notion.databases.query({
        database_id: process.env.NOTION_RESOURCES_DB!,
        filter,
        page_size: params.limit || 10,
        sorts: [
          { property: 'Title', direction: 'ascending' }
        ],
      });
      
      const resources = response.results.map(this.parseResource);
      
      // Cache result
      cache.set(cacheKey, resources);
      
      return resources;
      
    } catch (error) {
      console.error('Notion API error:', error);
      
      // Return cached data if available (stale-while-revalidate)
      if (cached) {
        return cached as Resource[];
      }
      
      throw new NotionError('Failed to fetch resources', error);
    }
  }
  
  private buildFilter(params: {
    civic_sectors?: string[];
    innovation_domains?: string[];
    archetypes?: string[];
  }): any {
    const filters: any[] = [];
    
    if (params.civicSectors?.length) {
      filters.push({
        or: params.civicSectors.map(sector => ({
          property: 'Civic Sectors',
          multi_select: { contains: sector }
        }))
      });
    }
    
    if (params.innovationDomains?.length) {
      filters.push({
        or: params.innovationDomains.map(domain => ({
          property: 'Innovation Domains',
          multi_select: { contains: domain }
        }))
      });
    }
    
    // Only published resources
    filters.push({
      property: 'Status',
      select: { equals: 'Published' }
    });
    
    return filters.length > 0 ? { and: filters } : undefined;
  }
  
  private parseResource(page: any): Resource {
    return {
      id: page.id,
      title: this.getPropertyValue(page, 'Title', 'title'),
      description: this.getPropertyValue(page, 'Description', 'rich_text'),
      type: this.getPropertyValue(page, 'Type', 'select'),
      civic_sectors: this.getPropertyValue(page, 'Civic Sectors', 'multi_select'),
      innovation_domains: this.getPropertyValue(page, 'Innovation Domains', 'multi_select'),
      archetype_relevance: this.getPropertyValue(page, 'Archetype Relevance', 'multi_select'),
      url: page.url,
    };
  }
  
  private getPropertyValue(page: any, propName: string, type: string): any {
    const prop = page.properties[propName];
    if (!prop) return null;
    
    switch (type) {
      case 'title':
        return prop.title?.[0]?.plain_text || '';
      case 'rich_text':
        return prop.rich_text?.[0]?.plain_text || '';
      case 'select':
        return prop.select?.name || null;
      case 'multi_select':
        return prop.multi_select?.map((s: any) => s.name) || [];
      default:
        return null;
    }
  }
}
```

#### 8.1.3 Supabase Integration

**Pattern**: Repository Pattern with Connection Pooling

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Server-side client (service role)
export const supabaseServer = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'X-Client-Info': 'opencivics-onboarding'
      }
    }
  }
);

// Client-side client (anon key)
export const supabaseBrowser = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Repository example
export class ProfileRepository {
  constructor(private supabase: typeof supabaseServer) {}
  
  async create(data: Partial<Profile>): Promise<Profile> {
    const { data: profile, error } = await this.supabase
      .from('profiles')
      .insert({
        primary_archetype: data.primary_archetype || 'allies',
        quiz_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...data,
      })
      .select()
      .single();
    
    if (error) {
      throw new DatabaseError('Failed to create profile', error);
    }
    
    return profile;
  }
  
  async findById(id: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new DatabaseError('Failed to fetch profile', error);
    }
    
    return data;
  }
  
  async update(id: string, data: Partial<Profile>): Promise<Profile> {
    const { data: profile, error } = await this.supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw new DatabaseError('Failed to update profile', error);
    }
    
    return profile;
  }
  
  // Bulk operations with transactions
  async createWithResponses(
    profile: Partial<Profile>,
    responses: QuizResponse[]
  ): Promise<{ profile: Profile; responses: QuizResponse[] }> {
    // Supabase doesn't support multi-table transactions directly
    // Use RPC function for atomicity
    const { data, error } = await this.supabase
      .rpc('create_profile_with_responses', {
        profile_data: profile,
        responses_data: responses,
      });
    
    if (error) {
      throw new DatabaseError('Failed to create profile with responses', error);
    }
    
    return data;
  }
}
```

### 8.2 Integration Resilience

#### 8.2.1 Timeout Configuration

```typescript
// lib/config/timeouts.ts
export const TIMEOUTS = {
  gemini: {
    default: 30000, // 30s
    streaming: 60000, // 60s
  },
  notion: {
    query: 10000, // 10s
    fetch: 5000, // 5s
  },
  supabase: {
    query: 5000, // 5s
    transaction: 10000, // 10s
  },
  imageGeneration: {
    render: 5000, // 5s
    upload: 10000, // 10s
  },
};

// Usage with AbortController
async function fetchWithTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const result = await fn();
    clearTimeout(timeout);
    return result;
  } catch (error) {
    clearTimeout(timeout);
    if (controller.signal.aborted) {
      throw new TimeoutError(`Operation timed out after ${timeoutMs}ms`);
    }
    throw error;
  }
}
```

#### 8.2.2 Fallback Strategies

```typescript
// lib/services/archetype-service.ts
export class ArchetypeService {
  async detectArchetype(
    responses: QuizResponse[]
  ): Promise<ArchetypeAnalysis> {
    // Primary: Algorithmic + AI validation
    try {
      const algorithmicScores = this.calculateScores(responses);
      const aiValidation = await this.geminiClient.validateArchetype(
        responses,
        algorithmicScores
      );
      
      return {
        ...aiValidation,
        method: 'hybrid',
      };
      
    } catch (error) {
      console.error('AI validation failed, using algorithmic only:', error);
      
      // Fallback: Algorithmic only
      const algorithmicScores = this.calculateScores(responses);
      const primary = Object.entries(algorithmicScores)
        .sort(([,a], [,b]) => b - a)[0][0] as Archetype;
      
      return {
        validated_archetype: primary,
        confidence: algorithmicScores[primary],
        secondary_archetype: null,
        reasoning: 'Algorithmic detection (AI unavailable)',
        archetype_breakdown: algorithmicScores,
        consortium_role_suggestion: this.mapToRole(primary),
        method: 'algorithmic_only',
      };
    }
  }
}
```

---

## 9. Security Architecture

### 9.1 Security Principles

1. **Defense in Depth**: Multiple layers of security controls
2. **Least Privilege**: Minimal access rights for all components
3. **Secure by Default**: Security built-in, not bolted-on
4. **Data Privacy**: User data protection and GDPR compliance
5. **Input Validation**: All inputs validated and sanitized

### 9.2 Authentication & Authorization

#### 9.2.1 Current State (MVP)

**Anonymous Access Model**:
- No authentication required for quiz
- Profile ID as session identifier
- UUID-based profile URLs
- Row-Level Security (RLS) in Supabase

```typescript
// lib/security/session.ts
export class SessionManager {
  createAnonymousSession(): Session {
    return {
      profile_id: crypto.randomUUID(),
      session_id: crypto.randomUUID(),
      created_at: new Date(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };
  }
  
  validateSession(sessionId: string): boolean {
    // Check if session exists and not expired
    const session = this.getSession(sessionId);
    return session && session.expires_at > new Date();
  }
}
```

#### 9.2.2 Future Authentication (Phase 2)

**Supabase Auth Integration**:
```typescript
// Future authentication flow
export async function signInWithEmail(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });
  
  if (error) throw error;
  return data;
}

// Row Level Security Policy
/*
CREATE POLICY "Users can only access their own data"
ON profiles
FOR ALL
USING (auth.uid() = id);
*/
```

### 9.3 Data Security

#### 9.3.1 Encryption

**At Rest**:
- Database: PostgreSQL native encryption (Supabase managed)
- File Storage: AES-256 encryption (Supabase Storage)
- Backups: Encrypted by default

**In Transit**:
- All connections use TLS 1.3
- HTTPS enforced on all endpoints
- API keys transmitted via secure headers only

```typescript
// middleware.ts - Enforce HTTPS
export function middleware(request: NextRequest) {
  // Redirect HTTP to HTTPS
  if (process.env.NODE_ENV === 'production' &&
      !request.url.startsWith('https://')) {
    return NextResponse.redirect(
      request.url.replace('http://', 'https://'),
      301
    );
  }
  
  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );
  
  return response;
}
```

#### 9.3.2 Data Classification

| Classification | Data Types | Storage | Access |
|----------------|------------|---------|--------|
| **Public** | Archetype descriptions, civic sectors | Notion, CDN | Anyone |
| **Internal** | Quiz questions, system config | Code, Notion | Application |
| **Confidential** | Profile data, quiz responses | Supabase | Profile owner only |
| **Restricted** | API keys, service credentials | Vercel Env | Server-side only |

#### 9.3.3 Sensitive Data Handling

```typescript
// lib/security/data-sanitizer.ts
export class DataSanitizer {
  // Sanitize user input
  sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove HTML tags
      .substring(0, 10000); // Max length
  }
  
  // Sanitize before logging
  sanitizeForLogging(data: any): any {
    const sanitized = { ...data };
    
    // Remove sensitive fields
    delete sanitized.email;
    delete sanitized.api_key;
    delete sanitized.token;
    
    // Truncate long strings
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string' && sanitized[key].length > 100) {
        sanitized[key] = sanitized[key].substring(0, 100) + '...';
      }
    });
    
    return sanitized;
  }
  
  // Remove PII before external logging
  removePII(data: any): any {
    const cleaned = { ...data };
    delete cleaned.name;
    delete cleaned.email;
    delete cleaned.location;
    return cleaned;
  }
}
```

### 9.4 API Security

#### 9.4.1 Rate Limiting

```typescript
// lib/security/rate-limiter.ts
import { Redis } from '@upstash/redis';

export class RateLimiter {
  private redis: Redis;
  
  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL!,
      token: process.env.UPSTASH_REDIS_TOKEN!,
    });
  }
  
  async checkLimit(
    identifier: string,
    limit: number,
    windowMs: number
  ): Promise<{ allowed: boolean; remaining: number }> {
    const key = `ratelimit:${identifier}`;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Remove old entries
    await this.redis.zremrangebyscore(key, 0, windowStart);
    
    // Count requests in current window
    const count = await this.redis.zcard(key);
    
    if (count >= limit) {
      return { allowed: false, remaining: 0 };
    }
    
    // Add current request
    await this.redis.zadd(key, { score: now, member: `${now}:${Math.random()}` });
    await this.redis.expire(key, Math.ceil(windowMs / 1000));
    
    return { allowed: true, remaining: limit - count - 1 };
  }
}

// Middleware for rate limiting
export async function withRateLimit(
  request: NextRequest,
  handler: () => Promise<NextResponse>
) {
  const limiter = new RateLimiter();
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  
  // Different limits for different endpoints
  const limits = {
    '/api/quiz/response': { limit: 100, window: 60000 }, // 100/min
    '/api/chat': { limit: 20, window: 60000 }, // 20/min
    '/api/profile/image': { limit: 10, window: 60000 }, // 10/min
  };
  
  const path = new URL(request.url).pathname;
  const config = limits[path] || { limit: 60, window: 60000 };
  
  const { allowed, remaining } = await limiter.checkLimit(
    `${ip}:${path}`,
    config.limit,
    config.window
  );
  
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': config.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'Retry-After': Math.ceil(config.window / 1000).toString(),
        },
      }
    );
  }
  
  const response = await handler();
  response.headers.set('X-RateLimit-Limit', config.limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  
  return response;
}
```

#### 9.4.2 Input Validation

```typescript
// lib/validation/schemas.ts
import { z } from 'zod';

export const quizResponseSchema = z.object({
  profile_id: z.string().uuid(),
  question_id: z.string().min(1).max(100),
  response_value: z.union([
    z.string(),
    z.number(),
    z.array(z.string()),
    z.object({}).passthrough(),
  ]),
  time_spent_seconds: z.number().int().min(0).max(3600).optional(),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().max(255).optional(),
  location: z.string().max(255).optional(),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(5000),
  profile_id: z.string().uuid().optional(),
  session_id: z.string().uuid().optional(),
});

// Usage in API routes
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = quizResponseSchema.parse(body);
    
    // Process validated data...
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}
```

#### 9.4.3 CORS Configuration

```typescript
// middleware.ts
export function setCorsHeaders(response: NextResponse) {
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'https://opencivics.co',
    'https://*.opencivics.co',
  ];
  
  response.headers.set('Access-Control-Allow-Origin', allowedOrigins.join(','));
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  return response;
}
```

### 9.5 Secret Management

```typescript
// lib/config/secrets.ts
export class SecretManager {
  private static validate() {
    const required = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'GEMINI_API_KEY',
      'NOTION_API_KEY',
    ];
    
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
  
  static getSecret(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Secret not found: ${key}`);
    }
    return value;
  }
  
  // Ensure secrets are validated on startup
  static init() {
    this.validate();
  }
}

// Initialize in app startup
SecretManager.init();
```

### 9.6 Security Monitoring

```typescript
// lib/security/monitoring.ts
export class SecurityMonitor {
  async logSecurityEvent(event: {
    type: 'auth_failure' | 'rate_limit' | 'invalid_input' | 'suspicious_activity';
    severity: 'low' | 'medium' | 'high' | 'critical';
    details: any;
    ip?: string;
    user_id?: string;
  }) {
    // Log to monitoring service
    console.warn('[SECURITY]', {
      timestamp: new Date().toISOString(),
      ...event,
    });
    
    // Send to Sentry for critical events
    if (event.severity === 'critical' || event.severity === 'high') {
      // Sentry.captureMessage(...)
    }
    
    // Store in database for analysis
    if (event.severity === 'high' || event.severity === 'critical') {
      await supabase.from('security_events').insert({
        event_type: event.type,
        severity: event.severity,
        details: event.details,
        ip_address: event.ip,
        user_id: event.user_id,
        created_at: new Date().toISOString(),
      });
    }
  }
}
```

---

## 10. Infrastructure Architecture

### 10.1 Hosting Architecture

#### 10.1.1 Vercel Configuration

```json
// vercel.json
{
  "version": 2,
  "framework": "nextjs",
  "regions": ["iad1", "sfo1", "cdg1"],
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30,
      "memory": 1024
    },
    "app/api/quiz/complete.ts": {
      "maxDuration": 60,
      "memory": 2048
    },
    "app/api/profile/image.ts": {
      "maxDuration": 30,
      "memory": 2048
    }
  },
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 2 * * *"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

#### 10.1.2 Edge Network Strategy

```typescript
// next.config.js
module.exports = {
  experimental: {
    runtime: 'edge',
  },
  
  // Static pages cached at edge
  staticPageGenerationTimeout: 60,
  
  // Image optimization
  images: {
    domains: ['*.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Compression
  compress: true,
  
  // Headers for caching
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### 10.2 Database Infrastructure

#### 10.2.1 Supabase Configuration

**Project Settings**:
```yaml
database:
  version: PostgreSQL 15
  region: us-east-1 (primary)
  tier: Pro
  
connection_pooling:
  enabled: true
  mode: transaction
  pool_size: 15
  
backups:
  automated: daily
  retention: 30 days
  point_in_time_recovery: 7 days
  
security:
  ssl_enforcement: required
  row_level_security: enabled
  
monitoring:
  slow_query_logging: enabled
  slow_query_threshold: 1000ms
```

#### 10.2.2 Connection Management

```typescript
// lib/db/connection-pool.ts
import { createClient } from '@supabase/supabase-js';

export class DatabaseConnectionManager {
  private static instance: DatabaseConnectionManager;
  private connectionPool: Map<string, any>;
  
  private constructor() {
    this.connectionPool = new Map();
  }
  
  static getInstance(): DatabaseConnectionManager {
    if (!this.instance) {
      this.instance = new DatabaseConnectionManager();
    }
    return this.instance;
  }
  
  getConnection(type: 'service' | 'anon' = 'service') {
    const key = `supabase_${type}`;
    
    if (!this.connectionPool.has(key)) {
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        type === 'service'
          ? process.env.SUPABASE_SERVICE_ROLE_KEY!
          : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          auth: {
            autoRefreshToken: type === 'anon',
            persistSession: type === 'anon',
          },
          db: {
            schema: 'public',
          },
        }
      );
      
      this.connectionPool.set(key, client);
    }
    
    return this.connectionPool.get(key);
  }
}
```

### 10.3 Storage Infrastructure

#### 10.3.1 Supabase Storage

**Bucket Configuration**:
```sql
-- Profile images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true);

-- Bucket policy
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'profile-images' );

CREATE POLICY "Service Role Upload"
ON storage.objects FOR INSERT
USING ( bucket_id = 'profile-images' AND auth.role() = 'service_role' );
```

```typescript
// lib/storage/image-storage.ts
export class ImageStorageService {
  private supabase = supabaseServer;
  
  async uploadProfileImage(
    profileId: string,
    imageBuffer: Buffer
  ): Promise<string> {
    const fileName = `${profileId}-civic-identity.png`;
    const filePath = `profiles/${fileName}`;
    
    const { error: uploadError } = await this.supabase.storage
      .from('profile-images')
      .upload(filePath, imageBuffer, {
        contentType: 'image/png',
        upsert: true,
        cacheControl: '31536000', // 1 year
      });
    
    if (uploadError) {
      throw new StorageError('Failed to upload image', uploadError);
    }
    
    // Get public URL
    const { data } = this.supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }
  
  async deleteProfileImage(profileId: string): Promise<void> {
    const fileName = `profiles/${profileId}-civic-identity.png`;
    
    const { error } = await this.supabase.storage
      .from('profile-images')
      .remove([fileName]);
    
    if (error) {
      throw new StorageError('Failed to delete image', error);
    }
  }
}
```

### 10.4 CDN & Caching Strategy

#### 10.4.1 Caching Layers

```
┌─────────────────────────────────────────────────┐
│          Browser Cache (Client)                 │
│  - Static assets: 1 year                        │
│  - API responses: No cache (or SWR)            │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────┐
│          Vercel Edge Cache (CDN)                │
│  - Static pages: 1 hour                         │
│  - Static assets: 1 year                        │
│  - Images: 1 year (optimized)                   │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────┐
│       Application Cache (SWR/React Query)       │
│  - Quiz config: 5 minutes                       │
│  - Resources: 10 minutes                        │
│  - Profile data: No cache (fresh)               │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────┐
│          Database Query Cache                   │
│  - Supabase internal caching                    │
│  - Connection pooling                           │
└─────────────────────────────────────────────────┘
```

#### 10.4.2 Cache Implementation

```typescript
// lib/cache/cache-manager.ts
import { unstable_cache } from 'next/cache';

export class CacheManager {
  // Cache quiz configuration (rarely changes)
  static getQuizConfig = unstable_cache(
    async () => {
      const config = await loadQuizConfig();
      return config;
    },
    ['quiz-config'],
    {
      revalidate: 300, // 5 minutes
      tags: ['quiz'],
    }
  );
  
  // Cache civic sectors (static data)
  static getCivicSectors = unstable_cache(
    async () => {
      const sectors = await notionClient.getCivicSectors();
      return sectors;
    },
    ['civic-sectors'],
    {
      revalidate: 3600, // 1 hour
      tags: ['notion', 'civic-sectors'],
    }
  );
  
  // Invalidate cache
  static async invalidate(tags: string[]) {
    // Next.js revalidateTag
    for (const tag of tags) {
      revalidateTag(tag);
    }
  }
}
```

### 10.5 Disaster Recovery

#### 10.5.1 Backup Strategy

```yaml
database_backups:
  automated:
    frequency: daily
    time: "02:00 UTC"
    retention: 30 days
  
  manual:
    frequency: before_major_releases
    retention: 90 days
  
  point_in_time_recovery:
    enabled: true
    window: 7 days

storage_backups:
  profile_images:
    frequency: weekly
    retention: 30 days
    destination: s3_bucket (if needed)
```

#### 10.5.2 Recovery Procedures

```typescript
// scripts/disaster-recovery/restore-database.ts
export async function restoreFromBackup(
  backupTimestamp: Date
) {
  console.log('Starting database restore...');
  
  // 1. Create new Supabase project
  // 2. Restore from backup using Supabase CLI
  // 3. Update environment variables
  // 4. Verify data integrity
  // 5. Update DNS if needed
  
  console.log('Database restore complete');
}

// Recovery Time Objective (RTO): 2 hours
// Recovery Point Objective (RPO): 24 hours
```

---

## 11. Scalability & Performance

### 11.1 Performance Targets

| Metric | Target | P95 | P99 |
|--------|--------|-----|-----|
| **Page Load (FCP)** | <2s | <3s | <5s |
| **Page Load (LCP)** | <2.5s | <4s | <5s |
| **API Response** | <500ms | <1s | <2s |
| **Quiz Completion** | <10s | <15s | <20s |
| **Profile Generation** | <10s | <15s | <30s |
| **Chat Response** | <3s | <5s | <8s |
| **Image Generation** | <5s | <8s | <10s |

### 11.2 Scalability Architecture

#### 11.2.1 Horizontal Scaling

```
┌──────────────────────────────────────────────────┐
│         Load Balancer (Vercel)                   │
│         - Global Edge Network                    │
│         - Auto-scaling serverless functions      │
└───┬──────────┬──────────┬──────────┬────────────┘
    │          │          │          │
    ▼          ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│Function│ │Function│ │Function│ │Function│
│   1    │ │   2    │ │   N    │ │  N+1   │
└───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
    │          │          │          │
    └──────────┴──────────┴──────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
    ┌────▼────┐         ┌─────▼──────┐
    │Supabase │         │   Notion   │
    │Pool (15)│         │   Cache    │
    └─────────┘         └────────────┘
```

**Auto-scaling Characteristics**:
- **Serverless Functions**: Automatically scale from 0 to 1000s
- **Database**: Connection pooling (15 connections)
- **Storage**: Unlimited (Supabase handles scaling)
- **CDN**: Global edge network (automatic)

#### 11.2.2 Database Optimization

```sql
-- Critical indexes for performance
CREATE INDEX idx_profiles_archetype ON profiles(primary_archetype);
CREATE INDEX idx_profiles_quiz_completed ON profiles(quiz_completed, created_at DESC);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);

CREATE INDEX idx_quiz_responses_profile ON quiz_responses(profile_id, question_order);
CREATE INDEX idx_quiz_responses_question ON quiz_responses(question_id);

CREATE INDEX idx_interests_profile ON profile_interests(profile_id);
CREATE INDEX idx_interests_sectors ON profile_interests USING GIN(civic_sectors);

CREATE INDEX idx_resources_profile ON resource_recommendations(profile_id, relevance_score DESC);
CREATE INDEX idx_resources_viewed ON resource_recommendations(profile_id, viewed);

CREATE INDEX idx_conversations_profile_session ON conversations(profile_id, session_id, created_at);

-- Materialized view for analytics (updated daily)
CREATE MATERIALIZED VIEW archetype_distribution AS
SELECT 
  primary_archetype,
  COUNT(*) as count,
  AVG(primary_confidence) as avg_confidence,
  DATE_TRUNC('day', created_at) as date
FROM profiles
WHERE quiz_completed = true
GROUP BY primary_archetype, DATE_TRUNC('day', created_at);

CREATE INDEX idx_archetype_dist_date ON archetype_distribution(date DESC);
```

#### 11.2.3 Query Optimization

```typescript
// lib/db/optimized-queries.ts
export class OptimizedQueries {
  // Use select() to fetch only needed columns
  async getProfileSummary(profileId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, primary_archetype, primary_confidence, created_at')
      .eq('id', profileId)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Use pagination for large result sets
  async getProfiles(page: number, pageSize: number = 20) {
    const from = page * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return {
      data,
      total: count,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    };
  }
  
  // Use RPC for complex queries
  async getArchetypeStats() {
    const { data, error } = await supabase
      .rpc('get_archetype_distribution');
    
    if (error) throw error;
    return data;
  }
}
```

### 11.3 Performance Optimization

#### 11.3.1 Frontend Optimization

```typescript
// app/quiz/page.tsx
import dynamic from 'next/dynamic';

// Code splitting - load heavy components only when needed
const QuizRenderer = dynamic(() => import('@/components/quiz/QuizRenderer'), {
  loading: () => <QuizSkeleton />,
  ssr: false, // Client-side only
});

const ProfileGenerator = dynamic(
  () => import('@/components/profile/ProfileGenerator'),
  { ssr: false }
);

// Image optimization
import Image from 'next/image';

export function ProfileImage({ url }: { url: string }) {
  return (
    <Image
      src={url}
      alt="Civic Identity Profile"
      width={1200}
      height={630}
      quality={90}
      priority
      placeholder="blur"
      blurDataURL="data:image/png;base64,..." // Low-res placeholder
    />
  );
}
```

#### 11.3.2 API Optimization

```typescript
// lib/optimization/batch-processor.ts
export class BatchProcessor {
  // Batch multiple database operations
  async batchInsertResponses(
    profileId: string,
    responses: QuizResponse[]
  ) {
    // Single insert with multiple rows (faster than N inserts)
    const { error } = await supabase
      .from('quiz_responses')
      .insert(
        responses.map((r, idx) => ({
          profile_id: profileId,
          question_id: r.question_id,
          response_value: r.response_value,
          question_order: idx + 1,
          created_at: new Date().toISOString(),
        }))
      );
    
    if (error) throw error;
  }
  
  // Parallel API calls
  async generateProfileData(profileId: string, responses: QuizResponse[]) {
    // Run independent operations in parallel
    const [algorithmicScores, civicSectors, innovationDomains] = await Promise.all([
      this.calculateScores(responses),
      this.extractCivicSectors(responses),
      this.extractInnovationDomains(responses),
    ]);
    
    return { algorithmicScores, civicSectors, innovationDomains };
  }
}
```

#### 11.3.3 Caching Strategy

```typescript
// lib/cache/swr-config.ts
import useSWR from 'swr';

export const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 60000, // 1 minute
  
  // Custom fetcher with error handling
  fetcher: async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
      const error = new Error('API request failed');
      error.info = await res.json();
      error.status = res.status;
      throw error;
    }
    return res.json();
  },
};

// Usage in components
export function useQuizConfig() {
  const { data, error, isLoading } = useSWR(
    '/api/quiz/config',
    swrConfig.fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // 5 minutes
    }
  );
  
  return {
    config: data,
    isLoading,
    error,
  };
}
```

### 11.4 Load Testing Strategy

```typescript
// scripts/load-testing/k6-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 500 }, // Ramp up to 500 users
    { duration: '5m', target: 500 }, // Stay at 500 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s
    http_req_failed: ['rate<0.01'],    // Less than 1% errors
  },
};

export default function () {
  // Test quiz start
  const startRes = http.post(`${__ENV.BASE_URL}/api/quiz/start`);
  check(startRes, {
    'quiz started': (r) => r.status === 200,
  });
  
  sleep(1);
  
  // Test quiz response
  const responseRes = http.post(`${__ENV.BASE_URL}/api/quiz/response`, JSON.stringify({
    profile_id: startRes.json().profile_id,
    question_id: 'intro_motivation',
    response_value: 'Test response',
  }));
  
  check(responseRes, {
    'response saved': (r) => r.status === 200,
  });
  
  sleep(2);
}
```

---

## 12. Monitoring & Observability

### 12.1 Logging Strategy

#### 12.1.1 Log Levels & Structure

```typescript
// lib/logging/logger.ts
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export class Logger {
  private context: string;
  
  constructor(context: string) {
    this.context = context;
  }
  
  private log(level: LogLevel, message: string, meta?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      ...(meta && { meta: this.sanitizeMeta(meta) }),
      environment: process.env.NODE_ENV,
    };
    
    // Console logging (Vercel captures this)
    console[level === 'critical' ? 'error' : level](
      JSON.stringify(logEntry)
    );
    
    // Send to external logging service if critical/error
    if (level === 'error' || level === 'critical') {
      this.sendToSentry(logEntry);
    }
  }
  
  private sanitizeMeta(meta: any): any {
    const sanitizer = new DataSanitizer();
    return sanitizer.removePII(meta);
  }
  
  private sendToSentry(logEntry: any) {
    // Sentry integration
    // Sentry.captureMessage(logEntry.message, {
    //   level: logEntry.level,
    //   extra: logEntry.meta,
    // });
  }
  
  debug(message: string, meta?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.log(LogLevel.DEBUG, message, meta);
    }
  }
  
  info(message: string, meta?: any) {
    this.log(LogLevel.INFO, message, meta);
  }
  
  warn(message: string, meta?: any) {
    this.log(LogLevel.WARN, message, meta);
  }
  
  error(message: string, meta?: any) {
    this.log(LogLevel.ERROR, message, meta);
  }
  
  critical(message: string, meta?: any) {
    this.log(LogLevel.CRITICAL, message, meta);
  }
}

// Usage
const logger = new Logger('quiz-api');
logger.info('Quiz started', { profile_id: '...' });
```

#### 12.1.2 Request Logging

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  
  // Add request ID to headers
  const response = NextResponse.next();
  response.headers.set('X-Request-ID', requestId);
  
  // Log request
  const logger = new Logger('http');
  logger.info('Request received', {
    request_id: requestId,
    method: request.method,
    path: request.nextUrl.pathname,
    user_agent: request.headers.get('user-agent'),
    ip: request.ip,
  });
  
  // Log response (on completion)
  response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
  
  return response;
}
```

### 12.2 Metrics & Analytics

#### 12.2.1 Application Metrics

```typescript
// lib/metrics/collector.ts
export class MetricsCollector {
  private static instance: MetricsCollector;
  
  private metrics: Map<string, number>;
  
  private constructor() {
    this.metrics = new Map();
  }
  
  static getInstance(): MetricsCollector {
    if (!this.instance) {
      this.instance = new MetricsCollector();
    }
    return this.instance;
  }
  
  increment(metric: string, value: number = 1) {
    const current = this.metrics.get(metric) || 0;
    this.metrics.set(metric, current + value);
  }
  
  gauge(metric: string, value: number) {
    this.metrics.set(metric, value);
  }
  
  timing(metric: string, duration: number) {
    this.increment(`${metric}.count`);
    this.increment(`${metric}.total_time`, duration);
  }
  
  async flush() {
    // Send metrics to analytics service
    const data = Object.fromEntries(this.metrics);
    
    await fetch('/api/internal/metrics', {
      method: 'POST',
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        metrics: data,
      }),
    });
    
    this.metrics.clear();
  }
}

// Usage in API routes
export async function POST(req: Request) {
  const metrics = MetricsCollector.getInstance();
  const startTime = Date.now();
  
  try {
    // ... handle request
    
    metrics.increment('quiz.responses.success');
    metrics.timing('quiz.responses.duration', Date.now() - startTime);
    
  } catch (error) {
    metrics.increment('quiz.responses.error');
    throw error;
  }
}
```

#### 12.2.2 Business Metrics Dashboard

```typescript
// lib/analytics/dashboard-metrics.ts
export interface DashboardMetrics {
  // Engagement metrics
  quizStarts: number;
  quizCompletions: number;
  completionRate: number;
  avgCompletionTime: number;
  
  // Archetype distribution
  archetypeDistribution: Record<string, number>;
  avgArchetypeConfidence: number;
  
  // Resource engagement
  resourceViews: number;
  resourceClicks: number;
  clickThroughRate: number;
  
  // Social sharing
  profileShares: number;
  shareRate: number;
  
  // Conversion metrics
  newsletterSignups: number;
  eventRegistrations: number;
  consortiumApplications: number;
}

export async function getDashboardMetrics(
  startDate: Date,
  endDate: Date
): Promise<DashboardMetrics> {
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());
  
  const quizStarts = profiles?.length || 0;
  const quizCompletions = profiles?.filter(p => p.quiz_completed).length || 0;
  
  return {
    quizStarts,
    quizCompletions,
    completionRate: quizStarts > 0 ? quizCompletions / quizStarts : 0,
    avgCompletionTime: calculateAvgTime(profiles),
    archetypeDistribution: calculateArchetypeDistribution(profiles),
    avgArchetypeConfidence: calculateAvgConfidence(profiles),
    // ... other metrics
  };
}
```

### 12.3 Error Tracking

#### 12.3.1 Sentry Integration

```typescript
// lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs';

export function initSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    
    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Error filtering
    beforeSend(event, hint) {
      // Don't send client-side errors in development
      if (process.env.NODE_ENV === 'development' && !event.exception) {
        return null;
      }
      
      // Filter out known non-critical errors
      const error = hint.originalException;
      if (error instanceof ValidationError) {
        return null; // Don't track validation errors
      }
      
      return event;
    },
    
    // Release tracking
    release: process.env.VERCEL_GIT_COMMIT_SHA,
  });
}

// Custom error boundary
export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }
  
  render() {
    return this.props.children;
  }
}
```

### 12.4 Health Checks

```typescript
// app/api/health/route.ts
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: 'unknown',
      gemini: 'unknown',
      notion: 'unknown',
      storage: 'unknown',
    },
  };
  
  try {
    // Check database
    const { error: dbError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    health.checks.database = dbError ? 'unhealthy' : 'healthy';
    
    // Check Gemini API
    try {
      await geminiClient.testConnection();
      health.checks.gemini = 'healthy';
    } catch {
      health.checks.gemini = 'unhealthy';
    }
    
    // Check Notion API
    try {
      await notionClient.testConnection();
      health.checks.notion = 'healthy';
    } catch {
      health.checks.notion = 'unhealthy';
    }
    
    // Check storage
    try {
      await supabase.storage.from('profile-images').list('', { limit: 1 });
      health.checks.storage = 'healthy';
    } catch {
      health.checks.storage = 'unhealthy';
    }
    
    // Determine overall status
    const unhealthyChecks = Object.values(health.checks).filter(
      status => status === 'unhealthy'
    );
    
    if (unhealthyChecks.length > 0) {
      health.status = 'degraded';
    }
    
    return Response.json(health, {
      status: health.status === 'healthy' ? 200 : 503,
    });
    
  } catch (error) {
    return Response.json(
      {
        status: 'unhealthy',
        error: error.message,
      },
      { status: 503 }
    );
  }
}
```

---

## 13. Error Handling & Resilience

### 13.1 Error Classification

```typescript
// lib/errors/error-types.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: any) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, public originalError?: any) {
    super(message, 'DATABASE_ERROR', 500);
  }
}

export class ExternalAPIError extends AppError {
  constructor(
    message: string,
    public service: string,
    public originalError?: any
  ) {
    super(message, 'EXTERNAL_API_ERROR', 502);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT_ERROR', 429);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
  }
}
```

### 13.2 Error Handling Middleware

```typescript
// lib/middleware/error-handler.ts
export class ErrorHandler {
  static handle(error: Error): NextResponse {
    const logger = new Logger('error-handler');
    
    // Log error
    if (error instanceof AppError) {
      if (error.isOperational) {
        logger.warn(error.message, {
          code: error.code,
          statusCode: error.statusCode,
        });
      } else {
        logger.error(error.message, {
          code: error.code,
          stack: error.stack,
        });
      }
    } else {
      // Unknown error
      logger.critical('Unhandled error', {
        message: error.message,
        stack: error.stack,
      });
    }
    
    // Return appropriate response
    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.details,
        },
        { status: 400 }
      );
    }
    
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { error: error.message },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
          },
        }
      );
    }
    
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    if (error instanceof ExternalAPIError) {
      return NextResponse.json(
        {
          error: 'External service unavailable',
          service: error.service,
        },
        { status: 502 }
      );
    }
    
    // Generic error response
    return NextResponse.json(
      {
        error: process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : error.message,
      },
      { status: 500 }
    );
  }
}

// Usage in API routes
export async function POST(req: Request) {
  try {
    // ... handle request
    
  } catch (error) {
    return ErrorHandler.handle(error);
  }
}
```

### 13.3 Retry Logic

```typescript
// lib/resilience/retry.ts
export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors?: string[];
}

export class RetryManager {
  private defaultConfig: RetryConfig = {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  };
  
  async retry<T>(
    fn: () => Promise<T>,
    config: Partial<RetryConfig> = {}
  ): Promise<T> {
    const { maxRetries, initialDelay, maxDelay, backoffMultiplier } = {
      ...this.defaultConfig,
      ...config,
    };
    
    let lastError: Error;
    let delay = initialDelay;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
        
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry if not retryable
        if (!this.isRetryable(error, config.retryableErrors)) {
          throw error;
        }
        
        // Don't retry on last attempt
        if (attempt === maxRetries) {
          break;
        }
        
        // Log retry attempt
        console.warn(`Retry attempt ${attempt + 1}/${maxRetries}`, {
          error: error.message,
          delay,
        });
        
        // Wait before retry with exponential backoff
        await this.sleep(delay);
        delay = Math.min(delay * backoffMultiplier, maxDelay);
      }
    }
    
    throw new Error(`Failed after ${maxRetries} retries: ${lastError.message}`);
  }
  
  private isRetryable(error: any, retryableErrors?: string[]): boolean {
    // Network errors are retryable
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      return true;
    }
    
    // 5xx errors are retryable
    if (error.statusCode >= 500 && error.statusCode < 600) {
      return true;
    }
    
    // Custom retryable errors
    if (retryableErrors && retryableErrors.includes(error.code)) {
      return true;
    }
    
    return false;
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage
const retryManager = new RetryManager();

const data = await retryManager.retry(
  () => geminiClient.generateContent(prompt),
  {
    maxRetries: 3,
    initialDelay: 1000,
  }
);
```

### 13.4 Circuit Breaker

```typescript
// lib/resilience/circuit-breaker.ts
export enum CircuitState {
  CLOSED = 'closed',   // Normal operation
  OPEN = 'open',       // Failing, reject requests
  HALF_OPEN = 'half_open', // Testing if service recovered
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime?: Date;
  
  constructor(
    private name: string,
    private threshold: number = 5,
    private timeout: number = 60000, // 60s
    private halfOpenRequests: number = 3
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      // Check if timeout has passed
      if (this.shouldAttemptReset()) {
        this.state = CircuitState.HALF_OPEN;
        this.successCount = 0;
      } else {
        throw new Error(`Circuit breaker is OPEN for ${this.name}`);
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
      
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failureCount = 0;
    
    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      
      if (this.successCount >= this.halfOpenRequests) {
        this.state = CircuitState.CLOSED;
        console.info(`Circuit breaker CLOSED for ${this.name}`);
      }
    }
  }
  
  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = new Date();
    
    if (this.failureCount >= this.threshold) {
      this.state = CircuitState.OPEN;
      console.error(`Circuit breaker OPEN for ${this.name}`);
    }
  }
  
  private shouldAttemptReset(): boolean {
    if (!this.lastFailureTime) return false;
    
    const elapsed = Date.now() - this.lastFailureTime.getTime();
    return elapsed >= this.timeout;
  }
  
  getState(): CircuitState {
    return this.state;
  }
}

// Usage
const geminiCircuitBreaker = new CircuitBreaker('gemini-api', 5, 60000);

const result = await geminiCircuitBreaker.execute(
  () => geminiClient.generateContent(prompt)
);
```

### 13.5 Graceful Degradation

```typescript
// lib/services/archetype-service-with-fallback.ts
export class ResilientArchetypeService {
  async detectArchetype(
    responses: QuizResponse[]
  ): Promise<ArchetypeAnalysis> {
    // Layer 1: Try full AI-enhanced detection
    try {
      return await this.fullAIDetection(responses);
      
    } catch (error) {
      console.warn('AI detection failed, falling back to algorithmic', error);
      
      // Layer 2: Algorithmic detection only
      try {
        return await this.algorithmicDetection(responses);
        
      } catch (error) {
        console.error('Algorithmic detection failed, using fallback', error);
        
        // Layer 3: Simple rule-based fallback
        return this.fallbackDetection(responses);
      }
    }
  }
  
  private async fullAIDetection(
    responses: QuizResponse[]
  ): Promise<ArchetypeAnalysis> {
    const scores = this.calculateScores(responses);
    const validation = await geminiClient.validateArchetype(responses, scores);
    
    return {
      ...validation,
      method: 'ai_enhanced',
    };
  }
  
  private async algorithmicDetection(
    responses: QuizResponse[]
  ): Promise<ArchetypeAnalysis> {
    const scores = this.calculateScores(responses);
    const primary = this.getPrimaryArchetype(scores);
    
    return {
      validated_archetype: primary,
      confidence: scores[primary],
      secondary_archetype: this.getSecondaryArchetype(scores, primary),
      reasoning: 'Algorithmic detection (AI unavailable)',
      archetype_breakdown: scores,
      consortium_role_suggestion: this.mapToRole(primary),
      method: 'algorithmic',
    };
  }
  
  private fallbackDetection(
    responses: QuizResponse[]
  ): ArchetypeAnalysis {
    // Very simple rule: check resource contribution question
    const resourceResponse = responses.find(
      r => r.question_id === 'resource_contribution_primary'
    );
    
    const archetypeMap = {
      time_learning: 'allies',
      time_organizing: 'organizers',
      skills_building: 'innovators',
      capital_funding: 'patrons',
    };
    
    const archetype = archetypeMap[resourceResponse?.response_value] || 'allies';
    
    return {
      validated_archetype: archetype,
      confidence: 0.6,
      secondary_archetype: null,
      reasoning: 'Fallback detection (limited functionality)',
      archetype_breakdown: {
        allies: archetype === 'allies' ? 0.6 : 0.1,
        innovators: archetype === 'innovators' ? 0.6 : 0.1,
        organizers: archetype === 'organizers' ? 0.6 : 0.1,
        patrons: archetype === 'patrons' ? 0.6 : 0.1,
      },
      consortium_role_suggestion: this.mapToRole(archetype),
      method: 'fallback',
    };
  }
}
```

---

## 14. Development & Deployment

### 14.1 Development Workflow

#### 14.1.1 Git Workflow

```
main (production)
  ↑
develop (staging)
  ↑
feature/* (feature branches)
  ↑
hotfix/* (critical fixes)
```

**Branch Strategy**:
```bash
# Feature development
git checkout -b feature/quiz-improvements develop
# ... make changes
git commit -m "feat: add conditional question logic"
git push origin feature/quiz-improvements
# Create PR to develop

# Hotfix for production
git checkout -b hotfix/api-timeout main
# ... fix issue
git commit -m "fix: increase API timeout"
# Create PR to both main and develop
```

#### 14.1.2 Commit Convention

```
<type>(<scope>): <subject>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

Examples:
feat(quiz): add multi-select question type
fix(api): handle null responses in archetype detection
docs(readme): update setup instructions
refactor(db): optimize profile queries
```

### 14.2 CI/CD Pipeline

#### 14.2.1 GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test
      - run: npm run test:integration
      
  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      
  deploy-preview:
    runs-on: ubuntu-latest
    needs: [build]
    if: github.event_name == 'pull_request'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          
  deploy-staging:
    runs-on: ubuntu-latest
    needs: [build]
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          alias-domains: staging.opencivics.co
          
  deploy-production:
    runs-on: ubuntu-latest
    needs: [build]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          alias-domains: onboard.opencivics.co
```

### 14.3 Testing Strategy

#### 14.3.1 Test Pyramid

```
         ╱────────────────╲
        ╱   E2E Tests      ╲    ~10% (Critical paths)
       ╱──────────────────╲
      ╱  Integration Tests ╲   ~30% (API endpoints, DB)
     ╱──────────────────────╲
    ╱    Unit Tests          ╲  ~60% (Functions, utils)
   ╱────────────────────────╲
```

#### 14.3.2 Unit Tests

```typescript
// lib/quiz/__tests__/scoring.test.ts
import { describe, it, expect } from 'vitest';
import { calculateArchetypeScores } from '../scoring';

describe('Archetype Scoring', () => {
  it('should identify Allies archetype from time_learning response', () => {
    const responses = [
      {
        question_id: 'resource_contribution_primary',
        response_value: 'time_learning',
      },
      {
        question_id: 'participation_mode',
        response_value: 'learning',
      },
    ];
    
    const result = calculateArchetypeScores(responses);
    
    expect(result.primary_archetype).toBe('allies');
    expect(result.primary_confidence).toBeGreaterThan(0.8);
  });
  
  it('should identify Innovators from skills_building response', () => {
    const responses = [
      {
        question_id: 'resource_contribution_primary',
        response_value: 'skills_building',
      },
      {
        question_id: 'participation_mode',
        response_value: 'building',
      },
      {
        question_id: 'engagement_stage',
        response_value: 'building_something',
      },
    ];
    
    const result = calculateArchetypeScores(responses);
    
    expect(result.primary_archetype).toBe('innovators');
    expect(result.primary_confidence).toBeGreaterThan(0.85);
  });
});
```

#### 14.3.3 Integration Tests

```typescript
// app/api/quiz/__tests__/complete.integration.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { POST } from '../complete/route';

describe('POST /api/quiz/complete', () => {
  let profileId: string;
  
  beforeEach(async () => {
    // Create test profile with responses
    const { data } = await supabase.from('profiles').insert({}).select().single();
    profileId = data.id;
    
    // Add quiz responses
    await supabase.from('quiz_responses').insert([
      {
        profile_id: profileId,
        question_id: 'resource_contribution_primary',
        response_value: 'skills_building',
        question_order: 1,
      },
      // ... more responses
    ]);
  });
  
  it('should complete quiz and return profile with archetype', async () {
    const request = new Request('http://localhost/api/quiz/complete', {
      method: 'POST',
      body: JSON.stringify({ profile_id: profileId }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.profile.archetype).toBeDefined();
    expect(data.profile.confidence).toBeGreaterThan(0);
    expect(data.resources).toBeInstanceOf(Array);
  });
});
```

### 14.4 Environment Management

```typescript
// lib/config/environment.ts
export const config = {
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL!,
    environment: process.env.NODE_ENV,
  },
  
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },
  
  gemini: {
    apiKey: process.env.GEMINI_API_KEY!,
    model: {
      pro: 'gemini-1.5-pro',
      flash: 'gemini-1.5-flash',
    },
  },
  
  notion: {
    apiKey: process.env.NOTION_API_KEY!,
    databases: {
      civicSectors: process.env.NOTION_CIVIC_SECTORS_DB!,
      innovationDomains: process.env.NOTION_INNOVATION_DOMAINS_DB!,
      resources: process.env.NOTION_RESOURCES_DB!,
    },
  },
  
  features: {
    chat: process.env.FEATURE_CHAT_ENABLED === 'true',
    telegram: process.env.FEATURE_TELEGRAM_ENABLED === 'true',
    twitter: process.env.FEATURE_TWITTER_ENABLED === 'true',
  },
};
```

---

## 15. Technical Decisions

### 15.1 ADR: Architecture Decision Records

#### ADR-001: Use Serverless Architecture

**Context**: Need to build scalable onboarding system with limited ops resources.

**Decision**: Use Vercel serverless functions for all backend logic.

**Rationale**:
- Zero ops overhead (no servers to manage)
- Automatic scaling (0 to 1000s of requests)
- Cost-effective (pay per request)
- Excellent Next.js integration
- Global edge network

**Consequences**:
- ✅ Simplified deployment and scaling
- ✅ Reduced operational costs
- ⚠️ Cold start latency (mitigated with edge functions)
- ⚠️ Function timeout limits (max 60s)

**Alternatives Considered**:
- Traditional server (EC2/VPS): More complex ops
- Container-based (Docker/K8s): Overkill for MVP
- Serverless Framework: Less Next.js integration

---

#### ADR-002: Use Gemini over OpenAI

**Context**: Need LLM for archetype analysis, summary generation, chat.

**Decision**: Use Google Gemini (1.5 Pro/Flash) as primary LLM provider.

**Rationale**:
- Cost: ~10x cheaper than GPT-4
- Quality: Comparable performance for our use case
- Speed: Flash model very fast for simple tasks
- Ecosystem: Good JavaScript SDK
- Rate limits: Generous for startup usage

**Consequences**:
- ✅ Significantly lower LLM costs
- ✅ Fast inference with Flash
- ⚠️ Less ecosystem tooling than OpenAI
- ⚠️ Potential to swap later if needed

**Alternatives Considered**:
- OpenAI GPT-4: Higher cost, better ecosystem
- Claude (Anthropic): Good quality, higher cost
- Open-source (Llama): Hosting complexity

---

#### ADR-003: Use Notion as CMS

**Context**: Need content management for civic resources.

**Decision**: Use Notion databases as CMS via API.

**Rationale**:
- Familiar to non-technical content team
- Structured data with relations
- Good API with TypeScript SDK
- Real-time collaboration
- No additional CMS to manage

**Consequences**:
- ✅ Content team can manage independently
- ✅ No CMS infrastructure to maintain
- ✅ Built-in version control
- ⚠️ API rate limits (3 req/sec)
- ⚠️ Migration complexity if we outgrow

**Alternatives Considered**:
- Contentful: More complex, higher cost
- Sanity: Better for developers, harder for content team
- Airtable: Similar but less flexible API
- Custom CMS: Too much build time

---

#### ADR-004: Use Supabase over Custom Postgres

**Context**: Need managed database with real-time capabilities.

**Decision**: Use Supabase (managed PostgreSQL + extras).

**Rationale**:
- Managed Postgres (no ops)
- Built-in auth (future phase)
- Built-in storage (profile images)
- Real-time subscriptions
- Good TypeScript SDK
- Row-level security

**Consequences**:
- ✅ Rapid development
- ✅ Multiple features in one platform
- ✅ Good free tier for development
- ⚠️ Vendor lock-in (mitigated: standard Postgres)
- ⚠️ Limited customization vs self-hosted

**Alternatives Considered**:
- AWS RDS: More ops, no extras
- PlanetScale: Good MySQL, no real-time
- Firebase: Good real-time, vendor lock-in
- Self-hosted Postgres: Too much ops

---

#### ADR-005: Algorithm + AI Hybrid for Archetype Detection

**Context**: Need accurate archetype classification from quiz responses.

**Decision**: Use hybrid approach: algorithmic scoring + AI validation.

**Rationale**:
- Algorithmic: Fast, deterministic, cheap, offline fallback
- AI validation: Catches nuance, handles edge cases
- Best of both: Speed + accuracy
- Graceful degradation if AI unavailable

**Consequences**:
- ✅ High accuracy (85%+ target)
- ✅ Resilient to AI API failures
- ✅ Explainable (algorithm) + nuanced (AI)
- ⚠️ More complex implementation
- ⚠️ Need to maintain both systems

**Alternatives Considered**:
- Pure algorithmic: Fast but less nuanced
- Pure AI: More accurate but slower, expensive, fragile
- ML model: Too much training overhead

---

### 15.2 Technology Choices Summary

| Component | Technology | Reason |
|-----------|-----------|---------|
| **Frontend** | Next.js 14 + React 18 | SSR, best practices, great DX |
| **Language** | TypeScript | Type safety, better tooling |
| **Styling** | Tailwind CSS | Fast, terminal aesthetic |
| **Hosting** | Vercel | Best Next.js hosting |
| **Database** | Supabase PostgreSQL | Managed, auth, storage |
| **AI/LLM** | Google Gemini | Cost-effective, good quality |
| **CMS** | Notion API | Familiar to team, no ops |
| **Image Gen** | Canvas (Node) | Server-side, full control |
| **State** | React Context + SWR | Simple, built-in caching |
| **Forms** | React Hook Form | Performance, validation |
| **Validation** | Zod | Runtime + compile-time |
| **Monitoring** | Sentry + Vercel Analytics | Error tracking, metrics |

---

## 16. Migration & Evolution

### 16.1 Future Architecture Evolution

#### 16.1.1 Phase 2: Authentication & Profiles

```
Current (Anonymous):
  User → Quiz → Profile ID (UUID) → Results

Phase 2 (Authenticated):
  User → Sign Up → Auth → Quiz → Linked Profile → Dashboard
  
Changes:
  - Add Supabase Auth
  - Link profiles to user accounts
  - Enable profile editing
  - Add user dashboard
```

#### 16.1.2 Phase 3: Multi-Platform

```
Current (Web Only):
  Web App → API → Database

Phase 3 (Multi-Platform):
  ┌─ Web App ──┐
  ├─ Telegram ─┤→ Unified API → Database
  └─ Twitter ──┘
  
Changes:
  - Abstract quiz engine (platform-agnostic)
  - Webhook handlers for bots
  - Shared business logic layer
```

#### 16.1.3 Phase 4: Advanced Features

```
Current (Onboarding Only):
  Quiz → Profile → Resources

Phase 4 (Full Platform):
  ┌─ Onboarding ────────┐
  ├─ Learning Journeys ─┤
  ├─ Blueprint Composer ┤→ Unified Platform
  ├─ Matchmaking ───────┤
  └─ Analytics Dashboard┘
  
Changes:
  - Microservices architecture (if needed)
  - Advanced recommendation engine
  - Real-time collaboration
  - Complex data analytics
```

### 16.2 Data Migration Strategy

#### 16.2.1 Schema Versioning

```sql
-- Migration tracking table
CREATE TABLE schema_migrations (
  version INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  checksum TEXT
);

-- Example migration: Add consortium_role to profiles
-- Migration 001
INSERT INTO schema_migrations (version, name) VALUES
  (1, 'add_consortium_role_to_profiles');

ALTER TABLE profiles ADD COLUMN consortium_role TEXT;

UPDATE profiles SET consortium_role = 'ally'
WHERE primary_archetype = 'allies' AND consortium_role IS NULL;
```

#### 16.2.2 Backward Compatibility

```typescript
// lib/db/version-handler.ts
export class VersionHandler {
  async getProfile(id: string): Promise<Profile> {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    // Handle old schema (pre-consortium_role)
    if (!data.consortium_role) {
      data.consortium_role = this.inferRole(data.primary_archetype);
    }
    
    return data;
  }
  
  private inferRole(archetype: string): string {
    const mapping = {
      allies: 'ally',
      innovators: 'contributor',
      organizers: 'contributor',
      patrons: 'patron',
    };
    
    return mapping[archetype] || 'ally';
  }
}
```

### 16.3 API Versioning

```typescript
// app/api/v1/quiz/route.ts (current)
export async function POST(req: Request) {
  // V1 implementation
}

// app/api/v2/quiz/route.ts (future)
export async function POST(req: Request) {
  // V2 implementation with breaking changes
}

// Versioning strategy
const API_VERSION = process.env.API_VERSION || 'v1';

// Client specifies version
fetch('/api/v1/quiz/start', { ... })
```

### 16.4 Deprecation Policy

```typescript
// lib/api/deprecated.ts
export function deprecated(
  message: string,
  sunsetDate: Date
): MethodDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;
    
    descriptor.value = function (...args: any[]) {
      console.warn(`DEPRECATED: ${message} (sunset: ${sunsetDate})`);
      
      // Add deprecation header
      if (typeof this.setHeader === 'function') {
        this.setHeader('X-API-Deprecated', 'true');
        this.setHeader('X-API-Sunset-Date', sunsetDate.toISOString());
      }
      
      return original.apply(this, args);
    };
    
    return descriptor;
  };
}

// Usage
class QuizAPI {
  @deprecated('Use /api/v2/quiz/start instead', new Date('2026-06-01'))
  async startQuizV1() {
    // Old implementation
  }
}
```

---

## Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| **Archetype** | Primary participation style (Allies, Innovators, Organizers, Patrons) |
| **Civic Sector** | Domain of civic life (governance, education, etc.) |
| **Innovation Domain** | Approach to systemic change (network governance, protocols, etc.) |
| **Consortium** | OpenCivics coordinating body for practitioners |
| **Commons** | Shared knowledge repository in Notion |
| **Profile** | User's civic identity (archetype + interests + metadata) |
| **Session** | Anonymous quiz session identified by UUID |

### B. Reference Documents

- **Product Requirements**: `OpenCivics_Onboarding_Assistant_PRD_Complete.md`
- **Quick Start Guide**: `OpenCivics_Quick_Start_Guide.md`
- **Executive Summary**: `OpenCivics_Executive_Summary.md`
- **Notion Data**:
  - Civic Sectors CSV
  - Innovation Domains CSV
  - OpenCivics Conceptual Architecture

### C. Contact & Support

**Technical Lead**: [To be assigned]  
**Product Owner**: OpenCivics Product Team  
**Email**: engineering@opencivics.co  
**Repository**: github.com/opencivics/onboarding-assistant

---

**Document Status**: ✅ Complete  
**Version**: 1.0  
**Last Updated**: November 2025  
**Approved By**: OpenCivics Engineering Team

---

END OF TECHNICAL ARCHITECTURE DOCUMENT