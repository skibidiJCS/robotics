import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { parseHTML } from "linkedom";
import { content, members, routes } from "../src/content.mjs";
const root = resolve("dist");
const files = (await readdir(root, { recursive: true })).filter((p) =>
  p.endsWith(".html"),
);
assert.equal(files.length, 23);
assert.equal(members.length, 22);
assert.deepEqual(
  Object.keys(content.fr).sort(),
  Object.keys(content.en).sort(),
);
let checked = 0;
for (const file of files) {
  const html = await readFile(resolve(root, file), "utf8");
  const { document } = parseHTML(html);
  const lang = file.startsWith("en/") ? "en" : "fr";
  assert.equal(document.documentElement.lang, lang);
  assert.equal(document.querySelectorAll("h1").length, 1);
  const ids = [...document.querySelectorAll("[id]")].map((e) => e.id);
  assert.equal(ids.length, new Set(ids).size, `Duplicate ID: ${file}`);
  for (const element of document.querySelectorAll("[src], [href]")) {
    const path = element.getAttribute("src") || element.getAttribute("href");
    if (path.startsWith("#")) {
      assert.ok(ids.includes(path.slice(1)));
      continue;
    }
    if (!path.startsWith("/")) continue;
    let target = resolve(root, "." + path);
    if (path.endsWith("/")) target = resolve(target, "index.html");
    assert.ok((await stat(target)).isFile(), `${file}: ${path}`);
    checked++;
  }
  for (const control of document.querySelectorAll("[aria-controls]"))
    assert.ok(ids.includes(control.getAttribute("aria-controls")));
  const wrong =
    lang === "fr"
      ? ["Knock, knock!", "Add name", "Coming soon", "Choose a house."]
      : ["Toc, toc !", "Nom à ajouter", "À venir", "Choisissez une maison."];
  for (const word of wrong)
    assert.ok(!html.includes(word), `Mixed language: ${file}`);
  if (file.includes("/village/"))
    assert.equal(document.querySelectorAll(".house").length, 6);
  if (file.includes("/team/"))
    assert.equal(document.querySelectorAll(".member").length, 22);
  const route = file.split("/").slice(1, -1).join("/");
  if (routes.includes(route) && file !== "index.html")
    assert.equal(
      document.querySelector(".locale-button").getAttribute("href"),
      `/${lang === "fr" ? "en" : "fr"}/${route ? route + "/" : ""}`,
    );
}
const script = await readFile("public/app.js", "utf8");
async function load(lang, route) {
  const { window, document } = parseHTML(
    await readFile(`dist/${lang}/${route}/index.html`, "utf8"),
  );
  let destination;
  runInNewContext(script, {
    document,
    location: { assign: (path) => (destination = path) },
    setTimeout: (fn) => fn(),
    matchMedia: () => ({ matches: true }),
  });
  return { window, document, destination: () => destination };
}
for (const lang of ["fr", "en"]) {
  const { document } = await load(lang, "team");
  const visited = new Set();
  function collect() {
    for (const spread of document.querySelectorAll("[data-spread]"))
      if (!spread.hidden)
        for (const member of spread.querySelectorAll(".polaroid p"))
          visited.add(member.textContent);
  }
  collect();
  for (let i = 0; i < 5; i++) {
    document.querySelector("[data-next]").click();
    collect();
  }
  assert.equal(visited.size, 22, "All roster members must be reachable");
  assert.ok(document.querySelector("[data-next]").disabled);
  for (let i = 0; i < 5; i++) document.querySelector("[data-prev]").click();
  assert.ok(document.querySelector("[data-prev]").disabled);
  for (const route of ["robot", "journal", "media"]) {
    const { document, window } = await load(lang, route),
      tabs = [...document.querySelectorAll("[role=tab]")];
    for (const tab of tabs) {
      tab.click();
      assert.equal(tab.getAttribute("aria-selected"), "true");
      assert.equal(
        [...document.querySelectorAll("[role=tabpanel]")].filter(
          (p) => !p.hidden,
        ).length,
        1,
      );
      assert.ok(
        !document.getElementById(tab.getAttribute("aria-controls")).hidden,
      );
    }
    const event = new window.Event("keydown", { cancelable: true });
    event.key = "Home";
    tabs.at(-1).dispatchEvent(event);
    assert.equal(tabs[0].getAttribute("aria-selected"), "true");
  }
  const entry = await load(lang, "");
  entry.document.querySelector("[data-knock]").click();
  assert.equal(entry.destination(), `/${lang}/village/`);
}
console.log(
  `Passed: 23 pages, ${checked} local links/assets, 22 reachable members, entrance, album pagination, tabs, keyboard Home, and locale links.`,
);
