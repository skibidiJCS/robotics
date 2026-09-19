import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {randomUUID} from 'node:crypto';
import {schoolName,leaderboardStore} from './leaderboard.mjs';

for(const name of ['Smurfy','Élodie','Sigma','Skibidi Rizz','Ohio','Player 42'])assert.equal(schoolName(name),name);
for(const name of ['',null,'fuck','F_U_C_K','fuuuck','sh1t','b1tch','p u t a i n','tabarnak','porn','nazi','kill yourself','<script>alert(1)</script>','a'.repeat(21),'fυck'])assert.equal(schoolName(name),'Player',String(name));
const directory=await mkdtemp(join(tmpdir(),'smurf-scores-'));
try{
 const file=join(directory,'scores.json'),store=leaderboardStore(file);
 const row={id:randomUUID(),name:'Skibidi',score:500,mode:'hard'};
 await store.save(row);await store.save(row);
 assert.equal((await store.list('hard')).length,1,'Retry does not duplicate score');
 await Promise.all(Array.from({length:8},(_,i)=>store.save({id:randomUUID(),name:i?'Smurf':'f_u_c_k',score:i*100,mode:'hard'})));
 const entries=await store.list();assert.equal(entries.length,9);assert.equal(entries.at(-1).name,'Player');assert.equal(entries[0].score,700);
 assert.deepEqual(await leaderboardStore(file).list(),entries);
 for(const changed of [{score:-100},{score:1.2},{score:101},{score:Infinity},{mode:'invalid'},{mode:'easy'},{mode:'medium'},{id:'bad'}])await assert.rejects(store.save({...row,...changed}));
 assert.equal((await store.list()).length,9);
}finally{await rm(directory,{recursive:true,force:true});}
console.log('PASS: username filtering, allowed slang, score validation, concurrent saves, deduplication, difficulty boards and durable storage.');
