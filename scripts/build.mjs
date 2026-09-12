import {mkdir,writeFile,readFile,cp,rm} from 'node:fs/promises';
import {routes,content,members} from '../src/content.mjs';
const template=await readFile('public/village/index.html','utf8');
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await cp('public/assets','dist/assets',{recursive:true});
await cp('public/village','dist/village',{recursive:true});
await writeFile('dist/village/content.js',`export const content=${JSON.stringify(content)};\nexport const members=${JSON.stringify(members)};\nexport const routes=${JSON.stringify(routes)};\n`);
await writeFile('dist/index.html',template);
for(const lang of ['fr','en'])for(const route of [...routes,'competition']){
 const directory=`dist/${lang}/${route}`;
 await mkdir(directory,{recursive:true});
 await writeFile(`${directory}/index.html`,template.replace('<html lang="fr">',`<html lang="${lang}">`));
}
await mkdir('dist/play',{recursive:true});
await writeFile('dist/play/index.html',template);
console.log('Built the full-screen Smurf village and integrated rooms.');
