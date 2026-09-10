const phrases = [
  "On demand",
  "Fixed fee",
  "Clarity by design",
  "Effortless to engage"
];

const phrase = document.querySelector("#rotating-phrase");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let phraseIndex = 0;

if (phrase && !reducedMotion) {
  window.setInterval(() => {
    phrase.className = "out";
    window.setTimeout(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      phrase.textContent = phrases[phraseIndex];
      phrase.className = "in";
    }, 300);
  }, 2600);
}

const menuButton = document.querySelector(".menu");
const nav = document.querySelector(".site-header nav");

menuButton?.addEventListener("click", () => {
  const open = document.body.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.textContent = open ? "Close" : "Menu";
  nav?.classList.toggle("open", open);
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    if (menuButton) menuButton.textContent = "Menu";
  });
});

const mainNavLinks = Array.from(document.querySelectorAll('.site-header nav a[href^="#"]'));
const mainNavTargets = mainNavLinks
  .map((link) => {
    const target = document.querySelector(link.getAttribute("href"));
    return target ? { link, target } : null;
  })
  .filter(Boolean);
const contactBoundary = document.querySelector("#contact");
let navScrollFrame = 0;

function updateActiveNavigation() {
  navScrollFrame = 0;
  const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
  const activationLine = window.scrollY + headerHeight + Math.min(window.innerHeight * .18, 130);
  const orderedTargets = mainNavTargets
    .map((item) => ({ ...item, top: item.target.getBoundingClientRect().top + window.scrollY }))
    .sort((a, b) => a.top - b.top);
  const contactTop = contactBoundary
    ? contactBoundary.getBoundingClientRect().top + window.scrollY
    : Number.POSITIVE_INFINITY;
  let activeLink = null;

  orderedTargets.forEach((item) => {
    if (activationLine >= item.top && activationLine < contactTop) activeLink = item.link;
  });

  mainNavLinks.forEach((link) => {
    const active = link === activeLink;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

function requestNavigationUpdate() {
  if (navScrollFrame) return;
  navScrollFrame = window.requestAnimationFrame(updateActiveNavigation);
}

if (mainNavTargets.length) {
  updateActiveNavigation();
  window.addEventListener("scroll", requestNavigationUpdate, { passive: true });
  window.addEventListener("resize", requestNavigationUpdate);
}

const solutionTriggers = Array.from(document.querySelectorAll(".solution-trigger"));

function setSolutionState(trigger, expanded) {
  const panel = document.getElementById(trigger.getAttribute("aria-controls"));
  trigger.setAttribute("aria-expanded", String(expanded));
  panel?.setAttribute("aria-hidden", String(!expanded));
}

solutionTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const willExpand = trigger.getAttribute("aria-expanded") !== "true";
    solutionTriggers.forEach((other) => setSolutionState(other, other === trigger && willExpand));
  });
});

const journeyTabs = Array.from(document.querySelectorAll('.audience-tabs [role="tab"]'));
const journeyPanels = Array.from(document.querySelectorAll('.journey-panel[role="tabpanel"]'));
const journeyLists = Array.from(document.querySelectorAll(".journey-steps"));
let journeyObserver = null;

journeyLists.forEach((list) => list.classList.add("is-reveal-ready"));

function revealJourneySteps(list) {
  if (!list || list.classList.contains("is-revealed")) return;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    list.classList.add("is-revealed");
    return;
  }

  journeyObserver?.unobserve(list);
  window.requestAnimationFrame(() => journeyObserver?.observe(list));
}

if (!reducedMotion && "IntersectionObserver" in window) {
  journeyObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-revealed");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.18,
    rootMargin: "0px 0px -10%"
  });
}

journeyLists.forEach(revealJourneySteps);

function activateJourney(nextTab, moveFocus = false) {
  journeyTabs.forEach((tab) => {
    const selected = tab === nextTab;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  journeyPanels.forEach((panel) => {
    const selected = panel.id === nextTab.getAttribute("aria-controls");
    panel.hidden = !selected;
    if (selected) {
      panel.classList.remove("is-entering");
      if (!reducedMotion) void panel.offsetWidth;
      panel.classList.add("is-entering");
      revealJourneySteps(panel.querySelector(".journey-steps"));
    }
  });

  if (moveFocus) nextTab.focus();
}

journeyTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateJourney(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % journeyTabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + journeyTabs.length) % journeyTabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = journeyTabs.length - 1;
    else return;

    event.preventDefault();
    activateJourney(journeyTabs[nextIndex], true);
  });
});

const teamTabs = Array.from(document.querySelectorAll('.team-tabs [role="tab"]'));
const teamPanels = Array.from(document.querySelectorAll('.team-panel[role="tabpanel"]'));

function activateTeamTab(nextTab, moveFocus = false) {
  teamTabs.forEach((tab) => {
    const selected = tab === nextTab;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  teamPanels.forEach((panel) => {
    const selected = panel.id === nextTab.getAttribute("aria-controls");
    panel.hidden = !selected;
    panel.classList.toggle("is-active", selected);
  });

  if (moveFocus) nextTab.focus();
}

teamTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTeamTab(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % teamTabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + teamTabs.length) % teamTabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = teamTabs.length - 1;
    else return;

    event.preventDefault();
    activateTeamTab(teamTabs[nextIndex], true);
  });
});

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  const submitButton = contactForm.querySelector(".contact-submit");
  const statusMessage = contactForm.querySelector(".contact-form-status");
  const subjectField = contactForm.querySelector('input[name="_subject"]');

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const name = contactForm.elements.name.value.trim();
    const today = new Date();
    const dateStamp = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");

    subjectField.value = `${name} + ${dateStamp} + inquiry`;
    submitButton.disabled = true;
    submitButton.setAttribute("aria-busy", "true");
    statusMessage.className = "contact-form-status is-sending";
    statusMessage.textContent = "Sending your inquiry…";

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false || result.success === "false") {
        throw new Error(result.message || "Unable to send inquiry");
      }

      contactForm.reset();
      statusMessage.className = "contact-form-status is-success";
      statusMessage.textContent = "Thank you. Your inquiry has been sent.";
    } catch (error) {
      statusMessage.className = "contact-form-status is-error";
      statusMessage.textContent = "We couldn’t send your inquiry. Please try again in a moment.";
    } finally {
      submitButton.disabled = false;
      submitButton.removeAttribute("aria-busy");
    }
  });
}
