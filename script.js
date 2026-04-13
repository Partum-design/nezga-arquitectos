(function () {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelectorAll(".nav-link");

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 18);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      body.classList.remove("menu-open");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) {
      body.classList.remove("menu-open");
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  const revealItems = document.querySelectorAll(".reveal");
  if (revealItems.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const processSteps = document.querySelectorAll(".process-step");
  if (processSteps.length) {
    const processObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("in-view", entry.isIntersecting);
        });
      },
      { threshold: 0.35 }
    );

    processSteps.forEach((step) => processObserver.observe(step));
  }

  const counterElements = document.querySelectorAll("[data-counter]");
  const animateCounter = (element) => {
    const target = Number(element.dataset.counter || 0);
    let current = 0;
    const duration = 1300;
    const start = performance.now();

    const tick = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      current = Math.floor(progress * target);
      element.textContent = `${current}+`;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        element.textContent = `${target}+`;
      }
    };

    requestAnimationFrame(tick);
  };

  if (counterElements.length) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterElements.forEach((counter) => counterObserver.observe(counter));
  }

  const hero = document.querySelector(".hero");
  if (hero && window.matchMedia("(min-width: 881px)").matches) {
    hero.addEventListener("mousemove", (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      hero.style.setProperty("transform", `perspective(1200px) rotateX(${(y - 0.5) * -0.9}deg) rotateY(${(x - 0.5) * 1.2}deg)`);
    });

    hero.addEventListener("mouseleave", () => {
      hero.style.setProperty("transform", "none");
    });
  }

  const yearNode = document.querySelector("[data-year]");
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());

  const contactForm = document.querySelector("#contactForm");
  if (contactForm) {
    const statusBox = document.querySelector("#formStatus");
    const fields = {
      name: {
        input: contactForm.querySelector("#nombre"),
        error: contactForm.querySelector("[data-error='nombre']"),
        validate: (value) => value.trim().length >= 3,
        message: "Escribe un nombre válido (mínimo 3 caracteres)."
      },
      phone: {
        input: contactForm.querySelector("#telefono"),
        error: contactForm.querySelector("[data-error='telefono']"),
        validate: (value) => /^[0-9+\s()-]{8,}$/.test(value.trim()),
        message: "Ingresa un teléfono válido."
      },
      email: {
        input: contactForm.querySelector("#correo"),
        error: contactForm.querySelector("[data-error='correo']"),
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()),
        message: "Ingresa un correo electrónico válido."
      },
      project: {
        input: contactForm.querySelector("#proyecto"),
        error: contactForm.querySelector("[data-error='proyecto']"),
        validate: (value) => value.trim().length >= 3,
        message: "Indica el tipo de proyecto."
      },
      message: {
        input: contactForm.querySelector("#mensaje"),
        error: contactForm.querySelector("[data-error='mensaje']"),
        validate: (value) => value.trim().length >= 12,
        message: "Describe tu proyecto con al menos 12 caracteres."
      }
    };

    const setStatus = (text, type) => {
      if (!statusBox) return;
      statusBox.textContent = text;
      statusBox.className = `form-status ${type}`;
    };

    const validateField = (key) => {
      const field = fields[key];
      if (!field) return true;
      const valid = field.validate(field.input.value);
      field.error.textContent = valid ? "" : field.message;
      return valid;
    };

    Object.keys(fields).forEach((key) => {
      const field = fields[key];
      field.input.addEventListener("input", () => validateField(key));
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      setStatus("", "");
      const valid = Object.keys(fields).every((key) => validateField(key));

      if (!valid) {
        setStatus("Revisa los campos marcados antes de enviar.", "error");
        return;
      }

      setStatus("Mensaje enviado. Te contactaremos a la brevedad.", "success");
      contactForm.reset();
    });
  }
})();
