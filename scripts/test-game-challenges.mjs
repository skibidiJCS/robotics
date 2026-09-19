import assert from 'node:assert/strict';
import {createGame,step,bounds} from '../public/village/roam-state.js';
assert.equal(createGame().mode,'easy');
const shield=createGame();shield.phase='playing';shield.powers=[];shield.protection=1;
shield.cats[0].x=shield.player.x;shield.cats[0].y=shield.player.y;
assert(step(shield,{x:0,y:0},.01).includes('shieldUsed'));
assert.equal(shield.protection,0);assert.equal(shield.phase,'playing');
step(shield,{x:0,y:0},.01);assert.equal(shield.phase,'playing','The same continuous contact is not a second hit');
shield.cats[0].x=shield.player.x+70;step(shield,{x:0,y:0},.01);
shield.cats[0].x=shield.player.x;shield.cats[0].y=shield.player.y;
assert(step(shield,{x:0,y:0},.01).includes('end'),'A second contact ends the run');
const saved=createGame();saved.phase='playing';saved.cats=[];saved.powers=[];saved.protection=1;
for(let i=0;i<600;i++)step(saved,{x:0,y:0},1/60);
assert.equal(saved.protection,1,'An unused shield does not expire');
for(const mode of ['easy','medium','hard']){
 const s=createGame(mode);s.phase='playing';s.cats=[];s.powers=[];s.friends=[];s.elapsed=8;
 step(s,{x:0,y:0},.01);assert(s.hazards.length>0);assert(s.hazards.length<=s.settings.acorns);
 const hazard=s.hazards[0],time=s.remaining;
 s.phase='paused';step(s,{x:0,y:0},5);assert.equal(s.remaining,time);assert.equal(hazard.hit,false);
 s.phase='playing';s.elapsed=hazard.impactAt-.02;step(s,{x:0,y:0},.01);assert.equal(hazard.hit,false);
 const before=s.remaining;assert(step(s,{x:0,y:0},.02).includes('acornHit'));assert(Math.abs(before-s.remaining-s.settings.penalty-.02)<.001);
 const after=s.remaining;step(s,{x:0,y:0},.01);assert(Math.abs(after-s.remaining-.01)<.001,'One penalty per acorn');
}
const combo=createGame();combo.phase='playing';combo.cats=[];combo.powers=[];
for(let i=0;i<3;i++){combo.player.x=combo.friends[0].x;combo.player.y=combo.friends[0].y;step(combo,{x:0,y:0},.01);}
assert.equal(combo.score,450);assert(combo.remaining>73);
const top=createGame();top.phase='explore';top.player.x=650;top.player.y=bounds.top;
step(top,{x:0,y:-1},.05);assert.equal(top.player.y,bounds.top);
console.log('PASS: easy default, single-contact shield, re-contact death, paused and telegraphed acorns, one penalty per impact, rescue streak and top limit.');

// Regression: staying in contact after consuming a shield must not grant immortality,
// including when an acorn lands at the same location.
const camping=createGame('easy');camping.phase='playing';camping.protection=1;camping.powers=[];
camping.cats[0].x=camping.player.x;camping.cats[0].y=camping.player.y;
camping.hazards=[{x:camping.player.x,y:camping.player.y,impactAt:.5,hit:false}];
step(camping,{x:0,y:0},.01);assert.equal(camping.protection,0);
for(let i=0;i<100&&camping.phase==='playing';i++)step(camping,{x:0,y:0},.02);
assert.equal(camping.reason,'caught');assert(camping.elapsed<1.5);
const late=createGame('hard');late.phase='playing';late.cats=[];late.powers=[];late.elapsed=140;late.nextHazard=200;
late.player.x=late.friends[0].x;late.player.y=late.friends[0].y;const clock=late.remaining;
step(late,{x:0,y:0},.01);assert(Math.abs(late.remaining-clock-.99)<.001);
const burst=createGame('hard');burst.phase='playing';burst.elapsed=9;burst.remaining=200;burst.powers=[];
burst.player.x=1000;burst.player.y=800;step(burst,{x:0,y:0},.01);assert(burst.cats[0].crouching);
burst.elapsed=9.9;step(burst,{x:0,y:0},.01);assert(burst.cats[0].pouncing);
console.log('PASS: camping cat kills after shield stun, acorns do not suppress contact, late-run time bonuses shrink, pounce is telegraphed.');
