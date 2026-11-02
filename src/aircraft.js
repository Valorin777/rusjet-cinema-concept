import * as THREE from 'three';

// Original procedural concept aircraft. Not an engineering model of any real type.
// The canvas contains real mesh geometry, changing 3D transforms and a perspective camera.
const film = document.querySelector('.film');
const flight = document.querySelector('.flight');
const departure = document.querySelector('.departure');
const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const forcedReduced = new URLSearchParams(location.search).get('motion') === 'reduce';
if (!reduced.matches && !forcedReduced) start().catch(error => console.warn('3D unavailable; illustrated fallback retained.', error.message));

async function start(){
  const renderer = new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setClearColor(0x000000,0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const canvas = renderer.domElement;
  canvas.className='aircraft-layer';
  canvas.setAttribute('aria-hidden','true');
  flight.append(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35,1,.1,150);
  const plane = new THREE.Group();
  plane.name='Original concept trijet';
  scene.add(plane);

  // A generated studio-sky environment supplies real reflections, with no remote HDR asset.
  const envCanvas = document.createElement('canvas');envCanvas.width=1024;envCanvas.height=512;
  const ctx=envCanvas.getContext('2d');
  const envGradient=ctx.createLinearGradient(0,0,0,512);
  [[0,'#7892ab'],[.26,'#b8ccd8'],[.45,'#d4d9d8'],[.5,'#f2c9a0'],[.58,'#b27c51'],[.7,'#344455'],[1,'#0c1828']].forEach(([stop,color])=>envGradient.addColorStop(stop,color));
  ctx.fillStyle=envGradient;ctx.fillRect(0,0,1024,512);
  const streak=ctx.createLinearGradient(0,0,1024,0);streak.addColorStop(0,'#00000000');streak.addColorStop(.25,'#fff5df99');streak.addColorStop(.4,'#00000000');streak.addColorStop(.8,'#cadfff66');streak.addColorStop(1,'#00000000');ctx.fillStyle=streak;ctx.fillRect(0,185,1024,38);
  const environmentTexture=new THREE.CanvasTexture(envCanvas);environmentTexture.mapping=THREE.EquirectangularReflectionMapping;environmentTexture.colorSpace=THREE.SRGBColorSpace;
  const pmrem=new THREE.PMREMGenerator(renderer);const environment=pmrem.fromEquirectangular(environmentTexture);scene.environment=environment.texture;environmentTexture.dispose();pmrem.dispose();
  const key=new THREE.DirectionalLight(0xffd0a1,3.5);key.position.set(-8,6,-4);scene.add(key);
  const fill=new THREE.DirectionalLight(0xb1d6ff,1.6);fill.position.set(4,4,9);scene.add(fill);
  const rim=new THREE.DirectionalLight(0xffe8bf,2.1);rim.position.set(-5,2,-10);scene.add(rim);
  scene.add(new THREE.HemisphereLight(0xa5bbcf,0x352c24,1.3));
  const metal=new THREE.MeshPhysicalMaterial({color:0xbec9ce,metalness:.85,roughness:.19,clearcoat:.5,clearcoatRoughness:.13});
  const wingMat=new THREE.MeshPhysicalMaterial({color:0xc6cece,metalness:.7,roughness:.26,clearcoat:.4});
  const darkMetal=new THREE.MeshStandardMaterial({color:0x38434d,metalness:.8,roughness:.26});
  const glass=new THREE.MeshPhysicalMaterial({color:0x071521,metalness:.42,roughness:.1,clearcoat:1});
  const rubber=new THREE.MeshStandardMaterial({color:0x0b0d10,roughness:.85});
  const gold=new THREE.MeshStandardMaterial({color:0xb69a76,metalness:.8,roughness:.25});
  const make=(geometry,material,parent=plane)=>{const mesh=new THREE.Mesh(geometry,material);parent.add(mesh);return mesh;};
  const lathe=(profile,material,parent=plane,segments=64)=>{
    const curve=new THREE.SplineCurve(profile.map(([x,r])=>new THREE.Vector2(r,x)));
    const points=curve.getPoints(80).map(v=>new THREE.Vector2(Math.max(.002,v.x),v.y));
    const geometry=new THREE.LatheGeometry(points,segments);geometry.rotateZ(-Math.PI/2);return make(geometry,material,parent);
  };
  const profile=[[-4.65,.008],[-4.3,.11],[-3.75,.22],[-3,.38],[-2.2,.47],[-1,.49],[1.6,.49],[2.2,.48],[2.7,.45],[3.15,.38],[3.55,.28],[3.95,.14],[4.2,.018]];
  lathe(profile,metal);
  const belly=make(new THREE.SphereGeometry(1,40,24),wingMat);belly.scale.set(2,.27,.52);belly.position.set(-.7,-.25,0);

  // Swept wings are thick, curved airfoils, not flat decorative planes.
  function airfoil(sections,side,parent=plane){
    const verts=[],indices=[],n=20;
    sections.forEach(([z,leading,chord,height,thickness])=>{
      for(let i=0;i<n*2;i++){
        const top=i<n;const u=top?i/(n-1):1-(i-n)/(n-1);
        const shape=5*thickness*(.2969*Math.sqrt(u)-.126*u-.3516*u*u+.2843*u*u*u-.1036*u*u*u*u);
        verts.push(leading-u*chord,height+(top?1:-1)*shape*chord,z*side);
      }
    });
    const ring=n*2;
    for(let j=0;j<sections.length-1;j++)for(let i=0;i<ring;i++){
      const a=j*ring+i,b=j*ring+(i+1)%ring,c=(j+1)*ring+i,d=(j+1)*ring+(i+1)%ring;
      if(side>0)indices.push(a,c,b,b,c,d);else indices.push(a,b,c,b,d,c);
    }
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geometry.setIndex(indices);geometry.computeVertexNormals();
    const mesh=make(geometry,wingMat,parent);mesh.material.side=THREE.DoubleSide;return mesh;
  }
  const wings=[];
  for(const side of [-1,1]){
    const wing=airfoil([[.3,.9,2.65,-.17,.115],[1.3,.28,1.95,-.1,.105],[3,-.95,1.14,.02,.09],[4.7,-2.0,.57,.22,.075],[5.05,-2.2,.42,.35,.07],[5.25,-2.32,.24,1.02,.06]],side);wings.push(wing);
    airfoil([[.1,-3.35,1.3,1.35,.1],[1.25,-3.98,.8,1.39,.08],[2.05,-4.45,.34,1.5,.07]],side);
  }
  const finShape=new THREE.Shape();finShape.moveTo(-4.25,.05);finShape.lineTo(-2.85,.18);finShape.lineTo(-3.65,2.05);finShape.quadraticCurveTo(-3.73,2.2,-3.9,2.2);finShape.lineTo(-4.35,2.17);finShape.lineTo(-4.05,.7);finShape.closePath();
  const finGeometry=new THREE.ExtrudeGeometry(finShape,{depth:.07,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:2,steps:1});finGeometry.translate(0,0,-.035);make(finGeometry,metal);
  // Original understated trim and door contour. No copied operator livery or registration.
  const trimPoints=[];for(let i=0;i<=70;i++){const x=-3.4+i*6.1/70;const radius=x<-2.2?.47-(Math.abs(x+2.2))*.1:x>2.2?.46-(x-2.2)*.12:.49;trimPoints.push(new THREE.Vector3(x,.015,Math.max(.12,radius)+.003));}
  const trimCurve=new THREE.CatmullRomCurve3(trimPoints);make(new THREE.TubeGeometry(trimCurve,70,.007,4,false),gold);
  const trim2=make(new THREE.TubeGeometry(trimCurve,70,.007,4,false),gold);trim2.scale.z=-1;
  const windowGeometry=new THREE.SphereGeometry(1,16,12);
  const windows=new THREE.InstancedMesh(windowGeometry,glass,20);const frames=new THREE.InstancedMesh(windowGeometry,metal,20);plane.add(frames,windows);
  const dummy=new THREE.Object3D();let wi=0;
  for(const side of [-1,1])for(let i=0;i<10;i++){
    dummy.position.set(1.85-i*.375,.185,side*.456);dummy.scale.set(.102,.151,.018);dummy.updateMatrix();frames.setMatrixAt(wi,dummy.matrix);
    dummy.position.z=side*.473;dummy.scale.set(.078,.122,.014);dummy.updateMatrix();windows.setMatrixAt(wi,dummy.matrix);wi++;
  }
  const bodySamples=new THREE.SplineCurve(profile.map(([x,r])=>new THREE.Vector2(r,x))).getPoints(500);
  function radiusAt(x){
    let i=1;while(i<bodySamples.length-1&&bodySamples[i].y<x)i++;
    const a=bodySamples[i-1],b=bodySamples[i];return THREE.MathUtils.lerp(a.x,b.x,THREE.MathUtils.clamp((x-a.y)/(b.y-a.y),0,1));
  }
  function cockpit(side){
    const positions=[],indices=[],nx=12,ny=8;
    for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
      const v=j/ny,u=i/nx,theta=.38+v*.86;
      const x=THREE.MathUtils.lerp(2.1+v*.02,2.95+v*.42,u),r=radiusAt(x)+.009;
      positions.push(x,Math.cos(theta)*r,side*Math.sin(theta)*r);
    }
    for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i,b=a+1,c=a+nx+1,d=c+1;indices.push(a,b,c,b,d,c);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();const m=glass.clone();m.side=THREE.DoubleSide;make(g,m);
    // The silver central pillar splits the curved windscreen into two visible panels.
    const pillarPoints=[];for(let j=0;j<=12;j++){const theta=.38+j/12*.86,x=2.75+j/12*.13,r=radiusAt(x)+.025;pillarPoints.push(new THREE.Vector3(x,Math.cos(theta)*r,side*Math.sin(theta)*r));}
    make(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pillarPoints),12,.018,5,false),metal);
  }
  cockpit(1);cockpit(-1);
  const doorPath=new THREE.Shape();doorPath.moveTo(2.06,-.29);doorPath.lineTo(2.06,.23);doorPath.quadraticCurveTo(2.06,.34,2.18,.34);doorPath.lineTo(2.37,.34);doorPath.quadraticCurveTo(2.46,.34,2.46,.23);doorPath.lineTo(2.46,-.29);doorPath.closePath();
  const doorVertices=doorPath.getPoints(36).map(v=>new THREE.Vector3(v.x,v.y,Math.sqrt(Math.max(.01,.44*.44-v.y*v.y))+.005));
  plane.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(doorVertices),new THREE.LineBasicMaterial({color:0x687274,transparent:true,opacity:.65})));

  const fans=[];
  for(const [y,z] of [[.26,-.94],[.26,.94],[.87,0]]){
    const engine=new THREE.Group();engine.position.set(0,y,z);plane.add(engine);
    lathe([[-3.77,.16],[-3.58,.235],[-3.1,.29],[-2.57,.295],[-2.28,.27]],metal,engine,40);
    const pylon=make(new THREE.BoxGeometry(.62,.075,.55),metal);pylon.position.set(-2.98,y-.1,z*.55);
    const intake=make(new THREE.TorusGeometry(.267,.027,10,40),metal,engine);intake.rotation.y=Math.PI/2;intake.position.x=-2.28;
    const throat=make(new THREE.CylinderGeometry(.247,.22,.38,32,1,true),darkMetal,engine);throat.rotation.z=Math.PI/2;throat.position.x=-2.47;
    const fan=new THREE.Group();fan.position.x=-2.53;engine.add(fan);fans.push(fan);
    const disk=make(new THREE.CircleGeometry(.235,32),darkMetal,fan);disk.rotation.y=Math.PI/2;
    const fanBladeGeometry=new THREE.BoxGeometry(.009,.023,.18);const bladeMaterial=new THREE.MeshStandardMaterial({color:0x929b9e,metalness:.9,roughness:.3});
    const blades=new THREE.InstancedMesh(fanBladeGeometry,bladeMaterial,18);fan.add(blades);
    for(let i=0;i<18;i++){const a=i*Math.PI*2/18;dummy.position.set(.015,Math.sin(a)*.115,Math.cos(a)*.115);dummy.rotation.set(-a+.35,0,0);dummy.scale.set(1,1,1);dummy.updateMatrix();blades.setMatrixAt(i,dummy.matrix);}
    const cone=make(new THREE.ConeGeometry(.065,.15,20),metal,fan);cone.rotation.z=-Math.PI/2;cone.position.x=.07;
    const exhaust=make(new THREE.CylinderGeometry(.14,.18,.15,24,1,true),darkMetal,engine);exhaust.rotation.z=Math.PI/2;exhaust.position.x=-3.8;
  }
  const gear=[];
  for(const [x,z,length] of [[2.3,0,.52],[-.8,-.62,.65],[-.8,.62,.65]]){
    const assembly=new THREE.Group();assembly.position.set(x,-.3,z);plane.add(assembly);gear.push(assembly);
    const strut=make(new THREE.CylinderGeometry(.028,.035,length,12),metal,assembly);strut.position.y=-length/2;
    const tire=make(new THREE.CylinderGeometry(x>0?.12:.17,x>0?.12:.17,.13,20),rubber,assembly);tire.rotation.x=Math.PI/2;tire.position.y=-length;
    for(const side of [-1,1]){const hub=make(new THREE.CircleGeometry(x>0?.065:.09,16),metal,assembly);hub.position.set(0,-length,side*.067);if(side<0)hub.rotation.y=Math.PI;}
  }
  const nav=[];
  for(const side of [-1,1]){
    const bulb=make(new THREE.SphereGeometry(.035,10,8),new THREE.MeshBasicMaterial({color:side>0?0x89f0ba:0xff604c}));bulb.position.set(-2.32,1.02,5.25*side);nav.push(bulb);
  }
  const beacon=make(new THREE.SphereGeometry(.026,10,8),new THREE.MeshBasicMaterial({color:0xff7653}));beacon.position.set(-1,.495,0);

  // Real runway in 3D: perspective markings, moving lights, and takeoff clearance.
  const runway=new THREE.Group();scene.add(runway);
  const groundMask=document.createElement('canvas');groundMask.width=8;groundMask.height=128;const gc=groundMask.getContext('2d'),gg=gc.createLinearGradient(0,0,0,128);gg.addColorStop(0,'#000');gg.addColorStop(.42,'#444');gg.addColorStop(.8,'#fff');gg.addColorStop(1,'#fff');gc.fillStyle=gg;gc.fillRect(0,0,8,128);const groundAlpha=new THREE.CanvasTexture(groundMask);
  const ground=make(new THREE.PlaneGeometry(160,24),new THREE.MeshBasicMaterial({color:0x05090f,transparent:true,opacity:.95,alphaMap:groundAlpha,depthWrite:false}),runway);ground.rotation.x=-Math.PI/2;ground.position.y=-1.22;
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;const sc=shadowCanvas.getContext('2d'),sg=sc.createRadialGradient(64,64,0,64,64,64);sg.addColorStop(0,'#fff');sg.addColorStop(.35,'#888');sg.addColorStop(1,'#000');sc.fillStyle=sg;sc.fillRect(0,0,128,128);const shadowTexture=new THREE.CanvasTexture(shadowCanvas);
  const groundShadow=make(new THREE.PlaneGeometry(9,5),new THREE.MeshBasicMaterial({color:0x000000,alphaMap:shadowTexture,transparent:true,opacity:.6,depthWrite:false}),scene);groundShadow.rotation.x=-Math.PI/2;groundShadow.position.y=-1.205;

  const markings=new THREE.InstancedMesh(new THREE.PlaneGeometry(2.8,.13),new THREE.MeshBasicMaterial({color:0xded5c1,transparent:true,opacity:.38}),30);runway.add(markings);
  for(let i=0;i<30;i++){dummy.position.set(i*6-90,-1.21,0);dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.set(1,1,1);dummy.updateMatrix();markings.setMatrixAt(i,dummy.matrix);}
  const runwayLights=new THREE.InstancedMesh(new THREE.SphereGeometry(.055,6,4),new THREE.MeshBasicMaterial({color:0xffcb80}),100);runway.add(runwayLights);
  for(let i=0;i<100;i++){dummy.position.set((i%50)*4-100,-1.17,i<50?-5:5);dummy.rotation.set(0,0,0);dummy.scale.set(1,1,1);dummy.updateMatrix();runwayLights.setMatrixAt(i,dummy.matrix);}

  // Soft, original cloud sprites drift in depth; they are not the aircraft animation.
  const cloudCanvas=document.createElement('canvas');cloudCanvas.width=256;cloudCanvas.height=128;const c=cloudCanvas.getContext('2d');
  for(let i=0;i<20;i++){const x=20+(Math.sin(i*53.1)*.5+.5)*216,y=38+(Math.sin(i*19.4)*.5+.5)*55,r=20+(Math.sin(i*31.7)*.5+.5)*35;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(210,220,230,.12)');g.addColorStop(1,'rgba(210,220,230,0)');c.fillStyle=g;c.fillRect(0,0,256,128);}
  const cloudTexture=new THREE.CanvasTexture(cloudCanvas);const clouds=[];
  for(let i=0;i<20;i++){const mat=new THREE.SpriteMaterial({map:cloudTexture,color:0x7c94a7,transparent:true,opacity:.45,depthWrite:false});const cloud=new THREE.Sprite(mat);cloud.position.set((i%5)*9-20,-3.8-(i%3)*1.1,-15+(Math.floor(i/5))*8);cloud.scale.set(13+(i%3)*3,4,1);scene.add(cloud);clouds.push(cloud);}

  let width=0,height=0,mobile=false,rawProgress=0,progress=0,active=true,wasActive=false,elapsed=0,lastStamp=0,lastMetrics=0,phase='flight';
  const timer=new THREE.Timer();timer.connect(document);
  const look=new THREE.Vector3();
  function resize(){const rect=film.querySelector('.stage').getBoundingClientRect();width=rect.width;height=rect.height;mobile=width<761;renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.35:1.65));renderer.setSize(width,height,false);camera.aspect=width/height;camera.fov=mobile?40:35;camera.updateProjectionMatrix();}
  resize();window.addEventListener('resize',resize,{passive:true});
  const observer=new IntersectionObserver(entries=>{active=entries[0].isIntersecting;syncLoop();},{threshold:0});observer.observe(film);
  function syncLoop(){const shouldRun=active&&!document.hidden&&!reduced.matches;if(shouldRun!==wasActive){renderer.setAnimationLoop(shouldRun?animate:null);wasActive=shouldRun;}}
  document.addEventListener('visibilitychange',syncLoop);reduced.addEventListener('change',()=>{canvas.style.display=reduced.matches?'none':'';root.classList.toggle('webgl-ready',!reduced.matches);syncLoop();});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();renderer.setAnimationLoop(null);root.classList.remove('webgl-ready');});
  canvas.addEventListener('webglcontextrestored',()=>location.reload());
  function animate(stamp){
    timer.update();const dt=Math.min(timer.getDelta(),.05);elapsed+=dt;
    // Cap GPU work on small screens at 30 fps while retaining smooth scroll poses.
    if(mobile && stamp-lastStamp<31)return;lastStamp=stamp;
    const rect=film.getBoundingClientRect();rawProgress=THREE.MathUtils.clamp(-rect.top/Math.max(1,rect.height-height),0,1);progress=THREE.MathUtils.damp(progress,rawProgress,mobile?10:7,dt*(mobile?2:1));
    const time=progress*6.85;
    const nextPhase=time<4.4?'flight':'departure';
    if(nextPhase!==phase){phase=nextPhase;(phase==='flight'?flight:departure).append(canvas);}
    runway.visible=phase==='departure';groundShadow.visible=runway.visible;clouds.forEach(cloud=>cloud.visible=phase==='flight');
    const bob=Math.sin(elapsed*.85)*.085;
    if(phase==='flight'){
      const p=THREE.MathUtils.clamp(time/1.65,0,1);
      const exit=THREE.MathUtils.smoothstep(p,.55,1);
      plane.position.set((mobile?.05:1.2)-exit*3.7+Math.sin(elapsed*.23)*.8,(mobile?-2.3:-1.15)+bob+exit*1.6,-exit*1.5+Math.cos(elapsed*.24)*.3);
      plane.rotation.set(.025*Math.sin(elapsed*.33),Math.PI+.1+Math.sin(elapsed*.25)*.14+exit*.45,.015+Math.sin(elapsed*.42)*.065-exit*.18);
      wings.forEach((wing,i)=>wing.rotation.x=Math.sin(elapsed*1.1)*.003*(i?1:-1));
      if(mobile){camera.position.set(-18+exit*6,7.8+exit*2,31.2-exit*3);look.set(0,.7,0);}else{camera.position.set(-7.5+exit*5+Math.sin(elapsed*.15)*.8,3.1+exit*1.6,12.3-exit*2);look.set(-.3,.25,0);}
      gear.forEach(g=>g.visible=false);key.intensity=3.5;fill.intensity=1.6;rim.intensity=2.1;
      canvas.style.opacity=time<1.65?'1':'0';
    }else{
      const q=THREE.MathUtils.clamp((time-4.45)/2.25,0,1);
      const lift=THREE.MathUtils.smoothstep(q,.13,.88);
      const x=-3.8+q*9;
      plane.position.set(x+Math.sin(elapsed*.35)*.18,lift*3.4+bob*.35,-q*.8);
      plane.rotation.set(.025*Math.sin(elapsed*.28),-.12+q*.27+Math.sin(elapsed*.18)*.035,.018+lift*.18+Math.sin(elapsed*.4)*.012);
      if(mobile){camera.position.set(13+q*2,7+q*4,28);look.set(x*.4,2.2+lift*.6,0);}else{camera.position.set(5+q*3,1.65+lift*4.5,15-q*2);look.set(x*.35,.45+lift*.7,0);}
      gear.forEach(g=>{const retraction=THREE.MathUtils.smoothstep(q,.48,.8);g.visible=retraction<.98;g.rotation.z=retraction*1.4;g.scale.y=1-retraction*.85;});
      runway.position.x=-((elapsed*5)%6);groundShadow.position.x=x;groundShadow.position.z=-q*.8;groundShadow.material.opacity=.6*(1-lift*.8);groundShadow.scale.setScalar(1+lift*.45);key.intensity=3.2;fill.intensity=.8;rim.intensity=3;
      canvas.style.opacity=time>6.65?String(THREE.MathUtils.clamp((6.85-time)/.2,0,1)):'1';
    }
    camera.lookAt(look);
    fans.forEach((fan,i)=>fan.rotation.x=elapsed*(28+i));beacon.visible=Math.sin(elapsed*2.7)>-.3;
    clouds.forEach((cloud,i)=>{cloud.position.x=((i%5)*9-20+elapsed*.5)%45-4;cloud.position.y=-3.8-(i%3)*1.1+Math.sin(elapsed*.1+i)*.15;});
    if(time>1.7&&time<4.35){if(stamp-lastMetrics>500){canvas.dataset.phase='interior';lastMetrics=stamp;}return;}
    renderer.render(scene,camera);
    if(stamp-lastMetrics>450){canvas.dataset.phase=phase;canvas.dataset.pose=[plane.position.x,plane.position.y,plane.position.z,plane.rotation.x,plane.rotation.y,plane.rotation.z].map(n=>n.toFixed(4)).join(',');canvas.dataset.camera=camera.position.toArray().map(n=>n.toFixed(3)).join(',');canvas.dataset.meshes=String(scene.children.length);canvas.dataset.drawCalls=String(renderer.info.render.calls);canvas.dataset.triangles=String(renderer.info.render.triangles);canvas.dataset.elapsed=elapsed.toFixed(2);lastMetrics=stamp;}
  }
  await renderer.compileAsync(scene,camera);
  root.classList.add('webgl-ready');canvas.dataset.engine='threejs-real-3d';syncLoop();
}
