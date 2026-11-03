(() => {
 const button=document.querySelector('.bio-listen'); if(!button)return;
 const audio=new Audio();audio.preload='none';
 const labels={en:{play:'Listen',pause:'Pause',label:'Listen to my bio',stop:'Pause narration',error:'Try again'},fr:{play:'Écouter',pause:'Pause',label:'Écouter ma présentation',stop:'Mettre en pause',error:'Réessayer'},tr:{play:'Dinle',pause:'Duraklat',label:'Biyografimi dinle',stop:'Seslendirmeyi duraklat',error:'Tekrar dene'}};
 let lang='',failed=false;
 const speaker='<path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>';
 function render(){const l=labels[lang];const playing=!audio.paused;button.querySelector('span').textContent=failed?l.error:playing?l.pause:l.play;button.setAttribute('aria-label',playing?l.stop:l.label);button.setAttribute('aria-pressed',String(playing));button.querySelector('svg').innerHTML=playing?'<path d="M8 5v14M16 5v14" stroke-width="3"/>':speaker;}
 function sync(){const next=(document.documentElement.lang||'en').split('-')[0];const target=labels[next]?next:'en';if(target===lang)return;audio.pause();lang=target;failed=false;audio.src='/editorial/speech/bio-'+lang+'.mp3';render();}
 button.addEventListener('click',async()=>{if(!audio.paused){audio.pause();return;}failed=false;try{await audio.play()}catch(e){failed=true;render()}});
 ['play','pause','ended'].forEach(e=>audio.addEventListener(e,render));audio.addEventListener('error',()=>{failed=true;render()});
 new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});sync();
 window.addEventListener('pagehide',()=>audio.pause());
})();
