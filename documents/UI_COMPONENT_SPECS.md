# GodMode7.com - UI Component Specifications

## Component Library

### 1. Primary Button (1-2 buttons max per screen) - Game-Style

**Specifications:**
- **Height:** 64px (mobile), 56px (desktop) - larger, more prominent
- **Width:** Full width on mobile, max 320px on desktop
- **Border Radius:** 20px - very rounded, playful
- **Padding:** 20px horizontal
- **Font:** `Fredoka One` or `Nunito`, 20px, bold (700)
- **Text Transform:** Uppercase or Title Case
- **Colors:**
  - Background: `linear-gradient(135deg, #00D9FF 0%, #4A90E2 100%)` (vibrant gradient)
  - Text: `#FFFFFF` (white)
  - Hover: Gradient shifts brighter, adds glow
  - Active: Gradient darkens slightly
- **Shadow:** 
  - Default: `0 8px 24px rgba(74, 144, 226, 0.4)` (colorful shadow)
  - Hover: `0 12px 32px rgba(74, 144, 226, 0.5)` (stronger glow)
- **Border:** Optional 2px border in lighter shade
- **Animation:** 
  - Press: Scale 0.95 with bounce back (300ms, bounce easing)
  - Hover: Lift effect (translateY -2px) with glow increase
  - Transition: 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)

**Usage:**
- Only 1-2 primary buttons visible per screen
- Always clearly labeled action
- Large, thumb-friendly

---

### 2. Secondary Button (Back/Home)

**Specifications:**
- **Height:** 40px
- **Width:** Auto (content-based)
- **Border Radius:** 8px
- **Padding:** 8px 16px
- **Font Size:** 14px, medium
- **Colors:**
  - Background: Transparent
  - Text: `#6B7280` (gray-500)
  - Hover: `#F3F4F6` (gray-100)
- **Icon:** Left arrow (←) or home icon (🏠)

**Usage:**
- Top-left corner
- Always accessible
- Subtle, non-intrusive

---

### 3. Search Input

**Specifications:**
- **Height:** 56px
- **Width:** Full width
- **Border Radius:** 12px
- **Padding:** 16px 48px 16px 16px (icon on right)
- **Font Size:** 16px
- **Border:** 2px solid `#E5E7EB` (gray-200)
- **Focus:** 2px solid `#4F46E5` (indigo-600)
- **Icon:** Search icon (🔍) inside, right-aligned

**Usage:**
- Prominent placement
- Large, easy to tap
- Clear placeholder text

---

### 4. Progress Indicator - Game-Style

**Specifications:**
- **Type:** Progress bar + step counter + visual steps
- **Height:** 8px (bar - thicker, more visible), 24px (text)
- **Width:** Full width
- **Colors:**
  - Completed: `linear-gradient(90deg, #00FF88 0%, #39FF14 100%)` (bright gradient)
  - Remaining: `#E5E7EB` (light gray)
  - Active step: Glow effect
- **Text:** "Step X of 4" (16px, `Nunito`, bold, colorful)
- **Visual Steps:** 
  - Circular indicators for each step (filled/unfilled)
  - Icons or numbers in circles
  - Connected by progress bar
- **Animation:** 
  - Smooth fill with gradient animation
  - Bounce when step completes
  - Glow pulse on active step
- **Style:** Rounded ends, colorful, game-like

**Usage:**
- Always visible during walkthrough
- Top or bottom of screen
- Clear progress indication

---

### 5. Info Panel (Slide-up)

**Specifications:**
- **Height:** 40% of screen (mobile), 50% (desktop)
- **Width:** Full width
- **Position:** Bottom of screen
- **Background:** `#FFFFFF` (white)
- **Border Radius:** 20px 20px 0 0 (top corners rounded)
- **Shadow:** `0 -4px 20px rgba(0, 0, 0, 0.1)`
- **Padding:** 24px
- **Animation:** Slide up from bottom, 300ms ease-out

**Usage:**
- Person details
- Selection summary
- Action buttons inside panel

**Content Structure:**
```
┌─────────────────────────┐
│  [Person Info]          │
│  Name, Location, etc.   │
│                         │
│  [Action Button]        │
└─────────────────────────┘
```

---

### 6. Filter Panel (Slide-in)

**Specifications:**
- **Width:** 85% of screen (mobile), 400px (desktop)
- **Height:** Full height
- **Position:** Right side (or bottom on mobile)
- **Background:** `#FFFFFF` (white)
- **Shadow:** `-4px 0 20px rgba(0, 0, 0, 0.1)`
- **Padding:** 24px
- **Animation:** Slide in from right, 300ms ease-out
- **Overlay:** Dimmed background (50% opacity black)

**Usage:**
- Filter options
- Settings
- Secondary actions

---

### 7. Person Pin (Map Marker) - Game-Style

**Specifications:**
- **Size:** 36x36px (default), 48x48px (selected) - larger, more visible
- **Shape:** Circular with icon, or custom game-style shape
- **Colors:**
  - Default: `#4A90E2` (bright blue) with gradient
  - Selected: `#00FF88` (bright green) with glow
  - Hover: `#A855F7` (purple) with pulse
- **Background:** 
  - Gradient: `radial-gradient(circle, #00D9FF 0%, #4A90E2 100%)`
  - Selected: `radial-gradient(circle, #00FF88 0%, #39FF14 100%)`
- **Icon:** 
  - Emoji: 👤 (person), 🎯 (target), ⭐ (star)
  - Custom SVG: Rounded, colorful, illustrated style
- **Border:** 3px white border for contrast
- **Shadow:** 
  - Default: `0 4px 12px rgba(74, 144, 226, 0.4)` (colorful)
  - Selected: `0 6px 20px rgba(0, 255, 136, 0.5)` (glow effect)
- **Animation:** 
  - Pulse: Scale 1 → 1.1 → 1, 1.5s infinite (subtle)
  - Hover: Scale 1.15, glow increases
  - Tap: Scale 0.9 → 1.1 → 1 (bounce)

**Usage:**
- Map markers for people
- Clustered when zoomed out
- Clickable to show details

---

### 8. Achievement Badge - Game-Style

**Specifications:**
- **Size:** 80x80px - larger, more prominent
- **Shape:** Circular with decorative border, or star shape
- **Colors:** 
  - Background: `linear-gradient(135deg, #FF6B35 0%, #FFD93D 100%)` (warm gradient)
  - Border: Gold/yellow glow effect
- **Icon:** 
  - Large emoji: 🏆 (trophy), ⭐ (star), 🎯 (target), 🎉 (celebration)
  - Custom illustrated icon (colorful, rounded)
- **Shadow:** 
  - `0 8px 24px rgba(255, 107, 53, 0.5)` (colorful glow)
  - Multiple shadow layers for depth
- **Animation:** 
  - Appear: Scale 0 → 1.2 → 1, 600ms bounce with rotation
  - Pulse: Scale 1 → 1.1 → 1, 2s infinite (continuous)
  - Shine: Rotating gradient overlay (optional)
- **Position:** Top-right corner with bounce-in entrance
- **Text:** Achievement name below badge (14px, `Fredoka One`, bold)

**Usage:**
- Unlock notifications
- Progress milestones
- Gamification element

---

### 9. Selection Counter

**Specifications:**
- **Position:** Bottom of screen (fixed)
- **Height:** 60px
- **Width:** Full width
- **Background:** `#4F46E5` (indigo-600)
- **Text:** White, 16px, bold
- **Content:** "👥 X people selected"
- **Padding:** 16px
- **Shadow:** `0 -2px 10px rgba(0, 0, 0, 0.1)`

**Usage:**
- Show selected count
- Always visible when selections exist
- Can contain action button

---

### 10. Gift Card

**Specifications:**
- **Height:** 120px
- **Width:** Full width (mobile), 300px (desktop)
- **Border Radius:** 12px
- **Padding:** 16px
- **Background:** `#FFFFFF` (white)
- **Border:** 2px solid `#E5E7EB` (gray-200)
- **Shadow:** `0 2px 4px rgba(0, 0, 0, 0.05)`
- **Selected:** Border `#4F46E5`, shadow increased

**Content:**
- Gift icon/image (left)
- Title and description (center)
- Price (right)
- Select button (bottom)

---

## Layout Grid System

### Mobile (320px - 768px)
- **Columns:** 1 (single column)
- **Gutter:** 16px
- **Margin:** 16px
- **Max Width:** Full width

### Desktop (769px+)
- **Columns:** 12
- **Gutter:** 24px
- **Margin:** 24px
- **Max Width:** 1200px (centered)

---

## Spacing Scale

- **XS:** 4px
- **SM:** 8px
- **MD:** 16px
- **LG:** 24px
- **XL:** 32px
- **2XL:** 48px
- **3XL:** 64px

**Usage:**
- Between buttons: LG (24px)
- Section spacing: XL (32px)
- Screen padding: MD (16px)

---

## Typography Scale (Game-Style)

### Font Families
**Primary Game Fonts (Google Fonts):**
- **Display/Headings:** `Fredoka One` or `Bungee` (bold, chunky, playful)
- **Body/UI:** `Nunito` or `Poppins` (friendly, rounded, readable)
- **Fallback:** `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

**Font Loading:**
```css
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
```

### Headings
- **H1/Display:** 40-48px, `Fredoka One`, bold, letter-spacing: 0.02em
- **H2:** 28-32px, `Fredoka One` or `Nunito`, bold, letter-spacing: 0.01em
- **H3:** 22-24px, `Nunito`, semibold (600)

### Body
- **Large:** 18px, `Nunito`, regular (400), line-height: 1.6
- **Medium:** 16px, `Nunito`, regular (400), line-height: 1.6
- **Small:** 14px, `Nunito`, regular (400), line-height: 1.5

### Buttons
- **Primary:** 20px, `Fredoka One` or `Nunito`, bold (700), uppercase or title case
- **Secondary:** 16px, `Nunito`, semibold (600)

### Special Text
- **Achievements:** 24px, `Fredoka One`, bold, colorful gradient text
- **Numbers/Stats:** 32px, `Fredoka One`, bold, vibrant colors
- **Labels:** 14px, `Nunito`, semibold (600), uppercase, letter-spacing: 0.05em

---

## Color Palette (Game-Style)

### Primary Colors (Vibrant, Playful)
- **Cyan/Blue:** `#00D9FF` (primary buttons, main actions)
- **Blue:** `#4A90E2` (secondary actions, links)
- **Blue Dark:** `#357ABD` (hover states)
- **Blue Gradient:** `linear-gradient(135deg, #00D9FF 0%, #4A90E2 100%)`

### Success Colors (Bright, Positive)
- **Green:** `#00FF88` (success, achievements, positive actions)
- **Green Dark:** `#00CC6A` (hover states)
- **Green Gradient:** `linear-gradient(135deg, #00FF88 0%, #39FF14 100%)`

### Accent Colors (Gamification, Fun)
- **Orange:** `#FF6B35` (achievements, highlights, warnings)
- **Yellow:** `#FFD93D` (gold, special features, rewards)
- **Purple:** `#A855F7` (special actions, premium features)
- **Pink:** `#FF6B9D` (playful accents, celebrations)

### Neutral Colors (Readable, Clean)
- **White:** `#FFFFFF` (backgrounds, cards)
- **Light Gray:** `#F5F7FA` (subtle backgrounds)
- **Gray:** `#E5E7EB` (borders, dividers)
- **Dark Gray:** `#6B7280` (secondary text)
- **Black:** `#1F2937` (primary text)

### Gradient Backgrounds (Game-Style)
- **Primary Gradient:** `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Success Gradient:** `linear-gradient(135deg, #00FF88 0%, #39FF14 100%)`
- **Energy Gradient:** `linear-gradient(135deg, #00D9FF 0%, #4A90E2 100%)`
- **Warm Gradient:** `linear-gradient(135deg, #FF6B35 0%, #FFD93D 100%)`
- **Cool Gradient:** `linear-gradient(135deg, #4A90E2 0%, #00D9FF 100%)`

### Shadow Colors (Colorful, Game-Like)
- **Blue Shadow:** `0 8px 24px rgba(74, 144, 226, 0.3)`
- **Green Shadow:** `0 8px 24px rgba(0, 255, 136, 0.3)`
- **Orange Shadow:** `0 8px 24px rgba(255, 107, 53, 0.3)`
- **Multi-color Glow:** `0 0 20px rgba(74, 144, 226, 0.5), 0 0 40px rgba(0, 217, 255, 0.3)`

---

## Animation Specifications (Game-Style)

### Transitions
- **Fast:** 150ms (micro-interactions, hover states)
- **Normal:** 200-300ms (standard transitions, panel slides)
- **Slow:** 400-600ms (major state changes, achievements)

### Easing Functions (Playful, Bouncy)
- **Bounce (Primary):** `cubic-bezier(0.68, -0.55, 0.265, 1.55)` - for buttons, achievements
- **Ease-out (Smooth):** `cubic-bezier(0.0, 0, 0.2, 1)` - for panels, fades
- **Ease-in-out (Natural):** `cubic-bezier(0.4, 0, 0.2, 1)` - for transforms
- **Elastic:** `cubic-bezier(0.175, 0.885, 0.32, 1.275)` - for special effects

### Common Animations
- **Fade In:** Opacity 0 → 1, 200ms ease-out
- **Slide Up:** Transform translateY(20px) → 0, 300ms bounce
- **Scale:** Transform scale(0.8) → 1, 300ms bounce (achievements)
- **Pulse:** Scale 1 → 1.1 → 1, 1.5s infinite ease-in-out
- **Glow:** Box-shadow intensity increase, 1s infinite
- **Bounce:** Scale 0.9 → 1.1 → 1, 400ms bounce (button press)
- **Shake:** TranslateX -5px → 5px → -5px → 0, 300ms (errors)

### Common Animations
- **Fade In:** Opacity 0 → 1, 200ms
- **Slide Up:** Transform translateY(20px) → 0, 300ms
- **Scale:** Transform scale(0.95) → 1, 200ms
- **Pulse:** Scale 1 → 1.05 → 1, 1s infinite

---

## Accessibility Requirements

### Contrast Ratios
- **Text:** Minimum 4.5:1 (WCAG AA)
- **Large Text:** Minimum 3:1 (WCAG AA)
- **Interactive Elements:** Minimum 3:1 (WCAG AA)

### Touch Targets
- **Minimum Size:** 44x44px (iOS), 48x48px (Android)
- **Spacing:** 8px minimum between targets

### Focus States
- **Outline:** 2px solid `#4F46E5`
- **Offset:** 2px from element
- **Visible:** Always visible on keyboard navigation

### Screen Reader Support
- **Labels:** All interactive elements labeled
- **ARIA:** Proper roles and states
- **Announcements:** Dynamic content changes announced

---

## Responsive Breakpoints

- **Mobile:** 320px - 640px
- **Tablet:** 641px - 1024px
- **Desktop:** 1025px+

**Mobile-First Approach:**
- Design for mobile first
- Progressive enhancement for larger screens
- Touch-friendly on all devices

---

## Component States

### Button States
1. **Default:** Normal appearance
2. **Hover:** Slightly darker, scale 1.02
3. **Active/Pressed:** Scale 0.98, darker
4. **Disabled:** 50% opacity, no interaction
5. **Loading:** Spinner icon, disabled state

### Input States
1. **Default:** Normal border
2. **Focus:** Colored border, shadow
3. **Error:** Red border, error message
4. **Success:** Green border (optional)
5. **Disabled:** Gray background, no interaction

### Panel States
1. **Hidden:** Off-screen (transform)
2. **Visible:** On-screen, animated in
3. **Closing:** Animated out

---

## Icon System (Game-Style)

### Icon Library
- **Style:** 
  - **Rounded, friendly, illustrated** - no sharp edges
  - **Colorful, vibrant** - matching game theme
  - **3D effect** - subtle depth and shadow
  - **Emoji-based** - can use native emoji (most accessible)
- **Size:** 
  - Default: 28px (larger, easier to see)
  - Large: 40px (prominent actions)
  - Small: 20px (secondary elements)
- **Format:** 
  - **Emoji** (native, colorful, no loading)
  - **Custom SVG** (illustrated, rounded style)
  - **Icon fonts** (Phosphor Icons, Game Icons)
- **Color:** 
  - Vibrant theme colors
  - Gradient fills (optional)
  - Glow effects on interactive icons

### Common Icons (Emoji + Custom)
- 🔍 **Search** - Magnifying glass emoji or custom
- 🏠 **Home** - House emoji or custom
- ⚙️ **Settings/Filters** - Gear emoji or custom
- 👤 **Person** - Person emoji or custom
- 📍 **Location/Pin** - Pin emoji or custom
- 💰 **Money/Price** - Money emoji or custom
- 🎁 **Gift** - Gift emoji or custom
- ✅ **Check/Success** - Checkmark emoji or custom
- 🎯 **Target** - Target emoji (for selection)
- 🎮 **Game/Play** - Game controller emoji
- 🏆 **Achievement** - Trophy emoji
- ⭐ **Star** - Star emoji (ratings, favorites)
- 🎉 **Celebration** - Party emoji (success)
- ← **Back** - Arrow emoji or custom
- → **Next** - Arrow emoji or custom
- 📦 **Package** - Package emoji (gifts)
- 📧 **Email** - Email emoji
- 📱 **SMS/Phone** - Phone emoji
- 🗺️ **Map** - Map emoji
- 🎨 **Customize** - Paintbrush emoji

### Icon Usage Guidelines
- **Emoji for simplicity** - Native, colorful, no loading
- **Custom SVG for branding** - Illustrated, matches game style
- **Large size** - Easy to tap, clear visibility
- **Colorful** - Vibrant, matching game theme
- **Consistent style** - All icons follow same rounded, friendly aesthetic

---

## Game-Style Font Implementation

### Google Fonts Setup

**HTML Head:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&family=Bungee&display=swap" rel="stylesheet">
```

**CSS Variables:**
```css
:root {
  --font-display: 'Fredoka One', 'Bungee', cursive;
  --font-body: 'Nunito', 'Poppins', -apple-system, sans-serif;
  --font-game: 'Bungee', 'Fredoka One', cursive;
}
```

**Tailwind Config:**
```js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        'display': ['Fredoka One', 'cursive'],
        'body': ['Nunito', 'sans-serif'],
        'game': ['Bungee', 'cursive'],
      },
    },
  },
}
```

### Font Loading Strategy
- **Preload critical fonts** (Fredoka One, Nunito)
- **Display: swap** for faster rendering
- **Fallback fonts** for immediate text display

---

*Component Specifications created: January 12, 2026*  
*Design System: Game-Style (KodeClubs.com + ChooChooWorld.com inspired)*  
*Fonts: Fredoka One, Nunito, Bungee (Google Fonts)*

