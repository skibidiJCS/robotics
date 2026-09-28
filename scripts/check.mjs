import './test-roam.mjs';
import './test-leaderboard.mjs';
import './test-chase.mjs';
import './test-game-challenges.mjs';
import './test-cloud-leaderboard.mjs';
import './test-world.mjs';
import './test-interior.mjs';
import './test-arena.mjs';
import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {parseHTML} from 'linkedom';
import {resolve,dirname} from 'node:path';
import {renderRoom} from '../dist/village/rooms.js';
import {content,members} from '../src/content.mjs';
for (const file of (await readdir('dist', { recursive: true })).filter(f => f.endsWith('.html'))) {
 const { document } = parseHTML(await readFile(`dist/${file}`, 'utf8'));
 for (const selector of ['main', '#world', '#destinations', '#dialog', '#phone', '#phone-button', '#map-controls', '#stations', '#fallback h1', 'script[type="importmap"]']) assert(document.querySelector(selector), `${file} missing ${selector}`);
 assert.equal(document.querySelectorAll('#destinations a').length, 7);
 for (const el of document.querySelectorAll('[src],[href]')) {
  const path = el.getAttribute('src') || el.getAttribute('href');
  if (path.startsWith('/')) assert((await stat(`dist${path}${path.endsWith('/') ? 'index.html' : ''}`)).isFile(), path);
 }
}
for (const lang of ['en', 'fr']) for (const room of ['about', 'team', 'game', 'robot', 'photos', 'journal', 'media', 'credits']) {
 const { document } = parseHTML(renderRoom(room, lang, content, members));
 assert(document.querySelector('h1'));
 assert(!document.textContent?.includes('placeholder'));
}
for (const file of (await readdir('dist', { recursive: true })).filter(f => f.endsWith('.js'))) {
 const source = await readFile(`dist/${file}`, 'utf8');
 for (const [, path] of source.matchAll(/\b(?:from\s+|import\s*\(\s*)['"]([^'"]+\.js)['"]/g)) {
  if (!path.startsWith('.') && !path.startsWith('/')) continue;
  const target = path.startsWith('/') ? resolve('dist', '.' + path) : resolve('dist', dirname(file), path);
  assert((await stat(target)).isFile(), `Missing module ${path} in ${file}`);
 }
}
console.log('PASS: bilingual 3D entry pages, local assets, navigation and readable fallback sections.');
