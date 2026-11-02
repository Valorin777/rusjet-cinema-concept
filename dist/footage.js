/* Real licensed footage. Scroll seeks the actual clip; idle resumes natural motion. */
(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const forced=new URLSearchParams(location.search).get('motion')==='reduce';
  const film=document.querySelector('.film');
  const videos=[...document.querySelectorAll('.real-footage')];
  let idleTimer=0,queued=false;
  const visible=new Set();
  const allowed=()=>!forced&&!reduced.matches&&!document.hidden;
  function chapterActive(video){
    const chapter=video.dataset.chapter,rect=film.getBoundingClientRect(),height=film.querySelector('.stage').getBoundingClientRect().height;
    const p=Math.max(0,Math.min(1,-rect.top/Math.max(1,rect.height-height)));
    if(chapter==='flight')return p<.25&&rect.bottom>0;
    if(chapter==='departure')return p>.64&&rect.bottom>0;
    return visible.has(video);
  }
  const play=video=>{
    if(!allowed()||!visible.has(video)||!chapterActive(video)){video.pause();return;}
    if(!video.src)video.src=video.dataset.src;
    video.muted=true;
    video.playbackRate=.8;
    video.play().then(()=>video.classList.add('is-playing')).catch(()=>{});
  };
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){const v=entry.target;if(entry.isIntersecting){visible.add(v);play(v);}else{visible.delete(v);v.pause();}}
  },{threshold:.05});
  videos.forEach(v=>{
    observer.observe(v);
    v.addEventListener('loadeddata',()=>{if(visible.has(v))play(v);});
    v.addEventListener('error',()=>v.classList.remove('is-playing'));
  });
  function sample(){
    queued=false;
    if(!allowed())return;
    const rect=film.getBoundingClientRect(),height=film.querySelector('.stage').getBoundingClientRect().height;
    const p=Math.max(0,Math.min(1,-rect.top/Math.max(1,rect.height-height)));
    for(const v of videos){
      const chapter=v.dataset.chapter;
      const active=chapter==='flight'?p<.25:chapter==='departure'?p>.64&&rect.bottom>0:visible.has(v);
      if(chapter==='closing')continue;
      if(!active){v.pause();continue;}
      if(!v.src)v.src=v.dataset.src;
      if(!v.duration||v.readyState<2)continue;
      const local=chapter==='flight'?Math.min(1,p/.24):Math.max(0,Math.min(1,(p-.64)/.36));
      const target=local*Math.max(0,v.duration-.2);
      v.pause();
      if(!v.seeking&&Math.abs(v.currentTime-target)>.075)v.currentTime=target;
      if(v.readyState>=2)v.classList.add('is-playing');
    }
    clearTimeout(idleTimer);
    idleTimer=setTimeout(()=>{for(const v of visible)play(v);},180);
  }
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(sample);}},{passive:true});
  document.addEventListener('visibilitychange',()=>{videos.forEach(v=>v.pause());if(allowed())visible.forEach(play);});
  reduced.addEventListener('change',()=>{videos.forEach(v=>{v.pause();v.classList.remove('is-playing');});if(allowed())visible.forEach(play);});
  // Browsers that require interaction for playback can start on the first scroll or touch.
  addEventListener('pointerdown',()=>{if(allowed())visible.forEach(play);},{once:true,passive:true});
})();
