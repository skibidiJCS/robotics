import {get,put,BlobPreconditionFailedError} from '@vercel/blob';
import {scoreEntry,topScores} from './leaderboard.mjs';
const path='leaderboard/hard-v1.json';
export function cloudLeaderboard(storage={get,put}){
 async function read(){const blob=await storage.get(path,{access:'private',useCache:false});return blob?{rows:await new Response(blob.stream).json(),etag:blob.blob.etag}:{rows:[],etag:null};}
 return {
  async list(){return topScores((await read()).rows);},
  async save(value){
   const entry=scoreEntry(value);
   for(let attempt=0;attempt<6;attempt++){
    const {rows,etag}=await read(),existing=rows.find(r=>r.id===entry.id);
    if(existing)return {name:existing.name,entries:topScores(rows)};
    const updated=[...rows,entry].sort((a,b)=>b.score-a.score||a.date-b.date).slice(0,1000);
    try{
     await storage.put(path,JSON.stringify(updated),{access:'private',contentType:'application/json',addRandomSuffix:false,allowOverwrite:!!etag,...(etag?{ifMatch:etag}:{})});
     return {name:entry.name,entries:topScores(updated)};
    }catch(error){
     if(!(error instanceof BlobPreconditionFailedError)){if(etag||!(await read()).etag)throw error;}
     await new Promise(resolve=>setTimeout(resolve,30+attempt*50));
    }
   }
   throw Error('Please retry');
  }
 };
}
