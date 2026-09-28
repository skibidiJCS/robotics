import * as THREE from 'three';
import { mesh, ball, block, branch, material, smurf } from './world-models.js';

const wood = '#805333', brass = '#c59951', paper = '#f5e3b9';
export function bookshelf(parent, width = 3, height = 3.5) {
 block(parent, '#62422e', [0, height / 2, -.22], [width, height, .25]);
 for (const x of [-width / 2, width / 2]) block(parent, wood, [x, height / 2, 0], [.16, height, .65]);
 for (let row = 0; row < 3; row++) {
  const y = .3 + row * height / 3;
  block(parent, wood, [0, y, 0], [width, .14, .7]);
  for (let i = 0; i < Math.floor(width / .3) - 1; i++) {
   const h = .55 + (i * 7 % 5) * .06, x = -width / 2 + .3 + i * .29;
   block(parent, ['#577f76', '#b56849', '#bca269', '#5e7790'][(i + row) % 4], [x, y + h / 2 + .08, .05], [.21, h, .39]);
   block(parent, brass, [x, y + .22, .252], [.14, .025, .01]);
  }
 }
}
export function table(parent, width = 3, depth = 1.6, height = 1.5) {
 block(parent, wood, [0, height, 0], [width, .18, depth]);
 for (const x of [-width / 2 + .2, width / 2 - .2]) for (const z of [-depth / 2 + .18, depth / 2 - .18]) block(parent, '#64452f', [x, height / 2, z], [.2, height, .2]);
}
export function createDisplay(kind, index = 0) {
 const group = new THREE.Group(), movers = [];
 const spin = (object, axis, speed, base = 0, swing = 0) => movers.push(time => { object.rotation[axis] = base + (swing ? Math.sin(time * speed) * swing : time * speed); });
 if (kind === 'library') {
  bookshelf(group, 3.3, 3.8);
  const book = new THREE.Group(); book.position.set(0, 1.7, .85); group.add(book);
  block(book, '#bd714c', [0, 0, 0], [1.4, .16, .9]);
  const page = block(book, paper, [.32, .12, 0], [.62, .025, .85]); spin(page, 'z', .8, .2, .55);
 } else if (kind === 'robot') {
  table(group);
  const robot = new THREE.Group(); robot.position.y = 1.6; group.add(robot);
  block(robot, '#537f8e', [0, .36, 0], [1.35, .55, .85]);
  for (const x of [-.74, .74]) for (const z of [-.38, .38]) {
   const wheel = mesh(robot, new THREE.CylinderGeometry(.28, .28, .18, 16), '#343e3d', [x, .2, z]); wheel.rotation.z = Math.PI / 2;
  }
  block(robot, '#dbc38c', [0, .9, 0], [.65, .6, .5]);
  for (const x of [-.2, .2]) ball(robot, '#233c40', [x, 1, .27], [.08, .08, .06]);
  const arm = new THREE.Group(); arm.position.set(.58, .65, 0); robot.add(arm);
  branch(arm, [0, 0, 0], [.4, .8, 0], .1, brass, .1);
  branch(arm, [.4, .8, 0], [.1, 1.1, .2], .09, brass, .08);
  spin(arm, 'z', 1.1, -.1, .35);
 } else if (kind === 'screen' || kind === 'projector') {
  table(group, 2.8);
  if (kind === 'screen') {
   block(group, '#374b49', [0, 2.3, -.1], [2.35, 1.45, .2]);
   block(group, material('#173e42', { emissive: '#245254', emissiveIntensity: .45 }), [0, 2.3, .015], [2.1, 1.2, .04]);
   for (let i = 0; i < 6; i++) block(group, i % 2 ? '#c5d987' : '#8cc9c7', [-.23 + (i % 2) * .15, 2.68 - i * .16, .045], [1.1 - (i % 3) * .2, .035, .01]);
   const cursor = block(group, '#eacb74', [.62, 1.88, .05], [.08, .08, .02]); movers.push(time => { cursor.visible = Math.sin(time * 4) > -.3; });
   block(group, '#b9a57a', [0, 1.63, .5], [1.7, .06, .4]);
  } else {
   block(group, '#466c73', [0, 1.99, 0], [1.8, .65, .8]);
   for (const x of [-.54, .54]) {
    const reel = mesh(group, new THREE.CylinderGeometry(.45, .45, .12, 20), brass, [x, 2.6, 0]); reel.rotation.x = Math.PI / 2;
    const spokes = new THREE.Group(); spokes.position.copy(reel.position); spokes.position.z = .08; group.add(spokes);
    for (let i = 0; i < 3; i++) { const bar = block(spokes, '#514b3b', [0, 0, 0], [.06, .77, .03]); bar.rotation.z = i * Math.PI / 3; }
    spin(spokes, 'z', .7);
   }
   const lens = mesh(group, new THREE.CylinderGeometry(.22, .28, .45, 20), '#d9bf82', [0, 2, .55]); lens.rotation.x = Math.PI / 2;
  }
 } else if (kind === 'gears') {
  table(group);
  for (let i = 0; i < 3; i++) {
   const gear = new THREE.Group(); gear.position.set((i - 1) * .85, 2.12 + (i % 2) * .25, 0); group.add(gear);
   mesh(gear, new THREE.TorusGeometry(.37, .07, 8, 24), brass);
   for (let j = 0; j < 10; j++) { const tooth = block(gear, brass, [Math.cos(j * Math.PI / 5) * .43, Math.sin(j * Math.PI / 5) * .43, 0], [.18, .16, .14]); tooth.rotation.z = j * Math.PI / 5; }
   block(gear, wood, [0, 0, 0], [.65, .08, .12]); spin(gear, 'z', i % 2 ? -.6 : .6);
  }
 } else if (kind === 'gallery' || kind === 'blueprint') {
  for (const x of [-1, 1]) branch(group, [x, 0, .4], [x * .65, 3.3, -.1], .085, wood, .085);
  block(group, wood, [0, 2.25, 0], [3, 2.1, .18]);
  block(group, kind === 'blueprint' ? '#366776' : '#c4d6ad', [0, 2.25, .11], [2.74, 1.85, .05]);
  if (kind === 'blueprint') {
   for (let i = -3; i <= 3; i++) block(group, '#83ada9', [i * .34, 2.25, .15], [.012, 1.75, .01]);
   for (let i = 0; i < 5; i++) block(group, '#83ada9', [0, 1.58 + i * .34, .15], [2.64, .012, .01]);
   const sketch = block(group, '#e4dbc0', [0, 2.2, .17], [1.2, .72, .04]);
   for (const x of [-.5, .5]) mesh(sketch, new THREE.TorusGeometry(.2, .035, 8, 20), '#416371', [x / 1.2, -.38 / .72, 1]);
  } else {
   const miniature = smurf(); miniature.scale.setScalar(.5); miniature.position.set(0, 1.35, .28); group.add(miniature); spin(miniature, 'y', .45, 0, .22);
  }
 } else {
  table(group, 2.7);
  const book = new THREE.Group(); book.position.set(0, 1.64, .05); book.rotation.x = .2; group.add(book);
  block(book, '#a7593c', [0, 0, 0], [1.9, .09, 1.15]);
  for (const side of [-1, 1]) {
   block(book, paper, [side * .46, .09, 0], [.86, .09, 1.05]);
   for (let i = 0; i < 5; i++) block(book, '#8b7b58', [side * .46, .145, -.35 + i * .16], [.6, .006, .014]);
  }
  const page = new THREE.Group(); page.position.y = .17; book.add(page);
  block(page, '#f8eacd', [.44, 0, 0], [.87, .018, 1.04]); spin(page, 'z', .65, 1.3, 1.2);
  branch(group, [1, 1.6, -.45], [1, 2.35, -.45], .04, brass, .04);
  ball(group, '#f1d28a', [1, 2.35, -.45], [.32, .18, .32]);
 }
 return { group, animate(time) { movers.forEach(update => update(time + index * .8)); } };
}
