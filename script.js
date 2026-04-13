(function () {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  const progressBar = document.querySelector(".scroll-progress");

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  const setScrollProgress = () => {
    if (!progressBar) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  };

  setHeaderState();
  setScrollProgress();

  window.addEventListener("scroll", () => {
    setHeaderState();
    setScrollProgress();
  }, { passive: true });

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1120 && body.classList.contains("menu-open")) {
      body.classList.remove("menu-open");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  const contactForm = document.querySelector("#contactForm");
  if (contactForm) {
    const status = document.querySelector("#formStatus");
    const getField = (id) => contactForm.querySelector(`#${id}`);
    const getError = (id) => contactForm.querySelector(`[data-error='${id}']`);

    const validators = {
      nombre: {
        check: (value) => value.trim().length >= 3,
        message: "Escribe un nombre válido (mínimo 3 caracteres)."
      },
      telefono: {
        check: (value) => /^[0-9+\s()-]{8,}$/.test(value.trim()),
        message: "Ingresa un teléfono válido."
      },
      correo: {
        check: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()),
        message: "Ingresa un correo válido."
      },
      proyecto: {
        check: (value) => value.trim().length >= 3,
        message: "Describe el tipo de proyecto."
      },
      mensaje: {
        check: (value) => value.trim().length >= 12,
        message: "Incluye al menos 12 caracteres en el mensaje."
      }
    };

    const setStatus = (text, type) => {
      if (!status) return;
      status.className = `form-status ${type}`;
      status.textContent = text;
    };

    const validateField = (key) => {
      const field = getField(key);
      const error = getError(key);
      const rule = validators[key];
      const valid = field && rule ? rule.check(field.value) : true;
      if (error && rule) error.textContent = valid ? "" : rule.message;
      return valid;
    };

    Object.keys(validators).forEach((key) => {
      const field = getField(key);
      if (field) field.addEventListener("input", () => validateField(key));
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const valid = Object.keys(validators).every((key) => validateField(key));

      if (!valid) {
        setStatus("Revisa los campos marcados antes de enviar.", "error");
        return;
      }

      setStatus("Mensaje enviado. Te contactaremos a la brevedad.", "success");
      contactForm.reset();
    });
  }

  document.querySelectorAll("[data-counter]").forEach((node) => {
    const target = Number(node.getAttribute("data-counter") || 0);
    if (target > 0) node.textContent = `${target}+`;
  });

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const initStringTune = () => {
    if (!window.StringTune || !window.StringTune.StringTune) return;

    const API = window.StringTune;
    const tune = API.StringTune.getInstance();

    const addStringEffect = (element, effect, attrs = {}) => {
      if (!element) return;
      const raw = element.getAttribute("string") || "";
      const tokens = raw.split("|").map((t) => t.trim()).filter(Boolean);
      if (effect && !tokens.includes(effect)) tokens.push(effect);
      element.setAttribute("string", tokens.join("|"));
      Object.entries(attrs).forEach(([key, val]) => {
        element.setAttribute(`string-${key}`, String(val));
      });
    };

    const markReveal = (selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        el.classList.add("st-reveal");
        if (!el.hasAttribute("string")) {
          el.setAttribute("string", "");
          el.setAttribute("string-repeat", "");
        }
      });
    };

    markReveal(".section-head, .project-card, .service-item, .timeline-step, .quote-card, .zones-card, .service-panel, .contact-info-card, .contact-strip-grid article, .feature-media, .feature-copy, .process-alt-card, .process-alt-image, .gallery-grid article");

    document.querySelectorAll(".hero-content h1, .section-head h2, .final-cta-wrap h2, .hero-inner-content h1").forEach((title) => {
      title.classList.add("st-split");
      title.setAttribute("string", "split");
      title.setAttribute("string-repeat", "");
      title.setAttribute("string-split", "char");
    });

    document.querySelectorAll(".btn, .whatsapp-float, .footer-socials a").forEach((node) => {
      addStringEffect(node, "magnetic", { radius: 700, strength: 0.11 });
    });

    const footer = document.querySelector(".site-footer");
    if (footer) {
      footer.classList.add("st-footer-shift");
      footer.setAttribute("string", "progress");
      footer.setAttribute("string-exit-vp", "bottom");
    }

    try {
      tune.use(API.StringMagnetic);
      tune.use(API.StringSplit);
      tune.use(API.StringProgress);
      tune.start(0);
    } catch (error) {
      console.warn("StringTune no pudo inicializarse:", error);
    }
  };

  initStringTune();
})();
