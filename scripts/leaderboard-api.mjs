export function scoreHandler(store){
 return async(req,res)=>{
  res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');
  try{
   const url=new URL(req.url,'http://localhost');
   if(url.searchParams.has('mode')&&url.searchParams.get('mode')!=='hard'){res.statusCode=400;res.end(JSON.stringify({error:'Only hard-mode scores qualify.'}));return;}
   if(req.method==='GET'){res.end(JSON.stringify({entries:await store.list()}));return;}
   if(req.method!=='POST'){res.statusCode=405;res.setHeader('Allow','GET, POST');res.end('{}');return;}
   if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host){res.statusCode=403;res.end('{}');return;}
   let value=req.body;
   if(value===undefined){let body='';for await(const chunk of req){body+=chunk;if(body.length>2048)throw Error('Invalid score');}value=JSON.parse(body);}
   else if(typeof value==='string')value=JSON.parse(value);
   res.end(JSON.stringify(await store.save(value)));
  }catch(error){res.statusCode=error.message==='Invalid score'||error instanceof SyntaxError?400:503;res.end(JSON.stringify({error:res.statusCode===400?'Invalid score.':'Scores are temporarily unavailable. Try again.'}));}
 };
}
