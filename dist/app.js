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
    const masthead = document.querySelector('.masthead');
    const chapterCount = document.querySelector('.chapter-count');
    const chapterCaption = document.querySelector('.chapter-caption');
    const labels = ['ВЫСОТА', 'ПЕРСПЕКТИВА', 'НА БОРТУ', 'ГОРИЗОНТ'];
    let lastChapter = -1;
    // Cut to fully readable copy once the incoming picture fills most of the stage.
    // Use rendered timeline time so the label follows the smoothed picture in either direction.
    function showChapter(time) {
      const chapter = time < 1.55 ? 0 : time < 3.14 ? 1 : time < 4.99 ? 2 : 3;
      if (chapter === lastChapter) return;
      lastChapter = chapter;
      chapterCount.textContent = `0${chapter + 1} / 04`;
      chapterCaption.textContent = labels[chapter];
      masthead.classList.toggle('is-hidden', chapter !== 0);
      scenes.forEach((scene, index) => {
        scene.classList.toggle('is-current', index === chapter);
        scene.setAttribute('aria-hidden', index === chapter ? 'false' : 'true');
      });
    }
    showChapter(0);
    gsap.set('.portal .scene-media, .departure .scene-media', {clipPath:'inset(100% 0% 0% 0%)'});
    gsap.set('.cabin .scene-media', {clipPath:'ellipse(0% 0% at 50% 50%)'});
    const timeline = gsap.timeline({
      defaults:{ease:'none'},
      onUpdate(){showChapter(this.time());},
      scrollTrigger:{
        trigger:'.film',
        start:'top top',
        end:'bottom bottom',
        scrub:mobile ? .45 : .8,
        invalidateOnRefresh:true,
        // Refresh can restore a scroll position without firing the timeline's onUpdate.
        onRefresh(trigger){showChapter(trigger.animation.time());}
      }
    });
    timeline.to('.flight-image',{scale:1.17,xPercent:mobile?-4:-3,yPercent:2,duration:1.6},0)
      .to('.portal .scene-media',{clipPath:'inset(0% 0% 0% 0%)',duration:.7,ease:'power2.inOut'},1.05)
      .from('.window-shell',{scale:.66,rotationY:-16,rotationZ:-7,duration:.8,ease:'power2.out'},1.2)
      .to('.window-glass img',{scale:1.3,xPercent:-12,duration:1.15},1.75)
      .to('.window-shell',{scale:mobile?6:6.7,rotationZ:0,duration:.9,ease:'power2.in'},2.35)
      .to('.cabin .scene-media',{clipPath:'ellipse(85% 100% at 50% 50%)',duration:.8,ease:'power2.inOut'},2.65)
      .from('.cabin-image',{scale:1.22,duration:1.6},2.75)
      .to('.cabin-image',{scale:1.07,xPercent:mobile?-1:2,duration:.8},4.1)
      .to('.departure .scene-media',{clipPath:'inset(0% 0% 0% 0%)',duration:.85,ease:'power2.inOut'},4.4)
      .from('.departure-image',{scale:1.23,xPercent:mobile?-2:-6,duration:1.4},4.45)
      .to('.departure-image',{scale:1.08,xPercent:2,yPercent:-1,duration:.9},5.8)
      .to('.film-meter',{opacity:0,duration:.3},6.55);
    gsap.to('.meter-track i',{scaleY:1,ease:'none',scrollTrigger:{trigger:'.film',start:'top top',end:'bottom bottom',scrub:true}});
    gsap.fromTo('.chapter-caption',{opacity:0},{opacity:1,scrollTrigger:{trigger:'.film',start:'top -30%',end:'top -55%',scrub:true}});
    gsap.from('.closing .eyebrow,.closing h2,.closing-copy,.booking,.booking-status',{
      y:45,opacity:0,stagger:.12,duration:1.1,ease:'power2.out',scrollTrigger:{trigger:'.closing',start:'top 70%',once:true}
    });
    // Native real-footage playheads are coordinated by footage.js.
    return () => {
      root.classList.remove('motion');
      masthead.classList.remove('is-hidden');
      scenes.forEach(scene => {
        scene.classList.remove('is-current');
        scene.removeAttribute('aria-hidden');
      });
    };
  });
  motionQuery.addEventListener('change', () => {
    document.body.classList.toggle('reduced', motionQuery.matches);
    ScrollTrigger.refresh();
  });
  window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
})();
