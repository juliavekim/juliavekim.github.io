/* Procedural 3D illustration; these are not observed stellar positions. */
window.createClusterView = root => {
  const figure=root.querySelector('.detail-figure'), film=figure?.querySelector('.project-media');
  if(!film)return;
  const credit=figure.querySelector('.photo-credit');
  const tabs=document.createElement('div');tabs.className='cluster-view-tabs';tabs.setAttribute('role','group');tabs.setAttribute('aria-label','Cluster visualization');
  tabs.innerHTML='<button type="button" aria-pressed="true" data-view="3d">3D view</button><button type="button" aria-pressed="false" data-view="film">Hubble film</button>';
  const stage=document.createElement('div');stage.className='cluster-stage';
  stage.innerHTML='<canvas tabindex="0" role="img" aria-label="Interactive illustrative star cluster. Drag to rotate, arrow keys to turn, plus or minus to zoom."></canvas><div class="cluster-controls"><span>Drag to turn</span><div><button type="button" class="cluster-pause" aria-label="Pause cluster rotation"></button><button type="button" class="cluster-reset" aria-label="Reset cluster view" title="Reset view">↺</button></div></div>';
  const info=document.createElement('details');info.className='photo-credit cluster-credit';
  info.innerHTML='<summary aria-label="About the 3D view" title="About the 3D view">ⓘ</summary><span>An interactive illustration of a globular star cluster. Star positions and colours are generated for this website; they are not observations of Omega Centauri or measurements from the paper.</span>';
  figure.prepend(tabs);tabs.after(stage,info);
  const canvas=stage.querySelector('canvas'),ctx=canvas.getContext('2d');
  if(!ctx){tabs.remove();stage.remove();info.remove();return;}
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),pause=stage.querySelector('.cluster-pause');
  let yaw=.35,pitch=.15,zoom=1,dragging=false,previous,rotation=!reduced.matches;
  let visible=true,onScreen=true,frame=0,last=0,dead=false,width=520,height=325,seed=1739;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return(seed+.5)/4294967296;};
  const stars=Array.from({length:6200},()=>{
    let r;do{r=.2/Math.sqrt(Math.pow(random(),-2/3)-1);}while(r>1.7);
    const phi=random()*Math.PI*2,z=random()*2-1,d=Math.sqrt(1-z*z);
    return{x:r*d*Math.cos(phi),y:r*z*.85,z:r*d*Math.sin(phi),size:.35+Math.pow(random(),7)*1.7,kind:random()<.13?0:random()<.24?1:2,shine:random()};
  });
  const sprites=['255,190,125','177,209,255','255,242,216'].map(color=>{
    const c=document.createElement('canvas');c.width=c.height=32;const g=c.getContext('2d'),glow=g.createRadialGradient(16,16,0,16,16,16);
    glow.addColorStop(0,'rgba('+color+',1)');glow.addColorStop(.11,'rgba('+color+',.95)');glow.addColorStop(.28,'rgba('+color+',.27)');glow.addColorStop(1,'rgba('+color+',0)');g.fillStyle=glow;g.fillRect(0,0,32,32);return c;
  });
  const render=()=>{
    ctx.setTransform(canvas.width/width,0,0,canvas.height/height,0,0);ctx.fillStyle='#080b17';ctx.fillRect(0,0,width,height);
    const haze=ctx.createRadialGradient(width/2,height/2,0,width/2,height/2,height*.5);haze.addColorStop(0,'#403a3938');haze.addColorStop(.45,'#27253820');haze.addColorStop(1,'#080b1700');ctx.fillStyle=haze;ctx.fillRect(0,0,width,height);
    const cy=Math.cos(yaw),sy=Math.sin(yaw),cx=Math.cos(pitch),sx=Math.sin(pitch),scale=height*.74*zoom;
    const points=stars.map(p=>{const x=p.x*cy+p.z*sy,z=-p.x*sy+p.z*cy,y=p.y*cx-z*sx,depth=p.y*sx+z*cx,f=3.6/(3.6-depth);return{x:width/2+x*scale*f,y:height/2+y*scale*f,z:depth,r:p.size*f,kind:p.kind,shine:p.shine};}).sort((a,b)=>a.z-b.z);
    ctx.globalCompositeOperation='lighter';
    for(const p of points){if(p.x<0||p.x>width||p.y<0||p.y>height)continue;const size=p.r*5;ctx.globalAlpha=Math.min(.96,.40+p.shine*.45+p.z*.06);ctx.drawImage(sprites[p.kind],p.x-size/2,p.y-size/2,size,size);}
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  };
  const resize=()=>{const r=stage.getBoundingClientRect();if(!r.width)return;width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);render();};
  const running=()=>!dead&&visible&&onScreen&&!document.hidden&&rotation&&!dragging;
  const tick=time=>{frame=0;if(!running()){last=0;return;}if(last)yaw+=Math.min((time-last)/1000,.06)*.24;last=time;render();frame=requestAnimationFrame(tick);};
  const wake=()=>{if(running()&&!frame){last=0;frame=requestAnimationFrame(tick);}};
  const updatePause=()=>{pause.innerHTML=rotation?'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13L19 12z"/></svg>';pause.setAttribute('aria-label',rotation?'Pause cluster rotation':'Play cluster rotation');};
  pause.addEventListener('click',()=>{rotation=!rotation;updatePause();wake();});
  stage.querySelector('.cluster-reset').addEventListener('click',()=>{yaw=.35;pitch=.15;zoom=1;render();});
  canvas.addEventListener('pointerdown',e=>{dragging=true;previous={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);canvas.classList.add('dragging');});
  canvas.addEventListener('pointermove',e=>{if(!dragging)return;yaw+=(e.clientX-previous.x)*.009;pitch=Math.max(-1.4,Math.min(1.4,pitch+(e.clientY-previous.y)*.008));previous={x:e.clientX,y:e.clientY};render();});
  const release=()=>{dragging=false;canvas.classList.remove('dragging');wake();};
  ['pointerup','pointercancel','lostpointercapture'].forEach(event=>canvas.addEventListener(event,release));
  canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')yaw-=.15;if(e.key==='ArrowRight')yaw+=.15;if(e.key==='ArrowUp')pitch-=.12;if(e.key==='ArrowDown')pitch+=.12;if(e.key==='+'||e.key==='=')zoom=Math.min(1.8,zoom+.1);if(e.key==='-')zoom=Math.max(.65,zoom-.1);render();});
  const select=view=>{visible=view==='3d';stage.hidden=info.hidden=!visible;film.hidden=visible;const shell=film.closest('.media-shell');if(shell)shell.hidden=visible;if(credit)credit.hidden=visible;tabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));window.SiteMotion?.refresh();if(visible){resize();wake();}};
  tabs.addEventListener('click',e=>{const b=e.target.closest('button');if(b)select(b.dataset.view);});
  const ro=new ResizeObserver(resize);ro.observe(stage);const io=new IntersectionObserver(entries=>{onScreen=entries[0].isIntersecting;wake();});io.observe(stage);
  document.addEventListener('visibilitychange',wake);const motionChange=()=>{if(reduced.matches){rotation=false;updatePause();}wake();};reduced.addEventListener('change',motionChange);updatePause();select('film');
  return()=>{dead=true;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();document.removeEventListener('visibilitychange',wake);reduced.removeEventListener('change',motionChange);};
};
