import {drawSmurf} from './art.js';
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
export const catIcon=()=>`<svg class="instruction-drawing" viewBox="0 0 80 68" aria-label="Azrael" role="img"><g fill="#bc9068" stroke="#776e53" stroke-width="2"><path d="M26 48Q8 47 9 28Q3 12 4 8" fill="none" stroke-width="6"/><ellipse cx="39" cy="49" rx="23" ry="12"/><path d="M39 43 38 11 50 19 66 10 70 43Q57 56 39 43Z"/><path d="M25 54v9m28-8v8" stroke-width="5"/></g><path d="M40 44 68 44" stroke="#a94c3d" stroke-width="5"/><g fill="#fff0c6" stroke="none"><ellipse cx="48" cy="31" rx="4" ry="5"/><ellipse cx="61" cy="31" rx="4" ry="5"/></g><path d="m48 29 1 4m11-4 1 4" stroke="#435445" stroke-width="2"/><path d="m53 39 5 0-3 3Z" fill="#654531" stroke="none"/></svg>`;
export const mushroomIcon=()=>`<svg class="instruction-drawing" viewBox="0 0 90 70" aria-label="Blue speed mushroom and gold shield mushroom" role="img"><g stroke="#6d6543" stroke-width="2"><path d="M24 40v21h10V40m29-13v31h9V27" fill="#f6e5b7"/><path d="M5 42C4 8 49 8 51 42Q25 52 5 42Z" fill="#368eae"/><path d="M48 29C47 3 88 3 88 29Q67 38 48 29Z" fill="#d49b3e"/></g><g fill="#fff0c6" stroke="none"><circle cx="18" cy="31" r="5"/><circle cx="36" cy="26" r="5"/><circle cx="61" cy="18" r="4"/><circle cx="77" cy="21" r="4"/></g></svg>`;
