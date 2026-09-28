import { toGame, SCALE } from './world-data.js';
import { createNavigation } from './world-navigation.js';

export const ARENA_RADIUS = 34;
const arenaRadius = ARENA_RADIUS / SCALE;
const point = ([x, z]) => { const p = toGame(x, z); return [p.x, p.y]; };
export const arenaFurniture = [
 { kind: 'kitchen', x: -17, z: -9, width: 8, depth: 4, color: '#71968b' },
 { kind: 'library', x: 0, z: -18, width: 8, depth: 3, color: '#ad6649' },
 { kind: 'table', x: 15, z: -8, radius: 3.7, color: '#c59652' },
 { kind: 'workshop', x: -15, z: 12, width: 7, depth: 4, color: '#537d94' },
 { kind: 'sofa', x: 1, z: 6, width: 7, depth: 3, color: '#ad5f46' },
 { kind: 'crates', x: 20, z: 12, width: 4, depth: 4, color: '#997149' },
];
export const arena = createNavigation({
 bounds: { left: 650-arenaRadius, right: 650+arenaRadius, top: 580-arenaRadius, bottom: 580+arenaRadius },
 circle: { x: 650, y: 580, r: arenaRadius },
 obstacles: arenaFurniture.map(f => {
  const center = toGame(f.x, f.z);
  const outline = f.radius ? Array.from({ length: 16 }, (_, i) => [Math.cos(i * Math.PI / 8) * f.radius, Math.sin(i * Math.PI / 8) * f.radius]) : [[-f.width/2,-f.depth/2],[f.width/2,-f.depth/2],[f.width/2,f.depth/2],[-f.width/2,f.depth/2]];
  return { ...center, kind: f.kind, r: (f.radius || Math.hypot(f.width, f.depth) / 2) / SCALE, points: outline.map(([x,z]) => toGame(f.x+x,f.z+z)) };
 }),
 player: point([0, 0]), cats: [[-24,-18],[24,-18]].map(point),
 spots: [[-24,7],[21,-17],[22,19],[-22,19],[-3,-9],[8,19],[-25,-19],[6,-20],[24,0],[-5,0],[9,-3],[0,21]].map(point),
 powerSpots: [[-24,-2],[-10,-17],[11,-19],[25,-7],[26,16],[10,21],[-10,20],[-4,-6],[-27,14],[15,2]].map(point),
});
