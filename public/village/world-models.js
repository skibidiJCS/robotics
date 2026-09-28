import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { placeAngle } from './world-data.js';

export function random(seed = 7) {
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
}
const rng = random();
const materials = new Map();
const sphere = new THREE.SphereGeometry(1, 20, 14);
const box = new THREE.BoxGeometry(1, 1, 1);
export function material(color, options = {}) {
  if (Object.keys(options).length) return new THREE.MeshStandardMaterial({ color, roughness: .85, ...options });
  if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: .85 }));
  return materials.get(color);
}
export function mesh(parent, geometry, mat, position = [0, 0, 0], scale = [1, 1, 1]) {
  const object = new THREE.Mesh(geometry, typeof mat === 'string' ? material(mat) : mat);
  object.position.set(...position);
  object.scale.set(...scale);
  object.castShadow = true;
  object.receiveShadow = true;
  parent.add(object);
  return object;
}
export const ball = (parent, color, position, scale) => mesh(parent, sphere, color, position, scale);
export const block = (parent, color, position, scale) => mesh(parent, box, color, position, scale);
export function branch(parent, a, b, radius, color, top = radius * .65) {
  const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b), delta = end.clone().sub(start);
  const part = mesh(parent, new THREE.CylinderGeometry(top, radius, delta.length(), 9), color);
  part.position.copy(start.add(end).multiplyScalar(.5));
  part.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
  return part;
}
export function noiseTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const context = canvas.getContext('2d'), pixels = context.createImageData(128, 128);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const value = 120 + rng() * 130;
    pixels.data.set([value, value, value, 255], i);
  }
  context.putImageData(pixels, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2);
  return texture;
}
export function smurf(hero = false) {
  const group = new THREE.Group(), blue = '#338fc5', white = '#ede6d2';
  ball(group, blue, [0, 1.06, 0], [.35, .5, .24]);
  ball(group, white, [0, .65, 0], [.37, .24, .25]);
  const limbs = [];
  for (const side of [-1, 1]) {
    const leg = new THREE.Group(); leg.position.set(side * .19, .6, 0); group.add(leg);
    ball(leg, white, [0, -.19, 0], [.16, .32, .16]);
    ball(leg, white, [0, -.46, .16], [.2, .14, .32]); limbs.push(leg);
    const arm = new THREE.Group(); arm.position.set(side * .33, 1.3, 0); group.add(arm);
    ball(arm, blue, [side * .12, -.25, 0], [.13, .32, .13]);
    ball(arm, blue, [side * .17, -.49, .02], [.16, .17, .12]); limbs.push(arm);
    ball(group, blue, [side * .43, 1.72, 0], [.17, .22, .12]);
  }
  ball(group, blue, [0, 1.75, 0], [.43, .4, .35]);
  for (const side of [-1, 1]) {
    ball(group, '#f6f1dc', [side * .16, 1.82, .3], [.16, .19, .07]);
    ball(group, '#152c32', [side * .13, 1.8, .37], [.045, .078, .024]);
  }
  ball(group, blue, [0, 1.67, .43], [.2, .15, .22]);
  const smile = new THREE.TorusGeometry(.14, .014, 5, 14, Math.PI);
  const mouth = mesh(group, smile, '#234952', [0, 1.49, .305]); mouth.rotation.z = Math.PI;
  ball(group, white, [0, 2.1, -.02], [.46, .23, .36]);
  ball(group, white, [.08, 2.35, -.03], [.33, .37, .29]);
  ball(group, white, [.24, 2.49, .12], [.28, .19, .24]);
  if (hero) {
    ball(group, '#795538', [0, 1.1, -.3], [.27, .33, .14]);
    branch(group, [-.24, 1.43, -.17], [-.2, .86, .19], .035, '#9d7c4e');
  }
  group.userData.limbs = limbs;
  return group;
}
export function cat() {
  const group = new THREE.Group(), orange = '#b46932';
  ball(group, orange, [0, .85, -.25], [.53, .57, 1]);
  ball(group, '#cc8547', [0, 1.33, .62], [.64, .59, .5]);
  for (const side of [-1, 1]) {
    const ear = mesh(group, new THREE.ConeGeometry(.31, .66, 4), orange, [side * .42, 1.98, .55]); ear.rotation.z = side * -.2;
    ball(group, '#d9cc83', [side * .25, 1.42, 1.06], [.18, .16, .05]);
    ball(group, '#172921', [side * .25, 1.42, 1.11], [.035, .11, .03]);
    ball(group, '#dbb383', [side * .2, 1.17, 1.11], [.25, .19, .2]);
    for (const z of [-.83, .4]) ball(group, orange, [side * .4, .37, z], [.2, .4, .23]);
    for (let i = 0; i < 3; i++) branch(group, [side * .25, 1.14, 1.25], [side * .9, 1.22 - i * .1, 1.16], .012, '#463829');
  }
  ball(group, '#5a3833', [0, 1.24, 1.29], [.13, .08, .07]);
  const tail = new THREE.CatmullRomCurve3([[0, .9, -1], [.4, 1.5, -1.6], [.5, 2.3, -1.5], [.1, 2.5, -1.3]].map(p => new THREE.Vector3(...p)));
  mesh(group, new THREE.TubeGeometry(tail, 14, .13, 8, false), orange);
  return group;
}
export function mushroom(color = '#963e2f', size = 1) {
  const group = new THREE.Group();
  mesh(group, new THREE.CylinderGeometry(.19, .28, .95, 12), '#d9cbb0', [0, .47, 0]);
  const cap = mesh(group, new THREE.SphereGeometry(.78, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), color, [0, .9, 0], [1, .65, 1]);
  for (let i = 0; i < 6; i++) {
    const angle = i * 2.4, r = .25 + (i % 2) * .2;
    ball(cap, '#e9d9b9', [Math.cos(angle) * r, Math.sqrt(.78 ** 2 - r ** 2) + .005, Math.sin(angle) * r], [.11, .025, .1]);
  }
  group.scale.setScalar(size);
  return group;
}
function roofTexture(color) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 512;
  const context = canvas.getContext('2d');
  context.fillStyle = color; context.fillRect(0, 0, 512, 512);
  context.fillStyle = '#f6ecd3';
  for (const [x, z, radius] of [[2.8, 2.6, 1.5], [-3.3, 1.1, 1.15], [.3, -3, 1.05], [-1.3, -.9, .85], [3.7, -1.6, .85], [-.6, 4.1, .9]]) {
    context.beginPath();
    for (let i = 0; i <= 80; i++) {
      const angle = i / 80 * Math.PI * 2, r = radius * (1 + .07 * Math.sin(angle * 3) + .04 * Math.cos(angle * 5));
      const px = (x + Math.cos(angle) * r + 5) * 51.2, py = (5 - z - Math.sin(angle) * r) * 51.2;
      if (i === 0) context.moveTo(px, py); else context.lineTo(px, py);
    }
    context.closePath(); context.fill();
  }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
export function house(place, textures) {
  const group = new THREE.Group(); group.position.set(place.x, 0, place.z);
  group.rotation.y = placeAngle(place);
  const plaster = material('#f2dfb6', { bumpMap: textures.plaster, bumpScale: .09 });
  const roof = material('#ffffff', { map: roofTexture(place.color), bumpMap: textures.noise, bumpScale: .025, roughness: .65 });
  const wood = material('#5b321c', { bumpMap: textures.bark, bumpScale: .045 });
  const oak = material('#986235', { bumpMap: textures.bark, bumpScale: .035 });
  const wallProfile = [[0, .05], [2.9, .05], [3.05, .3], [2.92, 1.2], [2.68, 2.8], [2.58, 4.4], [0, 4.45]];
  mesh(group, new THREE.LatheGeometry(wallProfile.map(p => new THREE.Vector2(...p)), 48), plaster);
  const profile = [[0, -.12], [3.6, -.08], [4.45, .02], [4.75, .3], [4.53, .8], [3.55, 1.5], [2.6, 2.3], [1.85, 3.45], [.9, 4], [0, 4.1]];
  const curve = new THREE.CatmullRomCurve3(profile.map(([r, y]) => new THREE.Vector3(r, y, 0)));
  const roofGeometry = new THREE.LatheGeometry(curve.getPoints(64).map(p => new THREE.Vector2(p.x, p.y)), 80);
  const vertices = roofGeometry.attributes.position, uv = roofGeometry.attributes.uv;
  for (let i = 0; i < vertices.count; i++) {
    const x = vertices.getX(i), y = vertices.getY(i), z = vertices.getZ(i), a = Math.atan2(z, x);
    const ripple = 1 + .035 * Math.sin(a * 3) + .018 * Math.cos(a * 5);
    vertices.setXYZ(i, x * ripple - .035 * y * y, y + .12 * Math.sin(a * 3) * Math.hypot(x, z) / 4.75, z * ripple);
    uv.setXY(i, (x + 5) / 10, (z + 5) / 10);
  }
  roofGeometry.computeVertexNormals();
  mesh(group, roofGeometry, roof, [0, 4.05, 0]);
  const door = new THREE.Shape(); door.moveTo(-.8, 0); door.lineTo(.8, 0); door.lineTo(.8, 1.8); door.absarc(0, 1.8, .8, 0, Math.PI); door.closePath();
  mesh(group, new THREE.ExtrudeGeometry(door, { depth: .12, bevelEnabled: false }), oak, [0, .15, 2.91]);
  for (let i = -2; i <= 2; i++) {
    const x = i * .29, height = 1.8 + Math.sqrt(.8 ** 2 - x ** 2);
    block(group, wood, [x, .15 + height / 2, 3.045], [.024, height, .015]);
  }
  for (const y of [.65, 1.82]) block(group, wood, [0, y, 3.07], [1.48, .13, .07]);
  ball(group, '#453d2b', [.48, 1.25, 3.16], [.085, .085, .085]);
  for (const side of [-1, 1]) branch(group, [side * .94, .1, 3.04], [side * .94, 1.9, 3.04], .13, wood);
  mesh(group, new THREE.TorusGeometry(.94, .13, 8, 24, Math.PI), wood, [0, 1.9, 3.04]);
  for (let i = 0; i < 3; i++) block(group, '#8a8069', [0, .1 + i * .06, 3.3 + (2 - i) * .35], [2.1 - i * .12, .2, .9]);
  for (const side of [-1, 1]) {
    const window = new THREE.Group(); window.position.set(side * 1.9, 2.35, 2.13); window.rotation.y = side * .65; group.add(window);
    mesh(window, new THREE.CircleGeometry(.58, 24), material('#dfae55', { emissive: '#c88833', emissiveIntensity: .45 }), [0, 0, .04]);
    mesh(window, new THREE.TorusGeometry(.62, .12, 8, 24), wood);
    block(window, wood, [0, 0, .1], [.085, 1.15, .12]); block(window, wood, [0, 0, .1], [1.15, .085, .12]);
    block(window, wood, [0, -.78, .13], [1.4, .32, .42]);
    for (let i = 0; i < 5; i++) ball(window, '#496134', [-.53 + i * .26, -.56, .24], [.2, .18, .16]);
  }
  block(group, plaster, [0, 6.4, 2.45], [2.18, 1.9, 1.5]);
  const gable = new THREE.Shape(); gable.moveTo(-1.1, 7.25); gable.lineTo(1.1, 7.25); gable.lineTo(0, 8.5); gable.closePath();
  mesh(group, new THREE.ExtrudeGeometry(gable, { depth: 1.5, bevelEnabled: false }), plaster, [0, 0, 1.7]);
  for (const side of [-1, 1]) {
    const roofPanel = block(group, wood, [side * .71, 7.81, 2.48], [2.12, .16, 2.15]); roofPanel.rotation.z = side * -.83;
    branch(group, [side * 1.4, 7.02, 3.58], [0, 8.57, 3.58], .13, wood, .13);
    block(group, wood, [side * 1, 6.35, 3.24], [.16, 1.82, .18]);
  }
  const glass = material('#607b78', { emissive: '#bd9b56', emissiveIntensity: .18, roughness: .3 });
  block(group, wood, [0, 6.45, 3.26], [1.72, 1.42, .18]);
  block(group, glass, [0, 6.45, 3.36], [1.42, 1.16, .035]);
  block(group, oak, [0, 6.45, 3.4], [.1, 1.2, .09]); block(group, oak, [0, 6.45, 3.4], [1.45, .1, .09]);
  block(group, wood, [0, 5.64, 3.43], [2.45, .2, .6]);
  branch(group, [0, 7.2, 3.26], [0, 8.4, 3.26], .09, wood, .09);
  for (const x of [-2.17, -1.45]) branch(group, [x, .12, 5.6], [x, 5.7, 3.65], .075, oak, .075);
  for (let i = 0; i < 12; i++) {
    const t = (i + .5) / 12;
    branch(group, [-2.2, .12 + t * 5.58, 5.6 - t * 1.95], [-1.42, .12 + t * 5.58, 5.6 - t * 1.95], .065, oak, .065);
  }
  branch(group, [2.3, 5.4, -.9], [2.45, 8.7, -.9], .34, '#96927b', .27);
  for (let i = 0; i < 8; i++) mesh(group, new THREE.CylinderGeometry(.31, .33, .09, 12), '#bcb7a2', [2.32 + i * .018, 5.8 + i * .38, -.9]);
  mesh(group, new THREE.CylinderGeometry(.45, .45, .18, 12), '#797965', [2.45, 8.75, -.9]);
  for (let i = 0; i < 16; i++) {
    const a = i / 16 * Math.PI * 2;
    ball(group, '#727765', [Math.cos(a) * 2.9, .18, Math.sin(a) * 2.9], [.48, .28, .37]);
  }
  const lamp = material('#ffdaa0', { emissive: '#ffb54c', emissiveIntensity: 1 });
  block(group, '#3c392b', [1.3, 2.4, 2.9], [.3, .6, .3]);
  block(group, lamp, [1.3, 2.4, 3.07], [.2, .38, .02]);
  return group;
}
export function exhibit(id) {
  const group = new THREE.Group(), wood = '#66503a';
  if (id === 'robot') {
    block(group, wood, [0, .75, 0], [3.5, .25, 2]);
    for (const x of [-1.4, 1.4]) for (const z of [-.7, .7]) block(group, wood, [x, .35, z], [.18, .7, .18]);
    block(group, '#768c8b', [0, 1.28, 0], [1.7, .6, 1.1]);
    for (const x of [-.9, .9]) for (const z of [-.4, .4]) {
      const wheel = mesh(group, new THREE.CylinderGeometry(.32, .32, .24, 16), '#242b28', [x, .99, z]); wheel.rotation.z = Math.PI / 2;
    }
    block(group, '#bbc1b3', [0, 1.9, 0], [.75, .7, .65]);
    for (const x of [-.22, .22]) ball(group, '#163d44', [x, 2, .35], [.12, .12, .08]);
    branch(group, [.2, 1.5, 0], [1, 2.5, 0], .12, '#909c8b');
    branch(group, [1, 2.5, 0], [.5, 2.9, .2], .1, '#909c8b');
  } else if (id === 'journal' || id === 'about') {
    branch(group, [0, 0, 0], [0, 1.2, 0], .17, wood);
    const book = block(group, '#e0d0a9', [0, 1.3, 0], [2.3, .16, 1.5]); book.rotation.x = .24;
    branch(group, [0, 1.5, -.75], [0, 1.14, .75], .035, '#665235');
    for (const side of [-1, 1]) for (let i = 0; i < 5; i++) block(group, '#8c7f65', [side * .56, 1.43 - i * .05, -.48 + i * .21], [.76, .015, .025]);
  } else if (id === 'photos' || id === 'media') {
    for (const x of [-1.3, 1.3]) branch(group, [x, 0, 0], [x, 2.5, 0], .1, wood);
    block(group, wood, [0, 1.65, 0], [3, 1.9, .18]);
    block(group, '#c8b994', [0, 1.65, .11], [2.65, 1.55, .02]);
    if (id === 'media') {
      const triangle = new THREE.Shape(); triangle.moveTo(-.25, -.4); triangle.lineTo(.4, 0); triangle.lineTo(-.25, .4); triangle.closePath();
      mesh(group, new THREE.ShapeGeometry(triangle), '#665239', [0, 1.65, .14]);
    }
  } else {
    block(group, wood, [0, .65, 0], [3.5, .2, .7]);
    for (const x of [-1.3, 1.3]) block(group, wood, [x, .3, 0], [.2, .6, .7]);
    if (id === 'team') for (let i = 0; i < 2; i++) { const friend = smurf(); friend.scale.setScalar(.65); friend.position.set(i * 1.7 - .85, .76, 0); group.add(friend); }
  }
  return group;
}

export function mergeScenery(root) {
  root.updateWorldMatrix(true, true);
  const inverse = root.matrixWorld.clone().invert(), batches = new Map(), parents = new Set();
  function collect(object) {
    if (object !== root && object.userData.batchRoot) {
      for (let parent = object.parent; parent && parent !== root; parent = parent.parent) parents.add(parent);
      mergeScenery(object); return;
    }
    for (const child of object.children) collect(child);
    if (!object.isMesh || object === root || object.isInstancedMesh || object.isWater || Array.isArray(object.material) || object.material.transparent) return;
    const key = `${object.material.uuid}:${object.castShadow}:${object.receiveShadow}:${!!object.geometry.index}:${Object.keys(object.geometry.attributes).sort().join(',')}`;
    if (!batches.has(key)) batches.set(key, []);
    batches.get(key).push(object);
  }
  collect(root);
  for (const batch of batches.values()) {
    const objects = batch.filter(object => !parents.has(object));
    if (objects.length < 2) continue;
    const parts = objects.map(object => object.geometry.clone().applyMatrix4(inverse.clone().multiply(object.matrixWorld)));
    const geometry = mergeGeometries(parts);
    if (geometry) {
      const merged = mesh(root, geometry, objects[0].material);
      merged.castShadow = objects[0].castShadow; merged.receiveShadow = objects[0].receiveShadow;
      objects.forEach(object => object.removeFromParent());
    }
    parts.forEach(part => part.dispose());
  }
}
