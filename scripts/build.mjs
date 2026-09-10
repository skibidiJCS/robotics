import { mkdir, writeFile, cp, rm } from "node:fs/promises";
import { content, members, routes } from "../src/content.mjs";
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const url = (lang, route = "") => `/${lang}/${route ? route + "/" : ""}`;
const paths = {
  camera:
    '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="m7 6 2-3h6l2 3"/><circle cx="12" cy="13" r="4"/>',
  person: '<circle cx="12" cy="8" r="4"/><path d="M4 22v-2a8 8 0 0 1 16 0v2"/>',
  play: '<path d="m8 4 12 8-12 8Z"/>',
  pencil: '<path d="m4 16 12-12 4 4-12 12-5 1Zm9-9 4 4M4 16l4 4"/>',
};
const icon = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.pencil}</svg>`;
function render(lang, route) {
  const t = content[lang],
    other = lang === "fr" ? "en" : "fr",
    current = routes.indexOf(route);
  const ph = (text, type = "camera") =>
    `<div class="photo-placeholder">${icon(type)}<span>${escape(text)}</span></div>`;
  const heading = (title, note = "") =>
    `<div class="room-heading"><h1>${escape(title)}</h1>${note ? `<p>${escape(note)}</p>` : ""}</div>`;
  const tabs = (labels, panels) =>
    `<div class="tabs" role="tablist" aria-label="${escape(t.labels[current])}">${labels.map((s, i) => `<button type="button" role="tab" id="tab-${i}" aria-selected="${i === 0}" aria-controls="panel-${i}" tabindex="${i === 0 ? "0" : "-1"}">${escape(s)}</button>`).join("")}</div>${panels.map((p, i) => `<section class="tab-panel" id="panel-${i}" role="tabpanel" aria-labelledby="tab-${i}" tabindex="0"${i ? " hidden" : ""}>${p}</section>`).join("")}`;
  const pager = (count) =>
    `<div class="pager"><button type="button" data-prev disabled aria-label="${t.previous}">← <span>${t.previous}</span></button><span class="page-count" aria-live="polite" data-page-word="${t.page}" data-of="${t.of}">${t.page} 1 ${t.of} ${count}</span><button type="button" data-next aria-label="${t.next}"><span>${t.next}</span> →</button></div>`;
  let body = "";
  if (route === "" || route === "village") {
    const destinations = [
      "about",
      "game",
      "team",
      "robot",
      "photos",
      "journal",
    ];
    body = `<main id="main" class="world ${route === "" ? "entrance" : "village"}"><div class="village-canvas"><img class="map-art" src="/assets/village.jpg" alt="${t.artAlt}" width="1536" height="1024" fetchpriority="high">${route === "" ? `<div class="invitation"><img class="centered-school-logo" src="/assets/sainte-anne-logo.svg" alt="Sainte-Anne" width="176" height="176"><span class="whisper">${t.welcome}</span><h1>${t.found.replace("\n", "<br>")}</h1><p>${t.intro}</p><a class="knock-button" href="${url(lang, "village")}" data-knock data-opening="${t.opening}">${t.enter} <span aria-hidden="true">↪</span></a></div>` : `<div class="map-title"><img class="centered-school-logo" src="/assets/sainte-anne-logo.svg" alt="Sainte-Anne" width="176" height="176"><h1>${t.title}</h1></div><nav class="houses" aria-label="${t.mapTitle}">${destinations.map((r, i) => `<a class="house house-${i}" href="${url(lang, r)}"><span class="house-label">${t.labels[routes.indexOf(r)]}</span></a>`).join("")}</nav><a class="cinema-sign" href="${url(lang, "media")}">${icon("play")}${t.videoShortcut}</a>`}</div></main>`;
  } else {
    let inside = "";
    if (route === "about")
      inside =
        heading(t.labels[current]) +
        `<div class="about-spread"><article class="school-note"><span class="handwritten">${t.schoolHeading}</span><h2>${t.schoolText}</h2><p>${t.schoolNote}</p><span class="blue-pencil" aria-hidden="true">22</span></article><div class="about-notes"><article><h2>${t.aboutHeading}</h2><p>${t.aboutText}</p></article><article><h2>${t.crcHeading}</h2><p>${t.crcText}</p><a class="ink-link" href="https://robo-crc.ca/${lang}">${t.crcLink}</a></article></div></div>`;
    if (route === "team") {
      const count = Math.ceil(members.length / 4);
      inside =
        heading(t.labels[current]) +
        `<div class="album" data-paged>${Array.from(
          { length: count },
          (_, page) =>
            `<section class="album-spread" data-spread="${page}"${page ? " hidden" : ""} aria-label="${t.page} ${page + 1}">${members
              .slice(page * 4, page * 4 + 4)
              .map(
                (m) =>
                  `<article class="member"><div class="polaroid">${m.photo ? `<img src="${escape(m.photo)}" alt="${escape(m.name || t.member)}" width="400" height="400">` : ph(t.photo, "person")}<p>${t.member} ${String(m.id).padStart(2, "0")}</p></div><h2>${escape(m.name || t.name)}</h2><p class="contribution">${escape(m.contribution[lang] || t.contribution)}</p></article>`,
              )
              .join("")}</section>`,
        ).join(
          "",
        )}${pager(count)}</div><p class="small-note">${t.teamNote}</p>`;
    }
    if (route === "game")
      inside =
        heading(t.labels[current]) +
        `<div class="game-empty"><div class="waiting-note"><span class="paperclip" aria-hidden="true">⌇</span><span class="handwritten">${t.pending}</span><h2>${t.gameTitle.replace("\n", "<br>")}</h2><p>${t.gameText}</p></div><ol class="rule-list">${t.gameList.map((s) => `<li><span>${s}</span><span class="pencil-line" aria-hidden="true"></span></li>`).join("")}</ol></div>`;
    if (route === "robot")
      inside =
        heading(t.labels[current]) +
        tabs(
          t.robotTabs,
          t.robotTabs.map(
            (s, i) =>
              `<div class="robot-spread">${ph(t.robotPhoto, i === 1 ? "pencil" : "camera")}<div class="technical-note"><p class="handwritten">${s}</p><h2>${t.pending}</h2><p>${t.robotNotes[i]}</p><div class="blank-lines" aria-hidden="true"></div></div></div>`,
          ),
        );
    if (route === "photos")
      inside =
        heading(t.labels[current]) +
        `<div class="photo-album" data-paged>${t.photoTabs.map((s, i) => `<section data-spread="${i}"${i ? " hidden" : ""} class="photo-slide"><figure class="large-polaroid">${ph(t.photo)}<figcaption>${s}</figcaption></figure></section>`).join("")}${pager(3)}</div><p class="small-note">${t.photoNote}</p>`;
    if (route === "journal")
      inside =
        heading(t.labels[current]) +
        tabs(
          t.journalTabs,
          t.journalTabs.map(
            (s) =>
              `<div class="notebook-page"><div class="notebook-meta"><h2>${s}</h2><span>${t.journalDate}</span></div><p class="handwritten empty-journal">${t.journalNote}</p><div class="journal-prompts">${t.journalLabels.map((x) => `<div><h3>${x}</h3><div class="writing-line" aria-hidden="true"></div></div>`).join("")}</div></div>`,
          ),
        );
    if (route === "media")
      inside =
        heading(t.labels[current]) +
        tabs(
          t.mediaTabs,
          t.mediaTabs.map(
            (s, i) =>
              `<div class="cinema"><div class="film-frame"><span class="film-corner" aria-hidden="true">▷</span>${ph(t.mediaPlaceholder, "play")}</div><p class="handwritten">${t.mediaNotes[i]}</p></div>`,
          ),
        );
    if (route === "credits")
      inside =
        heading(t.labels[current]) +
        `<div class="credits-note"><h2>${lang === "fr" ? "Les Schtroumpfs" : "The Smurfs"}</h2><p>${t.creditsText}</p><p>${t.sourceCredit}</p><a class="ink-link" href="https://robo-crc.ca/${lang}">${t.crcLink}</a></div>`;
    body = `<main id="main" class="room-world"><section class="room room-${route}" aria-label="${escape(t.labels[current])}"><a class="room-back" href="${url(lang, "village")}">← ${t.back}</a>${inside}</section></main>`;
  }
  return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f3efd9"><title>${escape(t.labels[current])} — ${escape(t.title)}</title><meta name="description" content="${escape(t.entryNote)}"><link rel="alternate" hreflang="${other}" href="${url(other, route)}"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/styles.css"><script src="/app.js" defer></script></head><body class="${route === "" || route === "village" ? "map-page" : "room-page"}"><a class="skip" href="#main">${t.skip}</a><a class="locale-button floating-locale" href="${url(other, route)}" lang="${other}" hreflang="${other}" aria-label="${t.localeLabel}">${t.locale}</a>${body}<footer class="site-footer"><a href="${url(lang, "credits")}">${t.creditShortcut}</a></footer></body></html>`.replace(
    /&(?!amp;|lt;|gt;|quot;|#39;)/g,
    "&amp;",
  );
}
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });
for (const lang of ["fr", "en"])
  for (const route of routes) {
    const dir = `dist/${lang}/${route}`;
    await mkdir(dir, { recursive: true });
    await writeFile(`${dir}/index.html`, render(lang, route));
  }
await writeFile("dist/index.html", render("fr", ""));
// Keep previously shared URLs working.
for (const lang of ["fr", "en"]) {
  const dir = `dist/${lang}/competition`;
  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}/index.html`, render(lang, "game"));
}
console.log("Built 23 pages.");
