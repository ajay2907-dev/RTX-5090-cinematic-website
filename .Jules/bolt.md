## 2026-09-15 - Unconditional Layout Reads and DOM Manipulations in Animation Loop
**Learning:** Found a severe performance bottleneck where `calculateScrollStory` performed unconditional layout reads (`getBoundingClientRect()`) and DOM class toggles on every frame in the `requestAnimationFrame` loop, causing layout thrashing even when idle.
**Action:** Implemented state tracking (`lastScrollY`, `lastViewportHeight`) for early returns and moved DOM manipulations inside a condition checking if the actual state (`currentChapterIdx`) had changed.
