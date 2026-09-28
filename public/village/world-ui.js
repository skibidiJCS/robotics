import { content, members } from './content.js';
import { copy, places, placeTitle } from './world-data.js';
import { escape, renderRoom } from './rooms.js';

export function createUI(lang, action) {
 const c = copy[lang], $ = selector => document.querySelector(selector), dialog = $('#dialog');
 const labels = places.map(place => ({ place, button: $(`[data-place="${place.id}"]`) }));
 let noticeTimer, sections = [];
 document.addEventListener('click', event => {
  const button = event.target.closest('[data-action], [data-route], [data-mode]');
  if (!button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  event.preventDefault();
  if (button.dataset.route) action('route', button.dataset.route);
  else if (button.dataset.mode) action('mode', button.dataset.mode);
  else action(button.dataset.action, button.dataset.value);
 });
 dialog.addEventListener('cancel', event => { event.preventDefault(); action('escape'); });
 function modal(html) { dialog.innerHTML = html; if (!dialog.open) dialog.showModal(); }
 const closeButton = `<button class="close" data-action="escape" aria-label="${c.close}">×</button>`;
 function board() {
  modal(`${closeButton}<p class="dialog-kicker">${c.game}</p><h1 id="dialog-title">${c.boardTitle}</h1><div id="rankings" aria-live="polite">${c.loading}</div>`);
  const container = $('#rankings');
  fetch('/api/leaderboard').then(response => { if (!response.ok) throw Error(); return response.json(); }).then(data => {
   container.innerHTML = data.entries.length ? `<ol class="rankings">${data.entries.map(row => `<li><span>${escape(row.name)}</span><b>${escape(row.score)}</b></li>`).join('')}</ol>` : `<p>${c.empty}</p>`;
  }).catch(() => { container.innerHTML = `<p>${c.failed}</p><button class="primary" data-action="board">${lang === 'en' ? 'Try again' : 'Réessayer'}</button>`; });
 }
 function game(kind, state, best, run) {
  const welcome = kind === 'welcome', ended = kind === 'end';
  const title = welcome ? c.game : ended ? (state.reason === 'caught' ? c.caught : c.timeUp) : c.paused;
  modal(`${welcome ? '' : closeButton}<p class="dialog-kicker">${welcome ? '60 ' + (lang === 'en' ? 'seconds in the house' : 'secondes dans la maison') : c.game}</p><h1 id="dialog-title">${title}</h1>
   ${welcome ? `<p>${c.gameIntro}</p><p class="rules">${c.rules}</p>${state.mode === 'hard' ? `<p class="rules">${c.hardRules}</p>` : ''}<fieldset class="difficulty"><legend>${c.difficulty}</legend>${['easy', 'medium', 'hard'].map(mode => `<button data-mode="${mode}" aria-pressed="${state.mode === mode}">${c[mode]}</button>`).join('')}</fieldset>` : ended ? `<p class="final-score">${state.score}</p><p>${state.found} ${c.found} · ${c.best} ${best}</p>` : `<p>${lang === 'en' ? 'Your friends can wait a moment.' : 'Vos amis peuvent attendre un instant.'}</p>`}
   ${ended && state.mode === 'hard' ? `<form class="score-form"><label for="username">${c.name}</label><input id="username" maxlength="20" autocomplete="nickname" value="${escape(readSaved('smurf-username', 'Player'))}"><button class="primary" type="submit" ${run.saved ? 'disabled' : ''}>${run.saved ? c.saved : c.save}</button><p role="status"></p></form>` : ''}
   <button class="primary" data-action="${kind === 'pause' ? 'resume' : 'start'}">${welcome ? c.start : ended ? c.again : c.resume}</button><button class="secondary" data-action="board">${c.ranking}</button><button class="secondary" data-route="village">← ${c.back}</button>`);
  const form = dialog.querySelector('form');
  if (form) form.addEventListener('submit', async event => {
   event.preventDefault();
   const input = form.querySelector('input'), button = form.querySelector('button'), status = form.querySelector('[role=status]');
   button.disabled = true; status.textContent = '';
   try {
    const response = await fetch('/api/leaderboard', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: run.id, name: input.value, score: state.score, mode: state.mode }) });
    if (!response.ok) throw Error();
    const data = await response.json(); run.saved = true; save('smurf-username', data.name); input.value = data.name; input.disabled = true; button.textContent = c.saved;
   } catch { button.disabled = false; status.textContent = c.retry; }
  });
 }
 return {
  modalOpen: () => dialog.open,
  closeDialog() { dialog.close(); },
  game, board,
  route(route) {
   const place = places.find(p => p.id === route), inside = !!place && route !== 'play';
   document.body.classList.remove('reading'); document.body.classList.toggle('interior', inside); document.body.classList.toggle('playing', route === 'play');
   $('#room').hidden = true; $('#scoreboard').hidden = route !== 'play'; $('#interior-bar').hidden = !inside;
   sections = []; $('#stations').innerHTML = '';
   if (inside) {
    const template = document.createElement('template'); template.innerHTML = renderRoom(route, lang, content, members);
    const title = template.content.querySelector('h1')?.textContent || placeTitle(place, lang);
    let current = { title, html: '' };
    for (const node of [...template.content.children].flatMap(node => node.matches('section') ? [...node.children] : [node])) {
     if (node.tagName === 'H1') continue;
     if (node.tagName === 'H2') { if (current.html) sections.push(current); current = { title: node.textContent, html: '' }; }
     else current.html += node.outerHTML;
    }
    if (current.html) sections.push(current);
    $('#stations').innerHTML = sections.map((section, i) => `<button class="station-label" data-action="section" data-value="${i}">${escape(section.title)} ↗</button>`).join('');
    $('#interior-title').textContent = title;
    $('.room-place').textContent = placeTitle(place, lang);
   }
   document.title = `${place ? placeTitle(place, lang) : c.village} · Sainte-Anne`;
  },
  sections: () => sections,
  section(index) {
   const section = sections[index]; if (!section) return;
   document.body.classList.add('reading'); $('#room').hidden = false;
   $('#room-content').innerHTML = `<h1 id="room-heading" tabindex="-1">${escape(section.title)}</h1>${section.html}`;
   $('#room').scrollTop = 0; $('#room-heading').focus({ preventScroll: true });
  },
  closeSection() { document.body.classList.remove('reading'); $('#room').hidden = true; },
  reading: () => !$('#room').hidden,
  stations(world, show) {
   const header = $('#interior-bar').getBoundingClientRect();
   document.querySelectorAll('.station-label').forEach((button, i) => {
    const p = world.projectStation(i), width = button.offsetWidth || 150;
    const behindHeader = p.x - width / 2 < header.right + 12 && p.y - 45 < header.bottom + 8;
    button.hidden = !show || !p.visible || behindHeader || p.x < width / 2 + 8 || p.x > innerWidth - width / 2 - 8 || p.y < 110 || p.y > innerHeight - 50;
    button.style.transform = `translate(${p.x}px,${p.y}px) translate(-50%,-100%)`;
   });
  },
  nearSection(section) { $('#nearby').hidden = !section; $('#mobile-enter').hidden = true; if (section) $('#nearby').textContent = `E · ${section.title}`; },
  walking(value) { document.body.classList.toggle('walking', value); },
  map(value) { document.body.classList.toggle('mapping', value); $('#map-controls').hidden = !value; $('#place-labels').hidden = !value; if (value) $('#map-close').focus(); },
  ready() { document.body.classList.add('world-ready'); },
  failure() { document.body.classList.remove('world-ready'); document.body.classList.add('world-failed'); $('#load-status').textContent = c.fallback; $('#reload').hidden = false; },
  labels(world, show) {
   for (const { place, button } of labels) {
    const p = world.project(place);
    button.hidden = !show || !p.visible || p.x < 20 || p.x > innerWidth - 20 || p.y < 85 || p.y > innerHeight - 35;
    const half = button.offsetWidth / 2 + 8, x = Math.max(half, Math.min(innerWidth - half, p.x));
    button.style.transform = `translate(${x}px,${p.y}px) translate(-50%,-100%)`;
   }
  },
  nearby(place) { $('#nearby').hidden = !place; $('#mobile-enter').hidden = !place || !matchMedia('(pointer:coarse)').matches; if (place) $('#nearby').textContent = `E · ${c.enter} ${placeTitle(place, lang)}`; },
  update(state, best, gameActive) {
   $('#time').textContent = Math.ceil(state.remaining); $('#time').classList.toggle('urgent', state.remaining <= 10);
   $('#score').textContent = state.score; $('#best').textContent = best;
   $('#power').hidden = !gameActive || (!state.boost && !state.protection);
   $('#power').textContent = state.protection ? c.shield : `${c.speed} ${Math.ceil(state.boost)}s`;
  },
  announce(event, state) {
   $('#notice').textContent = event === 'found' ? `${c.foundNotice} · +100 · +${state.lastTimeBonus}s` : c[event];
   $('#notice').classList.add('visible'); clearTimeout(noticeTimer); noticeTimer = setTimeout(() => $('#notice').classList.remove('visible'), 1800);
  },
 };
}
export function readSaved(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } }
export function save(key, value) { try { localStorage.setItem(key, String(value)); } catch {} }
