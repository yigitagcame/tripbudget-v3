# 🎨 Design System – Trip Budget

## 📋 Table of Contents

- [Design Philosophy](#design-philosophy)
- [Color System](#color-system)
- [Typography](#typography)
- [Component Library](./components.md)
- [Landing Page Design](./landing-page.md)
- [Responsive Design](#responsive-design)
- [Accessibility](#accessibility)
- [Animation Guidelines](#animation-guidelines)

## 🎯 Design Philosophy

### Core Principles
- **Modularity**: Build reusable components that can be combined in various ways
- **Consistency**: Maintain visual harmony across all interfaces
- **Accessibility**: Ensure the app is usable by everyone
- **Performance**: Design with performance in mind
- **Travel-Focused**: Create an experience that feels warm and inviting for travelers
- **AI-Native**: Leverage AI to tailor the user experience

### Design Values
- **Trustworthy**: Professional appearance that builds user confidence
- **Friendly**: Warm colors and approachable interactions
- **Efficient**: Streamlined workflows that save time
- **Inspiring**: Visual elements that spark travel excitement
- **Inclusive**: Design for a diverse range of users

## 🎨 Color System

### Primary Palette
The color system reflects the travel experience with a focus on trust, warmth, and action.

```css
/* Primary - Trust & Professionalism (Blue to Purple Gradient) */
primary-500: #2563EB    /* Blue-600 */
primary-600: #7C3AED    /* Purple-600 */
primary-gradient: linear-gradient(to right, #2563EB, #7C3AED)

/* Secondary - Warmth & Travel */
secondary-500: #E5C07B  /* Warm sand tone */
secondary-600: #CFA76E  /* Hover states */

/* Accent - Energy & Action */
accent-500: #F97316     /* Sunset orange */
accent-600: #DB6414     /* Hover states */

/* Feature Colors */
feature-blue: #3B82F6   /* Blue-500 */
feature-green: #10B981  /* Emerald-500 */
feature-orange: #F59E0B /* Amber-500 */
feature-teal: #14B8A6   /* Teal-500 */
```

### Surface Colors
```css
surface-0: #FFFFFF      /* Primary background */
surface-50: #F9FAFB     /* Secondary background (gray-50) */
surface-100: #F3F4F6    /* Tertiary background */
surface-200: #E5E7EB    /* Borders */
surface-300: #D1D5DB    /* Dividers */
surface-600: #6B7280    /* Secondary text */
surface-900: #111827    /* Primary text */
```

### Semantic Colors
```css
/* Success */
success-100: #D1FAE5
success-500: #10B981
success-800: #065F46

/* Warning */
warning-100: #FEF3C7
warning-500: #F59E0B
warning-800: #92400E

/* Error */
error-100: #FEE2E2
error-500: #EF4444
error-800: #991B1B

/* Info */
info-100: #DBEAFE
info-500: #3B82F6
info-800: #1E40AF
```

## 📝 Typography

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Type Scale
```css
/* Headings */
text-4xl: 2.25rem (36px)  /* Page titles */
text-3xl: 1.875rem (30px) /* Section headers */
text-2xl: 1.5rem (24px)   /* Card titles */
text-xl: 1.25rem (20px)   /* Subsection headers */
text-lg: 1.125rem (18px)  /* Component titles */

/* Body */
text-base: 1rem (16px)    /* Default body text */
text-sm: 0.875rem (14px)  /* Secondary text, captions */
text-xs: 0.75rem (12px)   /* Labels, metadata */
```

### Font Weights
```css
font-light: 300    /* Subtle text */
font-normal: 400   /* Body text */
font-medium: 500   /* Emphasis */
font-semibold: 600 /* Headings */
font-bold: 700     /* Strong emphasis */
```

## 📱 Responsive Design

### Breakpoints
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Mobile-First Approach
- Design for small screens first
- Enhance progressively for larger screens
- Ensure 44px touch targets
- Optimize for thumb navigation

### Grid System
```css
grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```

## ♿ Accessibility

### Color Contrast
- **4.5:1** for normal text
- **3:1** for large text (18px+ or 14px+ bold)

### Focus States
```css
focus:outline-none
focus:ring-2
focus:ring-primary-500
focus:ring-offset-2
```

### Keyboard Navigation
- Logical tab order
- Skip links for main content
- All interactive elements accessible
- Clear focus indicators

### Screen Reader Support
- Semantic HTML structure
- ARIA labels and descriptions
- Alt text for images
- Proper heading hierarchy

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## ✨ Animation Guidelines

### Duration Scale
```css
duration-75: 75ms    /* Instant feedback */
duration-100: 100ms  /* Quick transitions */
duration-200: 200ms  /* Standard transitions */
duration-300: 300ms  /* Smooth transitions */
duration-500: 500ms  /* Deliberate transitions */
duration-700: 700ms  /* Slow transitions */
duration-1000: 1000ms /* Very slow transitions */
```

### Easing Functions
```css
ease-linear: linear
ease-in: cubic-bezier(0.4, 0, 1, 1)
ease-out: cubic-bezier(0, 0, 0.2, 1)
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

### Common Animations

#### Hover Effects
```css
hover:scale-105
hover:shadow-md
transition-all duration-200 ease-in-out
```

#### Loading States
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin { animation: spin 1s linear infinite; }
```

#### Page Transitions
- Fade and slide effects for smooth navigation
- Consistent timing across the application

## 🧩 Component System

### Base Components
- **BaseButton** - Primary, secondary, outline, ghost variants
- **BaseCard** - Interactive cards with hover effects
- **BaseInput** - Form inputs with validation states
- **BaseBadge** - Status indicators and labels

### Travel-Specific Components
- **FlightCard** - Flight information display
- **HotelCard** - Hotel details with amenities
- **RestaurantCard** - Dining options
- **PlaceCard** - Attractions and activities

### Layout Components
- **Navbar** - Fixed top navigation
- **Toast** - Notification system with auto-dismiss
- **TripPlanContainer** - Main trip planning interface

## 🎨 Design Tokens

### Spacing Scale
```css
space-1: 0.25rem (4px)   /* Minimal spacing */
space-2: 0.5rem (8px)    /* Tight spacing */
space-3: 0.75rem (12px)  /* Compact spacing */
space-4: 1rem (16px)     /* Base spacing */
space-6: 1.5rem (24px)   /* Comfortable spacing */
space-8: 2rem (32px)     /* Section spacing */
space-12: 3rem (48px)    /* Large spacing */
space-16: 4rem (64px)    /* Extra large spacing */
```

### Border Radius
```css
rounded: 0.25rem (4px)    /* Subtle rounding */
rounded-md: 0.375rem (6px) /* Standard rounding */
rounded-lg: 0.5rem (8px)   /* Card rounding */
rounded-xl: 0.75rem (12px) /* Large rounding */
rounded-full: 9999px      /* Circular elements */
```

## 📚 Implementation Guidelines

### For New Components
1. Follow naming conventions
2. Use TypeScript for props
3. Add accessibility attributes
4. Include loading/error states
5. Test responsiveness
6. Document usage

### For New Pages
1. Use consistent layouts
2. Follow spacing guidelines
3. Add loading states and error boundaries
4. Test across devices
5. Optimize performance

### For Design Updates
1. Update design tokens
2. Ensure backward compatibility
3. Update component documentation
4. Test existing components
5. Update style guide

## 🔗 Related Documents

- [Component Library](./components.md) - Detailed component documentation
- [Landing Page Design](./landing-page.md) - Landing page specifications
- [Technical Architecture](../technical/README.md) - Implementation details

---

**Last Updated**: January 2025  
**Version**: 2.1 (Landing Page Color System) 