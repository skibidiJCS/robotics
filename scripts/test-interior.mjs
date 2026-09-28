import assert from 'node:assert/strict';
import { Texture } from 'three';
import { createInterior, ROOM_LIMIT } from '../public/village/world-interior.js';
import { places } from '../public/village/world-data.js';

const interior = createInterior({ bark: new Texture(), plaster: new Texture() });
const sections = ['People', 'School', 'Mentors'].map(title => ({ title, html: '<p>Content</p>' }));
interior.enter(places[1], sections);
const furnishing = interior.group.children[0], firstObjects = [...furnishing.children];
const start = interior.position.clone();
interior.point({ x: 0, z: -3 }); interior.move({ x: 0, y: 0 }, .05);
assert(interior.position.z < start.z, 'Clicking a floor destination moves the avatar');
interior.clear(); const stopped = interior.position.clone(); interior.move({ x: 0, y: 0 }, .05);
assert(interior.position.equals(stopped), 'Opening a menu cancels click movement');
for (let i = 0; i < 100; i++) interior.move({ x: 0, y: 1 }, .05);
assert(interior.position.length() < ROOM_LIMIT, 'The avatar stays within the room');
assert.equal(interior.nearby().index, -1, 'Walking to the door exposes the exit');
interior.enter(places[0], sections); interior.enter(places[1], sections);
assert.deepEqual(furnishing.children, firstObjects, 'Returning to a house reuses its furniture and GPU resources');
for (let i = 0; i < 100; i++) interior.move({ x: 0, y: -1 }, .05);
assert(interior.stations().every(s => Math.hypot(s.x - interior.position.x, s.z - interior.position.z) > 1.9), 'The avatar cannot walk through a station');
interior.enter(places.find(p => p.id === 'journal'), Array.from({length:8}, (_,i) => ({title:`Section ${i}`,html:'<p>Notes</p>'})));
const stations = interior.stations();
for (const station of stations) {
 assert(stations.every(other => other === station || Math.hypot(station.x-other.x,station.z-other.z) > 5.4), 'Eight alcoves remain separate');
 interior.position.set(station.x*.75,0,station.z*.75);
 assert.equal(interior.nearby().index,station.index,'Every alcove has a reachable interaction spot');
}
const rotations = () => { const result=[]; interior.group.traverse(o=>result.push(o.rotation.x,o.rotation.y,o.rotation.z)); return result; };
interior.animate(0); const still=rotations(); interior.animate(0); assert.deepEqual(rotations(),still,'Reduced motion stays still');
interior.animate(2); assert.notDeepEqual(rotations(),still,'Exhibits animate');
interior.leave(); assert.equal(interior.group.visible, false);
console.log('PASS: interior movement, menu stop, wall and furniture collisions, exit door and room reuse.');
