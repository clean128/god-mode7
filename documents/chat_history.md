# GodMode7.com - Client Communication History

## Initial Project Request
**From:** Steve Lee  
**Date:** Dec 9, 2025, 9:13 PM

### Project Overview
**Project Name:** GodMode7.com MVP

#### Main Problem
Customers spend a lot of money with marketing agencies.

#### Solution
Create a "video game" that does marketing for them, and they can just "play" it.

#### Target Persona
Old business owners who want to do marketing but don't want to go to an agency.

---

## User Experience Requirements

### 1. Business Search
- Let user search for their own business via **Mapbox** (paid/public API)

### 2. Map Area Loading
- Load up surrounding area of business via **Mapbox** (paid/public API)

### 3. People Data Integration
- Load up people (based on their address) as pins via **L2DataMapping** (private API)

### 4. Person Details
- Let user click into the pin and see information about them

### 5. Filtering System
- Let user filter the people using UI (similar to Zillow filters)
- Simple / Friendly / SimCity-esque UI

### 6. Gift & Message Sending
- Let user select 1 or more people on the map
- Send them gifts and a message via **Sendoso** (public API)

### 7. Payment Processing
- Collect payment via **Stripe** (available API)

### 8. Confirmation System
- Send in-dialog + email + SMS confirmation via **Twilio API**
- Notify when and where gifts are being sent via Sendoso API

---

## Key Requirements

### UX/UI Standards
- Similar to a game like SimCity iPhone
- Must allow user to complete start-to-finish with **4 clicks**
- Very user-friendly for old doctors
- **Mobile First** design

### Similar Concept Reference
- https://ui.caasie.co/map?demoOnly=true

---

## Post-MVP Features (Not for Now)

- Future integrations: Sending postcards (postalytics.com)
- Credit / Wallet Earning Mechanisms
- Gamification features
- Marketing Landing Page explainers (company pages, about, team, value proposition, use cases)
- User Sign Up / Account Management
- Compliance Dialogs
- Billing Management
- Profile Management
- KYB validation (Is this a business owner)

---

## Contact Information
**Client:** Steve Lee  
**Title:** Founder & CEO  
**Phone:** +1 (347) 292-9294  
**Email:** steve@seoaesthetic.com  
**Company:** SEOAesthetic Best SEO Company

---

# Development Proposal & Timeline

## Initial Quote
**From:** Igor Cecoltan (Ideal Dev)  
**Date:** Dec 17, 2025

### Development Breakdown

#### Step 1: Map Foundation + L2DataMapping Integration (5 days)
**Core Map Features:**
- Mapbox integration & custom styling
- Business location search and loading surrounding area
- Map rendering & performance optimization
- Pin clustering for performance

**L2DataMapping Integration:**
- API integration
- Data fetching & caching
- Person pin rendering
- Pin detail modal/popup
- Data transformation layer

#### Step 2: Filter System (5 days)
- Filter UI implementation
- Real-time map updates
- Filter state management
- Mobile-optimized filter panel

#### Step 3: Selection & Gift Flow (5 days)
- Single/multi-select functionality
- Gift catalog interface
- Message composition
- Selection summary view

#### Step 4: Payment & Notifications (7 days)
**Payment & Integrations:**
- Stripe checkout integration
- Sendoso API integration
- Payment flow testing
- Error handling

**Notifications:**
- Twilio SMS integration
- Email notifications
- In-app confirmation dialogs
- Status tracking

---

## Tech Stack

### Frontend
- React.js
- TypeScript
- Mapbox GL JS
- Tailwind CSS
- Zustand or Redux

### Backend
- Node.js + Express
- MongoDB or PostgreSQL

### Hosting
- Vercel

### API Integrations
- Mapbox API
- L2DataMapping (private API)
- Sendoso API
- Stripe API
- Twilio API

---

## Pricing Structure

### Original Quote
**Rate:** $35/hr  
**Total MVP Cost:** $6,000

### Revised Milestone-Based Pricing
**Client Request:** Can we break this up into milestones? And fixed costs?  
**Date:** Dec 17, 2025, 8:20 PM

#### Final Milestone Pricing

| Milestone | Description | Cost |
|-----------|-------------|------|
| **Milestone 1** | Map Foundation + L2DataMapping Integration | $1,400 |
| **Milestone 2** | Filter System | $1,400 |
| **Milestone 3** | Selection & Gift Flow | $1,400 |
| **Milestone 4** | Payment & Notifications | $1,800 |
| **TOTAL** | | **$6,000** |

---

# Storyboard for GodMode7.com MVP
**From:** Igor Cecoltan  
**Date:** Dec 22, 2025, 3:15 PM

## Panel 1 - Business Search (Start)
**Objective:** User searches for their business on the map

**Screen Elements:**
- Search bar at the top
- Map (Mapbox) displays surrounding area of the business
- Pins indicate other businesses or people nearby

**User Actions:**
- User types business name → hits search

**Visual Cues:**
- Map fills most of screen
- Highlighted pin shows user's business

---

## Panel 2 - Viewing Nearby People
**Objective:** User explores people in the surrounding area

**Screen Elements:**
- Map shows pins representing people (from L2DataMapping)
- Clicking a pin opens a popup/modal with details: name, image, basic info

**User Actions:**
- Tap a pin → view popup

**Visual Cues:**
- Popup appears at bottom or side, like SimCity info panels
- Option to "Add to Selection" visible

---

## Panel 3 - Filtering & Selecting
**Objective:** User filters people and selects recipients for gifts

**Screen Elements:**
- Filter panel slides from top or side (age, location, preferences)
- Map updates in real-time
- User taps multiple pins → pins are highlighted/checked

**User Actions:**
- Apply filters → map updates
- Select 1+ people → see a selection summary

**Visual Cues:**
- Friendly icons for filters (like Zillow)
- Selection summary at bottom shows "3 people selected"

---

## Panel 4 - Sending Gifts & Messages
**Objective:** User sends gifts and messages via Sendoso

**Screen Elements:**
- Gift catalog & message box

**User Actions:**
- Choose gift(s)
- Write message (optional)
- Click Send

**Visual Cues:**
- Visual confirmation of selections
- Progress animation like a "sending" effect

---

## Panel 5 - Payment & Confirmation
**Objective:** User pays and receives confirmation

**Screen Elements:**
- Stripe checkout integrated in-app
- Confirmation screen shows:
  - Recipients
  - Gift(s) sent
  - Estimated delivery time

**User Actions:**
- Complete payment → receive email + SMS confirmation via Twilio

**Visual Cues:**
- Mobile-friendly confirmation panel
- Optional "Share" or "Send another gift" buttons

---

# Project Clarifications & Approval

## Client Concern
**From:** Steve Lee  
**Date:** Dec 26, 2025, 6:55 PM

> "Let's revisit in the new year? I'm still not understanding the first $1600 deliverable. Is it just connecting the API and out of box? Or are you doing actual work to make it feel like a video game? Like loading it up through threeJS and making it interactive?"

## Developer Response
**From:** Igor Cecoltan  
**Date:** Dec 27, 2025, 12:59 AM

> "It's more than just plugging in the API. The $1,600 deliverable covers the API integration plus building an interactive prototype using Three.js so it feels like an early-stage game, not a static demo."

## Client Approval
**From:** Steve Lee  
**Date:** Dec 27, 2025, 1:49 AM

> "Okay let's move fwd"

---

# Team Communication Setup

## Communication Platform
**From:** Steve Lee  
**Date:** Dec 23, 2025, 6:27 AM

> "I use slack - Eric can you add him to slack?"

## Slack Invitation
**From:** Steve Lee to Eric Sim  
**Date:** Dec 27, 2025, 8:58 PM

> "Hey Eric - add Igor here to our slack as an external guest please. He will be helping me build a game called GodMode7. First milestone is the front end for the game for $1600."

## Confirmation
**From:** Eric Sim  
**Date:** Dec 29, 2025, 7:53 PM

> "Hi Igor - I added you to our slack channel, please accept and message us directly through there."

---

# Critical Client Feedback - Portfolio Examples & Extreme Simplicity

**From:** Client (Steve Lee)  
**Date:** January 2026  
**Context:** Review of initial design approach

## Client's Direct Requirements

> "Where it's simple and it walks you through like a video game...? Still feels complicated for a doctor. These examples from your portfolio feel like a video game... There's like 1 or 2 buttons only. Super simple walk thru to get them used to it - etc"

## Portfolio References Shared

**Developer's Portfolio Examples:**
- **KodeClubs.com** - 3D visuals, playful characters, achievement mechanics
- **ChooChooWorld.com** - Extremely minimal UI (1-2 buttons), immediate feedback

## Key Requirements Extracted

1. **1-2 buttons maximum** per screen - NO MORE
2. **Video game walkthrough** - mandatory step-by-step tutorial
3. **Still too complicated for doctors** - needs to be even simpler than initially planned
4. **Super simple walkthrough** - get users comfortable before independent use
5. **Feels like playing a game** - not using software (like portfolio examples)

## Impact on Design

- **UI Density:** Must reduce to 1-2 visible buttons/actions at any time
- **Onboarding:** Mandatory first-time tutorial with progress indicators
- **Complexity:** Simplify beyond initial Zillow-style filter approach
- **Visual Style:** Match portfolio examples (KodeClubs + ChooChooWorld feel)
- **User Guidance:** Step-by-step walkthrough with visual cues (arrows, highlights)

---

# Current Project Status

✅ **Project Approved:** Yes  
✅ **Milestones Defined:** 4 milestones at $1,400, $1,400, $1,400, $1,800  
✅ **Tech Stack Confirmed:** React + Three.js for game-like experience  
✅ **First Milestone:** $1,600 (includes interactive prototype with Three.js)  
✅ **Communication:** Slack channel setup complete  
✅ **Critical Requirements:** Extreme simplicity (1-2 buttons), mandatory walkthrough  
⏳ **Status:** Ready to begin development with updated simplicity requirements

---

*Last Updated: January 12, 2026*

