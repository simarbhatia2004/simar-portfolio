/* ==========================================================================
   SIMAR BHATIA PORTFOLIO - ADHAM DANNAWAY INTERACTIVE SPLIT CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const sliderContainer = document.getElementById('sliderContainer');
  const designerLayer = document.getElementById('designerLayer');
  const sliderDivider = document.getElementById('sliderDivider');
  const sliderHandle = document.getElementById('sliderHandle');
  const designerAvatarImg = document.getElementById('designerAvatarImg');
  const coderAvatarImg = document.getElementById('coderAvatarImg');
  const heroSection = document.getElementById('hero');

  // Control Pills & Buttons
  const ctrlDesigner = document.getElementById('ctrlDesigner');
  const ctrlReset = document.getElementById('ctrlReset');
  const ctrlCoder = document.getElementById('ctrlCoder');
  const snapDesignerBtn = document.getElementById('snapDesignerBtn');
  const snapCoderBtn = document.getElementById('snapCoderBtn');
  const designerTitle = document.getElementById('designerTitle');
  const coderTitle = document.getElementById('coderTitle');
  const designerWing = document.getElementById('designerWing');
  const coderWing = document.getElementById('coderWing');

  // Email Copy Elements
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const emailTooltip = document.getElementById('emailTooltip');

  // State
  let currentPos = 50; // Percentage 0 to 100
  let isDragging = false;
  let isHoverTracking = false;
  let animFrameId = null;

  // Set initial split
  function updateSplit(pct, notifyUI = true) {
    // Clamp between 0 and 100
    currentPos = Math.max(0, Math.min(100, pct));
    
    // Update CSS Variable and explicit element widths for maximum cross-browser fidelity
    document.documentElement.style.setProperty('--split-pos', `${currentPos}%`);
    if (designerLayer) {
      designerLayer.style.width = `${currentPos}%`;
    }
    if (sliderDivider) {
      sliderDivider.style.left = `${currentPos}%`;
    }

    if (notifyUI) {
      updateActivePills(currentPos);
    }
  }

  // Synchronize internal image width with avatar container width
  function syncDimensions() {
    if (!sliderContainer) return;
    const width = sliderContainer.offsetWidth;
    if (designerAvatarImg) designerAvatarImg.style.width = `${width}px`;
    if (coderAvatarImg) coderAvatarImg.style.width = `${width}px`;
  }

  window.addEventListener('resize', syncDimensions);
  syncDimensions();

  // Smooth Animation Helper
  function animateTo(targetPct, duration = 650) {
    if (animFrameId) cancelAnimationFrame(animFrameId);

    const startPos = currentPos;
    const distance = targetPct - startPos;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const newPos = startPos + distance * ease;

      updateSplit(newPos, false);

      if (progress < 1) {
        animFrameId = requestAnimationFrame(step);
      } else {
        updateSplit(targetPct, true);
      }
    }

    animFrameId = requestAnimationFrame(step);
  }

  // Update active status on pills
  function updateActivePills(pos) {
    if (!ctrlDesigner || !ctrlReset || !ctrlCoder) return;
    
    ctrlDesigner.classList.remove('active');
    ctrlReset.classList.remove('active');
    ctrlCoder.classList.remove('active');

    if (pos >= 75) {
      ctrlDesigner.classList.add('active');
      if (designerWing) designerWing.classList.add('is-focused');
      if (coderWing) coderWing.classList.remove('is-focused');
    } else if (pos <= 25) {
      ctrlCoder.classList.add('active');
      if (coderWing) coderWing.classList.add('is-focused');
      if (designerWing) designerWing.classList.remove('is-focused');
    } else {
      ctrlReset.classList.add('active');
      if (designerWing) designerWing.classList.remove('is-focused');
      if (coderWing) coderWing.classList.remove('is-focused');
    }
  }

  // ==========================================
  // DRAG & TOUCH INTERACTIONS
  // ==========================================
  function handleDragStart(e) {
    isDragging = true;
    if (animFrameId) cancelAnimationFrame(animFrameId);
    sliderContainer.classList.add('is-dragging');
    handleDragMove(e);
  }

  function handleDragMove(e) {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    if (clientX === undefined) return;

    const rect = sliderContainer.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    updateSplit(pct);
  }

  function handleDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    sliderContainer.classList.remove('is-dragging');
  }

  // Listeners on Avatar Container
  sliderContainer.addEventListener('mousedown', handleDragStart);
  window.addEventListener('mousemove', handleDragMove);
  window.addEventListener('mouseup', handleDragEnd);

  sliderContainer.addEventListener('touchstart', handleDragStart, { passive: true });
  window.addEventListener('touchmove', handleDragMove, { passive: true });
  window.addEventListener('touchend', handleDragEnd);

  // ==========================================
  // FULL HERO SECTION HOVER & SLIDE INTERACTIONS
  // Works across the entire hero section, not just specific elements!
  // ==========================================
  let currentHoverZone = 'center'; // 'left', 'right', 'center'

  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      // If user is actively dragging the slider handle, let drag handler control
      if (isDragging) return;

      // Calculate cursor position across the whole hero section width
      const rect = heroSection.getBoundingClientRect();
      const relativeX = (e.clientX - rect.left) / rect.width;

      // Left section (< 42%): Cursor on Designer side -> slide to reveal full Designer image
      // Right section (> 58%): Cursor on Coder side -> slide to reveal full Coder image
      // Center zone (42% to 58%): Cursor in the middle -> slide to 50/50 split
      if (relativeX < 0.42) {
        if (currentHoverZone !== 'left') {
          currentHoverZone = 'left';
          animateTo(95, 420);
        }
      } else if (relativeX > 0.58) {
        if (currentHoverZone !== 'right') {
          currentHoverZone = 'right';
          animateTo(5, 420);
        }
      } else {
        if (currentHoverZone !== 'center') {
          currentHoverZone = 'center';
          animateTo(50, 420);
        }
      }
    });

    // Mouse leaving hero resets gently to 50/50 split
    heroSection.addEventListener('mouseleave', () => {
      if (!isDragging) {
        currentHoverZone = 'center';
        animateTo(50, 600);
      }
    });
  }

  // ==========================================
  // BUTTON ACTIONS & SNAPPING
  // ==========================================
  if (ctrlDesigner) {
    ctrlDesigner.addEventListener('click', () => animateTo(95, 600));
  }
  if (ctrlCoder) {
    ctrlCoder.addEventListener('click', () => animateTo(5, 600));
  }
  if (ctrlReset) {
    ctrlReset.addEventListener('click', () => animateTo(50, 600));
  }

  if (snapDesignerBtn) {
    snapDesignerBtn.addEventListener('click', () => animateTo(95, 600));
  }
  if (snapCoderBtn) {
    snapCoderBtn.addEventListener('click', () => animateTo(5, 600));
  }

  if (designerTitle) {
    designerTitle.addEventListener('click', () => animateTo(95, 600));
  }
  if (coderTitle) {
    coderTitle.addEventListener('click', () => animateTo(5, 600));
  }

  // ==========================================
  // EMAIL COPY FUNCTIONALITY
  // ==========================================
  if (copyEmailBtn && emailTooltip) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'simarbhatia2004@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        emailTooltip.classList.add('show');
        setTimeout(() => {
          emailTooltip.classList.remove('show');
        }, 2200);
      } catch (err) {
        prompt('Copy my email:', email);
      }
    });
  }

  // Initialize
  updateSplit(50);
});
