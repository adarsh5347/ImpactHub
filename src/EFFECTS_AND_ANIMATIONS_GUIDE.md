# ImpactHub - Effects and Animations Guide

## Overview
This document explains all the visual effects, animations, and interactive elements used throughout the ImpactHub platform, including how they work and where they are implemented.

---

## Table of Contents
1. [Splash Screen Animation](#splash-screen-animation)
2. [Navigation Effects](#navigation-effects)
3. [Landing Page Animations](#landing-page-animations)
4. [Card Hover Effects](#card-hover-effects)
5. [Form Interactions](#form-interactions)
6. [Button Effects](#button-effects)
7. [Transition Animations](#transition-animations)
8. [Loading States](#loading-states)
9. [Scroll Animations](#scroll-animations)
10. [Gradient Effects](#gradient-effects)
11. [Performance Optimization](#performance-optimization)

---

## Splash Screen Animation

**Location:** `/components/SplashScreen.tsx`

### How It Works
The splash screen is a full-screen overlay that displays on initial page load for 3 seconds.

### Animation Details

```typescript
// Component mounts and starts timer
useEffect(() => {
  const timer = setTimeout(() => {
    onComplete(); // Calls parent function to hide splash
  }, 3000); // 3 second duration
  
  return () => clearTimeout(timer);
}, [onComplete]);
```

### CSS Animations Used

1. **Pop Animation** (Logo)
```css
@keyframes pop {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```
- **Duration:** 1 second
- **Timing:** ease-in-out
- **Behavior:** Logo scales up to 105% at midpoint, then back to 100%

2. **Fade-In Animation** (Tagline)
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```
- **Duration:** 0.8 seconds
- **Delay:** 0.3 seconds (starts after logo appears)
- **Behavior:** Text gradually becomes visible

### Background Effect
- **Gradient:** Blue-to-teal gradient background (`bg-gradient-to-br from-primary to-[#0ea5e9]`)
- **Blur Effect:** Backdrop filter blur for depth

### Implementation
```tsx
<div className="fixed inset-0 z-50 flex flex-col items-center justify-center 
     bg-gradient-to-br from-primary to-[#0ea5e9]">
  {/* Logo with pop animation */}
  <div className="text-white text-6xl font-bold mb-4 
       animate-[pop_1s_ease-in-out]">
    ImpactHub
  </div>
  
  {/* Tagline with fade-in */}
  <p className="text-white/90 text-xl 
      animate-[fadeIn_0.8s_ease-in_0.3s_both]">
    Making Every Contribution Count
  </p>
</div>
```

---

## Navigation Effects

**Location:** `/components/Navigation.tsx`

### Sticky Navigation
```css
className="sticky top-0 z-50"
```
- **Behavior:** Navigation bar stays at top when scrolling
- **Z-Index:** 50 (appears above most content)

### Backdrop Blur Effect
```css
className="bg-white/95 backdrop-blur-md"
```
- **Background:** 95% opacity white
- **Blur:** Medium blur on content behind nav
- **Result:** Frosted glass effect

### Logo Hover Effect
```tsx
<div className="group">
  <span className="group-hover:text-primary transition-colors">
    ImpactHub
  </span>
</div>
```
- **Trigger:** Mouse hover
- **Effect:** Text color changes to primary blue
- **Duration:** Default transition (0.15s)

### Navigation Link Hover
```tsx
<button className="hover:text-primary hover:scale-105 
         transition-all duration-200">
  {/* Link text */}
</button>
```
- **Color Change:** Gray to primary blue
- **Scale:** Increases to 105%
- **Duration:** 200ms
- **Easing:** Default ease

### Dropdown Menu Animation
```tsx
<div className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl 
     bg-white ring-1 ring-black ring-opacity-5 
     transform opacity-0 scale-95 
     transition-all duration-200 ease-out">
```
- **Initial State:** Invisible, scaled to 95%
- **Animated State:** Fully visible, 100% scale
- **Duration:** 200ms
- **Shadow:** Extra large shadow for depth

---

## Landing Page Animations

**Location:** `/pages/LandingPage.tsx`

### Hero Section Background Effects

1. **Gradient Background**
```css
className="bg-gradient-to-br from-[#0a4a70] via-[#0f5e8e] to-[#0ea5e9]"
```
- **Type:** Multi-stop gradient
- **Colors:** Dark blue → Medium blue → Light blue
- **Direction:** Bottom-right diagonal

2. **Pattern Overlay**
```css
className="bg-[url('data:image/svg+xml...')] opacity-10"
```
- **Pattern:** Grid pattern from SVG data URI
- **Opacity:** 10% for subtle texture

3. **Animated Circles**
```tsx
{/* Circle 1 */}
<div className="absolute top-20 left-10 w-72 h-72 
     bg-white/5 rounded-full blur-3xl animate-pulse">
</div>

{/* Circle 2 with delay */}
<div className="absolute bottom-20 right-10 w-96 h-96 
     bg-secondary/20 rounded-full blur-3xl animate-pulse" 
     style={{ animationDelay: '1s' }}>
</div>
```
- **Pulse Animation:** Built-in Tailwind animation
- **Behavior:** Opacity fades in and out
- **Delay:** Second circle starts 1 second after first
- **Blur:** Heavy blur (3xl) for soft glow effect

### Badge Animation
```tsx
<div className="inline-flex items-center gap-2 px-5 py-2.5 
     bg-white/10 backdrop-blur-md rounded-full border border-white/20 
     shadow-lg">
  <Sparkles className="w-4 h-4 text-yellow-300" />
  <span>Empowering Communities Through Volunteering</span>
</div>
```
- **Background:** Semi-transparent white with blur
- **Border:** Subtle white border with opacity
- **Shadow:** Large shadow for depth

### Button Hover Effects

1. **Primary CTA Button**
```tsx
<Button className="bg-white text-primary 
         hover:bg-gray-100 hover:scale-105 
         transition-all shadow-xl hover:shadow-2xl">
```
- **Background Change:** White → Light gray
- **Scale:** 100% → 105%
- **Shadow Growth:** XL → 2XL
- **Timing:** All properties transition together

2. **Outline Button**
```tsx
<Button className="bg-transparent border-2 border-white 
         hover:bg-white hover:text-primary 
         transition-all shadow-lg">
```
- **Background:** Transparent → White
- **Text Color:** White → Primary blue
- **Border:** Maintains white border
- **Shadow:** Consistent large shadow

### Decorative Wave SVG
```tsx
<svg viewBox="0 0 1440 120" className="w-full">
  <path d="M0 120L60 105C120 90..." fill="#f9fafb" />
</svg>
```
- **Purpose:** Smooth transition from hero to content
- **Effect:** Creates organic, flowing separation
- **Color:** Matches next section background

---

## Card Hover Effects

**Location:** Multiple pages (LandingPage, NGODirectoryPage, etc.)

### Standard Card Hover
```tsx
<Card className="shadow-xl hover:shadow-2xl 
     transition-all hover:-translate-y-1 
     border-2 border-transparent hover:border-secondary">
```

**Breakdown:**
1. **Shadow Growth**
   - Initial: XL shadow
   - Hover: 2XL shadow
   - Creates lifting effect

2. **Vertical Translation**
   - Moves up by 4px (`-translate-y-1`)
   - Enhances "floating" impression

3. **Border Highlight**
   - Initial: Transparent border (maintains size)
   - Hover: Colored border (secondary/primary)
   - No layout shift due to pre-existing transparent border

### Icon Scale Effect
```tsx
<div className="w-16 h-16 bg-gradient-to-br from-secondary to-green-600 
     rounded-full flex items-center justify-center 
     group-hover:scale-110 transition-transform">
```
- **Initial Size:** 64px × 64px
- **Hover Size:** 70.4px × 70.4px (110%)
- **Trigger:** Parent card hover (using `group`)
- **Timing:** Default transition

### Project Card Effects
```tsx
<div className="group cursor-pointer">
  <div className="overflow-hidden rounded-t-lg">
    <img className="w-full h-48 object-cover 
         group-hover:scale-110 transition-transform duration-500" />
  </div>
</div>
```
- **Image Scale:** 100% → 110%
- **Duration:** 500ms (slower for smoothness)
- **Overflow Hidden:** Prevents image from breaking card bounds
- **Result:** Ken Burns-style zoom effect

---

## Form Interactions

**Location:** Registration pages, Login page

### Input Focus Effects
```tsx
<input className="w-full px-4 py-3 
       border-2 border-gray-300 rounded-lg 
       focus:outline-none focus:ring-2 focus:ring-primary 
       focus:border-primary transition-all" />
```

**On Focus:**
1. **Outline Removed:** Native browser outline hidden
2. **Ring Added:** 2px primary-colored ring appears
3. **Border Color:** Changes to primary
4. **Timing:** Smooth transition for all properties

### Label Animation
```tsx
<label className="block text-sm font-medium text-gray-700 mb-2 
       transition-colors duration-200">
```
- Labels can change color on form state changes
- Smooth 200ms transition

### Checkbox/Radio Effects
```tsx
<input type="checkbox" 
       className="w-4 h-4 text-primary 
       border-gray-300 rounded 
       focus:ring-2 focus:ring-primary 
       transition-all" />
```
- **Checked State:** Animated fill with primary color
- **Focus Ring:** Primary-colored ring
- **Transitions:** All state changes are smooth

### Step Indicator (Multi-step Forms)
```tsx
<div className="flex items-center justify-center mb-8">
  {steps.map((step, index) => (
    <div className={`flex items-center ${
      index < currentStep ? 'text-primary' : 
      index === currentStep ? 'text-primary' : 
      'text-gray-300'
    } transition-colors duration-300`}>
      {/* Step content */}
    </div>
  ))}
</div>
```
- **Active Step:** Primary blue color
- **Completed Steps:** Primary blue with checkmark
- **Upcoming Steps:** Gray with numbers
- **Transition:** 300ms color change between steps

### Progress Bar Animation
```tsx
<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
  <div className="h-full bg-gradient-to-r from-primary to-secondary 
       transition-all duration-500 ease-out"
       style={{ width: `${progress}%` }}>
  </div>
</div>
```
- **Width Change:** Animated based on step progress
- **Duration:** 500ms
- **Easing:** Ease-out for smooth deceleration
- **Gradient:** Primary to secondary for visual interest

---

## Button Effects

**Location:** All components using Button component

### Primary Button Hover
```tsx
<Button className="bg-secondary hover:bg-secondary/90 
         hover:scale-105 transition-all shadow-lg">
```
- **Background Darken:** 100% → 90% opacity
- **Scale Up:** 105%
- **Shadow:** Consistent large shadow
- **Cursor:** Changes to pointer

### Outline Button Hover
```tsx
<Button variant="outline" 
        className="hover:scale-105 transition-all">
```
- **Border:** Darkens on hover
- **Scale:** 105%
- **Background:** Subtle background appears

### Icon Button Hover
```tsx
<button className="p-2 rounded-lg 
         hover:bg-gray-100 
         transition-colors duration-200">
  <Icon className="w-5 h-5" />
</button>
```
- **Background:** Transparent → Light gray
- **Duration:** 200ms
- **Icon Color:** Can change independently

### Disabled State
```tsx
<Button disabled 
        className="opacity-50 cursor-not-allowed">
```
- **Opacity:** 50%
- **Cursor:** Not-allowed cursor
- **No Hover:** All hover effects disabled

---

## Transition Animations

### Page Transitions
**Location:** `/App.tsx`

```tsx
const handleNavigate = (page: string) => {
  setCurrentPage(page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
```
- **Scroll Behavior:** Smooth scroll to top on navigation
- **Duration:** Browser default (~400ms)

### Content Fade In
**Location:** Various pages

```tsx
<div className="animate-[fadeIn_0.5s_ease-in]">
  {/* Content */}
</div>
```
- **Duration:** 500ms
- **Easing:** Ease-in
- **Effect:** Content gradually appears

### Slide In Effects
```tsx
<div className="transform translate-x-full 
     animate-[slideIn_0.3s_ease-out_forwards]">
```
- **Initial:** Off-screen to right
- **Final:** On-screen position
- **Duration:** 300ms
- **Forwards:** Maintains final state

---

## Loading States

### Spinner Animation
**Location:** Components with async operations

```tsx
<div className="animate-spin rounded-full h-8 w-8 
     border-4 border-gray-200 border-t-primary">
</div>
```
- **Animation:** Built-in Tailwind spin
- **Speed:** 1 second per rotation
- **Border:** Gray with blue top for spinning effect

### Skeleton Loading
```tsx
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```
- **Animation:** Pulse (opacity fade)
- **Speed:** 2 seconds per cycle
- **Effect:** Placeholder content while loading

### Progress Indicators
```tsx
<div className="relative pt-1">
  <div className="overflow-hidden h-2 text-xs flex rounded 
       bg-gray-200">
    <div className="shadow-none flex flex-col text-center 
         whitespace-nowrap text-white justify-center 
         bg-primary transition-all duration-500"
         style={{ width: `${percentage}%` }}>
    </div>
  </div>
</div>
```
- **Width Update:** Animated via inline style
- **Duration:** 500ms
- **Smooth Growth:** Left to right fill

---

## Scroll Animations

### Smooth Scroll Behavior
**Global Setting:** `/styles/globals.css`

```css
html {
  scroll-behavior: smooth;
}
```
- **Effect:** All anchor links scroll smoothly
- **Duration:** Browser default
- **Applies To:** Internal page navigation

### Scroll-to-Top on Navigation
```typescript
window.scrollTo({ top: 0, behavior: 'smooth' });
```
- **Trigger:** Page navigation
- **Duration:** ~400ms
- **Effect:** Smooth scroll to top

### Sticky Elements
```tsx
<nav className="sticky top-0 z-50">
```
- **Behavior:** Stays at top while scrolling
- **No Animation:** Instant stick
- **Z-Index:** Ensures it's above content

---

## Gradient Effects

### Background Gradients

1. **Hero Section**
```css
bg-gradient-to-br from-[#0a4a70] via-[#0f5e8e] to-[#0ea5e9]
```
- **Direction:** Bottom-right diagonal
- **Stops:** Dark blue → Mid blue → Light blue

2. **Card Gradients**
```css
bg-gradient-to-br from-secondary to-green-600
```
- **Icons/Badges:** Adds depth and visual interest

3. **Text Gradients**
```css
bg-gradient-to-r from-primary to-secondary 
bg-clip-text text-transparent
```
- **Effect:** Gradient text (where used)
- **Direction:** Left to right

### Shadow Gradients
```css
shadow-xl // Standard shadow
shadow-2xl // Larger shadow on hover
```
- **Transition:** Smooth shadow growth
- **Effect:** Elevation change perception

---

## Performance Optimization

### CSS Transitions vs Animations

**Transitions Used For:**
- Hover effects (buttons, cards)
- State changes (form inputs)
- Quick interactions

**Animations Used For:**
- Splash screen
- Loading states
- Repeating effects (pulse, spin)

### GPU Acceleration
```css
transform: translateZ(0);
will-change: transform;
```
- **Applied To:** Animated elements
- **Effect:** Hardware acceleration
- **Result:** Smoother animations

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
- **Accessibility:** Respects user preferences
- **Effect:** Disables animations for users who prefer reduced motion

### Lazy Loading
```tsx
<img loading="lazy" src="..." alt="..." />
```
- **Effect:** Images load only when near viewport
- **Performance:** Faster initial page load

---

## Animation Timing Reference

### Duration Standards
- **Instant:** 0ms (state changes)
- **Fast:** 150-200ms (hover effects)
- **Normal:** 300-500ms (transitions)
- **Slow:** 500-1000ms (complex animations)
- **Very Slow:** 1000ms+ (emphasis animations)

### Easing Functions Used

1. **ease-in-out** (Default)
   - Smooth start and end
   - Used for most transitions

2. **ease-in**
   - Slow start, fast end
   - Fade-ins, reveals

3. **ease-out**
   - Fast start, slow end
   - Progress bars, slide-ins

4. **linear**
   - Constant speed
   - Spinners, continuous animations

---

## Common Animation Classes

### Tailwind Built-ins
```css
animate-spin      /* Spinning (360° rotation) */
animate-ping      /* Pulsing scale effect */
animate-pulse     /* Opacity pulse */
animate-bounce    /* Bounce effect */
```

### Custom Animations
```css
animate-[pop_1s_ease-in-out]           /* Logo pop */
animate-[fadeIn_0.5s_ease-in]          /* Fade in */
animate-[slideIn_0.3s_ease-out]        /* Slide in */
```

---

## Browser Compatibility

### Modern Features Used
- CSS Grid
- Flexbox
- Transforms (2D & 3D)
- Transitions
- CSS Variables
- Backdrop Filter

### Fallbacks
- Gradient fallback to solid colors
- Transform fallback to no animation
- Backdrop filter fallback to solid background

### Tested Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Debugging Animations

### Browser DevTools
1. **Chrome DevTools**
   - Animations panel
   - Performance profiler
   - Layer visualization

2. **Firefox DevTools**
   - Animation inspector
   - Performance tool

### Common Issues

1. **Janky Animations**
   - **Cause:** Animating expensive properties (width, height, left, top)
   - **Fix:** Use transform and opacity instead

2. **Flash of Unstyled Content**
   - **Cause:** CSS loads after HTML
   - **Fix:** Critical CSS inline or preload

3. **Delayed Hover Effects**
   - **Cause:** Too long transition duration
   - **Fix:** Reduce to 150-300ms

---

## Best Practices

1. **Use transform over position changes**
   ```css
   /* Good */
   transform: translateX(100px);
   
   /* Bad */
   left: 100px;
   ```

2. **Limit animated properties**
   ```css
   /* Good */
   transition: transform 0.3s, opacity 0.3s;
   
   /* Bad */
   transition: all 0.3s;
   ```

3. **Add will-change for complex animations**
   ```css
   will-change: transform, opacity;
   ```

4. **Remove will-change after animation**
   ```javascript
   element.addEventListener('animationend', () => {
     element.style.willChange = 'auto';
   });
   ```

---

## Summary

The ImpactHub platform uses a carefully crafted animation system that includes:

- **3-second splash screen** with logo pop and tagline fade
- **Smooth page transitions** with scroll-to-top
- **Interactive hover effects** on cards, buttons, and links
- **Gradient backgrounds** for visual depth
- **Form feedback animations** for better UX
- **Loading states** with spinners and skeletons
- **Performance optimizations** for smooth 60fps animations

All animations follow modern web standards, are accessible, and provide a professional, polished user experience.

---

**Last Updated:** January 2026
**Version:** 1.0.0
