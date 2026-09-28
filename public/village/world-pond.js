import * as THREE from 'three';
import { Water } from '/vendor/Water.js';
import { material, mesh, ball, branch, random } from './world-models.js';

function waterNormals() {
 const data = new Uint8Array(128 * 128 * 4);
 for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
  const u = x / 128 * Math.PI * 2, v = y / 128 * Math.PI * 2, i = (y * 128 + x) * 4;
  const normal = new THREE.Vector3(.2 * Math.cos(u * 3 + v * 2) + .09 * Math.cos(u * 7 - v * 5), .2 * Math.cos(v * 4 - u) + .07 * Math.sin(v * 9 + u * 6), 1).normalize();
  data.set([(normal.x * .5 + .5) * 255, (normal.y * .5 + .5) * 255, (normal.z * .5 + .5) * 255, 255], i);
 }
 const texture = new THREE.DataTexture(data, 128, 128); texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.magFilter = texture.minFilter = THREE.LinearFilter; texture.needsUpdate = true; return texture;
}
export function createPond(scene, points, shape, sun, groundMap) {
 const water = new Water(new THREE.ShapeGeometry(shape), { textureWidth: 256, textureHeight: 256, waterNormals: waterNormals(), sunDirection: sun.position.clone().normalize(), sunColor: '#fff0d2', waterColor: '#184c43', distortionScale: .45, alpha: .86, fog: true });
 water.material.uniforms.size.value = 18; water.material.transparent = true;
 water.rotation.x = -Math.PI / 2; water.position.y = .065; scene.add(water);
 const center = points.reduce((p, v) => p.add(new THREE.Vector2(v.x, v.z)), new THREE.Vector2()).divideScalar(points.length);
 const bedPositions = [center.x, .015, center.y], bedColors = [], bedIndices = [];
 const deep = new THREE.Color('#193b32'), shallow = new THREE.Color('#8c9470'); bedColors.push(deep.r, deep.g, deep.b);
 points.forEach((p, i) => { bedPositions.push(p.x, .015, p.z); bedColors.push(shallow.r, shallow.g, shallow.b); bedIndices.push(0, i + 1, (i + 1) % points.length + 1); });
 const bed = new THREE.BufferGeometry(); bed.setAttribute('position', new THREE.Float32BufferAttribute(bedPositions, 3)); bed.setAttribute('color', new THREE.Float32BufferAttribute(bedColors, 3)); bed.setIndex(bedIndices); bed.computeVertexNormals();
 mesh(scene, bed, material('#ffffff', { vertexColors: true, side: THREE.DoubleSide, roughness: 1 }));
 const positions = [], colors = [], uvs = [], indices = [], rng = random(91);
 for (const p of points) {
  const dx = p.x - center.x, dz = p.z - center.y;
  positions.push(p.x, .08, p.z, center.x + dx * 1.2, .014, center.y + dz * 1.2);
  uvs.push(p.x / 240 + .5, .5 - p.z / 240, (center.x + dx * 1.2) / 240 + .5, .5 - (center.y + dz * 1.2) / 240);
  for (const color of ['#536347', '#b6d98a']) { const c = new THREE.Color(color); colors.push(c.r, c.g, c.b); }
 }
 for (let i = 0; i < points.length; i++) { const a = i * 2, b = (i + 1) % points.length * 2; indices.push(a, b, a + 1, b, b + 1, a + 1); }
 const bank = new THREE.BufferGeometry(); bank.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); bank.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3)); bank.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); bank.setIndex(indices); bank.computeVertexNormals();
 mesh(scene, bank, material('#ffffff', { map: groundMap, vertexColors: true, roughness: 1, side: THREE.DoubleSide }));
 for (let i = 0; i < 65; i++) {
  const p = points[Math.floor(rng() * points.length)], dx = p.x - center.x, dz = p.z - center.y;
  if (dx > 1.5 && dz > -.5) continue;
  const x = p.x + dx * (.03 + rng() * .13), z = p.z + dz * (.03 + rng() * .13), h = .45 + rng() * 1.05;
  branch(scene, [x, .02, z], [x + .07, h, z + .12], .022, '#6c8050', .012);
  if (i % 3 === 0) branch(scene, [x + .06, h * .76, z + .1], [x + .07, h, z + .12], .045, '#705938', .04);
 }
 const stone = material('#727866', { roughness: 1 });
 for (let i = 0; i < 11; i++) {
  const p = points[(i * 7 + 6) % points.length]; if (i % 3 === 0) continue;
  const rock = mesh(scene, new THREE.DodecahedronGeometry(1, 1), stone, [p.x, .11, p.z], [.22 + rng() * .45, .13 + rng() * .17, .22 + rng() * .35]); rock.rotation.set(rng(), rng(), rng());
 }
 for (const [x, z] of [[-9.4, -5.3], [-9.8, -5.7], [-7.4, -7]]) {
  const lily = mesh(scene, new THREE.CircleGeometry(.27, 24, .16, 5.9), '#64783d', [x, .086, z]); lily.rotation.x = -Math.PI / 2;
  ball(scene, '#dfd5b8', [x + .08, .12, z], [.07, .04, .07]);
 }
 return water;
}
