export const SCALE = .06;
export const toWorld = (x, y) => ({ x: (x - 650) * SCALE, z: (y - 580) * SCALE });
export const toGame = (x, z) => ({ x: x / SCALE + 650, y: z / SCALE + 580 });
export const places = [
  { id: 'about', x: -19, z: -12, color: '#bb2b1d', title: ['La maison commune', 'The meeting house'], entrance: [-16, -6] },
  { id: 'team', x: 4, z: 0, color: '#b62516', title: ['La maison de l’équipe', 'The team house'], entrance: [4, 6] },
  { id: 'robot', x: 22, z: -12, color: '#7db6cd', title: ['L’atelier', 'The workshop'], entrance: [18, -7] },
  { id: 'photos', x: -23, z: 7, color: '#b62c23', title: ['La galerie', 'The gallery'], entrance: [-17, 7] },
  { id: 'journal', x: 12, z: 16, color: '#bf361c', title: ['Le carnet de bord', 'The field notes'], entrance: [7, 18] },
  { id: 'media', x: -5, z: -19, color: '#a32218', title: ['Le cinéma', 'The cinema'], entrance: [-3, -13] },
  { id: 'play', x: 27, z: 5, color: '#cb4220', title: ['La maison d’Azraël', 'Azrael’s house'], entrance: [21, 5] },
];
export const HOUSE_RADIUS = 3.15;
export const placeAngle = place => Math.atan2(place.entrance[0] - place.x, place.entrance[1] - place.z);
export const placeTitle = (place, lang) => place.title[lang === 'fr' ? 0 : 1];
export function routeFromPath(path) {
  const parts = path.split('/').filter(Boolean);
  const lang = parts[0] === 'en' ? 'en' : 'fr';
  const requested = ['en', 'fr'].includes(parts[0]) ? parts[1] : parts[0];
  const route = ['game', 'competition'].includes(requested) ? 'play' : requested;
  return { lang, route: [...places.map(p => p.id), 'credits'].includes(route) ? route : 'village' };
}
export function warp(state, place) {
  const point = toGame(...place.entrance);
  Object.assign(state.player, point, { vx: 0, dx: 0, dy: 0 });
  state.target = null;
  state.route = [];
}
export const copy = {
  en: {
    phone: 'Phone', map: 'Village map', mapHint: 'Choose a house to warp there.', closeMap: 'Return to the village', settings: 'Controls', language: 'Language', keyboard: 'Keyboard layout', arrows: 'Arrow keys', returnGame: 'Return to game', phoneHome: 'Home', you: 'You are here',
    village: 'The village', title: 'A world tucked\naway in the woods.', intro: 'Walk a little. Stay a while. Meet Sainte-Anne’s robotics team.',
    explore: 'Take a walk', overview: 'Village view', warp: 'Go somewhere', warpHint: 'Choose a place to travel instantly', walking: 'Exploring the village',
    move: 'Move', run: 'Run', look: 'Drag to look', enter: 'Enter', back: 'Back to the village', close: 'Close', help: 'Controls',
    controls: 'WASD, ZQSD or arrow keys to walk. Shift to run. Click the ground to walk there. Drag to turn the camera. Scroll to zoom. E opens a nearby house. Escape closes a panel or pauses the game.',
    mobileControls: 'Drag the joystick to walk. Drag the world to turn the camera. Open your phone for the village map, instant travel, and house sections.',
    game: 'Escape Azrael', gameIntro: 'A tiny Smurf in an enormous house. Race through the kitchen, library and workshop to rescue your friends before Azrael catches you.',
    rules: 'Rescue a Smurf for 100 points and extra time. Blue mushrooms give speed; gold mushrooms block one hit. Avoid falling acorns. Three quick rescues add 150 points.',
    hardRules: 'Two cats. No shields. Rescue time bonuses are capped at 30 seconds. Three quick rescues add 150 points, with no extra time.',
    easy: 'Easy', medium: 'Medium', hard: 'Hard', difficulty: 'Difficulty', start: 'Let’s play', pause: 'Pause', paused: 'Taking a breather', resume: 'Keep going',
    caught: 'Azrael found you.', timeUp: 'Time’s up.', again: 'One more try', score: 'Score', time: 'Time', best: 'Best', found: 'Smurfs rescued',
    ranking: 'Leaderboard', boardTitle: 'Hard-mode leaderboard', loading: 'Loading…', empty: 'No scores yet. Be the first.', failed: 'Could not load scores. Try again.',
    name: 'Your name', save: 'Save score', saved: 'Score saved', retry: 'Could not save. Try again.', credit: 'Credits',
    foundNotice: 'Smurf rescued', speed: 'Speed boost!', shield: 'Shield ready', shieldUsed: 'Shield used. Run!', acornHit: 'Acorn hit. Time lost!', combo: 'Rescue streak! +150',
    fallback: 'The 3D forest could not load. You can still read every section below. Try reloading with hardware acceleration enabled.', reload: 'Reload the village',
  },
  fr: {
    phone: 'Téléphone', map: 'Plan du village', mapHint: 'Choisissez une maison pour vous y téléporter.', closeMap: 'Retour au village', settings: 'Commandes', language: 'Langue', keyboard: 'Disposition du clavier', arrows: 'Flèches', returnGame: 'Retour au jeu', phoneHome: 'Accueil', you: 'Vous êtes ici',
    village: 'Le village', title: 'Un monde caché\nau creux des bois.', intro: 'Prenez le temps d’explorer le village de l’équipe de robotique de Sainte-Anne.',
    explore: 'Se promener', overview: 'Vue du village', warp: 'Où aller ?', warpHint: 'Choisissez un lieu pour vous y téléporter', walking: 'En promenade au village',
    move: 'Bouger', run: 'Courir', look: 'Glisser pour regarder', enter: 'Entrer', back: 'Retour au village', close: 'Fermer', help: 'Commandes',
    controls: 'WASD, ZQSD ou flèches pour marcher. Maj pour courir. Cliquez au sol pour vous déplacer. Glissez pour tourner la caméra. Molette pour zoomer. E ouvre la maison voisine. Échap ferme un panneau ou met le jeu en pause.',
    mobileControls: 'Glissez le joystick pour marcher. Glissez le décor pour tourner la caméra. Le téléphone donne accès au plan, à la téléportation et aux sections des maisons.',
    game: 'Échappez à Azraël', gameIntro: 'Un petit Schtroumpf dans une immense maison. Traversez la cuisine, la bibliothèque et l’atelier pour sauver vos amis avant qu’Azraël ne vous attrape.',
    rules: 'Sauvez un Schtroumpf pour 100 points et du temps bonus. Champignon bleu : vitesse. Doré : un contact protégé. Évitez les glands. Trois sauvetages rapides ajoutent 150 points.',
    hardRules: 'Deux chats. Aucun bouclier. Les bonus de temps sont limités à 30 secondes. Trois sauvetages rapides ajoutent 150 points, sans temps bonus.',
    easy: 'Facile', medium: 'Moyen', hard: 'Difficile', difficulty: 'Difficulté', start: 'C’est parti', pause: 'Pause', paused: 'Une petite pause', resume: 'Reprendre',
    caught: 'Azraël vous a trouvé.', timeUp: 'Temps écoulé.', again: 'Encore une fois', score: 'Points', time: 'Temps', best: 'Record', found: 'Schtroumpfs sauvés',
    ranking: 'Classement', boardTitle: 'Classement en difficile', loading: 'Chargement…', empty: 'Aucun score. À vous de jouer.', failed: 'Chargement impossible. Réessayez.',
    name: 'Votre pseudo', save: 'Enregistrer', saved: 'Score enregistré', retry: 'Enregistrement impossible. Réessayez.', credit: 'Crédits',
    foundNotice: 'Schtroumpf sauvé', speed: 'Vitesse bonus !', shield: 'Bouclier prêt', shieldUsed: 'Bouclier utilisé. Fuyez !', acornHit: 'Gland ! Temps perdu.', combo: 'Série de sauvetages ! +150',
    fallback: 'La forêt 3D n’a pas pu charger. Toutes les sections restent accessibles ci-dessous. Réessayez avec l’accélération matérielle activée.', reload: 'Recharger le village',
  },
};
