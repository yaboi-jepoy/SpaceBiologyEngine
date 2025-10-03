# 🚀 Space Biology Knowledge Engine

A powerful AI-enhanced search platform for exploring NASA's space biology research across 608+ publications from three key NASA resources.

## 🌟 Features

### 🔍 Dual Search Modes
1. **Local Publication Search** - Fast keyword-based search through your Firebase database
2. **NASA Knowledge Engine** - AI-powered search across official NASA resources using Perplexity AI

### 🎯 Two-Stage Interaction System
- **First Click** → Preview modal with summary, metadata, and tags
- **Second Click** → Full content embedded within the site
- **No External Redirects** → Users stay within the application
- **Progressive Disclosure** → Information revealed in stages

### 🤖 AI-Powered Capabilities
- **Smart Query Enhancement** - AI expands your search with related scientific terms
- **Domain-Specific Search** - Focused searches across NASA's OSDR, NSLSL, and Task Book
- **Research Gap Analysis** - Identifies opportunities and knowledge gaps
- **Structured Data Extraction** - Automatically organizes findings, experiments, and publications
- **Knowledge Graph Visualization** - Visual representation of research connections

### 📚 NASA Resources Covered
- **OSDR** (Open Science Data Repository) - 500+ biological experiments data
- **NSLSL** (NASA Space Life Sciences Library) - Global research literature
- **Task Book** - NASA-funded research projects and grants

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite
- **Database**: Firebase Firestore
- **AI**: Perplexity AI (llama-3.1-sonar-small-128k-online)
- **Styling**: Custom CSS with dark mode support

## 📦 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd sbe
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Perplexity AI Configuration
VITE_PERPLEXITY_API_KEY=your_perplexity_api_key_here
```

4. **Run the development server**
```bash
npm run dev
```

## 🔑 Getting API Keys

### Perplexity AI API Key
1. Visit [Perplexity AI](https://www.perplexity.ai/)
2. Sign up for an account
3. Navigate to API settings
4. Generate a new API key
5. Add to your `.env` file

### Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Go to Project Settings → General
4. Scroll to "Your apps" section
5. Copy the configuration values to `.env`

## 🎯 Usage

### Local Publication Search
1. Navigate to the **Home** page
2. Enter keywords related to space biology
3. View AI-enhanced results with relevance scoring
4. Click on publications to open in new tab

### NASA Knowledge Engine
1. Click **NASA Search** in the navigation
2. Enter your research query
3. Select search type:
   - **All Resources** - Comprehensive search
   - **Publications** - Focus on scientific papers
   - **Datasets** - Focus on experimental data
   - **Grants** - Focus on funded projects
4. Click **Search NASA Resources** for detailed insights
5. Click **Analyze Research Gaps** for strategic analysis

### Features in Results
- **Summary** - AI-generated overview of findings
- **Citations** - Direct links to NASA resources
- **Experiments** - Relevant space biology experiments
- **Key Findings** - Important discoveries
- **Research Gaps** - Opportunities for future research
- **Knowledge Graph** - Visual representation of connections

## 📁 Project Structure

```
sbe/
├── src/
│   ├── components/
│   │   ├── searchbar.jsx          # Local publication search
│   │   ├── NASASearch.jsx         # NASA resource search
│   │   ├── KnowledgeGraph.jsx     # Visualization component
│   │   ├── navBar.jsx             # Navigation
│   │   └── themetoggle.jsx        # Dark/light mode
│   ├── services/
│   │   └── perplexityService.js   # AI search service
│   ├── hooks/
│   │   └── useEnhancedPublications.js  # Search logic
│   ├── firebase.js                # Firebase config
│   └── App.jsx                    # Main app component
├── .env.example                   # Environment template
└── package.json
```

## 🎨 Design Philosophy

This project maintains your original design aesthetic while adding powerful NASA-specific search capabilities:
- Clean, modern UI with smooth animations
- Responsive design for all devices
- Dark mode support
- Accessible (ARIA labels, keyboard navigation)
- Performance optimized (debouncing, lazy loading)

## 🔧 Advanced Configuration

### Search Type Contexts
Modify `perplexityService.js` to customize search contexts:
```javascript
getDomainContext(searchType) {
  const contexts = {
    comprehensive: 'Your custom context...',
    publications: 'Your custom context...',
    // ... add more
  };
}
```

### Relevance Scoring
Adjust scoring weights in `useEnhancedPublications.js`:
```javascript
// Title matches (high weight)
if (title.includes(termLower)) {
  score += 50;  // Adjust this value
}
```

## 🚀 Deployment

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Deploy to hosting
The `dist/` folder can be deployed to:
- Vercel
- Netlify
- Firebase Hosting
- GitHub Pages

## 🤝 Contributing

This is a hackathon project for NASA Space Apps Challenge. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🏆 NASA Space Apps Challenge

This project addresses the **"Build a Space Biology Knowledge Engine"** challenge by:
- ✅ Leveraging AI for intelligent search
- ✅ Searching across all three NASA resources (OSDR, NSLSL, Task Book)
- ✅ Identifying research gaps and opportunities
- ✅ Providing actionable insights for mission planning
- ✅ Supporting multiple user personas (scientists, managers, architects)
- ✅ Visual knowledge representation

## 👥 Team

**Russtronauts** - Building the future of space biology research discovery

## 📞 Support

For questions or issues:
1. Check the documentation above
2. Review the code comments
3. Check `.env.example` for configuration help

---

**Note**: This application requires valid API keys to function. The Perplexity AI integration enables domain-specific searches across NASA resources without requiring web scraping.
