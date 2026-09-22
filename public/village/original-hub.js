import {bridgeArt} from './village-markup.js';
let controller,observer;
export function renderOriginalHub(){
 controller?.abort();
 observer?.disconnect();
 controller=new AbortController();
 const options={signal:controller.signal};
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const scene=document.querySelector('.village-scene');
 if(!scene)return;
 let roads=scene.querySelector('.village-paths');
 if(!roads){roads=document.createElementNS('http://www.w3.org/2000/svg','svg');roads.classList.add('village-paths');roads.setAttribute('aria-hidden','true');scene.insertBefore(roads,scene.querySelector('.village-brand'));}
 function drawRoads(){
  const rect=scene.getBoundingClientRect(),w=rect.width,h=rect.height,phone=w<=700;
  roads.setAttribute('viewBox',`0 0 ${w} ${h}`);
  const stroke=phone?19:Math.min(38,w*.028),doors=[];
  for(const house of scene.querySelectorAll('.village-house')){const b=house.getBoundingClientRect(),art=house.querySelector('svg');doors.push({x:b.left-rect.left+b.width*.5,y:b.top-rect.top+art.clientHeight*.9});}
  const cx=w*.5,cy=h*(phone?.49:.55),rx=w*(phone?.39:.25),ry=h*(phone?.26:.34);
  // Uneven clearings joined with continuous curves, rather than a geometric ring.
  const points=[[0,-1],[.72,-.78],[1,-.12],[.88,.55],[.12,1],[-.67,.79],[-1,.18],[-.86,-.51]].map(([x,y])=>({x:cx+x*rx,y:cy+y*ry}));
  let loop=`M${points[0].x} ${points[0].y}`;
  for(let i=0;i<points.length;i++){
   const a=points[(i+7)%8],b=points[i],c=points[(i+1)%8],d=points[(i+2)%8];
   loop+=` C${b.x+(c.x-a.x)/6} ${b.y+(c.y-a.y)/6} ${c.x-(d.x-b.x)/6} ${c.y-(d.y-b.y)/6} ${c.x} ${c.y}`;
  }
  roads.innerHTML=`<path d="${loop}Z" fill="none" stroke="#e8d6a5" stroke-width="${stroke}"/>`;
  const ring=roads.firstElementChild,length=ring.getTotalLength();
  const samples=Array.from({length:180},(_,i)=>ring.getPointAtLength(length*i/180));
  const nearest=d=>samples.reduce((best,p)=>Math.hypot(p.x-d.x,p.y-d.y)<Math.hypot(best.x-d.x,best.y-d.y)?p:best);
  let paths=doors.map(d=>{const point=nearest(d);return `M${d.x} ${d.y}Q${d.x} ${point.y} ${point.x} ${point.y}`;}).join(' ');
  const bridge={x:w*(phone?89/500:215/1400),y:h*(phone?765/900:745/900)},near=nearest(bridge);
  paths+=` M${near.x} ${near.y}C${near.x} ${near.y+30} ${bridge.x+20} ${bridge.y-35} ${bridge.x} ${bridge.y}`;
  roads.innerHTML+=`<path d="${paths}" fill="none" stroke="#e8d6a5" stroke-width="${stroke}" stroke-linecap="butt" stroke-linejoin="round"/><svg width="${w}" height="${h}" viewBox="0 0 ${phone?500:1400} 900" preserveAspectRatio="none">${bridgeArt(phone)}</svg>`;

 }
 observer=new ResizeObserver(drawRoads);observer.observe(scene);drawRoads();
 for(const house of document.querySelectorAll('.village-house')){
  const reset=()=>{house.style.setProperty('--lean','0deg');house.style.setProperty('--shift','0px');};
  house.addEventListener('pointermove',event=>{
   if(reduced.matches||event.pointerType==='touch')return;
   const box=house.getBoundingClientRect();
   const offset=Math.max(-1,Math.min(1,(event.clientX-box.left)/box.width*2-1));
   house.style.setProperty('--lean',`${offset*5}deg`);
   house.style.setProperty('--shift',`${offset*10}px`);
  },options);
  for(const type of ['pointerleave','pointercancel','blur'])house.addEventListener(type,reset,options);
 }
 window.addEventListener('blur',()=>document.querySelectorAll('.village-house').forEach(h=>{h.style.setProperty('--lean','0deg');h.style.setProperty('--shift','0px');}),options);
}
