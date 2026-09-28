import assert from 'node:assert/strict';
import { places, toWorld, toGame, warp, routeFromPath } from '../public/village/world-data.js';
import { createGame, blocked, routeTo, step, bounds, createControls, obstacles } from '../public/village/roam-state.js';

for (const place of places) {
 const state = createGame(); state.phase = 'explore'; state.target = { x: 400, y: 400 };
 warp(state, place);
 assert(!blocked(state.player.x, state.player.y), `${place.id} warp must land on walkable ground`);
 const point = toWorld(state.player.x, state.player.y);
 assert(Math.hypot(point.x - place.entrance[0], point.z - place.entrance[1]) < 1e-9);
 assert.equal(state.target, null);
 assert.deepEqual(state.route, []);
 assert(routeTo({ x: 650, y: 770 }, state.player).length, `${place.id} must also be reachable on foot`);
 const center = toGame(place.x, place.z), radius = 5 / .06;
 assert(blocked(center.x, center.y), `${place.id} walls block movement`);
 assert(center.x - radius > bounds.left && center.x + radius < bounds.right && center.y - radius > bounds.top && center.y + radius < bounds.bottom, `${place.id} is entirely within the village`);
 const timer = state.remaining; step(state, { x: 0, y: 0 }, 1);
 assert.equal(state.remaining, timer, 'Village exploration has no timer');
 assert.deepEqual(routeFromPath(`/en/${place.id}/`), { lang: 'en', route: place.id });
}
for (const route of ['play', 'game', 'competition']) assert.deepEqual(routeFromPath(`/fr/${route}/`), { lang: 'fr', route: 'play' });
assert.equal(routeFromPath('/en/robot/').route, 'robot', 'Direct content URLs survive refresh');
assert.equal(routeFromPath('/unknown/').route, 'village');
assert.equal(routeFromPath('/play/').route, 'play');
assert.deepEqual(toGame(0, 0), { x: 650, y: 580 });
console.log('PASS: 3D coordinate mapping, safe reachable warps, exploration and direct routes.');
const controls = createControls('wasd');
assert.equal(controls.press('KeyZ'), false); controls.press('KeyW'); assert.equal(controls.axes().y, -1);
controls.setLayout('zqsd'); assert.deepEqual(controls.axes(), { x: 0, y: 0 });
assert.equal(controls.press('KeyW'), false); controls.press('KeyQ'); assert.equal(controls.axes().x, -1);
controls.setLayout('arrows'); assert.equal(controls.press('KeyD'), false); controls.press('ArrowRight'); assert.equal(controls.axes().x, 1);
const rescue = createGame(); rescue.phase = 'playing';
for (let i = 0; i < 24; i++) {
 const friend = rescue.friends[i % rescue.friends.length];
 assert(!blocked(friend.x, friend.y), 'Rescue positions avoid house walls');
 assert(routeTo({ x: 650, y: 770 }, friend).length, 'Rescue positions remain reachable');
 Object.assign(rescue.player, friend); rescue.cats.forEach(cat => { cat.x = 70; cat.y = 130; });
 step(rescue, { x: 0, y: 0 }, .001);
}
console.log('PASS: house collisions, complete village bounds, keyboard layouts and reachable rescue respawns.');
for (const obstacle of obstacles) for (const point of obstacle.points) assert(Math.hypot(point.x - obstacle.x, point.y - obstacle.y) <= obstacle.r + 1e-9, 'Collision bounds enclose every polygon vertex');
