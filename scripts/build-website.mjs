import {mkdir,writeFile,cp,rm} from 'node:fs/promises';
import {content,routes} from '../src/content.mjs';
import {houseArt,villageBackground} from '../public/village/village-markup.js';
const escape=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const url=(lang,route='village')=>`/${lang}/${route}/`;
function render(lang,route){
 const t=content[lang],other=lang==='en'?'fr':'en',map=route===''||route==='village';
 const destinations=['about','game','team','robot','photos','journal'];
 const village=`<main id="main" class="village-scene">${villageBackground()}<div class="village-brand"><img src="/assets/sainte-anne-logo.svg" width="176" height="176" alt="Sainte-Anne"><h1>${escape(t.title)}</h1></div><nav class="village-houses" aria-label="${escape(t.mapTitle)}">${destinations.map((r,i)=>`<a class="village-house village-house-${i}" href="${url(lang,r==='game'?'play':r)}" ${r==='game'?'data-full-page':''}>${houseArt(i)}<span class="village-label">${escape(t.labels[routes.indexOf(r)])}</span></a>`).join('')}</nav><a class="village-cinema" href="${url(lang,'media')}">▷ ${escape(t.videoShortcut)}</a></main>`;
 const room=`<main id="main" class="room-world"><section class="room placeholder-room"><a class="room-back" href="${url(lang)}" aria-label="${escape(t.back)}">←</a><h1>placeholder</h1></section></main>`;
 const game=`<main id="main"><a href="${url(lang,'play')}" data-full-page>${lang==='en'?'Play':'Jouer'}</a></main>`;
 return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#bad397"><title>${escape(t.title)}</title><link rel="icon" href="/assets/favicon.svg"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/village/original-hub.css"><script src="/entry.js"></script><script src="/app.js" defer></script></head><body class="${map?'village-page':'room-page'}"><a class="skip" href="#main">${escape(t.skip)}</a><a class="locale-button floating-locale" href="${url(other,route||'village')}" aria-label="${escape(t.localeLabel)}">${t.locale}</a>${map?village:route==='game'?game:room}<footer class="site-footer"><a href="${url(lang,'credits')}">${escape(t.creditShortcut)}</a></footer></body></html>`;
}
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await cp('public','dist',{recursive:true});
for(const lang of ['fr','en'])for(const route of routes){await mkdir(`dist/${lang}/${route}`,{recursive:true});await writeFile(`dist/${lang}/${route}/index.html`,render(lang,route));}
await writeFile('dist/index.html',render('fr','village'));
for(const lang of ['fr','en']){await mkdir(`dist/${lang}/competition`,{recursive:true});await writeFile(`dist/${lang}/competition/index.html`,render(lang,'game'));}
console.log('Built the village and placeholder rooms.');
