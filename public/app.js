const dialog = document.querySelector("#map-dialog");
const openMap = document.querySelector("[data-open-map]");
openMap.addEventListener("click", () => dialog.showModal());
document
  .querySelector("[data-close-map]")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      dialog.close();
  }
});
dialog.addEventListener("close", () => openMap.focus());
const knock = document.querySelector("[data-knock]");
knock?.addEventListener("click", (event) => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (knock.dataset.busy) return;
  knock.dataset.busy = "true";
  knock.textContent = knock.dataset.opening;
  document.querySelector(".invitation").classList.add("door-opening");
  setTimeout(
    () => location.assign(knock.href),
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
