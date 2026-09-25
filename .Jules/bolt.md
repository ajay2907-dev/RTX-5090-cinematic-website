## 2026-09-15 - [Throttling Resize Event]
**Learning:** Throttling the resize event listener with requestAnimationFrame prevents layout thrashing and ensures smooth performance.
**Action:** Applied requestAnimationFrame wrapping to the resize handler in main.js.
## 2026-09-25 - DOM Query Caching
**Learning:** Caching DOM queries like document.querySelectorAll() outside of high-frequency event listeners (mousemove, scroll) significantly reduces CPU overhead and execution time.
**Action:** Always extract static DOM queries from within event listener callbacks into file-scoped or component-scoped variables during initialization to prevent redundant layout thrashing and performance degradation.
