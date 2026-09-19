let observer;

export function renderOriginalHub(){
 const canvas=document.querySelector('#village-art');
 if(!canvas)return;
 const scene=canvas.parentElement;
 const palette=['#e4544d','#318fc2','#e4544d','#318fc2','#e4544d','#318fc2'];
 const positions=()=>matchMedia('(max-aspect-ratio: 1333/1000)').matches?[[.18,.21],[.48,.12],[.78,.21],[.18,.58],[.48,.83],[.78,.58]]:[[.30,.16],[.48,.06],[.66,.16],[.29,.62],[.48,.78],[.65,.60]];
 function tree(c,x,y,s){
  c.save();c.translate(x,y);c.scale(s,s);c.lineJoin='round';c.fillStyle='#9a653e';c.strokeStyle='#365d78';c.lineWidth=2.5;
  c.beginPath();c.moveTo(-8,80);c.lineTo(-4,15);c.lineTo(-22,-8);c.lineTo(-14,-12);c.lineTo(0,7);c.lineTo(14,-18);c.lineTo(22,-12);c.lineTo(7,18);c.lineTo(14,80);c.closePath();c.fill();c.stroke();
  c.fillStyle='#8fc59b';c.beginPath();c.moveTo(-60,12);c.quadraticCurveTo(-80,-28,-45,-43);c.quadraticCurveTo(-45,-78,0,-74);c.quadraticCurveTo(37,-93,52,-57);c.quadraticCurveTo(82,-39,59,-6);c.quadraticCurveTo(48,28,0,22);c.quadraticCurveTo(-36,31,-60,12);c.fill();c.stroke();c.restore();
 }
 function house(c,x,y,scale,color){
  c.save();c.translate(x,y);c.scale(scale,scale);c.lineJoin='round';c.lineWidth=2.5;c.strokeStyle='#365d78';
  c.fillStyle='#78956e55';c.beginPath();c.ellipse(0,70,72,9,0,0,Math.PI*2);c.fill();
  c.fillStyle='#f4e9c8';c.beginPath();c.moveTo(-45,0);c.quadraticCurveTo(-42,32,-37,68);c.quadraticCurveTo(0,81,37,68);c.quadraticCurveTo(42,32,45,0);c.closePath();c.fill();c.stroke();
  c.fillStyle=color;c.beginPath();c.moveTo(-72,0);c.quadraticCurveTo(-70,-36,-36,-55);c.quadraticCurveTo(0,-77,36,-55);c.quadraticCurveTo(70,-36,72,0);c.quadraticCurveTo(38,13,0,10);c.quadraticCurveTo(-38,13,-72,0);c.fill();c.stroke();
  for(const [dx,dy,r] of [[-37,-32,9],[0,-56,10],[38,-28,9]]){c.fillStyle='#fff1cf';c.beginPath();c.arc(dx,dy,r,0,Math.PI*2);c.fill();}
  c.fillStyle='#9b633b';c.strokeStyle='#365d78';c.beginPath();c.roundRect(-14,28,27,42,9);c.fill();c.stroke();c.fillStyle='#f2c96c';c.beginPath();c.arc(6,49,2.5,0,Math.PI*2);c.fill();
  c.fillStyle='#63a7c8';c.strokeStyle='#365d78';c.beginPath();c.rect(22,25,17,18);c.fill();c.stroke();c.strokeStyle='#e4f3df';c.beginPath();c.moveTo(30.5,25);c.lineTo(30.5,43);c.moveTo(22,34);c.lineTo(39,34);c.stroke();c.restore();
 }
 function paint(){
  const w=scene.clientWidth,h=scene.clientHeight,dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle='#f4e9c8';c.fillRect(0,0,w,h);
  [[.02,.12,.8],[.21,.05,.72],[.78,.04,.74],[.98,.2,.78],[.18,.5,.72],[.01,.88,.76],[.98,.86,.8]].forEach(([x,y,s])=>tree(c,x*w,y*h,s*Math.min(w/1400,h/750)));
  c.lineCap='round';c.lineJoin='round';c.strokeStyle='#e9c98c';c.lineWidth=Math.max(23,w*.018);c.beginPath();c.moveTo(w*.48,h*.08);c.bezierCurveTo(w*.43,h*.2,w*.3,h*.24,w*.31,h*.38);c.bezierCurveTo(w*.34,h*.52,w*.45,h*.54,w*.48,h*.78);c.moveTo(w*.47,h*.25);c.bezierCurveTo(w*.58,h*.25,w*.67,h*.23,w*.66,h*.16);c.moveTo(w*.33,h*.4);c.bezierCurveTo(w*.18,h*.34,w*.08,h*.32,w*.03,h*.25);c.moveTo(w*.47,h*.54);c.bezierCurveTo(w*.61,h*.56,w*.78,h*.56,w*.94,h*.48);c.stroke();
  c.strokeStyle='#7fa2c0';c.lineWidth=2;c.setLineDash([7,7]);c.stroke();c.setLineDash([]);
  for(let i=0;i<70;i++){const x=(i*139%997)/997*w,y=(i*89%991)/991*h;c.strokeStyle='#75a77a';c.lineWidth=1.3;c.beginPath();c.moveTo(x-3,y+3);c.lineTo(x,y-3);c.lineTo(x+4,y+2);c.stroke();}
  positions().forEach(([x,y],i)=>house(c,x*w,y*h,Math.min(w/1200,h/760)*1.12,palette[i]));
 }
 observer?.disconnect();observer=new ResizeObserver(paint);observer.observe(scene);paint();
}
if(document.querySelector('#village-art'))renderOriginalHub();
