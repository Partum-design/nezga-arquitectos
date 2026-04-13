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

  document.querySelectorAll("[data-anim]").forEach((item) => {
    item.classList.add("is-visible");
  });

  const counters = document.querySelectorAll("[data-counter]");
  if (counters.length) {
    const runCounter = (node) => {
      const target = Number(node.getAttribute("data-counter") || 0);
      if (!target) return;
      const duration = 1200;
      const startTime = performance.now();

      const update = (time) => {
        const progress = Math.min((time - startTime) / duration, 1);
        node.textContent = `${Math.floor(target * progress)}+`;
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          node.textContent = `${target}+`;
        }
      };

      requestAnimationFrame(update);
    };

    counters.forEach((counter) => runCounter(counter));
  }


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
      if (field) {
        field.addEventListener("input", () => validateField(key));
      }
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

  const yearNodes = document.querySelectorAll("[data-year]");
  yearNodes.forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const initStringTune = () => {
    if (!window.StringTune || !window.StringTune.StringTune) return;

    const API = window.StringTune;
    const tune = API.StringTune.getInstance();

    try {
      tune.use(API.StringMagnetic);

      document.querySelectorAll(".btn, .whatsapp-float, .footer-socials a").forEach((node) => {
        node.setAttribute("string", "magnetic");
      });

      tune.start(60);
    } catch (error) {
      console.warn("StringTune no pudo inicializarse:", error);
    }
  };

  initStringTune();
})();
