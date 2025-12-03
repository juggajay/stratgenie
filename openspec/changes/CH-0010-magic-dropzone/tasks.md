# CH-0010: Tasks

## Phase A: Infrastructure (Frontend Setup)

### A1. Install Dependencies
- [ ] Install `react-dropzone` package
- [ ] Install `framer-motion` package (if not already present)
- [ ] Verify `lucide-react` is available

**Validation**: `npm ls react-dropzone framer-motion lucide-react` shows all packages

---

### A2. Create MagicDropzone Component
- [ ] Create `components/ui/magic-dropzone.tsx`
- [ ] Implement idle state with dashed border and upload icon
- [ ] Implement active (drag over) state with green border and scale animation
- [ ] Implement scanning state with progress bar animation
- [ ] Implement error state with red border and error message
- [ ] Add `prefers-reduced-motion` support
- [ ] Add keyboard accessibility (Enter/Space to trigger file picker)
- [ ] Add ARIA labels for screen readers

**Validation**: Component renders in isolation, all states visible via Storybook or manual testing

---

### A3. Add Mobile Camera Support
- [ ] Configure input with `accept="image/*,application/pdf"`
- [ ] Add `capture="environment"` for rear camera trigger
- [ ] Test fallback behavior when camera unavailable

**Validation**: On mobile device, tapping dropzone opens camera; on desktop, opens file picker

---

## Phase B: Integration

### B1. Replace File Input in Strata Hub Reporter
- [ ] Import `MagicDropzone` in `app/(marketing)/tools/strata-hub-reporter/page.tsx`
- [ ] Replace existing `<input type="file" />` with `<MagicDropzone />`
- [ ] Wire `onFileAccepted` to existing `handleFileUpload` function
- [ ] Add simulated 2-second scanning delay before actual upload
- [ ] Remove old dropzone styling code

**Validation**: Upload flow works end-to-end with new component

---

### B2. Update Email Capture Modal Copy
- [ ] Change modal header to "Your Compliance Cheat Sheet is Ready"
- [ ] Change button text to "Reveal My Report"
- [ ] Update subheader copy
- [ ] Update privacy text

**Validation**: New copy visible on email capture modal

---

### B3. Test Mobile Camera Trigger
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Verify rear camera opens by default
- [ ] Verify file picker fallback works

**Validation**: Camera opens on mobile, uploads work correctly

---

## Phase C: Polish & QA

### C1. Animation Performance
- [ ] Test on low-end devices
- [ ] Ensure animations use GPU acceleration
- [ ] Verify no jank during drag operations

**Validation**: 60fps animations on target devices

---

### C2. Error Handling
- [ ] Test file size limit enforcement
- [ ] Test file type validation (PDF only)
- [ ] Test network error handling
- [ ] Verify error messages are user-friendly

**Validation**: All error scenarios display appropriate messages

---

### C3. Cross-Browser Testing
- [ ] Test Chrome (latest)
- [ ] Test Safari (latest)
- [ ] Test Firefox (latest)
- [ ] Test Edge (latest)

**Validation**: Consistent behavior across browsers

---

## Deployment Checklist

- [ ] All tasks complete
- [ ] No console errors
- [ ] Bundle size impact reviewed
- [ ] Mobile testing complete
- [ ] Code reviewed and merged
- [ ] Deployed to production
