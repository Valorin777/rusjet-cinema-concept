/* RusJet independent visual concept. All flight scenes are illustrative. */
(() => {
  'use strict';
  const root = document.documentElement;
  const booking = document.querySelector('.booking');
  const status = document.querySelector('#booking-status');
  // Configure an approved manager URL here when supplied. No form or network submission.
  const managerUrl = null;
  booking.addEventListener('click', () => {
    if (managerUrl) { window.location.assign(managerUrl); return; }
    status.textContent = 'Контакт менеджера ещё не подключён. Бронирование станет доступно после его добавления.';
    status.classList.add('active');
  });
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!window.gsap || !window.ScrollTrigger || motionQuery.matches || new URLSearchParams(location.search).get('motion') === 'reduce') {
    document.body.classList.add('reduced');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    root.classList.add('motion');
    const mobile = window.matchMedia('(max-width: 760px)').matches;
    const scenes = document.querySelectorAll('.scene');
    scenes.forEach((scene,index) => scene.setAttribute('aria-hidden',index === 0 ? 'false' : 'true'));
    const chapterCount = document.querySelector('.chapter-count');
    const chapterCaption = document.querySelector('.chapter-caption');
    const labels = ['ВЫСОТА', 'ПЕРСПЕКТИВА', 'НА БОРТУ', 'ГОРИЗОНТ'];
    let lastChapter = -1;
    gsap.set('.flight-copy,.flight-note,.flight-bottom,.horizon-mark,.masthead', {opacity:1,y:0});
    gsap.set('.scene:not(.flight)', {autoAlpha: 0});
    gsap.set('.portal', {autoAlpha:1, clipPath:'inset(100% 0% 0% 0%)'});
    gsap.set('.cabin', {autoAlpha:1, clipPath:'ellipse(0% 0% at 50% 50%)'});
    gsap.set('.departure', {autoAlpha:1, clipPath:'inset(100% 0% 0% 0%)'});
    const timeline = gsap.timeline({defaults:{ease:'none'},scrollTrigger:{
      trigger:'.film',start:'top top',end:'bottom bottom',scrub:mobile ? .45 : .8,invalidateOnRefresh:true,
      onUpdate(self){
        const chapter = self.progress < .25 ? 0 : self.progress < .49 ? 1 : self.progress < .75 ? 2 : 3;
        if (chapter !== lastChapter) {
          chapterCount.textContent = `0${chapter+1} / 04`;
          chapterCaption.textContent = labels[chapter];
          scenes.forEach((scene,index) => scene.setAttribute('aria-hidden',index !== chapter ? 'true':'false'));
          lastChapter = chapter;
        }
      }
    }});
    timeline.to('.flight-image',{scale:1.17,xPercent:mobile?-4:-3,yPercent:2,duration:1.6},0)
      .to('.flight-copy',{yPercent:-24,opacity:0,duration:.7},.7)
      .to('.flight-note,.flight-bottom,.horizon-mark',{opacity:0,y:-25,duration:.5},.8)
      .to('.masthead',{opacity:0,y:-20,duration:.45},.75)
      .to('.portal',{clipPath:'inset(0% 0% 0% 0%)',duration:.7,ease:'power2.inOut'},1.05)
      .from('.window-shell',{scale:.66,rotationY:-16,rotationZ:-7,duration:.8,ease:'power2.out'},1.2)
      .from('.portal-left',{xPercent:-25,opacity:0,duration:.7},1.35)
      .from('.portal-right',{xPercent:25,opacity:0,duration:.7},1.45)
      .from('.portal-note,.portal-eyebrow,.portal-coordinate',{opacity:0,duration:.5},1.5)
      .to('.window-glass img',{scale:1.3,xPercent:-12,duration:1.15},1.75)
      .to('.portal-left',{xPercent:-40,opacity:0,duration:.55},2.2)
      .to('.portal-right',{xPercent:40,opacity:0,duration:.55},2.2)
      .to('.portal-note,.portal-eyebrow,.portal-coordinate',{opacity:0,duration:.35},2.35)
      .to('.window-shell',{scale:mobile?6:6.7,rotationZ:0,duration:.9,ease:'power2.in'},2.35)
      .to('.cabin',{clipPath:'ellipse(85% 100% at 50% 50%)',duration:.8,ease:'power2.inOut'},2.65)
      .from('.cabin-image',{scale:1.22,duration:1.6},2.75)
      .from('.cabin-copy',{y:60,opacity:0,duration:.65},3.15)
      .from('.cabin-caption,.cabin-detail',{y:30,opacity:0,duration:.5},3.4)
      .to('.cabin-image',{scale:1.07,xPercent:mobile?-1:2,duration:.8},4.1)
      .to('.cabin-copy,.cabin-caption,.cabin-detail',{y:-40,opacity:0,duration:.55},4.2)
      .to('.departure',{clipPath:'inset(0% 0% 0% 0%)',duration:.85,ease:'power2.inOut'},4.4)
      .from('.departure-image',{scale:1.23,xPercent:mobile?-2:-6,duration:1.4},4.45)
      .from('.departure-copy',{yPercent:20,opacity:0,duration:.4},4.85)
      .from('.departure-note,.departure-rule',{y:30,opacity:0,duration:.6},5.2)
      .to('.departure-image',{scale:1.08,xPercent:2,yPercent:-1,duration:.9},5.8)
      .to('.departure-copy,.departure-note,.departure-rule',{y:-30,opacity:0,duration:.5},6.35)
      .to('.film-meter',{opacity:0,duration:.3},6.55);
    gsap.to('.meter-track i',{scaleY:1,ease:'none',scrollTrigger:{trigger:'.film',start:'top top',end:'bottom bottom',scrub:true}});
    gsap.fromTo('.chapter-caption',{opacity:0},{opacity:1,scrollTrigger:{trigger:'.film',start:'top -30%',end:'top -55%',scrub:true}});
    gsap.from('.closing .eyebrow,.closing h2,.closing-copy,.booking,.booking-status',{
      y:45,opacity:0,stagger:.12,duration:1.1,ease:'power2.out',scrollTrigger:{trigger:'.closing',start:'top 70%',once:true}
    });
    // Native real-footage playheads are coordinated by footage.js.
    return () => {root.classList.remove('motion');gsap.set('.scene',{clearProps:'all'});scenes.forEach(scene=>scene.removeAttribute('aria-hidden'));};
  });
  motionQuery.addEventListener('change', () => {
    document.body.classList.toggle('reduced', motionQuery.matches);
    if(motionQuery.matches){gsap.set('.scene',{clearProps:'all'});}
    ScrollTrigger.refresh();
  });
  window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
})();
