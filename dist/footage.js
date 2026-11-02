/* Real footage has one playhead: idle playback and relative scroll both advance it. */
(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const forced=new URLSearchParams(location.search).get('motion')==='reduce';
  const film=document.querySelector('.film');
  const videos=[...document.querySelectorAll('.real-footage')];
  const visible=new Set(),states=new Map();
  let idleTimer=0,queued=false;
  const allowed=()=>!forced&&!reduced.matches&&!document.hidden;
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  function progress(){
    const rect=film.getBoundingClientRect(),height=film.querySelector('.stage').getBoundingClientRect().height;
    return {p:clamp(-rect.top/Math.max(1,rect.height-height),0,1),inFilm:rect.bottom>0};
  }
  const ranges={flight:[0,.24],cabin:[.39,.64],departure:[.64,1]};
  const localProgress=(chapter,p)=>{const [start,end]=ranges[chapter];return clamp((p-start)/(end-start),0,1);};
  function chapterActive(video){
    const {p,inFilm}=progress(),chapter=video.dataset.chapter;
    if(chapter==='closing')return visible.has(video);
    const [start,end]=ranges[chapter];return p>=start&&p<=end&&inFilm;
  }
  const source=video=>matchMedia('(max-width: 760px)').matches&&video.dataset.mobileSrc?video.dataset.mobileSrc:video.dataset.src;
  const durationReady=video=>Number.isFinite(video.duration)&&video.duration>0;
  function paint(video){if(video.readyState>=2)video.classList.add('is-playing');}
  function play(video){
    const state=states.get(video);
    if(!allowed()||!visible.has(video)||!chapterActive(video)){video.pause();return;}
    if(!video.src){video.preload='auto';video.src=source(video);}
    if(state&&(state.scrubbing||state.pending||video.seeking)){state.resumeWanted=true;return;}
    paint(video);
    // Calling play() on an ended video restarts it. Flight chapters instead hold their last frame.
    if(state&&durationReady(video)&&(video.ended||video.currentTime>=video.duration-.015)){video.pause();return;}
    video.muted=true;video.playbackRate=.8;
    video.play().then(()=>paint(video)).catch(()=>{});
  }
  function flush(video){
    const state=states.get(video);
    if(!state||!durationReady(video)||video.readyState<1||video.seeking)return;
    if(state.pendingDelta){state.target+=state.pendingDelta*video.duration;state.pendingDelta=0;state.pending=true;}
    state.target=clamp(state.target,0,video.duration);
    if(state.pending){
      state.pending=false;
      if(Math.abs(video.currentTime-state.target)>.025){video.pause();video.currentTime=state.target;return;}
    }
    paint(video);
    if(!state.scrubbing&&state.resumeWanted){state.resumeWanted=false;play(video);}
  }
  const initial=progress().p;
  videos.forEach(video=>{
    if(video.dataset.chapter!=='closing'){
      video.loop=false;
      states.set(video,{lastLocal:localProgress(video.dataset.chapter,initial),target:video.currentTime||0,pendingDelta:0,pending:false,scrubbing:false,resumeWanted:false});
    }
    video.addEventListener('loadedmetadata',()=>flush(video));
    video.addEventListener('loadeddata',()=>{flush(video);if(visible.has(video))play(video);});
    video.addEventListener('seeked',()=>flush(video));
    video.addEventListener('ended',()=>{
      const state=states.get(video);
      if(state){state.target=video.currentTime;state.resumeWanted=false;video.pause();}
    });
    video.addEventListener('error',()=>video.classList.remove('is-playing'));
  });
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){const video=entry.target;if(entry.isIntersecting){visible.add(video);play(video);}else{visible.delete(video);video.pause();}}
  },{threshold:.05});
  videos.forEach(video=>observer.observe(video));
  function sample(){
    queued=false;
    const {p}=progress();
    for(const [video,state] of states){
      const local=localProgress(video.dataset.chapter,p),delta=local-state.lastLocal;
      state.lastLocal=local;
      if(!allowed()||!chapterActive(video)){
        video.pause();state.scrubbing=false;state.resumeWanted=false;continue;
      }
      if(Math.abs(delta)<.000001)continue;
      if(!video.src){video.preload='auto';video.src=source(video);}
      // Anchor every settled sample to the frame the decoder actually reached.
      // During a seek, keep the latest queued target rather than an older decoded frame.
      if(!state.pending&&!video.seeking)state.target=video.currentTime||0;
      state.scrubbing=true;state.resumeWanted=false;video.pause();
      if(durationReady(video)){state.target+=delta*video.duration;state.pending=true;}
      else state.pendingDelta+=delta;
      flush(video);
    }
    clearTimeout(idleTimer);
    idleTimer=setTimeout(()=>{
      for(const [video,state] of states){state.scrubbing=false;state.resumeWanted=true;flush(video);}
      for(const video of visible)if(!states.has(video))play(video);
    },180);
  }
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(sample);}},{passive:true});
  addEventListener('resize',()=>{
    const {p}=progress();for(const [video,state] of states)state.lastLocal=localProgress(video.dataset.chapter,p);
  },{passive:true});
  document.addEventListener('visibilitychange',()=>{videos.forEach(video=>video.pause());if(allowed())visible.forEach(play);});
  reduced.addEventListener('change',()=>{videos.forEach(video=>{video.pause();video.classList.remove('is-playing');});if(allowed())visible.forEach(play);});
  addEventListener('pointerdown',()=>{if(allowed())visible.forEach(play);},{once:true,passive:true});
})();
