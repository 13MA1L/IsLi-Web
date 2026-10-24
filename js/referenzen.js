/* ─── PAGE-HERO ENTRANCE (title fix, content fades in) ─── */
(function revealOnLoad() {
    if (typeof gsap === 'undefined') return;
    gsap.timeline({ delay: 0.15 })
        .fromTo('.page-hero-sub', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .fromTo('.ref-card', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.04 }, '-=0.4')
        .fromTo('.page-cta', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.2');
})();

(function () {
    const cards = document.querySelectorAll('.ref-card');

    const lightbox = document.getElementById('ref-lightbox');
    if (!lightbox) return;
    const lbImg = lightbox.querySelector('.ref-lb-img');
    const lbCounter = lightbox.querySelector('.ref-lb-counter');
    let images = [];
    let index = 0;

    function show(i) {
        index = (i + images.length) % images.length;
        lbImg.src = images[index];
        lbCounter.textContent = `${index + 1} / ${images.length}`;
    }

    function openLightbox(imgs, start) {
        images = imgs;
        show(start);
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    cards.forEach(card => {
        card.addEventListener('click', () => {
            openLightbox(JSON.parse(card.dataset.images), 0);
        });
    });

    lightbox.querySelector('.ref-lb-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.ref-lb-prev').addEventListener('click', () => show(index - 1));
    lightbox.querySelector('.ref-lb-next').addEventListener('click', () => show(index + 1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    // Swipe (Touch): Bild folgt dem Finger, ab 50px Wechsel zum nächsten/vorherigen
    let startX = 0, startY = 0, dx = 0, swiping = false, locked = false;

    lightbox.addEventListener('touchstart', e => {
        if (e.touches.length !== 1) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        dx = 0;
        swiping = true;
        locked = false;
        lbImg.style.transition = 'none';
    }, { passive: true });

    lightbox.addEventListener('touchmove', e => {
        if (!swiping) return;
        dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        if (!locked) {
            if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
            if (Math.abs(dy) > Math.abs(dx)) { swiping = false; return; }
            locked = true;
        }
        lbImg.style.transform = `translateX(${dx}px)`;
    }, { passive: true });

    lightbox.addEventListener('touchend', () => {
        if (!swiping) return;
        swiping = false;
        if (!locked) return;
        const dir = dx < -50 ? 1 : dx > 50 ? -1 : 0;
        lbImg.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
        if (!dir) {
            lbImg.style.transform = '';
            return;
        }
        lbImg.style.transform = `translateX(${-dir * window.innerWidth}px)`;
        lbImg.style.opacity = '0';
        setTimeout(() => {
            show(index + dir);
            lbImg.style.transition = 'none';
            lbImg.style.transform = `translateX(${dir * window.innerWidth * 0.3}px)`;
            requestAnimationFrame(() => requestAnimationFrame(() => {
                lbImg.style.transition = 'transform 0.25s ease-out, opacity 0.25s ease-out';
                lbImg.style.transform = '';
                lbImg.style.opacity = '';
            }));
        }, 200);
    });

    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') show(index - 1);
        if (e.key === 'ArrowRight') show(index + 1);
    });
})();
