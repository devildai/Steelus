const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navAnchors = document.querySelectorAll(".nav-links a");
const topbar = document.getElementById("topbar");
const year = document.getElementById("year");
const scrollProgress = document.getElementById("scrollProgress");

const revealItems = document.querySelectorAll(".reveal-item");
const counters = document.querySelectorAll(".counter");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxTriggers = document.querySelectorAll(".lightbox-trigger");

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

let ticking = false;
let lastScrollY = window.scrollY;
let lastHeaderState = false;

/* =========================
   YEAR
   ========================= */
if (year) {
  year.textContent = new Date().getFullYear();
}

/* =========================
   MOBILE MENU
   ========================= */
function openMenu() {
  if (!navLinks || !menuToggle) return;
  navLinks.classList.add("show");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  if (!navLinks || !menuToggle) return;
  navLinks.classList.remove("show");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

function toggleMenu() {
  if (!navLinks) return;
  if (navLinks.classList.contains("show")) {
    closeMenu();
  } else {
    openMenu();
  }
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = navLinks.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideNav && !clickedToggle) {
      closeMenu();
    }
  });
}

navAnchors.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    document.body.classList.remove("menu-open");
    if (navLinks) {
      navLinks.classList.remove("show");
    }
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
  }
});

/* =========================
   SCROLL UI
   ========================= */
function applyScrollUI() {
  const scrollTop = lastScrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;

  if (scrollProgress) {
    scrollProgress.style.width = `${progress}%`;
  }

  if (topbar) {
    const shouldBeScrolled = scrollTop > 8;
    if (shouldBeScrolled !== lastHeaderState) {
      topbar.classList.toggle("scrolled", shouldBeScrolled);
      lastHeaderState = shouldBeScrolled;
    }
  }

  ticking = false;
}

function requestScrollUpdate() {
  lastScrollY = window.scrollY || window.pageYOffset;
  if (!ticking) {
    window.requestAnimationFrame(applyScrollUI);
    ticking = true;
  }
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("load", requestScrollUpdate);

/* =========================
   COUNTER ANIMATION
   ========================= */
function animateCounter(counter) {
  if (counter.dataset.animated === "true") return;

  const target = Number(counter.dataset.target) || 0;
  const duration = 1400;
  const startTime = performance.now();
  counter.dataset.animated = "true";

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);

    counter.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      counter.textContent = target;
    }
  }

  requestAnimationFrame(step);
}

/* =========================
   REVEAL ANIMATION
   ========================= */
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show-item");

          if (entry.target.classList.contains("counter")) {
            animateCounter(entry.target);
          }

          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
  counters.forEach((counter) => revealObserver.observe(counter));
} else {
  revealItems.forEach((item) => item.classList.add("show-item"));
  counters.forEach((counter) => {
    counter.textContent = counter.dataset.target || "0";
  });
}

/* =========================
   LIGHTBOX
   ========================= */
function openLightbox(src, alt) {
  if (!lightbox || !lightboxImage || !src) return;

  lightboxImage.src = src;
  lightboxImage.alt = alt || "Gallery image";
  lightbox.classList.add("show");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;

  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = document.body.classList.contains("menu-open") ? "hidden" : "";

  setTimeout(() => {
    if (!lightbox.classList.contains("show")) {
      lightboxImage.src = "";
      lightboxImage.alt = "";
    }
  }, 220);
}

lightboxTriggers.forEach((img) => {
  img.addEventListener("click", () => {
    openLightbox(img.currentSrc || img.src, img.alt);
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (lightbox && lightbox.classList.contains("show")) {
      closeLightbox();
    } else if (navLinks && navLinks.classList.contains("show")) {
      closeMenu();
    }
  }
});

/* =========================
   EMAILJS CONTACT FORM
   ========================= */
const EMAILJS_PUBLIC_KEY = "B1HNb_blqRRfC6Tpc";
const EMAILJS_SERVICE_ID = "service_wune1ig";
const EMAILJS_TEMPLATE_ID = "template_n62ii0v";

if (window.emailjs) {
  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY,
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!window.emailjs) {
      formStatus.textContent = "Email service failed to load. Please try again later.";
      formStatus.className = "form-status error";
      return;
    }

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const subject = document.getElementById("subject")?.value.trim();
    const message = document.getElementById("message")?.value.trim();

    if (!name || !email || !subject || !message) {
      formStatus.textContent = "Please fill in all required fields.";
      formStatus.className = "form-status error";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    formStatus.textContent = "";
    formStatus.className = "form-status";

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        to_email: "devildaimanish@gmail.com",
        reply_to: email,
      });

      formStatus.textContent = "Your message has been sent successfully.";
      formStatus.className = "form-status success";
      contactForm.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      formStatus.textContent = "Message could not be sent. Please try again.";
      formStatus.className = "form-status error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
}