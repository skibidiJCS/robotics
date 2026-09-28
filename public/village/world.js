import { arena } from './arena-layout.js';
import { createGame, step } from './roam-state.js';
import { places, routeFromPath, toWorld, warp, copy } from './world-data.js';
import { createUI, readSaved, save } from './world-ui.js';
import { createPhone } from './world-phone.js';
import { bindInput } from './world-input.js';

const initial = routeFromPath(location.pathname), lang = initial.lang, c = copy[lang];
const savedLanguage = readSaved('smurf-language', ''), hasLanguage = ['en', 'fr'].includes(savedLanguage) && readSaved('smurf-language-selected', '') === 'true';
const redirect = hasLanguage && !/^\/(en|fr)(\/|$)/.test(location.pathname);
if (redirect) location.replace(`/${savedLanguage}/${initial.route}/`);
const canvas = document.querySelector('#world'), reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
let route = initial.route, world, input, walking = false, nearby = null, failed = false, mode = 'easy', state = createGame(mode), mapping = false;
let layout = readSaved('smurf-controls', lang === 'fr' ? 'zqsd' : 'wasd');
if (!['wasd', 'zqsd', 'arrows'].includes(layout)) layout = 'wasd';
let run = { id: crypto.randomUUID(), saved: false }, dialogKind = '', last = performance.now(), frameId, uiElapsed = 0;
const best = () => Math.max(0, Number(readSaved(`smurf-rescue-best-${mode}`, 0)) || 0);
const ui = createUI(lang, action), phone = createPhone(lang, action, layout);
if (!hasLanguage && !redirect) phone.show('language', true);
const inside = () => places.some(p => p.id === route) && route !== 'play';
const active = () => !phone.open() && !mapping && !ui.modalOpen() && !ui.reading();

function clear() { input?.clear(); world?.clearInterior(); state.target = null; state.route = []; state.player.vx = 0; }
function showGame(kind) { clear(); dialogKind = kind; ui.game(kind, state, best(), run); }
function pause() { if (state.phase === 'playing') { state.phase = 'paused'; clear(); if (!phone.open() && !mapping) showGame('pause'); } }
function setWalking(value) { walking = value; world.walk(value); ui.walking(value); }
function setMap(value) { mapping = value; world.map(value); ui.map(value); clear(); }
function navigate(next, historyMode = 'push') {
 clear(); ui.closeDialog(); if (!phone.required()) phone.close(); dialogKind = ''; setMap(false);
 const previous = route; route = next;
 if (historyMode === 'push' && previous !== next) history.pushState({}, '', `/${lang}/${next}/`);
 ui.route(route); phone.setSections(ui.sections()); ui.nearby(null); nearby = null;
 world.exit();
 if (route === 'play') {
  state = createGame(mode, arena); if (!phone.open()) showGame('welcome');
 } else {
  if (previous === 'play') { state = createGame(mode); warp(state, places.find(p => p.id === 'play')); }
  state.phase = 'explore';
  const place = places.find(p => p.id === route);
  if (place) { warp(state, place); world.enter(place, ui.sections()); }
  else { setWalking(previous !== 'village' && historyMode !== 'none'); if (route === 'credits' && !phone.required()) phone.show('credits'); }
 }
 ui.update(state, best(), route === 'play');
}
function closePhone() {
 if (phone.required()) return;
 phone.close(); clear();
 if (mapping) return;
 if (route === 'credits') navigate('village');
 else if (state.phase === 'paused') showGame('pause');
 else if (route === 'play') showGame(state.phase === 'ended' ? 'end' : 'welcome');
 canvas.focus({ preventScroll: true });
}
function escapeDialog() {
 if (dialogKind === 'pause') { action('resume'); return; }
 if (dialogKind === 'welcome' || dialogKind === 'end') { navigate('village'); return; }
 if (state.phase === 'paused') showGame('pause');
 else if (route === 'play') showGame(state.phase === 'ended' ? 'end' : 'welcome');
 else { ui.closeDialog(); dialogKind = ''; canvas.focus({ preventScroll: true }); }
}
function action(name, value) {
 if (name === 'language' && ['fr', 'en'].includes(value)) {
  save('smurf-language', value);
  save('smurf-language-selected', true);
  if (value !== lang) location.assign(`/${value}/${route}/`);
  else { phone.close(); if (world && route === 'play') showGame('welcome'); else if (route === 'credits') phone.show('credits'); }
  return;
 }
 if (name === 'phone-view') { phone.show(value); return; }
 if (name === 'phone') { if (phone.required()) return; if (state.phase === 'playing') state.phase = 'paused'; clear(); ui.closeDialog(); phone.show(); return; }
 if (name === 'close-phone') { closePhone(); return; }
 if (name === 'layout' && ['wasd', 'zqsd', 'arrows'].includes(value)) { layout = value; input?.setLayout(value); save('smurf-controls', value); clear(); return; }
 if (!world || failed) { if (name === 'route') location.assign(`/${lang}/${value}/`); return; }
 switch (name) {
  case 'route': navigate(value); break;
  case 'map': phone.close(); ui.closeDialog(); if (state.phase === 'playing') state.phase = 'paused'; setMap(true); break;
  case 'close-map': setMap(false); if (state.phase === 'paused') showGame('pause'); else canvas.focus({ preventScroll: true }); break;
  case 'section': phone.close(); clear(); ui.section(Number(value)); break;
  case 'close-section': clear(); ui.closeSection(); canvas.focus({ preventScroll: true }); break;
  case 'enter':
   if (inside()) { const station = world.nearStation(); if (station) station.index === -1 ? navigate('village') : action('section', station.index); }
   else if (nearby && route === 'village') navigate(nearby.id);
   break;
  case 'board': pause(); clear(); dialogKind = 'board'; ui.board(); break;
  case 'mode': mode = value; state = createGame(mode, arena); showGame('welcome'); break;
  case 'start':
   state = createGame(mode, arena); state.phase = 'playing'; run = { id: crypto.randomUUID(), saved: false };
   clear(); ui.closeDialog(); dialogKind = ''; world.exit(); last = performance.now(); canvas.focus({ preventScroll: true }); break;
  case 'resume': state.phase = 'playing'; ui.closeDialog(); dialogKind = ''; clear(); last = performance.now(); canvas.focus({ preventScroll: true }); break;
  case 'escape':
   if (phone.open()) closePhone();
   else if (mapping) action('close-map');
   else if (ui.modalOpen()) escapeDialog();
   else if (ui.reading()) action('close-section');
   else action('phone');
   break;
 }
}
function frame(now) {
 if (route !== 'play' && now - last < 1000 / 30) { frameId = requestAnimationFrame(frame); return; }
 const elapsed = Math.max(0, (now - last) / 1000), dt = Math.min(elapsed, .05); last = now;
 if (!document.hidden) {
  if (active()) {
   if (inside()) world.moveInterior(world.axes(input.axes()), dt);
   else if (['village', 'play'].includes(route)) {
    if (route === 'village') state.boost = input.running() ? 1 : 0;
    for (const event of step(state, world.axes(input.axes()), elapsed)) {
     if (event === 'end') { save(`smurf-rescue-best-${mode}`, Math.max(best(), state.score)); showGame('end'); }
     else ui.announce(event, state);
    }
   }
  }
  world.render(state, dt, reduced ? 0 : now / 1000, route === 'play', reduced);
  uiElapsed += dt;
  if (uiElapsed > .09) {
   uiElapsed = 0; ui.update(state, best(), route === 'play'); ui.labels(world, mapping); ui.stations(world, inside() && !mapping && !phone.open());
   if (inside()) { const station = world.nearStation(); ui.nearSection(station && { ...station, title: station.index === -1 ? c.back : station.title }); }
   else {
    const p = toWorld(state.player.x, state.player.y);
    nearby = route === 'village' ? places.find(place => Math.hypot(p.x - place.entrance[0], p.z - place.entrance[1]) < 3.8) : null;
    ui.nearby(mapping ? null : nearby);
   }
  }
 }
 frameId = requestAnimationFrame(frame);
}
if (!redirect) try {
 const { createWorld } = await import('./world-scene.js');
 world = await createWorld(canvas);
 input = bindInput(canvas, document.querySelector('#joystick'), {
  active, layout,
  move: () => { if (route === 'village' && !walking) setWalking(true); },
  point: (x, y) => {
   if (inside()) { const section = world.interiorPoint(x, y); if (section !== undefined) action('section', section); return; }
   const p = world.pick(x, y);
   if (p && !state.environment.blocked(p.x, p.y)) { state.route = state.environment.routeTo(state.player, p); state.target = state.route.length ? p : null; if (route === 'village') setWalking(true); }
  },
  rotate: world.rotate, zoom: world.zoom, action,
 });
 ui.ready(); navigate(route, 'none');
 window.addEventListener('resize', () => { world.resize(); clear(); });
 window.addEventListener('popstate', () => navigate(routeFromPath(location.pathname).route, 'none'));
 window.addEventListener('blur', () => { pause(); clear(); });
 document.addEventListener('visibilitychange', () => { if (document.hidden) { pause(); clear(); } last = performance.now(); });
 canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); failed = true; pause(); cancelAnimationFrame(frameId); ui.closeDialog(); ui.failure(); });
 window.addEventListener('pagehide', event => { if (!event.persisted) cancelAnimationFrame(frameId); });
 frameId = requestAnimationFrame(frame);
} catch (error) { console.error('Village loading failed:', error); failed = true; ui.failure(); }
