import {readFile,mkdir,writeFile,rename} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';

const banned=/(blowjob|handjob|wank|masturb|orgasm|hentai|boob|tits|titt|cum|semen|pedo|molest|kys|stfu|wtf|fuck|fuk|fck|shit|bitch|biatch|cunt|pussy|dick|cock|porn|penis|vagina|nigg|fagg|retard|whore|slut|bastard|asshole|motherf|hitler|nazi|rape|rapist|kill[sz]?yourself|killyou|suicide|suckmy|deeznuts|sex|merde|putain|pute|salope|connard|connasse|encul|nique|batard|tabarn|tabern|caliss|calice|ostie|esti|criss|sacrament|suce|couille|bite|pd$)/;
export function schoolName(value){
 if(typeof value!=='string')return 'Player';
 const name=value.normalize('NFKC').trim().replace(/\s+/g,' ');
 if(!name||name.length>20||! /^[\p{L}\p{N} _-]+$/u.test(name))return 'Player';
 const folded=name.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/[0134578]/g,c=>({'0':'o','1':'i','3':'e','4':'a','5':'s','7':'t','8':'b'}[c])).replace(/[^a-z]/g,'');
 const short=folded.replace(/(.)\1+/g,'$1');
 const ascii=name.normalize('NFD').replace(/\p{M}/gu,'');
 if(!/^[a-zA-Z0-9 _-]+$/.test(ascii))return 'Player';
 return banned.test(folded)||banned.test(short)||/^(ass|fag|damn)$/.test(folded)?'Player':name;
}
export function scoreEntry(value){
 if(value?.mode!=='hard'||!Number.isSafeInteger(value.score)||value.score<0||value.score>1000000||value.score%100||typeof value.id!=='string'||! /^[a-f0-9-]{36}$/.test(value.id))throw new Error('Invalid score');
 return {id:value.id,name:schoolName(value.name),score:value.score,mode:'hard',date:Date.now()};
}
export const topScores=rows=>rows.filter(r=>r.mode==='hard').sort((a,b)=>b.score-a.score||a.date-b.date).slice(0,20).map(({name,score})=>({name,score}));
export function leaderboardStore(file=resolve('.data/leaderboard.json')){
 let queue=Promise.resolve();
 async function read(){try{return JSON.parse(await readFile(file,'utf8'));}catch(e){if(e.code==='ENOENT')return [];throw e;}}
 const list=async ()=>topScores(await read());
 function save(value){
  const job=queue.then(async()=>{
   const row=scoreEntry(value),rows=await read(),existing=rows.find(r=>r.id===row.id);
   if(existing)return {name:existing.name,entries:await list()};
   rows.push(row);
   await mkdir(dirname(file),{recursive:true});
   await writeFile(file+'.tmp',JSON.stringify(rows));
   await rename(file+'.tmp',file);
   return {name:row.name,entries:await list(row.mode)};
  });
  queue=job.catch(()=>{});return job;
 }
 return {list,save};
}
