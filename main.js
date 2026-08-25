/* ==========================================================================
   NVIDIA RTX 5090 - CINEMATIC PRODUCT STORYTELLING & FRAME ENGINE
   ========================================================================== */

(function () {
  'use strict';

  const TOTAL_FRAMES = 240;
  const FRAME_PATH = (index) => `public/frames/frame_${String(index).padStart(3, '0')}.jpg`;

  // DOM Elements
  const canvas = document.getElementById('gpu-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const scrollTrack = document.getElementById('scroll-track');
  const viewport = document.getElementById('viewport');
  const siteHeader = document.getElementById('site-header');
  
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('progress-bar');
  const progressPercent = document.getElementById('progress-percent');
  const preloaderStatus = document.getElementById('preloader-status');
  
  // Chapter Scene Elements
  const chapters = [
    document.getElementById('chapter-1'),
    document.getElementById('chapter-2'),
    document.getElementById('chapter-3'),
    document.getElementById('chapter-4'),
    document.getElementById('chapter-5'),
    document.getElementById('chapter-6')
  ];

  const navItems = document.querySelectorAll('.nav-item');
  const ambientGlow = document.getElementById('ambient-glow');
  const ambientWave = document.getElementById('ambient-wave');
  const heroBgLayer = document.getElementById('hero-bg-layer');
  const heroTypography = document.getElementById('hero-typography');
  
  const hudFrame = document.getElementById('hud-frame');
  const hudRotation = document.getElementById('hud-rotation');

  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  // Exact Chapter Frame Ranges (0 to 239)
  const CHAPTER_CONFIG = [
    { id: 1, startFrame: 0,   endFrame: 40,  name: "OVERVIEW" },
    { id: 2, startFrame: 40,  endFrame: 85,  name: "BLACKWELL" },
    { id: 3, startFrame: 85,  endFrame: 125, name: "MEMORY" },
    { id: 4, startFrame: 125, endFrame: 165, name: "AI" },
    { id: 5, startFrame: 165, endFrame: 210, name: "RAY TRACING" },
    { id: 6, startFrame: 210, endFrame: 239, name: "CONCLUSION" }
  ];

  // State Variables
  const images = [];
  let loadedCount = 0;
  let currentFrame = 0;
  let targetFrame = 0;
  let isLoaded = false;
  let scrollProgress = 0;
  let activeChapterIndex = -1;
  const animatedChapters = new Set();

  // Preloader status messages
  const STATUS_STEPS = [
    { threshold: 0.1, text: "LOADING PRODUCT EXPERIENCE" },
    { threshold: 0.4, text: "INITIALIZING 3D ORBIT DATA..." },
    { threshold: 0.75, text: "ALLOCATING GDDR7 MEMORY BUFFERS..." },
    { threshold: 0.95, text: "READY" }
  ];

  /* ==========================================================================
     1. FRAME PRELOADER ENGINE
     ========================================================================== */
  function preloadFrames() {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);

      img.onload = () => {
        loadedCount++;
        updatePreloaderProgress();
      };

      img.onerror = () => {
        console.warn(`Failed to load frame: ${FRAME_PATH(i)}`);
        loadedCount++;
        updatePreloaderProgress();
      };

      images.push(img);
    }
  }

  function updatePreloaderProgress() {
    const progress = loadedCount / TOTAL_FRAMES;
    const percentage = Math.min(100, Math.floor(progress * 100));

    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressPercent) progressPercent.textContent = `${percentage}%`;

    for (let step of STATUS_STEPS) {
      if (progress >= step.threshold) {
        if (preloaderStatus) preloaderStatus.textContent = step.text;
      }
    }

    if (loadedCount >= TOTAL_FRAMES && !isLoaded) {
      isLoaded = true;
      onPreloadComplete();
    }
  }

  function onPreloadComplete() {
    resizeCanvas();
    renderCanvasFrame(0);

    setTimeout(() => {
      if (preloader) preloader.classList.add('hidden');
      startAnimationLoop();
      // Trigger initial chapter 1
      if (chapters[0]) {
        animatedChapters.add(0);
        triggerChapterCountUps(chapters[0]);
      }
    }, 450);
  }


  /* ==========================================================================
     2. CANVAS RENDERER & WIDESCREEN CONTAIN SCALING (GPU DOMINANCE)
     ========================================================================== */
  let canvasWidth = 0;
  let canvasHeight = 0;

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;

    ctx.scale(dpr, dpr);
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (isLoaded) {
      renderCanvasFrame(Math.round(currentFrame));
    }
  }

  function renderCanvasFrame(frameIndex) {
    const safeIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex));
    const img = images[safeIndex];

    if (!img || !img.complete || img.naturalWidth === 0) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Calculate aspect ratio fit (Contain mode)
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    // Scale factor tuned so the GPU commands ~65% to 75% width on widescreen
    const scaleFactor = canvasAspect > 1.4 ? 0.95 : 0.88;

    if (canvasAspect > imgAspect) {
      drawHeight = canvasHeight * scaleFactor;
      drawWidth = drawHeight * imgAspect;
    } else {
      drawWidth = canvasWidth * scaleFactor;
      drawHeight = drawWidth / imgAspect;
    }

    offsetX = (canvasWidth - drawWidth) / 2;
    offsetY = (canvasHeight - drawHeight) / 2;

    // Draw the GPU frame centered
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

    // Update telemetry UI
    if (hudFrame) {
      hudFrame.textContent = `${String(safeIndex + 1).padStart(3, '0')} / ${TOTAL_FRAMES}`;
    }
    if (hudRotation) {
      const degrees = ((safeIndex / (TOTAL_FRAMES - 1)) * 360).toFixed(1);
      hudRotation.textContent = `${degrees}°`;
    }
  }


  /* ==========================================================================
     3. NUMERICAL COUNT-UP ANIMATION CONTROLLER
     ========================================================================== */
  function triggerChapterCountUps(chapterElement) {
    if (!chapterElement) return;
    const counters = chapterElement.querySelectorAll('.count-up');

    counters.forEach((counter) => {
      const targetVal = parseFloat(counter.getAttribute('data-count-target'));
      const format = counter.getAttribute('data-format');
      const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
      if (isNaN(targetVal)) return;

      const duration = 1100;
      const startTime = performance.now();

      function updateNumber(now) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // easeOutCubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = ease * targetVal;

        let displayString = decimals > 0 ? currentVal.toFixed(decimals) : Math.round(currentVal).toString();
        if (format === 'comma') {
          displayString = Math.round(currentVal).toLocaleString('en-US');
        }

        counter.textContent = displayString;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          let finalString = decimals > 0 ? targetVal.toFixed(decimals) : Math.round(targetVal).toString();
          if (format === 'comma') {
            finalString = Math.round(targetVal).toLocaleString('en-US');
          }
          counter.textContent = finalString;
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }


  /* ==========================================================================
     4. SCROLL-DRIVEN LANDSCAPE STORYTELLING CONTROLLER
     ========================================================================== */
  function calculateScrollStory() {
    if (!scrollTrack) return;

    const trackRect = scrollTrack.getBoundingClientRect();
    const totalScrollableDistance = trackRect.height - window.innerHeight;

    if (totalScrollableDistance <= 0) return;

    const scrollY = -trackRect.top;
    scrollProgress = Math.max(0, Math.min(1, scrollY / totalScrollableDistance));

    // Header glass blur effect
    if (siteHeader) {
      siteHeader.classList.toggle('scrolled', scrollY > 40);
    }

    // Background Layer 1 Fade (GEFORCE RTX) past Chapter 1
    if (heroBgLayer) {
      if (scrollProgress > 0.18) {
        heroBgLayer.style.opacity = '0';
      } else {
        heroBgLayer.style.opacity = `${(1 - scrollProgress / 0.18).toFixed(2)}`;
      }
    }

    // Map scroll progress smoothly to 240 frames (0 to 239)
    targetFrame = scrollProgress * (TOTAL_FRAMES - 1);

    // Determine current chapter based on frame index
    const roundedFrame = Math.round(targetFrame);
    let currentChapterIdx = 0;

    for (let i = 0; i < CHAPTER_CONFIG.length; i++) {
      const cfg = CHAPTER_CONFIG[i];
      if (roundedFrame >= cfg.startFrame && roundedFrame <= cfg.endFrame) {
        currentChapterIdx = i;
        break;
      }
    }

    if (activeChapterIndex !== currentChapterIdx) {
      activeChapterIndex = currentChapterIdx;
      const activeEl = chapters[currentChapterIdx];
      if (activeEl && !animatedChapters.has(currentChapterIdx)) {
        animatedChapters.add(currentChapterIdx);
        triggerChapterCountUps(activeEl);
      }
    }

    // Update Chapter visibility & optical transitions
    chapters.forEach((chapterEl, idx) => {
      if (!chapterEl) return;
      if (idx === currentChapterIdx) {
        chapterEl.classList.add('active');
        chapterEl.classList.remove('exiting');
      } else if (idx < currentChapterIdx) {
        chapterEl.classList.remove('active');
        chapterEl.classList.add('exiting');
      } else {
        chapterEl.classList.remove('active');
        chapterEl.classList.remove('exiting');
      }
    });

    // Update Dynamic Navigation Active State
    navItems.forEach((nav) => {
      const targetChap = parseInt(nav.getAttribute('data-chapter'), 10);
      if (targetChap === currentChapterIdx + 1) {
        nav.classList.add('active');
      } else {
        nav.classList.remove('active');
      }
    });

    // Dynamic Environment Reactions (AI & Ray Tracing)
    if (viewport) {
      viewport.classList.toggle('ai-active', currentChapterIdx === 3);
      viewport.classList.toggle('rt-active', currentChapterIdx === 4);
    }
  }

  let lastRenderedFrame = -1;

  function startAnimationLoop() {
    function tick() {
      calculateScrollStory();

      // Silky-smooth linear interpolation (lerp)
      const lerpFactor = 0.14;
      currentFrame += (targetFrame - currentFrame) * lerpFactor;

      const roundedFrame = Math.round(currentFrame);

      if (roundedFrame !== lastRenderedFrame) {
        renderCanvasFrame(roundedFrame);
        lastRenderedFrame = roundedFrame;
      }

      // Cursor spring animation update
      updateCustomCursor();

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }


  /* ==========================================================================
     5. NAVIGATION CLICK-TO-SCROLL
     ========================================================================== */
  function scrollToChapter(chapterNumber) {
    if (!scrollTrack) return;
    const config = CHAPTER_CONFIG[chapterNumber - 1];
    if (!config) return;

    // Mid-point frame of chapter for optimal viewing
    const targetMidFrame = (config.startFrame + config.endFrame) / 2;
    const targetProgress = targetMidFrame / (TOTAL_FRAMES - 1);

    const totalScrollableDistance = scrollTrack.scrollHeight - window.innerHeight;
    const targetScrollY = targetProgress * totalScrollableDistance;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  }

  function setupNavigationInteractions() {
    // Nav links
    navItems.forEach((nav) => {
      nav.addEventListener('click', (e) => {
        e.preventDefault();
        const chapNum = parseInt(nav.getAttribute('data-chapter'), 10);
        scrollToChapter(chapNum);
      });
    });

    // Header explore button -> Scrolls to Chapter 2
    const exploreBtn = document.querySelector('.header-cta');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToChapter(2);
      });
    }

    // Replay button -> Scrolls to Chapter 1
    const replayBtn = document.getElementById('btn-replay');
    if (replayBtn) {
      replayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToChapter(1);
      });
    }
  }


  /* ==========================================================================
     6. PRECISION CUSTOM CURSOR & MICRO-INTERACTIONS
     ========================================================================== */
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }

    // Subtle parallax on ambient glow, wave & hero text
    const normX = (mouseX / window.innerWidth - 0.5) * 2;
    const normY = (mouseY / window.innerHeight - 0.5) * 2;

    if (ambientGlow) {
      ambientGlow.style.transform = `translate(calc(-50% + ${normX * 16}px), calc(-50% + ${normY * 16}px))`;
    }

    if (ambientWave) {
      ambientWave.style.transform = `translateX(calc(-50% + ${normX * 10}px))`;
    }

    if (heroBgLayer && activeChapterIndex === 0) {
      heroBgLayer.style.transform = `translate(calc(-50% + ${normX * -12}px), calc(-50% + ${normY * -12}px))`;
    }

    if (heroTypography && activeChapterIndex === 0) {
      heroTypography.style.transform = `translate(${normX * 6}px, ${normY * 6}px)`;
    }

    // Magnetic button attraction
    const magneticTargets = document.querySelectorAll('.magnetic-target');
    magneticTargets.forEach((target) => {
      const rect = target.getBoundingClientRect();
      const targetCenterX = rect.left + rect.width / 2;
      const targetCenterY = rect.top + rect.height / 2;
      const dist = Math.hypot(mouseX - targetCenterX, mouseY - targetCenterY);

      if (dist < 70) {
        const pullX = (mouseX - targetCenterX) * 0.35;
        const pullY = (mouseY - targetCenterY) * 0.35;
        target.style.transform = `translate(${pullX}px, ${pullY}px)`;
      } else {
        target.style.transform = `translate(0px, 0px)`;
      }
    });
  });

  function updateCustomCursor() {
    if (!cursorRing) return;

    ringX += (mouseX - ringX) * 0.2;
    ringY += (mouseY - ringY) * 0.2;

    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
  }

  function setupHoverListeners() {
    const interactiveElements = document.querySelectorAll('a, button, .magnetic-target, .nav-item, .hero-scroll-prompt');

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (cursorRing) cursorRing.classList.add('active');
      });
      el.addEventListener('mouseleave', () => {
        if (cursorRing) cursorRing.classList.remove('active');
      });
    });

    const targetingElements = document.querySelectorAll('.count-up, .spec-matrix-card, .metadata-grid, .precision-leader-line');
    targetingElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        if (cursorRing) cursorRing.classList.add('targeting');
      });
      el.addEventListener('mouseleave', () => {
        if (cursorRing) cursorRing.classList.remove('targeting');
      });
    });
  }

  /* ==========================================================================
     7. EVENT LISTENERS & INITIALIZATION
     ========================================================================== */
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('scroll', calculateScrollStory, { passive: true });

  window.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    preloadFrames();
    setupNavigationInteractions();
    setupHoverListeners();
  });

})();
