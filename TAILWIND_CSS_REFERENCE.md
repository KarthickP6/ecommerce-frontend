# CSS Classes Reference Guide

## All Tailwind Classes Applied to Pages

### 1. Main Container
```tsx
className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
```

**Breakdown:**
- `min-h-screen` - Minimum 100vh height
- `bg-gradient-to-br` - Diagonal gradient to bottom-right
- `from-blue-50` - Start color: #F0F4F8
- `via-blue-100` - Middle color: #DBEAFE
- `to-indigo-200` - End color: #C7D2FE
- `flex` - Flexbox layout
- `items-center` - Vertical center
- `justify-center` - Horizontal center
- `py-12` - Padding Y-axis: 3rem (12 * 0.25rem)
- `px-4` - Padding X-axis: 1rem (mobile)
- `sm:px-6` - Padding X: 1.5rem (tablet)
- `lg:px-8` - Padding X: 2rem (desktop)

---

### 2. Logo Circle
```tsx
className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4"
```

**Breakdown:**
- `inline-flex` - Inline flexbox
- `items-center justify-center` - Center content
- `w-16 h-16` - 4rem x 4rem (64x64px)
- `bg-white` - White background
- `rounded-full` - 50% border-radius (circle)
- `shadow-lg` - Large drop shadow
- `mb-4` - Bottom margin: 1rem

---

### 3. Form Card Container
```tsx
className="bg-white rounded-2xl shadow-2xl overflow-hidden"
```

**Breakdown:**
- `bg-white` - White background
- `rounded-2xl` - 16px border-radius
- `shadow-2xl` - Extra large shadow
- `overflow-hidden` - Hide overflowing content

---

### 4. Card Padding Section
```tsx
className="p-8 md:p-10"
```

**Breakdown:**
- `p-8` - Padding all: 2rem (mobile)
- `md:p-10` - Padding all: 2.5rem (desktop)

---

### 5. Error Box
```tsx
className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
```

**Breakdown:**
- `mb-6` - Bottom margin: 1.5rem
- `p-4` - Padding all: 1rem
- `bg-red-50` - Light red background: #FEF2F2
- `border-l-4` - Left border: 4px
- `border-red-500` - Red border: #EF4444
- `rounded-lg` - Border-radius: 8px

---

### 6. Form Label
```tsx
className="block text-sm font-semibold text-gray-700 mb-2"
```

**Breakdown:**
- `block` - Display: block
- `text-sm` - Font-size: 0.875rem (14px)
- `font-semibold` - Font-weight: 600
- `text-gray-700` - Color: #374151
- `mb-2` - Bottom margin: 0.5rem

---

### 7. Input Field - Normal State
```tsx
className="w-full px-4 py-3 border-2 rounded-lg font-medium transition-all duration-200 focus:outline-none border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
```

**Breakdown:**
- `w-full` - Width: 100%
- `px-4` - Padding X: 1rem
- `py-3` - Padding Y: 0.75rem
- `border-2` - Border: 2px
- `rounded-lg` - Border-radius: 8px
- `font-medium` - Font-weight: 500
- `transition-all` - Transition all properties
- `duration-200` - Transition time: 200ms
- `focus:outline-none` - Remove default outline on focus
- `border-gray-200` - Border: #E5E7EB
- `bg-gray-50` - Background: #F9FAFB
- `focus:border-blue-500` - Focus border: #3B82F6
- `focus:bg-white` - Focus background: white
- `focus:ring-2` - Focus ring: 2px
- `focus:ring-blue-200` - Focus ring color: #BFDBFE

---

### 8. Input Field - Error State
```tsx
className="border-red-500 bg-red-50 focus:ring-red-200 focus:border-red-500"
```

**Breakdown:**
- `border-red-500` - Border: #EF4444
- `bg-red-50` - Background: #FEF2F2
- `focus:ring-red-200` - Focus ring: #FECACA
- `focus:border-red-500` - Focus border: #EF4444

---

### 9. Error Message Text
```tsx
className="mt-2 text-sm text-red-600 font-medium flex items-center"
```

**Breakdown:**
- `mt-2` - Top margin: 0.5rem
- `text-sm` - Font-size: 0.875rem
- `text-red-600` - Color: #DC2626
- `font-medium` - Font-weight: 500
- `flex items-center` - Flexbox with centered items

---

### 10. Submit Button
```tsx
className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
```

**Breakdown:**
- `w-full` - Width: 100%
- `py-3 px-4` - Padding: 0.75rem Y, 1rem X
- `bg-gradient-to-r` - Gradient to right
- `from-blue-600` - Gradient start: #3B82F6
- `to-blue-700` - Gradient end: #1D4ED8
- `text-white` - Color: white
- `font-bold` - Font-weight: 700
- `rounded-lg` - Border-radius: 8px
- `hover:from-blue-700` - Hover start: #1D4ED8
- `hover:to-blue-800` - Hover end: #1E40AF
- `disabled:from-gray-400` - Disabled start: #9CA3AF
- `disabled:to-gray-500` - Disabled end: #6B7280
- `disabled:cursor-not-allowed` - Disabled cursor
- `transition-all` - Transition all properties
- `duration-200` - Duration: 200ms
- `transform` - Enable transforms
- `hover:scale-105` - Hover scale: 105% (grow 5%)
- `active:scale-95` - Active scale: 95% (shrink 5%)
- `flex items-center justify-center` - Centered flex
- `gap-2` - Gap between items: 0.5rem
- `shadow-lg` - Large shadow

---

### 11. Divider
```tsx
className="my-6 flex items-center"
```

**Breakdown:**
- `my-6` - Margin Y: 1.5rem
- `flex items-center` - Flex with centered items

---

### 12. Divider Line
```tsx
className="flex-grow border-t border-gray-300"
```

**Breakdown:**
- `flex-grow` - Flex: 1 (grow equally)
- `border-t` - Top border: 1px
- `border-gray-300` - Color: #D1D5DB

---

### 13. Links
```tsx
className="text-blue-600 hover:text-blue-800 font-bold transition-colors"
```

**Breakdown:**
- `text-blue-600` - Color: #3B82F6
- `hover:text-blue-800` - Hover color: #1E40AF
- `font-bold` - Font-weight: 700
- `transition-colors` - Transition color property

---

### 14. Checkbox
```tsx
className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 mt-0.5 cursor-pointer"
```

**Breakdown:**
- `w-5 h-5` - 1.25rem x 1.25rem (20x20px)
- `text-blue-600` - Color: #3B82F6
- `border-2` - Border: 2px
- `border-gray-300` - Color: #D1D5DB
- `rounded` - Border-radius: 4px
- `focus:ring-blue-500` - Focus ring: #3B82F6
- `mt-0.5` - Top margin: 0.125rem
- `cursor-pointer` - Cursor: pointer

---

### 15. Icon SVG
```tsx
className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0"
```

**Breakdown:**
- `w-5 h-5` - 1.25rem x 1.25rem
- `text-red-500` - Color: #EF4444
- `mr-3` - Right margin: 0.75rem
- `mt-0.5` - Top margin: 0.125rem
- `flex-shrink-0` - Don't shrink in flex

---

### 16. Loading Spinner
```tsx
className="animate-spin h-5 w-5"
```

**Breakdown:**
- `animate-spin` - Rotation animation
- `h-5 w-5` - 1.25rem x 1.25rem

---

### 17. Footer Section
```tsx
className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-t border-gray-200"
```

**Breakdown:**
- `bg-gradient-to-r` - Gradient to right
- `from-blue-50` - Start: #F0F4F8
- `to-indigo-50` - End: #EEF2FF
- `px-8` - Padding X: 2rem
- `py-6` - Padding Y: 1.5rem
- `border-t` - Top border: 1px
- `border-gray-200` - Color: #E5E7EB

---

## CSS Utilities Used

| Utility | Value | Usage |
|---------|-------|-------|
| `w-full` | width: 100% | Form inputs, buttons |
| `max-w-md` | max-width: 28rem | Form container |
| `px-4` | padding-left/right: 1rem | General padding |
| `py-3` | padding-top/bottom: 0.75rem | Input padding |
| `text-sm` | font-size: 0.875rem | Labels, hints |
| `font-bold` | font-weight: 700 | Buttons, headers |
| `bg-white` | background-color: white | Card background |
| `text-gray-900` | color: #111827 | Main text |
| `border-2` | border: 2px solid | Input borders |
| `rounded-lg` | border-radius: 8px | General rounding |
| `shadow-lg` | box-shadow: large | Card shadow |
| `transition-all` | transition: all | All animations |
| `duration-200` | transition-duration: 200ms | Animation speed |
| `hover:scale-105` | transform: scale(1.05) on hover | Button hover |
| `focus:ring-2` | box-shadow: ring on focus | Input focus |
| `gap-2` | gap: 0.5rem | Flex spacing |
| `grid` | display: grid | Layout |
| `flex` | display: flex | Layout |
| `items-center` | align-items: center | Flex alignment |
| `justify-center` | justify-content: center | Flex alignment |

---

## Color Palette

| Variable | Color Code | Hex | Usage |
|----------|-----------|-----|-------|
| blue-50 | #F0F4F8 | Light blue | Backgrounds |
| blue-100 | #DBEAFE | Lighter blue | Gradient stop |
| blue-200 | #BFDBFE | Light blue | Focus rings |
| blue-500 | #3B82F6 | Blue | Links, borders |
| blue-600 | #2563EB | Button start | Primary button |
| blue-700 | #1D4ED8 | Darker blue | Button gradient |
| blue-800 | #1E40AF | Dark blue | Hover states |
| indigo-50 | #EEF2FF | Very light indigo | Footer |
| indigo-200 | #C7D2FE | Light indigo | Gradient end |
| red-50 | #FEF2F2 | Light red | Error bg |
| red-500 | #EF4444 | Red | Error color |
| red-600 | #DC2626 | Dark red | Error hover |
| gray-50 | #F9FAFB | Very light gray | Input bg |
| gray-200 | #E5E7EB | Light gray | Borders |
| gray-300 | #D1D5DB | Medium gray | Dividers |
| gray-400 | #9CA3AF | Darker gray | Disabled |
| gray-700 | #374151 | Dark gray | Labels |
| gray-900 | #111827 | Very dark gray | Text |

---

## Responsive Breakpoints

| Breakpoint | Min Width | Classes |
|------------|-----------|---------|
| Default | 0px | `px-4`, `py-12` |
| `sm` | 640px | `sm:px-6` |
| `md` | 768px | `md:p-10` |
| `lg` | 1024px | `lg:px-8` |

---

## Animation Timings

| Animation | Duration | Effect |
|-----------|----------|--------|
| `transition-all` | 200ms | Smooth all changes |
| `hover:scale-105` | 200ms | Grow 5% on hover |
| `active:scale-95` | 200ms | Shrink 5% on click |
| `animate-spin` | 1s | Loading spinner |

---

## Complete Class Reference

```css
/* Containers */
.min-h-screen
.w-full
.max-w-md
.bg-gradient-to-br
.rounded-2xl
.shadow-2xl

/* Typography */
.text-sm
.font-bold
.font-semibold
.font-medium
.text-gray-900
.text-blue-600

/* Spacing */
.px-4, .px-6, .px-8
.py-3, .py-6, .py-12
.mb-2, .mb-4, .mb-6
.mt-0.5, .mt-2
.gap-2

/* Borders */
.border-2
.border-l-4
.border-gray-200
.rounded-lg
.rounded-full

/* Flexbox */
.flex
.items-center
.justify-center
.gap-2

/* States */
.focus:outline-none
.focus:ring-2
.focus:ring-blue-200
.hover:scale-105
.active:scale-95
.disabled:cursor-not-allowed

/* Colors */
.bg-white
.bg-gray-50
.bg-blue-50
.text-red-600
.border-blue-500

/* Animations */
.transition-all
.duration-200
.animate-spin
```

---

## Usage Examples

### Form Input:
```tsx
<Field className="w-full px-4 py-3 border-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200" />
```

### Button:
```tsx
<button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:scale-105 active:scale-95 shadow-lg">
  Click Me
</button>
```

### Error Message:
```tsx
<div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
  <p className="text-red-600 text-sm font-medium">Error text</p>
</div>
```

### Card:
```tsx
<div className="bg-white rounded-2xl shadow-2xl p-8">
  Content here
</div>
```

---

**Total Unique Classes Used:** 80+
**Color Variations:** 8+
**Responsive Variants:** 3+
**Pseudo-classes:** 6+ (focus, hover, active, disabled, etc.)


