let controller;
export function renderOriginalHub(){
 controller?.abort();
 controller=new AbortController();
 const options={signal:controller.signal};
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 for(const house of document.querySelectorAll('.village-house')){
  const reset=()=>{house.style.setProperty('--lean','0deg');house.style.setProperty('--shift','0px');};
  house.addEventListener('pointermove',event=>{
   if(reduced.matches||event.pointerType==='touch')return;
   const box=house.getBoundingClientRect();
   const offset=Math.max(-1,Math.min(1,(event.clientX-box.left)/box.width*2-1));
   house.style.setProperty('--lean',`${offset*2}deg`);
   house.style.setProperty('--shift',`${offset*4}px`);
  },options);
  for(const type of ['pointerleave','pointercancel','blur'])house.addEventListener(type,reset,options);
 }
 window.addEventListener('blur',()=>document.querySelectorAll('.village-house').forEach(h=>{h.style.setProperty('--lean','0deg');h.style.setProperty('--shift','0px');}),options);
}
