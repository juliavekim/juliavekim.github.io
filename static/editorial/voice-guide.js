(() => {
  'use strict';
  const trigger = document.getElementById('voice-guide-toggle');
  const panel = document.getElementById('voice-guide-panel');
  if (!trigger || !panel) return;
  const $ = id => document.getElementById(id);
  const status = $('voice-guide-status'), transcript = $('voice-guide-transcript');
  const play = $('voice-guide-play'), pause = $('voice-guide-pause'), stop = $('voice-guide-stop');
  const next = $('voice-guide-next'), previous = $('voice-guide-previous'), rate = $('voice-guide-rate');
  const sections = [
    {label:'About Julia', selector:'.intro .bio-copy', intro:'First, a little about Julia.'},
    {label:'Research', selector:'#research', intro:'Next, Julia’s research highlights.'},
    {label:'News', selector:'#news', intro:'Here are some recent updates.'},
    {label:'Miscellaneous', selector:'#misc', intro:'Finally, a few personal interests.'},
    {label:'Contact', selector:'#contact', intro:'Here is how to get in touch.'}
  ];
  let index=0, active=false, paused=false, audio=null, requestId=0, lastTrigger=null;
  const synth = window.speechSynthesis;
  const clean = el => {
    if (!el) return '';
    const copy=el.cloneNode(true);
    copy.querySelectorAll('script,style,svg,video,button,nav,.project-media,.research-cue,.section-title svg,[aria-hidden="true"]').forEach(n=>n.remove());
    return (copy.innerText || copy.textContent || '').replace(/\s+/g,' ').trim();
  };
  const locale = () => ({fr:'fr-FR',tr:'tr-TR',en:'en-US'})[(document.documentElement.lang||'en').slice(0,2)]||'en-US';
  const languageName = () => ({fr:'Français',tr:'Türkçe',en:'English'})[(document.documentElement.lang||'en').slice(0,2)]||'English';
  const isEnglish = () => locale().startsWith('en');
  function narration(i) {
    const s=sections[i], el=document.querySelector(s.selector);
    if (!el) return '';
    // Narrate actual page content, including translated text if the language picker is active.
    let content=clean(el);
    if (s.label==='Research') {
      const heading=el.querySelector('h2'), intro=el.querySelector('.research-intro');
      const projects=[...el.querySelectorAll('.project')].map(p=>{
        const title=p.querySelector('h3,h4,.project-title');
        return title ? title.textContent.trim() : '';
      }).filter(Boolean);
      content=[heading?.textContent, intro?.textContent, projects.length?'Projects include: '+projects.join('; '):''].filter(Boolean).join('. ');
    }
    const prefix=isEnglish()?s.intro:'';
    return [prefix,content].filter(Boolean).join(' ').slice(0,4000);
  }
  function setStatus(s){status.textContent=s;}
  function closeAudio(){
    requestId++;
    if(audio){audio.pause();audio.src='';audio=null;}
    if(synth)synth.cancel();
    paused=false;active=false;
    pause.textContent='Pause';pause.disabled=true;
  }
  function chooseVoice(){
    if(!synth)return null;
    const voices=synth.getVoices().filter(v=>v.lang.toLowerCase().startsWith(locale().slice(0,2).toLowerCase()));
    return voices.find(v=>/Samantha|Ava|Jenny|Aria|Google.*(US|UK)|Amélie|Deniz|natural|premium|enhanced/i.test(v.name))||voices[0]||null;
  }
  function browserSpeak(text,id){
    if(!synth||typeof SpeechSynthesisUtterance==='undefined'){setStatus('Audio is unavailable in this browser. Read the transcript below.');active=false;return;}
    const utterance=new SpeechSynthesisUtterance(text);
    utterance.lang=locale();utterance.rate=Number(rate.value);utterance.pitch=1;
    const voice=chooseVoice();if(voice)utterance.voice=voice;
    utterance.onend=()=>{if(id===requestId){active=false;setStatus('Finished. Choose Next section to continue.');pause.disabled=true;}};
    utterance.onerror=()=>{if(id===requestId){active=false;setStatus('Could not play audio. The transcript remains available.');pause.disabled=true;}};
    synth.speak(utterance);active=true;pause.disabled=false;setStatus('Reading '+sections[index].label+'.');
  }
  async function speak(i){
    closeAudio();index=(i+sections.length)%sections.length;
    const text=narration(index);
    transcript.textContent=text||'No readable text found for this section.';
    $('voice-guide-section').textContent=sections[index].label;
    if(!text){setStatus('Nothing to read here.');return;}
    const id=requestId;
    setStatus('Preparing audio…');
    // Prefer securely proxied premium TTS when deployed. Never put API keys in the browser.
    try {
      const response=await fetch('/.netlify/functions/voice-guide',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,language:locale()})});
      if(!response.ok)throw Error('TTS not configured');
      const blob=await response.blob();
      if(id!==requestId)return;
      audio=new Audio(URL.createObjectURL(blob));audio.playbackRate=Number(rate.value);
      audio.onended=()=>{if(id===requestId){active=false;pause.disabled=true;setStatus('Finished. Choose Next section to continue.');URL.revokeObjectURL(audio.src);}};
      audio.onerror=()=>{if(id===requestId){setStatus('Audio playback failed.');active=false;}};
      await audio.play();active=true;pause.disabled=false;setStatus('Reading '+sections[index].label+'.');
    } catch(e) {
      if(id!==requestId)return;
      browserSpeak(text,id);
    }
  }
  trigger.addEventListener('click',()=>{
    const opening=panel.hidden;
    panel.hidden=!opening;trigger.setAttribute('aria-expanded',String(opening));
    if(opening){lastTrigger=trigger;setStatus('Ready. Select Play to hear the biography, or choose a section.');}
    else{closeAudio();lastTrigger?.focus();}
  });
  play.addEventListener('click',()=>speak(index));
  next.addEventListener('click',()=>speak(index+1));
  previous.addEventListener('click',()=>speak(index-1));
  stop.addEventListener('click',()=>{closeAudio();setStatus('Stopped.');});
  pause.addEventListener('click',()=>{
    if(!active&&!paused)return;
    if(paused){if(audio)audio.play();else synth?.resume();paused=false;pause.textContent='Pause';setStatus('Reading '+sections[index].label+'.');}
    else{if(audio)audio.pause();else synth?.pause();paused=true;pause.textContent='Resume';setStatus('Paused.');}
  });
  rate.addEventListener('change',()=>{if(audio)audio.playbackRate=Number(rate.value);else if(active&&!paused)speak(index);});
  $('voice-guide-close').addEventListener('click',()=>{closeAudio();panel.hidden=true;trigger.setAttribute('aria-expanded','false');trigger.focus();});
  panel.addEventListener('keydown',e=>{if(e.key==='Escape'){$('voice-guide-close').click();}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&active&&!paused){if(audio)audio.pause();else synth?.pause();paused=true;pause.textContent='Resume';setStatus('Paused while this tab is hidden.');}});
  document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>{closeAudio();setStatus('Language changed. Select Play to hear this section in '+languageName()+'.');}));
  window.addEventListener('pagehide',closeAudio);
  // A concise transcript and standard links/buttons remain usable without audio.
})();