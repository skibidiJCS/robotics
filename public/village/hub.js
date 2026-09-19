import {drawHouse,drawSmurf} from './art.js';
let observer;
export function renderHub(){
 observer?.disconnect();
 const ground=document.querySelector('#village-ground');if(!ground)return;
 const scene=ground.parentElement;
 const paint=()=>{
  const w=scene.clientWidth,h=scene.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
  ground.width=w*dpr;ground.height=h*dpr;const c=ground.getContext('2d');c.scale(dpr,dpr);
  const grass=c.createLinearGradient(0,0,w,h);grass.addColorStop(0,'#accaa0');grass.addColorStop(.55,'#bad0a1');grass.addColorStop(1,'#a5bf91');c.fillStyle=grass;c.fillRect(0,0,w,h);
  const sites=[...scene.querySelectorAll('.house')].map(a=>{const b=a.getBoundingClientRect(),r=scene.getBoundingClientRect();return {x:b.x-r.x+b.width/2,y:b.y-r.y+b.height-14};});
  c.beginPath();const ring=[sites[1],sites[2],sites[5],sites[4],sites[3],sites[0]];
  for(let i=0;i<ring.length;i++){const p=ring[i],q=ring[(i+1)%ring.length],mid={x:(p.x+q.x)/2,y:(p.y+q.y)/2};if(!i)c.moveTo(mid.x,mid.y);const n=ring[(i+2)%ring.length];c.quadraticCurveTo(q.x,q.y,(q.x+n.x)/2,(q.y+n.y)/2);}c.closePath();c.lineWidth=Math.max(20,w*.035);c.lineJoin='round';c.strokeStyle='#91a77b55';c.stroke();c.lineWidth=Math.max(16,w*.029);c.strokeStyle='#cfc5a5';c.stroke();
  for(let i=0;i<95;i++){const x=(i*139%997)/997*w,y=(i*89%991)/991*h;c.beginPath();c.moveTo(x-3,y+3);c.lineTo(x,y-4);c.lineTo(x+4,y+2);c.strokeStyle='#8ea977';c.lineWidth=1.4;c.stroke();if(i%5===0){c.fillStyle='#f1e7bd';c.beginPath();c.arc(x+8,y-2,3,0,7);c.fill();}}
  for(let i=0;i<18;i++){const x=w*(.03+i*.056),y=h*(i%2?.96:.045);c.fillStyle='#95b17e';c.beginPath();c.ellipse(x,y,18,9,0,0,7);c.ellipse(x+15,y+4,16,8,0,0,7);c.fill();}
  const tiny=w<600?.38:.58;c.save();c.translate(w*.37,h*.65);c.scale(tiny,tiny);drawSmurf(c,{x:0,y:0,vx:0,facing:1,walk:0,grounded:true,hero:true},2);c.restore();
  scene.querySelectorAll('.house-art').forEach((canvas,i)=>{canvas.width=380*dpr;canvas.height=390*dpr;const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);ctx.translate(190,-255);drawHouse(ctx,{x:0,color:['#bf5142','#368eae','#c29b4d','#7e8dba','#b66374','#6f9a79'][i]},0,false);});
 };
 observer=new ResizeObserver(paint);observer.observe(scene);paint();
}
