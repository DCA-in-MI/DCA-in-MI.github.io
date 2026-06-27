(function () {
  const routes = ["home", "datasets", "dates", "cfp", "organizers"];
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
    setRoute(hash, true);
  });

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = !navMenu.classList.contains("is-open");
      navMenu.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.querySelector("span").textContent = open ? "Close" : "Menu";
    });
  }

  function initDeadlineMeter() {
    const fill = document.getElementById("meter-fill");
    const nextLabel = document.getElementById("next-deadline");
    if (!fill || !nextLabel) return;
    const milestones = [
      { date: new Date("2026-05-15T00:00:00-08:00"), label: "Call for papers posted" },
      { date: new Date("2026-07-07T23:59:00-12:00"), label: "Submission deadline", hard: true },
      { date: new Date("2026-08-01T00:00:00-08:00"), label: "Acceptance notifications" },
      { date: new Date("2026-08-15T00:00:00-08:00"), label: "Camera-ready due" },
      { date: new Date("2026-09-08T00:00:00-08:00"), label: "Workshop begins" }
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

  function initCfpCountdown() {
    const countdown = document.getElementById("cfp-countdown");
    if (!countdown) return;
    const deadline = new Date("2026-07-01T23:59:00-12:00");

    function render() {
      const remaining = deadline.getTime() - Date.now();
      if (remaining <= 0) {
        countdown.textContent = "Submission closed";
        return;
      }
      const totalSeconds = Math.floor(remaining / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      countdown.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    render();
    window.setInterval(render, 1000);
  }

  setRoute(location.hash.replace("#", ""), false);
  initDeadlineMeter();
  initCfpCountdown();
})();
