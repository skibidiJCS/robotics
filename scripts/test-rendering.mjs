import assert from 'node:assert/strict';
import { Box3, Group, Raycaster, Texture, Vector3 } from 'three';
import { block, mergeScenery } from '../public/village/world-models.js';
import { createArena } from '../public/village/world-arena.js';
import { createInterior } from '../public/village/world-interior.js';
import { places } from '../public/village/world-data.js';

const root = new Group(), moving = new Group();
root.position.set(10, 2, -6); root.rotation.y = .7; root.scale.set(2, 1, 3);
moving.position.set(2, 1, -3); moving.rotation.z = .3; moving.userData.batchRoot = true;
const parent = block(root, '#805333', [0, 2, 0]); parent.add(moving);
for (const parent of [root, moving]) for (const x of [-1, 1]) block(parent, '#805333', [x, 0, 0]);
const before = new Box3().setFromObject(root, true);
mergeScenery(root);
const after = new Box3().setFromObject(root, true);
assert(before.min.distanceTo(after.min) < 1e-5 && before.max.distanceTo(after.max) < 1e-5, 'Batching preserves world-space geometry under transformed parents');
assert.equal(root.children.length, 2, 'Static meshes share one batch');
assert.equal(moving.children.length, 1, 'Moving groups batch their own children');
moving.rotation.z += 1;
assert(!new Box3().setFromObject(root, true).equals(after), 'Batched children still follow animation');

const textures = { bark: new Texture(), plaster: new Texture() };
const arena = createArena(textures), interior = createInterior(textures);
const count = group => { let total = 0; group.traverse(object => { if (object.isMesh) total++; }); return total; };
assert(count(arena.group) < 100, 'Arena scenery stays within its draw-call budget');
interior.enter(places.find(place => place.id === 'journal'), Array.from({ length: 8 }, () => ({ title: 'Section' })));
assert(count(interior.group) < 160, 'Eight furnished alcoves stay within their draw-call budget');
interior.group.updateMatrixWorld(true);
for (const station of interior.stations()) {
 const ray = new Raycaster(new Vector3(station.x, 8, station.z), new Vector3(0, -1, 0));
 assert.equal(interior.pick(ray), station.index, 'Batched furniture keeps its station click target');
}
const cursors = [];
interior.group.traverse(object => { if (object.isMesh && object.userData.batchRoot) cursors.push(object); });
assert(cursors.length >= 2, 'Animated cursors remain in the scene');
interior.animate(0); const visible = cursors.map(object => object.visible);
interior.animate(1); assert.notDeepEqual(cursors.map(object => object.visible), visible, 'Cursors still blink after batching');
console.log('PASS: scenery draw-call budgets, transformed batches, animation and station picking.');
