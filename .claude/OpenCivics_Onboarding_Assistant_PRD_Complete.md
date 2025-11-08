# OpenCivics Intelligent Onboarding Assistant
## Product Requirements Document v1.0

---

## Executive Summary

The OpenCivics Intelligent Onboarding Assistant is an AI-powered, multi-platform engagement tool designed to identify participant archetypes, map civic interests, and guide people through personalized pathways into the OpenCivics ecosystem. The system combines conversational AI, structured data collection, and dynamic knowledge retrieval to transform raw curiosity into informed, active participation.

**Core Purpose**: Convert passive interest into active engagement by intelligently matching people with their natural participation archetype and connecting them to relevant resources, opportunities, and communities.

**Platform Coverage**: Web portal (primary), Telegram bot, Twitter bot (future phases)

---

## 1. Product Vision & Goals

### 1.1 Vision Statement
Create an intelligent, empathetic onboarding experience that helps every person discover their unique role in building participatory, vital, and resilient civic systems — whether as a learner, builder, organizer, or funder.

### 1.2 Strategic Goals
1. **Archetype Identification**: Accurately classify participants into their primary archetype (Allies, Innovators, Organizers, Patrons) with 85%+ confidence
2. **Knowledge Connection**: Dynamically recommend relevant resources from OpenCivics Commons based on interests and archetype
3. **Engagement Activation**: Provide clear, actionable next steps tailored to each archetype
4. **Data Collection**: Build rich participant profiles for future personalization and community analytics
5. **Extensibility**: Design architecture to support future features (blueprint composition, learning journeys, matchmaking)

### 1.3 Success Metrics
- **Completion Rate**: >70% of quiz starters complete the full onboarding
- **Archetype Confidence**: >85% confidence scores on archetype assignments
- **Engagement Conversion**: >40% of completers take at least one suggested action (newsletter signup, event registration, etc.)
- **Social Sharing**: >20% share their civic identity profile image
- **Notion Resource Relevance**: >80% of recommended resources rated as relevant by users (future feedback loop)

---

## 2. User Personas & Archetypes

### 2.1 Participation Archetypes

#### Allies — The Fundamentals Layer
**Essence**: *Those who sense the call and want to orient.*

**Characteristics**:
- Curious learners exploring open civics
- Early supporters aligned with vision
- Cultural signal-boosters
- May be students, educators, neighbors, technologists
- Flexible participation rhythm (occasional to steady)

**What They Contribute**:
- Time for learning and exploration
- Stories and cultural diffusion
- Early feedback and reflections
- Seeds of community awareness

**What They Need**:
- Clear orientation and context
- Access to learning materials
- Sense of belonging
- Freedom to explore at own pace

**Detection Signals**:
- Primary resource to contribute: **Time for learning**
- Participation mode: **Learning & exploring**
- Interest in: **Understanding frameworks, attending intro events, consuming content**
- Stage: **New to civic innovation** or **Exploring alignment**

---

#### Innovators — The Systems Builders
**Essence**: *Those who experiment, prototype, and push the field forward.*

**Characteristics**:
- Technologists, designers, researchers, civic inventors
- Building tools, protocols, civic infrastructure
- Prototype-oriented, systems thinkers
- Contribute to technical commons
- Variable participation (part-time to full-time)

**What They Contribute**:
- Technical skills and expertise
- Open-source tools and frameworks
- Documentation and case studies
- Working prototypes

**What They Need**:
- Collaboration opportunities
- Technical interoperability standards
- Funding and visibility for projects
- Peer recognition

**Detection Signals**:
- Primary resource to contribute: **Skills, expertise, technical capacity**
- Participation mode: **Building & prototyping**
- Interest in: **Creating tools, writing code, designing systems, protocol development**
- Background: **Technology, design, research**
- Already building something or eager to start

---

#### Organizers — The Community Weavers
**Essence**: *Those who turn frameworks into lived practice.*

**Characteristics**:
- Facilitators, civic hosts, local leaders
- Implementing systems in place-based contexts
- Relationship weavers, cultural translators
- Bridge global learning to local action
- Cyclic participation tied to local rhythms

**What They Contribute**:
- Time for coordination and facilitation
- Local context and adaptation stories
- Community mobilization capacity
- Implementation feedback

**What They Need**:
- Tested frameworks and playbooks
- Facilitation training and tools
- Funding for local initiatives
- Peer support network

**Detection Signals**:
- Primary resource to contribute: **Time for organizing, convening, coordinating**
- Participation mode: **Connecting & organizing**
- Interest in: **Bringing people together, facilitation, local community work**
- Has: **Existing community relationships** or **local leadership role**
- Wants to: **Implement something locally**, **host gatherings**

---

#### Patrons — The Regenerative Stewards
**Essence**: *Those who resource the conditions for emergence.*

**Characteristics**:
- Philanthropists, funders, institutional allies
- Supporting civic infrastructure through capital
- Strategic, systems-level perspective
- Enable long-term sustainability
- Sustained participation through funding cycles

**What They Contribute**:
- Financial capital (grants, donations)
- Social capital (networks, connections)
- Cultural capital (legitimacy, advocacy)
- Strategic guidance

**What They Need**:
- High-leverage impact opportunities
- Transparent theory of change
- Portfolio alignment with regenerative values
- Community of practice with other funders

**Detection Signals**:
- Primary resource to contribute: **Financial resources, funding, capital**
- Participation mode: **Supporting & funding**
- Interest in: **Resource allocation, strategic funding, impact investment**
- Can provide: **Grants**, **donations**, **philanthropic connections**
- Role: **Funder, philanthropist, foundation staff, impact investor**

---

### 2.2 Consortium Role Mapping

Participants are also mapped to **OpenCivics Consortium roles** which represent their membership level:

| Consortium Role | Description | Typical Archetypes | Criteria |
|-----------------|-------------|-------------------|----------|
| **Ally** | Network member, learning and exploring | Allies | Casual engagement, early exploration |
| **Citizen** | Regular participant in assemblies/events | Any | Regular participation, engaged learner |
| **Contributor** | Active builder or organizer | Innovators, Organizers | Actively working on civic projects |
| **Patron** | Funding member | Patrons | Providing financial/capital resources |

**Mapping Logic**:
- Allies archetype → Ally role (default)
- Innovators archetype → Contributor role (if actively building)
- Organizers archetype → Contributor role (if actively organizing)
- Patrons archetype → Patron role (if providing funding)
- Any archetype can become Citizen role with regular engagement

---

## 3. Core User Flows

### 3.1 Primary Onboarding Flow

```
Landing Page
    ↓
Welcome Screen (Terminal aesthetic, OpenCivics logo)
    ↓
Mode Selection:
    → General Chat (explore freely)
    → Take the Quiz (structured onboarding) ← PRIMARY PATH
    ↓
Interactive Quiz (8-12 questions)
    - Mix of structured selections + conversational inputs
    - Beautiful inline UI (terminal theme)
    - Progress indicator
    - Adaptive question flow based on responses
    ↓
Processing Stage (AI analysis)
    - Gemini analyzes responses
    - Determines archetype + confidence
    - Queries Notion for relevant resources
    - Generates civic identity profile
    ↓
Results Page
    ├─ Civic Identity Profile (shareable image)
    ├─ Archetype Explanation
    ├─ Interest Summary
    ├─ Personalized Next Steps
    └─ Recommended Resources from Notion
    ↓
Engagement Actions
    ├─ Subscribe to Newsletter
    ├─ Join Calendar/Events
    ├─ Apply for Consortium Membership
    ├─ Explore Recommended Resources
    └─ Share Profile on Social Media
```

### 3.2 Future Flows (Post-Onboarding)

**Resource Discovery**:
```
User asks question → Context-aware search → Notion knowledge retrieval → Formatted response
```

**Blueprint Composition** (Phase 2):
```
Describe need → AI suggests relevant patterns → User selects → Compose blueprint → Export
```

**Learning Journey** (Phase 3):
```
Profile → Custom curriculum → Interactive lessons → Progress tracking
```

---

## 4. Quiz Architecture

### 4.1 Quiz Design Philosophy

The quiz must:
- **Feel conversational**, not clinical
- **Mix structured data** (selects, multi-selects) with **natural language** (text, conversation)
- **Reveal archetype through resource contribution preferences** (time, skills, capital)
- **Map interests** to civic sectors and innovation domains
- **Be adaptive** - questions can be conditional on prior responses
- **Be brief** - 8-12 questions, 5-7 minutes to complete
- **Generate high-quality structured data** for database storage

### 4.2 Question Framework

Each question should serve at least one purpose:
1. **Archetype Detection** - Helps determine Ally/Innovator/Organizer/Patron
2. **Interest Mapping** - Maps to civic sectors or innovation domains
3. **Engagement Planning** - Informs personalized next steps
4. **Profile Enrichment** - Adds context for future personalization

### 4.3 Improved Quiz Questions

#### **Section 1: Introduction & Context**

**Q1: Welcome & Name**
```yaml
id: intro_welcome
type: conversation
text: "Welcome to OpenCivics! Before we begin, what should we call you?"
purpose: profile_enrichment
required: false
archetype_signals: none
```

**Q2: Motivation & Discovery**
```yaml
id: intro_motivation
type: conversation
text: "What brings you to OpenCivics today? What are you hoping to explore or achieve?"
purpose: archetype_detection, engagement_planning
required: true
archetype_signals:
  - "learn" → allies
  - "understand" → allies
  - "build" → innovators
  - "create" → innovators
  - "organize" → organizers
  - "bring together" → organizers
  - "fund" → patrons
  - "support" → patrons
```

---

#### **Section 2: Archetype Detection (Resource Contribution)**

**Q3: Primary Resource Contribution** 🎯 **CRITICAL ARCHETYPE SIGNAL**
```yaml
id: resource_contribution_primary
type: single_select
text: "If you were to get involved with OpenCivics, what resource would you most naturally contribute?"
purpose: archetype_detection (PRIMARY)
required: true
options:
  - value: time_learning
    label: "Time to learn and explore civic innovation"
    archetype: allies
    weight: 1.0
  
  - value: time_organizing
    label: "Time to coordinate, facilitate, and bring people together"
    archetype: organizers
    weight: 1.0
  
  - value: skills_building
    label: "Skills and expertise to build tools, systems, or infrastructure"
    archetype: innovators
    weight: 1.0
  
  - value: capital_funding
    label: "Financial resources to fund civic innovation and infrastructure"
    archetype: patrons
    weight: 1.0
  
  - value: hybrid_multiple
    label: "A combination of the above"
    archetype: null
    weight: 0.0
    note: "Triggers follow-up multi-select question"
```

**Q3b: Multiple Resource Contributions** (Conditional on Q3 = hybrid)
```yaml
id: resource_contribution_multiple
type: multi_select
text: "Which of these resources can you contribute? (Select all that apply)"
purpose: archetype_detection
required: true
show_if: resource_contribution_primary == 'hybrid_multiple'
validation:
  min_selections: 2
  max_selections: 4
options:
  - value: time_learning
    label: "Time to learn and explore"
    archetype: allies
    weight: 0.7
  
  - value: time_organizing
    label: "Time to organize and facilitate"
    archetype: organizers
    weight: 0.7
  
  - value: skills_technical
    label: "Technical skills (coding, design, etc.)"
    archetype: innovators
    weight: 0.7
  
  - value: skills_facilitation
    label: "Facilitation and coordination skills"
    archetype: organizers
    weight: 0.5
  
  - value: capital_funding
    label: "Financial resources"
    archetype: patrons
    weight: 0.7
  
  - value: networks
    label: "Networks and connections"
    archetype: patrons
    weight: 0.4
```

---

**Q4: Participation Mode** 🎯 **SECONDARY ARCHETYPE SIGNAL**
```yaml
id: participation_mode
type: single_select
text: "How do you see yourself participating in open civic innovation?"
purpose: archetype_detection
required: true
options:
  - value: learning
    label: "Learning & exploring — I want to understand these ideas and frameworks"
    archetype: allies
    weight: 1.0
  
  - value: building
    label: "Building & prototyping — I want to create tools, systems, or protocols"
    archetype: innovators
    weight: 1.0
  
  - value: organizing
    label: "Organizing & weaving — I want to facilitate, coordinate, and bring people together"
    archetype: organizers
    weight: 1.0
  
  - value: funding
    label: "Funding & resourcing — I want to support civic innovation through capital"
    archetype: patrons
    weight: 1.0
  
  - value: exploring
    label: "Still exploring — I'm not sure yet"
    archetype: allies
    weight: 0.8
```

---

**Q5: Current Engagement Stage**
```yaml
id: engagement_stage
type: single_select
text: "Where are you in your civic innovation journey?"
purpose: archetype_detection, engagement_planning
required: true
options:
  - value: new_curious
    label: "Brand new — Just discovered open civics and curious to learn more"
    archetype_signal: allies (0.6)
  
  - value: learning_exploring
    label: "Learning — Actively exploring frameworks and trying to understand the landscape"
    archetype_signal: allies (0.8)
  
  - value: building_something
    label: "Building — Already working on a civic project, tool, or system"
    archetype_signal: innovators (0.9)
  
  - value: organizing_locally
    label: "Organizing — Leading or facilitating civic work in my community"
    archetype_signal: organizers (0.9)
  
  - value: funding_supporting
    label: "Funding — Looking to support civic innovation with resources"
    archetype_signal: patrons (0.9)
  
  - value: experienced_looking
    label: "Experienced — I've been doing this work and looking for collaboration opportunities"
    archetype_signal: null (requires Q3/Q4 to determine)
```

---

#### **Section 3: Interest Mapping**

**Q6: Civic Sectors of Interest**
```yaml
id: civic_sectors
type: multi_select
text: "Which civic sectors are you most interested in? (Select 1-5)"
purpose: interest_mapping
required: true
validation:
  min_selections: 1
  max_selections: 5
options:
  # From Civic Sectors CSV
  - value: governance
    label: "Governance & Political Systems"
    description: "Decision-making, policy, participatory governance"
  
  - value: civic_engagement
    label: "Civic Engagement & Participation"
    description: "Assemblies, dialogue, collective action"
  
  - value: justice
    label: "Justice & Legal Systems"
    description: "Fairness, accountability, restorative justice"
  
  - value: education
    label: "Educational & Learning Systems"
    description: "Lifelong learning, civic literacy, open knowledge"
  
  - value: environment
    label: "Environmental & Sustainability"
    description: "Regeneration, ecosystems, biodiversity, stewardship"
  
  - value: economy
    label: "Economic & Resource Sharing"
    description: "Cooperation, mutual aid, shared wealth"
  
  - value: health
    label: "Health & Well-Being"
    description: "Physical, mental, social health and care"
  
  - value: transportation
    label: "Transportation & Mobility"
    description: "Equitable, sustainable movement systems"
  
  - value: culture
    label: "Cultural & Creative Systems"
    description: "Art, storytelling, ritual, shared meaning"
  
  - value: security
    label: "Security & Safety"
    description: "Care, preparedness, mutual responsibility"
  
  - value: technology
    label: "Digital & Technological Systems"
    description: "Ethical tech, digital infrastructure"
  
  - value: media
    label: "Information & Media Systems"
    description: "Open journalism, collective sensemaking"
```

---

**Q7: Innovation Approaches** (Conditional - only for Innovators/Organizers)
```yaml
id: innovation_domains
type: multi_select
text: "Which innovation approaches resonate with you? (Select up to 3)"
purpose: interest_mapping
required: false
show_if: |
  (resource_contribution_primary IN ['skills_building', 'time_organizing']) OR
  (participation_mode IN ['building', 'organizing'])
validation:
  min_selections: 1
  max_selections: 3
options:
  # From Innovation Domains CSV
  - value: network_governance
    label: "Network Governance"
    description: "Decentralized coordination through shared principles"
  
  - value: bioregional
    label: "Bioregional Coordination"
    description: "Place-based governance aligned with ecosystems"
  
  - value: open_protocols
    label: "Open Protocols"
    description: "Shared standards for interoperability"
  
  - value: digital_infrastructure
    label: "Digital Public Infrastructure"
    description: "Commons-based digital systems (identity, data, payments)"
  
  - value: knowledge_commoning
    label: "Knowledge Commoning"
    description: "Collective stewardship of information and research"
  
  - value: capital_allocation
    label: "Capital Allocation"
    description: "Redesigning value flows for regeneration"
  
  - value: collective_intelligence
    label: "Collective Intelligence"
    description: "Group thinking, learning, and decision-making"
```

---

#### **Section 4: Skills & Capacity**

**Q8: Specific Skills** (Conditional - for Innovators/Organizers)
```yaml
id: specific_skills
type: multi_select
text: "What specific skills or expertise do you bring?"
purpose: profile_enrichment, matching
required: false
show_if: |
  (archetype_signals suggest innovators OR organizers) OR
  (resource_contribution includes skills OR time_organizing)
options:
  # Technical skills (Innovators)
  - value: software_dev
    label: "Software Development"
    category: technical
  
  - value: systems_design
    label: "Systems & Protocol Design"
    category: technical
  
  - value: data_research
    label: "Data Science & Research"
    category: technical
  
  - value: ux_design
    label: "UX/UI Design"
    category: technical
  
  - value: product_management
    label: "Product Management"
    category: technical
  
  # Organizing skills (Organizers)
  - value: facilitation
    label: "Facilitation & Group Process"
    category: organizing
  
  - value: community_building
    label: "Community Organizing"
    category: organizing
  
  - value: event_coordination
    label: "Event Planning & Coordination"
    category: organizing
  
  - value: participatory_governance
    label: "Participatory Governance"
    category: organizing
  
  # Cross-cutting skills
  - value: writing_comms
    label: "Writing & Communication"
    category: cross_cutting
  
  - value: teaching
    label: "Teaching & Education"
    category: cross_cutting
  
  - value: legal_policy
    label: "Legal & Policy"
    category: cross_cutting
  
  - value: finance_ops
    label: "Finance & Operations"
    category: cross_cutting
  
  - value: other
    label: "Other (tell us more!)"
    category: cross_cutting
```

---

**Q9: Time Commitment**
```yaml
id: time_commitment
type: single_select
text: "How much time can you dedicate to civic innovation?"
purpose: engagement_planning, matching
required: true
options:
  - value: casual
    label: "Casual — A few hours per month"
    description: "Occasional learning, events, and exploration"
    consortium_role_signal: ally
  
  - value: regular
    label: "Regular — A few hours per week"
    description: "Consistent participation in projects or organizing"
    consortium_role_signal: citizen
  
  - value: dedicated
    label: "Dedicated — Multiple hours per week"
    description: "Deep engagement in building, organizing, or supporting"
    consortium_role_signal: contributor
  
  - value: full_time
    label: "Full-time — This is (or could be) my primary work"
    description: "Professional or near-professional involvement"
    consortium_role_signal: contributor
```

---

#### **Section 5: Context & Connection**

**Q10: Geographic Context**
```yaml
id: location
type: text
text: "Where are you located? (City, Region, or 'Prefer not to say')"
purpose: profile_enrichment, matching
required: false
note: "Helps connect you with local organizers and bioregional initiatives"
```

---

**Q11: Experience & Background**
```yaml
id: experience_background
type: conversation
text: "Tell us briefly about your background or experience with civic organizing, community work, or systems innovation. (Optional but helps us understand you better!)"
purpose: profile_enrichment, archetype_validation
required: false
note: "LLM will analyze for additional archetype signals and context"
```

---

**Q12: What You're Working On** (Conditional - for Innovators/Organizers/Patrons)
```yaml
id: current_work
type: conversation
text: "Are you currently working on any civic projects, initiatives, or funding strategies? Tell us about it!"
purpose: profile_enrichment, matching
required: false
show_if: |
  archetype_signals suggest (innovators OR organizers OR patrons) AND
  engagement_stage IN ['building_something', 'organizing_locally', 'funding_supporting', 'experienced_looking']
note: "Helps connect you with collaborators and relevant resources"
```

---

### 4.4 Archetype Detection Algorithm

**Weighted Scoring System**:

Each response contributes weighted scores to each archetype:

```python
# Pseudocode
archetype_scores = {
    'allies': 0.0,
    'innovators': 0.0,
    'organizers': 0.0,
    'patrons': 0.0
}

# Q3 (Primary Resource) has weight 1.0
# Q4 (Participation Mode) has weight 1.0
# Q5 (Engagement Stage) has weight 0.6-0.9 depending on option
# Q8 (Skills) has weight 0.3-0.5 depending on category match
# Q9 (Time Commitment) has weight 0.2
# Q11 (Background) - LLM analyzed for signals, weight 0.3

# Calculate raw scores
for question_response in responses:
    for archetype, weight in question_response.archetype_weights.items():
        archetype_scores[archetype] += weight

# Normalize to get confidence scores (0-1)
total_weight = sum(archetype_scores.values())
if total_weight > 0:
    archetype_confidence = {
        arch: score / total_weight 
        for arch, score in archetype_scores.items()
    }

# Determine primary archetype
primary_archetype = max(archetype_confidence, key=archetype_confidence.get)
primary_confidence = archetype_confidence[primary_archetype]

# Determine secondary if score > 0.2
secondary_archetypes = [
    arch for arch, conf in archetype_confidence.items() 
    if conf > 0.2 and arch != primary_archetype
]
```

**LLM Validation Layer**:

After algorithmic scoring, use Gemini to validate and refine:

```python
# Send to Gemini for validation
gemini_prompt = f"""
You are an expert civic engagement analyst for OpenCivics.

Based on these quiz responses, validate and refine the archetype classification.

Algorithmic Classification:
- Primary: {primary_archetype} ({primary_confidence:.2f})
- Secondary: {secondary_archetypes}

Full Responses:
{json.dumps(all_responses, indent=2)}

OpenCivics Archetypes:
- Allies: Learners, curious explorers, time for learning
- Innovators: Builders, technical skills, creating systems
- Organizers: Facilitators, time for coordination, local action
- Patrons: Funders, financial/social capital, resourcing

Analyze and respond in JSON:
{{
  "validated_archetype": "allies|innovators|organizers|patrons",
  "confidence": 0.0-1.0,
  "secondary_archetype": "...|null",
  "reasoning": "Brief explanation of classification",
  "archetype_mix": {{
    "allies": 0.0-1.0,
    "innovators": 0.0-1.0,
    "organizers": 0.0-1.0,
    "patrons": 0.0-1.0
  }},
  "consortium_role_suggestion": "ally|citizen|contributor|patron",
  "key_interests": ["interest1", "interest2", ...],
  "engagement_recommendations": ["action1", "action2", ...]
}}
"""
```

**Confidence Thresholds**:
- **High confidence**: ≥0.75 - Clear archetype
- **Medium confidence**: 0.60-0.74 - Likely archetype with some ambiguity
- **Low confidence**: <0.60 - Hybrid or needs more data

---

## 5. Technical Architecture

### 5.1 System Components

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Next.js 14+ (App Router)                                   │
│  - Web Portal (primary)                                     │
│  - Terminal aesthetic UI                                    │
│  - Real-time quiz interface                                 │
│  - Profile image display & sharing                          │
│  - Telegram bot integration (phase 2)                       │
│  - Twitter bot integration (phase 3)                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      API / Backend Layer                     │
├─────────────────────────────────────────────────────────────┤
│  Next.js API Routes (Serverless on Vercel)                  │
│  - /api/quiz/start                                          │
│  - /api/quiz/response                                       │
│  - /api/quiz/complete                                       │
│  - /api/resources/recommend                                 │
│  - /api/chat                                                │
│  - /api/profile/image                                       │
│  - /api/webhooks/[platform]                                 │
└─────────────────────────────────────────────────────────────┘
            ↓                    ↓                    ↓
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Supabase       │  │   Notion API     │  │   Gemini API     │
│   (PostgreSQL)   │  │   (Knowledge)    │  │   (LLM)          │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ - profiles       │  │ - Civic Sectors  │  │ - Archetype      │
│ - quiz_responses │  │ - Innovation     │  │   analysis       │
│ - interests      │  │   Domains        │  │ - Resource       │
│ - resources      │  │ - Patterns       │  │   generation     │
│ - conversations  │  │ - Playbooks      │  │ - Conversation   │
│ - Auth           │  │ - Protocols      │  │ - Summarization  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

### 5.2 Database Schema (Supabase)

```sql
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
  primary_archetype TEXT NOT NULL, -- allies, innovators, organizers, patrons
  primary_confidence NUMERIC(3,2), -- 0.00-1.00
  secondary_archetype TEXT,
  archetype_reasoning TEXT,
  
  -- Consortium role
  consortium_role TEXT, -- ally, citizen, contributor, patron
  
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
  time_commitment TEXT, -- casual, regular, dedicated, full_time
  
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
  message_role TEXT NOT NULL, -- user, assistant, system
  message_content TEXT NOT NULL,
  
  -- Context
  conversation_type TEXT, -- quiz, general, resource_query, blueprint_composition
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

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Similar policies for other tables...
```

### 5.3 Notion Integration Schema

**Expected Notion Database Structure**:

**Civic Sectors Database**:
- Properties: Name (title), Description (text)
- Source: `/mnt/project/Civic_Sectors_29b06d2570f280deabadc4f7031f0564_all.csv`

**Innovation Domains Database**:
- Properties: Title (title), Description (text), Thumbnail (file)
- Source: `/mnt/project/Open_Civic_Innovation_Domains_29806d2570f280ac9ba8d37aadb23610_all.csv`

**Resources Database** (Patterns, Playbooks, Protocols):
- Properties:
  - Title (title)
  - Type (select: Pattern, Playbook, Protocol, Civic Stack, Primitive)
  - Description (text)
  - Civic Sectors (multi-select)
  - Innovation Domains (multi-select)
  - Tags (multi-select)
  - Archetype Relevance (multi-select: Allies, Innovators, Organizers, Patrons)
  - URL (url)
  - Status (select: Draft, Published, Archived)

**API Integration**:
```typescript
// lib/notion/client.ts
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Database IDs (from environment)
const DATABASES = {
  CIVIC_SECTORS: process.env.NOTION_CIVIC_SECTORS_DB!,
  INNOVATION_DOMAINS: process.env.NOTION_INNOVATION_DOMAINS_DB!,
  RESOURCES: process.env.NOTION_RESOURCES_DB!,
};

export async function searchResources(params: {
  civicSectors?: string[];
  innovationDomains?: string[];
  archetypes?: string[];
  resourceTypes?: string[];
  limit?: number;
}) {
  const { civicSectors, innovationDomains, archetypes, resourceTypes, limit = 10 } = params;
  
  // Build Notion filter
  const filters: any[] = [];
  
  if (civicSectors?.length) {
    filters.push({
      or: civicSectors.map(sector => ({
        property: 'Civic Sectors',
        multi_select: { contains: sector }
      }))
    });
  }
  
  if (innovationDomains?.length) {
    filters.push({
      or: innovationDomains.map(domain => ({
        property: 'Innovation Domains',
        multi_select: { contains: domain }
      }))
    });
  }
  
  if (archetypes?.length) {
    filters.push({
      or: archetypes.map(arch => ({
        property: 'Archetype Relevance',
        multi_select: { contains: arch }
      }))
    });
  }
  
  if (resourceTypes?.length) {
    filters.push({
      or: resourceTypes.map(type => ({
        property: 'Type',
        select: { equals# OpenCivics Intelligent Onboarding Assistant - PRD (Continued)
## Part 2: Technical Implementation & Specifications

---

## 5.3 Notion Integration (Continued)

```typescript
// lib/notion/client.ts (continued)

  if (resourceTypes?.length) {
    filters.push({
      or: resourceTypes.map(type => ({
        property: 'Type',
        select: { equals: type }
      }))
    });
  }
  
  // Only published resources
  filters.push({
    property: 'Status',
    select: { equals: 'Published' }
  });
  
  const response = await notion.databases.query({
    database_id: DATABASES.RESOURCES,
    filter: filters.length > 0 ? { and: filters } : undefined,
    page_size: limit,
    sorts: [
      { property: 'Title', direction: 'ascending' }
    ]
  });
  
  return response.results.map(page => parseResourcePage(page));
}

function parseResourcePage(page: any) {
  return {
    id: page.id,
    title: getProperty(page, 'Title', 'title'),
    description: getProperty(page, 'Description', 'rich_text'),
    type: getProperty(page, 'Type', 'select'),
    civicSectors: getProperty(page, 'Civic Sectors', 'multi_select'),
    innovationDomains: getProperty(page, 'Innovation Domains', 'multi_select'),
    archetypeRelevance: getProperty(page, 'Archetype Relevance', 'multi_select'),
    url: page.url,
  };
}
```

---

### 5.4 Gemini LLM Integration

**Core LLM Functions**:

**1. Archetype Analysis & Validation**
```typescript
// lib/gemini/archetype-analyzer.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeArchetype(responses: QuizResponse[]) {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-pro',
    generationConfig: {
      temperature: 0.3, // Lower temperature for consistency
      topP: 0.8,
    }
  });
  
  const prompt = `You are an expert civic engagement analyst for OpenCivics.

Your task is to analyze quiz responses and validate the participant's archetype classification.

# OpenCivics Archetypes

1. **Allies** — The Fundamentals Layer
   - Who: Curious learners, early supporters, aligned with vision
   - Contribute: Time for learning, cultural signal-boosting, stories
   - Signals: Wants to explore, understand, learn; new to civic innovation

2. **Innovators** — The Systems Builders
   - Who: Technologists, designers, researchers building civic tools
   - Contribute: Technical skills, expertise, systems/protocols
   - Signals: Building things, creating tools, prototyping; has technical skills

3. **Organizers** — The Community Weavers
   - Who: Facilitators, civic hosts, local leaders
   - Contribute: Time for coordination, facilitation capacity
   - Signals: Bringing people together, organizing locally, facilitating

4. **Patrons** — The Regenerative Stewards
   - Who: Funders, philanthropists, institutional allies
   - Contribute: Financial capital, social capital, cultural capital
   - Signals: Providing resources, funding, supporting with capital

# Quiz Responses
${JSON.stringify(responses, null, 2)}

# Algorithmic Pre-Classification
${algorithmicScores ? JSON.stringify(algorithmicScores, null, 2) : 'Not provided'}

# Your Task
Analyze these responses and provide a validated archetype classification.

Consider:
- What resources can they contribute? (Time/Skills/Capital is strongest signal)
- How do they describe their participation mode?
- What's their current engagement stage?
- What's their background and experience?
- Are there any contradictions or nuances?

Respond in valid JSON format only:
{
  "validated_archetype": "allies|innovators|organizers|patrons",
  "confidence": 0.85,
  "secondary_archetype": "allies|innovators|organizers|patrons|null",
  "reasoning": "Clear 2-3 sentence explanation of classification",
  "archetype_breakdown": {
    "allies": 0.15,
    "innovators": 0.10,
    "organizers": 0.05,
    "patrons": 0.70
  },
  "consortium_role_suggestion": "ally|citizen|contributor|patron",
  "key_characteristics": ["characteristic 1", "characteristic 2"],
  "engagement_strengths": ["strength 1", "strength 2"],
  "recommended_next_steps": ["action 1", "action 2", "action 3"]
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  // Clean potential markdown formatting
  const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  return JSON.parse(jsonText);
}
```

**2. Onboarding Summary Generation**
```typescript
// lib/gemini/summary-generator.ts
export async function generateOnboardingSummary(
  profile: Profile,
  analysis: ArchetypeAnalysis,
  recommendedResources: Resource[]
) {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash' // Faster for generation
  });
  
  const archetypeDescriptions = {
    allies: "You're an Ally — someone who senses the call and wants to orient. You form part of the global field of resonance around open civic innovation.",
    innovators: "You're an Innovator — a systems builder who experiments, prototypes, and pushes the field forward through technical and conceptual work.",
    organizers: "You're an Organizer — a community weaver who turns frameworks into lived practice, facilitating civic imagination at the community level.",
    patrons: "You're a Patron — a regenerative steward who resources the conditions for emergence, enabling long-term civic ecosystem sustainability."
  };
  
  const prompt = `You are writing a warm, inspiring welcome message for a new OpenCivics participant.

# Participant Profile
- Name: ${profile.name || 'Friend'}
- Archetype: ${analysis.validated_archetype}
- Confidence: ${(analysis.confidence * 100).toFixed(0)}%
- Interests: ${profile.civic_sectors.join(', ')}
- Time commitment: ${profile.time_commitment}

# Archetype Description
${archetypeDescriptions[analysis.validated_archetype]}

# Recommended Resources (Top 3)
${recommendedResources.slice(0, 3).map((r, i) => `${i+1}. ${r.title} - ${r.description}`).join('\n')}

# Your Task
Write a personalized onboarding summary that:

1. **Opens warmly** - Welcome them by name (if provided)
2. **Reflects their archetype** - Acknowledge their unique role and gifts
3. **Acknowledges their interests** - Mention 2-3 of their civic sector interests
4. **Provides 4-5 concrete next steps** tailored to their archetype:
   - For Allies: Subscribe to newsletter, explore frameworks, join intro calls, connect with learning resources
   - For Innovators: Join developer channels, explore protocols, apply for Labs projects, connect with other builders
   - For Organizers: Join organizer network, access facilitation resources, apply for implementation support, connect with local groups
   - For Patrons: Connect with funding opportunities, join patron circles, explore portfolio alignment, schedule strategic calls
5. **Links to resources** - Mention the specific recommended resources
6. **Ends with vision** - Brief inspiring statement about the open civic movement

**Requirements**:
- 250-350 words
- Warm, conversational, but professional tone
- Use "you" (second person)
- Concrete and actionable
- Authentic and inspiring, not generic

Write the summary now:`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

**3. Conversational Chat Handler**
```typescript
// lib/gemini/chat-handler.ts
export async function handleChatMessage(
  message: string,
  profile: Profile | null,
  conversationHistory: Message[],
  notionContext?: string[]
) {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash'
  });
  
  const systemPrompt = `You are the OpenCivics AI assistant — a knowledgeable, warm guide helping people explore open civic innovation.

# Your Role
- Help people understand OpenCivics concepts, archetypes, and frameworks
- Answer questions about civic sectors, innovation domains, and participation
- Guide people to relevant resources in the OpenCivics Commons (Notion)
- Be encouraging and empowering, not prescriptive
- Use concrete examples when explaining concepts

# User Context
${profile ? `
- Name: ${profile.name}
- Archetype: ${profile.primary_archetype}
- Interests: ${profile.civic_sectors?.join(', ')}
` : 'New visitor, no profile yet'}

# Conversation Style
- Conversational and friendly, not robotic
- Concise but thorough (2-4 paragraphs usually)
- Use bullet points for lists/steps
- Offer to dive deeper if user wants more detail
- Suggest relevant resources when appropriate

${notionContext ? `
# Relevant Resources from Notion
${notionContext.join('\n\n')}
` : ''}

# Guidelines
- If asked about specific resources, search Notion and reference them
- If asked about participation, guide based on their archetype (if known)
- If asked about complex topics, break them down clearly
- Always be helpful and empowering

Now respond to the user's message.`;

  const messages = [
    { role: 'system', parts: [{ text: systemPrompt }] },
    ...conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })),
    { role: 'user', parts: [{ text: message }] }
  ];
  
  const chat = model.startChat({ history: messages.slice(0, -1) });
  const result = await chat.sendMessage(message);
  
  return result.response.text();
}
```

**4. Resource Recommendation Engine**
```typescript
// lib/gemini/resource-recommender.ts
export async function rankResourceRelevance(
  profile: Profile,
  resources: NotionResource[]
): Promise<ResourceRecommendation[]> {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash'
  });
  
  const prompt = `You are recommending OpenCivics resources to a participant.

# Participant Profile
- Archetype: ${profile.primary_archetype}
- Civic Sectors: ${profile.civic_sectors.join(', ')}
- Innovation Domains: ${profile.innovation_domains?.join(', ')}
- Skills: ${profile.skills?.join(', ')}
- Current stage: ${profile.engagement_stage}

# Available Resources
${resources.map((r, i) => `
${i + 1}. ${r.title}
   Type: ${r.type}
   Description: ${r.description}
   Sectors: ${r.civicSectors?.join(', ')}
   Domains: ${r.innovationDomains?.join(', ')}
   Archetype fit: ${r.archetypeRelevance?.join(', ')}
`).join('\n')}

# Your Task
For each resource, provide:
1. Relevance score (0.0-1.0) - how relevant is this for this participant?
2. Brief reason (1 sentence) - why is this relevant?

Consider:
- Does their archetype match the resource's archetype relevance?
- Do their civic sector interests align?
- Is it appropriate for their engagement stage?
- Will it help them take meaningful next steps?

Respond in JSON format:
{
  "recommendations": [
    {
      "resource_index": 1,
      "relevance_score": 0.95,
      "reason": "Direct match to their interests and archetype"
    },
    ...
  ]
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const parsed = JSON.parse(jsonText);
  
  return parsed.recommendations.map((rec: any) => ({
    ...resources[rec.resource_index - 1],
    relevance_score: rec.relevance_score,
    recommendation_reason: rec.reason
  }));
}
```

---

### 5.5 Profile Image Generation

**Algorithmic Civic Identity Card**:

```typescript
// lib/image/profile-generator.ts
import { createCanvas, registerFont, loadImage } from 'canvas';

export async function generateCivicIdentityImage(profile: {
  name?: string;
  archetype: string;
  civicSectors: string[];
  innovationDomains?: string[];
  confidence: number;
}) {
  const width = 1200;
  const height = 630; // OG image standard
  
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // === Background ===
  // Dark terminal background with gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#0a0e1a');
  gradient.addColorStop(1, '#141b2d');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // === Grid Pattern ===
  ctx.strokeStyle = 'rgba(100, 255, 218, 0.05)';
  ctx.lineWidth = 1;
  
  const gridSize = 40;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  // === Periodic Table Style Element ===
  const elementSize = 220;
  const elementX = 70;
  const elementY = 140;
  
  const archetypeColors = {
    allies: '#64ffda',      // Teal
    innovators: '#c792ea',  // Purple
    organizers: '#ffcb6b',  // Yellow
    patrons: '#f07178',     // Red/Pink
  };
  
  const color = archetypeColors[profile.archetype as keyof typeof archetypeColors] || '#64ffda';
  
  // Outer glow
  ctx.shadowColor = color;
  ctx.shadowBlur = 30;
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.strokeRect(elementX, elementY, elementSize, elementSize);
  ctx.shadowBlur = 0;
  
  // Inner subtle grid
  ctx.strokeStyle = `${color}33`;
  ctx.lineWidth = 1;
  ctx.strokeRect(elementX + 10, elementY + 10, elementSize - 20, elementSize - 20);
  
  // "Atomic number" (confidence %)
  ctx.fillStyle = color;
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(Math.round(profile.confidence * 100).toString(), elementX + 20, elementY + 40);
  
  // Archetype symbol (first 2 letters, huge)
  ctx.font = 'bold 110px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const symbol = profile.archetype.substring(0, 2).toUpperCase();
  ctx.fillText(symbol, elementX + elementSize / 2, elementY + elementSize / 2 + 10);
  
  // Archetype name (below element)
  ctx.font = 'bold 26px monospace';
  ctx.fillText(
    profile.archetype.toUpperCase(),
    elementX + elementSize / 2,
    elementY + elementSize + 50
  );
  
  // === Interest Tags (Right Side) ===
  const tagX = elementX + elementSize + 70;
  let tagY = elementY;
  
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'left';
  
  // Title
  ctx.fillStyle = '#8892b0';
  ctx.fillText('CIVIC INTERESTS', tagX, tagY - 20);
  
  // Display top 5 interests
  const displayInterests = profile.civicSectors.slice(0, 5);
  
  displayInterests.forEach((interest, idx) => {
    const y = tagY + (idx * 55);
    
    // Tag background (subtle)
    ctx.fillStyle = 'rgba(26, 35, 50, 0.6)';
    const tagWidth = Math.min(360, ctx.measureText(interest).width + 30);
    ctx.fillRect(tagX, y, tagWidth, 40);
    
    // Tag border
    ctx.strokeStyle = 'rgba(100, 255, 218, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(tagX, y, tagWidth, 40);
    
    // Tag text
    ctx.fillStyle = '#64ffda';
    ctx.fillText(
      interest.length > 30 ? interest.substring(0, 27) + '...' : interest,
      tagX + 15,
      y + 25
    );
  });
  
  // Innovation domains (if any)
  if (profile.innovationDomains && profile.innovationDomains.length > 0) {
    const domainsY = tagY + (displayInterests.length * 55) + 30;
    
    ctx.fillStyle = '#8892b0';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('INNOVATION FOCUS', tagX, domainsY);
    
    ctx.font = '14px monospace';
    ctx.fillStyle = '#c792ea';
    const domainsText = profile.innovationDomains.slice(0, 2).join(' • ');
    ctx.fillText(domainsText, tagX, domainsY + 25);
  }
  
  // === User Name (Top) ===
  if (profile.name) {
    ctx.font = 'bold 40px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(profile.name, 70, 80);
  }
  
  // === OpenCivics Branding (Bottom) ===
  ctx.font = 'bold 28px monospace';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText('● OPENCIVICS', width / 2, height - 70);
  
  ctx.font = '16px monospace';
  ctx.fillStyle = '#8892b0';
  ctx.fillText(
    `Civic Identity Profile • ${new Date().getFullYear()}`,
    width / 2,
    height - 35
  );
  
  // === Decorative Elements ===
  // Corner accents
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  
  // Top left corner
  ctx.beginPath();
  ctx.moveTo(30, 80);
  ctx.lineTo(30, 30);
  ctx.lineTo(80, 30);
  ctx.stroke();
  
  // Top right corner
  ctx.beginPath();
  ctx.moveTo(width - 80, 30);
  ctx.lineTo(width - 30, 30);
  ctx.lineTo(width - 30, 80);
  ctx.stroke();
  
  // Bottom left corner
  ctx.beginPath();
  ctx.moveTo(30, height - 80);
  ctx.lineTo(30, height - 30);
  ctx.lineTo(80, height - 30);
  ctx.stroke();
  
  // Bottom right corner
  ctx.beginPath();
  ctx.moveTo(width - 80, height - 30);
  ctx.lineTo(width - 30, height - 30);
  ctx.lineTo(width - 30, height - 80);
  ctx.stroke();
  
  return canvas.toBuffer('image/png');
}

// API route to generate and serve image
// app/api/profile/image/route.ts
export async function POST(req: Request) {
  const { profileId } = await req.json();
  
  // Fetch profile from Supabase
  const profile = await getProfile(profileId);
  
  // Generate image
  const imageBuffer = await generateCivicIdentityImage({
    name: profile.name,
    archetype: profile.primary_archetype,
    civicSectors: profile.civic_sectors,
    innovationDomains: profile.innovation_domains,
    confidence: profile.primary_confidence
  });
  
  // Upload to Supabase Storage
  const fileName = `${profileId}-civic-identity.png`;
  const { data, error } = await supabase.storage
    .from('profile-images')
    .upload(fileName, imageBuffer, {
      contentType: 'image/png',
      upsert: true
    });
  
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('profile-images')
    .getPublicUrl(fileName);
  
  // Update profile with image URL
  await supabase
    .from('profiles')
    .update({ profile_image_url: publicUrl })
    .eq('id', profileId);
  
  return Response.json({ imageUrl: publicUrl });
}
```

---

## 6. API Endpoints

### 6.1 Quiz Flow Endpoints

**POST /api/quiz/start**
```typescript
// Initialize new quiz session
Request: {}
Response: {
  session_id: string,
  profile_id: string,
  quiz_config: QuizConfig,
  first_question: QuizQuestion
}
```

**POST /api/quiz/response**
```typescript
// Submit answer to current question
Request: {
  profile_id: string,
  question_id: string,
  response_value: any,
  time_spent_seconds?: number
}
Response: {
  saved: boolean,
  next_question: QuizQuestion | null,
  is_complete: boolean
}
```

**POST /api/quiz/complete**
```typescript
// Process all responses and generate profile
Request: {
  profile_id: string
}
Response: {
  profile: {
    archetype: string,
    confidence: number,
    consortium_role: string,
    civic_sectors: string[],
    onboarding_summary: string,
    profile_image_url: string
  },
  recommended_resources: Resource[],
  next_steps: Action[]
}
```

### 6.2 Resource & Chat Endpoints

**POST /api/resources/search**
```typescript
// Search Notion resources
Request: {
  query?: string,
  civic_sectors?: string[],
  innovation_domains?: string[],
  archetype?: string,
  limit?: number
}
Response: {
  resources: Resource[],
  total: number
}
```

**POST /api/chat**
```typescript
// General chat with AI assistant
Request: {
  message: string,
  profile_id?: string,
  session_id?: string,
  include_notion_context?: boolean
}
Response: {
  message: string,
  resources?: Resource[], // If relevant
  follow_up_suggestions?: string[]
}
```

---

## 7. Frontend UI/UX Specifications

### 7.1 Design System (Terminal Aesthetic)

**Color Palette**:
```scss
$terminal-bg: #0a0e1a;
$terminal-bg-light: #141b2d;
$terminal-fg: #ccd6f6;
$terminal-fg-muted: #8892b0;

// Accents (Archetype colors)
$accent-allies: #64ffda;    // Teal
$accent-innovators: #c792ea; // Purple
$accent-organizers: #ffcb6b; // Yellow
$accent-patrons: #f07178;    // Red/Pink

// UI elements
$border: #1a2332;
$border-bright: #2a3342;
```

**Typography**:
```scss
$font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', monospace;
$font-sans: 'Inter', 'SF Pro', system-ui, sans-serif;

// Use mono for:
// - Headers
// - Data displays
// - Buttons
// - Terminal-style elements

// Use sans for:
// - Body text
// - Descriptions
// - Long-form content
```

**Animations**:
```scss
@keyframes cursorBlink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

@keyframes textReveal {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
```

### 7.2 Component Library

**Terminal Prompt**:
```tsx
<TerminalPrompt>
  <PromptPrefix>opencivics@web:~$</PromptPrefix>
  <PromptInput>
    {children}
    <Cursor />
  </PromptInput>
</TerminalPrompt>
```

**Question Card** (for quiz):
```tsx
<QuestionCard>
  <QuestionNumber>03/12</QuestionNumber>
  <QuestionText>{question.text}</QuestionText>
  
  {question.type === 'single_select' && (
    <RadioOptions>
      {question.options.map(opt => (
        <RadioOption key={opt.value}>
          <RadioInput />
          <RadioLabel>{opt.label}</RadioLabel>
        </RadioOption>
      ))}
    </RadioOptions>
  )}
  
  <NavigationButtons>
    <BackButton />
    <NextButton />
  </NavigationButtons>
</QuestionCard>
```

**Profile Result Card**:
```tsx
<ResultCard>
  <ProfileImage src={profile.image_url} />
  
  <ArchetypeSection>
    <ArchetypeBadge color={archetypeColor}>
      {archetype}
    </ArchetypeBadge>
    <ConfidenceBar value={confidence} />
  </ArchetypeSection>
  
  <SummaryText>{summary}</SummaryText>
  
  <NextStepsSection>
    <SectionTitle>Your Next Steps</SectionTitle>
    {nextSteps.map(step => (
      <ActionButton key={step.id}>
        {step.label}
      </ActionButton>
    ))}
  </NextStepsSection>
  
  <ResourcesSection>
    <SectionTitle>Recommended Resources</SectionTitle>
    {resources.map(resource => (
      <ResourceCard key={resource.id} />
    ))}
  </ResourcesSection>
</ResultCard>
```

---

## 8. Implementation Roadmap

### Phase 1: MVP (Weeks 1-4)
**Goal**: Working web quiz with archetype detection

**Week 1: Foundation**
- [ ] Set up Next.js 14 project
- [ ] Configure Supabase (database + auth)
- [ ] Design & implement database schema
- [ ] Set up Gemini API integration
- [ ] Create basic terminal UI components

**Week 2: Quiz Engine**
- [ ] Implement quiz configuration system
- [ ] Build question renderer components (all types)
- [ ] Create quiz state management
- [ ] Implement response saving to Supabase
- [ ] Build progress tracking

**Week 3: Archetype Detection**
- [ ] Implement algorithmic scoring system
- [ ] Build Gemini validation layer
- [ ] Create archetype analysis prompt
- [ ] Test and tune detection accuracy
- [ ] Build results page UI

**Week 4: Image & Summary**
- [ ] Implement profile image generator
- [ ] Build Gemini summary generator
- [ ] Integrate Notion API for resources
- [ ] Create resource recommendation engine
- [ ] Deploy MVP to Vercel

### Phase 2: Notion Integration & Refinement (Weeks 5-6)
**Goal**: Dynamic resource recommendations from Notion

**Week 5**:
- [ ] Connect to Notion databases
- [ ] Build resource search/filter system
- [ ] Implement relevance ranking
- [ ] Create resource display components
- [ ] Add resource interaction tracking

**Week 6**:
- [ ] Refine archetype detection based on testing
- [ ] Improve quiz questions based on user feedback
- [ ] Optimize Gemini prompts
- [ ] A/B test different question orders
- [ ] Polish UI/UX

### Phase 3: Extended Features (Weeks 7-10)
**Goal**: Chat interface, social sharing, analytics

**Week 7: Chat Interface**
- [ ] Build general chat UI
- [ ] Implement conversation history
- [ ] Create context-aware responses
- [ ] Add Notion knowledge retrieval to chat
- [ ] Test conversation quality

**Week 8: Social & Engagement**
- [ ] Implement social sharing (Twitter, LinkedIn)
- [ ] Create embeddable profile widget
- [ ] Build email capture + newsletter integration
- [ ] Add calendar event integration
- [ ] Create engagement action tracking

**Week 9: Analytics & Admin**
- [ ] Build admin dashboard
- [ ] Implement archetype analytics
- [ ] Create completion funnel tracking
- [ ] Add A/B testing framework
- [ ] Build resource performance metrics

**Week 10: Testing & Launch**
- [ ] Comprehensive QA testing
- [ ] Load testing
- [ ] Security audit
- [ ] Performance optimization
- [ ] Public launch

### Phase 4: Multi-Platform (Weeks 11-14)
**Goal**: Telegram and Twitter bots

**Weeks 11-12: Telegram Bot**
- [ ] Set up Telegram Bot API
- [ ] Port quiz to Telegram format
- [ ] Implement inline keyboards
- [ ] Build resource sharing
- [ ] Test and deploy

**Weeks 13-14: Twitter Bot**
- [ ] Set up Twitter API
- [ ] Build automated content posting
- [ ] Implement DM-based interactions
- [ ] Create resource threading
- [ ] Test and deploy

---

## 9. Testing Strategy

### 9.1 Archetype Detection Validation

**Test Scenarios**:

1. **Clear Allies Signal**
   - Responses: time_learning, learning mode, new_curious stage
   - Expected: Allies with >0.85 confidence

2. **Clear Innovators Signal**
   - Responses: skills_building, building mode, building_something stage, technical skills
   - Expected: Innovators with >0.85 confidence

3. **Clear Organizers Signal**
   - Responses: time_organizing, organizing mode, organizing_locally stage, facilitation skills
   - Expected: Organizers with >0.85 confidence

4. **Clear Patrons Signal**
   - Responses: capital_funding, funding mode, funding_supporting stage
   - Expected: Patrons with >0.85 confidence

5. **Hybrid Profile** (Innovator-Organizer)
   - Responses: Multiple resources, technical + facilitation skills
   - Expected: Primary archetype with secondary archetype identified

**Validation Method**:
- Create test dataset of 50+ synthetic profiles
- Run through detection algorithm
- Compare with human classification
- Measure accuracy, precision, recall
- Tune weights and prompts to achieve >85% accuracy

### 9.2 User Testing Protocol

**Onboarding Flow Testing**:
1. Recruit 20 diverse participants
2. Ask them to complete quiz
3. Conduct post-quiz interview:
   - Does archetype feel accurate?
   - Were questions clear?
   - Was experience enjoyable?
   - Would they share their profile?
4. Track completion rates and drop-off points
5. Iterate on questions and UI

---

## 10. Success Metrics & KPIs

### 10.1 Core Metrics

**Engagement**:
- Quiz start rate (% of visitors who start)
- Quiz completion rate (% who finish)
- Average time to complete
- Drop-off points (which questions lose people)

**Quality**:
- Archetype confidence scores (avg, distribution)
- Self-reported archetype accuracy (post-survey)
- Resource recommendation relevance (click-through rate)
- Profile image share rate

**Conversion**:
- Newsletter signup rate
- Event registration rate
- Consortium application rate
- Resource engagement (clicks, time spent)

**Retention**:
- Return visit rate
- Chat engagement rate
- Resource consumption over time

### 10.2 Success Criteria (3 months post-launch)

- **Completion Rate**: >70%
- **Archetype Confidence**: >85% avg
- **Self-Reported Accuracy**: >80% "accurate" or "very accurate"
- **Engagement Conversion**: >40% take ≥1 action
- **Social Sharing**: >20% share profile
- **Resource Click-Through**: >60% click ≥1 resource
- **Return Visits**: >30% return within 1 week

---

## 11. Future Enhancements (Post-MVP)

### 11.1 Blueprint Composer (Phase 5)
- Interactive tool to compose civic systems
- Drag-and-drop patterns, protocols, playbooks
- Export as actionable implementation guide
- Version control and forking
- Community feedback and ratings

### 11.2 Learning Journeys (Phase 6)
- Personalized curriculum based on archetype + interests
- Interactive lessons with progress tracking
- Quizzes and reflection prompts
- Peer learning groups
- Certification pathways

### 11.3 Matchmaking & Collaboration (Phase 7)
- Find collaborators by archetype, location, interests
- Project discovery (who's building what)
- Resource matching (patrons ↔ innovators/organizers)
- Bioregional networking
- Skill-based connections

### 11.4 Advanced Analytics (Phase 8)
- Ecosystem mapping (network graphs)
- Impact tracking (outcomes from participants)
- Archetype distribution analysis
- Interest clustering and trends
- Geographic heatmaps

---

## 12. Technical Requirements

### 12.1 Environment Variables

```bash
# App
NEXT_PUBLIC_APP_URL=https://onboard.opencivics.co
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Supabase (server-side)
SUPABASE_SERVICE_ROLE_KEY=

# Gemini AI
GEMINI_API_KEY=

# Notion
NOTION_API_KEY=
NOTION_CIVIC_SECTORS_DB=
NOTION_INNOVATION_DOMAINS_DB=
NOTION_RESOURCES_DB=

# Storage
SUPABASE_STORAGE_BUCKET=profile-images

# Optional integrations
TELEGRAM_BOT_TOKEN=
TWITTER_API_KEY=
NEWSLETTER_API_KEY=
CALENDAR_API_KEY=
```

### 12.2 Performance Requirements

- **Page Load**: <2s (First Contentful Paint)
- **Quiz Response**: <500ms (save + next question)
- **Profile Generation**: <10s (complete analysis + image)
- **Chat Response**: <3s (context retrieval + generation)
- **Notion Query**: <2s (resource search)
- **Image Generation**: <5s

### 12.3 Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

---

## 13. Risks & Mitigation

### 13.1 Technical Risks

**Risk**: Gemini API rate limits or costs
**Mitigation**: 
- Implement caching for similar queries
- Use flash model for non-critical tasks
- Monitor usage and set alerts
- Have fallback to local logic if API fails

**Risk**: Notion API performance issues
**Mitigation**:
- Cache frequently accessed data
- Implement background syncing
- Have fallback static data
- Monitor API health

**Risk**: Database performance at scale
**Mitigation**:
- Proper indexing strategy
- Query optimization
- Implement pagination
- Consider read replicas if needed

### 13.2 Product Risks

**Risk**: Low quiz completion rates
**Mitigation**:
- Extensive user testing before launch
- Implement progress saving (resume later)
- Optimize question flow and length
- Add skip options for optional questions

**Risk**: Inaccurate archetype detection
**Mitigation**:
- Rigorous testing with diverse profiles
- Collect feedback and iterate
- Offer manual override option
- Show confidence levels transparently

**Risk**: Low engagement after onboarding
**Mitigation**:
- Strong call-to-action in results
- Email follow-up sequence
- Personalized resource recommendations
- Community events and opportunities

---

## 14. Launch Plan

### 14.1 Soft Launch (Internal)
- **Week 10**: Internal team testing
- **Week 11**: OpenCivics Network beta (50 users)
- Collect feedback, fix bugs
- Tune archetype detection

### 14.2 Limited Public Launch
- **Week 12**: Launch to OpenCivics newsletter (500+ subscribers)
- Monitor metrics closely
- Rapid iteration based on feedback
- Scale infrastructure as needed

### 14.3 Full Public Launch
- **Week 13**: Public announcement
- Social media campaign
- Press outreach
- Partner promotions
- Scale to handle traffic

---

## 15. Appendix

### 15.1 Glossary

- **Archetype**: Primary participation style (Allies, Innovators, Organizers, Patrons)
- **Civic Sector**: Domain of civic life (governance, education, health, etc.)
- **Innovation Domain**: Approach to systemic change (network governance, open protocols, etc.)
- **Consortium**: The OpenCivics coordinating body for active practitioners
- **Commons**: The shared knowledge repository (Notion) of patterns, playbooks, protocols
- **Civic Stack**: A complete civic system composed of multiple utilities

### 15.2 References

- OpenCivics Conceptual Architecture: `/mnt/project/Conceptual_Architecture_26a06d2570f2803a976ac66f30b9d3a9.md`
- Full Framework: `/mnt/project/Full_Framework__OpenCivics_Wiki.pdf`
- Civic Sectors: `/mnt/project/Civic_Sectors_29b06d2570f280deabadc4f7031f0564_all.csv`
- Innovation Domains: `/mnt/project/Open_Civic_Innovation_Domains_29806d2570f280ac9ba8d37aadb23610_all.csv`

---

**Document Version**: 1.0  
**Last Updated**: November 2025  
**Maintained By**: OpenCivics Product Team  
**Contact**: product@opencivics.co

---

END OF PRODUCT REQUIREMENTS DOCUMENT
