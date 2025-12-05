# StrataGenie Logo Assets

## Current Logo (In Use)

**Primary logo for dashboard and headers:**
```
logo-seablue-transparent-v3.png
```

This is the sea blue version with transparent background, used in:
- Dashboard header (`app/dashboard/page.tsx`)
- Landing page header

## Logo Variants

| File | Description |
|------|-------------|
| `logo-seablue-transparent-v3.png` | **CURRENT** - Sea blue, transparent background |
| `logo-seablue-final.png` | Sea blue version with background |
| `logo-seablue-wide.png` | Wide format sea blue |
| `logo-seablue-transparent.png` | Earlier transparent version |
| `logo-dark-mode.png` | Dark mode optimized |
| `logo-light-text-wide.png` | Light text for dark backgrounds |
| `logo-transparent-wide.png` | Wide transparent |
| `logo-transparent-square.png` | Square transparent |
| `logo-final-wide.png` | Wide format final |
| `logo-final-square.png` | Square format final |

## Genie Mascot Assets

| File | Description |
|------|-------------|
| `logo-genie-main.png` | Main genie character |
| `logo-genie-mascot.png` | Mascot version |
| `logo-genie-badge.png` | Badge/icon version |
| `logo-genie-lamp.png` | Lamp icon |

## Text Variants

| File | Description |
|------|-------------|
| `logo-text-horizontal.png` | Horizontal text layout |
| `logo-text-stacked.png` | Stacked text layout |
| `logo-text-integrated.png` | Integrated with icon |

## Usage

Access via URL when deployed:
```
https://stratagenie.com.au/images/logo/logo-seablue-transparent-v3.png
```

Or in Next.js:
```tsx
import Image from "next/image";

<Image
  src="/images/logo/logo-seablue-transparent-v3.png"
  alt="StrataGenie"
  width={320}
  height={80}
  className="h-20 w-auto"
  priority
/>
```
