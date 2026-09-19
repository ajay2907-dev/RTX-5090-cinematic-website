## 2026-09-15 - [Keyboard and Touch Nav Accessibility]
**Learning:** Implementing keydown and touchstart/touchend listeners expands accessibility and allows easier navigation between scrolling chapters on different devices.
**Action:** Added Arrow key navigation and touch swipe gesture listeners for switching chapters in main.js.
## 2024-05-18 - Screen Reader Compatibility on Preloader
**Learning:** Found a missing `role="progressbar"` in the visual loader on a static vanilla JS site.
**Action:** Adding standard ARIA properties with dynamic attribute updates ensures visual loading elements convey meaning to screen reader users. Added aria-hidden to the numeric counter to avoid redundancy.

## 2024-09-19 - Apple-style UI Overhaul
**Learning:** To achieve a premium "Apple-like" aesthetic, it's effective to combine a clean sans-serif font stack (e.g., Inter), use a minimalist color palette (e.g., introducing a subtle silver and softening bright neon accents), and employ CSS frosted glass effects (`backdrop-filter: blur`, semi-transparent backgrounds).
**Action:** Applied these techniques by updating CSS typography and colors, tweaking `.scene-panel` for a glassmorphism look, and softening green glows to match the desired premium feel.
