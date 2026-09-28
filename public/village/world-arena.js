import * as THREE from 'three';
import { arenaFurniture, ARENA_RADIUS } from './arena-layout.js';
import { mesh, ball, block, branch, material } from './world-models.js';
import { bookshelf, createDisplay, table } from './world-furniture.js';

export function createArena(textures) {
 const group = new THREE.Group(), displays = [];
 const oak = material('#b58050', { bumpMap: textures.bark, bumpScale: .025 });
 const plaster = material('#ead9b3', { bumpMap: textures.plaster, bumpScale: .06 });
 const floor = mesh(group, new THREE.CircleGeometry(ARENA_RADIUS, 96), oak); floor.rotation.x = -Math.PI / 2;
 for (let z = -ARENA_RADIUS + .6; z < ARENA_RADIUS; z += 1.2) {
  const width = Math.sqrt(ARENA_RADIUS ** 2 - z ** 2) * 2;
  block(group, '#81583b', [0, .008, z], [width, .015, .025]);
  for (let x = -width / 2 + 2; x < width / 2 - 2; x += 7) block(group, '#91623f', [x, .009, z + .4], [.025, .015, .8]);
 }
 const wall = new THREE.CylinderGeometry(ARENA_RADIUS, ARENA_RADIUS, 11, 64, 1, true, Math.PI / 2, Math.PI);
 mesh(group, wall, material('#ead9b3', { bumpMap: textures.plaster, bumpScale: .06, side: THREE.DoubleSide }), [0, 5.5, 0]);
 mesh(group, new THREE.CylinderGeometry(ARENA_RADIUS, ARENA_RADIUS, 1, 64, 1, true, -Math.PI / 2, Math.PI), plaster, [0, .5, 0]);
 for (const y of [.3, 5.2, 10.5]) {
  const ring = mesh(group, new THREE.TorusGeometry(ARENA_RADIUS - .1, .14, 8, 64, Math.PI), '#765033', [0, y, 0]); ring.rotation.x = Math.PI / 2;
 }
 for (let i = 0; i <= 10; i++) {
  const angle = -Math.PI / 2 + i * Math.PI / 10, x = Math.sin(angle), z = -Math.cos(angle);
  branch(group, [x * (ARENA_RADIUS - .3), 0, z * (ARENA_RADIUS - .3)], [x * (ARENA_RADIUS - .3), 10.8, z * (ARENA_RADIUS - .3)], .17, '#805839', .17);
  branch(group, [x * (ARENA_RADIUS - .3), 10.8, z * (ARENA_RADIUS - .3)], [x * (ARENA_RADIUS - 5), 14, z * (ARENA_RADIUS - 5)], .15, '#805839', .15);
 }
 const canopy = mesh(group, new THREE.SphereGeometry(ARENA_RADIUS, 64, 12, 0, Math.PI, .95, .62), material('#e3c796', { side: THREE.DoubleSide }), [0, 11, 0], [1, .17, -1]);
 canopy.castShadow = false;
 for (const x of [-23, -9, 9, 23]) {
  const z = -Math.sqrt((ARENA_RADIUS - .3) ** 2 - x ** 2);
  const window = new THREE.Group(); window.position.set(x, 6.6, z); window.rotation.y = Math.atan2(-x, -z); group.add(window);
  mesh(window, new THREE.CircleGeometry(2.35, 40), material('#bfdbc5', { emissive: '#c3ddb1', emissiveIntensity: .45 }));
  mesh(window, new THREE.TorusGeometry(2.4, .15, 8, 40), '#94683a');
  block(window, '#92683d', [0, 0, .1], [4.5, .12, .15]); block(window, '#92683d', [0, 0, .1], [.12, 4.5, .15]);
 }
 const door = new THREE.Group(); door.position.set(0, 0, ARENA_RADIUS - .15); group.add(door);
 block(door, '#7b5637', [0, 2, 0], [3.4, 4, .18]);
 for (let i = -4; i <= 4; i++) block(door, '#bc8f53', [i * .34, 2, -.12], [.31, 3.8, .1]);
 for (const f of arenaFurniture) {
  const corner = new THREE.Group(); corner.position.set(f.x, 0, f.z); group.add(corner);
  const width = f.width || f.radius * 2, depth = f.depth || f.radius * 2;
  block(corner, f.color, [0, .025, 0], [width + 2.2, .035, depth + 2]);
  for (const side of [-1, 1]) block(corner, '#dfbc80', [side * (width / 2 + .9), .047, 0], [.08, .008, depth + 1.7]);
  if (f.kind === 'table') {
   mesh(corner, new THREE.CylinderGeometry(f.radius, f.radius, .35, 48), '#a57444', [0, 2.2, 0]);
   mesh(corner, new THREE.CylinderGeometry(.9, 1.5, 2, 16), '#785130', [0, 1, 0]);
   const cloth = mesh(corner, new THREE.CircleGeometry(2, 40), '#dfbc78', [0, 2.385, 0]); cloth.rotation.x = -Math.PI / 2;
   for (const x of [-1.7, 1.7]) { const plate = mesh(corner, new THREE.CylinderGeometry(.62, .58, .08, 24), '#e3dec8', [x, 2.42, 0]); plate.castShadow = false; }
   ball(corner, '#79977f', [0, 2.8, 0], [.55, .48, .55]);
   for (let i = 0; i < 5; i++) { branch(corner, [0, 3, 0], [Math.sin(i * 2.4) * .5, 3.7 + i % 2 * .3, Math.cos(i * 2.4) * .4], .025, '#55764b', .025); ball(corner, i % 2 ? '#eac659' : '#eadcb0', [Math.sin(i * 2.4) * .5, 3.7 + i % 2 * .3, Math.cos(i * 2.4) * .4], [.22, .16, .22]); }
  } else if (f.kind === 'library') {
   const shelf = new THREE.Group(); shelf.position.z = -1; corner.add(shelf); bookshelf(shelf, width, 4.6);
   const display = createDisplay('journal'); display.group.position.z = .4; corner.add(display.group); displays.push(display);
  } else if (f.kind === 'sofa') {
   block(corner, '#704a32', [0, .45, 0], [width, .8, depth]);
   block(corner, '#b36448', [0, 1.8, -1.15], [width, 2.2, .7]);
   for (const x of [-2.25, 0, 2.25]) block(corner, '#d29367', [x, 1.05, .15], [2.1, .5, 2.1]);
   for (const x of [-3.15, 3.15]) block(corner, '#9d553e', [x, 1.35, 0], [.7, 1.6, depth]);
  } else if (f.kind === 'crates') {
   for (let i = 0; i < 3; i++) {
    const x = i === 1 ? .85 : -.85, z = i === 2 ? -.7 : .6, y = i === 2 ? 2.2 : .8;
    block(corner, '#b78b54', [x, y, z], [1.7, 1.5, 1.6]);
    for (const dy of [-.57, .57]) block(corner, '#775435', [x, y + dy, z + .82], [1.7, .12, .06]);
   }
  } else if (f.kind === 'kitchen') {
   block(corner, '#709488', [0, 1.1, 0], [width, 2.2, depth]);
   block(corner, '#e4cfab', [0, 2.3, 0], [width, .25, depth]);
   for (const x of [-2.7, 0, 2.7]) { block(corner, '#476f62', [x, 1.1, depth / 2 + .025], [2.45, 1.85, .08]); ball(corner, '#e1bb69', [x + .7, 1.3, depth / 2 + .12], [.12, .12, .12]); }
   const pot = mesh(corner, new THREE.CylinderGeometry(.8, .6, .8, 24), '#b77d49', [1.8, 2.8, 0]);
   mesh(pot, new THREE.TorusGeometry(.8, .07, 8, 24), '#e6bc7c', [0, .42, 0]).rotation.x = Math.PI / 2;
   for (let i = 0; i < 3; i++) {
    const steam = ball(corner, material('#f2ecd4', { transparent: true, opacity: .22, depthWrite: false }), [1.8, 3.6 + i * .5, 0], [.2, .32, .2]);
    displays.push({ animate(time) { steam.position.y = 3.3 + ((time * .5 + i * .65) % 2); steam.scale.setScalar(.18 + (steam.position.y - 3.3) * .18); } });
   }
  } else {
   table(corner, width, depth, 1.8);
   const display = createDisplay('gears'); display.group.position.y = .3; corner.add(display.group); displays.push(display);
  }
 }
 const lamp = new THREE.PointLight('#ffe0ab', 150, 65, 2); lamp.position.set(0, 9, 0); group.add(lamp);
 return { group, animate(time) { displays.forEach(display => display.animate(time)); } };
}
