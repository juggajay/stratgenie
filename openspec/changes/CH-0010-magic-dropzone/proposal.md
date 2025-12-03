# CH-0010: Magic Dropzone & Conversion Optimization

## Status
**Proposed** | Created: 2024-12-03

---

## Why

The current file input on the Strata Hub Reporter is generic and low-trust. Users are being asked to upload sensitive financial documents (AGM minutes, financial statements) using a basic HTML file input with minimal visual feedback.

We need to "grease the slide" for users to:
1. Feel confident uploading sensitive documents
2. Experience a polished, professional interaction
3. Convert from "free tool user" to "email lead" at higher rates

The current implementation has:
- Basic drag-and-drop with minimal feedback
- No animation or visual delight
- Generic "Unlock Results" copy that doesn't convey value
- No mobile camera support for scanning documents

---

## What

### 1. Magic Dropzone Component

A new reusable `<MagicDropzone />` UI component with:
- **Drag-and-drop animations** using Framer Motion
- **Visual state feedback** (idle, hover, scanning, complete)
- **Mobile camera support** for document scanning
- **Trust-building micro-interactions**

### 2. Conversion-Optimized Copywriting

Refined copy on the email capture modal:
- Header: "Your Compliance Cheat Sheet is Ready" (was generic)
- Button: "Reveal My Report" (was "Unlock Results")
- Subtext that emphasizes value, not obligation

---

## Scope

### In Scope
- New `components/ui/magic-dropzone.tsx` component
- Integration with Strata Hub Reporter page
- Updated email capture modal copy
- Mobile camera trigger support

### Out of Scope
- Backend changes (existing upload flow unchanged)
- Other tool pages (Levy Calculator, Compliance Check)
- Email content changes

---

## Success Metrics

- **Conversion Rate**: Email capture rate from upload → lead (target: +20%)
- **Upload Completion**: % of started uploads that complete (target: +15%)
- **Mobile Uploads**: Track mobile vs desktop upload ratio

---

## Dependencies

- `react-dropzone` - Robust file drop handling
- `framer-motion` - Smooth animations (already used in project)
- `lucide-react` - Icons (already installed)

---

## Risks

| Risk | Mitigation |
|------|------------|
| Animation performance on low-end devices | Use `will-change` and GPU-accelerated transforms only |
| Camera permission prompts may confuse users | Clear instructional text, graceful fallback |
| New dependencies increase bundle size | Tree-shake unused exports |

---

## Related Changes

- CH-0009: Strata Hub AI Logic (this enhances that feature's UX)
