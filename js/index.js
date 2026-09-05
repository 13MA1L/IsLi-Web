gsap.registerPlugin(ScrollTrigger);

/* ─── HERO IMAGE SLIDER ─── */
(function initHeroSlider() {
    const slides = document.querySelectorAll('.hs-slide');
    if (!slides.length) return;
    let current = 0;
    let timer;

    function goTo(n) {
        slides[current].classList.remove('active');
        current = (n + slides.length) % slides.length;
        const next = slides[current];
        next.classList.remove('active');
        void next.offsetWidth; // Animation-Reset erzwingen
        next.classList.add('active');
    }

    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => goTo(current + 1), 4000);
    }

    slides[0].classList.add('active');
    startTimer();

    const prev = document.querySelector('.hs-prev');
    const next = document.querySelector('.hs-next');
    if (prev) prev.addEventListener('click', () => { goTo(current - 1); startTimer(); });
    if (next) next.addEventListener('click', () => { goTo(current + 1); startTimer(); });
})();

/* ─── HERO ANIMATION ─── */
function startHero() {
    const tl = gsap.timeline({ delay: 0.1 });
    tl.to('.hero-eyebrow', { opacity:1, y:0, duration:1, ease:'power3.out' })
      .to({}, { duration:1.3 }, '-=0.5')
      .to('.hero-sub',  { opacity:1, duration:1, ease:'power3.out' }, '-=0.5')
      .to('.hero-btn',  { opacity:1, duration:0.8, ease:'power3.out' }, '-=0.3');
}

/* ─── SCROLL REVEALS ─── */
gsap.utils.toArray('.rv').forEach(el => {
    gsap.fromTo(el, { opacity:0, y:40 }, { opacity:1, y:0, duration:0.9, ease:'power3.out', scrollTrigger:{ trigger:el, start:'top 88%', toggleActions:'play none none none' } });
});
gsap.utils.toArray('.rv-l').forEach(el => {
    gsap.fromTo(el, { opacity:0, x:-40 }, { opacity:1, x:0, duration:0.9, ease:'power3.out', scrollTrigger:{ trigger:el, start:'top 88%', toggleActions:'play none none none' } });
});
gsap.utils.toArray('.rv-r').forEach(el => {
    gsap.fromTo(el, { opacity:0, x:40 }, { opacity:1, x:0, duration:0.9, ease:'power3.out', scrollTrigger:{ trigger:el, start:'top 88%', toggleActions:'play none none none' } });
});

gsap.utils.toArray('.svc-card').forEach((card, i) => {
    gsap.fromTo(card, { opacity:0, y:50 }, { opacity:1, y:0, duration:0.75, delay:(i%3)*0.1, ease:'power3.out', scrollTrigger:{ trigger:card, start:'top 90%', toggleActions:'play none none none' } });
});
gsap.utils.toArray('.proj-card').forEach((card, i) => {
    gsap.fromTo(card, { opacity:0, scale:0.94 }, { opacity:1, scale:1, duration:0.8, delay:i*0.06, ease:'power3.out', scrollTrigger:{ trigger:card, start:'top 90%', toggleActions:'play none none none' } });
});

document.querySelectorAll('.stat-n[data-num]').forEach(el => {
    const target = parseFloat(el.dataset.num);
    const suf = el.dataset.suf || '';
    const obj = { v: 0 };
    gsap.to(obj, { v:target, duration:2.2, ease:'power2.out', scrollTrigger:{ trigger:el, start:'top 85%', toggleActions:'play none none none' }, onUpdate() { el.textContent = Math.round(obj.v) + suf; } });
});

gsap.to('.hero-content', { y:160, ease:'none', scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:true } });

/* ─── CRAFT TILE-LAYING ANIMATION ─── */
(function initCraft() {
    const craftSec = document.getElementById('craft');
    const craftCvs = document.getElementById('craft-canvas');
    if (!craftSec || !craftCvs) return;

    const cW = craftSec.offsetWidth  || window.innerWidth;
    const cH = craftSec.offsetHeight || window.innerHeight;

    const cs = new THREE.Scene();
    cs.background = new THREE.Color(0x080705);
    cs.fog = new THREE.Fog(0x080705, 11, 24);

    const cc = new THREE.PerspectiveCamera(48, cW/cH, 0.1, 100);
    cc.position.set(0, 7.5, 9.5); cc.lookAt(0, 0, 0);

    const cr = new THREE.WebGLRenderer({ canvas: craftCvs, antialias: true });
    cr.setSize(cW, cH);
    cr.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    cr.shadowMap.enabled = true;
    cr.shadowMap.type = THREE.PCFSoftShadowMap;

    cs.add(new THREE.AmbientLight(0xffe8cc, 0.5));
    const dl = new THREE.DirectionalLight(0xFFFFFF, 1.6);
    dl.position.set(5, 10, 4); dl.castShadow = true;
    dl.shadow.mapSize.set(1024, 1024);
    dl.shadow.camera.near = 0.5; dl.shadow.camera.far = 28;
    dl.shadow.camera.left = -8; dl.shadow.camera.right = 8;
    dl.shadow.camera.top = 8; dl.shadow.camera.bottom = -8;
    cs.add(dl);
    const gl = new THREE.PointLight(0xCC1924, 0.3, 16);
    gl.position.set(-1.5, 4, 0.5); cs.add(gl);

    const floorMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(24, 24),
        new THREE.MeshStandardMaterial({ color: 0x0A0A0C, roughness: 0.95, metalness: 0 })
    );
    floorMesh.rotation.x = -Math.PI / 2; floorMesh.receiveShadow = true; cs.add(floorMesh);
    cs.add(new THREE.GridHelper(14, 28, 0x1c1910, 0x171410));

    const G=4, TD=0.94, GG=0.06, SP=TD+GG, S0=-(G/2-0.5)*SP;

    function mkTex(seed) {
        const cv = document.createElement('canvas'); cv.width = cv.height = 512;
        const x = cv.getContext('2d');
        const R = n => (Math.sin(seed * 9301 + n * 49297) * 0.5 + 0.5);
        const bl = 22 + R(1) * 9;
        const gr = x.createLinearGradient(0, 0, 512, 512);
        gr.addColorStop(0,    `hsl(215,${5+R(2)*3}%,${bl+5}%)`);
        gr.addColorStop(0.38, `hsl(212,${4+R(3)*3}%,${bl}%)`);
        gr.addColorStop(0.72, `hsl(218,${6+R(4)*3}%,${bl-3}%)`);
        gr.addColorStop(1,    `hsl(214,${5+R(5)*2}%,${bl+3}%)`);
        x.fillStyle = gr; x.fillRect(0, 0, 512, 512);
        for (let v = 0; v < 7; v++) {
            x.save(); x.globalAlpha = 0.03 + R(v+10)*0.05;
            x.strokeStyle = `rgba(190,195,205,${0.25+R(v+20)*0.2})`;
            x.lineWidth = 0.4 + R(v+30)*1.0; x.beginPath();
            let vx = R(v+40)*512, vy = 0; x.moveTo(vx, vy);
            for (let s = 0; s < 8; s++) {
                const cx1=vx+(R(v*8+s*3+1)-0.5)*110, cy1=vy+32+R(v*8+s*3+2)*28;
                const cx2=vx+(R(v*8+s*3+3)-0.5)*90,  cy2=vy+55+R(v*8+s*3+4)*20;
                vx += (R(v*8+s*3+5)-0.5)*78; vy += 64;
                x.bezierCurveTo(cx1, cy1, cx2, cy2, vx, vy);
            }
            x.stroke(); x.restore();
        }
        const t = new THREE.Texture(cv); t.needsUpdate = true; return t;
    }
    const TEXS = [mkTex(1), mkTex(2), mkTex(3), mkTex(4)];

    const ridgeMat = new THREE.MeshStandardMaterial({ color: 0x9E8362, roughness: 0.87, metalness: 0 });
    const ridgeGeo = new THREE.BoxGeometry(TD*0.88, 0.033, 0.062);
    const ridgeSets = [];
    for (let r = 0; r < G; r++) {
        for (let c = 0; c < G; c++) {
            const grp = new THREE.Group();
            grp.position.set(S0+c*SP, 0.017, S0+r*SP);
            for (let k = 0; k < 6; k++) {
                const ridge = new THREE.Mesh(ridgeGeo, ridgeMat);
                ridge.position.z = (TD*0.82/5)*k - TD*0.82/2 + TD*0.82/10;
                ridge.castShadow = true; grp.add(ridge);
            }
            grp.visible = false; grp.scale.x = 0; cs.add(grp);
            ridgeSets.push({ grp, r, c });
        }
    }

    const tileGeo = new THREE.BoxGeometry(TD, 0.058, TD);
    const tiles = [];
    for (let r = 0; r < G; r++) {
        for (let c = 0; c < G; c++) {
            const mat = new THREE.MeshStandardMaterial({ map:TEXS[(r*G+c)%4], roughness:0.14, metalness:0.18 });
            const mesh = new THREE.Mesh(tileGeo, mat);
            mesh.position.set(S0+c*SP, 3.5, S0+r*SP);
            mesh.castShadow = true; mesh.receiveShadow = true; mesh.visible = false; cs.add(mesh);
            tiles.push({ mesh, tx:S0+c*SP, tz:S0+r*SP, r, c });
        }
    }

    const grMat = new THREE.MeshBasicMaterial({ color: 0x9C9B91, transparent: true, opacity: 0 });
    for (let r = 0; r <= G; r++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(G*SP+GG*2, GG), grMat); m.rotation.x=-Math.PI/2; m.position.set(0, 0.062, S0-SP/2+r*SP); cs.add(m); }
    for (let c = 0; c <= G; c++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(GG, G*SP+GG*2), grMat); m.rotation.x=-Math.PI/2; m.position.set(S0-SP/2+c*SP, 0.062, 0); cs.add(m); }

    const trowel = new THREE.Group();
    const blM = new THREE.MeshStandardMaterial({ color: 0xCCCCCC, roughness: 0.16, metalness: 0.93 });
    trowel.add(new THREE.Mesh(new THREE.BoxGeometry(1.30, 0.014, 0.42), blM));
    for (let t = 0; t < 11; t++) { const n = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.072, 0.068), blM); n.position.set(-0.575+t*0.115,-0.043,0.225); trowel.add(n); }
    const spine = new THREE.Mesh(new THREE.BoxGeometry(1.30, 0.028, 0.038), blM); spine.position.set(0,0.021,-0.2); trowel.add(spine);
    const nkM = new THREE.MeshStandardMaterial({ color: 0x909090, roughness: 0.38, metalness: 0.82 });
    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.1), nkM); neck.position.set(0,0.12,-0.04); trowel.add(neck);
    const hdM = new THREE.MeshStandardMaterial({ color: 0x7C4418, roughness: 0.76, metalness: 0 });
    const hd = new THREE.Mesh(new THREE.CylinderGeometry(0.037, 0.044, 0.74, 12), hdM); hd.rotation.x=-0.52; hd.position.set(0,0.41,-0.24); trowel.add(hd);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.037, 0.17, 12), new THREE.MeshStandardMaterial({ color:0x280d04, roughness:0.92 })); cap.rotation.x=-0.52; cap.position.set(0,0.70,-0.43); trowel.add(cap);
    trowel.rotation.x=-0.28; trowel.position.set(-5,0.48,0); trowel.visible=false; cs.add(trowel);

    function startLoop() { (function loop(){ requestAnimationFrame(loop); cc.lookAt(0,0,0); cr.render(cs,cc); })(); }
    cr.render(cs, cc);

    gsap.set('.craft-overlay', { xPercent: -50, yPercent: -50 });

    function setPhase(n) { document.querySelectorAll('.craft-phase').forEach((el,i) => el.classList.toggle('active', i<n)); }

    let tl;
    function runAnim() {
        const O = 3.4;
        tl = gsap.timeline();

        // Text erscheint mittig
        tl.to('.craft-badge',      { opacity:1, duration:0.7, ease:'power2.out' }, 0.1);
        tl.to('.craft-title span', { y:'0%', opacity:1, duration:1.1, stagger:0.13, ease:'power4.out' }, 0.4);
        tl.to('.craft-sub',        { opacity:1, duration:0.9, ease:'power2.out' }, 0.9);

        // Text bewegt sich nach oben-links
        tl.to('.craft-overlay', { top: '130px', left: '64px', xPercent: 0, yPercent: 0, duration: 1.1, ease: 'power3.inOut' }, 2.0);

        // Kachel-Animation startet nach dem Text-Intro
        tl.to(cc.position, { y:5.4, z:6.8, duration:1.5, ease:'power2.inOut' }, O);
        tl.call(() => setPhase(1), null, O+0.6);
        tl.call(() => { setPhase(2); trowel.visible=true; }, null, O+1.3);
        tl.to(trowel.position, { x:-3.0, duration:0.55, ease:'back.out(1.3)' }, O+1.3);
        tl.to(trowel.position, { x:3.5, duration:2.9, ease:'power1.inOut' }, O+2.0);
        tl.to(trowel.rotation, { y:0.07, duration:2.9, ease:'sine.inOut' }, O+2.0);
        tl.to(trowel.position, { z:-0.5, duration:2.9, ease:'sine.inOut' }, O+2.0);
        for (let c = 0; c < G; c++) {
            tl.call(() => { ridgeSets.filter(rs => rs.c===c).forEach(rs => { rs.grp.visible=true; gsap.to(rs.grp.scale, { x:1, duration:0.38, ease:'power2.out' }); }); }, null, O+2.2+c*0.65);
        }
        tl.to(trowel.position, { x:5.0, y:1.2, duration:0.55, ease:'power2.in' }, O+4.8);
        tl.call(() => { trowel.visible=false; }, null, O+5.35);
        tl.call(() => setPhase(3), null, O+5.1);
        tl.to(cc.position, { x:0.6, y:5.0, z:6.2, duration:1.0, ease:'power2.inOut' }, O+5.1);
        tiles.forEach(({ mesh, tx, tz, r, c }) => {
            tl.call(() => {
                mesh.visible=true; mesh.position.set(tx, 2.4, tz); mesh.rotation.y=(Math.random()-0.5)*0.14;
                gsap.to(mesh.position, { y:0.062, duration:0.46, ease:'bounce.out' });
                gsap.to(mesh.rotation, { y:0, duration:0.28, ease:'back.out(3)' });
            }, null, O+5.4+r*0.44+c*0.1);
        });
        tl.call(() => setPhase(4), null, O+8.0);
        tl.to(grMat, { opacity:1, duration:1.4, ease:'power2.out' }, O+8.1);
        tl.to(gl, { intensity:1.5, duration:0.85, ease:'power2.out' }, O+8.4);
        tl.to(gl, { intensity:0.3, duration:1.6, ease:'power2.inOut' }, O+9.25);
        tl.to(cc.position, { x:3.2, y:6.2, z:5.6, duration:3.0, ease:'power1.inOut' }, O+8.8);
    }

    function resetAll() {
        if (tl) tl.kill();
        tiles.forEach(({ mesh, tx, tz }) => { gsap.killTweensOf(mesh.position); gsap.killTweensOf(mesh.rotation); mesh.visible=false; mesh.position.set(tx,3.5,tz); mesh.rotation.set(0,0,0); });
        ridgeSets.forEach(({ grp }) => { gsap.killTweensOf(grp.scale); grp.visible=false; grp.scale.x=0; });
        gsap.killTweensOf(cc.position); cc.position.set(0,7.5,9.5);
        gsap.killTweensOf(trowel.position); gsap.killTweensOf(trowel.rotation);
        trowel.visible=false; trowel.position.set(-5,0.48,0); trowel.rotation.set(-0.28,0,0);
        gsap.killTweensOf(grMat); grMat.opacity=0; gl.intensity=0.3; setPhase(0);
        gsap.killTweensOf('.craft-overlay');
        gsap.set('.craft-overlay', { top: '50%', left: '50%', xPercent: -50, yPercent: -50 });
        gsap.set('.craft-badge', { opacity:0 }); gsap.set('.craft-title span', { y:'110%', opacity:0 }); gsap.set('.craft-sub', { opacity:0 });
    }

    let loopStarted = false;
    function play() { if (!loopStarted) { startLoop(); loopStarted=true; } runAnim(); }

    ScrollTrigger.create({ trigger:'#craft', start:'top 60%', once:true, onEnter:play });
    const resetBtn = document.getElementById('craft-reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', () => { resetAll(); play(); });

    window.addEventListener('resize', () => { const w=craftSec.offsetWidth, h=craftSec.offsetHeight; cr.setSize(w,h); cc.aspect=w/h; cc.updateProjectionMatrix(); });
})();

/* ─── START ─── */
startHero();
