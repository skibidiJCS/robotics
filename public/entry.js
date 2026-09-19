// A document load starts at the village; room visits happen within that document.
// Gameplay has its own document and therefore survives refresh on its own URL.
(() => {
 const explicit=location.pathname.split('/')[1];
 let preferred=(navigator.language||'en').toLowerCase().startsWith('fr')?'fr':'en';
 try{preferred=localStorage.getItem('smurf-language')||preferred;}catch{}
 const lang=['en','fr'].includes(explicit)?explicit:preferred;
 const part=location.pathname.split('/')[2]||'';
 const game=['play','game','competition'].includes(part)||location.pathname==='/play/';
 const destination=`/${lang}/${game?'play':'village'}/`;
 if(location.pathname!==destination)location.replace(destination);
})();
