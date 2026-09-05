(function () {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const msg = document.getElementById('form-msg');
    const submitBtn = form.querySelector('.f-submit');
    const loadedAt = Date.now();

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    const PHONE_RE = /^[+]?[0-9\s\-\/]{7,20}$/;

    const fields = [
        { input: form.querySelector('[name="Vorname"]'), error: document.getElementById('err-vorname'), required: true },
        { input: form.querySelector('[name="Nachname"]'), error: document.getElementById('err-nachname'), required: true },
        { input: form.querySelector('[name="E-Mail"]'), error: document.getElementById('err-email'), required: true, pattern: EMAIL_RE, patternMsg: 'Ungültige E-Mail-Adresse.' },
        { input: form.querySelector('[name="Telefon"]'), error: document.getElementById('err-telefon'), required: false, pattern: PHONE_RE, patternMsg: 'Ungültige Telefonnummer.' },
        { input: form.querySelector('[name="Nachricht"]'), error: document.getElementById('err-nachricht'), required: true }
    ];

    function clearError(f) {
        f.error.textContent = '';
        f.input.classList.remove('invalid');
        f.input.removeAttribute('aria-invalid');
    }

    function setError(f, text) {
        f.error.textContent = text;
        f.input.classList.add('invalid');
        f.input.setAttribute('aria-invalid', 'true');
    }

    function validateField(f) {
        const value = f.input.value.trim();
        if (f.required && !value) {
            setError(f, 'Pflichtfeld.');
            return false;
        }
        if (value && f.pattern && !f.pattern.test(value)) {
            setError(f, f.patternMsg);
            return false;
        }
        clearError(f);
        return true;
    }

    fields.forEach(f => {
        f.input.addEventListener('blur', () => validateField(f));
        f.input.addEventListener('input', () => {
            if (f.input.classList.contains('invalid')) validateField(f);
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        msg.className = 'f-msg';
        msg.textContent = '';

        let firstInvalid = null;
        fields.forEach(f => {
            if (!validateField(f) && !firstInvalid) firstInvalid = f.input;
        });

        if (firstInvalid) {
            firstInvalid.focus();
            return;
        }

        /* Zeitfalle: ein Mensch braucht länger als 2s, um das Formular auszufüllen */
        if (Date.now() - loadedAt < 2000) {
            msg.className = 'f-msg error';
            msg.textContent = 'Bitte versuchen Sie es erneut.';
            return;
        }
        if (form.querySelector('[name="_gotcha"]').value) {
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Wird gesendet …';

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                form.reset();
                fields.forEach(clearError);
                msg.classList.add('success');
                msg.textContent = 'Danke für Ihre Nachricht! Wir melden uns innerhalb eines Werktages.';
            } else {
                msg.classList.add('error');
                msg.textContent = 'Da ist etwas schiefgelaufen. Bitte versuchen Sie es erneut oder rufen Sie uns an.';
            }
        } catch (err) {
            msg.classList.add('error');
            msg.textContent = 'Da ist etwas schiefgelaufen. Bitte versuchen Sie es erneut oder rufen Sie uns an.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Anfrage senden';
        }
    });
})();
