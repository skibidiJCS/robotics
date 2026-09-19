import {drawSmurf} from './art.js';
let observer;

function drawCleanHouse(c, color, trim='#fff0c9'){
 const dark='#5d402a';
 c.save();
 c.shadowColor='#31523b38';c.shadowBlur=0;c.shadowOffsetY=7;
 c.fillStyle='#6e8e5d55';c.beginPath();c.ellipse(190,356,104,17,0,0,Math.PI*2);c.fill();c.shadowColor='transparent';
 c.fillStyle=trim;c.strokeStyle=dark;c.lineWidth=4;c.beginPath();c.roundRect(91,160,198,198,34);c.fill();c.stroke();
 c.fillStyle='#e7d29b';c.beginPath();c.roundRect(97,177,186,181,27);c.fill();
 c.fillStyle=color;c.strokeStyle=dark;c.lineWidth=4;c.beginPath();c.moveTo(38,170);c.quadraticCurveTo(53,136,75,102);c.quadraticCurveTo(105,43,190,36);c.quadraticCurveTo(275,43,305,102);c.quadraticCurveTo(327,136,342,170);c.quadraticCurveTo(190,208,38,170);c.closePath();c.fill();c.stroke();
 c.save();c.clip();
  const shine=c.createLinearGradient(90,55,280,174);shine.addColorStop(0,'#ffffff55');shine.addColorStop(.42,'#ffffff08');shine.addColorStop(1,'#331d3020');c.fillStyle=shine;c.fillRect(30,35,320,175);
  for(const [x,y,r] of [[93,117,17],[160,77,22],[244,109,19],[282,151,13]]){c.fillStyle='#fff4d2';c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();}
 c.restore();
 c.fillStyle='#318eb0';c.strokeStyle=dark;c.lineWidth=3;
 for(const x of [134,246]){c.beginPath();c.arc(x,229,25,0,Math.PI*2);c.fill();c.stroke();c.strokeStyle='#d7f0e0';c.lineWidth=3;c.beginPath();c.moveTo(x,207);c.lineTo(x,251);c.moveTo(x-22,229);c.lineTo(x+22,229);c.stroke();c.strokeStyle=dark;c.lineWidth=3;}
 c.fillStyle='#aa7042';c.strokeStyle=dark;c.lineWidth=4;c.beginPath();c.roundRect(160,244,60,114,20);c.fill();c.stroke();
 c.fillStyle='#edca57';c.beginPath();c.arc(207,302,5,0,Math.PI*2);c.fill();
 c.fillStyle='#6c994d';c.beginPath();c.ellipse(91,358,22,8,0,0,Math.PI*2);c.ellipse(289,358,22,8,0,0,Math.PI*2);c.fill();
 c.restore();
}
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
  scene.querySelectorAll('.house-art').forEach((canvas,i)=>{canvas.width=380*dpr;canvas.height=390*dpr;const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);drawCleanHouse(ctx,['#e34d48','#2496c1','#f0b84c','#8b73c7','#e66b91','#42a56d'][i]);});
 };
 observer=new ResizeObserver(paint);observer.observe(scene);paint();
}
