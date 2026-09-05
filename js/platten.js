gsap.registerPlugin(ScrollTrigger);

/* ─── MATERIAL DATA ─── */
const MATS = [
    { name: 'Weisser Marmor', desc: 'Zeitlose Eleganz aus der Natur. Jede Platte ein Unikat mit einzigartiger Maserung — ideal für Bäder, Küchen und repräsentative Räume.', color: '#E0D8CC', img: 'marmor.jpg', rut: 'Mittel', wa: 'Stark', use: 'Innen', rough: 0.28, metal: 0.04 },
    { name: 'Anthrazit', desc: 'Kraftvoll und elegant. Polierter Anthrazit bringt moderne Tiefe in jeden Raum und harmoniert mit nahezu jedem Einrichtungsstil.', color: '#3A3E45', img: 'anthrazit.jpg', rut: 'Stark', wa: 'Stark', use: 'Innen & Aussen', rough: 0.12, metal: 0.18 },
    { name: 'Warmstein (Beige)', desc: 'Natürliche Wärme und Behaglichkeit. Der sanfte Sandton schafft ein einladendes Ambiente in Wohnräumen und Küchen.', color: '#C8AA88', img: 'warmstein.jpg', rut: 'Mittel', wa: 'Schwach', use: 'Innen', rough: 0.48, metal: 0.02 },
    { name: 'Betonoptik', desc: 'Industriell und modern. Die authentische Betonoberfläche verleiht Räumen urbanen Charakter ohne den Aufwand echter Betonböden.', color: '#7A7A7A', img: 'betonoptik.jpg', rut: 'Stark', wa: 'Mittel', use: 'Innen & Aussen', rough: 0.78, metal: 0.03 },
    { name: 'Holzoptik', desc: 'Holzwärme trifft auf Keramikstärke. Beständig gegen Feuchtigkeit und Kratzer — perfekt für Wohnräume und Badezimmer.', color: '#7A5230', img: 'holzoptik.jpg', rut: 'Stark', wa: 'Mittel', use: 'Innen', rough: 0.68, metal: 0.01 },
    { name: 'Graphit Schwarz', desc: 'Maximale Dramatik und Eleganz. Tiefes Schwarz schafft starke Kontraste und macht jeden Raum zu einer bewussten Designaussage.', color: '#181818', img: 'graphit.jpg', rut: 'Schwach', wa: 'Stark', use: 'Innen & Aussen', rough: 0.08, metal: 0.22 },
    { name: 'Naturstein', desc: 'Authentischer Charakter direkt aus dem Steinbruch. Jede Platte einzigartig gespalten — ideal für Fassaden, Gartenmauern und Aussenbereiche mit rustikalem Flair.', color: '#8A8A86', img: 'naturstein.jpg', rut: 'Stark', wa: 'Schwach', use: 'Innen & Aussen', rough: 0.85, metal: 0.02 },
    { name: 'Terrazzo', desc: 'Zeitloses Design, neu interpretiert. Feine Gesteinssplitter verleihen jedem Raum eine lebendige, moderne Note.', color: '#A8A8A0', img: 'terrazzo.jpg', rut: 'Mittel', wa: 'Schwach', use: 'Innen', rough: 0.3, metal: 0.02 },
];

/* ─── PLATTEN-TEXTUREN (echte Fotos) ─── */
const texLoader = new THREE.TextureLoader();
const TEXS = MATS.map(m => {
    const tex = texLoader.load(`img/materials/${m.img}`);
    tex.encoding = THREE.sRGBEncoding;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
});

/* ─── HERO: FLOATING TILES ─── */
(function initHero() {
    const canvas = document.getElementById('tiles-canvas');
    const W = window.innerWidth, H = window.innerHeight;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(W, H, false); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setClearColor(0xD9D9D4, 1);
    renderer.outputEncoding = THREE.sRGBEncoding;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 10;

    const ptGeo = new THREE.BufferGeometry();
    const ptArr = new Float32Array(700 * 3);
    for (let i = 0; i < ptArr.length; i++) ptArr[i] = (Math.random() - .5) * 30;
    ptGeo.setAttribute('position', new THREE.BufferAttribute(ptArr, 3));
    scene.add(new THREE.Points(ptGeo, new THREE.PointsMaterial({ color: 0x999999, size: 0.035, transparent: true, opacity: 0.4 })));

    scene.add(new THREE.AmbientLight(0xffffff, 0.32));
    const dl = new THREE.DirectionalLight(0xffffff, 0.65); dl.position.set(5, 8, 6); scene.add(dl);
    const dl2 = new THREE.DirectionalLight(0xffffff, 0.2); dl2.position.set(-6, -3, -4); scene.add(dl2);
    const wl = new THREE.PointLight(0x4488ff, 0.2, 14); wl.position.set(8, -3, 2); scene.add(wl);

    const tiles = [];
    for (let i = 0; i < 28; i++) {
        const t = i % MATS.length;
        const sz = 0.85 + Math.random() * 0.9;
        const geo = new THREE.BoxGeometry(sz, sz, 0.055);
        const mat = new THREE.MeshStandardMaterial({ map: TEXS[t], roughness: MATS[t].rough, metalness: MATS[t].metal });
        const mesh = new THREE.Mesh(geo, mat);
        const theta = (i / 28) * Math.PI * 2 + Math.random() * 0.5;
        const r = 3.5 + Math.random() * 5.5;
        mesh.position.set(r * Math.cos(theta) * (0.8 + Math.random() * 0.4), (Math.random() - .5) * 10, (Math.random() - .7) * 8);
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI * 0.3);
        scene.add(mesh);
        tiles.push({ mesh, rx: (Math.random() - .5) * 0.004, ry: (Math.random() - .5) * 0.006, phase: Math.random() * Math.PI * 2, amp: 0.007 + Math.random() * 0.011 });
    }

    let clock = 0;
    function loop() {
        requestAnimationFrame(loop); clock += 0.007;
        tiles.forEach(({ mesh, rx, ry, phase, amp }) => { mesh.rotation.x += rx; mesh.rotation.y += ry; mesh.position.y += Math.sin(clock + phase) * amp; });
        camera.position.x = Math.sin(clock * 0.22) * 0.5; camera.position.y = Math.cos(clock * 0.17) * 0.3;
        camera.lookAt(0, 0, 0); renderer.render(scene, camera);
    }
    loop();

    let lastW = window.innerWidth;
    window.addEventListener('resize', () => {
        const W2 = window.innerWidth, H2 = window.innerHeight;
        if (W2 === lastW) return; // ignore height-only changes (mobile URL bar show/hide on scroll)
        lastW = W2;
        camera.aspect = W2 / H2; camera.updateProjectionMatrix(); renderer.setSize(W2, H2, false);
    });
})();

/* ─── MATERIAL STUDIO ─── */
(function initStudio() {
    const canvas = document.getElementById('cfg-canvas');
    if (!canvas) return;
    const W = canvas.offsetWidth || 500;
    canvas.style.height = W + 'px';

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(W, W); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setClearColor(0xD9D9D4, 1);
    renderer.outputEncoding = THREE.sRGBEncoding;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    camera.position.set(0, 0.4, 5.5); camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.32));
    const dl = new THREE.DirectionalLight(0xffffff, 0.75); dl.position.set(3, 5, 4); scene.add(dl);
    const dl2 = new THREE.DirectionalLight(0xffffff, 0.19); dl2.position.set(-3, -2, 3); scene.add(dl2);
    const bl = new THREE.PointLight(0x88aaff, 0.12, 10); bl.position.set(4, -2, -2); scene.add(bl);

    const tileMat = new THREE.MeshStandardMaterial({ map: TEXS[0], roughness: MATS[0].rough, metalness: MATS[0].metal });
    const tile = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.2, 0.08), tileMat);
    scene.add(tile);

    let clock = 0;
    function loop() { requestAnimationFrame(loop); clock += 0.0065; tile.rotation.y = clock; tile.rotation.x = Math.sin(clock * 0.38) * 0.14; renderer.render(scene, camera); }
    loop();

    const btns = document.getElementById('mat-btns');
    MATS.forEach((m, i) => {
        const btn = document.createElement('button');
        btn.className = 'mat-btn' + (i === 0 ? ' active' : '');
        btn.title = m.name;
        btn.innerHTML = `<div class="mat-btn-swatch" style="background-image:url('img/materials/${m.img}');"></div>`;
        btn.addEventListener('click', () => {
            tileMat.map = TEXS[i]; tileMat.roughness = m.rough; tileMat.metalness = m.metal; tileMat.needsUpdate = true;
            document.getElementById('mat-name').textContent = m.name;
            document.getElementById('mat-desc').textContent = m.desc;
            document.getElementById('prop-rut').textContent = m.rut;
            document.getElementById('prop-wa').textContent = m.wa;
            document.getElementById('prop-use').textContent = m.use;
            btns.querySelectorAll('.mat-btn').forEach((b, j) => b.classList.toggle('active', j === i));
        });
        btns.appendChild(btn);
    });

    window.addEventListener('resize', () => { const W2 = canvas.offsetWidth; canvas.style.height = W2 + 'px'; renderer.setSize(W2, W2); });
})();

/* ─── HERO TEXT ANIMATION ─── */
function startHeroAnim() {
    gsap.timeline()
        .to('#p-eyebrow', { opacity: 1, duration: 1, ease: 'power3.out' }, 0.3)
        .to('#p-sub', { opacity: 1, duration: 1, ease: 'power2.out' }, 1.0)
        .to('#p-btn', { opacity: 1, duration: 0.8, ease: 'power2.out' }, 1.3);
}

/* ─── SCROLL REVEALS ─── */
document.querySelectorAll('.rv').forEach(el => {
    ScrollTrigger.create({ trigger: el, start: 'top 86%', onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }) });
});
document.querySelectorAll('.rv-l').forEach(el => {
    ScrollTrigger.create({ trigger: el, start: 'top 86%', onEnter: () => gsap.to(el, { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out' }) });
});
document.querySelectorAll('.rv-r').forEach(el => {
    ScrollTrigger.create({ trigger: el, start: 'top 86%', onEnter: () => gsap.to(el, { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out' }) });
});

/* ─── START ─── */
startHeroAnim();
