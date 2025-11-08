# OpenCivics Intelligent Onboarding Assistant
## Executive Summary

---

## Project Overview

The **OpenCivics Intelligent Onboarding Assistant** is an AI-powered, multi-platform engagement tool designed to transform how people discover and enter the OpenCivics ecosystem. It intelligently identifies each person's unique participation style (archetype), maps their civic interests, and guides them toward meaningful action — whether as learners, builders, organizers, or funders.

**Problem**: Current civic onboarding is generic, time-intensive, and fails to connect people with their natural strengths and interests, leading to low engagement and misaligned participation.

**Solution**: An interactive quiz experience powered by Gemini AI that:
- Identifies participation archetype with >85% accuracy
- Generates personalized civic identity profiles
- Dynamically recommends resources from the OpenCivics Commons
- Provides clear, archetype-specific next steps
- Creates shareable "civic identity cards"

---

## The Four Archetypes

### 1. **Allies** — The Fundamentals Layer
*Curious learners exploring open civics*
- **Contribute**: Time for learning, cultural signal-boosting
- **Need**: Orientation, learning materials, sense of belonging
- **Next Steps**: Subscribe to newsletter, join intro calls, explore frameworks

### 2. **Innovators** — The Systems Builders
*Technologists and designers building civic tools*
- **Contribute**: Technical skills, expertise, prototypes
- **Need**: Collaboration opportunities, funding, peer recognition
- **Next Steps**: Join developer channels, apply for Labs projects, connect with builders

### 3. **Organizers** — The Community Weavers
*Facilitators implementing civic systems locally*
- **Contribute**: Time for coordination, facilitation capacity
- **Need**: Tested frameworks, facilitation training, funding for initiatives
- **Next Steps**: Join organizer network, access resources, apply for implementation support

### 4. **Patrons** — The Regenerative Stewards
*Funders resourcing civic innovation*
- **Contribute**: Financial/social/cultural capital
- **Need**: High-leverage impact opportunities, transparent theory of change
- **Next Steps**: Connect with funding opportunities, join patron circles, schedule strategic calls

---

## Key Features

### 1. Intelligent Archetype Detection
- **8-12 question interactive quiz** blending structured selections and conversational AI
- **Multi-signal detection** based on:
  - Resource contribution preferences (time/skills/capital) — strongest signal
  - Participation mode (learning/building/organizing/funding)
  - Current engagement stage
  - Skills and background
- **Gemini AI validation** for accuracy and nuance detection
- **85%+ confidence** on archetype classification

### 2. Dynamic Knowledge Integration
- **Real-time Notion API integration** for resource recommendations
- Queries against:
  - 12+ Civic Sectors (governance, education, environment, etc.)
  - 7+ Innovation Domains (network governance, open protocols, etc.)
  - Patterns, Playbooks, Protocols from OpenCivics Commons
- **Relevance ranking** using AI to match resources to profile

### 3. Civic Identity Profile
- **Algorithmically generated shareable image** (periodic table aesthetic)
- Terminal-inspired retro-futurism design
- Shows archetype, confidence, top interests
- Optimized for social sharing (Twitter, LinkedIn, etc.)
- Drives awareness and network effects

### 4. Personalized Onboarding Summary
- **AI-generated 250-350 word summary** custom to each person
- Warm welcome reflecting their archetype
- 4-5 concrete next steps tailored to participation style
- Links to top 3 recommended resources
- Inspiring vision of the open civic movement

### 5. Extensible Architecture
- **Built for future features**:
  - Blueprint Composer (compose civic systems)
  - Learning Journeys (personalized curriculum)
  - Matchmaking (find collaborators)
  - Advanced Analytics (ecosystem mapping)

---

## Technical Stack

```
Frontend:   Next.js 14 (React, TypeScript, Tailwind CSS)
Backend:    Next.js API Routes (serverless on Vercel)
Database:   Supabase (PostgreSQL)
Knowledge:  Notion API (Commons repository)
AI:         Gemini 1.5 Pro & Flash (Google)
Images:     Canvas API (server-side generation)
Hosting:    Vercel (serverless, edge network)
```

**Why This Stack**:
- ✅ Serverless = zero ops overhead, infinite scale
- ✅ Supabase = fast, real-time, auth built-in
- ✅ Notion = familiar CMS for content team
- ✅ Gemini = cost-effective, powerful, Google ecosystem
- ✅ Vercel = best Next.js hosting, global CDN

---

## User Journey

```
┌─────────────────────────────────────────────────────────────┐
│  1. LANDING PAGE                                            │
│     "Discover your role in building open civic systems"    │
│                                                             │
│     [Begin Your Journey]                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. INTERACTIVE QUIZ (5-7 minutes)                         │
│     Terminal aesthetic, conversational UI                   │
│                                                             │
│     Questions about:                                        │
│     • What resources you can contribute                     │
│     • How you want to participate                           │
│     • Your civic interests                                  │
│     • Your skills and background                            │
│                                                             │
│     Progress: ██████████ 75%                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. PROFILE GENERATION (8-10 seconds)                      │
│     AI analyzing responses...                               │
│     Determining archetype...                                │
│     Searching knowledge commons...                          │
│     Generating civic identity...                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  4. RESULTS & PROFILE                                       │
│                                                             │
│     ┌────────────────────────────────┐                     │
│     │   [Civic Identity Card]        │                     │
│     │                                │                     │
│     │   ◼◼  IN                       │                     │
│     │   INNOVATOR                    │                     │
│     │                                │                     │
│     │   • Governance                 │                     │
│     │   • Digital Infrastructure     │                     │
│     │   • Open Protocols             │                     │
│     └────────────────────────────────┘                     │
│                                                             │
│     You're an Innovator — a systems builder who            │
│     experiments, prototypes, and pushes the field          │
│     forward...                                              │
│                                                             │
│     YOUR NEXT STEPS:                                        │
│     ▶ Join the Developer Channel                           │
│     ▶ Explore Protocol Documentation                       │
│     ▶ Apply for Labs Projects                              │
│     ▶ Connect with Other Builders                          │
│                                                             │
│     RECOMMENDED RESOURCES:                                  │
│     📚 Open Governance Protocol Pattern                    │
│     📚 Digital Public Infrastructure Playbook              │
│     📚 Modular Systems Design Guide                        │
│                                                             │
│     [Share Profile] [Subscribe] [Explore Resources]       │
└─────────────────────────────────────────────────────────────┘
```

---

## Success Metrics (3 Months Post-Launch)

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Quiz Completion Rate** | >70% | Industry standard for well-designed onboarding |
| **Archetype Confidence** | >85% avg | High accuracy needed for trust and value |
| **Self-Reported Accuracy** | >80% agree | Validates our detection algorithm |
| **Engagement Conversion** | >40% take action | Shows clear next steps work |
| **Social Sharing** | >20% share profile | Drives organic growth and awareness |
| **Resource Clicks** | >60% click ≥1 | Validates recommendation quality |
| **Return Visits** | >30% within week | Indicates sustained interest |

---

## Implementation Timeline

### Phase 1: MVP (4 weeks) — January 2026
**Deliverable**: Working web quiz with archetype detection

- Week 1: Foundation (Next.js, Supabase, Notion, Gemini setup)
- Week 2: Quiz engine (all question types, state management)
- Week 3: Archetype detection (scoring + AI validation)
- Week 4: Profile generation (image + summary + resources)

**Launch**: Internal beta with OpenCivics team

### Phase 2: Refinement (2 weeks) — February 2026
**Deliverable**: Polished experience with Notion integration

- Week 5: Notion integration (dynamic resources)
- Week 6: UX polish, question refinement, testing

**Launch**: Limited beta with OpenCivics Network (50 users)

### Phase 3: Extended Features (4 weeks) — March 2026
**Deliverable**: Chat interface, analytics, social features

- Week 7: Chat interface (conversational AI)
- Week 8: Social sharing, engagement tracking
- Week 9: Analytics dashboard, A/B testing
- Week 10: QA, load testing, public launch prep

**Launch**: Public launch to newsletter + social media

### Phase 4: Multi-Platform (4 weeks) — April 2026
**Deliverable**: Telegram and Twitter bots

- Weeks 11-12: Telegram bot
- Weeks 13-14: Twitter bot

**Launch**: Multi-platform availability

---

## Budget Estimate

### Development Costs
- **Engineering** (1 full-stack developer, 14 weeks): ~$35,000
- **Design** (UI/UX consultant, part-time): ~$5,000
- **Testing & QA**: ~$3,000
- **Total Development**: ~$43,000

### Operational Costs (Monthly)
- **Vercel Hosting** (Pro plan): $20/mo
- **Supabase** (Pro plan): $25/mo
- **Gemini API** (estimated 10k users/mo): ~$150/mo
- **Notion** (existing): $0 (included)
- **Total Monthly**: ~$195/mo

### First Year Total Cost
- Development: $43,000
- Operations (12 months): $2,340
- **Total Year 1**: ~$45,340

---

## Risk Assessment

### Technical Risks — LOW
- ✅ Proven stack (Next.js, Supabase, Gemini)
- ✅ Serverless architecture scales automatically
- ✅ Notion API stable and well-documented
- ⚠️ Gemini API costs could increase with scale → Mitigated with caching

### Product Risks — MEDIUM
- ⚠️ Archetype detection accuracy → Mitigated with extensive testing + AI validation
- ⚠️ Quiz completion rates → Mitigated with user testing + progress saving
- ⚠️ Resource relevance → Mitigated with AI ranking + feedback loops

### Organizational Risks — LOW
- ✅ Clear ownership (Product team)
- ✅ Defined success metrics
- ✅ Iterative development approach
- ✅ Beta testing before public launch

---

## Strategic Value

### 1. **Engagement Efficiency**
- Currently: Manual intake, generic onboarding, high drop-off
- With Assistant: Automated, personalized, 70%+ completion
- **Impact**: 3x more qualified participants engaged per hour of staff time

### 2. **Network Quality**
- Currently: Unclear participation pathways, misalignment
- With Assistant: Clear archetype-role matching, targeted engagement
- **Impact**: Higher retention, more meaningful contributions

### 3. **Scaling Mechanism**
- Currently: Onboarding doesn't scale (human-dependent)
- With Assistant: Fully automated, infinite scale
- **Impact**: Can handle 10k+ participants without additional staff

### 4. **Data & Insights**
- Currently: Limited data on participant interests/skills
- With Assistant: Rich profiles, interest mapping, skill inventory
- **Impact**: Better matchmaking, resource allocation, network analysis

### 5. **Brand Differentiation**
- Currently: Standard civic org website
- With Assistant: Cutting-edge AI + retro aesthetic = memorable
- **Impact**: Increased word-of-mouth, social sharing, media interest

---

## Future Roadmap (Post-Launch)

### Q2 2026: Intelligence Layer
- Advanced analytics dashboard
- Ecosystem mapping and network graphs
- Archetype distribution insights
- Geographic clustering

### Q3 2026: Collaboration Features
- Matchmaking engine (find collaborators)
- Project discovery (who's building what)
- Resource matching (patrons ↔ innovators)
- Bioregional networking

### Q4 2026: Learning Platform
- Personalized learning journeys
- Interactive curriculum by archetype
- Progress tracking and achievements
- Peer learning groups

### 2027: System Composer
- Blueprint composition tool
- Pattern library browser
- Drag-and-drop civic system design
- Implementation playbook generator
- Community feedback and ratings

---

## Why Now?

1. **AI Moment**: Gemini and LLMs make personalization at scale affordable and accurate
2. **Network Inflection Point**: OpenCivics gaining momentum — need onboarding to match growth
3. **Market Gap**: No civic orgs have intelligent onboarding — first-mover advantage
4. **Technical Maturity**: Stack is proven, risk is low, timeline is realistic
5. **Team Readiness**: Clear vision, aligned stakeholders, resources available

---

## Decision Framework

### ✅ Green Lights (Go)
- Clear problem and solution
- Proven technology stack
- Realistic budget and timeline
- Measurable success criteria
- Strong strategic value

### 🟡 Yellow Lights (Monitor)
- Archetype accuracy (will be validated in beta)
- User adoption (will be tested pre-launch)
- Resource quality (depends on Notion content)

### 🔴 Red Lights (None Currently)

**Recommendation**: **Proceed with Phase 1 implementation**

---

## Key Stakeholders

**Product Owner**: OpenCivics Product Team  
**Technical Lead**: Full-stack Developer (to be assigned)  
**Content Owner**: Commons Stewardship Team (Notion management)  
**Community Owner**: Network Coordination Team (beta testing, launch)

---

## Next Actions

1. **Approve Budget**: ~$45k for Year 1
2. **Assign Technical Lead**: Full-stack developer
3. **Kick-off Meeting**: Align on PRD, timeline, success metrics
4. **Week 1 Start**: Initialize project, set up infrastructure
5. **Weekly Check-ins**: Monitor progress, remove blockers

---

## Conclusion

The OpenCivics Intelligent Onboarding Assistant represents a strategic investment in scaling participation quality and quantity. With a proven technology stack, clear success metrics, and realistic timeline, this project de-risks growth while creating a memorable, differentiated experience that embodies OpenCivics' innovative spirit.

The combination of AI-powered personalization, beautiful design, and actionable guidance transforms passive curiosity into active participation — exactly what OpenCivics needs to grow its network of allies, innovators, organizers, and patrons.

**Status**: Ready for approval and implementation  
**Timeline**: 14 weeks to public launch  
**Investment**: ~$45k Year 1  
**Expected ROI**: 3x engagement efficiency, infinite scalability, network quality improvement

---

**Document Version**: 1.0  
**Date**: November 2025  
**Contact**: product@opencivics.co

---

## Appendix: Supporting Documents

- **Complete PRD**: `OpenCivics_Onboarding_Assistant_PRD_Complete.md`
- **Quick Start Guide**: `OpenCivics_Quick_Start_Guide.md`
- **Project Files**:
  - Conceptual Architecture
  - Civic Sectors data
  - Innovation Domains data
  - Full Framework documentation
