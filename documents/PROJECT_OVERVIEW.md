# GodMode7.com - Project Overview & Quick Reference

## 📋 Project Summary

**GodMode7.com** is a gamified marketing platform that allows business owners to visually target and engage with potential customers through an interactive map-based interface.

**Target Audience:** Older business owners (e.g., doctors) who want marketing capabilities without hiring an agency

**Design Philosophy:** Simple, friendly, game-like (SimCity-esque), mobile-first with 4-click user journey

---

## 🎯 Core Value Proposition

**Problem:** Customers spend too much money with marketing agencies  
**Solution:** A "video game" that does marketing for them - they just "play" it

---

## 🔑 Key Features

### 1. **Business Search & Map Interface**
- Search for business via Mapbox API
- Load surrounding area with interactive map
- Game-like visual interface using Three.js

### 2. **People Data Integration**
- Display people as pins on map (L2DataMapping API)
- Click on pins to view detailed person information
- Hundreds of data fields available (demographics, income, interests, etc.)

### 3. **Advanced Filtering**
- Zillow-style filter UI
- Filter by demographics, location, preferences, interests
- Real-time map updates

### 4. **Gift & Message System**
- Select one or multiple people from map
- Choose gifts from catalog (Sendoso API)
- Compose personalized messages

### 5. **Payment Processing**
- Stripe integration for secure payments
- Transparent pricing

### 6. **Multi-Channel Notifications**
- In-app confirmation dialogs
- Email notifications
- SMS notifications (Twilio API)
- Delivery tracking

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js with TypeScript
- **3D/Graphics:** Three.js (for game-like experience)
- **Mapping:** Mapbox GL JS
- **Styling:** Tailwind CSS
- **State Management:** Zustand or Redux

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB or PostgreSQL

### Hosting
- **Platform:** Vercel

### Third-Party APIs
| API | Purpose |
|-----|---------|
| **Mapbox** | Map rendering and business location search |
| **L2DataMapping** | Consumer/demographic data (PRIVATE API) |
| **Sendoso** | Gift sending service |
| **Stripe** | Payment processing |
| **Twilio** | SMS notifications |

---

## 📊 Development Milestones

| # | Milestone | Duration | Cost | Status |
|---|-----------|----------|------|--------|
| 1 | Map Foundation + L2DataMapping Integration | 5 days | $1,400 | ⏳ In Progress |
| 2 | Filter System | 5 days | $1,400 | 📋 Pending |
| 3 | Selection & Gift Flow | 5 days | $1,400 | 📋 Pending |
| 4 | Payment & Notifications | 7 days | $1,800 | 📋 Pending |
| **TOTAL** | **MVP Completion** | **22 days** | **$6,000** | |

---

## 📱 User Journey (4-Click Maximum)

### Simplified Flow (Post-Walkthrough)
```
1. Search Business (1 button: "Find My Business")
   ↓
2. View Map with People Pins (1 button: "Show People Nearby")
   ↓
3. Select People → Choose Gift (1 button: "Send Gift")
   ↓
4. Pay → Receive Confirmation (1 button: "Complete")
```

### First-Time Walkthrough Flow (Mandatory Tutorial)
```
Step 1: Welcome Screen
  - One button: "Let's Start!" (big, prominent)
  - Brief explanation: "We'll help you find customers in 4 simple steps"
  - Progress: "Step 1 of 4"

Step 2: Find Your Business
  - Highlighted search bar with arrow pointing to it
  - One button: "Search" (only after typing)
  - Progress: "Step 2 of 4"
  - Achievement: "Business Found!" badge appears

Step 3: Explore Your Area
  - Map appears with pins
  - Highlighted pin with tooltip: "Tap a pin to see customer info"
  - One button: "Next Step" (after tapping a pin)
  - Progress: "Step 3 of 4"
  - Achievement: "Explorer!" badge

Step 4: Send Your First Gift
  - Highlighted "Send Gift" button
  - One button: "Send Gift"
  - Progress: "Step 4 of 4"
  - Achievement: "First Gift Sent!" + confetti animation
  - Final message: "You're all set! You can now use GodMode7 on your own."
```

---

## 🎮 Milestone 1: Map Foundation + L2DataMapping Integration

### Core Map Features
- [ ] Mapbox integration & custom styling
- [ ] Business location search
- [ ] Load surrounding area of business
- [ ] Map rendering & performance optimization
- [ ] Pin clustering for performance
- [ ] Three.js integration for game-like feel (portfolio style)

### L2DataMapping Integration
- [ ] API connection and authentication
- [ ] Data fetching & caching layer
- [ ] Person pin rendering on map
- [ ] Pin detail modal/popup
- [ ] Data transformation layer
- [ ] Handle geographic circle_filter queries

### Onboarding & Walkthrough (CRITICAL)
- [ ] First-time user tutorial overlay
- [ ] Step-by-step guided walkthrough (4 steps)
- [ ] Progress indicator (Step X of 4)
- [ ] Visual highlights and arrows
- [ ] Achievement/badge system for completion
- [ ] Skip option (only after first completion)

### Deliverable
Interactive prototype with Three.js that feels like an early-stage game (matching portfolio examples: KodeClubs.com + ChooChooWorld.com), not a static demo. Must have 1-2 buttons max per screen and mandatory walkthrough.

---

## 🔍 L2 Consumer Data - Key Fields for GodMode7

### Essential Display Fields
- **Contact:** Name, Address, Phone, Email
- **Demographics:** Age, Gender, Income, Education
- **Location:** Lat/Long, Zip Code, County
- **Household:** Household Size, Homeowner Status

### Useful Filtering Fields
- **Income & Finance:** Estimated Income, Net Worth, Credit Rating
- **Interests:** 100+ interest categories (health, automotive, pets, sports, etc.)
- **Professional:** Occupation, Business Owner indicator
- **Lifestyle:** Lifestyle segments (upscale, value hunter, etc.)

### Advanced Targeting
- **Contribution Patterns:** Charitable giving, political affiliation
- **Buying Habits:** Online buyer, mail responder
- **Home Details:** Home value, purchase date, square footage
- **Vehicle Ownership:** Make, model, year

---

## 🔌 L2 API - Critical Endpoints for GodMode7

### Authentication
```
Base URL: https://api.l2datamapping.com
Auth: ?id=<api_customer>&apikey=<api_key>
Application: COM_US (Consumer data, United States)
```

### Key Endpoints

#### 1. Search People (Primary Endpoint)
```
POST /api/v2/records/search/<customer>/<app>
```
**Body:**
```json
{
  "filters": {
    "Residence_Addresses_Zip": "90210",
    "Voters_Gender": "F",
    "Estimated_Income": ["$75K-$100K", "$100K+"]
  },
  "circle_filter": {
    "lat": 34.0522,
    "long": -118.2437,
    "radius": 5000
  },
  "format": "json",
  "limit": 500
}
```

#### 2. Estimate Search Results (Cost Prevention)
```
POST /api/v2/records/search/estimate/<customer>/<app>
```
Use before every search to prevent unexpected API charges

#### 3. Get Available Columns
```
GET /api/v2/customer/application/columns/<customer>/<app>
```
Returns all available data fields

#### 4. Get Column Values (for Filters)
```
GET /api/v2/customer/application/values/<customer>/<app>/<column>
```

#### 5. Get Statistics (for UI Insights)
```
GET /api/v2/customer/application/stats/<customer>/<app>?view.<column>=1&filter.<column>=<value>
```

### Important Filters
- `Residence_Addresses_Zip` - Zip code
- `Voters_Gender` - Gender (M/F)
- `Estimated_Income` - Income ranges
- `Voters_Age` - Age
- `circle_filter` - Geographic radius (lat, long, radius in meters)
- `__UNIVERSES` - Saved audience segments

### Search Limits
- **JSON format:** Max 500 records per request
- **CSV format:** Unlimited (returns file)
- **Filter limit:** Max 12 filters per search

---

## 🎨 UI/UX Requirements

### ⚠️ CRITICAL CLIENT FEEDBACK - EXTREME SIMPLICITY REQUIRED

**Client's Direct Requirements:**
> "Where it's simple and it walks you through like a video game... Still feels complicated for a doctor. These examples from your portfolio feel like a video game... There's like 1 or 2 buttons only. Super simple walk thru to get them used to it."

**Portfolio References:**
- **KodeClubs.com** - 3D visuals, playful characters, achievement mechanics, smooth transitions
- **ChooChooWorld.com** - Extremely minimal UI (1-2 buttons), immediate feedback, familiar metaphors

**Key Principles:**
- **1-2 buttons maximum** per screen - NO MORE
- **Video game walkthrough** - guided step-by-step tutorial
- **Still too complicated for doctors** - simplify beyond initial design
- **Super simple walkthrough** - get users comfortable before they use it independently
- **Feels like playing a game** - not using software

### Design Inspiration
- **Primary Reference:** https://ui.caasie.co/map?demoOnly=true
- **Portfolio Style:** KodeClubs.com (3D playful) + ChooChooWorld.com (minimal buttons)
- **Style:** SimCity-esque mobile game with extreme simplicity
- **Complexity:** Maximum 4 clicks from start to finish
- **UI Density:** 1-2 buttons/actions visible at any time

### Mandatory Onboarding & Walkthrough
- **First-time user tutorial** - forced step-by-step tour
- **Progress indicators** - "Step 1 of 4" clearly visible
- **One thing at a time** - highlight only 1 new element per screen
- **Visual cues** - arrows, highlights, animations guide user
- **Skip option** - only after completing once
- **Achievement unlocks** - gamification (badges, progress bars)

### Key UI Elements (Simplified)
1. **Welcome Screen** - One button: "Get Started" or "Start Playing"
2. **Interactive Map** - Full screen, smooth animations, minimal UI overlay
3. **Person Pins** - Clickable, clustered when zoomed out
4. **Info Panels** - SimCity-style bottom/side panels (slide in/out)
5. **Single Action Buttons** - Only show 1-2 buttons at a time
6. **Progress Bar** - Always visible: "Step 2 of 4"
7. **Visual Feedback** - Immediate animations on every action
8. **Back/Home Button** - Always accessible, never feel lost

### Mobile-First Considerations
- **Large touch targets** - minimum 44x44px (iOS standard)
- **Big buttons** - easy to tap with thumb
- **High contrast** - readable for older users
- **Simple vocabulary** - no technical jargon
- **Icons + minimal text** - visual over textual
- **Swipe gestures** - for panels (optional, not required)
- **One-handed operation** - primary actions reachable with thumb
- **Fast loading times** - under 3 seconds
- **Minimal text input** - prefer selection over typing

---

## 🚀 Post-MVP Features (Future)

### Integrations
- Postcard sending (Postalytics.com)
- Additional gift providers
- CRM integrations

### Platform Features
- Credit/Wallet system
- Gamification (points, achievements)
- Marketing landing pages
- User account management
- Team collaboration
- Billing management
- Analytics dashboard

### Compliance & Validation
- KYB (Know Your Business) validation
- Compliance dialogs
- Data privacy controls

---

## 📞 Stakeholders

### Client
**Steve Lee**  
Founder & CEO, SEOAesthetic.com  
📧 steve@seoaesthetic.com  
📱 +1 (347) 292-9294

### Project Manager
**Eric Sim**  
📧 eric@seoaesthetic.com

### Developer
**Igor Cecoltan** (Ideal Dev)  
📧 pleon.swe@gmail.com

### Communication
**Platform:** Slack (external guest access)

---

## 📚 Reference Documents

1. **[chat_history.md](./chat_history.md)** - Complete email conversation and project evolution
2. **[L2_Consumer_Data_Dictionary.md](./L2_Consumer_Data_Dictionary.md)** - All available consumer data fields
3. **[L2_API_Documentation.md](./L2_API_Documentation.md)** - Complete API reference
4. **[WIREFRAMES.md](./WIREFRAMES.md)** - Detailed wireframes and mockups for all screens
5. **[UI_COMPONENT_SPECS.md](./UI_COMPONENT_SPECS.md)** - Component specifications and design system
6. **[GAME_STYLE_GUIDE.md](./GAME_STYLE_GUIDE.md)** - Quick reference for game-style fonts, icons, and implementation

## 🎮 Portfolio Design References

### KodeClubs.com
- **Style:** 3D visuals, playful characters, customizable avatars
- **Key Features:** Achievement mechanics, quest system, smooth transitions
- **Takeaway:** Gamification elements, visual feedback, progress tracking

### ChooChooWorld.com
- **Style:** Extremely minimal UI (1-2 buttons), immediate feedback
- **Key Features:** Simple editor controls, familiar metaphors, toy-like environment
- **Takeaway:** Minimal buttons, direct interaction, visual metaphors

### Design Principles to Apply
- **Visual over Textual** - Icons and animations over words
- **Immediate Feedback** - Every action has visible response
- **Progressive Disclosure** - Show only what's needed now
- **Familiar Metaphors** - Use game concepts (levels, unlocks, badges)
- **Big, Clear Actions** - One primary action per screen

---

## ⚠️ Critical Notes

### API Usage
- **Always use estimate endpoint first** to avoid unexpected charges
- Usage is billed per record returned
- More fields = higher cost per record

### Data Privacy
- L2 data is for marketing purposes only
- Must comply with data usage policies
- Implement do-not-call flag respect

### Performance
- Implement pin clustering for large result sets
- Cache L2 API responses
- Use circle_filter to limit query scope
- Optimize map rendering

### User Experience
- **EXTREME SIMPLICITY** - target is older, non-technical users (doctors)
- **1-2 buttons maximum** per screen - hide complexity
- **Guided walkthrough mandatory** - tutorial on first use
- Every feature should feel like "playing a game" (like portfolio examples)
- **Progressive disclosure** - show options only when needed
- Test on actual mobile devices with non-technical users
- Ensure 4-click maximum user journey
- **Visual metaphors** - use familiar game concepts (levels, unlocks, badges)

---

## 🎯 Success Criteria

- [ ] **Onboarding completed** - first-time user completes walkthrough without confusion
- [ ] **1-2 buttons visible** - no screen has more than 2 action buttons
- [ ] User can find their business in under 10 seconds
- [ ] User can identify target customers visually on map
- [ ] **No instructions needed** - interface is self-explanatory (like portfolio examples)
- [ ] Complete gift sending in 4 clicks or less
- [ ] Mobile experience feels smooth and game-like (matches portfolio feel)
- [ ] Load times under 3 seconds
- [ ] No unexpected API cost overruns
- [ ] **Doctor can use it** - tested with non-technical older users successfully

---

*Last Updated: January 12, 2026*  
*Project Status: Milestone 1 - In Progress*

