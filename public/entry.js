// A document load starts at the village; room visits happen within that document.
// Gameplay has its own document and therefore survives refresh on its own URL.
(() => {
 const lang=location.pathname.split('/')[1]==='en'?'en':'fr';
 const part=location.pathname.split('/')[2]||'';
 const game=['play','game','competition'].includes(part)||location.pathname==='/play/';
 const destination=`/${lang}/${game?'play':'village'}/`;
 if(location.pathname!==destination)location.replace(destination);
})();
