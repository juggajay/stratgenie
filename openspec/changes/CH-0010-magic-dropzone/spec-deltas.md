# CH-0010: Spec Deltas

## Tech Stack Additions

### Frontend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react-dropzone` | ^14.x | Robust drag-and-drop file handling with accessibility |
| `framer-motion` | ^11.x | Smooth animations and gesture support |

> Note: `lucide-react` is already installed.

---

## UX Rules

### Dropzone Visual States

#### Idle State
- **Border**: Dashed, `border-slate-300`
- **Background**: `bg-slate-50`
- **Icon**: Upload cloud icon (Lucide `Upload`)
- **Copy**: "Drag & Drop or Click to Upload"
- **Subtext**: "Supports PDF files up to 10MB"

#### Active State (Drag Over)
- **Border**: Solid, `border-green-500` (2px)
- **Background**: `bg-green-50`
- **Icon**: Pulse animation on upload icon
- **Copy**: "Drop to analyze..."
- **Animation**: Subtle scale up (1.02x)

#### Scanning State (Post-Drop)
- **Border**: Solid, `border-blue-500`
- **Background**: `bg-blue-50`
- **Icon**: Animated scanning bars or document icon
- **Progress Bar**: Simulated 2-second progress (0% → 100%)
- **Copy**: "Analyzing document..."
- **Behavior**: Show progress bar for 2 seconds before triggering actual backend upload

#### Error State
- **Border**: Solid, `border-red-500`
- **Background**: `bg-red-50`
- **Icon**: Alert circle
- **Copy**: Error message (e.g., "File too large", "PDF only")

---

## Mobile Camera Support

### Input Attributes
```html
<input
  type="file"
  accept="image/*,application/pdf"
  capture="environment"
/>
```

### Behavior
- On mobile devices, `capture="environment"` triggers the rear camera
- Users can scan physical documents directly
- Fallback to file picker if camera not available
- Accept both images and PDFs for flexibility

---

## Copywriting Updates

### Email Capture Modal

#### Header
- **Before**: "Unlock Your Full Report"
- **After**: "Your Compliance Cheat Sheet is Ready"

#### Subheader
- **Before**: "Enter your email to see all the extracted data points."
- **After**: "Enter your email below and we'll reveal your complete Strata Hub data - ready to copy into the portal."

#### Button
- **Before**: "Unlock Results"
- **After**: "Reveal My Report"

#### Privacy Text
- **Before**: "We'll send you helpful strata tips. Unsubscribe anytime."
- **After**: "We'll send you occasional compliance tips. Unsubscribe anytime."

---

## Animation Specifications

### Dropzone Hover
```css
transition: all 200ms ease-out;
transform: scale(1.02);
```

### Progress Bar
```css
/* Simulated scanning animation */
animation: scan-progress 2s ease-in-out forwards;

@keyframes scan-progress {
  0% { width: 0%; }
  30% { width: 45%; }
  60% { width: 70%; }
  90% { width: 90%; }
  100% { width: 100%; }
}
```

### Icon Pulse (Active State)
```css
animation: pulse 1.5s ease-in-out infinite;

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}
```

---

## Component API

```typescript
interface MagicDropzoneProps {
  onFileAccepted: (file: File) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  className?: string;
}
```

---

## Accessibility Requirements

- Keyboard navigation support (Enter/Space to open file picker)
- ARIA labels for screen readers
- Focus ring on keyboard focus
- Reduced motion support (`prefers-reduced-motion`)
