# GodMode7.com - Milestone 1

Gamified marketing platform for business owners to find and engage customers through an interactive map interface.

## 🎮 Project Status

**Milestone 1:** Map Foundation + L2DataMapping Integration (In Progress)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Mapbox access token
- L2DataMapping API credentials

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
VITE_L2_API_CUSTOMER=your_customer_id
VITE_L2_API_KEY=your_api_key_here
VITE_L2_APP=COM_US
```

3. **Start development server:**
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
god-mode-7/
├── src/
│   ├── components/
│   │   ├── game/           # Game-style UI components
│   │   ├── map/            # Map-related components
│   │   └── onboarding/     # Onboarding walkthrough
│   ├── contexts/           # React contexts
│   ├── pages/              # Page components
│   ├── services/           # API clients
│   ├── store/              # Zustand state management
│   └── App.tsx             # Main app component
├── documents/              # Project documentation
└── package.json
```

## 🎨 Features Implemented

### ✅ Core Map Features
- [x] Mapbox GL JS integration
- [x] Business location search
- [x] Map rendering with custom styling
- [x] Person pins on map
- [x] Pin clustering (basic)

### ✅ L2DataMapping Integration
- [x] API client with authentication
- [x] Search people endpoint
- [x] Estimate endpoint (cost prevention)
- [x] Data transformation layer
- [x] Geographic circle_filter queries

### ✅ Onboarding & Walkthrough
- [x] First-time user tutorial
- [x] 4-step guided walkthrough
- [x] Progress indicators
- [x] Achievement system
- [x] Visual highlights and tooltips

### ✅ Game-Style Design
- [x] Fredoka One & Nunito fonts
- [x] Vibrant color palette
- [x] Rounded corners (20px)
- [x] Gradient buttons
- [x] Achievement badges
- [x] Bounce animations

## 🔧 Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Maps:** Mapbox GL JS
- **3D Graphics:** Three.js (ready for integration)
- **Animations:** Framer Motion
- **Routing:** React Router

## 📝 API Integration

### Mapbox
- Geocoding API for business search
- Map rendering and styling
- Custom markers and popups

### L2DataMapping
- Consumer data API (COM_US)
- Search with filters and circle_filter
- Estimate endpoint for cost prevention
- Column metadata API

## 🎯 Next Steps (Milestone 1)

- [ ] Three.js integration for game-like visuals
- [ ] Pin clustering optimization
- [ ] Performance optimization
- [ ] Error handling improvements
- [ ] Loading states
- [ ] Caching layer

## 📚 Documentation

See `documents/` folder for:
- `PROJECT_OVERVIEW.md` - Complete project requirements
- `WIREFRAMES.md` - UI wireframes and mockups
- `UI_COMPONENT_SPECS.md` - Component specifications
- `GAME_STYLE_GUIDE.md` - Game-style design guide
- `L2_API_Documentation.md` - L2 API reference

## 🐛 Troubleshooting

### Map not loading
- Check Mapbox access token in `.env`
- Ensure token has correct permissions

### L2 API errors
- Verify API credentials in `.env`
- Check network connectivity
- Review API rate limits

### Build errors
- Clear `node_modules` and reinstall
- Check Node.js version (18+)
- Verify TypeScript version

## 📄 License

Proprietary - GodMode7.com

---

*Last Updated: January 12, 2026*

