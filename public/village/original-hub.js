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
  const cx=w*.5,cy=h*(phone?.47:.46),rx=w*(phone?.33:.26),ry=h*(phone?.31:.28),stroke=phone?19:Math.min(38,w*.028);
  let paths='';
  function connect(x,y){const angle=Math.atan2((y-cy)/ry,(x-cx)/rx),px=cx+Math.cos(angle)*rx,py=cy+Math.sin(angle)*ry;paths+=`M${px} ${py} Q${(px+x)/2} ${py} ${x} ${y} `;}
  for(const house of scene.querySelectorAll('.village-house')){const b=house.getBoundingClientRect(),art=house.querySelector('svg');connect(b.left-rect.left+b.width*.5,b.top-rect.top+art.clientHeight*.9);}
  // Connect the bridge approach to the same main path.
  connect(w*(phone?155/500:374/1400),h*(phone?665/900:629/900));
  roads.innerHTML=`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#e8d6a5" stroke-width="${stroke}"/><path d="${paths}" fill="none" stroke="#e8d6a5" stroke-width="${stroke}" stroke-linecap="round"/>`;
 }
 observer=new ResizeObserver(drawRoads);observer.observe(scene);drawRoads();
 for(const house of document.querySelectorAll('.village-house')){
  const reset=()=>{house.style.setProperty('--lean','0deg');house.style.setProperty('--shift','0px');};
  house.addEventListener('pointermove',event=>{
   if(reduced.matches||event.pointerType==='touch')return;
   const box=house.getBoundingClientRect();
   const offset=Math.max(-1,Math.min(1,(event.clientX-box.left)/box.width*2-1));
   house.style.setProperty('--lean',`${offset*3.5}deg`);
   house.style.setProperty('--shift',`${offset*7}px`);
  },options);
  for(const type of ['pointerleave','pointercancel','blur'])house.addEventListener(type,reset,options);
 }
 window.addEventListener('blur',()=>document.querySelectorAll('.village-house').forEach(h=>{h.style.setProperty('--lean','0deg');h.style.setProperty('--shift','0px');}),options);
}
