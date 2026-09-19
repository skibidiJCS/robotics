import assert from 'node:assert/strict';
import {createGame,step,catSpeed,BOOST_SPEED,CAT_MAX_SPEED,blocked,routeTo} from '../public/village/roam-state.js';

const chase=createGame('hard');chase.phase='playing';chase.remaining=1000;chase.protection=1000;
const startingSpeed=catSpeed(chase);let differentPlans=0;
for(let frame=0;frame<7200;frame++){
 // This soak test isolates pursuit; contact behaviour is tested separately.
 for(const cat of chase.cats)cat.contactBlocked=true;
 const angle=frame/130;
 const previous=chase.cats.map(c=>({x:c.x,y:c.y}));
 step(chase,{x:Math.cos(angle),y:Math.sin(angle)},1/60);
 assert.equal(chase.cats.length,2);
 const [a,b]=chase.cats;assert(Math.hypot(a.x-b.x,a.y-b.y)>=51.99,'Cats never hide by overlapping');
 for(const [i,c] of chase.cats.entries()){
  assert(!blocked(c.x,c.y),'Cat remains on navigable ground');
  assert(Math.hypot(c.x-previous[i].x,c.y-previous[i].y)<=BOOST_SPEED/60,'No separation teleport or movement faster than boost');
 }
 if(a.aim&&b.aim&&Math.hypot(a.aim.x-b.aim.x,a.aim.y-b.aim.y)>70)differentPlans++;
}
assert(catSpeed(chase)>startingSpeed);assert(catSpeed(chase)<=CAT_MAX_SPEED);assert(CAT_MAX_SPEED<BOOST_SPEED);assert(differentPlans>600,'The flanker repeatedly takes a separate approach');
chase.elapsed=100000;chase.score=100000;assert.equal(catSpeed(chase),CAT_MAX_SPEED);
const rescue=createGame('hard');rescue.phase='playing';rescue.elapsed=10000;rescue.remaining=100;
rescue.player.x=650;rescue.player.y=850;rescue.cats[0].x=610;rescue.cats[0].y=850;rescue.cats[1].x=250;rescue.cats[1].y=310;rescue.boost=2;
const gap=rescue.player.x-rescue.cats[0].x;
for(let i=0;i<60;i++)step(rescue,{x:1,y:0},1/60);
assert.equal(rescue.phase,'playing');assert(rescue.player.x-rescue.cats[0].x>gap+40,'Boost opens a real escape gap against maximum-speed pursuit');
const powers=createGame('hard');assert.equal(powers.powers.length,10);assert(powers.powers.filter(p=>p.readyAt===0).length<=8);
for(const power of powers.powers){assert(!blocked(power.x,power.y));assert(routeTo(powers.player,power).length);}
const pickup=powers.powers.find(p=>p.type==='speed');powers.phase='playing';powers.player.x=pickup.x;powers.player.y=pickup.y;step(powers,{x:0,y:0},.01);assert(pickup.readyAt>powers.elapsed+9);const deadline=pickup.readyAt;
powers.player.x=650;powers.player.y=850;powers.elapsed=deadline+.1;assert(pickup.readyAt<=powers.elapsed,'Mushrooms return throughout long runs');
console.log('PASS: two persistent separated cats, strategic split, elapsed-time acceleration, speed cap, boosted escape, reachable and renewable mushrooms.');
