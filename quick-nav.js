/**
 * Quick Chapter Navigation Drawer for "The Reality of Enterprise AI"
 * Provides a responsive hamburger menu, slide-over drawer, live filter,
 * active chapter highlighting, and keyboard shortcuts across all pages.
 */
(function () {
  'use strict';

  const BOOK_STRUCTURE = [
    {
      category: "Front Matter",
      items: [
        { id: "title", title: "Title Page", file: "title.html", tag: "Publication", desc: "Book title, subtitle, author credits, and edition details." },
        { id: "copyright", title: "Copyright Page", file: "copyright.html", tag: "Legal", desc: "Legal disclaimers, ISBN, and TOGAF® trademark notices." },
        { id: "forward", title: "Foreword", file: "forward.html", tag: "Front Matter", desc: "The strategic bridge between algorithms and boardroom accountability." },
        { id: "preface", title: "Preface", file: "preface.html", tag: "Author's Note", desc: "Why we wrote a boardroom graphic novel about enterprise architecture." },
        { id: "introduction", title: "Introduction", file: "introduction.html", tag: "Orientation", desc: "Overview of tripartite ecosystem scope and architectural guidance." },
        { id: "prologue", title: "Prologue: The Abstract vs. The Asphalt", file: "prologue.html", tag: "Foundation", desc: "Why AI strategies buckle under real execution." }
      ]
    },
    {
      category: "Part I: The Reality of Enterprise AI",
      badge: "Phases Preliminary & A",
      items: [
        { id: "chapter_1", num: "1", title: "Chapter 1: The Ecosystem Unveiled", file: "chapter_1.html", tag: "Preliminary Phase", desc: "The Smart Mobility Ecosystem, 9 personas, 5 Principles, and EAB Charter." },
        { id: "chapter_2", num: "2", title: "Chapter 2: The Diagnostic Dilemma", file: "chapter_2.html", tag: "Requirements Mgmt", desc: "The $50M bleed investigation, Unified Data Layer, and Failure Taxonomy." },
        { id: "chapter_3", num: "3", title: "Chapter 3: The Productivity Paradox", file: "chapter_3.html", tag: "Phase A: Vision", desc: "Boardroom showdown, Architecture Vision, and business capability mapping." }
      ]
    },
    {
      category: "Part II: Upstream Architecture & Supply Chain Execution",
      badge: "Phases B, C, D, E & F",
      items: [
        { id: "chapter_4", num: "4", title: "Chapter 4: The Economics of AI", file: "chapter_4.html", tag: "Phase B: Business", desc: "CapEx business case, horizontal ecosystem scaling, and bridging skills gaps." },
        { id: "chapter_5", num: "5", title: "Chapter 5: The Data Governance Bedrock", file: "chapter_5.html", tag: "Phase C: Data", desc: "Event Storming, DDD Strategic Context Map, and Digital Product Passports." },
        { id: "chapter_6", num: "6", title: "Chapter 6: Solving Scalability Friction", file: "chapter_6.html", tag: "Phase D: Technology", desc: "Sub-2.5ms edge robotics, ISA-95 factory integration, and TinyML MLOps." },
        { id: "chapter_7", num: "7", title: "Chapter 7: Optimizing the Engine", file: "chapter_7.html", tag: "Phase E: Solutions", desc: "12 joint work packages, 3-phase transition roadmap, and SCOR sync." },
        { id: "chapter_8", num: "8", title: "Chapter 8: Sequencing the Transformation", file: "chapter_8.html", tag: "Phase F: Migration", desc: "Implementation and Migration Plan (IMP), critical path, and staged CapEx." }
      ]
    },
    {
      category: "Part III: Governance, Workforce & Future-Proofing",
      badge: "Phases G & H",
      items: [
        { id: "chapter_9", num: "9", title: "Chapter 9: Navigating the Regulatory Landscape", file: "chapter_9.html", tag: "Phase G: Governance", desc: "Architecture Contracts, automated fitness functions, and EU AI Act conformity." },
        { id: "chapter_10", num: "10", title: "Chapter 10: The Augmented Workforce", file: "chapter_10.html", tag: "Phase H: Change Mgmt", desc: "Human capital transition, workforce upskilling, and live APM telemetry." }
      ]
    },
    {
      category: "Epilogue & Back Matter",
      items: [
        { id: "epilogue", num: "E", title: "Epilogue: The Roadmap to Sustained Intelligence", file: "epilogue.html", tag: "Epilogue / Summit", desc: "Ecosystem summit, unified covenants, and permanent adaptation roadmap." },
        { id: "index", title: "Table of Contents", file: "index.html", tag: "Directory", desc: "Complete master index and book navigation hub." },
        { id: "glossary", title: "Glossary & Reference", file: "glossary.html", tag: "Reference", desc: "TOGAF ADM, DDD taxonomies, Fiduciary Duties, and architectural formulas." }
      ]
    }
  ];

  let drawerEl = null;
  let backdropEl = null;
  let searchInput = null;
  let isOpen = false;
  let lastFocusedEl = null;

  function getCurrentFile() {
    const path = window.location.pathname;
    const parts = path.split('/');
    const last = parts[parts.length - 1];
    return (last && last.endsWith('.html')) ? last : 'index.html';
  }

  function createDrawerDOM() {
    if (document.getElementById('quick-nav-drawer')) return;

    const currentFile = getCurrentFile();

    // Drawer Container
    drawerEl = document.createElement('div');
    drawerEl.id = 'quick-nav-drawer';
    drawerEl.className = 'quick-nav-drawer';
    drawerEl.setAttribute('role', 'dialog');
    drawerEl.setAttribute('aria-modal', 'true');
    drawerEl.setAttribute('aria-label', 'Chapter Navigation Menu');
    drawerEl.setAttribute('aria-hidden', 'true');

    // Backdrop
    backdropEl = document.createElement('div');
    backdropEl.id = 'quick-nav-backdrop';
    backdropEl.className = 'quick-nav-backdrop';

    // Drawer inner markup
    drawerEl.innerHTML = `
      <div class="quick-nav-header">
        <div class="quick-nav-branding">
          <div class="quick-nav-book-badge">Enterprise AI Architecture</div>
          <h3 class="quick-nav-title">Chapter Navigation</h3>
        </div>
        <button type="button" class="quick-nav-close-btn" id="quick-nav-close" aria-label="Close navigation menu" title="Close (Escape)">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="quick-nav-search-box">
        <div class="quick-nav-search-input-wrapper">
          <svg class="quick-nav-search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="quick-nav-search" class="quick-nav-search-input" placeholder="Search chapters, topics, phases (e.g. Phase D, Battery, Governance)..." autocomplete="off" spellcheck="false">
          <button type="button" id="quick-nav-search-clear" class="quick-nav-search-clear" aria-label="Clear search" style="display: none;">✕</button>
        </div>
        <div class="quick-nav-shortcut-hint">Press <kbd>Esc</kbd> to close &bull; <kbd>Alt</kbd>+<kbd>M</kbd> to toggle</div>
      </div>

      <div class="quick-nav-body" id="quick-nav-body">
        ${renderChapterList(currentFile, '')}
      </div>

      <div class="quick-nav-footer">
        <a href="index.html" class="quick-nav-footer-link ${currentFile === 'index.html' ? 'active' : ''}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Table of Contents</span>
        </a>
        <a href="glossary.html" class="quick-nav-footer-link ${currentFile === 'glossary.html' ? 'active' : ''}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <span>Glossary &amp; Reference</span>
        </a>
      </div>
    `;

    document.body.appendChild(backdropEl);
    document.body.appendChild(drawerEl);

    const closeBtn = drawerEl.querySelector('#quick-nav-close');
    searchInput = drawerEl.querySelector('#quick-nav-search');
    const searchClear = drawerEl.querySelector('#quick-nav-search-clear');

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (backdropEl) backdropEl.addEventListener('click', closeDrawer);

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.trim().toLowerCase();
        if (searchClear) searchClear.style.display = q ? 'block' : 'none';
        filterChapters(q, currentFile);
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchClear.style.display = 'none';
          filterChapters('', currentFile);
          searchInput.focus();
        }
      });
    }
  }

  function renderChapterList(currentFile, query) {
    let html = '';
    let totalMatches = 0;

    BOOK_STRUCTURE.forEach((sec) => {
      const filteredItems = sec.items.filter((item) => {
        if (!query) return true;
        const text = `${item.title} ${item.tag || ''} ${item.desc || ''} ${sec.category} ${item.num || ''}`.toLowerCase();
        return text.includes(query);
      });

      if (filteredItems.length === 0) return;

      totalMatches += filteredItems.length;

      html += `<div class="quick-nav-section">`;
      html += `  <div class="quick-nav-section-title">`;
      html += `    <span>${sec.category}</span>`;
      if (sec.badge) {
        html += `    <span class="quick-nav-section-badge">${sec.badge}</span>`;
      }
      html += `  </div>`;
      html += `  <ul class="quick-nav-list">`;

      filteredItems.forEach((item) => {
        const isActive = item.file === currentFile;
        html += `
          <li class="quick-nav-item">
            <a href="${item.file}" class="quick-nav-link ${isActive ? 'active' : ''}" data-file="${item.file}">
              ${item.num ? `<span class="quick-nav-num">${item.num}</span>` : `<span class="quick-nav-dot"></span>`}
              <div class="quick-nav-info">
                <div class="quick-nav-item-top">
                  <span class="quick-nav-item-title">${item.title}</span>
                  ${parseBadge(isActive, item.tag)}
                </div>
                <p class="quick-nav-item-desc">${item.desc}</p>
              </div>
            </a>
          </li>
        `;
      });

      html += `  </ul>`;
      html += `</div>`;
    });

    if (totalMatches === 0) {
      html = `
        <div class="quick-nav-empty">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <p>No chapters or sections found matching "<strong>${escapeHTML(query)}</strong>"</p>
        </div>
      `;
    }

    return html;
  }

  function parseBadge(isActive, tag) {
    if (isActive) {
      return '<span class="quick-nav-current-badge">Current</span>';
    }
    if (tag) {
      return `<span class="quick-nav-item-tag">${tag}</span>`;
    }
    return '';
  }

  function filterChapters(query, currentFile) {
    const bodyEl = document.getElementById('quick-nav-body');
    if (bodyEl) {
      bodyEl.innerHTML = renderChapterList(currentFile, query);
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  function openDrawer() {
    if (!drawerEl) createDrawerDOM();

    lastFocusedEl = document.activeElement;

    if (backdropEl) backdropEl.classList.add('active');
    if (drawerEl) {
      drawerEl.classList.add('active');
      drawerEl.setAttribute('aria-hidden', 'false');
    }
    document.body.classList.add('quick-nav-open');
    isOpen = true;

    setTimeout(() => {
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }

      if (drawerEl) {
        const activeLink = drawerEl.querySelector('.quick-nav-link.active');
        if (activeLink && typeof activeLink.scrollIntoView === 'function') {
          activeLink.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      }
    }, 100);
  }

  function closeDrawer() {
    if (!isOpen) return;

    if (backdropEl) backdropEl.classList.remove('active');
    if (drawerEl) {
      drawerEl.classList.remove('active');
      drawerEl.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('quick-nav-open');
    isOpen = false;

    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
    }
  }

  function toggleDrawer() {
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  function injectHamburgerButton() {
    const header = document.querySelector('header');
    if (!header) return;

    if (header.querySelector('.hamburger-btn')) return;

    const hamburgerBtn = document.createElement('button');
    hamburgerBtn.type = 'button';
    hamburgerBtn.className = 'hamburger-btn';
    hamburgerBtn.setAttribute('aria-label', 'Open chapter navigation menu');
    hamburgerBtn.setAttribute('aria-controls', 'quick-nav-drawer');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('title', 'Quick Chapter Navigation (Alt+M / Menu)');

    hamburgerBtn.innerHTML = `
      <span class="hamburger-icon-box">
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
      </span>
      <span class="hamburger-label">Chapters</span>
    `;

    hamburgerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openDrawer();
    });

    const logo = header.querySelector('.logo');
    if (logo) {
      const leftGroup = document.createElement('div');
      leftGroup.className = 'header-left-group';
      header.insertBefore(leftGroup, logo);
      leftGroup.appendChild(hamburgerBtn);
      leftGroup.appendChild(logo);
    } else {
      header.insertBefore(hamburgerBtn, header.firstChild);
    }
  }

  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        closeDrawer();
        return;
      }

      if ((e.altKey && (e.key === 'm' || e.key === 'M')) || 
          ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K'))) {
        e.preventDefault();
        toggleDrawer();
      }
    });
  }

  function init() {
    injectHamburgerButton();
    createDrawerDOM();
    setupKeyboardShortcuts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.QuickChapterNav = {
    open: openDrawer,
    close: closeDrawer,
    toggle: toggleDrawer,
    init: init
  };
})();
