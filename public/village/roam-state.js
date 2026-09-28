import { createNavigation } from './world-navigation.js';
import { places, toGame, HOUSE_RADIUS, SCALE } from './world-data.js';
export const bounds={left:50,right:1250,top:115,bottom:1045};
// Collision and drawing share the same shoreline and stone outlines.
function outline(x,y,points){return points.map(([dx,dy])=>({x:x+dx,y:y+dy}));}
export const obstacles=[
 {x:515,y:490,r:94,kind:'pond',points:outline(515,490,[[-90,-12],[-77,-39],[-42,-52],[-7,-48],[20,-64],[53,-58],[74,-33],[65,-8],[40,7],[32,37],[9,54],[-22,48],[-43,24],[-73,19]])},
 {x:860,y:665,r:64,kind:'rocks',points:outline(860,665,[[-55,8],[-45,-27],[-16,-44],[8,-39],[25,-50],[48,-26],[57,10],[38,39],[3,45],[-22,34],[-42,37]])},
 {x:465,y:725,r:58,kind:'log',points:outline(465,725,[[-53,12],[-46,-8],[39,-28],[52,-16],[48,5],[-34,29]])},
 ...places.map(place=>{const {x,y}=toGame(place.x,place.z),r=HOUSE_RADIUS/SCALE;return {x,y,r,kind:'house',points:Array.from({length:16},(_,i)=>({x:x+Math.cos(i*Math.PI/8)*r,y:y+Math.sin(i*Math.PI/8)*r}))};})
];
// Subdivide the shoreline so the visible bank and collision stay smooth.
for(const o of obstacles.filter(o=>o.kind==='pond'))for(let pass=0;pass<2;pass++)o.points=o.points.flatMap((p,i)=>{const n=o.points[(i+1)%o.points.length];return [{x:p.x*.75+n.x*.25,y:p.y*.75+n.y*.25},{x:p.x*.25+n.x*.75,y:p.y*.25+n.y*.75}];});

const spots=[[620,660],[1080,260],[1000,900],[220,850],[690,900],[1170,730],[680,350],[730,480],[290,300],[340,570],[540,830],[730,440]];
export const PLAYER_SPEED=270,BOOST_SPEED=400,CAT_MAX_SPEED=335;
export const powerSpots=[[250,460],[425,335],[750,320],[1030,490],[1040,835],[760,940],[345,835],[670,470],[270,600],[880,300]];
export const village = createNavigation({ bounds, obstacles, spots, powerSpots, player: [650,770], cats: [[270,310],[1080,340]] });
export const { blocked, routeTo } = village;
export const modes={easy:{cats:1,cat:145,cap:300,ramp:1.4,boost:1.12,acornEvery:11,acorns:1,warning:2,penalty:2},medium:{cats:1,cat:180,cap:325,ramp:1.7,boost:1,acornEvery:8,acorns:2,warning:1.7,penalty:3},hard:{cats:2,cat:210,cap:CAT_MAX_SPEED,ramp:2,boost:1,acornEvery:6,acorns:3,warning:1.4,penalty:4}};
export function createGame(mode='easy', environment=village){
 const settings=modes[mode]||modes.easy;mode=modes[mode]?mode:'easy';
 const {spots,powerSpots,player,cats}=environment;
 return {environment,mode,settings,phase:'ready',player:{x:player[0],y:player[1],facing:1,walk:0,vx:0,dx:0,dy:0},cats:cats.slice(0,settings.cats).map(([x,y],id)=>({id,x,y,facing:1,route:[],repath:0})),boost:0,protection:0,timeBonusEarned:0,lastTimeBonus:0,hazards:[],nextHazard:8,streak:0,streakUntil:0,powers:powerSpots.map(([x,y],i)=>({x,y,type:[1,5,9].includes(i)?'shield':'speed',readyAt:i===8?5:i===9?9:0})).filter(p=>mode!=='hard'||p.type==='speed'),remaining:60,score:0,found:0,elapsed:0,next:3,reason:null,friends:spots.slice(0,3).map(([x,y],id)=>({id,x,y})),target:null,route:[]};
}
export const rescueBonus=s=>s.mode==='hard'?Math.min(Math.max(0,30-s.timeBonusEarned),Math.max(0,2-Math.floor(s.elapsed/35))):Math.max(1,4-Math.floor(s.elapsed/45));
export const catSpeed=s=>Math.min(s.settings.cap,s.settings.cat+s.elapsed*s.settings.ramp+s.score*.018);
export const cats=s=>s.cats;

function move(p,x,y,distance,environment){const {bounds,blocked}=environment;const n=Math.hypot(x,y);if(!n)return;const dx=x/n*distance,dy=y/n*distance,ox=p.x,oy=p.y;const nx=Math.max(bounds.left,Math.min(bounds.right,p.x+dx)),ny=Math.max(bounds.top,Math.min(bounds.bottom,p.y+dy));if(!blocked(nx,p.y))p.x=nx;if(!blocked(p.x,ny))p.y=ny;const moved=Math.hypot(p.x-ox,p.y-oy);p.walk=(p.walk||0)+moved;p.vx=moved>.1?100:0;if(Math.abs(x)>.03)p.facing=x<0?-1:1;}
export function step(s,axes,dt){if(!['playing','explore'].includes(s.phase)||!Number.isFinite(dt)||dt<=0)return [];const {bounds,blocked,routeTo,spots}=s.environment;const playing=s.phase==='playing',events=[];if(s.mode==='hard')s.protection=0;if(playing){s.remaining=Math.max(0,s.remaining-dt);s.elapsed+=dt;s.boost=Math.max(0,s.boost-dt);if(!s.remaining){s.phase='ended';s.reason='time';s.player.vx=0;return ['end'];}}
 const delta=Math.min(dt,.05),p=s.player;let x=axes.x,y=axes.y;if(Math.hypot(x,y)>.03){s.target=null;s.route=[];}else if(s.target){if(!s.route.length)s.route=routeTo(p,s.target);const goal=s.route[0];if(goal){x=goal.x-p.x;y=goal.y-p.y;if(Math.hypot(x,y)<5){s.route.shift();if(!s.route.length)s.target=null;}}else s.target=null;}
 const before={x:p.x,y:p.y};p.vx=0;const speed=s.boost>0?BOOST_SPEED:PLAYER_SPEED;move(p,x,y,s.target?Math.min(speed*delta,Math.hypot(x,y)):speed*delta,s.environment);p.dx=(p.x-before.x)/delta;p.dy=(p.y-before.y)/delta;if(!playing)return events;
 for(const power of s.powers)if(power.readyAt<=s.elapsed&&Math.hypot(power.x-p.x,power.y-p.y)<32){power.readyAt=s.elapsed+(power.type==='speed'?10:17);if(power.type==='speed')s.boost=3.4*s.settings.boost;else s.protection=1;events.push(power.type);}
 for(const cat of s.cats){
  cat.vx=0;
  cat.stun=Math.max(0,(cat.stun||0)-delta);
  if(cat.stun)continue;
  cat.repath-=delta;
  if(cat.repath<=0){
   let target={x:p.x,y:p.y};
   if(cat.id===1&&Math.hypot(cat.x-p.x,cat.y-p.y)>165){
    // The second cat aims ahead, on the opposite side from the pursuer.
    const moving=Math.hypot(p.dx,p.dy)>10,heading=moving?Math.atan2(p.dy,p.dx):Math.atan2(p.y-s.cats[0].y,p.x-s.cats[0].x);
    const lead=s.cats[0],side=Math.sign((lead.x-p.x)*-Math.sin(heading)+(lead.y-p.y)*Math.cos(heading))||1;
    for(const amount of [1,.65,.3,0]){
     const candidate={x:Math.max(bounds.left+20,Math.min(bounds.right-20,p.x+Math.cos(heading)*125*amount+Math.sin(heading)*side*135*amount)),y:Math.max(bounds.top+20,Math.min(bounds.bottom-20,p.y+Math.sin(heading)*125*amount-Math.cos(heading)*side*135*amount))};
     if(!blocked(candidate.x,candidate.y)){target=candidate;break;}
    }
   }
   cat.aim=target;cat.route=routeTo(cat,target);cat.repath=.35+cat.id*.09;
  }
  while(cat.route.length&&Math.hypot(cat.route[0].x-cat.x,cat.route[0].y-cat.y)<6)cat.route.shift();
  const goal=cat.route[0];
  if(goal){
   // A short visible crouch precedes each faster pursuit burst.
   const cycle=(s.elapsed+cat.id*3.5)%9;
   cat.crouching=s.elapsed>7&&cycle<.8;
   cat.pouncing=s.elapsed>7&&cycle>=.8&&cycle<1.5;
   const speed=cat.crouching?0:cat.pouncing?Math.min(375,catSpeed(s)*1.4):catSpeed(s);
   const distance=Math.min(speed*delta,Math.hypot(goal.x-cat.x,goal.y-cat.y));
   const peers=s.cats.filter(other=>other!==cat);
   const directions=[[goal.x-cat.x,goal.y-cat.y]];
   const nearest=peers.find(other=>Math.hypot(other.x-cat.x,other.y-cat.y)<85);
   if(nearest){const dx=cat.x-nearest.x,dy=cat.y-nearest.y;directions.push([-dy,dx],[dy,-dx],[dx,dy]);}
   for(const [dx,dy] of directions){const proposal={...cat};move(proposal,dx,dy,distance,s.environment);if(peers.every(other=>Math.hypot(proposal.x-other.x,proposal.y-other.y)>=52)){Object.assign(cat,proposal);break;}}
  }
 }
 for(const cat of s.cats){
  const distance=Math.hypot(cat.x-p.x,cat.y-p.y);
  if(distance>52||!cat.stun)cat.contactBlocked=false;
  if(distance<32&&!cat.contactBlocked){
   if(s.protection){s.protection=0;cat.contactBlocked=true;cat.stun=1.2;events.push('shieldUsed');}
   else{s.phase='ended';s.reason='caught';s.player.vx=0;s.target=null;return ['end'];}
  }
 }
 if(s.elapsed>=s.nextHazard){
  s.nextHazard=s.elapsed+s.settings.acornEvery;
  for(let i=0;i<s.settings.acorns;i++){
   const angle=s.elapsed*.7+i*2.4;
   const x=Math.max(bounds.left+42,Math.min(bounds.right-42,p.x+(i?Math.cos(angle)*125:0)));
   const y=Math.max(bounds.top+42,Math.min(bounds.bottom-42,p.y+(i?Math.sin(angle)*125:0)));
   if(!blocked(x,y,42))s.hazards.push({x,y,impactAt:s.elapsed+s.settings.warning,hit:false});
  }
 }
 for(const hazard of s.hazards)if(!hazard.hit&&s.elapsed>=hazard.impactAt){
  hazard.hit=true;
  if(Math.hypot(hazard.x-p.x,hazard.y-p.y)<43){s.remaining=Math.max(0,s.remaining-s.settings.penalty);s.streak=0;events.push('acornHit');}
 }
 s.hazards=s.hazards.filter(h=>s.elapsed<h.impactAt+.6);
 if(!s.remaining){s.phase='ended';s.reason='time';s.player.vx=0;return ['end'];}

 for(const f of s.friends)if(Math.hypot(f.x-p.x,f.y-p.y)<35){s.streak=s.elapsed<=s.streakUntil?s.streak+1:1;s.streakUntil=s.elapsed+8;if(s.streak%3===0){s.score+=150;if(s.mode!=='hard')s.remaining+=2;}s.found++;s.score+=100;s.lastTimeBonus=rescueBonus(s);s.timeBonusEarned+=s.lastTimeBonus;s.remaining+=s.lastTimeBonus;events.push('found');if(s.streak%3===0)events.push('combo');let point;for(let i=0;i<spots.length;i++){point=spots[s.next++%spots.length];if(Math.hypot(point[0]-p.x,point[1]-p.y)>240&&!s.friends.some(o=>o!==f&&Math.hypot(point[0]-o.x,point[1]-o.y)<100))break;}[f.x,f.y]=point;}return events;}
const keys={ArrowLeft:[-1,0],KeyA:[-1,0],KeyQ:[-1,0],ArrowRight:[1,0],KeyD:[1,0],ArrowUp:[0,-1],KeyW:[0,-1],KeyZ:[0,-1],ArrowDown:[0,1],KeyS:[0,1]};
export function createControls(layout='all'){const held=new Map();let order=0,touch={x:0,y:0};return {setLayout(value){layout=value;held.clear();touch={x:0,y:0};},press(code){if(!keys[code]||(!code.startsWith('Arrow')&&layout!=='all'&&!({wasd:['KeyW','KeyA','KeyS','KeyD'],zqsd:['KeyZ','KeyQ','KeyS','KeyD'],arrows:[]}[layout]||[]).includes(code)))return false;if(!held.has(code))held.set(code,{axes:keys[code],order:++order});return true;},release(code){return held.delete(code);},touch(x,y){touch={x,y};},axes(){if(Math.hypot(touch.x,touch.y)>.05)return touch;let x=0,y=0,xOrder=0,yOrder=0;for(const h of held.values()){if(h.axes[0]&&h.order>xOrder){x=h.axes[0];xOrder=h.order;}if(h.axes[1]&&h.order>yOrder){y=h.axes[1];yOrder=h.order;}}return {x,y};},clear(){held.clear();touch={x:0,y:0};}};}
