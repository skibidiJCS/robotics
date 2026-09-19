import {drawSmurf} from './art.js';
import {drawCat} from './cat-art.js';
const spriteCache=new Map();
export function smurfIcon(hero=false){
 if(!spriteCache.has(hero)){
  const canvas=document.createElement('canvas');canvas.width=100;canvas.height=128;
  const ctx=canvas.getContext('2d');ctx.translate(48,118);ctx.scale(1.2,1.2);
  drawSmurf(ctx,{x:0,y:0,facing:1,vx:0,hero,grounded:true,walk:0},1);
  if(!hero){ctx.fillStyle='#416544';ctx.font='bold 25px Arial';ctx.fillText('!',30,-74);}
  spriteCache.set(hero,canvas.toDataURL());
 }
 return `<img class="instruction-sprite" src="${spriteCache.get(hero)}" alt="${hero?'Papa Smurf':'Smurf'}">`;
}
export const keySymbols=()=>`<span class="key-cluster" aria-label="WASD"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></span><span class="key-cluster" aria-label="Arrow keys"><kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd></span>`;
export function catIcon(){const canvas=document.createElement('canvas');canvas.width=110;canvas.height=95;const c=canvas.getContext('2d');drawCat(c,{x:52,y:78,facing:1,id:0},1,true);return `<img class="instruction-drawing" src="${canvas.toDataURL()}" alt="Azrael">`;}

export const mushroomIcon=()=>`<svg class="instruction-drawing" viewBox="0 0 90 70" aria-label="Blue speed mushroom and gold shield mushroom" role="img"><g stroke="#6d6543" stroke-width="2"><path d="M24 40v21h10V40m29-13v31h9V27" fill="#f6e5b7"/><path d="M5 42C4 8 49 8 51 42Q25 52 5 42Z" fill="#368eae"/><path d="M48 29C47 3 88 3 88 29Q67 38 48 29Z" fill="#d49b3e"/></g><g fill="#fff0c6" stroke="none"><circle cx="18" cy="31" r="5"/><circle cx="36" cy="26" r="5"/><circle cx="61" cy="18" r="4"/><circle cx="77" cy="21" r="4"/></g></svg>`;
