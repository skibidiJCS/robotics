import * as THREE from 'three';
import { material, mesh, ball, block, branch, mergeScenery } from './world-models.js';

import { createDisplay } from './world-furniture.js';

export const ROOM_RADIUS = 14;
export const ROOM_LIMIT = ROOM_RADIUS - 1;

export function createInterior(textures) {
 const group = new THREE.Group(), furnishing = new THREE.Group(); group.add(furnishing); group.visible = false;
 const oak = material('#94653f', { bumpMap: textures.bark, bumpScale: .04 });
 const plaster = material('#e1cfaa', { bumpMap: textures.plaster, bumpScale: .065, side: THREE.BackSide });
 const floor = mesh(group, new THREE.CircleGeometry(ROOM_RADIUS, 64), oak); floor.rotation.x = -Math.PI / 2;
 for (let z = -13.5; z <= 13.5; z += .65) {
  const width = Math.sqrt(ROOM_RADIUS ** 2 - z ** 2) * 2;
  block(group, '#795134', [0, .012, z], [width, .014, .027]);
 }
 mesh(group, new THREE.CylinderGeometry(ROOM_RADIUS, ROOM_RADIUS, 9, 64, 1, true), plaster, [0, 4.5, 0]);
 mesh(group, new THREE.SphereGeometry(ROOM_RADIUS, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2), plaster, [0, 9, 0], [1, .35, 1]);
 for (const y of [.18, 4.5, 8.9]) {
  const beam = mesh(group, new THREE.TorusGeometry(ROOM_RADIUS - .08, .11, 8, 64), '#705030', [0, y, 0]); beam.rotation.x = Math.PI / 2;
 }
 for (let i = 0; i < 10; i++) {
  const a = i * Math.PI / 5, x = Math.sin(a) * (ROOM_RADIUS - .2), z = Math.cos(a) * (ROOM_RADIUS - .2);
  branch(group, [x, 0, z], [x, 9, z], .1, '#735136', .1);
 }
 for (const side of [-1, 1]) {
  const window = new THREE.Group(); window.position.set(side * (ROOM_RADIUS - .2), 5.6, 0); window.rotation.y = -side * Math.PI / 2; group.add(window);
  mesh(window, new THREE.CircleGeometry(1.8, 32), material('#b3d4b8', { emissive: '#9cbf9c', emissiveIntensity: .6 }));
  mesh(window, new THREE.TorusGeometry(1.85, .12, 8, 32), '#765131');
  block(window, '#87613c', [0, 0, .08], [.09, 3.5, .12]); block(window, '#87613c', [0, 0, .08], [3.5, .09, .12]);
 }
 const door = new THREE.Group(); door.position.z = ROOM_RADIUS - .15; door.rotation.y = Math.PI; group.add(door);
 block(door, '#60422e', [0, 1.6, 0], [2.25, 3.2, .15]);
 for (let i = -3; i <= 3; i++) block(door, '#ad7e49', [i * .28, 1.6, .1], [.25, 3, .08]);
 ball(door, '#cbae68', [.7, 1.5, .2], [.09, .09, .09]);
 branch(group, [0, 9.2, 0], [0, 7.7, 0], .035, '#56432f', .035);
 ball(group, material('#ffe3a6', { emissive: '#ffd499', emissiveIntensity: 1 }), [0, 7.6, 0], [.48, .32, .48]);
 const lamp = new THREE.PointLight('#ffdfac', 120, 32, 2); lamp.position.set(0, 7.2, 0); group.add(lamp);
 const rug = mesh(group, new THREE.CircleGeometry(4.2, 64), '#527b70', [0, .025, .5]); rug.rotation.x = -Math.PI / 2;
 let stations = [], displays = [], target = null;
 const rooms = new Map();
 const position = new THREE.Vector3(0, 0, 7);
 mergeScenery(group);
 function enter(place, sections) {
  furnishing.clear();
  const cached = rooms.get(place.id);
  if (cached) { stations = cached.stations; displays = cached.displays; furnishing.add(...cached.objects); }
  else {
   displays = [];
   const kinds = {
    journal: ['library', 'blueprint', 'robot', 'gallery', 'screen', 'projector', 'gears', 'screen'],
    robot: ['robot', 'blueprint', 'gears'], photos: ['gallery', 'gallery', 'robot'],
    team: ['gallery', 'library', 'journal'], about: ['library', 'gallery', 'journal'], media: ['projector', 'screen'],
   };
   stations = sections.map((section, i) => {
    const arc = Math.min(2.05, .5 + sections.length * .22);
    const angle = sections.length === 1 ? 0 : -arc + i * arc * 2 / (sections.length - 1);
    const x = Math.sin(angle) * 10.6, z = -Math.cos(angle) * 10.6;
    const alcove = new THREE.Group(); alcove.position.set(x, 0, z); alcove.rotation.y = Math.atan2(-x, -z); alcove.userData.station = i; alcove.userData.batchRoot = true; furnishing.add(alcove);
    const color = ['#577f76', '#527888', '#ae7653', '#7f7893'][i % 4];
    block(alcove, color, [0, .035, .4], [4.6, .045, 4.2]);
    for (const side of [-1, 1]) block(alcove, '#d8b779', [side * 2.18, .065, .4], [.06, .01, 4]);
    block(alcove, '#a98150', [0, .068, 2.35], [4.4, .01, .06]);
    for (const side of [-1, 1]) {
     branch(alcove, [side * 2.45, 0, -1.6], [side * 2.45, 5.2, -1.6], .12, '#785333', .12);
     branch(alcove, [side * 2.45, 4.3, -1.6], [side * 1.55, 5.2, -1.6], .1, '#785333', .1);
    }
    block(alcove, '#785333', [0, 5.2, -1.6], [5.2, .22, .22]);
    block(alcove, color, [0, 4.1, -1.65], [1.1, 1.5, .04]);
    mesh(alcove, new THREE.TorusGeometry(.24, .035, 8, 20), '#e3cb92', [0, 4.18, -1.6]);
    const display = createDisplay(kinds[place.id][i] || 'journal', i); displays.push(display); alcove.add(display.group);
    const marker = mesh(furnishing, new THREE.RingGeometry(.32, .4, 32), material('#e4c788', { side: THREE.DoubleSide }), [x * .75, .07, z * .75]); marker.rotation.x = -Math.PI / 2;
    return { ...section, index: i, x, z };
   });
   mergeScenery(furnishing);
   rooms.set(place.id, { stations, displays, objects: [...furnishing.children] });
  }
  position.set(0, 0, 7); target = null; group.visible = true;
 }
 function move(axes, dt) {
  let x = axes.x, z = axes.y;
  if (Math.hypot(x, z) > .03) target = null;
  else if (target) { x = target.x - position.x; z = target.z - position.z; if (Math.hypot(x, z) < .1) { target = null; x = z = 0; } }
  const length = Math.hypot(x, z); if (!length) return false;
  const distance = Math.min(5.5 * dt, target ? length : Infinity), nx = position.x + x / length * distance, nz = position.z + z / length * distance;
  const clear = (x, z) => Math.hypot(x, z) < ROOM_LIMIT && stations.every(s => Math.hypot(x - s.x, z - s.z) > 1.9);
  const previous = position.clone();
  if (clear(nx, position.z)) position.x = nx;
  if (clear(position.x, nz)) position.z = nz;
  return position.distanceToSquared(previous) > .00001;
 }
 return {
  group, position, enter, move, animate(time) { displays.forEach(display => display.animate(time)); }, stations: () => stations,
  leave() { group.visible = false; target = null; },
  clear() { target = null; },
  pick(ray) { let object = ray.intersectObjects(furnishing.children, true)[0]?.object; while (object && object !== furnishing) { if (Number.isInteger(object.userData.station)) return object.userData.station; object = object.parent; } },
  point(p) { target = new THREE.Vector3(p.x, 0, p.z); if (target.length() > ROOM_LIMIT - .1) target.setLength(ROOM_LIMIT - .1); },
  nearby() {
   if (Math.hypot(position.x, position.z - (ROOM_LIMIT - .2)) < 1.2) return { index: -1 };
   return stations.find(s => Math.hypot(position.x - s.x * .75, position.z - s.z * .75) < 1.7);
  },
 };
}
