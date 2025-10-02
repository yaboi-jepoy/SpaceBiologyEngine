```mermaid
graph TD
    A[User Types Query: 'microgravity bone loss'] --> B[SearchBar Component]
    B --> C[useEnhancedPublications Hook]
    C --> D[500ms Debounce Timer]
    D --> E[Phase 1: AI Enhancement]

    E --> F[Perplexity API Call]
    F --> G{API Success?}
    G -->|Yes| H[Extract Keywords, Scientific Terms, Categories, Tags]
    G -->|No| I[Fallback: Simple Keyword Extraction]

    H --> J[Phase 2: Database Query]
    I --> J
    J --> K[Firebase Firestore: getDocs('publications')]
    K --> L[Fetch All Publications]

    L --> M[Phase 3: Scoring & Ranking]
    M --> N[For Each Publication]
    N --> O[Calculate Relevance Score]

    O --> P{Score Calculation}
    P --> Q[Title Match: +50 pts each]
    P --> R[Category Match: +30 pts each]
    P --> S[Tag Match: +25 pts each]
    P --> T[Exact Phrase: +100 pts]
    P --> U[Multi-field Bonus: +10 pts]

    Q --> V[Total Score]
    R --> V
    S --> V
    T --> V
    U --> V

    V --> W{Convert to Category}
    W -->|100+ pts| X[🎯 Highly Relevant]
    W -->|75-99 pts| Y[⭐ Very Relevant]
    W -->|50-74 pts| Z[✓ Relevant]
    W -->|25-49 pts| AA[~ Somewhat Relevant]
    W -->|1-24 pts| BB[· Slightly Relevant]

    X --> CC[Filter & Sort Results]
    Y --> CC
    Z --> CC
    AA --> CC
    BB --> CC

    CC --> DD[Return to UI]
    DD --> EE[Display Enhanced Results]

    EE --> FF[Show AI Enhancement Indicator]
    EE --> GG[Show Relevance Categories]
    EE --> HH[Show Categories & Tags]
    EE --> II[Show Match Indicators]

    style A fill:#e1f5fe
    style E fill:#fff3e0
    style J fill:#f3e5f5
    style M fill:#e8f5e8
    style EE fill:#fce4ec
```
