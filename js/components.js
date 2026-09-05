(function () {
    const navEl = document.getElementById('nav');
    const page = navEl?.dataset.page || '';
    const base = navEl?.dataset.base || '';

    /* ─── NAV ─── */
    if (navEl) {
        const aboutHref = page === 'home' ? '#about' : `${base}index.html#about`;
        navEl.innerHTML = `
        <a href="${base}index.html" class="nav-logo"><img src="${base}img/IsliGmbH.png" alt="IsLi GmbH"></a>
        <button class="nav-toggle" aria-label="Menü öffnen" aria-expanded="false"><span></span><span></span><span></span></button>
        <ul class="nav-links">
            <li>
                <a href="${base}index.html"${page === 'home' ? ' class="active"' : ''}>Home</a>
            </li>
            <li class="nav-item-drop">
                <a href="javascript:void(0)"${page === 'leistungen' ? ' class="active"' : ''}>Leistungen</a>
                <ul class="nav-sub">
                    <li><a href="${base}leistungen/eigenheim-neubau.html">Eigenheim & Neubau</a></li>
                    <li><a href="${base}leistungen/renovation-umbau.html">Renovation & Umbau</a></li>
                    <li><a href="${base}leistungen/reparatur-service.html">Reparatur & Service</a></li>
                    <li><a href="${base}platten.html">Plattenverkauf & Beratung</a></li>
                </ul>
            </li>
            <li class="nav-item-drop">
                <a href="javascript:void(0)"${page === 'projekte' ? ' class="active"' : ''}>Referenzen</a>
                <ul class="nav-sub">
                    <li><a href="${base}referenzen/baeder.html">Bäder</a></li>
                    <li><a href="${base}referenzen/kuechen.html">Küchen</a></li>
                    <li><a href="${base}referenzen/wohnzimmer.html">Wohnzimmer</a></li>
                    <li><a href="${base}referenzen/terrassen.html">Terrassen</a></li>
                </ul>
            </li>
            <li><a href="${base}platten.html"${page === 'platten' ? ' class="active"' : ''}>Plattensortiment</a></li>
            <li><a href="${base}team.html"${page === 'team' ? ' class="active"' : ''}>Team</a></li>
            <li><a href="${base}karriere.html"${page === 'karriere' ? ' class="active"' : ''}>Karriere</a></li>
            <li><a href="${base}kontakt.html" class="${page === 'kontakt' ? 'nav-cta active' : 'nav-cta'}">Kontakt</a></li>
        </ul>`;

        /* ─── MOBILE MENU ─── */
        const toggle = navEl.querySelector('.nav-toggle');
        const links = navEl.querySelector('.nav-links');
        const backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        document.body.appendChild(backdrop);

        function closeMenu() {
            toggle.classList.remove('open');
            links.classList.remove('open');
            backdrop.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('nav-locked');
        }

        function openMenu() {
            toggle.classList.add('open');
            links.classList.add('open');
            backdrop.classList.add('open');
            toggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('nav-locked');
        }

        toggle.addEventListener('click', () => {
            links.classList.contains('open') ? closeMenu() : openMenu();
        });
        backdrop.addEventListener('click', closeMenu);

        links.querySelectorAll('a').forEach(a => {
            if (a.getAttribute('href') === 'javascript:void(0)') return;
            a.addEventListener('click', closeMenu);
        });

        navEl.querySelectorAll('.nav-item-drop').forEach(dropItem => {
            const dropLink = dropItem.querySelector(':scope > a');
            dropLink.addEventListener('click', (e) => {
                if (window.matchMedia('(max-width: 1024px)').matches) {
                    e.preventDefault();
                    dropItem.classList.toggle('open');
                }
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) closeMenu();
        });
    }

    /* ─── FOOTER ─── */
    const footerEl = document.querySelector('footer');
    if (footerEl) {
        footerEl.innerHTML = `
        <div class="f-inner">
            <div>
                <div class="f-logo"><img src="${base}img/IsliGmbH.png" alt="IsLi GmbH"></div>
                <p class="f-tagline">Ihr Spezialist für Platten-<br>und Keramikarbeiten in der Schweiz.<br>Zuverlässig. Präzise. Seit 2021.</p>
            </div>
            <div>
                <div class="f-col-title">Kontakt</div>
                <div class="f-contact-item"><span class="f-contact-text">Wintermoosstrasse 4<br>8583 Sulgen, Thurgau</span></div>
                <div class="f-contact-item"><a href="tel:+41788294251">+41 78 829 42 51</a></div>
                <div class="f-contact-item"><a href="mailto:info@isli.ch">info@isli.ch</a></div>
                <div class="f-contact-item"><span class="f-contact-text">Mo – Fr: 08:00 – 17:00 Uhr<br>Sa: 08:00 – 12:00 Uhr</span></div>
            </div>
            <div>
                <div class="f-col-title">Rechtliches</div>
                <ul class="f-links">
                    <li><a href="${base}impressum.html">Impressum</a></li>
                    <li><a href="${base}datenschutz.html">Datenschutz</a></li>
                </ul>
            </div>
        </div>
        <div class="f-bottom">
            <p class="f-copy">© 2026 IsLi GmbH · Alle Rechte vorbehalten</p>
        </div>`;
    }
})();
