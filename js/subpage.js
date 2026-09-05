gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray('.rv').forEach(el => {
    gsap.fromTo(el, { opacity:0, y:40 }, { opacity:1, y:0, duration:0.9, ease:'power3.out', scrollTrigger:{ trigger:el, start:'top 92%', toggleActions:'play none none none' } });
});
gsap.utils.toArray('.rv-l').forEach(el => {
    gsap.fromTo(el, { opacity:0, x:-40 }, { opacity:1, x:0, duration:0.9, ease:'power3.out', scrollTrigger:{ trigger:el, start:'top 92%', toggleActions:'play none none none' } });
});
gsap.utils.toArray('.rv-r').forEach(el => {
    gsap.fromTo(el, { opacity:0, x:40 }, { opacity:1, x:0, duration:0.9, ease:'power3.out', scrollTrigger:{ trigger:el, start:'top 92%', toggleActions:'play none none none' } });
});
