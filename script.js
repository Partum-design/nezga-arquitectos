/* ============================================================
   NEZGA ARQUITECTOS - Main JavaScript
   Premium interactions, StringTune integration, form validation
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     1. HEADER - Scroll Effect & Sticky
     ============================================================ */
  const header = document.getElementById('header');

  function handleHeaderScroll() {
    if (window.scrollY > 80) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Initial check

  /* ============================================================
     2. MOBILE MENU
     ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('active');

    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.classList.toggle('menu-open', !isOpen);

    // Toggle body scroll
    document.body.style.overflow = isOpen ? '' : 'hidden';

    // Update aria
    hamburger.setAttribute('aria-expanded', !isOpen);
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close mobile menu when clicking a link
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  /* ============================================================
     2.1 CUSTOM CURSOR (Desktop only)
     ============================================================ */
  const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (supportsFinePointer) {
    document.body.classList.add('has-custom-cursor');

    const cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    const cursorRing = document.createElement('div');
    cursorRing.className = 'custom-cursor-ring';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;

      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';

      requestAnimationFrame(renderCursor);
    }

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      document.body.classList.add('cursor-active');
    });

    document.addEventListener('mouseout', function (e) {
      if (!e.relatedTarget || e.relatedTarget.nodeName === 'HTML') {
        document.body.classList.remove('cursor-active');
      }
    });

    document.querySelectorAll('a, button, .btn, .hamburger, input, textarea, select').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', function () {
        document.body.classList.remove('cursor-hover');
      });
    });

    renderCursor();
  }

  /* ============================================================
     3. SCROLL REVEAL ANIMATIONS
     ============================================================ */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children');

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ============================================================
     4. COUNTER ANIMATION
     ============================================================ */
  const counters = document.querySelectorAll('.counter-animate');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = current + '+';

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (counter) {
    counterObserver.observe(counter);
  });

  /* ============================================================
     5. STRINGTUNE LIBRARY INTEGRATION
     ============================================================ */
  if (typeof StringTune !== 'undefined' && StringTune.StringTune) {
    try {
      const stringTune = StringTune.StringTune.getInstance();
      window.StringTuneContext = stringTune;

      // Register available plugins
      const plugins = [
        'StringProgress', 'StringSplit', 'StringLazy', 'StringMagnetic', 'StringParallax'
      ];

      plugins.forEach(pluginName => {
        if (StringTune[pluginName]) {
          stringTune.use(StringTune[pluginName]);
        }
      });

      // Initialize
      stringTune.start(0);
    } catch (e) {
      console.warn('StringTune initialization error:', e);
    }
  }

  /* ============================================================
     6. CONTACT FORM VALIDATION
     ============================================================ */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;

      // Reset errors
      const errors = contactForm.querySelectorAll('.form-error');
      const inputs = contactForm.querySelectorAll('input, textarea, select');

      errors.forEach(function (error) {
        error.classList.remove('visible');
      });
      inputs.forEach(function (input) {
        input.classList.remove('error');
      });

      // Validate nombre
      const nombre = document.getElementById('nombre');
      if (!nombre.value.trim()) {
        showError('nombre');
        isValid = false;
      }

      // Validate telefono
      const telefono = document.getElementById('telefono');
      if (!telefono.value.trim() || telefono.value.trim().length < 8) {
        showError('telefono');
        isValid = false;
      }

      // Validate correo
      const correo = document.getElementById('correo');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!correo.value.trim() || !emailRegex.test(correo.value.trim())) {
        showError('correo');
        isValid = false;
      }

      // Validate proyecto
      const proyecto = document.getElementById('proyecto');
      if (!proyecto.value) {
        showError('proyecto');
        isValid = false;
      }

      // Validate mensaje
      const mensaje = document.getElementById('mensaje');
      if (!mensaje.value.trim()) {
        showError('mensaje');
        isValid = false;
      }

      if (isValid) {
        // Hide form, show success
        contactForm.style.display = 'none';
        document.getElementById('formSuccess').classList.add('visible');
      }
    });

    // Real-time validation on input
    contactForm.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.addEventListener('input', function () {
        this.classList.remove('error');
        const errorEl = document.getElementById(this.id + 'Error');
        if (errorEl) {
          errorEl.classList.remove('visible');
        }
      });
    });
  }

  function showError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + 'Error');
    if (field) field.classList.add('error');
    if (errorEl) errorEl.classList.add('visible');
  }

  /* ============================================================
     7. SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ============================================================
     8. ACTIVE LINK HIGHLIGHT
     ============================================================ */
  // Already handled via HTML class="active" on each page

  /* ============================================================
     9. LAZY LOADING ENHANCEMENT
     ============================================================ */
  // Native lazy loading is already set via HTML attributes.
  // StringTune handles its own lazy loading via the `string="lazy"` attribute.

  /* ============================================================
     10. PERFORMANCE: RequestAnimationFrame scroll handler
     ============================================================ */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        handleHeaderScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Replace the basic scroll listener with RAF-optimized one
  window.removeEventListener('scroll', handleHeaderScroll);
  window.addEventListener('scroll', onScroll, { passive: true });

});
