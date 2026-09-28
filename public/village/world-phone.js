import { copy } from './world-data.js';
import { content, members } from './content.js';
import { renderRoom, escape } from './rooms.js';

const icons = {
 map: '<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Zm6-2v16m6-14v16"/>',
 settings: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M5 9h2m3 0h2m3 0h2M5 12h2m3 0h2m3 0h2M7 16h10"/>',
 language: '<path d="M3 5h12M9 2v3M5 5c1 5 4 8 8 10M13 5c-1 5-4 8-9 10m10 7 4-11 4 11m-7-3h6"/>',
 credits: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
 play: '<path d="m9 7 9 5-9 5V7Z"/><rect x="2" y="3" width="20" height="18" rx="5"/>',
 sections: '<path d="M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-6-2-10 1Zm0 0v15"/>',
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;

export function createPhone(lang, action, layout) {
 const c = copy[lang], dialog = document.querySelector('#phone');
 let required = false, sections = [];
 const sectionsTitle = lang === 'en' ? 'Inside this house' : 'Dans cette maison';
 dialog.addEventListener('cancel', event => { event.preventDefault(); if (!required) action('close-phone'); });
 dialog.addEventListener('change', event => { if (event.target.id === 'keyboard-layout') { layout = event.target.value; action('layout', layout); } });
 function show(view = 'home', firstVisit = false) {
  required = firstVisit;
  const titles = { home: c.phone, settings: c.settings, language: c.language, credits: c.credit, sections: sectionsTitle };
  const heading = firstVisit ? 'Bienvenue / Welcome' : titles[view];
  let body;
  if (view === 'home') {
   const apps = [['map', c.map], ['settings', c.settings], ['language', c.language], ['credits', c.credit], ['play', c.game]];
   if (sections.length) apps.unshift(['sections', sectionsTitle]);
   body = `<div class="phone-apps">${apps.map(([id, title]) => `<button data-action="${id === 'map' ? 'map' : id === 'play' ? 'route' : 'phone-view'}" data-value="${id}">${icon(id)}<span>${title}</span></button>`).join('')}</div><button class="phone-return" data-action="close-phone">${c.close} ↓</button>`;
  } else if (view === 'sections') {
   body = `<div class="phone-sections">${sections.map((section, i) => `<button data-action="section" data-value="${i}">${escape(section.title)}<span>↗</span></button>`).join('')}</div>`;
  } else if (view === 'settings') {
   body = `<label class="setting-label" for="keyboard-layout">${c.keyboard}</label><select id="keyboard-layout">${[['wasd','WASD'],['zqsd','ZQSD'],['arrows',c.arrows]].map(([value, title]) => `<option value="${value}" ${layout === value ? 'selected' : ''}>${title}</option>`).join('')}</select><p class="phone-help">${c.controls}</p><p class="phone-help">${c.mobileControls}</p>`;
  } else if (view === 'language') {
   body = `${firstVisit ? '<p class="language-intro">Choisissez votre langue.<br>Choose your language.</p>' : ''}<div class="language-options"><button data-action="language" data-value="fr" lang="fr"><b>FR</b><span>Français</span></button><button data-action="language" data-value="en" lang="en"><b>EN</b><span>English</span></button></div>`;
  } else body = `<div class="phone-credits">${renderRoom('credits', lang, content, members)}</div>`;
  dialog.innerHTML = `<div class="phone-speaker" aria-hidden="true"></div><header class="phone-header">${!firstVisit && view !== 'home' ? `<button data-action="phone-view" data-value="home" aria-label="${c.phoneHome}">←</button>` : '<span></span>'}<span>Sainte-Anne</span>${firstVisit ? '<span></span>' : `<button data-action="close-phone" aria-label="${c.close}">×</button>`}</header><div class="phone-content"><h1 id="phone-title">${heading}</h1>${body}</div><div class="phone-grip" aria-hidden="true"></div>`;
  document.body.classList.add('phone-open');
  if (!dialog.open) dialog.showModal();
 }
 return {
  show, open: () => dialog.open, required: () => required, setSections(value) { sections = value; },
  close() { required = false; dialog.close(); document.body.classList.remove('phone-open'); },
 };
}
