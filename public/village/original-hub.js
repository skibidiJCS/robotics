let observer;
export function renderOriginalHub(){
 const canvas=document.querySelector('#village-art');
 if(!canvas)return;
 const scene=canvas.parentElement;
 const palette=['#d94c46','#238fbd','#eab44c','#8b72c7','#e4688e','#3e9e6e'];
 const positions=()=>matchMedia('(max-aspect-ratio: 1333/1000)').matches?[[.08,.10],[.36,0],[.66,.10],[.06,.51],[.36,.64],[.67,.48]]:[[.26,.10],[.415,0],[.595,.10],[.25,.55],[.42,.67],[.595,.52]];
 function house(c,x,y,scale,color){
  c.save();c.translate(x,y);c.scale(scale,scale);c.lineJoin='round';c.lineWidth=2.5;c.strokeStyle='#4b4b42';
  c.fillStyle='#6e8f5d55';c.beginPath();c.ellipse(0,126,72,10,0,0,Math.PI*2);c.fill();
  c.fillStyle='#f0dfaa';c.beginPath();c.roundRect(-42,-8,84,132,17);c.fill();c.stroke();
  c.fillStyle=color;c.beginPath();c.moveTo(-78,-10);c.quadraticCurveTo(-68,-51,-42,-78);c.quadraticCurveTo(0,-111,42,-78);c.quadraticCurveTo(68,-51,78,-10);c.quadraticCurveTo(0,13,-78,-10);c.fill();c.stroke();
  c.save();c.clip();const light=c.createLinearGradient(-70,-85,60,0);light.addColorStop(0,'#ffffff48');light.addColorStop(1,'#391b2520');c.fillStyle=light;c.fillRect(-90,-120,180,140);for(const [dx,dy,r] of [[-39,-47,8],[0,-77,11],[38,-43,9]]){c.fillStyle='#fff0c9';c.beginPath();c.arc(dx,dy,r,0,Math.PI*2);c.fill();}c.restore();
  c.fillStyle='#278bb1';c.strokeStyle='#4b4b42';c.lineWidth=2;c.beginPath();c.arc(-23,43,12,0,Math.PI*2);c.fill();c.stroke();c.beginPath();c.arc(23,43,12,0,Math.PI*2);c.fill();c.stroke();c.strokeStyle='#d7f1e0';c.beginPath();for(const dx of [-23,23]){c.moveTo(dx,32);c.lineTo(dx,54);c.moveTo(dx-11,43);c.lineTo(dx+11,43);}c.stroke();
  c.fillStyle='#a86e40';c.strokeStyle='#4b4b42';c.lineWidth=2.5;c.beginPath();c.roundRect(-14,62,28,62,9);c.fill();c.stroke();c.fillStyle='#f3cf65';c.beginPath();c.arc(7,94,2.5,0,Math.PI*2);c.fill();c.restore();
 }
 function paint(){const w=scene.clientWidth,h=scene.clientHeight,dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle='#a9c69a';c.fillRect(0,0,w,h);const pts=positions().map(([x,y])=>[x*w,y*h]);
  c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(pts[1][0],pts[1][1]+h*.15);c.bezierCurveTo(w*.5,h*.28,w*.72,h*.17,pts[2][0],pts[2][1]+h*.15);c.bezierCurveTo(w*.72,h*.52,w*.75,h*.75,pts[5][0],pts[5][1]+h*.2);c.bezierCurveTo(w*.55,h*.86,w*.34,h*.88,pts[4][0],pts[4][1]+h*.16);c.bezierCurveTo(w*.25,h*.7,w*.18,h*.58,pts[3][0],pts[3][1]+h*.18);c.bezierCurveTo(w*.21,h*.38,w*.28,h*.23,pts[0][0],pts[0][1]+h*.18);c.strokeStyle='#8ba97655';c.lineWidth=Math.max(34,w*.035);c.stroke();c.strokeStyle='#d2c39e';c.lineWidth=Math.max(27,w*.028);c.stroke();
  for(let i=0;i<90;i++){const x=(i*139%997)/997*w,y=(i*89%991)/991*h;c.strokeStyle='#8fae79';c.lineWidth=1.3;c.beginPath();c.moveTo(x-3,y+3);c.lineTo(x,y-3);c.lineTo(x+4,y+2);c.stroke();if(i%6===0){c.fillStyle='#f6e8b9';c.beginPath();c.arc(x+8,y-3,2.5,0,Math.PI*2);c.fill();}}
  positions().forEach(([x,y],i)=>house(c,x*w,y*h+h*.18,Math.min(w/1180,h/710)*1.15,palette[i]));
 }
 observer?.disconnect();
 observer=new ResizeObserver(paint);
 observer.observe(scene);
 paint();
}

if(document.querySelector('#village-art'))renderOriginalHub();
