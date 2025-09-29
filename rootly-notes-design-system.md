# Rootly Notes App - Design System & Styling Guide

## **Core Design Philosophy**
- **Minimalist & Clean**: Focus on clarity and simplicity over visual complexity
- **Production-Ready**: No placeholder text, efficient code, minimal nesting
- **Accessibility-First**: Proper ARIA labels, semantic HTML, keyboard navigation
- **Mobile-First**: Responsive design with consistent breakpoints
- **Theme-Aware**: Comprehensive light/dark mode support with accent color variations

## **Color System**

### **Base Theme Variables (OKLCH Color Space)**
```css
/* Light Mode */
--background: oklch(1 0 0)           /* Pure white */
--foreground: oklch(0.145 0 0)       /* Near black */
--primary: oklch(0.205 0 0)          /* Dark gray */
--secondary: oklch(0.97 0 0)         /* Light gray */
--muted: oklch(0.97 0 0)             /* Light gray */
--accent: oklch(0.97 0 0)            /* Light gray */
--destructive: oklch(0.577 0.245 27.325) /* Red */
--border: oklch(0.922 0 0)           /* Light border */
--radius: 0.625rem                   /* Consistent border radius */

/* Dark Mode */
--background: oklch(0.145 0 0)       /* Near black */
--foreground: oklch(0.985 0 0)       /* Near white */
--primary: oklch(0.985 0 0)          /* Near white */
--secondary: oklch(0.269 0 0)        /* Dark gray */
--muted: oklch(0.269 0 0)            /* Dark gray */
--accent: oklch(0.269 0 0)           /* Dark gray */
```

### **Accent Color Presets**
- **Rose**: `oklch(0.645 0.246 16.439)` - Warm pink/rose
- **Red**: `oklch(0.65 0.25 25)` - Vibrant red
- **Orange**: `oklch(0.67 0.23 50)` - Warm orange
- **Yellow**: `oklch(0.9 0.12 100)` - Bright yellow
- **Green**: `oklch(0.7 0.15 150)` - Natural green
- **Blue**: `oklch(0.72 0.16 240)` - Professional blue
- **Violet**: `oklch(0.65 0.2 300)` - Rich purple

## **Typography & Spacing**

### **Consistent Spacing Scale**
```css
/* Spacing Units */
p-2, p-4, gap-4, m-4    /* 1rem = 16px */
p-6, gap-6              /* 1.5rem = 24px */
p-8, gap-8              /* 2rem = 32px */

/* Typography Scale */
text-sm                  /* 14px */
text-base               /* 16px */
text-lg                 /* 18px */
text-xl                 /* 20px */
text-2xl                /* 24px */
```

### **Border Radius System**
```css
--radius-sm: calc(var(--radius) - 4px)  /* 6px */
--radius-md: calc(var(--radius) - 2px)  /* 8px */
--radius-lg: var(--radius)              /* 10px */
--radius-xl: calc(var(--radius) + 4px)  /* 14px */
```

## **Component Styling Patterns**

### **Button Variants**
```css
/* Default Button */
"bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"

/* Outline Button */
"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"

/* Ghost Button */
"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"

/* Destructive Button */
"bg-destructive text-white shadow-xs hover:bg-destructive/90"
```

### **Card Styling**
```css
/* Base Card */
"bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm"

/* Card Header */
"grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6"

/* Card Content */
"px-6"
```

### **Input Styling**
```css
/* Base Input */
"flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow]"

/* Focus States */
"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"

/* Invalid States */
"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"
```

## **Hover States & Interactions**

### **Button Hover Patterns**
- **Primary**: `hover:bg-primary/90` - 10% opacity reduction
- **Secondary**: `hover:bg-secondary/80` - 20% opacity reduction
- **Ghost**: `hover:bg-accent hover:text-accent-foreground` - Background + text color change
- **Destructive**: `hover:bg-destructive/90` - 10% opacity reduction

### **Interactive Elements**
```css
/* Navigation Items */
"hover:bg-accent hover:text-accent-foreground"

/* Dropdown Items */
"focus:bg-accent focus:text-accent-foreground"

/* Badge Links */
"[a&]:hover:bg-primary/90"
```

### **Focus States**
```css
/* Standard Focus Ring */
"focus-visible:ring-ring/50 focus-visible:ring-[3px]"

/* Destructive Focus */
"focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
```

## **Animation & Transitions**

### **Transition Patterns**
```css
/* Color & Shadow Transitions */
"transition-[color,box-shadow]"

/* All Properties */
"transition-all"

/* Theme Toggle Icons */
"rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
```

### **Dialog Animations**
```css
/* Fade In/Out */
"data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"

/* Zoom In/Out */
"data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"

/* Slide Animations */
"data-[side=bottom]:slide-in-from-top-2"
```

## **Layout & Grid Systems**

### **Responsive Grid**
```css
/* Notes Grid */
"grid grid-cols-1 lg:grid-cols-2 gap-6"

/* Navigation */
"flex items-center space-x-1 bg-muted/50 p-1 rounded-lg"
```

### **Flexbox Patterns**
```css
/* Standard Layout */
"flex items-center justify-between gap-4"

/* Centered Content */
"flex items-center justify-center"

/* Responsive Navigation */
"flex items-center gap-2 px-3 py-2"
```

## **Specialized Components**

### **Understanding Badge Colors**
```css
/* Level 1 - Confused */
"bg-red-500 text-white"

/* Level 2 - Unclear */
"bg-orange-500 text-white"

/* Level 3 - Getting It */
"bg-yellow-500 text-black"

/* Level 4 - Clear */
"bg-blue-500 text-white"

/* Level 5 - Crystal Clear */
"bg-green-500 text-white"
```

### **Mood Indicator**
```css
/* Emoji Display */
"text-lg" /* 18px emoji size */

/* Label Styling */
"text-sm text-muted-foreground"
```

### **Code Snippet Highlighting**
```css
/* Search Highlight */
"bg-amber-200/80 dark:bg-amber-200/80 ring-1 ring-amber-500/30 dark:ring-amber-500/30 rounded px-0.5"
```

## **Scrollbar Styling**

### **Custom Scrollbars**
```css
/* Firefox */
"scrollbar-width: thin"
"scrollbar-color: color-mix(in oklch, var(--foreground) 20%, transparent) transparent"

/* WebKit */
"scrollbar-thumb: background-color: color-mix(in oklch, var(--foreground) 20%, transparent)"
"scrollbar-thumb:hover: background-color: color-mix(in oklch, var(--foreground) 35%, transparent)"
```

## **Print Styles**

### **Print-Specific Classes**
```css
/* Hidden on Print */
"note-actions" /* Action buttons hidden */
"data-print-card" /* Card identification for print */
```

## **Accessibility Features**

### **Screen Reader Support**
```css
/* Hidden Elements */
"sr-only" /* Screen reader only content */

/* Focus Indicators */
"focus-visible:ring-[3px]" /* Visible focus rings */

/* ARIA Support */
"aria-invalid:ring-destructive/20" /* Invalid state indicators */
```

## **Theme Switching**

### **Smooth Theme Transitions**
- **Light/Dark**: Instant switching with CSS variables
- **Accent Colors**: Dynamic class application with localStorage persistence
- **System Theme**: Automatic detection and application

This design system prioritizes consistency, accessibility, and user experience while maintaining a clean, professional appearance that adapts seamlessly across different themes and devices.