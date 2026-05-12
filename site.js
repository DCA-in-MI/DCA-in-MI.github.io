(function () {
  const routes = ["home", "datasets", "dates", "cfp", "papers", "program", "awards", "organizers", "faqs", "news"];
  const pages = Array.from(document.querySelectorAll(".page"));
  const navButtons = Array.from(document.querySelectorAll("[data-route]"));
  const routeLinks = Array.from(document.querySelectorAll("[data-route-link]"));
  const navMenu = document.getElementById("nav-menu");
  const navToggle = document.querySelector(".nav-toggle");

  function normalizeRoute(route) {
    return routes.includes(route) ? route : "home";
  }

  function setRoute(route, shouldScroll) {
    const next = normalizeRoute(route);
    pages.forEach((page) => page.classList.toggle("is-active", page.dataset.page === next));
    navButtons.forEach((button) => {
      const active = button.dataset.route === next;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    document.body.dataset.route = next;
    if (navMenu) navMenu.classList.remove("is-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.querySelector("span").textContent = "Menu";
    }
    if (location.hash.replace("#", "") !== next) {
      history.pushState(null, "", "#" + next);
    }
    if (shouldScroll) window.scrollTo({ top: 0, behavior: "auto" });
  }

  navButtons.forEach((button) => {
    button.addEventListener("click", () => setRoute(button.dataset.route, true));
  });
  routeLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setRoute(link.dataset.routeLink, true);
    });
  });
  window.addEventListener("hashchange", () => {
    const hash = location.hash.replace("#", "");
    if (routes.includes(hash)) setRoute(hash, true);
  });

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = !navMenu.classList.contains("is-open");
      navMenu.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.querySelector("span").textContent = open ? "Close" : "Menu";
    });
  }

  function initTopicMatrix() {
    const panel = document.querySelector(".matrix-panel");
    const cells = Array.from(document.querySelectorAll("[data-pair]"));
    if (!panel || !cells.length) return;
    const defaultHtml = panel.innerHTML;

    function setPanel(cell) {
      cells.forEach((other) => other.classList.toggle("is-active", other === cell));
      const [left, right, text] = cell.dataset.pair.split("|");
      panel.innerHTML = [
        '<span class="mono muted">Crosswalk</span>',
        `<h3>${left} <span class="ochre">x</span> ${right}</h3>`,
        `<p>${text}</p>`
      ].join("");
    }

    function resetPanel() {
      cells.forEach((cell) => cell.classList.remove("is-active"));
      panel.innerHTML = defaultHtml;
    }

    cells.forEach((cell) => {
      cell.addEventListener("mouseenter", () => setPanel(cell));
      cell.addEventListener("focus", () => setPanel(cell));
      cell.addEventListener("mouseleave", resetPanel);
      cell.addEventListener("blur", resetPanel);
    });
  }

  function initDeadlineMeter() {
    const fill = document.getElementById("meter-fill");
    const nextLabel = document.getElementById("next-deadline");
    if (!fill || !nextLabel) return;
    const milestones = [
      { date: new Date("2026-05-15T00:00:00-08:00"), label: "Call for papers posted" },
      { date: new Date("2026-07-01T23:59:00-12:00"), label: "Submission deadline", hard: true },
      { date: new Date("2026-08-01T00:00:00-08:00"), label: "Acceptance notifications" },
      { date: new Date("2026-08-15T00:00:00-08:00"), label: "Camera-ready due" },
      { date: new Date("2026-10-15T00:00:00-08:00"), label: "Workshop day" }
    ];
    const start = milestones[0].date.getTime();
    const end = milestones[milestones.length - 1].date.getTime();

    function render() {
      const now = Date.now();
      const pct = Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));
      fill.style.width = pct + "%";
      const next = milestones.find((item) => item.date.getTime() > now);
      if (!next) {
        nextLabel.textContent = "Workshop concluded | Vol. II archived";
        return;
      }
      const days = Math.ceil((next.date.getTime() - now) / 86400000);
      nextLabel.textContent = `Next: ${next.label}${next.hard ? " | hard" : ""} | in ${days} day${days === 1 ? "" : "s"}`;
    }

    render();
    window.setInterval(render, 60000);
  }

  function initPaperFilters() {
    const buttons = Array.from(document.querySelectorAll("[data-filter]"));
    const papers = Array.from(document.querySelectorAll(".paper-list [data-track]"));
    if (!buttons.length || !papers.length) return;
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        buttons.forEach((other) => other.classList.toggle("is-active", other === button));
        papers.forEach((paper) => {
          paper.classList.toggle("is-hidden", filter !== "all" && paper.dataset.track !== filter);
        });
      });
    });
  }

  function initFaqs() {
    document.querySelectorAll(".faq button").forEach((button) => {
      button.addEventListener("click", () => {
        const faq = button.closest(".faq");
        const open = !faq.classList.contains("is-open");
        faq.classList.toggle("is-open", open);
        button.setAttribute("aria-expanded", String(open));
      });
    });
  }

  setRoute(location.hash.replace("#", ""), false);
  initTopicMatrix();
  initDeadlineMeter();
  initPaperFilters();
  initFaqs();
})();
