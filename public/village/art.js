import {GROUND,WIDTH,houses,platforms,berries,walkPose} from './physics.js';
const ink='#5d735b';
function path(c,commands,fill,stroke=ink,width=2){c.beginPath();commands(c);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
function oval(c,x,y,rx,ry,fill,stroke=ink,w=2){path(c,c=>c.ellipse(x,y,rx,ry,0,0,Math.PI*2),fill,stroke,w);}
function line(c,points,color=ink,w=2){path(c,c=>points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y)),null,color,w);}
function leaf(c,x,y,size,color,flip=1){c.save();c.translate(x,y);c.scale(flip,1);path(c,c=>{c.moveTo(0,0);c.quadraticCurveTo(-size,-size*1.4,-size*1.1,-size*.25);c.quadraticCurveTo(-size*.9,size*.3,0,0);},color,ink,1.5);c.restore();}
export function tree(c,x,y,scale=1){c.save();c.translate(x,y);c.scale(scale,scale);path(c,c=>{c.moveTo(-18,0);c.quadraticCurveTo(-6,-110,-16,-232);c.lineTo(14,-230);c.quadraticCurveTo(9,-100,27,0);},'#b3ac87','#8f9874',2);line(c,[[4,-70],[-1,-190]],'#929c78',1);path(c,c=>{c.moveTo(-105,-172);c.bezierCurveTo(-156,-199,-113,-258,-86,-258);c.bezierCurveTo(-105,-302,-45,-331,-19,-307);c.bezierCurveTo(5,-353,66,-320,66,-292);c.bezierCurveTo(120,-298,142,-242,111,-220);c.bezierCurveTo(148,-169,83,-150,59,-171);c.bezierCurveTo(12,-144,-29,-163,-49,-158);c.quadraticCurveTo(-94,-141,-105,-172);},'#b9c99e','#90a57c',2);line(c,[[-52,-239],[-23,-218],[-27,-187]],'#9eb186',1.5);line(c,[[53,-276],[31,-241],[50,-218]],'#9eb186',1.5);c.restore();}
function mushroom(c,x,y,size,color){c.save();c.translate(x,y);c.scale(size,size);path(c,c=>{c.moveTo(-8,0);c.quadraticCurveTo(-6,-16,-4,-23);c.lineTo(7,-23);c.lineTo(9,0);},'#e5dfbd','#98a47d',1);path(c,c=>{c.moveTo(-24,-20);c.bezierCurveTo(-22,-39,10,-46,22,-22);c.quadraticCurveTo(0,-13,-24,-20);},color,'#8b9b77',1);oval(c,-8,-28,4,3,'#eee8cb',null);oval(c,8,-31,4,3,'#eee8cb',null);c.restore();}
export function drawHouse(c,h,tick,active){c.save();c.translate(h.x,GROUND);oval(c,0,3,163,15,'#899d7930',null);
 path(c,c=>{c.moveTo(-103,-8);c.bezierCurveTo(-119,-78,-93,-157,-89,-217);c.lineTo(86,-217);c.bezierCurveTo(100,-142,102,-57,111,-8);c.quadraticCurveTo(8,13,-103,-8);},'#e8dfbb',ink,2.5);
 path(c,c=>{c.moveTo(-111,-164);c.quadraticCurveTo(-106,-202,-100,-216);c.lineTo(100,-216);c.quadraticCurveTo(106,-191,111,-164);c.quadraticCurveTo(0,-143,-111,-164);},'#d0c9a5',null);
 path(c,c=>{c.moveTo(-177,-198);c.bezierCurveTo(-151,-218,-134,-240,-111,-281);c.bezierCurveTo(-83,-344,10,-372,72,-323);c.bezierCurveTo(110,-299,120,-235,174,-201);c.quadraticCurveTo(194,-186,171,-180);c.bezierCurveTo(93,-157,-88,-167,-169,-175);c.quadraticCurveTo(-194,-178,-177,-198);},h.color,ink,2.7);
 c.save();c.beginPath();c.moveTo(-177,-198);c.bezierCurveTo(-151,-218,-134,-240,-111,-281);c.bezierCurveTo(-83,-344,10,-372,72,-323);c.bezierCurveTo(110,-299,120,-235,174,-201);c.lineTo(174,-180);c.lineTo(-170,-175);c.clip();oval(c,-79,-277,27,35,'#efe9d0',null);oval(c,29,-310,25,17,'#efe9d0',null);oval(c,96,-237,24,32,'#efe9d0',null);oval(c,-131,-196,22,17,'#efe9d0',null);oval(c,7,-208,30,19,'#efe9d0',null);c.restore();
 path(c,c=>{c.moveTo(-34,-4);c.lineTo(-34,-94);c.bezierCurveTo(-34,-151,39,-146,38,-94);c.lineTo(40,-4);c.closePath();},active?'#697d60':'#ab9470',ink,2.5);line(c,[[-22,-98],[-22,-8]],'#8e805f',1);line(c,[[-6,-124],[-6,-9]],'#8e805f',1);line(c,[[10,-123],[10,-8]],'#8e805f',1);line(c,[[27,-103],[27,-9]],'#8e805f',1);oval(c,23,-62,3.5,3.5,'#536b52',null);
 for(const x of [-72,76]){oval(c,x,-106,22,25,'#f0eacd',ink,2);oval(c,x,-106,16,19,'#94b2ad',null);line(c,[[x,-125],[x,-87]],ink,2);line(c,[[x-16,-106],[x+16,-106]],ink,2);line(c,[[x-28,-78],[x+28,-78]],'#8fa07a',4);}
 path(c,c=>{c.moveTo(-46,0);c.lineTo(-56,11);c.lineTo(54,11);c.lineTo(45,0);c.closePath();},'#c7c6a6','#9ca889',1.5);line(c,[[-49,7],[49,7]],'#a9b294',1);
 for(const x of [-117,117]){path(c,c=>{c.moveTo(x-14,-13);c.lineTo(x-10,2);c.lineTo(x+10,2);c.lineTo(x+15,-13);c.closePath();},'#be9275','#8b8f6f',1.5);leaf(c,x,-14,16,'#8fa877',1);leaf(c,x,-14,15,'#9bb883',-1);}
 c.restore();}
export function drawBerry(c,b,t=0){c.save();c.translate(b.x,b.y+Math.sin(t*2+b.id)*2);oval(c,-6,1,6,7,'#89829e','#666c7b',1.3);oval(c,5,2,6,7,'#817892','#666c7b',1.3);oval(c,0,-6,6,7,'#9389a8','#666c7b',1.3);leaf(c,1,-12,7,'#8aab77',-1);c.restore();}
export function drawWorld(c,camera,viewWidth,time,collected,labels,near){
 c.fillStyle='#efefdf';c.fillRect(camera-viewWidth/2,0,viewWidth,800);
 path(c,c=>{c.moveTo(-400,GROUND);for(let x=-400;x<WIDTH+400;x+=250){c.quadraticCurveTo(x+100,GROUND-190,x+250,GROUND-155);}c.lineTo(WIDTH+650,GROUND+20);c.closePath();},'#d6dfbe',null);
 path(c,c=>{c.moveTo(-50,GROUND-4);for(let x=0;x<WIDTH+200;x+=160)c.quadraticCurveTo(x+70,GROUND-12,x+160,GROUND-3);c.lineTo(WIDTH+100,850);c.lineTo(-50,850);c.closePath();},'#b9ce9f','#9bb581',2);
 path(c,c=>{c.moveTo(-50,GROUND+14);for(let x=0;x<WIDTH+100;x+=220)c.quadraticCurveTo(x+100,GROUND+27,x+220,GROUND+13);c.lineTo(WIDTH+100,GROUND+58);for(let x=WIDTH+100;x>-250;x-=220)c.quadraticCurveTo(x-100,GROUND+65,x-220,GROUND+51);c.closePath();},'#ddd8b7',null);
 for(let x=25;x<WIDTH;x+=107){line(c,[[x,GROUND+111],[x-3,GROUND+104],[x,GROUND+108],[x+5,GROUND+101]],'#95ad7d',1.5);if(x%3===0)oval(c,x+34,GROUND+35,3,1.2,'#b6b596',null);}
 for(const h of houses)if(Math.abs(h.x-camera)<viewWidth/2+240)drawHouse(c,h,time,near===h.route);
 for(const p of platforms){if(Math.abs(p.x-camera)>viewWidth/2+160)continue;line(c,[[p.x+18,p.y+4],[p.x+18,GROUND],[p.x+30,GROUND]],'#a4a481',7);line(c,[[p.x+p.w-18,p.y+4],[p.x+p.w-18,GROUND],[p.x+p.w-7,GROUND]],'#a4a481',7);path(c,c=>{c.moveTo(p.x-4,p.y);c.lineTo(p.x+p.w+4,p.y-2);c.lineTo(p.x+p.w,p.y+10);c.lineTo(p.x,p.y+12);c.closePath();},'#b5b08a',ink,1.7);line(c,[[p.x+8,p.y+5],[p.x+p.w-12,p.y+3]],'#8b9471',1);}
 for(const b of berries)if(!collected.includes(b.id)&&Math.abs(b.x-camera)<viewWidth/2+25)drawBerry(c,b,time);
 tree(c,40,GROUND+22,1.23);tree(c,WIDTH-65,GROUND+22,1.15);
 for(const x of [100,675,1210,1770,2350,2900,3470,4240])mushroom(c,x,GROUND+85,.75,x%2?'#b98b71':'#b6b19a');
 c.save();c.translate(280,GROUND);line(c,[[0,0],[1,-85]],'#9a9873',8);c.restore();
 c.save();c.translate(670,GROUND+5);path(c,c=>{c.moveTo(-23,-20);c.lineTo(-17,0);c.lineTo(19,0);c.lineTo(25,-20);c.closePath();},'#c1a57c',ink,1.4);path(c,c=>{c.moveTo(-16,-20);c.bezierCurveTo(-14,-48,17,-48,19,-20);},null,ink,2);for(let x=-16;x<20;x+=7)line(c,[[x,-18],[x+1,-1]],'#a08d69',1);if(collected.length){for(let i=0;i<Math.min(collected.length,6);i++)oval(c,-15+i*6,-22-(i%2)*4,4,4,'#8b809c','#706e7d',1);}c.fillStyle='#768764';c.textAlign='center';c.font='12px Georgia';c.fillText(`${collected.length} / 12`,2,24);c.font='11px Georgia';c.fillText(labels.berries,2,42);c.restore();
}
function boot(c,x,y,fill){path(c,c=>{c.moveTo(x-5,y-6);c.lineTo(x+2,y-6);c.quadraticCurveTo(x+4,y-2,x+8,y-2);c.bezierCurveTo(x+12,y-1,x+12,y+4,x+7,y+6);c.lineTo(x-5,y+6);c.quadraticCurveTo(x-8,y+3,x-5,y-6);},fill,ink,1.5);}
function leg(c,hip,foot,fill){const lift=Math.max(0,-6-foot.y),knee={x:(hip[0]+foot.x)/2+lift*.45,y:(hip[1]+foot.y)/2};const points=[hip,[knee.x,knee.y],[foot.x,foot.y-3]];c.lineJoin='round';c.lineCap='round';line(c,points,ink,9);line(c,points,fill,6);boot(c,foot.x,foot.y,fill);}
function arm(c,x,y,swing,fill){line(c,[[x,y],[x+swing*.55,y+10],[x+swing,y+18]],ink,7);line(c,[[x,y],[x+swing*.55,y+10],[x+swing,y+18]],fill,5);oval(c,x+swing,y+18,4.5,4.5,fill,ink,1);}
export function drawSmurf(c,p,time){c.save();c.translate(p.x,p.y);c.scale(p.facing*.88,.88);const run=Math.abs(p.vx)>10&&p.grounded,pose=walkPose(p.walk,run),swing=run?Math.cos(p.walk/110*Math.PI*2)*9:0,bob=run?-Math.abs(Math.sin(p.walk/110*Math.PI*2))*1.5:0;
 if(!p.grounded){pose.front={x:7,y:-12};pose.back={x:-7,y:-8};}
 oval(c,0,3,23,5,'#60784f22',null);
 leg(c,[-2,-22+bob],pose.back,'#d8e1cf');
 arm(c,4,-45+bob,swing,'#70aebf');
 leg(c,[1,-22+bob],pose.front,'#f8f5e7');
 c.translate(0,bob);
 path(c,c=>{c.moveTo(-10,-30);c.lineTo(-9,-18);c.quadraticCurveTo(0,-15,11,-20);c.lineTo(11,-30);c.closePath();},'#f8f5e7',ink,1.5);
 path(c,c=>{c.moveTo(-6,-49);c.bezierCurveTo(-12,-43,-12,-32,-9,-28);c.quadraticCurveTo(0,-24,12,-29);c.quadraticCurveTo(15,-38,6,-49);c.closePath();},'#7cb9ca',ink,1.7);
 arm(c,-3,-43,-swing,'#8ac2d0');
 oval(c,-16,-57,5,7,'#87bfce',ink,1.4);oval(c,0,-58,18,20,'#8bc5d5',ink,1.7);oval(c,17,-52,10,6,'#8bc5d5',ink,1.4);
 const blink=time%5>.1;oval(c,4,-60,4,blink?6:1,'#fff9e9',ink,1);oval(c,12,-60,3.5,blink?5:1,'#fff9e9',ink,1);if(blink){oval(c,6,-60,1.4,2.6,'#526d72',null);oval(c,13,-60,1.3,2.5,'#526d72',null);}path(c,c=>{c.moveTo(2,-44);c.quadraticCurveTo(9,-39,15,-44);},null,ink,1.2);
 path(c,c=>{c.moveTo(-19,-67);c.bezierCurveTo(-20,-92,5,-110,22,-91);c.bezierCurveTo(34,-77,18,-73,15,-80);c.quadraticCurveTo(17,-73,20,-66);c.quadraticCurveTo(1,-71,-19,-67);},'#f8f5e7',ink,1.7);path(c,c=>{c.moveTo(-19,-68);c.quadraticCurveTo(0,-75,20,-67);c.lineTo(19,-62);c.quadraticCurveTo(0,-68,-18,-62);c.closePath();},'#f8f5e7',ink,1.4);c.restore();}
