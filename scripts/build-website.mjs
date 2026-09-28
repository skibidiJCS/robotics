import { mkdir, writeFile, cp, rm } from 'node:fs/promises';
import { content, routes, members } from '../src/content.mjs';
import { places, placeTitle, copy } from '../public/village/world-data.js';
import { escape, renderRoom } from '../public/village/rooms.js';

function render(lang, route) {
 const t = content[lang], c = copy[lang];
 const navigation = places.map((p, i) => `<a href="/${lang}/${p.id}/" data-route="${p.id}"><span class="nav-index">0${i + 1}</span>${escape(t.labels[routes.indexOf(p.id === 'play' ? 'game' : p.id)])}</a>`).join('');
 return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#283d31"><meta name="description" content="${escape(t.entryNote)}"><title>${escape(t.title)} · Sainte-Anne</title><link rel="icon" href="/assets/favicon.svg"><link rel="stylesheet" href="/village/world.css"><script type="importmap">{"imports":{"three":"/vendor/three.module.js","three/addons/utils/BufferGeometryUtils.js":"/vendor/BufferGeometryUtils.js"}}</script><script type="module" src="/village/world.js"></script></head>
<body><a class="skip" href="#phone-button">${escape(t.skip)}</a>
<main id="main"><canvas id="world" tabindex="0" aria-label="${escape(c.controls)}"></canvas><div class="scene-shade" aria-hidden="true"></div>
<header class="site-header"><a class="brand" href="/${lang}/village/" data-route="village"><img src="/assets/sainte-anne-crest.svg" width="30" height="36" alt=""><span>Sainte-Anne</span></a><button id="phone-button" data-action="phone" aria-label="${c.phone}" aria-haspopup="dialog"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4m-3 14h2"/></svg></button></header>
<section id="map-controls" hidden><h1>${c.map}</h1><p>${c.mapHint}</p><button id="map-close" data-action="close-map">× ${c.closeMap}</button><span class="map-north" aria-label="North">N ↑</span></section>
<nav id="place-labels" aria-label="${c.map}" hidden>${places.map((p,i) => `<button class="place-label" data-route="${p.id}" data-place="${p.id}"><b>${i+1}</b>${escape(placeTitle(p, lang))}</button>`).join('')}</nav>
<div id="interior-bar" hidden><span id="interior-title"></span><button data-route="village">← ${c.back}</button></div><div id="stations"></div>
<div id="scoreboard" hidden><span>${c.time}<b id="time">60</b></span><span>${c.score}<b id="score">0</b></span><span>${c.best}<b id="best">0</b></span></div>
<div id="power" hidden></div><button id="nearby" data-action="enter" hidden></button><div id="notice" role="status" aria-live="polite"></div>
<aside id="room" aria-labelledby="room-heading" hidden><button class="close" data-action="close-section" aria-label="${c.close}">×</button><p class="room-place"></p><div id="room-content"></div><button class="room-back" data-action="close-section">← ${lang === 'en' ? 'Back to the room' : 'Retour dans la maison'}</button></aside>
<div id="joystick" role="group" aria-label="${c.move}"><span></span></div><button id="mobile-enter" data-action="enter" hidden>${c.enter}</button>
<section id="fallback"><h1>${escape(t.title)}</h1><p id="load-status">${c.loading}</p><button id="reload" hidden onclick="location.reload()">${c.reload}</button><nav id="destinations" aria-label="${c.warp}">${navigation}</nav><div class="fallback-content">${renderRoom(route === 'play' ? 'game' : route, lang, content, members)}</div><noscript><p>${lang === 'en' ? 'Enable JavaScript to explore the 3D village. Read the site using the links below.' : 'Activez JavaScript pour explorer le village 3D. Les liens ci-dessous donnent accès au contenu.'}</p></noscript></section>
</main><dialog id="dialog" aria-labelledby="dialog-title"></dialog><dialog id="phone" aria-labelledby="phone-title"></dialog></body></html>`;
}

await rm('dist', { recursive: true, force: true });
await mkdir('dist/vendor', { recursive: true });
await cp('public', 'dist', { recursive: true });
await Promise.all(['three.module.js', 'three.core.js'].map(file => cp(`node_modules/three/build/${file}`, `dist/vendor/${file}`)));
await cp('node_modules/three/examples/jsm/utils/BufferGeometryUtils.js', 'dist/vendor/BufferGeometryUtils.js');
await cp('node_modules/three/examples/jsm/loaders/HDRLoader.js', 'dist/vendor/HDRLoader.js');
await cp('node_modules/three/examples/jsm/objects/Water.js', 'dist/vendor/Water.js');
await writeFile('dist/village/content.js', `export const content=${JSON.stringify(content)};\nexport const members=${JSON.stringify(members)};\n`);
for (const lang of ['fr', 'en']) for (const route of new Set([...routes, 'play', 'competition'])) {
 await mkdir(`dist/${lang}/${route}`, { recursive: true });
 await writeFile(`dist/${lang}/${route}/index.html`, render(lang, route));
}
await mkdir('dist/play', { recursive: true });
await writeFile('dist/play/index.html', render('fr', 'play'));
await writeFile('dist/village/index.html', render('fr', 'village'));
await writeFile('dist/index.html', render('fr', 'village'));
console.log('Built the bilingual 3D village, content locations and chase game.');
