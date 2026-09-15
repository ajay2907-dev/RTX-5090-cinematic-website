## 2024-05-23 - Focus States Added
**Learning:** The cinematic scrolling site uses custom hover effects (underlines and glowing borders) but completely lacks keyboard focus indicators, breaking a11y for keyboard users navigating chapters.
**Action:** Always map `:focus-visible` to existing `:hover` states in custom cinematic sites so keyboard users get the same premium visual feedback without adding ugly default outlines.
