import assert from 'node:assert/strict';
import { arena, arenaFurniture } from '../public/village/arena-layout.js';
import { createGame, step, village } from '../public/village/roam-state.js';
import { toGame } from '../public/village/world-data.js';

const start = { x: arena.player[0], y: arena.player[1] }, corner = toGame(30,30);
assert(arena.blocked(corner.x,corner.y), 'The round wall blocks rectangle corners');
for (const [x,y] of [...arena.spots,...arena.powerSpots,arena.player,...arena.cats]) {
 assert(!arena.blocked(x,y), 'Indoor spawns clear the furniture');
 assert(arena.routeTo(start,{x,y}).length, 'Every rescue and power-up can be reached');
}
for (const f of arenaFurniture) { const p=toGame(f.x,f.z); assert(arena.blocked(p.x,p.y), 'Visible furniture has collision'); }
for (const mode of ['easy','medium','hard']) {
 const state=createGame(mode,arena); state.phase='playing';
 assert.equal(state.environment,arena);
 for (let i=0;i<24;i++) {
  const friend=state.friends[i%3]; Object.assign(state.player,{x:friend.x,y:friend.y});
  state.cats.forEach(cat=>{[cat.x,cat.y]=arena.cats.toSorted((a,b)=>Math.hypot(b[0]-friend.x,b[1]-friend.y)-Math.hypot(a[0]-friend.x,a[1]-friend.y))[0]; cat.route=[];cat.repath=0;cat.stun=1;});
  assert(step(state,{x:0,y:0},.01).includes('found'));
  assert(state.friends.every(f=>!arena.blocked(f.x,f.y)&&arena.routeTo(state.player,f).length),'Rescues respawn within the house');
 }
 assert.equal(state.found,24);
}
const chase=createGame('hard',arena);chase.phase='playing';
for(let i=0;i<800&&chase.phase==='playing';i++) {
 const target=chase.friends[i%3];chase.target=target;chase.route=arena.routeTo(chase.player,target);
 step(chase,{x:0,y:0},.025);
 for(const actor of [chase.player,...chase.cats]) assert(!arena.blocked(actor.x,actor.y),'Chase actors cannot cross furniture or walls');
}
assert(chase.cats.every(c=>c.walk>0),'Both cats navigate the indoor arena');
assert.equal(createGame().environment,village,'Exploration retains its own map');
console.log('PASS: indoor arena spawns, shared furniture collision, rescue respawns and cat pursuit.');
