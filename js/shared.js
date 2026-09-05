/* ─── NAV SCROLL ─── */
window.addEventListener('scroll', () => {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });
