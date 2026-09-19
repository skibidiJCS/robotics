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
  const front=i=>({x:doors[i].x,y:Math.min(h-10,doors[i].y+(phone?18:28))});
  // The western lane has its own alignment, outside the robot house footprint.
  const westX=w*(phone?.075:.10),robotFront=front(3);
  const nodes=[front(1),front(2),front(5),front(4),{x:westX,y:robotFront.y+12},{x:westX,y:doors[3].y-h*.23},front(0)];
  let ring=`M${nodes[0].x} ${nodes[0].y}`;
  const count=nodes.length;
  for(let i=0;i<count;i++){const a=nodes[(i+count-1)%count],b=nodes[i],c=nodes[(i+1)%count],d=nodes[(i+2)%count];ring+=` C${b.x+(c.x-a.x)/10} ${b.y+(c.y-a.y)/10} ${c.x-(d.x-b.x)/10} ${c.y-(d.y-b.y)/10} ${c.x} ${c.y}`;}
  let paths=doors.map((d,i)=>i===3?`M${d.x} ${d.y}L${robotFront.x} ${robotFront.y}Q${westX+30} ${robotFront.y} ${westX} ${robotFront.y+12}`:`M${d.x} ${d.y}V${front(i).y}`).join(' ');
  const bridge={x:w*(phone?89/500:215/1400),y:h*(phone?765/900:745/900)},near=nodes[4];
  paths+=` M${near.x} ${near.y}C${near.x} ${near.y+30} ${bridge.x+20} ${bridge.y-35} ${bridge.x} ${bridge.y}`;
  roads.innerHTML=`<path d="${ring}Z ${paths}" fill="none" stroke="#e8d6a5" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"/>`;

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
