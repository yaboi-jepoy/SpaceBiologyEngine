# Space Biology Engine - Backend Process Flow

## 🔄 Enhanced Search System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            USER INTERACTION LAYER                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  SearchBar Component (/src/components/searchbar.jsx)                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  const [searchText, setSearchText] = useState('')                   │    │
│  │  const { publications, loading, enhancedQuery, searchPhase,         │    │
│  │          getPhaseMessage } = useEnhancedPublications(searchText)     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     ENHANCED SEARCH HOOK (500ms debounce)                   │
│                 /src/hooks/useEnhancedPublications.js                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                        ┌───────────────┼───────────────┐
                        ▼               ▼               ▼
            ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
            │   PHASE 1:      │ │   PHASE 2:      │ │   PHASE 3:      │
            │ AI Enhancement  │ │ Database Query  │ │ Score & Rank    │
            └─────────────────┘ └─────────────────┘ └─────────────────┘
                        │               │               │
                        ▼               ▼               ▼

┌─────────────────────────────────────────────────────────────────────────────┐
│                              PHASE 1: AI ENHANCEMENT                        │
│  /src/services/perplexityService.js                                        │
│                                                                             │
│  Input: "microgravity bone loss"                                           │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Perplexity API Call (llama-3.1-sonar-small-128k-online)            │    │
│  │                                                                     │    │
│  │ System Prompt: "You are a space biology research assistant..."      │    │
│  │ User Query: "microgravity bone loss"                                │    │
│  │                                                                     │    │
│  │ AI Response (JSON):                                                 │    │
│  │ {                                                                   │    │
│  │   "keywords": ["microgravity", "bone", "loss", "density"],         │    │
│  │   "scientificTerms": ["osteoporosis", "calcium", "skeletal"],      │    │
│  │   "categories": ["Bone Health", "Microgravity Effects"],           │    │
│  │   "tags": ["astronauts", "weightlessness", "osteopenia"]           │    │
│  │ }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  Fallback: If API fails → Simple keyword extraction                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            PHASE 2: DATABASE QUERY                          │
│  Firebase Firestore Integration                                            │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ const querySnapshot = await getDocs(collection(db, "publications")) │    │
│  │                                                                     │    │
│  │ Database Structure:                                                 │    │
│  │ ┌─────────────────────────────────────────────────────────────────┐ │    │
│  │ │ Document 1: {                                                   │ │    │
│  │ │   Title: "Effects of Microgravity on Bone Density",            │ │    │
│  │ │   Link: "https://example.com/paper1",                          │ │    │
│  │ │   Category: "Bone Health",                                     │ │    │
│  │ │   Tags: ["microgravity", "osteoporosis", "astronauts"]         │ │    │
│  │ │ }                                                               │ │    │
│  │ │                                                                 │ │    │
│  │ │ Document 2: {                                                   │ │    │
│  │ │   Title: "Cardiovascular Changes in Space",                    │ │    │
│  │ │   Link: "https://example.com/paper2",                          │ │    │
│  │ │   Category: "Cardiovascular Health",                           │ │    │
│  │ │   Tags: ["heart", "blood pressure", "circulation"]             │ │    │
│  │ │ }                                                               │ │    │
│  │ └─────────────────────────────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PHASE 3: SCORING & RANKING                          │
│  calculateRelevanceScore() function                                         │
│                                                                             │
│  For each publication, calculate score using enhanced keywords:             │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Search Terms: ["microgravity", "bone", "loss", "density",          │    │
│  │               "osteoporosis", "calcium", "skeletal", ...]          │    │
│  │                                                                     │    │
│  │ Publication: "Effects of Microgravity on Bone Density"             │    │
│  │                                                                     │    │
│  │ Scoring Logic:                                                      │    │
│  │ ✅ Exact phrase match in title: +100 points                        │    │
│  │ ✅ "microgravity" in title: +50 points                             │    │
│  │ ✅ "bone" in title: +50 points                                     │    │
│  │ ✅ "density" in title: +50 points                                  │    │
│  │ ✅ "Bone Health" category match: +30 points                        │    │
│  │ ✅ "microgravity" in tags: +25 points                              │    │
│  │ ✅ Multi-field bonus (3 fields): +30 points                        │    │
│  │                                                                     │    │
│  │ Total Score: 335 points → 🎯 "Highly Relevant"                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  Score Categories:                                                          │
│  • 100+ points: 🎯 "Highly Relevant"                                       │
│  • 75-99 points: ⭐ "Very Relevant"                                         │
│  • 50-74 points: ✓ "Relevant"                                              │
│  • 25-49 points: ~ "Somewhat Relevant"                                     │
│  • 1-24 points: · "Slightly Relevant"                                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            RESULT PROCESSING                                │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ 1. Filter publications with score > 0                              │    │
│  │ 2. Sort by relevance score (highest first)                         │    │
│  │ 3. Add metadata:                                                    │    │
│  │    - relevanceScore: 335                                           │    │
│  │    - matchDetails: { category, titleMatches, tagMatches, ... }     │    │
│  │                                                                     │    │
│  │ Final Result Array:                                                 │    │
│  │ [                                                                   │    │
│  │   {                                                                 │    │
│  │     Title: "Effects of Microgravity on Bone Density",              │    │
│  │     Link: "https://example.com/paper1",                            │    │
│  │     Category: "Bone Health",                                       │    │
│  │     Tags: ["microgravity", "osteoporosis", "astronauts"],          │    │
│  │     relevanceScore: 335,                                           │    │
│  │     matchDetails: {                                                 │    │
│  │       category: { label: "Highly Relevant", icon: "🎯" },          │    │
│  │       exactMatch: true,                                             │    │
│  │       titleMatches: ["microgravity", "bone"],                      │    │
│  │       tagMatches: ["microgravity"]                                  │    │
│  │     }                                                               │    │
│  │   }                                                                 │    │
│  │ ]                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            UI PRESENTATION                                  │
│  SearchBar Component Rendering                                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Loading States:                                                     │    │
│  │ • "Analyzing query with AI..." (Phase 1)                           │    │
│  │ • "Searching publications..." (Phase 2)                            │    │
│  │ • "Found X relevant publications" (Complete)                       │    │
│  │                                                                     │    │
│  │ Result Display:                                                     │    │
│  │ ┌─────────────────────────────────────────────────────────────────┐ │    │
│  │ │ 🤖 AI-enhanced search active                                    │ │    │
│  │ │                                                                 │ │    │
│  │ │ 🔍 Effects of Microgravity on Bone Density                     │ │    │
│  │ │    [Bone Health] 🎯 Highly Relevant                            │ │    │
│  │ │    [microgravity] [osteoporosis] [astronauts]                  │ │    │
│  │ │    ✨ Exact match found                                         │ │    │
│  │ └─────────────────────────────────────────────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘

## 🔧 Technical Implementation Details

### State Management Flow:
1. **User Types** → `searchText` state updates
2. **Debounced Effect** → Waits 500ms after typing stops
3. **Hook Execution** → `useEnhancedPublications` runs
4. **Loading States** → UI shows current phase
5. **Results Update** → Filtered, scored, and sorted publications

### Error Handling:
- **API Failures** → Fallback to simple keyword extraction
- **Network Issues** → Graceful degradation
- **Invalid Data** → Skip malformed publications

### Performance Optimizations:
- **Debouncing** → Prevents excessive API calls
- **Client-side Filtering** → Fast after initial Firebase fetch
- **Memoization** → Prevents unnecessary re-computations

### Security Considerations:
- **Environment Variables** → API keys stored securely
- **Input Sanitization** → Prevents injection attacks
- **CORS Handling** → Proper API communication
```
