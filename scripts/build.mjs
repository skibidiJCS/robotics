import './build-website.mjs';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {routes,content,members} from '../src/content.mjs';
const template=await readFile('public/village/index.html','utf8');
await writeFile('dist/village/content.js',`export const content=${JSON.stringify(content)};\nexport const members=${JSON.stringify(members)};\nexport const routes=${JSON.stringify(routes)};\n`);
for(const lang of ['fr','en']){
 await mkdir(`dist/${lang}/play`,{recursive:true});
 await writeFile(`dist/${lang}/play/index.html`,template.replace('<html lang="fr">',`<html lang="${lang}">`));
}
await mkdir('dist/play',{recursive:true});
await writeFile('dist/play/index.html',template);
console.log('Built the village website and separate game.');
