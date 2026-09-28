import * as THREE from 'three';
import { mergeGeometries } from '/vendor/BufferGeometryUtils.js';
import { HDRLoader } from '/vendor/HDRLoader.js';
import { obstacles, routeTo } from './roam-state.js';
import { places, toWorld, toGame } from './world-data.js';
import { random, material, mesh, ball, branch, noiseTexture, smurf, cat, mushroom, house, exhibit } from './world-models.js';
import { createPond } from './world-pond.js';
import { arena } from './arena-layout.js';
import { createArena } from './world-arena.js';
import { meadowTexture, plantGarden } from './world-garden.js';
import { createInterior, ROOM_LIMIT } from './world-interior.js';

function mergeScenery(scene) {
  scene.updateMatrixWorld(true);
  const batches = new Map();
  scene.traverse(object => {
    if (!object.isMesh || object.isInstancedMesh || object.isWater) return;
    const key = `${object.material.uuid}:${object.castShadow}:${!!object.geometry.index}:${Object.keys(object.geometry.attributes).sort().join(',')}`;
    if (!batches.has(key)) batches.set(key, []);
    batches.get(key).push(object);
  });
  for (const objects of batches.values()) {
    if (objects.length < 2) continue;
    const parts = objects.map(object => object.geometry.clone().applyMatrix4(object.matrixWorld));
    const geometry = mergeGeometries(parts);
    if (geometry) {
      const merged = mesh(scene, geometry, objects[0].material); merged.castShadow = objects[0].castShadow;
      objects.forEach(object => object.removeFromParent());
    }
    parts.forEach(part => part.dispose());
  }
}

export async function createWorld(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#b4c6c4');
  scene.fog = new THREE.FogExp2('#b4c6c4', .005);
  const camera = new THREE.PerspectiveCamera(46, 1, .1, 450);
  const ambient = new THREE.HemisphereLight('#e1edff', '#72914c', 1); scene.add(ambient);
  const sun = new THREE.DirectionalLight('#fff0d2', 3.5); sun.position.set(-32, 55, 20); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -55, right: 55, top: 50, bottom: -50, near: 1, far: 150 });
  sun.shadow.normalBias = .045; sun.shadow.bias = -.0002; scene.add(sun);
  const loader = new THREE.TextureLoader();
  const environment = await new HDRLoader().loadAsync('/assets/textures/forest-light.hdr');
  environment.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = environment; scene.environmentIntensity = .85;
  scene.background = environment; scene.backgroundBlurriness = .3; scene.backgroundIntensity = .75;
  const [groundMap, groundNormal, bark, foliage, foliageAlpha, plaster] = await Promise.all(['forest-ground.jpg', 'forest-normal.jpg', 'bark.jpg', 'leaves.jpg', 'leaves-alpha.png', 'plaster.jpg'].map(file => loader.loadAsync(`/assets/textures/${file}`)));
  for (const texture of [groundMap, groundNormal, bark].filter(Boolean)) { texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); }
  if (groundMap) { groundMap.colorSpace = THREE.SRGBColorSpace; groundMap.repeat.set(22, 22); }
  if (groundNormal) groundNormal.repeat.set(22, 22);
  if (bark) { bark.colorSpace = THREE.SRGBColorSpace; bark.repeat.set(2, 3); }
  foliage.colorSpace = plaster.colorSpace = THREE.SRGBColorSpace;
  plaster.wrapS = plaster.wrapT = THREE.RepeatWrapping; plaster.repeat.set(3, 1);
  const textures = { noise: noiseTexture(), bark, plaster };
  const earth = material('#e0edbf', { map: meadowTexture(), normalMap: groundNormal, normalScale: new THREE.Vector2(.18, .18), roughness: 1 });
  const ground = mesh(scene, new THREE.PlaneGeometry(240, 240), earth); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; ground.castShadow = false;
  const rng = random(32);
  const pathMat = material('#c2ad80', { map: plaster, bumpMap: plaster, bumpScale: .09 });
  const trailPoints = [];
  function path(points, width = 2.2) {
    const curve = new THREE.CatmullRomCurve3(points.map(([x, z]) => new THREE.Vector3(x, .035, z))), positions = [], indices = [], uvs = [];
    for (let i = 0; i <= 80; i++) {
      const p = curve.getPoint(i / 80), d = curve.getTangent(i / 80), w = width * (.95 + .08 * Math.sin(i));
      positions.push(p.x - d.z * w / 2, p.y, p.z + d.x * w / 2, p.x + d.z * w / 2, p.y, p.z - d.x * w / 2);
      uvs.push((p.x - d.z * w / 2) * .13, (p.z + d.x * w / 2) * .13, (p.x + d.z * w / 2) * .13, (p.z - d.x * w / 2) * .13);
      if (i % 4 === 0) trailPoints.push({ x: p.x, z: p.z, radius: width / 2 + .5 });
      if (i < 80) { const n = i * 2; indices.push(n, n + 2, n + 1, n + 1, n + 2, n + 3); }
    }
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); geometry.setIndex(indices); geometry.computeVertexNormals();
    const trail = mesh(scene, geometry, pathMat); trail.castShadow = false;
  }
  const square = toGame(0, 11.4);
  for (const place of places) {
    const route = routeTo(square, toGame(...place.entrance));
    path([[0, 11.4], ...route.map(p => { const v = toWorld(p.x, p.y); return [v.x, v.z]; })], 2.4);
  }
  for (const place of places) {
    const home = house(place, textures), prop = exhibit(place.id); prop.position.set(-4.1, 0, 3.5); home.add(prop); scene.add(home);
    const [x, z] = place.entrance; path([[x, z], [place.x, place.z]], 2.5);
    for (let i = 0; i < 6; i++) { const decor = mushroom(i % 2 ? '#8e432e' : '#b58953', .3 + rng() * .4); decor.position.set(place.x + (rng() - .5) * 11, 0, place.z + (rng() - .5) * 10); scene.add(decor); }
  }
  let water;
  for (const obstacle of obstacles) {
    if (obstacle.kind === 'house') continue;
    const points = obstacle.points.map(p => toWorld(p.x, p.y)), shape = new THREE.Shape();
    points.forEach((p, i) => i ? shape.lineTo(p.x, -p.z) : shape.moveTo(p.x, -p.z)); shape.closePath();
    if (obstacle.kind === 'pond') {
      water = createPond(scene, points, shape, sun, groundMap);
    } else if (obstacle.kind === 'rocks') {
      const stone = material('#828576', { map: plaster, bumpMap: plaster, bumpScale: .25 });
      const base = mesh(scene, new THREE.ExtrudeGeometry(shape, { depth: .5, bevelEnabled: false }), stone, [0, .04, 0]); base.rotation.x = -Math.PI / 2;
      const p = toWorld(obstacle.x, obstacle.y);
      for (let i = 0; i < 6; i++) { const a = i * 2.4; const rock = mesh(scene, new THREE.DodecahedronGeometry(1, 0), stone, [p.x + Math.cos(a) * 1.4, .55, p.z + Math.sin(a) * 1.2], [1.2, .8 + rng(), 1]); rock.rotation.set(rng(), rng(), rng()); }
    } else {
      const p = toWorld(obstacle.x, obstacle.y);
      branch(scene, [p.x - 2.6, .48, p.z + .9], [p.x + 2.6, .48, p.z - .9], .58, material('#806345', { map: bark }), .5);
      branch(scene, [p.x, .5, p.z], [p.x + .3, 1.5, p.z - 1.3], .18, '#6f583f');
    }
  }
  const trunks = new THREE.Group(); scene.add(trunks);
  const leafGeometry = new THREE.PlaneGeometry(3, 3), leafMat = material('#bdc789', { map: foliage, alphaMap: foliageAlpha, alphaTest: .45, side: THREE.DoubleSide, roughness: 1 });
  const leaves = new THREE.InstancedMesh(leafGeometry, leafMat, 22000), dummy = new THREE.Object3D(); let leafCount = 0;
  const barkMat = material('#766b51', { map: bark, bumpMap: bark, bumpScale: .12 });
  for (let i = 0; i < 100; i++) {
    const angle = rng() * Math.PI * 2, radius = 45 + rng() * 35, x = Math.cos(angle) * radius, z = Math.sin(angle) * radius;
    if (z > 25 && Math.abs(x) < 45) continue;
    const height = 10 + rng() * 14;
    branch(trunks, [x, 0, z], [x + 1, height, z], .5 + rng() * .7, barkMat, .18);
    for (let j = 0; j < 5; j++) {
      const a = rng() * Math.PI * 2, spread = 3 + rng() * 4, y = height * (.58 + rng() * .35), cx = x + Math.cos(a) * spread, cz = z + Math.sin(a) * spread;
      branch(trunks, [x, y - 3, z], [cx, y, cz], .2, barkMat, .04);
      for (let k = 0; k < 32; k++) {
        dummy.position.set(cx + (rng() - .5) * 6, y + (rng() - .5) * 3, cz + (rng() - .5) * 6);
        dummy.rotation.set(rng() * 3, rng() * 6, rng() * 3); dummy.scale.setScalar(.6 + rng() * .65); dummy.updateMatrix();
        leaves.setMatrixAt(leafCount, dummy.matrix); leaves.setColorAt(leafCount++, new THREE.Color().setHSL(.2 + rng() * .06, .13 + rng() * .2, .55 + rng() * .35));
      }
    }
  }
  plantGarden(scene, places, trailPoints);
  leaves.count = leafCount; leaves.castShadow = true; leaves.receiveShadow = true; scene.add(leaves);
  const blades = [];
  for (let i = 0; i < 5; i++) {
    const angle = i * 2.4, x = Math.sin(angle) * .14, z = Math.cos(angle) * .14, h = .3 + rng() * .3;
    const dx = Math.cos(angle) * .055, dz = Math.sin(angle) * .055;
    blades.push(x-dx,0,z-dz, x+dx,0,z+dz, x+dx*.5,h*.55,z+dz*.5, x-dx,0,z-dz, x+dx*.5,h*.55,z+dz*.5, x+Math.sin(angle)*.18,h,z+Math.cos(angle)*.18);
  }
  const blade = new THREE.BufferGeometry(); blade.setAttribute('position', new THREE.Float32BufferAttribute(blades, 3)); blade.computeVertexNormals();
  const grass = new THREE.InstancedMesh(blade, material('#9fbe60', { side: THREE.DoubleSide }), 24000);
  for (let i = 0; i < grass.count; i++) {
    const x = (rng() - .5) * 82, z = (rng() - .5) * 66;
    const onPath = trailPoints.some(p => Math.hypot(x - p.x, z - p.z) < p.radius);
    const nearPond = Math.hypot(x + 8.1, z + 5.4) < 5.5;
    const inHouse = places.some(p => Math.hypot(x - p.x, z - p.z) < 3.4);
    dummy.position.set(x, onPath || nearPond || inHouse ? -2 : 0, z); dummy.rotation.set(0, rng() * 6.28, (rng() - .5) * .4); dummy.scale.setScalar(.45 + rng() * .5); dummy.updateMatrix();
    grass.setMatrixAt(i, dummy.matrix); grass.setColorAt(i, new THREE.Color(['#4d831b', '#628f21', '#739f26'][i % 3]));
  }
  grass.receiveShadow = true; scene.add(grass);
  mergeScenery(scene);
  const village = new THREE.Group();
  for (const object of [...scene.children]) if (!object.isLight) village.add(object);
  scene.add(village);
  const interior = createInterior(textures), chaseHouse = createArena(textures); scene.add(interior.group, chaseHouse.group);
  const player = smurf(true); scene.add(player);
  const ring = mesh(scene, new THREE.RingGeometry(.66, .75, 40), material('#dfc68c', { side: THREE.DoubleSide, transparent: true, opacity: .8 }), [0, .055, 0]); ring.rotation.x = -Math.PI / 2; ring.castShadow = false;
  const shield = mesh(player, new THREE.SphereGeometry(1.2, 20, 12), material('#e7c265', { transparent: true, opacity: .2, wireframe: true }), [0, 1.1, 0]);
  const friends = Array.from({ length: 3 }, () => { const object = smurf(); scene.add(object); return object; });
  const cats = Array.from({ length: 2 }, () => { const object = cat(); scene.add(object); return object; });
  const powers = arena.powerSpots.map((_, i) => { const object = mushroom([1, 5, 9].includes(i) ? '#c39c43' : '#348faf', .8); scene.add(object); return object; });
  const hazards = Array.from({ length: 3 }, () => {
    const group = new THREE.Group();
    const warning = mesh(group, new THREE.RingGeometry(2.35, 2.55, 40), material('#d76a30', { side: THREE.DoubleSide })); warning.rotation.x = -Math.PI / 2;
    const acorn = ball(group, '#a17b45', [0, 6, 0], [.5, .7, .5]); ball(acorn, '#554c30', [0, .6, 0], [1.1, .3, 1.1]);
    group.userData.acorn = acorn; scene.add(group); return group;
  });
  let yaw = 0, distance = 48, follow = false, focused = null, mapping = false, outsideYaw = 0, movingInside = false;
  const target = new THREE.Vector3(0, 0, -2), eye = new THREE.Vector3();
  const ray = new THREE.Raycaster(), floor = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  function resize() { const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  function pose(object, p, time, moving = false) {
    const point = toWorld(p.x, p.y); object.position.set(point.x, 0, point.z);
    if (p.vx) object.rotation.y = Math.atan2(p.dx || (p.facing || 1), p.dy || 0);
    if (object.userData.limbs) object.userData.limbs.forEach((limb, i) => { limb.rotation.x = moving ? Math.sin((p.walk || time * 80) * .055 + (i < 2 ? 0 : Math.PI)) * .55 : 0; });
  }
  function render(state, dt, time, game, reduced) {
    const inside = !!focused && !mapping, chasing = game && !mapping, indoors = inside || chasing;
    water.material.uniforms.time.value = reduced ? 0 : time * .25;
    village.visible = !indoors; interior.group.visible = inside; chaseHouse.group.visible = chasing;
    if (inside) interior.animate(reduced ? 0 : time);
    if (chasing) chaseHouse.animate(reduced ? 0 : time);
    scene.background = indoors ? new THREE.Color('#cbb895') : environment;
    scene.fog.density = indoors ? 0 : mapping ? .001 : .005;
    if (inside) {
      player.position.copy(interior.position);
      player.userData.limbs.forEach((limb, i) => { limb.rotation.x = movingInside ? Math.sin(time * 10 + (i < 2 ? 0 : Math.PI)) * .55 : 0; });
    } else pose(player, state.player, time, !!state.player.vx);
    if (game && mapping) { const entry = places.find(p => p.id === 'play').entrance; player.position.set(entry[0], 0, entry[1]); }
    ring.position.set(player.position.x, .055, player.position.z); shield.visible = chasing && !!state.protection;
    friends.forEach((object, i) => { object.visible = chasing; pose(object, state.friends[i], time); if (!reduced) object.position.y = Math.sin(time * 2 + i) * .06; });
    cats.forEach((object, i) => { object.visible = chasing && i < state.cats.length; if (object.visible) { const c = state.cats[i]; pose(object, c, time); const goal = c.route[0] || state.player; object.rotation.y = Math.atan2(goal.x - c.x, goal.y - c.y); object.scale.y = c.crouching ? .75 : 1; } });
    powers.forEach((object, i) => { const p = state.powers.find(p => p.x === arena.powerSpots[i][0] && p.y === arena.powerSpots[i][1]); object.visible = chasing && !!p && p.readyAt <= state.elapsed; if (p) { const v = toWorld(p.x, p.y); object.position.set(v.x, reduced ? 0 : Math.sin(time * 2 + i) * .1, v.z); } });
    hazards.forEach((object, i) => { const h = state.hazards[i]; object.visible = chasing && !!h; if (h) { const p = toWorld(h.x, h.y); object.position.set(p.x, .06, p.z); object.userData.acorn.position.y = .5 + Math.max(0, h.impactAt - state.elapsed) * 5; } });
    const fov = indoors ? 58 : 46;
    if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
    const destination = mapping ? new THREE.Vector3(0, 0, 0) : inside ? interior.position.clone().multiplyScalar(.6).add(new THREE.Vector3(0, 1.3, -3)) : follow || game ? player.position.clone().add(new THREE.Vector3(0, .8, 0)) : new THREE.Vector3(0, 0, -2);
    target.lerp(destination, reduced ? 1 : 1 - Math.exp(-dt * 5));
    const narrow = camera.aspect < .85;
    const d = (game ? (narrow ? 44 : 38) : follow ? 27 : 61 * (narrow ? 1.32 : 1)) * distance / 61;
    if (mapping) eye.set(0, Math.max(39 / camera.aspect, 30) / Math.tan(THREE.MathUtils.degToRad(23)), .01);
    else if (inside) {
      eye.set(target.x + Math.sin(yaw) * 11, 0, target.z + Math.cos(yaw) * 11);
      if (eye.length() > ROOM_LIMIT) eye.setLength(ROOM_LIMIT);
      eye.y = 8;
    }
    else eye.set(target.x + Math.sin(yaw) * d, target.y + d * (follow || game ? .82 : .48), target.z + Math.cos(yaw) * d);
    camera.position.lerp(eye, reduced ? 1 : 1 - Math.exp(-dt * 5));
    camera.lookAt(target);
    renderer.render(scene, camera);
  }
  resize(); camera.position.set(0, 24, 48); camera.lookAt(target);
  return {
    render, resize,
    walk(value) { follow = value; },
    map(value) { mapping = value; scene.fog.density = value ? .001 : .005; },
    enter(place, sections) { if (!focused) outsideYaw = yaw; focused = place; yaw = 0; interior.enter(place, sections); player.rotation.y = Math.PI; camera.position.set(0, 8, 12); target.set(0, 1.3, 0); },
    exit() { if (focused) yaw = outsideYaw; focused = null; interior.leave(); },
    clearInterior() { interior.clear(); movingInside = false; },
    moveInterior(axes, dt) { const previous = interior.position.clone(); movingInside = interior.move(axes, dt); if (movingInside) player.rotation.y = Math.atan2(interior.position.x - previous.x, interior.position.z - previous.z); },
    interiorPoint(x, y) { const rect = canvas.getBoundingClientRect(); ray.setFromCamera(new THREE.Vector2((x - rect.left) / rect.width * 2 - 1, -(y - rect.top) / rect.height * 2 + 1), camera); const station = interior.pick(ray); if (station !== undefined) return station; const p = ray.ray.intersectPlane(floor, new THREE.Vector3()); if (p) interior.point(p); },
    nearStation: interior.nearby,
    projectStation(index) { const s = interior.stations()[index], p = new THREE.Vector3(s.x, 3.6, s.z).project(camera); return { x: (p.x + 1) / 2 * canvas.clientWidth, y: (1 - p.y) / 2 * canvas.clientHeight, visible: p.z > -1 && p.z < 1 }; },
    rotate(delta) { if (!mapping) yaw -= delta * .005; },
    zoom(delta) { distance = THREE.MathUtils.clamp(distance + delta * .025, 34, 85); },
    axes({ x, y }) { return { x: x * Math.cos(yaw) + y * Math.sin(yaw), y: y * Math.cos(yaw) - x * Math.sin(yaw) }; },
    project(place) { const p = new THREE.Vector3(place.x, 5, place.z).project(camera); return { x: (p.x + 1) / 2 * canvas.clientWidth, y: (1 - p.y) / 2 * canvas.clientHeight, visible: p.z < 1 }; },
    pick(x, y) { const rect = canvas.getBoundingClientRect(); ray.setFromCamera(new THREE.Vector2((x - rect.left) / rect.width * 2 - 1, -(y - rect.top) / rect.height * 2 + 1), camera); const p = ray.ray.intersectPlane(floor, new THREE.Vector3()); return p ? toGame(p.x, p.z) : null; },
  };
}
