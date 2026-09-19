export const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderRoom(route,lang){
 if(route==='game')return `<h1>${lang==='en'?'Escape Azrael':'Échappez à Azraël'}</h1><a href="/${lang==='en'?'en':'fr'}/play/" data-full-page>${lang==='en'?'Play':'Jouer'}</a>`;
 return '<h1>placeholder</h1>';
}
