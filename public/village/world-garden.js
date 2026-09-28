import * as THREE from 'three';
import { random, material, mesh, ball, branch } from './world-models.js';

export function meadowTexture() {
 const size = 256, data = new Uint8Array(size * size * 4), rng = random(92);
 for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
  const shade = Math.sin(x / size * Math.PI * 8 + Math.sin(y / size * Math.PI * 4)) * 5 + Math.cos(y / size * Math.PI * 6) * 4 + (rng() - .5) * 22;
  const i = (y * size + x) * 4;
  data[i] = 72 + shade; data[i + 1] = 123 + shade; data[i + 2] = 29 + shade * .6; data[i + 3] = 255;
 }
 const texture = new THREE.DataTexture(data, size, size); texture.colorSpace = THREE.SRGBColorSpace;
 texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(30, 30);
 texture.magFilter = THREE.LinearFilter; texture.minFilter = THREE.LinearMipmapLinearFilter; texture.generateMipmaps = true; texture.needsUpdate = true;
 return texture;
}
export function plantGarden(parent, places, trailPoints) {
 const rng = random(27), leaf = new THREE.SphereGeometry(1, 8, 6);
 const greens = ['#63962f', '#78a939', '#426f35', '#8ab647'].map(color => material(color));
 for (const place of places) for (let i = 0; i < 24; i++) {
  const angle = i * Math.PI / 12, radius = 4.3 + rng() * 1.1;
  const x = place.x + Math.cos(angle) * radius, z = place.z + Math.sin(angle) * radius;
  if (trailPoints.some(p => Math.hypot(x - p.x, z - p.z) < p.radius + .65) || Math.hypot(x - place.entrance[0], z - place.entrance[1]) < 2.8) continue;
  for (let j = 0; j < 5; j++) {
   const a = j * Math.PI * .4, length = .45 + rng() * .4;
   const blade = mesh(parent, leaf, greens[(i + j) % greens.length], [x + Math.sin(a) * .2, .25 + length * .35, z + Math.cos(a) * .2], [.18, length, .08]);
   blade.rotation.set(Math.cos(a) * .7, a, Math.sin(a) * .7);
  }
  if (i % 3 === 0) {
   branch(parent, [x, 0, z], [x, 1, z], .025, '#537a35', .02);
   for (let j = 0; j < 5; j++) ball(parent, i % 2 ? '#eed163' : '#e1bdcd', [x + Math.sin(j * 1.257) * .14, 1, z + Math.cos(j * 1.257) * .14], [.12, .065, .12]);
   ball(parent, '#d6a232', [x, 1.035, z], [.065, .065, .065]);
  }
 }
}
