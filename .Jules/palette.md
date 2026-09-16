## 2026-09-15 - [Keyboard and Touch Nav Accessibility]
**Learning:** Implementing keydown and touchstart/touchend listeners expands accessibility and allows easier navigation between scrolling chapters on different devices.
**Action:** Added Arrow key navigation and touch swipe gesture listeners for switching chapters in main.js.
## 2024-05-18 - Screen Reader Compatibility on Preloader
**Learning:** Found a missing `role="progressbar"` in the visual loader on a static vanilla JS site.
**Action:** Adding standard ARIA properties with dynamic attribute updates ensures visual loading elements convey meaning to screen reader users. Added aria-hidden to the numeric counter to avoid redundancy.
## 2024-05-18 - Typography Refinements for Readability
**Learning:** `clamp()` functions require the minimum value to come first to be valid CSS. `optimizeLegibility` provides better font rendering for premium typography.
**Action:** Always verify `clamp()` boundaries and ensure sufficient contrast (WCAG AA) for muted HUD elements.
