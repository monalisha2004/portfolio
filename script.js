
const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".main-nav");
const navigationLinks = [...document.querySelectorAll(".main-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const projectCards = [...document.querySelectorAll(".project-card")];
const projectCount = document.querySelector(".project-count");
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("portfolio-theme", theme);
  const isDark = theme === "dark";
  themeButton.setAttribute(
    "aria-label",
    isDark ? "Switch to light theme" : "Switch to dark theme",
  );
  themeButton.querySelector("span").textContent = isDark ? "☀" : "☾";
}

const savedTheme = localStorage.getItem("portfolio-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";
setTheme(savedTheme || preferredTheme);

themeButton.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("is-open");
  menuButton.classList.toggle("is-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("is-open");
    menuButton.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleSection) return;

    navigationLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${visibleSection.target.id}`,
      );
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.2, 0.5] },
);

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 },
);

document
  .querySelectorAll("[data-reveal]")
  .forEach((element) => revealObserver.observe(element));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    projectCards.forEach((card) => {
      const shouldShow =
        selectedFilter === "All" || card.dataset.category === selectedFilter;
      card.classList.toggle("is-hidden", !shouldShow);
      if (shouldShow) visibleCount += 1;
    });

    projectCount.textContent = `Showing ${visibleCount} of ${projectCards.length} projects`;
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "Thanks! Your message is ready to send.";
  contactForm.reset();

  window.setTimeout(() => {
    formStatus.textContent = "";
  }, 5000);
});