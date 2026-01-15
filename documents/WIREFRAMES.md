# GodMode7.com - Wireframes & Mockups

## Design Philosophy
- **1-2 buttons maximum** per screen
- **Video game walkthrough** feel (like KodeClubs.com + ChooChooWorld.com)
- **Doctor-friendly** - extremely simple, no confusion
- **Mobile-first** - large touch targets, thumb-friendly

---

## 🎮 First-Time User Walkthrough Flow

### Screen 1: Welcome / Onboarding Start

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│         🎮 GodMode7                │
│                                     │
│    "Find customers like playing      │
│     a video game"                   │
│                                     │
│    ┌─────────────────────────┐     │
│    │   Let's Start! 🚀       │     │
│    └─────────────────────────┘     │
│                                     │
│    Step 1 of 4                      │
│    [████░░░░░░░░] 25%               │
│                                     │
└─────────────────────────────────────┘
```

**UI Elements:**
- **1 button only:** "Let's Start!" (large, prominent, 60px height)
- Progress bar: "Step 1 of 4"
- Minimal text: One sentence explanation
- Game-like logo/icon at top
- Soft background animation (subtle)

**Design Notes:**
- Match ChooChooWorld.com minimalism
- Big, friendly button (like KodeClubs.com style)
- No other clickable elements
- Smooth fade-in animation

---

### Screen 2: Find Your Business (Tutorial)

```
┌─────────────────────────────────────┐
│  ← Back                             │
│                                     │
│  "Find your business location"      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔍 Search your business...  │   │ ← Highlighted with arrow
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────┐       │
│  │      Search            │       │
│  └─────────────────────────┘       │
│                                     │
│  Step 2 of 4                        │
│  [████████░░░░] 50%                 │
│                                     │
│  💡 Tip: Type your business name    │
│                                     │
└─────────────────────────────────────┘
```

**UI Elements:**
- **1 button:** "Search" (only appears after typing)
- Search bar highlighted with animated arrow pointing to it
- Progress indicator
- Helpful tip text (non-intrusive)
- Back button (small, top-left)

**Design Notes:**
- Tutorial overlay highlights search bar
- Button only appears when user types (progressive disclosure)
- Smooth transition from welcome screen
- Achievement unlock: "Business Finder!" badge after search

---

### Screen 3: Explore Your Area (Tutorial)

```
┌─────────────────────────────────────┐
│  ← Back                             │
│                                     │
│  "Your business area"                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │      🗺️ MAP VIEW            │   │
│  │                             │   │
│  │    📍  📍  📍               │   │
│  │                             │   │
│  │  👆 Tap a pin to see         │   │
│  │     customer info            │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────┐       │
│  │      Next Step →        │       │
│  └─────────────────────────┘       │
│                                     │
│  Step 3 of 4                        │
│  [████████████░░] 75%               │
│                                     │
└─────────────────────────────────────┘
```

**UI Elements:**
- **1 button:** "Next Step" (appears after tapping a pin)
- Map fills most of screen
- Pins visible (person data points)
- Tutorial tooltip: "Tap a pin to see customer info"
- Highlighted pin with pulsing animation

**Design Notes:**
- Three.js game-like map rendering
- Pins have hover/tap feedback
- Achievement unlock: "Explorer!" badge after tapping pin
- Smooth map animations (like KodeClubs.com transitions)

---

### Screen 4: Send Your First Gift (Tutorial)

```
┌─────────────────────────────────────┐
│  ← Back                             │
│                                     │
│  "Send a gift to your customers"    │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  📦 Gift Selected          │   │
│  │  💌 Message: "Thank you!"  │   │
│  │  👥 1 person selected      │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────┐       │
│  │   Send Gift 🎁          │       │ ← Highlighted
│  └─────────────────────────┘       │
│                                     │
│  Step 4 of 4                        │
│  [████████████████] 100%            │
│                                     │
└─────────────────────────────────────┘
```

**UI Elements:**
- **1 button:** "Send Gift" (large, highlighted)
- Selection summary (gift, message, count)
- Progress bar at 100%
- Back button (top-left)

**Design Notes:**
- Button highlighted with pulsing animation
- After click: Confetti animation + "First Gift Sent!" achievement
- Success message: "You're all set! You can now use GodMode7 on your own."
- Smooth transition to main app

---

## 🎯 Main App Flow (Post-Walkthrough)

### Screen A: Business Search (Main Flow)

```
┌─────────────────────────────────────┐
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔍 Search your business... │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────┐       │
│  │      Search            │       │
│  └─────────────────────────┘       │
│                                     │
│  Recent searches:                   │
│  • Dr. Smith's Clinic               │
│  • Downtown Medical Center          │
│                                     │
└─────────────────────────────────────┘
```

**UI Elements:**
- **1 button:** "Search"
- Search input field
- Recent searches (optional, non-intrusive)
- No other buttons

---

### Screen B: Map View with People Pins

```
┌─────────────────────────────────────┐
│  🏠 My Business    ⚙️ Filters       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │      🗺️ INTERACTIVE MAP     │   │
│  │                             │   │
│  │    📍 📍 📍 📍 📍          │   │
│  │                             │   │
│  │    [Pin clusters when       │   │
│  │     zoomed out]             │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  👥 127 people nearby               │
│                                     │
└─────────────────────────────────────┘
```

**UI Elements:**
- **2 buttons:** "My Business" (home) + "Filters" (settings)
- Map with pins (Three.js rendered)
- People count indicator
- Pin clustering when zoomed out

**Design Notes:**
- Filters button opens slide-in panel (not a new screen)
- Tap pin → info panel slides up from bottom
- Smooth zoom/pan animations
- Game-like visual style (SimCity-esque)

---

### Screen C: Pin Detail Panel (Slide-up)

```
┌─────────────────────────────────────┐
│  🏠 My Business    ⚙️ Filters       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      🗺️ MAP (zoomed)       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 👤 John Smith               │   │
│  │ 📍 123 Main St, City        │   │
│  │ 💰 Income: $75K-$100K       │   │
│  │ 🎂 Age: 45                  │   │
│  │                             │   │
│  │ ┌───────────────────────┐   │   │
│  │ │   Select Person ✓     │   │   │
│  │ └───────────────────────┘   │   │
│  └─────────────────────────────┘   │
│                                     │
│  👥 1 selected                      │
└─────────────────────────────────────┘
```

**UI Elements:**
- **1 button:** "Select Person" (in panel)
- Info panel slides up from bottom (SimCity-style)
- Key info only: Name, Location, Income, Age
- Selection counter at bottom

**Design Notes:**
- Panel takes 40% of screen height
- Tap outside panel to close
- Smooth slide animation
- Can select multiple people (counter updates)

---

### Screen D: Filters Panel (Slide-in)

```
┌─────────────────────────────────────┐
│  🏠 My Business    ⚙️ Filters       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      🗺️ MAP (background)    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Filters                    │   │
│  │  ────────────────────────   │   │
│  │                             │   │
│  │  💰 Income                  │   │
│  │  ○ $50K-$75K               │   │
│  │  ● $75K-$100K              │   │
│  │  ○ $100K+                  │   │
│  │                             │   │
│  │  🎂 Age Range               │   │
│  │  [25] ──────── [65]         │   │
│  │                             │   │
│  │  ┌───────────────────────┐  │   │
│  │  │   Apply Filters       │  │  │
│  │  └───────────────────────┘  │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**UI Elements:**
- **1 button:** "Apply Filters"
- Filter options (income, age, etc.)
- Panel slides in from right (or bottom on mobile)
- Map visible in background (dimmed)

**Design Notes:**
- Zillow-style filter UI but simpler
- Friendly icons for each filter type
- Real-time preview (map updates as filters change)
- Max 3-4 filter categories visible (scroll if more)

---

### Screen E: Gift Selection

```
┌─────────────────────────────────────┐
│  ← Back                             │
│                                     │
│  "Choose a gift"                    │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  📦 Coffee Gift Card         │   │
│  │  $25                         │   │
│  │  ┌───────────────────────┐  │   │
│  │  │   Select Gift         │  │  │
│  │  └───────────────────────┘  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  🎁 Gift Basket             │   │
│  │  $50                         │   │
│  └─────────────────────────────┘   │
│                                     │
│  👥 3 people selected               │
│                                     │
└─────────────────────────────────────┘
```

**UI Elements:**
- **1 button per gift:** "Select Gift"
- Gift cards shown as large cards
- Selection counter visible
- Back button (top-left)

**Design Notes:**
- Visual gift catalog (images/icons)
- One gift per row (easy to tap)
- Selected gift highlighted
- Smooth scrolling

---

### Screen F: Message & Send

```
┌─────────────────────────────────────┐
│  ← Back                             │
│                                     │
│  "Add a message (optional)"         │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Type your message here...  │   │
│  │                             │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────┐       │
│  │   Continue →            │       │
│  └─────────────────────────┘       │
│                                     │
│  📦 Coffee Gift Card                │
│  👥 3 people                        │
│  💰 Total: $75                      │
│                                     │
└─────────────────────────────────────┘
```

**UI Elements:**
- **1 button:** "Continue"
- Message input (optional)
- Order summary (gift, count, total)
- Back button

**Design Notes:**
- Message is optional (can skip)
- Order summary always visible
- Button text changes to "Send" on final step

---

### Screen G: Payment (Stripe)

```
┌─────────────────────────────────────┐
│  ← Back                             │
│                                     │
│  "Complete your order"              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  📦 Coffee Gift Card        │   │
│  │  👥 3 people               │   │
│  │  💰 Total: $75             │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Stripe Payment Form]              │
│  Card number, expiry, CVC           │
│                                     │
│  ┌─────────────────────────┐       │
│  │   Pay $75               │       │
│  └─────────────────────────┘       │
│                                     │
└─────────────────────────────────────┘
```

**UI Elements:**
- **1 button:** "Pay $75"
- Stripe payment form
- Order summary
- Back button

**Design Notes:**
- Stripe embedded checkout
- Clear total amount
- Secure payment indicator

---

### Screen H: Success / Confirmation

```
┌─────────────────────────────────────┐
│                                     │
│         🎉 Success!                 │
│                                     │
│    Your gifts are being sent!       │
│                                     │
│    📧 Email confirmation sent        │
│    📱 SMS confirmation sent          │
│                                     │
│    ┌─────────────────────────┐     │
│    │   Done ✓               │     │
│    └─────────────────────────┘     │
│                                     │
│    🏆 Achievement Unlocked:         │
│    "First Campaign!"                │
│                                     │
└─────────────────────────────────────┘
```

**UI Elements:**
- **1 button:** "Done"
- Success message
- Confirmation details
- Achievement badge

**Design Notes:**
- Confetti animation on load
- Achievement unlock notification
- Clear next steps (or return to map)

---

## 🎨 Visual Style Guidelines

### Color Palette (Game-Style)
- **Primary:** Vibrant blue/cyan (`#00D9FF`, `#4A90E2`) - playful, energetic
- **Secondary:** Bright green (`#00FF88`, `#39FF14`) - success, positive
- **Accent:** Warm orange/yellow (`#FF6B35`, `#FFD93D`) - achievements, highlights
- **Background:** Soft gradients (light blue to white, or subtle patterns)
- **Text:** High contrast, readable (dark on light, light on dark)
- **Shadows:** Colorful, soft shadows (not just gray) - adds depth

### Typography (Game-Style Fonts)

**Primary Font Family:**
- **Headings:** `Fredoka One`, `Bungee`, or `Comfortaa` (rounded, playful, bold)
- **Body:** `Nunito`, `Poppins`, or `Quicksand` (friendly, rounded sans-serif)
- **Display/Logo:** `Bungee` or custom game font (bold, chunky)

**Font Recommendations (Google Fonts):**
1. **Fredoka One** - Rounded, friendly, perfect for buttons and headings
2. **Nunito** - Soft, rounded, very readable
3. **Comfortaa** - Geometric but friendly
4. **Poppins** - Modern, rounded, professional yet playful
5. **Bungee** - Bold, chunky, perfect for game titles

**Typography Scale:**
- **H1/Display:** 36-48px, `Fredoka One` or `Bungee`, bold
- **H2/Headings:** 28-32px, `Fredoka One` or `Nunito`, bold
- **H3/Subheadings:** 20-24px, `Nunito` or `Poppins`, semibold
- **Body:** 16-18px, `Nunito` or `Poppins`, regular
- **Buttons:** 18-20px, `Fredoka One` or `Nunito`, bold
- **Small Text:** 14px, `Nunito`, regular

**Font Characteristics:**
- **Rounded corners** on letters (not sharp/geometric)
- **Bold weights** for emphasis
- **Letter spacing:** Slightly increased for headings
- **Line height:** Generous (1.5-1.8) for readability

### Button Specifications (Game-Style)
- **Size:** Minimum 44x44px (iOS standard)
- **Height:** 56-64px for primary buttons (larger, more prominent)
- **Style:** 
  - **Rounded corners:** 16-20px radius (very rounded, playful)
  - **Gradient backgrounds:** Colorful gradients (blue to cyan, etc.)
  - **3D effect:** Subtle inset/outset shadows for depth
  - **Border:** Optional colorful border (2-3px)
- **Spacing:** Generous padding (20-24px)
- **Colors:** 
  - Vibrant, saturated colors
  - Gradient backgrounds
  - Glow effect on hover
- **Text:** Bold, uppercase or title case, game font
- **Shadow:** Colorful shadow matching button color

### Animations (Game-Style)
- **Transitions:** Bouncy, playful (not just smooth)
- **Easing:** `cubic-bezier(0.68, -0.55, 0.265, 1.55)` for bounce
- **Feedback:** 
  - Button press: Scale down (0.95) with bounce back
  - Hover: Slight lift (translateY -2px) with glow
  - Success: Confetti, particle effects, bounce animations
- **Loading:** 
  - Animated spinners with colors
  - Progress bars with gradient fills
  - Pulsing animations
- **Success:** 
  - Confetti particles
  - Badge unlock with bounce
  - Celebration animations
  - Sound effects (optional, subtle)

### Icons (Game-Style)
- **Style:** 
  - **Rounded, friendly** - no sharp edges
  - **Illustrated/custom** - not minimalist line icons
  - **Colorful** - vibrant, matching theme
  - **Emoji-style** - can use emoji as icons (🎮, 🎯, 🎁, etc.)
  - **3D effect** - subtle depth/shadow
- **Size:** Large (28-40px) - easy to see and tap
- **Usage:** 
  - Visual over text when possible
  - Can be emoji-based for familiarity
  - Custom illustrated icons preferred
- **Icon Libraries:**
  - **Emoji** (native, colorful, friendly)
  - **Custom SVG** (illustrated, rounded)
  - **Game icon packs** (Phosphor Icons, Game Icons, etc.)

### Visual Effects (Game-Style)
- **Gradients:** Colorful gradients everywhere (buttons, backgrounds, cards)
- **Shadows:** 
  - Colorful shadows (not just gray)
  - Soft, diffused
  - Multiple layers for depth
- **Borders:** 
  - Rounded (16-20px radius)
  - Optional colorful borders
  - Glow effects on interactive elements
- **Backgrounds:**
  - Subtle patterns or textures
  - Gradient overlays
  - Animated backgrounds (optional, subtle)

---

## 📱 Mobile-Specific Considerations

### Touch Targets
- Minimum 44x44px (iOS) / 48x48px (Android)
- Generous spacing between buttons
- Thumb-friendly zones (bottom 1/3 of screen)

### Gestures
- **Swipe:** Panels slide in/out
- **Tap:** Primary interaction
- **Pinch:** Map zoom (optional)
- **Long press:** Context menu (advanced, optional)

### Layout
- **Single column:** Stack elements vertically
- **Full width:** Buttons span screen width
- **Bottom placement:** Primary actions at bottom
- **Top placement:** Navigation/back buttons

---

## 🎮 Game-Like Elements

### Achievements System
- "Business Finder!" - Found business
- "Explorer!" - Tapped first pin
- "First Gift Sent!" - Completed first campaign
- "Campaign Master!" - Sent 10 gifts
- Visual badges appear in corner

### Progress Indicators
- Step counters: "Step X of 4"
- Progress bars: Visual completion
- Loading states: Game-like spinners

### Visual Feedback
- **Tap:** Button press animation
- **Success:** Confetti, badge unlock
- **Error:** Friendly error message
- **Loading:** Animated progress

---

## ✅ Design Checklist

- [ ] Maximum 1-2 buttons per screen
- [ ] Large touch targets (44px+)
- [ ] Mandatory walkthrough on first use
- [ ] Progress indicators visible
- [ ] Game-like visual style (portfolio match)
- [ ] Smooth animations
- [ ] High contrast text
- [ ] Mobile-first layout
- [ ] Achievement system
- [ ] Self-explanatory (no instructions needed)

---

*Wireframes created: January 12, 2026*  
*Design Style: KodeClubs.com + ChooChooWorld.com minimalism*

