export const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderRoom(route, lang, content, members = []) {
 const t = content[lang], en = lang === 'en';
 const pending = text => `<p class="pending">${escape(text)}</p>`;
 const sections = (labels, notes) => labels.map((label, i) => `<section class="room-section"><h2>${escape(label)}</h2><p>${escape(notes[i] || t.pending)}</p></section>`).join('');
 const rooms = {
  about: `<h1>${escape(t.aboutHeading)}</h1><p>${escape(t.aboutText)}</p><h2>${escape(t.schoolHeading)}</h2><p>${escape(t.schoolText)}</p><p>${escape(t.schoolNote)}</p><h2>${escape(t.crcHeading)}</h2><p>${escape(t.crcText)}</p><a href="https://robo-crc.ca/" target="_blank" rel="noopener">${escape(t.crcLink)}</a>`,
  team: `<h1>${en ? 'The people behind the village.' : 'Les gens derrière le village.'}</h1><h2>${en ? 'The team' : 'L’équipe'}</h2><p class="room-number">${members.length}<span>${en ? 'team members' : 'membres de l’équipe'}</span></p>${members.some(m => m.name) ? `<ul>${members.filter(m => m.name).map(m => `<li>${escape(m.name)}${m.contribution[lang] ? ` · ${escape(m.contribution[lang])}` : ''}</li>`).join('')}</ul>` : pending(en ? 'Meet the team here soon. Names, portraits and contributions are being prepared.' : 'Les noms, portraits et contributions de l’équipe seront présentés ici bientôt.')}<h2>${en ? 'The school' : 'L’école'}</h2><p>${escape(t.schoolText)}</p><h2>${en ? 'Our mentors' : 'Nos mentors'}</h2><p>${escape(t.teamNote)}</p>`,
  robot: `<h1>${en ? 'From an idea to a robot.' : 'D’une idée à un robot.'}</h1>${sections(t.robotTabs, t.robotNotes)}${pending(t.robotPhoto)}<p class="room-note">${en ? 'The 3D robot is an illustration, not our final competition robot.' : 'Le robot 3D est une illustration, pas notre robot de compétition final.'}</p>`,
  photos: `<h1>${en ? 'Life in the workshop.' : 'La vie à l’atelier.'}</h1>${sections(t.photoTabs, t.photoTabs.map(() => t.photoNote))}`,
  journal: `<h1>${en ? 'Our field notes.' : 'Notre carnet de bord.'}</h1><p>${escape(t.journalNote)}</p>${sections(t.journalTabs, t.journalTabs.map(() => t.pending))}`,
  media: `<h1>${en ? 'Pull up a seat.' : 'Prenez place.'}</h1>${sections(t.mediaTabs, t.mediaNotes)}${pending(t.mediaPlaceholder)}`,
  credits: `<h1>${en ? 'Made at Sainte-Anne.' : 'Créé à Sainte-Anne.'}</h1><p>${escape(t.creditsText)}</p><p>${escape(t.sourceCredit)}</p><h2>${en ? 'The forest' : 'La forêt'}</h2><p>${en ? 'Forest ground and bark textures by' : 'Textures de sol forestier et d’écorce par'} <a href="https://polyhaven.com/" target="_blank" rel="noopener">Poly Haven</a>, CC0.</p><p>${en ? 'Interactive 3D built with' : 'Univers 3D réalisé avec'} <a href="https://threejs.org/" target="_blank" rel="noopener">Three.js</a>.</p>`,
  game: `<h1>${escape(t.gameTitle)}</h1><p>${escape(t.gameText)}</p><ul>${t.gameList.map(item => `<li>${escape(item)}</li>`).join('')}</ul><a href="/${lang}/play/">${en ? 'Play Escape Azrael' : 'Jouer à Échappez à Azraël'}</a>`,
 };
 return rooms[route] || rooms.about;
}
