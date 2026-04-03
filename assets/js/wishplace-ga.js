/**
 * Wishplace – Google Analytics loader for sub-pages.
 * Respects the same cookie-consent flag used by the main site.
 */
(function () {
    if (localStorage.getItem('cookieConsent') !== 'accepted') return;

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-YLJR19TYZF');

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-YLJR19TYZF';
    document.head.appendChild(s);
})();
