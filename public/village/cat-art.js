// Movement distance drives the paws, so a stopped cat never keeps running.
export function drawCat(c,cat,time=0,reduced=false){
 const running=Math.abs(cat.vx||0)>1&&!cat.stun,phase=reduced?0:(cat.walk||0)/16;
 const bob=running&&!reduced?Math.sin(phase*2)*1.5:0;
 c.save();c.translate(cat.x,cat.y);c.scale(cat.facing||1,1);c.lineJoin='round';c.lineCap='round';c.lineWidth=1.8;
 function shape(d,fill,stroke='#78563b'){const p=new Path2D(d);c.fillStyle=fill;c.fill(p);if(stroke){c.strokeStyle=stroke;c.stroke(p);}}
 function oval(x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
 oval(0,3,32,7,'#47694728');
 c.strokeStyle='#ad7548';c.lineWidth=7;c.beginPath();c.moveTo(-23,-22);c.bezierCurveTo(-47,-18,-47,-48,-36,-51+(reduced?0:Math.sin(time*3)*5));c.stroke();
 for(const back of [true,false]){
  for(const [x,offset] of [[-17,0],[18,Math.PI]]){
   const angle=running?phase+offset+(back?Math.PI:0):0,dx=running?Math.sin(angle)*10:0,up=running?Math.max(0,Math.cos(angle))*7:0;
   c.strokeStyle=back?'#95623f':'#c78b53';c.lineWidth=7;c.beginPath();c.moveTo(x,-20+bob);c.quadraticCurveTo(x+dx*.4,-9,x+dx,-1-up);c.stroke();oval(x+dx+3,-1-up,7,3,c.strokeStyle);
  }
  if(back){shape(`M-28 ${-24+bob}Q-18 ${-43+bob} 13 ${-35+bob}Q32 ${-34+bob} 30 -19Q7 -7-19 -14Z`,'#c58b53');}
 }
 c.translate(22,-29+bob+(cat.crouching?6:0));
 shape('M-14-9-17-30-4-23Q4-28 12-22L23-29 20-8Q28 6 12 13Q-10 15-17 2Z','#ce965b');
 shape('M-13-24-7-17-12-14Z','#dca889',null);shape('M17-23 11-17 17-14Z','#dca889',null);
 oval(4,4,14,8,'#e6bf89');oval(-3,-8,5,6,'#eadf9c');oval(11,-9,5,6,'#eadf9c');oval(-1,-8,1.5,4,'#374b36');oval(13,-9,1.5,4,'#374b36');
 shape('M3 0 10 0 7 4Z','#78503b');c.strokeStyle='#795a3d';c.lineWidth=1;c.beginPath();c.moveTo(7,4);c.quadraticCurveTo(4,9,0,6);c.moveTo(7,4);c.quadraticCurveTo(11,9,15,5);c.moveTo(-5,3);c.lineTo(-22,0);c.moveTo(-5,6);c.lineTo(-23,8);c.moveTo(16,2);c.lineTo(30,-3);c.moveTo(17,5);c.lineTo(31,7);c.stroke();
 c.strokeStyle=cat.id===1?'#366d99':'#a64a36';c.lineWidth=4;c.beginPath();c.moveTo(-13,10);c.quadraticCurveTo(0,18,14,12);c.stroke();
 c.restore();
 if(cat.crouching||cat.stun){c.save();c.fillStyle=cat.stun?'#f9e09a':'#b84734';c.font='bold 22px Arial';c.textAlign='center';c.fillText(cat.stun?'✦':'!',cat.x,cat.y-69);c.restore();}
}
