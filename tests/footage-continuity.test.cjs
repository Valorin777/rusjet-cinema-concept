const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

function harness(initialProgress=.76,delayedSeeks=false,departureDuration=10,mobile=false){
  let p=initialProgress;
  const events={},docEvents={},timeouts=new Map();let timer=0;
  class Video{
    constructor(chapter,duration){this.dataset={chapter,src:chapter+'.mp4',...(chapter==='departure'?{mobileSrc:'departure-mobile.mp4'}:{})};this.duration=duration;this.readyState=4;this.paused=true;this.seeking=false;this.src='';this.loop=true;this.muted=true;this._time=0;this.seeks=[];this.events={};this.playCalls=0;this.classList={add(){},remove(){}};}
    get currentTime(){return this._time;}
    set currentTime(t){this._time=t;this.seeks.push(t);this.seeking=delayedSeeks;}
    get ended(){return this._time>=this.duration;}
    play(){this.playCalls++;this.paused=false;if(this.ended)this._time=0;return Promise.resolve();}
    pause(){this.paused=true;}
    addEventListener(name,fn){this.events[name]=fn;}
    emit(name){this.events[name]?.();}
    settle(){this.seeking=false;this.emit('seeked');}
  }
  const flight=new Video('flight',13),departure=new Video('departure',departureDuration),cabin=new Video('cabin',7),closing=new Video('closing',10),videos=[flight,cabin,departure,closing];
  const film={getBoundingClientRect:()=>({top:-p*6000,height:7000,bottom:7000-p*6000}),querySelector:()=>({getBoundingClientRect:()=>({height:1000})})};
  const document={hidden:false,querySelector:()=>film,querySelectorAll:()=>videos,addEventListener:(n,f)=>docEvents[n]=f};
  const context={document,location:{search:''},URLSearchParams,matchMedia:q=>({matches:q.includes('max-width')&&mobile,addEventListener(){}}),IntersectionObserver:class{constructor(fn){this.fn=fn;}observe(v){this.fn([{target:v,isIntersecting:true}]);}},addEventListener:(n,f)=>events[n]=f,requestAnimationFrame:f=>f(),setTimeout:f=>{timeouts.set(++timer,f);return timer;},clearTimeout:id=>timeouts.delete(id)};
  vm.runInNewContext(fs.readFileSync('dist/footage.js','utf8'),context);
  return {flight,cabin,departure,closing,scroll(delta){p+=delta;events.scroll();},idle(){for(const [id,fn] of [...timeouts]){timeouts.delete(id);fn();}},visibility(hidden){document.hidden=hidden;docEvents.visibilitychange();},resize(){events.resize();},get progress(){return p;}};
}

for(const time of [1.2,4.9,8.7])test(`idle at ${time}s → forward scroll continues from current frame`,()=>{
  const h=harness(),v=h.departure;v._time=time;
  h.scroll(.0036);
  assert.ok(v.currentTime>=time,'must never jump backwards on forward input');
  assert.ok(Math.abs(v.currentTime-(time+.1))<.00001);
  h.idle();assert.equal(v.paused,false);
  v._time+=.7;
  const resumed=v.currentTime;h.scroll(.0036);
  assert.ok(Math.abs(v.currentTime-(resumed+.1))<.00001,'new gesture must use the advanced native playhead');
});
test('completed takeoff holds the final frame and does not restart',()=>{
  const h=harness(),v=h.departure;v._time=10;v.emit('ended');const calls=v.playCalls;
  h.scroll(.006);h.idle();h.visibility(true);h.visibility(false);
  assert.equal(v.currentTime,10);assert.equal(v.playCalls,calls);assert.equal(v.paused,true);assert.equal(v.loop,false);
});
test('reverse scroll rewinds relative to the current takeoff frame',()=>{
  const h=harness(),v=h.departure;v._time=6.3;h.scroll(-.0072);
  assert.ok(Math.abs(v.currentTime-6.1)<.00001);h.idle();assert.equal(v.paused,false);
});
test('coalesced asynchronous seeks keep the newest target and resume after completion',()=>{
  const h=harness(.76,true),v=h.departure;v._time=5;
  h.scroll(.0036);assert.ok(Math.abs(v.currentTime-5.1)<.00001);
  h.scroll(.0036);h.scroll(.0036);h.idle();assert.equal(v.paused,true);
  v.settle();assert.ok(Math.abs(v.currentTime-5.3)<.00001);assert.equal(v.paused,true);
  v.settle();assert.equal(v.paused,false);assert.ok(v.seeks.every(t=>t>=5));
});
test('reverse from an ended clip resumes without going back to the beginning',()=>{
  const h=harness(),v=h.departure;v._time=10;v.emit('ended');h.scroll(-.0072);h.idle();assert.ok(Math.abs(v.currentTime-9.8)<.00001);assert.equal(v.paused,false);
});
test('viewport resize and visibility pause preserve the playhead',()=>{
  const h=harness(),v=h.departure;v._time=7.4;h.resize();h.visibility(true);h.visibility(false);assert.equal(v.currentTime,7.4);assert.equal(v.seeks.length,0);
});

test('cabin film also continues from the current native frame',()=>{
  const h=harness(.5),v=h.cabin;v._time=3.2;h.scroll(.0025);h.idle();
  assert.ok(Math.abs(v.currentTime-3.27)<.00001);assert.equal(v.paused,false);
});
test('first scroll into an unloaded chapter fetches metadata before its pending seek',()=>{
  const h=harness(.63),v=h.departure;v.src='';v.duration=NaN;v.readyState=0;
  h.scroll(.02);assert.equal(v.preload,'auto');assert.equal(v.src,'departure.mp4');
  v.duration=10;v.readyState=4;v.emit('loadedmetadata');v.emit('loadeddata');h.idle();
  assert.ok(v.currentTime>0);assert.equal(v.paused,false);
});

test('the seven-second replacement holds its real end and rewinds continuously',()=>{
  const h=harness(.76,false,7),v=h.departure;v._time=5.4;h.scroll(.0036);h.idle();assert.ok(Math.abs(v.currentTime-5.47)<.00001);
  v._time=7;v.emit('ended');h.scroll(.006);h.idle();assert.equal(v.currentTime,7);
  h.scroll(-.0072);h.idle();assert.ok(Math.abs(v.currentTime-6.86)<.00001);assert.equal(v.paused,false);
});
test('mobile uses the smaller film without changing the playhead on resize',()=>{
  const h=harness(.76,false,7,true),v=h.departure;assert.equal(v.src,'departure-mobile.mp4');v._time=4.3;h.resize();assert.equal(v.currentTime,4.3);assert.equal(v.src,'departure-mobile.mp4');
});

test('a late native playhead update during a gesture never reuses an earlier target',()=>{
  const h=harness(.76,false,7),v=h.departure;v._time=2;h.scroll(.0036);
  v._time=7;h.scroll(-.0036);assert.ok(Math.abs(v.currentTime-6.93)<.00001);h.idle();assert.equal(v.paused,false);
});
