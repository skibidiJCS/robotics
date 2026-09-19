import './test-roam.mjs';
import './test-leaderboard.mjs';
import './test-chase.mjs';
import './test-cloud-leaderboard.mjs';
import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {parseHTML} from 'linkedom';
import {renderRoom} from '../dist/village/rooms.js';
for(const file of (await readdir('dist',{recursive:true})).filter(f=>f.endsWith('.html'))){const {document}=parseHTML(await readFile(`dist/${file}`,'utf8'));assert(document.querySelector('main'));if(file.includes('/play/')||file==='play/index.html'||file==='village/index.html'){assert(document.querySelector('#roam'));assert(document.querySelector('#intro'));assert(!document.querySelector('#house-links'));}else assert(!document.querySelector('#roam'));for(const el of document.querySelectorAll('[src],[href]')){const path=el.getAttribute('src')||el.getAttribute('href');if(path.startsWith('/'))assert((await stat(`dist${path}${path.endsWith('/')?'index.html':''}`)).isFile());}}
for(const lang of ['en','fr'])for(const room of ['about','team','game','robot','photos','journal','media','credits']){const {document}=parseHTML(renderRoom(room,lang,{page:0,tab:0}));assert(document.querySelector('h1'));}
console.log('PASS: entry pages, local assets and eight content sections in both languages.');
