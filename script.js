const visionaryItems = document.querySelectorAll(".visionary-item");

visionaryItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = item.classList.contains("is-open");

    visionaryItems.forEach((el) => el.classList.remove("is-open"));
    if (!isOpen) item.classList.add("is-open");
  });
});

document.addEventListener("click", () => {
  visionaryItems.forEach((item) => item.classList.remove("is-open"));
});

function scrollToSection(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const header = document.querySelector(".site-header");
  const headerHeight = header ? header.offsetHeight : 0;
  const targetTop =
    target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

  window.scrollTo({ top: targetTop, behavior: "smooth" });
}

document
  .querySelectorAll(".header-nav a[href^='#'], a[href^='#']")
  .forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      document.querySelector(".header-nav")?.classList.remove("open");

      scrollToSection(id);
    });
  });

const revealSections = document.querySelectorAll(".reveal");

if (!("IntersectionObserver" in window)) {
  revealSections.forEach((s) => s.classList.add("in-view"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0,
      rootMargin: "0px 0px -20px 0px",
    },
  );

  revealSections.forEach((section) => revealObserver.observe(section));

  setTimeout(() => {
    revealSections.forEach((s) => s.classList.add("in-view"));
  }, 800);
}

const cursorOrb = document.querySelector(".cursor-orb");

const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

if (cursorOrb && !isTouchDevice) {
  let targetX = -500;
  let targetY = -500;
  let rafId = null;
  let isInsideIframe = false;

  function updateOrb() {
    cursorOrb.style.transform = `translate(calc(${targetX}px - 50%), calc(${targetY}px - 50%))`;
    rafId = null;
  }

  function scheduleUpdate() {
    if (rafId === null) {
      rafId = requestAnimationFrame(updateOrb);
    }
  }

  cursorOrb.style.left = "0";
  cursorOrb.style.top = "0";

  window.addEventListener("mousemove", (e) => {
    if (isInsideIframe) return;
    targetX = e.clientX;
    targetY = e.clientY;
    scheduleUpdate();
  });

  document.addEventListener("mouseleave", () => {
    cursorOrb.style.transition = "opacity 0.35s ease";
    cursorOrb.style.opacity = "0";
  });

  document.addEventListener("mouseenter", () => {
    if (!isInsideIframe) {
      cursorOrb.style.transition = "opacity 0.35s ease";
      cursorOrb.style.opacity = "0.85";
    }
  });

  document.querySelectorAll(".video-wrap").forEach((wrap) => {
    wrap.addEventListener("mouseenter", () => {
      isInsideIframe = true;
      cursorOrb.style.transition = "opacity 0.35s ease";
      cursorOrb.style.opacity = "0";
    });

    wrap.addEventListener("mouseleave", (e) => {
      isInsideIframe = false;
      targetX = e.clientX;
      targetY = e.clientY;
      updateOrb();
      cursorOrb.style.opacity = "0.85";
      setTimeout(() => {
        cursorOrb.style.transition = "";
      }, 400);
    });
  });
}
