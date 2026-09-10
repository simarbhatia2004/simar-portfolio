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

    if (pos >= 80) {
      ctrlDesigner.classList.add('active');
    } else if (pos <= 20) {
      ctrlCoder.classList.add('active');
    } else if (pos >= 40 && pos <= 60) {
      ctrlReset.classList.add('active');
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
  // ADHAM DANNAWAY STYLE HOVER INTERACTIONS
  // ==========================================

  // Hover over Designer Wing -> slide to reveal Designer
  if (designerWing) {
    designerWing.addEventListener('mouseenter', () => {
      if (!isDragging) animateTo(90, 500);
    });
  }

  // Hover over Coder Wing -> slide to reveal Coder
  if (coderWing) {
    coderWing.addEventListener('mouseenter', () => {
      if (!isDragging) animateTo(10, 500);
    });
  }

  // Mouse move across avatar container tracks slider position directly
  sliderContainer.addEventListener('mousemove', (e) => {
    if (isDragging) return;
    const rect = sliderContainer.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    updateSplit(pct);
  });

  // Mouse leaving hero resets gently to 50/50 split
  if (heroSection) {
    heroSection.addEventListener('mouseleave', () => {
      if (!isDragging) animateTo(50, 700);
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
