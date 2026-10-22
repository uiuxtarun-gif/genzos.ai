// GenZos.ai - Theme System & Interactive Lifecycle Accordion
document.addEventListener('DOMContentLoaded', () => {
  const htmlElement = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  // ==========================================================================
  // 1. THEME MANAGEMENT SYSTEM (DARK / LIGHT WITH LOCALSTORAGE PERSISTENCE)
  // ==========================================================================
  
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return 'dark'; // Always default to Dark theme when opening the website
  };

  const navbarLogo = document.getElementById('navbarLogo');

  const updateNavbarLogoAndState = () => {
    const isScrolled = window.scrollY > 20;
    const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';

    if (isScrolled) {
      navbar.classList.add('scrolled');
      if (currentTheme === 'light') {
        // Scrolled in Light Mode -> Dark Navbar -> White Logo
        if (navbarLogo) navbarLogo.src = 'logoicon-white.png';
      } else {
        // Scrolled in Dark Mode -> White Navbar -> Dark Logo
        if (navbarLogo) navbarLogo.src = 'logoicon.png';
      }
    } else {
      navbar.classList.remove('scrolled');
      // Hero Top Unscrolled -> Over dark video -> White Logo
      if (navbarLogo) navbarLogo.src = 'logoicon-white.png';
    }
  };

  const footerLogo = document.getElementById('footerLogo');

  const applyTheme = (theme) => {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (themeIcon && themeLabel) {
      if (theme === 'dark') {
        themeIcon.textContent = '☾';
        themeLabel.textContent = 'Dark';
      } else {
        themeIcon.textContent = '☀️';
        themeLabel.textContent = 'Light';
      }
    }

    if (mobileThemeToggle) {
      mobileThemeToggle.innerHTML = theme === 'dark' ? 
        '<span class="theme-icon">☾</span> Dark' : 
        '<span class="theme-icon">☀️</span> Light';
    }

    // Update Footer Logo (Inverted Contrast: Light Mode -> Black Footer -> White Logo; Dark Mode -> White Footer -> Dark Logo)
    if (footerLogo) {
      if (theme === 'dark') {
        footerLogo.src = 'logoicon.png';
      } else {
        footerLogo.src = 'logoicon-white.png';
      }
    }

    updateNavbarLogoAndState();
  };

  const toggleTheme = () => {
    const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  };

  // Initialize theme on page load
  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', toggleTheme);
  }

  // ==========================================================================
  // 2. FIXED NAVBAR SCROLL STATE & MOBILE MENU TOGGLE
  // ==========================================================================
  
  const handleScroll = () => {
    updateNavbarLogoAndState();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');
      } else {
        mobileMenu.classList.add('open');
        mobileToggle.classList.add('active');
        mobileMenu.setAttribute('aria-hidden', 'false');
      }
    });

    const mobileItems = mobileMenu.querySelectorAll('a, button');
    mobileItems.forEach(item => {
      item.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }


  // ==========================================================================
  // 2.5 SECTION 02: SQUISHY 4-CARD INTERACTION
  // ==========================================================================

  const squishyCards = document.querySelectorAll('.squishy-card');
  squishyCards.forEach(card => {
    // Add tactile touch support on mobile devices
    card.addEventListener('touchstart', () => {
      card.classList.add('touch-active');
    }, { passive: true });

    card.addEventListener('touchend', () => {
      setTimeout(() => {
        card.classList.remove('touch-active');
      }, 400);
    }, { passive: true });
  });

  // ==========================================================================
  // 3. SECTION 03 INTERACTIVE PLATFORM FEATURE TILES
  // ==========================================================================
  
  const platformCardsGrid = document.getElementById('platformCardsGrid');
  if (platformCardsGrid) {
    const cards = platformCardsGrid.querySelectorAll('.platform-feature-card');

    cards.forEach((card) => {
      // Click interaction
      card.addEventListener('click', () => {
        cards.forEach((c) => c.classList.remove('is-active'));
        card.classList.add('is-active');
      });

      // Keyboard Accessibility (Enter / Space)
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          cards.forEach((c) => c.classList.remove('is-active'));
          card.classList.add('is-active');
        }
      });
    });
  }

  // ==========================================================================
  // 3.5 SECTION 01: 4-SECOND AUTO-SCROLL HORIZONTAL STEP SHOWCASE
  // ==========================================================================

  const featuresSection = document.getElementById('features');
  const sectionOneTickerViewport = document.getElementById('sectionOneTickerViewport');
  const sectionOneTickerTrack = document.getElementById('sectionOneTickerTrack');

  if (featuresSection && sectionOneTickerViewport && sectionOneTickerTrack) {
    const stepItems = Array.from(sectionOneTickerTrack.querySelectorAll('.ticker-step-item'));
    let currentStepIdx = 0;
    let autoStepTimer = null;
    let isHovered = false;

    const goToStep = (idx) => {
      if (idx < 0 || idx >= stepItems.length) return;
      currentStepIdx = idx;

      // Update active classes
      stepItems.forEach((item, i) => {
        if (i === currentStepIdx) {
          item.classList.add('is-active');
        } else {
          item.classList.remove('is-active');
        }
      });

      // Calculate translation to smoothly scroll/center the active step
      const viewportWidth = sectionOneTickerViewport.clientWidth;
      const trackWidth = sectionOneTickerTrack.scrollWidth;
      const maxTranslate = Math.max(0, trackWidth - viewportWidth);
      
      const activeItem = stepItems[currentStepIdx];
      const itemOffset = activeItem.offsetLeft;
      const itemWidth = activeItem.offsetWidth;
      // Center item in viewport
      const targetTranslate = itemOffset - (viewportWidth / 2) + (itemWidth / 2);
      
      const clampedTranslate = Math.max(0, Math.min(maxTranslate, targetTranslate));
      sectionOneTickerTrack.style.transform = `translate3d(-${clampedTranslate}px, 0, 0)`;
    };

    const startAutoScroll = () => {
      if (autoStepTimer) clearInterval(autoStepTimer);
      autoStepTimer = setInterval(() => {
        if (!isHovered) {
          const nextIdx = (currentStepIdx + 1) % stepItems.length;
          goToStep(nextIdx);
        }
      }, 2000); // Moves every 2 seconds
    };

    // User click interaction on steps
    stepItems.forEach((item, idx) => {
      item.addEventListener('click', () => {
        goToStep(idx);
        startAutoScroll();
      });
    });

    // Pause auto scroll on hover/touch, resume on leave
    sectionOneTickerViewport.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    sectionOneTickerViewport.addEventListener('mouseleave', () => {
      isHovered = false;
    });

    // Touch swipe gestures for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    sectionOneTickerViewport.addEventListener('touchstart', (e) => {
      isHovered = true;
      if (e.touches && e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwiping = true;
      }
    }, { passive: true });

    sectionOneTickerViewport.addEventListener('touchend', (e) => {
      isHovered = false;
      if (isSwiping && e.changedTouches && e.changedTouches.length > 0) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        // Horizontal swipe gesture detection
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            // Swiped left -> Next step
            goToStep((currentStepIdx + 1) % stepItems.length);
          } else {
            // Swiped right -> Previous step
            goToStep((currentStepIdx - 1 + stepItems.length) % stepItems.length);
          }
          startAutoScroll();
        }
      }
      isSwiping = false;
    }, { passive: true });

    window.addEventListener('resize', () => {
      goToStep(currentStepIdx);
    }, { passive: true });

    // Initial activation
    goToStep(0);
    startAutoScroll();
  }

  // ==========================================================================
  // 4. SCROLL REVEAL (RESPECTS PREFERS-REDUCED-MOTION)
  // ==========================================================================
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealElements = document.querySelectorAll(
      '.feature-card, .interactive-card, .capability-item, .profile-card, .squishy-card, .workflow-cards-panel, .section-three__video-wrapper, .section-header, .lifecycle-header, .section-three__header, .workflow-header-sticky, .impact-card, .impact-header, .collab-unified-frame, .collab-header'
    );

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('feature-card') || entry.target.classList.contains('interactive-card') || entry.target.classList.contains('capability-card') || entry.target.classList.contains('profile-card') || entry.target.classList.contains('squishy-card') || entry.target.classList.contains('workflow-step-card') || entry.target.classList.contains('impact-card')) {
            const container = entry.target.parentElement;
            const cardList = Array.from(container.children);
            const index = cardList.indexOf(entry.target);
            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, (index % 6) * 60);
          } else {
            entry.target.classList.add('revealed');
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
      el.classList.add('reveal-init');
      revealObserver.observe(el);
    });
  }



  // Section 06: Who It's For - Progressive Path Animation on Viewport Entry
  const audienceSection = document.getElementById('audience');
  const audiencePathMain = document.getElementById('audiencePathMain');

  if (audienceSection && audiencePathMain) {
    try {
      const pathLength = audiencePathMain.getTotalLength ? audiencePathMain.getTotalLength() : 1200;
      audiencePathMain.style.strokeDasharray = pathLength;
      audiencePathMain.style.strokeDashoffset = pathLength;
      audiencePathMain.style.transition = 'stroke-dashoffset 2.2s cubic-bezier(0.16, 1, 0.3, 1)';

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            audienceSection.classList.add('in-view');
            audiencePathMain.style.strokeDashoffset = '0';
            observer.unobserve(audienceSection);
          }
        });
      }, { threshold: 0.2 });

      observer.observe(audienceSection);
    } catch (e) {
      if (audienceSection) audienceSection.classList.add('in-view');
    }
  }

  // ==========================================================================
  // 5.5 SECTION 07: TRACEABILITY MATRIX & STEP CARDS INTERACTIVITY
  // ==========================================================================
  const collabStepsGrid = document.getElementById('collabStepsGrid');
  const matrixTableBody = document.getElementById('matrixTableBody');
  const matrixSearchInput = document.getElementById('matrixSearchInput');
  const matrixFiltersBtn = document.getElementById('matrixFiltersBtn');
  const matrixAddReqBtn = document.getElementById('matrixAddReqBtn');
  const matrixPaginationGroup = document.getElementById('matrixPaginationGroup');

  if (collabStepsGrid && matrixTableBody) {
    const stepCards = collabStepsGrid.querySelectorAll('.collab-step-card');
    const matrixRows = matrixTableBody.querySelectorAll('.matrix-row');

    const selectStep = (stepNum) => {
      stepCards.forEach(card => {
        if (card.getAttribute('data-step') === String(stepNum)) {
          card.classList.add('is-active');
        } else {
          card.classList.remove('is-active');
        }
      });

      matrixRows.forEach(row => {
        if (row.getAttribute('data-step') === String(stepNum)) {
          row.classList.add('is-active');
        } else {
          row.classList.remove('is-active');
        }
      });
    };

    // Step card click & keyboard activation
    stepCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const stepNum = card.getAttribute('data-step');
        if (stepNum) selectStep(stepNum);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const stepNum = card.getAttribute('data-step');
          if (stepNum) selectStep(stepNum);
        }
      });

      const circleBtn = card.querySelector('.collab-step-circle-btn');
      if (circleBtn) {
        circleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const stepNum = card.getAttribute('data-step');
          if (stepNum) selectStep(stepNum);
        });
      }
    });

    // Row selection click
    matrixRows.forEach(row => {
      row.addEventListener('click', () => {
        const stepNum = row.getAttribute('data-step');
        if (stepNum) selectStep(stepNum);
      });
    });

    // Live search filter on table rows
    if (matrixSearchInput) {
      matrixSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        matrixRows.forEach(row => {
          const text = row.textContent.toLowerCase();
          if (!query || text.includes(query)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    }

    // Filters button toggle
    if (matrixFiltersBtn) {
      matrixFiltersBtn.addEventListener('click', () => {
        matrixFiltersBtn.classList.toggle('is-active');
      });
    }

    // Add Requirement button effect
    if (matrixAddReqBtn) {
      matrixAddReqBtn.addEventListener('click', () => {
        const originalText = matrixAddReqBtn.innerHTML;
        matrixAddReqBtn.innerHTML = '<span>✓ Added to queue</span>';
        matrixAddReqBtn.style.backgroundColor = '#10B981';
        setTimeout(() => {
          matrixAddReqBtn.innerHTML = originalText;
          matrixAddReqBtn.style.backgroundColor = '';
        }, 1800);
      });
    }

    // Pagination numbers click effect
    if (matrixPaginationGroup) {
      const pageBtns = matrixPaginationGroup.querySelectorAll('.matrix-page-num');
      const prevBtn = matrixPaginationGroup.querySelector('[data-page-nav="prev"]');
      const nextBtn = matrixPaginationGroup.querySelector('[data-page-nav="next"]');

      pageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          pageBtns.forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
        });
      });

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          const current = matrixPaginationGroup.querySelector('.matrix-page-num.is-active');
          if (current && current.previousElementSibling && current.previousElementSibling.classList.contains('matrix-page-num')) {
            current.classList.remove('is-active');
            current.previousElementSibling.classList.add('is-active');
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          const current = matrixPaginationGroup.querySelector('.matrix-page-num.is-active');
          if (current && current.nextElementSibling && current.nextElementSibling.classList.contains('matrix-page-num')) {
            current.classList.remove('is-active');
            current.nextElementSibling.classList.add('is-active');
          }
        });
      }
    }
  }

  // ==========================================================================
  // 6. SECTION 13: FAQ ACCORDION INTERACTION (ONE OPEN AT A TIME)
  // ==========================================================================
  const faqAccordion = document.getElementById('faqAccordion');
  if (faqAccordion) {
    const faqItems = faqAccordion.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const btn = item.querySelector('.faq-question-btn');
      if (!btn) return;

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        // Close all items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('is-open');
          const otherBtn = otherItem.querySelector('.faq-question-btn');
          const otherIcon = otherItem.querySelector('.faq-toggle-icon');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherIcon) otherIcon.textContent = '+';
        });

        // Toggle clicked item if it was closed
        if (!isOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          const icon = item.querySelector('.faq-toggle-icon');
          if (icon) icon.textContent = '×';
        }
      });
    });
  }

  // ==========================================================================
  // 7. HERO SECTION: INTERACTIVE MASTER AI CREATION CONSOLE
  // ==========================================================================
  const heroVideo = document.querySelector('.hero-bg-video');
  const heroSection = document.getElementById('hero');
  const heroPromptInput = document.getElementById('heroPromptInput');
  const heroPromptItemsContainer = document.getElementById('heroPromptItems');
  const heroTabs = document.querySelectorAll('.hero-tab-pill');
  const heroPromptEnhance = document.getElementById('heroPromptEnhance');
  const heroPromptSubmit = document.getElementById('heroPromptSubmit');

  // Video viewport visibility observer
  if (heroVideo && heroSection && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          heroVideo.play().catch(() => {});
        } else {
          heroVideo.pause();
        }
      });
    }, { threshold: 0.1 });
    videoObserver.observe(heroSection);
  }

  // Categories suggestions data
  const tabCategoryData = {
    suggested: [
      {
        tag: 'Portfolio',
        text: 'A developer portfolio with dark theme, project cards, and contact form.',
        svg: '<rect x="3" y="3" width="7" height="7" rx="1.5"></rect><rect x="14" y="3" width="7" height="7" rx="1.5"></rect><rect x="14" y="14" width="7" height="7" rx="1.5"></rect><rect x="3" y="14" width="7" height="7" rx="1.5"></rect>'
      },
      {
        tag: 'SaaS Platform',
        text: 'A modern SaaS landing page for a time-tracking app with live metrics.',
        svg: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6.05 11a22.35 22.35 0 0 1-3.95 2z"></path>'
      },
      {
        tag: 'E-Commerce',
        text: 'An e-commerce homepage for a luxury skincare brand with cart drawer.',
        svg: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path>'
      }
    ],
    wireframe: [
      {
        tag: 'Fintech UI',
        text: 'Low-fidelity wireframe flow for mobile banking KYC identity verification.',
        svg: '<rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>'
      },
      {
        tag: 'Analytics',
        text: 'Responsive analytics dashboard wireframe with filter controls and charts.',
        svg: '<rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="12" x2="21" y2="12"></line>'
      },
      {
        tag: 'Checkout',
        text: 'Multi-step e-commerce checkout wireframe with payment and address verification.',
        svg: '<rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8" cy="8" r="2"></circle>'
      }
    ],
    apps: [
      {
        tag: 'Enterprise AI',
        text: 'Full-stack AI customer support copilot with ticket sentiment intelligence.',
        svg: '<rect x="5" y="2" width="14" height="20" rx="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>'
      },
      {
        tag: 'Productivity',
        text: 'Real-time team collaboration workspace with docs, tasks, and kanban boards.',
        svg: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>'
      },
      {
        tag: 'HealthTech',
        text: 'HIPAA-compliant telemedicine portal with encrypted video and patient vitals.',
        svg: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>'
      }
    ],
    websites: [
      {
        tag: 'B2B SaaS',
        text: 'High-converting B2B SaaS landing page with interactive pricing calculator.',
        svg: '<rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>'
      },
      {
        tag: 'Agency',
        text: 'Creative agency portfolio featuring dark aesthetic, case studies, and 3D interactions.',
        svg: '<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>'
      },
      {
        tag: 'Media Portal',
        text: 'Editorial publication website with newsletter subscriptions and content gating.',
        svg: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>'
      }
    ],
    prototype: [
      {
        tag: 'Voice AI',
        text: 'Interactive prototype for an ambient conversational AI assistant.',
        svg: '<rect x="2" y="7" width="14" height="14" rx="2"></rect><path d="M8 7V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"></path>'
      },
      {
        tag: 'Web3 App',
        text: 'High-fidelity prototype for non-custodial crypto wallet and asset swaps.',
        svg: '<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>'
      },
      {
        tag: 'IoT System',
        text: 'Interactive smart energy telemetry dashboard with real-time sensor charts.',
        svg: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>'
      }
    ]
  };

  const bindPromptItemClicks = () => {
    const items = document.querySelectorAll('.hero-prompt-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const text = item.getAttribute('data-text');
        if (text && heroPromptInput) {
          heroPromptInput.value = text;
          heroPromptInput.focus();
        }
      });
    });
  };

  bindPromptItemClicks();

  // Tab switching with smooth transition
  if (heroTabs.length > 0 && heroPromptItemsContainer) {
    heroTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const category = tab.getAttribute('data-tab');
        if (!category || !tabCategoryData[category]) return;

        heroTabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        heroPromptItemsContainer.style.opacity = '0';
        heroPromptItemsContainer.style.transform = 'translateY(4px)';

        setTimeout(() => {
          const itemsData = tabCategoryData[category];
          heroPromptItemsContainer.innerHTML = itemsData.map(item => `
            <div class="hero-prompt-item" role="button" tabindex="0" data-text="${item.text}">
              <div class="hero-prompt-item-left">
                <div class="hero-prompt-item-icon-wrap">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    ${item.svg}
                  </svg>
                </div>
                <div class="hero-prompt-item-content">
                  <span class="hero-prompt-item-tag">${item.tag}</span>
                  <span class="hero-prompt-item-text">${item.text}</span>
                </div>
              </div>
              <div class="hero-prompt-item-right">
                <span class="hero-prompt-item-action">Use Idea</span>
                <span class="hero-prompt-item-arrow">→</span>
              </div>
            </div>
          `).join('');

          bindPromptItemClicks();
          heroPromptItemsContainer.style.opacity = '1';
          heroPromptItemsContainer.style.transform = 'translateY(0)';
        }, 150);
      });
    });
  }

  // AI Prompt Enhance button
  if (heroPromptEnhance && heroPromptInput) {
    heroPromptEnhance.addEventListener('click', () => {
      const currentVal = heroPromptInput.value.trim();
      const enhancements = [
        'An enterprise SaaS dashboard with realtime telemetry, RBAC permissions, audit logging, and automated dark theme.',
        'A full-stack AI-native application builder with automated code generation, live preview sandbox, and instant cloud deployment.',
        'A high-performance modern developer portal with interactive API documentation, webhook testing, and SDK generator.'
      ];
      const randomPrompt = enhancements[Math.floor(Math.random() * enhancements.length)];
      heroPromptInput.value = randomPrompt;
      heroPromptInput.focus();
    });
  }

  // Submit button visual feedback
  if (heroPromptSubmit && heroPromptInput) {
    heroPromptSubmit.addEventListener('click', () => {
      if (!heroPromptInput.value.trim()) {
        heroPromptInput.focus();
        heroPromptInput.placeholder = 'Please enter an idea first...';
      } else {
        const originalText = heroPromptSubmit.innerHTML;
        heroPromptSubmit.innerHTML = '<span>Building...</span>';
        setTimeout(() => {
          heroPromptSubmit.innerHTML = originalText;
        }, 1200);
      }
    });
  }

  // ==========================================================================
  // 5. SECTION 09: INTEGRATIONS FILTER & SEARCH
  // ==========================================================================
  const integrationFilterBtns = document.querySelectorAll('.integrations-filter-bar .filter-btn');
  const integrationCards = document.querySelectorAll('.integrations-grid .integration-card');
  const integrationSearchInput = document.querySelector('.integrations-search-input');

  if (integrationFilterBtns.length && integrationCards.length) {
    const filterCards = () => {
      const activeBtn = document.querySelector('.integrations-filter-bar .filter-btn.is-active');
      const activeFilter = activeBtn ? activeBtn.textContent.trim().toLowerCase() : 'all';
      const searchTerm = integrationSearchInput ? integrationSearchInput.value.trim().toLowerCase() : '';

      integrationCards.forEach(card => {
        const category = (card.getAttribute('data-category') || '').toLowerCase();
        const title = (card.querySelector('.integration-card__title')?.textContent || '').toLowerCase();
        const desc = (card.querySelector('.integration-card__desc')?.textContent || '').toLowerCase();

        const matchesFilter = activeFilter === 'all' || category.includes(activeFilter) || activeFilter.includes(category);
        const matchesSearch = !searchTerm || title.includes(searchTerm) || desc.includes(searchTerm);

        if (matchesFilter && matchesSearch) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    };

    integrationFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        integrationFilterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        filterCards();
      });
    });

    if (integrationSearchInput) {
      integrationSearchInput.addEventListener('input', filterCards);
    }
  }

  // ==========================================================================
  // 6. SECTION 04: REQUIREMENTS TO PRODUCTION 5-CARD INTERACTIVE SHOWCASE
  // ==========================================================================
  const workflowCards = document.querySelectorAll('.workflow-showcase-card');
  const workflowTrack = document.querySelector('.workflow-cards-track');

  if (workflowCards.length && workflowTrack) {
    workflowCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        workflowCards.forEach(c => c.classList.remove('is-active'));
        card.classList.add('is-active');
      });

      card.addEventListener('focus', () => {
        workflowCards.forEach(c => c.classList.remove('is-active'));
        card.classList.add('is-active');
      });
    });

    workflowTrack.addEventListener('mouseleave', () => {
      // Default to middle card (Step 03) as active when mouse leaves the panel
      workflowCards.forEach(c => c.classList.remove('is-active'));
      const middleCard = document.querySelector('.workflow-showcase-card[data-index="3"]') || workflowCards[2] || workflowCards[0];
      middleCard?.classList.add('is-active');
    });
  }
});


