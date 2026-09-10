const pageCache = new Map();
let navigationVersion = 0;

async function navigate(href, { replace = false, pop = false } = {}) {
  if (typeof fetch === "undefined") {
    location.assign(href);
    return;
  }
  const target = new URL(href, location.href);
  const version = ++navigationVersion;
  try {
    let html = pageCache.get(target.href);
    if (!html) {
      const response = await fetch(target.href, {
        headers: { Accept: "text/html" },
      });
      if (!response.ok) throw new Error("Page unavailable");
      html = await response.text();
      pageCache.set(target.href, html);
    }
    if (version !== navigationVersion) return;
    const next = new DOMParser().parseFromString(html, "text/html");
    const nextMain = next.querySelector("main");
    if (!nextMain) throw new Error("Missing page content");
    const previousPath = location.pathname;
    if (!pop)
      history[replace ? "replaceState" : "pushState"]({}, "", target.href);
    const swap = () => {
      document.querySelector("main").replaceWith(nextMain);
      for (const selector of [".floating-locale", ".site-footer"]) {
        document
          .querySelector(selector)
          ?.replaceWith(next.querySelector(selector));
      }
      document.body.className = next.body.className;
      document.documentElement.lang = next.documentElement.lang;
      document.title = next.title;
      for (const selector of [
        'meta[name="description"]',
        'link[rel="alternate"]',
      ]) {
        document
          .querySelector(selector)
          ?.replaceWith(next.querySelector(selector));
      }
      initializePage();
      window.scrollTo(0, 0);
      const returnLink = [...document.querySelectorAll(".house")].find(
        (link) => new URL(link.href, location.href).pathname === previousPath,
      );
      const focusTarget = returnLink || document.querySelector("h1");
      if (focusTarget && !returnLink) {
        focusTarget.setAttribute("tabindex", "-1");
        focusTarget.focus({ preventScroll: true });
      }
    };
    if (document.startViewTransition) {
      await document.startViewTransition(swap).finished;
    } else {
      swap();
    }
  } catch {
    if (version === navigationVersion) location.assign(target.href);
  }
}

function initializePage() {
  const knock = document.querySelector("[data-knock]");
  knock?.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    if (knock.dataset.busy) return;
    knock.dataset.busy = "true";
    knock.textContent = knock.dataset.opening;
    document.querySelector(".invitation").classList.add("door-opening");
    setTimeout(
      () => navigate(knock.href),
      matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 450,
    );
  });
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function selectTab(tab) {
    tabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
      document.getElementById(item.getAttribute("aria-controls")).hidden =
        !active;
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      let target;
      if (event.key === "ArrowRight") target = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft")
        target = (index + tabs.length - 1) % tabs.length;
      if (event.key === "Home") target = 0;
      if (event.key === "End") target = tabs.length - 1;
      if (target !== undefined) {
        event.preventDefault();
        selectTab(tabs[target]);
        tabs[target].focus();
      }
    });
  });
  for (const album of document.querySelectorAll("[data-paged]")) {
    let page = 0;
    const spreads = [...album.querySelectorAll("[data-spread]")],
      prev = album.querySelector("[data-prev]"),
      next = album.querySelector("[data-next]"),
      counter = album.querySelector(".page-count");
    function turn(delta) {
      page = Math.max(0, Math.min(spreads.length - 1, page + delta));
      spreads.forEach((spread, index) => (spread.hidden = index !== page));
      prev.disabled = page === 0;
      next.disabled = page === spreads.length - 1;
      counter.textContent = `${counter.dataset.pageWord} ${page + 1} ${counter.dataset.of} ${spreads.length}`;
    }
    prev.addEventListener("click", () => turn(-1));
    next.addEventListener("click", () => turn(1));
  }

  const roomBackdrop = document.querySelector(".room-world");
  roomBackdrop?.addEventListener("click", (event) => {
    if (event.target !== roomBackdrop) return;
    const villageLink = roomBackdrop.querySelector(".room-back");
    if (villageLink) navigate(villageLink.href);
  });
}
initializePage();

if (typeof window !== "undefined") {
  pageCache.set(location.href, document.documentElement.outerHTML);
  document.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      (event.button !== undefined && event.button !== 0) ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const link = event.target.closest("a[href]");
    if (
      !link ||
      link.hasAttribute("download") ||
      (link.target && link.target !== "_self") ||
      link.hasAttribute("data-knock")
    )
      return;
    const href = link.getAttribute("href");
    if (href.startsWith("#")) return;
    const target = new URL(href, location.href);
    if (
      target.origin !== location.origin ||
      !/^\/(en|fr)\//.test(target.pathname)
    )
      return;
    event.preventDefault();
    navigate(target.href);
  });
  window.addEventListener("popstate", () =>
    navigate(location.href, { pop: true }),
  );
}
