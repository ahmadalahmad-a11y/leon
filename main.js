/**
 * ==============================================================================
 * Leon Template - Interactive Vanilla JavaScript (ES6+)
 * High Performance, Responsive & Smooth Animations
 * ==============================================================================
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all interactive modules
  initHeaderAndNav();
  initLandingSlider();
  initPortfolioFilter();
  initPortfolioLightbox();
  initScrollAnimations();
  initStatsAndSkillsCounters();
  initSmoothScrollAndScrollSpy();
  initBackToTop();
});

/* --------------------------------------------------------------------------
   1. Mobile Navigation & Sticky Header (القائمة الخاصة بالموبايل والهيدر الذكي)
   -------------------------------------------------------------------------- */
function initHeaderAndNav() {
  const header = document.getElementById("header");
  const mainNav = document.getElementById("main-nav");
  const burgerBtn = document.getElementById("burger-btn");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!burgerBtn || !mainNav) return;

  // Toggle mobile menu on burger click
  burgerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = mainNav.classList.toggle("menu-open");
    burgerBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (mainNav.classList.contains("menu-open") && !mainNav.contains(e.target)) {
      closeMenu();
    }
  });

  // Close menu on pressing 'Escape' key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mainNav.classList.contains("menu-open")) {
      closeMenu();
    }
  });

  // Close menu when clicking any nav link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  function closeMenu() {
    mainNav.classList.remove("menu-open");
    burgerBtn.setAttribute("aria-expanded", "false");
  }

  // Sticky Header Effect on Scroll (Using Passive Event Listener)
  let lastScrollY = window.scrollY;
  const updateHeaderScroll = () => {
    console.log(lastScrollY)
    if (window.scrollY > 40) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  };

  window.addEventListener("scroll", updateHeaderScroll , { passive: true });
  updateHeaderScroll();
}

/* --------------------------------------------------------------------------
   2. Landing Background Carousel (سلايدر الخلفية التفاعلي)
   -------------------------------------------------------------------------- */
function initLandingSlider() {
  const landingSection = document.getElementById("landing");
  const landingTitle = document.getElementById("landing-title");
  const landingDesc = document.getElementById("landing-desc");
  const introText = document.querySelector(".landing .intro-text");
  const prevBtn = document.getElementById("prev-slide");
  const nextBtn = document.getElementById("next-slide");
  const bullets = document.querySelectorAll("#slider-bullets .bullet");

  if (!landingSection || !landingTitle || !landingDesc) return;

  // Slides Data
  const slides = [
    {
      image: "imgs/landing.jpg",
      badge: "Creative Agency",
      title: "Hello There",
      desc: "We are Leon - Super Creative & Minimal Agency Web Template"
    },
    {
      image: "imgs/about.jpg",
      badge: "Digital Excellence",
      title: "We Create Impact",
      desc: "Transforming ambitious ideas into seamless, memorable digital realities"
    },
    {
      image: "imgs/services.jpg",
      badge: "Modern Solutions",
      title: "Built to Scale",
      desc: "Disciplined design architecture paired with elite engineering power"
    }
  ];

  let currentIndex = 0;
  let slideTimer = null;
  const slideIntervalDuration = 6000; // 6 seconds

  function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    const currentSlide = slides[currentIndex];

    // Smooth fade transition for text
    if (introText) {
      introText.classList.add("anim-fade-out");
      introText.classList.remove("anim-fade-in");
    }

    setTimeout(() => {
      // Update background image
      landingSection.style.backgroundImage = `url("${currentSlide.image}")`;

      // Update text
      landingTitle.textContent = currentSlide.title;
      landingDesc.textContent = currentSlide.desc;

      const badge = introText.querySelector(".badge");
      if (badge) badge.textContent = currentSlide.badge;

      if (introText) {
        introText.classList.remove("anim-fade-out");
        introText.classList.add("anim-fade-in");
      }
    }, 250);

    // Update active bullet
    bullets.forEach((bullet, idx) => {
      bullet.classList.toggle("is-active", idx === currentIndex);
    });
  }

  function startSlideTimer() {
    stopSlideTimer();
    slideTimer = setInterval(() => {
      showSlide(currentIndex + 1);
    }, slideIntervalDuration);
  }

  function stopSlideTimer() {
    if (slideTimer) {
      clearInterval(slideTimer);
      slideTimer = null;
    }
  }

  // Next & Previous Handlers
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      showSlide(currentIndex + 1);
      startSlideTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      showSlide(currentIndex - 1);
      startSlideTimer();
    });
  }

  // Bullets Click Handler
  bullets.forEach((bullet) => {
    bullet.addEventListener("click", (e) => {
      const targetIndex = parseInt(e.target.dataset.index, 10);
      if (!isNaN(targetIndex)) {
        showSlide(targetIndex);
        startSlideTimer();
      }
    });
  });

  // Pause on hover
  landingSection.addEventListener("mouseenter", stopSlideTimer);
  landingSection.addEventListener("mouseleave", startSlideTimer);

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  landingSection.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  landingSection.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
      showSlide(currentIndex + 1);
      startSlideTimer();
    } else if (touchEndX > touchStartX + threshold) {
      showSlide(currentIndex - 1);
      startSlideTimer();
    }
  }

  // Initialize first slide and start auto-rotation
  showSlide(0);
  startSlideTimer();
}

/* --------------------------------------------------------------------------
   3. Portfolio Filtering (تصفية معرض الأعمال بأنيميشن ناعم)
   -------------------------------------------------------------------------- */
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll(".portfolio-filters .filter-button");
  const cards = document.querySelectorAll(".portfolio-content .card");

  if (!filterButtons.length || !cards.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedFilter = btn.dataset.filter;

      // Update active button state
      filterButtons.forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      // Filter cards with smooth fade & scale transitions
      cards.forEach((card) => {
        const category = card.dataset.category;
        const matches = selectedFilter === "all" || category === selectedFilter;

        if (matches) {
          card.classList.remove("is-filter-hidden");
          // Staggered fade in
          requestAnimationFrame(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0) scale(1)";
          });
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          card.classList.add("is-filter-hidden");
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   4. Portfolio Lightbox Modal (نافذة تكبير ومعاينة المشاريع)
   -------------------------------------------------------------------------- */
function initPortfolioLightbox() {
  const modal = document.getElementById("portfolio-lightbox");
  const lightboxImg = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const closeBtn = document.getElementById("lightbox-close-btn");
  const backdrop = modal ? modal.querySelector(".lightbox-backdrop") : null;
  const cards = document.querySelectorAll(".portfolio-content .card");

  if (!modal || !lightboxImg || !lightboxCaption) return;

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const imgSrc = card.dataset.img || card.querySelector("img").getAttribute("src");
      const title = card.dataset.title || card.querySelector("h3").textContent;

      lightboxImg.src = imgSrc;
      lightboxImg.alt = title;
      lightboxCaption.textContent = title;

      openModal();
    });
  });

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (backdrop) backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   5. Scroll Reveal Animations (أنيميشن التمرير باستخدام IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  if (!revealElements.length) return;

  // Check if IntersectionObserver is supported
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;

        if (delay > 0) {
          setTimeout(() => {
            el.classList.add("is-visible");
          }, delay);
        } else {
          el.classList.add("is-visible");
        }

        // Unobserve to free memory and keep 60fps performance
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => revealObserver.observe(el));
}

/* --------------------------------------------------------------------------
   6. Stats & Skill Progress Counters (أرقام الإحصائيات وأشرطة المهارات)
   -------------------------------------------------------------------------- */
function initStatsAndSkillsCounters() {
  const statNumbers = document.querySelectorAll(".stat-box .number");
  const statsSection = document.getElementById("stats");
  const skillsProgress = document.querySelector(".skills-progress");

  // Animate Number Counters with easeOutQuad
  function animateCounter(el, target, duration = 2000) {
    let startTimestamp = null;
    const startValue = 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuad equation
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      const currentValue = Math.floor(easeProgress * (target - startValue) + startValue);

      el.textContent = currentValue.toLocaleString() + (target >= 1000 ? "+" : "");

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString() + (target >= 1000 ? "+" : "");
      }
    };

    window.requestAnimationFrame(step);
  }

  // Observe Stats Section
  if (statsSection && statNumbers.length) {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            statNumbers.forEach((numEl) => {
              const goal = parseInt(numEl.dataset.goal, 10);
              if (!isNaN(goal)) {
                animateCounter(numEl, goal);
              }
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    statsObserver.observe(statsSection);
  }

  // Animate Skill Progress Bars
  if (skillsProgress) {
    const skillsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll(".progress-bar");
            const percentLabels = entry.target.querySelectorAll(".skill-percent");

            progressBars.forEach((bar) => {
              const targetWidth = bar.dataset.width;
              bar.style.width = targetWidth;
            });

            percentLabels.forEach((label) => {
              const targetPercent = parseInt(label.dataset.target, 10);
              if (!isNaN(targetPercent)) {
                let current = 0;
                const interval = setInterval(() => {
                  current += 1;
                  label.textContent = `${current}%`;
                  if (current >= targetPercent) clearInterval(interval);
                }, 15);
              }
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    skillsObserver.observe(skillsProgress);
  }
}

/* --------------------------------------------------------------------------
   7. Smooth Scrolling & ScrollSpy (التمرير السلس وتحديد الرابط النشط)
   -------------------------------------------------------------------------- */
function initSmoothScrollAndScrollSpy() {
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll("section[id]");

  // Smooth scroll with header height compensation
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId === "#") return;

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // ScrollSpy via IntersectionObserver
  if (sections.length && "IntersectionObserver" in window) {
    const spyOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0
    };

    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (href === `#${currentId}`) {
              link.classList.add("is-active");
            } else {
              link.classList.remove("is-active");
            }
          });
        }
      });
    }, spyOptions);

    sections.forEach((sec) => spyObserver.observe(sec));
  }
}

/* --------------------------------------------------------------------------
   8. Back to Top Button (زر العودة للأعلى)
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById("back-to-top");
  if (!backToTopBtn) return;

  const toggleBackToTop = () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add("is-visible");
    } else {
      backToTopBtn.classList.remove("is-visible");
    }
  };

  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  toggleBackToTop();

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}
