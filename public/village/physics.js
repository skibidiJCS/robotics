export const GROUND=620,WIDTH=4400,HEIGHT=800;
export const houses=[{route:'about',x:520,color:'#c77362'},{route:'team',x:1080,color:'#7596a9'},{route:'game',x:1640,color:'#c7aa6e'},{route:'robot',x:2200,color:'#c57360'},{route:'photos',x:2760,color:'#849e89'},{route:'journal',x:3320,color:'#a091ae'},{route:'media',x:3880,color:'#789eae'}];
export const platforms=[{x:777,y:GROUND-80,w:120},{x:1380,y:GROUND-105,w:120},{x:1900,y:GROUND-85,w:118},{x:2510,y:GROUND-90,w:130},{x:3060,y:GROUND-105,w:120},{x:4065,y:GROUND-65,w:140}];
export const berries=[[710,55],[835,165],[1270,55],[1440,190],[1840,55],[1960,175],[2440,55],[2575,180],[2985,55],[3120,190],[3580,55],[4140,145]].map(([x,h],id)=>({id,x,y:GROUND-h}));
export function createPlayer(x=400){return {x,y:GROUND,vx:0,vy:0,grounded:true,facing:1,walk:0};}
export function jump(p){if(p.grounded){p.vy=-770;p.grounded=false;return true;}return false;}
export function advance(p,input,dt){
 const desired=(input.left?-1:0)+(input.right?1:0),target=desired*(input.fast?530:265),accel=(input.fast?2800:1900)*dt;
 p.vx+=Math.sign(target-p.vx)*Math.min(Math.abs(target-p.vx),accel);if(input.jump)jump(p);
 p.x=Math.max(35,Math.min(WIDTH-35,p.x+p.vx*dt));if(p.x===35||p.x===WIDTH-35)p.vx=0;if(Math.abs(p.vx)>3){p.facing=p.vx>0?1:-1;p.walk+=Math.abs(p.vx)*dt;}
 const previous=p.y;p.vy+=1900*dt;p.y+=p.vy*dt;p.grounded=false;
 if(p.vy>=0){for(const platform of platforms){if(p.x>platform.x-12&&p.x<platform.x+platform.w+12&&previous<=platform.y+.1&&p.y>=platform.y){p.y=platform.y;p.vy=0;p.grounded=true;break;}}}
 if(p.y>=GROUND){p.y=GROUND;p.vy=0;p.grounded=true;}
}
export function touchedBerries(p,collected){return berries.filter(b=>!collected.includes(b.id)&&Math.hypot(p.x-b.x,p.y-38-b.y)<33).map(b=>b.id);}

export function walkPose(distance,moving){
 if(!moving)return {front:{x:7,y:-5},back:{x:-9,y:-5}};
 const phase=(distance/72)%1;
 function foot(t){t%=1;if(t<.6)return {x:12-24*t/.6,y:-5};const swing=(t-.6)/.4;return {x:-12+24*swing,y:-5-Math.sin(swing*Math.PI)*10};}
 return {front:foot(phase),back:foot(phase+.5)};
}
