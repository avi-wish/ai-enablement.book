/**
 * Interactive Image & Diagram Lightbox Viewer for "The Reality of Enterprise AI"
 * Provides zoom, pan, pinch gestures, keyboard controls, and SVG/Raster enlargement.
 */
(function () {
  'use strict';

  // Lightbox DOM elements
  let lightboxModal = null;
  let backdropEl = null;
  let canvasWrapper = null;
  let canvasEl = null;
  let titleEl = null;
  let zoomLevelEl = null;
  let btnZoomIn = null;
  let btnZoomOut = null;
  let btnZoomReset = null;
  let btnZoomFit = null;
  let btnOpenNew = null;
  let btnClose = null;

  // State
  let isOpen = false;
  let currentScale = 1.0;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialTranslateX = 0;
  let initialTranslateY = 0;
  let activeMediaEl = null;
  let lastFocusedEl = null;
  let currentMediaSrc = null;

  // Touch pinch state
  let touchStartDistance = 0;
  let touchStartScale = 1.0;

  const MIN_SCALE = 0.3;
  const MAX_SCALE = 8.0;
  const SCALE_STEP = 1.25;

  function createLightboxDOM() {
    if (document.getElementById('image-lightbox-modal')) return;

    lightboxModal = document.createElement('div');
    lightboxModal.id = 'image-lightbox-modal';
    lightboxModal.className = 'lightbox-modal';
    lightboxModal.setAttribute('role', 'dialog');
    lightboxModal.setAttribute('aria-modal', 'true');
    lightboxModal.setAttribute('aria-label', 'Image and Diagram Viewer');
    lightboxModal.setAttribute('aria-hidden', 'true');
    lightboxModal.style.display = 'none';

    lightboxModal.innerHTML = `
      <div class="lightbox-backdrop" id="lb-backdrop"></div>
      <div class="lightbox-header">
        <div class="lightbox-title-container">
          <span class="lightbox-badge">Enlarged View</span>
          <span class="lightbox-title" id="lb-title"></span>
        </div>
        <div class="lightbox-toolbar">
          <button type="button" class="lightbox-btn" id="lb-btn-zoom-out" title="Zoom Out (-)" aria-label="Zoom Out">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          <button type="button" class="lightbox-btn lightbox-zoom-indicator" id="lb-btn-zoom-reset" title="Reset Zoom (0 / R)" aria-label="Reset Zoom">
            <span id="lb-zoom-text">100%</span>
          </button>
          <button type="button" class="lightbox-btn" id="lb-btn-zoom-in" title="Zoom In (+)" aria-label="Zoom In">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          <button type="button" class="lightbox-btn" id="lb-btn-zoom-fit" title="Toggle 100% / Fit (F)" aria-label="Fit to Screen">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
          </button>
          <a class="lightbox-btn" id="lb-btn-open-new" target="_blank" rel="noopener noreferrer" title="Open source in new tab" aria-label="Open in new tab">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
          <button type="button" class="lightbox-btn lightbox-close-btn" id="lb-btn-close" title="Close (Escape)" aria-label="Close Lightbox">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      <div class="lightbox-stage" id="lb-stage">
        <div class="lightbox-canvas" id="lb-canvas"></div>
      </div>
      <div class="lightbox-footer">
        <span class="lightbox-hint">
          <span class="hint-item"><kbd>Scroll</kbd> or <kbd>+</kbd>/<kbd>-</kbd> to zoom</span>
          <span class="hint-divider">•</span>
          <span class="hint-item">Drag to pan</span>
          <span class="hint-divider">•</span>
          <span class="hint-item">Double-click to toggle zoom</span>
          <span class="hint-divider">•</span>
          <span class="hint-item"><kbd>Esc</kbd> to close</span>
        </span>
      </div>
    `;

    document.body.appendChild(lightboxModal);

    // Cache elements
    backdropEl = document.getElementById('lb-backdrop');
    canvasWrapper = document.getElementById('lb-stage');
    canvasEl = document.getElementById('lb-canvas');
    titleEl = document.getElementById('lb-title');
    zoomLevelEl = document.getElementById('lb-zoom-text');
    btnZoomIn = document.getElementById('lb-btn-zoom-in');
    btnZoomOut = document.getElementById('lb-btn-zoom-out');
    btnZoomReset = document.getElementById('lb-btn-zoom-reset');
    btnZoomFit = document.getElementById('lb-btn-zoom-fit');
    btnOpenNew = document.getElementById('lb-btn-open-new');
    btnClose = document.getElementById('lb-btn-close');

    // Attach listeners
    backdropEl.addEventListener('click', closeLightbox);
    btnClose.addEventListener('click', closeLightbox);
    btnZoomIn.addEventListener('click', () => zoomBy(SCALE_STEP));
    btnZoomOut.addEventListener('click', () => zoomBy(1 / SCALE_STEP));
    btnZoomReset.addEventListener('click', resetZoom);
    btnZoomFit.addEventListener('click', toggleFitOrFull);

    // Drag & Pan handlers on stage
    canvasWrapper.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Wheel zoom
    canvasWrapper.addEventListener('wheel', onWheel, { passive: false });

    // Double click to zoom / reset
    canvasWrapper.addEventListener('dblclick', onDoubleClick);

    // Touch events for mobile/tablets
    canvasWrapper.addEventListener('touchstart', onTouchStart, { passive: false });
    canvasWrapper.addEventListener('touchmove', onTouchMove, { passive: false });
    canvasWrapper.addEventListener('touchend', onTouchEnd);

    // Global Keydown
    window.addEventListener('keydown', onKeyDown);
  }

  function getMediaTitle(el) {
    // 1. Check if enclosed in figure with figcaption
    const figure = el.closest('figure');
    if (figure) {
      const figcaption = figure.querySelector('figcaption');
      if (figcaption && figcaption.textContent.trim()) {
        return figcaption.textContent.trim();
      }
    }

    // 2. Check alt attribute
    if (el.tagName.toLowerCase() === 'img' && el.getAttribute('alt')) {
      return el.getAttribute('alt').trim();
    }

    // 3. Check aria-label or title
    if (el.getAttribute('aria-label')) {
      return el.getAttribute('aria-label').trim();
    }
    if (el.getAttribute('title')) {
      return el.getAttribute('title').trim();
    }

    // 4. Look for preceding heading
    let prev = el.parentElement;
    while (prev && prev !== document.body) {
      const heading = prev.querySelector('h2, h3, h4');
      if (heading && heading.textContent.trim()) {
        return heading.textContent.trim();
      }
      prev = prev.previousElementSibling;
    }

    return 'Diagram Preview';
  }

  function openLightbox(mediaEl) {
    if (!lightboxModal) createLightboxDOM();

    lastFocusedEl = document.activeElement;
    activeMediaEl = mediaEl;

    // Extract title
    const title = getMediaTitle(mediaEl);
    titleEl.textContent = title;

    // Clear previous canvas
    canvasEl.innerHTML = '';
    canvasEl.style.transition = 'none';

    // Clone or render media
    const isSvg = mediaEl.tagName.toLowerCase() === 'svg' || (mediaEl.tagName.toLowerCase() !== 'img' && !!mediaEl.querySelector('svg'));
    const isImg = mediaEl.tagName.toLowerCase() === 'img';
    const rawSrc = isImg ? (mediaEl.currentSrc || mediaEl.src || mediaEl.getAttribute('src') || '') : '';

    if (isSvg) {
      const svgOriginal = mediaEl.tagName.toLowerCase() === 'svg' ? mediaEl : mediaEl.querySelector('svg');
      const svgClone = svgOriginal.cloneNode(true);
      svgClone.classList.add('lightbox-media-svg');
      svgClone.removeAttribute('style'); // remove inline constraints

      // Ensure viewBox exists for responsive vector scaling
      let w = 1200, h = 800;
      const vb = svgClone.getAttribute('viewBox');
      if (vb) {
        const parts = vb.split(/[\s,]+/).map(Number);
        if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
          w = parts[2];
          h = parts[3];
        }
      } else {
        w = parseFloat(svgOriginal.getAttribute('width')) || svgOriginal.clientWidth || 1200;
        h = parseFloat(svgOriginal.getAttribute('height')) || svgOriginal.clientHeight || 800;
        svgClone.setAttribute('viewBox', `0 0 ${w} ${h}`);
      }

      svgClone.setAttribute('width', w);
      svgClone.setAttribute('height', h);
      svgClone.style.maxWidth = 'min(94vw, 1400px)';
      svgClone.style.maxHeight = 'calc(100vh - 120px)';
      svgClone.style.width = 'auto';
      svgClone.style.height = 'auto';
      svgClone.style.aspectRatio = `${w} / ${h}`;
      svgClone.style.margin = 'auto';
      svgClone.style.display = 'block';
      svgClone.style.background = '#ffffff';

      // Create SVG blob url for "Open in new tab"
      try {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgClone);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        currentMediaSrc = URL.createObjectURL(svgBlob);
        btnOpenNew.href = currentMediaSrc;
        btnOpenNew.style.display = 'inline-flex';
      } catch (err) {
        btnOpenNew.style.display = 'none';
      }

      canvasEl.appendChild(svgClone);
      currentScale = 1.0;
      translateX = 0;
      translateY = 0;
      updateTransform(false);
    } else if (isImg) {
      const img = document.createElement('img');
      img.src = rawSrc;
      img.alt = mediaEl.alt || title;
      img.className = 'lightbox-media-image';
      img.draggable = false;
      img.style.maxWidth = 'min(94vw, 1400px)';
      img.style.maxHeight = 'calc(100vh - 120px)';
      img.style.width = 'auto';
      img.style.height = 'auto';
      img.style.margin = 'auto';
      img.style.display = 'block';
      img.style.background = '#ffffff';

      if (activeMediaEl) {
        if (activeMediaEl.naturalWidth && activeMediaEl.naturalHeight) {
          img.style.aspectRatio = `${activeMediaEl.naturalWidth} / ${activeMediaEl.naturalHeight}`;
        } else if (activeMediaEl.getAttribute('width') && activeMediaEl.getAttribute('height')) {
          img.style.aspectRatio = `${parseFloat(activeMediaEl.getAttribute('width'))} / ${parseFloat(activeMediaEl.getAttribute('height'))}`;
        }
      }

      currentMediaSrc = img.src;
      btnOpenNew.href = currentMediaSrc;
      btnOpenNew.style.display = 'inline-flex';
      canvasEl.appendChild(img);

      currentScale = 1.0;
      translateX = 0;
      translateY = 0;
      updateTransform(false);
    }

    // Reset transformations
    currentScale = 1.0;
    translateX = 0;
    translateY = 0;
    updateTransform(false);

    // Show modal
    lightboxModal.style.display = 'flex';
    // Trigger animation
    requestAnimationFrame(() => {
      lightboxModal.classList.add('lightbox-active');
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      applyDefaultCoverZoom(false);
    });

    isOpen = true;
    btnClose.focus();
  }

  function closeLightbox() {
    if (!isOpen) return;

    lightboxModal.classList.remove('lightbox-active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');

    setTimeout(() => {
      if (!lightboxModal.classList.contains('lightbox-active')) {
        lightboxModal.style.display = 'none';
        canvasEl.innerHTML = '';
        if (currentMediaSrc && currentMediaSrc.startsWith('blob:')) {
          URL.revokeObjectURL(currentMediaSrc);
        }
      }
    }, 250);

    isOpen = false;
    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
    }
  }

  let defaultCoverScale = 1.0;
  let defaultTranslateX = 0;
  let defaultTranslateY = 0;

  function calculateCoverMetrics() {
    return { scale: 1.0, tx: 0, ty: 0 };
  }

  function applyDefaultCoverZoom(animate = false) {
    defaultCoverScale = 1.0;
    defaultTranslateX = 0;
    defaultTranslateY = 0;

    currentScale = 1.0;
    translateX = 0;
    translateY = 0;

    updateTransform(animate);
  }

  function updateTransform(animate = false) {
    if (!canvasEl) return;

    if (animate) {
      canvasEl.style.transition = 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)';
    } else {
      canvasEl.style.transition = 'none';
    }

    canvasEl.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${currentScale})`;
    if (zoomLevelEl) {
      zoomLevelEl.textContent = `${Math.round(currentScale * 100)}%`;
    }

    // Update cursor
    if (canvasWrapper) {
      if (currentScale > 1.05) {
        canvasWrapper.style.cursor = isDragging ? 'grabbing' : 'grab';
      } else {
        canvasWrapper.style.cursor = 'default';
      }
    }
  }

  function zoomBy(factor, centerX = null, centerY = null) {
    const newScale = Math.min(Math.max(currentScale * factor, MIN_SCALE), MAX_SCALE);
    if (newScale === currentScale) return;

    if (centerX !== null && centerY !== null && canvasWrapper) {
      const rect = canvasWrapper.getBoundingClientRect();
      const originX = centerX - rect.left - rect.width / 2;
      const originY = centerY - rect.top - rect.height / 2;

      // Adjust translations to zoom toward mouse pointer
      translateX = originX - (originX - translateX) * (newScale / currentScale);
      translateY = originY - (originY - translateY) * (newScale / currentScale);
    } else {
      // Zoom centered
      translateX = translateX * (newScale / currentScale);
      translateY = translateY * (newScale / currentScale);
    }

    currentScale = newScale;

    // If zooming out close to 1, snap to center
    if (currentScale <= 1.0) {
      translateX = 0;
      translateY = 0;
    }

    updateTransform(true);
  }

  function resetZoom() {
    applyDefaultCoverZoom(true);
  }

  function toggleFitOrFull() {
    if (currentScale <= 1.05) {
      currentScale = 2.0;
      translateX = 0;
      translateY = 0;
    } else {
      currentScale = 1.0;
      translateX = 0;
      translateY = 0;
    }
    updateTransform(true);
  }

  function onMouseDown(e) {
    if (!isOpen) return;
    // Don't drag if clicking buttons
    if (e.target.closest('.lightbox-header') || e.target.closest('.lightbox-footer') || e.target.closest('.lightbox-btn')) {
      return;
    }

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialTranslateX = translateX;
    initialTranslateY = translateY;

    if (currentScale > 1.0) {
      canvasWrapper.style.cursor = 'grabbing';
    }
    e.preventDefault();
  }

  function onMouseMove(e) {
    if (!isDragging || !isOpen) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    translateX = initialTranslateX + deltaX;
    translateY = initialTranslateY + deltaY;

    updateTransform(false);
  }

  function onMouseUp() {
    if (!isDragging) return;
    isDragging = false;
    if (canvasWrapper) {
      canvasWrapper.style.cursor = currentScale > 1.05 ? 'grab' : 'default';
    }
  }

  function onWheel(e) {
    if (!isOpen) return;
    e.preventDefault();

    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    zoomBy(zoomFactor, e.clientX, e.clientY);
  }

  function onDoubleClick(e) {
    if (!isOpen) return;
    if (e.target.closest('.lightbox-header') || e.target.closest('.lightbox-footer') || e.target.closest('.lightbox-btn')) {
      return;
    }
    e.preventDefault();

    if (currentScale <= 1.1) {
      zoomBy(2.0 / currentScale, e.clientX, e.clientY);
    } else {
      resetZoom();
    }
  }

  function getDistance(t1, t2) {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function onTouchStart(e) {
    if (!isOpen) return;

    if (e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      initialTranslateX = translateX;
      initialTranslateY = translateY;
    } else if (e.touches.length === 2) {
      isDragging = false;
      touchStartDistance = getDistance(e.touches[0], e.touches[1]);
      touchStartScale = currentScale;
    }
  }

  function onTouchMove(e) {
    if (!isOpen) return;
    e.preventDefault();

    if (e.touches.length === 1 && isDragging) {
      const deltaX = e.touches[0].clientX - startX;
      const deltaY = e.touches[0].clientY - startY;
      translateX = initialTranslateX + deltaX;
      translateY = initialTranslateY + deltaY;
      updateTransform(false);
    } else if (e.touches.length === 2) {
      const currentDist = getDistance(e.touches[0], e.touches[1]);
      if (touchStartDistance > 0) {
        const factor = currentDist / touchStartDistance;
        const newScale = Math.min(Math.max(touchStartScale * factor, MIN_SCALE), MAX_SCALE);
        currentScale = newScale;
        updateTransform(false);
      }
    }
  }

  function onTouchEnd(e) {
    if (!isOpen) return;
    if (e.touches.length < 2) {
      touchStartDistance = 0;
    }
    if (e.touches.length === 0) {
      isDragging = false;
    }
  }

  function onKeyDown(e) {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
      return;
    }

    if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      zoomBy(SCALE_STEP);
      return;
    }

    if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      zoomBy(1 / SCALE_STEP);
      return;
    }

    if (e.key === '0' || e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      resetZoom();
      return;
    }

    if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      toggleFitOrFull();
      return;
    }

    // Arrow keys pan
    const panStep = 60;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      translateX += panStep;
      updateTransform(true);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      translateX -= panStep;
      updateTransform(true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      translateY += panStep;
      updateTransform(true);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      translateY -= panStep;
      updateTransform(true);
    }
  }

  // Setup enlargeable elements on page
  function initMediaEnlarger() {
    createLightboxDOM();

    // Query figures, images, SVGs in content
    const candidates = document.querySelectorAll(`
      figure img,
      figure svg,
      main img:not(.shruti-avatar):not(.stakeholder-avatar):not([data-no-enlarge]),
      main svg:not(.icon):not(.avatar):not([data-no-enlarge]),
      section svg:not(.icon):not(.avatar):not([data-no-enlarge])
    `);

    candidates.forEach((mediaEl) => {
      // Avoid small decorative avatar icons
      if (mediaEl.classList.contains('shruti-avatar') || 
          mediaEl.classList.contains('stakeholder-avatar') ||
          mediaEl.closest('.stakeholder-avatar-group') ||
          mediaEl.getAttribute('width') === '52' || 
          mediaEl.getAttribute('width') === '42') {
        return;
      }

      // Check if element is already configured
      if (mediaEl.dataset.enlargeableConfigured) return;
      mediaEl.dataset.enlargeableConfigured = 'true';

      mediaEl.classList.add('enlargeable-media');
      mediaEl.setAttribute('tabindex', '0');
      mediaEl.setAttribute('role', 'button');
      mediaEl.setAttribute('aria-haspopup', 'dialog');

      const title = getMediaTitle(mediaEl);
      mediaEl.setAttribute('aria-label', `Enlarge image/diagram: ${title}`);

      // Add click & keyboard events
      mediaEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openLightbox(mediaEl);
      });

      mediaEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          openLightbox(mediaEl);
        }
      });

      // If parent is a figure, also style and add badge
      const figure = mediaEl.closest('figure');
      if (figure && !figure.dataset.hasEnlargeBadge) {
        figure.dataset.hasEnlargeBadge = 'true';
        figure.classList.add('enlargeable-figure');
        
        // Add a small hover badge inside figure if not present
        if (!figure.querySelector('.figure-enlarge-badge')) {
          const badge = document.createElement('div');
          badge.className = 'figure-enlarge-badge';
          badge.innerHTML = `
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <span>Click to Enlarge</span>
          `;
          badge.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openLightbox(mediaEl);
          });
          figure.appendChild(badge);
        }
      }
    });
  }

  // Setup responsive scrollable containers for all tables
  function initResponsiveTables() {
    const tables = document.querySelectorAll('main table, article table, section table, .container > table, body > table');
    tables.forEach((table) => {
      // Avoid re-wrapping if already inside a table-container or marked with .no-scroll
      if (table.closest('.table-container') || table.closest('.table-responsive') || table.classList.contains('no-scroll')) {
        return;
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'table-container';
      wrapper.setAttribute('role', 'region');
      wrapper.setAttribute('tabindex', '0');
      wrapper.setAttribute('aria-label', 'Scrollable table');

      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }

  function initAll() {
    initMediaEnlarger();
    initResponsiveTables();
  }

  // Initialize on ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Expose API for dynamic use if needed
  window.EnterpriseAILightbox = {
    open: openLightbox,
    close: closeLightbox,
    init: initMediaEnlarger,
    initTables: initResponsiveTables
  };
})();

