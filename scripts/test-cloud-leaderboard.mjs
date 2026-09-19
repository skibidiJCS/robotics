import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {BlobPreconditionFailedError,BlobError} from '@vercel/blob';
import {cloudLeaderboard} from './cloud-leaderboard.mjs';
let stored=null,version=0;
const storage={
 async get(){return stored?{stream:new Response(stored).body,blob:{etag:String(version)}}:null;},
 async put(path,data,options){
  assert.equal(options.access,'private');
  if(stored&&!options.allowOverwrite)throw new BlobError();
  if(options.ifMatch&&options.ifMatch!==String(version))throw new BlobPreconditionFailedError();
  stored=data;version++;return {};
 }
};
const a=cloudLeaderboard(storage),b=cloudLeaderboard(storage);
await Promise.all([a.save({id:randomUUID(),name:'Sigma',mode:'hard',score:100}),b.save({id:randomUUID(),name:'f_u_c_k',mode:'hard',score:200})]);
assert.deepEqual(await cloudLeaderboard(storage).list(),[{name:'Player',score:200},{name:'Sigma',score:100}]);
await assert.rejects(a.save({id:randomUUID(),name:'Easy',mode:'easy',score:900}));
console.log('PASS: independent cloud instances preserve concurrent writes, hard-only validation and moderated names.');
