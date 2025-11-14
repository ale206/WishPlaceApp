document.addEventListener('DOMContentLoaded', () => {
    const notifyForm = document.getElementById('notify-form');
    const emailInput = document.getElementById('email-input');
    const countrySelect = document.getElementById('country-select');
    const messageBox = document.getElementById('message-box');
    const closeButton = document.getElementById('close-button');
    const userTypeSelect = document.getElementById('user-type-select');
    const messageInput = document.getElementById('message-input');
    

    // --- START i18n LOGIC ---
    const langSwitcher = document.getElementById('lang-switcher');
    const langButton = document.getElementById('lang-button');
    const langDropdown = document.getElementById('lang-dropdown');
    const langCurrent = document.getElementById('lang-current');
    const langOptions = document.querySelectorAll('.lang-option');
    const supportedLangs = ['en', 'it', 'es', 'fr'];
    // currentLang is now global (defined above translations object)

    if (countrySelect) {
        // Don’t touch the first placeholder <option>, just append the rest
        COUNTRY_OPTIONS.forEach(({ code, name }) => {
            const opt = document.createElement('option');
            opt.value = code;
            opt.textContent = name;
            countrySelect.appendChild(opt);
        });
    }

    if (messageInput) {
        messageInput.addEventListener('input', () => {
            messageInput.classList.remove('border-red-500', 'focus:ring-red-500');
            messageInput.classList.add('border-gray-300', 'focus:ring-blue-500');
        });
    }
    
    const setLanguage = (lang) => {
        if (!supportedLangs.includes(lang)) {
            lang = 'en';
        }
        currentLang = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang; // Set HTML lang attribute

        const langStrings = translations[lang];

        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.dataset.key;
            if (langStrings[key]) {
                if (el.hasAttribute('placeholder')) {
                    el.placeholder = langStrings[key];
                } else if (el.tagName === 'IMG' && el.hasAttribute('alt')) {
                    el.alt = langStrings[key];
                } else if (el.id === 'page-title') {
                    el.textContent = langStrings[key];
                } else {
                    // Use innerHTML to render <strong> and <em> tags
                    el.innerHTML = langStrings[key];
                }
            }
        });

        // Update language switcher text
        const langOption = document.querySelector(`.lang-option[data-lang="${lang}"]`);
        if (langOption) {
            langCurrent.textContent = langOption.textContent;
        }

        // Update active class in dropdown
        langOptions.forEach(opt => opt.classList.remove('active'));
        if (langOption) {
            langOption.classList.add('active');
        }

        // Hide dropdown
        langDropdown.classList.add('hidden');
    };

    // Toggle dropdown
    langButton.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        // Check if langSwitcher exists before calling .contains
        if (langSwitcher && !langSwitcher.contains(e.target)) {
            langDropdown.classList.add('hidden');
        }
    });

    // Set language on option click
    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.target.dataset.lang;
            setLanguage(lang);
        });
    });

    // Initialize language
    const savedLang = localStorage.getItem('language');
    const browserLang = navigator.language.split('-')[0];

    if (savedLang && supportedLangs.includes(savedLang)) {
        setLanguage(savedLang);
    } else if (browserLang && supportedLangs.includes(browserLang)) {
        setLanguage(browserLang);
    } else {
        setLanguage('en'); // Default
    }
    // --- END i18n LOGIC ---


    // --- Dropdown Placeholder Logic ---

    countrySelect.addEventListener('change', () => {
        if (countrySelect.value === "") {
            countrySelect.classList.add('text-gray-500');
            countrySelect.classList.remove('text-gray-900');
        } else {
            countrySelect.classList.remove('text-gray-500');
            countrySelect.classList.add('text-gray-900');
        }
    });

    // NEW: Add placeholder logic for user type dropdown
    userTypeSelect.addEventListener('change', () => {
        if (userTypeSelect.value === "") {
            userTypeSelect.classList.add('text-gray-500');
            userTypeSelect.classList.remove('text-gray-900');
        } else {
            userTypeSelect.classList.remove('text-gray-500');
            userTypeSelect.classList.add('text-gray-900');
        }
    });

    // --- Form submission logic is now in its own script tag ---
});



<!-- UPDATED: Second script for form submission -->

document.addEventListener('DOMContentLoaded', () => {
    // This logic runs after the first DOMContentLoaded, so i18n translations are ready

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw6_ziv-zh0vbUlg_AmZafrNO06NP4yYkwSsr32ptGhs7YV_DNP5i9GonlLQ1i3O8lz/exec'; // URL Web App

    const form = document.getElementById('notify-form');
    const btn = document.getElementById('notify-submit');
    const consent = document.getElementById('consent-checkbox');
    const consentLabel = document.getElementById('consent-label');
    const emailInput = document.getElementById('email-input');
    const countrySelectEl = document.getElementById('country-select');
    const userTypeSelectEl = document.getElementById('user-type-select');
    const messageInput = document.getElementById('message-input');
    const formErrorDiv = document.getElementById('form-error-message');

    if (!form || !btn || !consent || !consentLabel || !emailInput || !countrySelectEl || !userTypeSelectEl || !formErrorDiv) { 
        console.error("Form elements not found. Submission will not work.");
        return;
    }

    // Store original button text (which is set by i18n)
    let originalBtnText = btn.innerHTML;
    // Update it if language changes
    new MutationObserver(() => {
        if (!btn.disabled) {
            originalBtnText = btn.innerHTML;
        }
    }).observe(btn, {childList: true});


    // Consent checkbox logic (no auto-disabling of button)
    consent.addEventListener('change', () => {
        consentLabel.classList.remove('text-red-600', 'font-semibold');
        consentLabel.classList.add('text-gray-700');
        consent.classList.remove('ring-2', 'ring-red-500');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // --- Honeypot check ---
        const honeypot = form.querySelector('input[name="gotcha"]');
        if (honeypot && honeypot.value) {
            console.log("Bot submission detected.");
            return; // Silently fail for bots
        }
        // --- End Honeypot check ---

        // Get current translations
        const langStrings = translations[currentLang] || translations['en'];
        let errorMessages = [];

        // Reset previous error states
        consentLabel.classList.remove('text-red-600', 'font-semibold');
        consentLabel.classList.add('text-gray-700');
        consent.classList.remove('ring-2', 'ring-red-500');
        emailInput.classList.remove('border-red-500', 'focus:ring-red-500');
        emailInput.classList.add('border-gray-300', 'focus:ring-blue-500');
        countrySelectEl.classList.remove('border-red-500', 'focus:ring-red-500');
        countrySelectEl.classList.add('border-gray-300', 'focus:ring-blue-500');
        userTypeSelectEl.classList.remove('border-red-500', 'focus:ring-red-500'); // NEW
        userTypeSelectEl.classList.add('border-gray-300', 'focus:ring-blue-500'); // NEW
        formErrorDiv.classList.add('hidden');
        formErrorDiv.innerHTML = '';

        let hasError = false;

        // Consent feedback
        if (!consent.checked) {
            consentLabel.classList.remove('text-gray-700');
            consentLabel.classList.add('text-red-600', 'font-semibold');
            consent.classList.add('ring-2', 'ring-red-500');
            errorMessages.push(langStrings.formErrorConsent);
            hasError = true;
        }

        // Email feedback (custom regex) - red border only
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            emailInput.classList.remove('border-gray-300', 'focus:ring-blue-500');
            emailInput.classList.add('border-red-500', 'focus:ring-red-500');
            errorMessages.push(langStrings.formErrorEmail);
            hasError = true;
        }

        // NEW: User Type feedback
        if (!userTypeSelectEl.value) {
            userTypeSelectEl.classList.remove('border-gray-300', 'focus:ring-blue-500');
            userTypeSelectEl.classList.add('border-red-500', 'focus:ring-red-500');
            errorMessages.push(langStrings.formErrorUserType);
            hasError = true;
        }

        // Country feedback
        if (!countrySelectEl.value) {
            countrySelectEl.classList.remove('border-gray-300', 'focus:ring-blue-500');
            countrySelectEl.classList.add('border-red-500', 'focus:ring-red-500');
            errorMessages.push(langStrings.formErrorCountry);
            hasError = true;
        }

        // --- MESSAGE (optional but max 1000 chars) ---
        if (messageInput && messageInput.value.trim().length > 1000) {
            messageInput.classList.remove('border-gray-300', 'focus:ring-blue-500');
            messageInput.classList.add('border-red-500', 'focus:ring-red-500');

            errorMessages.push(langStrings.formErrorMessageTooLong || "Message is too long (max 1000 characters).");
            hasError = true;
        }

        if (hasError) {
            formErrorDiv.innerHTML = errorMessages.join('<br>');
            formErrorDiv.classList.remove('hidden');
            return;
        }

        // --- Start Submission ---
        btn.disabled = true;
        btn.setAttribute('aria-busy', 'true');
        btn.classList.add('opacity-75', 'cursor-not-allowed');

        const loadingText = langStrings.formLoadingText || 'Sending…';
        btn.innerHTML = '<span class="loader" aria-hidden="true"></span><span class="ml-2">' + loadingText + '</span>';

        // Resolve client IP before submit
        let clientIp = '';
        try {
            const ipRes = await fetch('https://api.ipify.org?format=json');
            const ipJson = await ipRes.json();
            clientIp = ipJson.ip || '';
        } catch (_) { /* ignore */
        }

        const fd = new FormData(form);
        fd.append('ua', navigator.userAgent);
        fd.append('ip', clientIp);

        try {
            await fetch(SCRIPT_URL, {method: 'POST', body: fd, mode: 'no-cors'});

            // Show confirmation popup
            const messageBox = document.getElementById('message-box');
            const closeButton = document.getElementById('close-button');

            // Reset form fields
            emailInput.value = '';
            countrySelectEl.value = '';
            countrySelectEl.classList.add('text-gray-500');
            countrySelectEl.classList.remove('text-gray-900');
            userTypeSelectEl.value = ''; // NEW
            userTypeSelectEl.classList.add('text-gray-500'); // NEW
            userTypeSelectEl.classList.remove('text-gray-900'); // NEW
            consent.checked = false; // reset consent
            if (messageInput) {
                messageInput.value = ''; // NEW
            }

            if (messageBox) messageBox.classList.remove('hidden');

            // Handlers to close popup
            if (closeButton && messageBox) {
                closeButton.onclick = () => messageBox.classList.add('hidden');
                messageBox.onclick = (ev) => {
                    if (ev.target === messageBox) messageBox.classList.add('hidden');
                };
            }
        } catch (err) {
            // REPLACED ALERT with inline error
            formErrorDiv.innerHTML = langStrings.formErrorDefault || 'An error occurred. Please try again later.';
            formErrorDiv.classList.remove('hidden');
        } finally {
            // Restore button state
            btn.disabled = false;
            btn.removeAttribute('aria-busy');
            btn.classList.remove('opacity-75', 'cursor-not-allowed');
            btn.innerHTML = originalBtnText; // Restore original translated text
        }
    });
});
