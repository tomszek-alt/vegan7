(function () {
  var CONSENT_KEY = "vegan7_cookie_consent";
  var ADSENSE_CLIENT = "ca-pub-4937837635392557";
  var GA_MEASUREMENT_ID = "G-TJQPQLTH4M";

  var LANG = (function () {
    var seg = window.location.pathname.split("/")[1];
    return ["de", "en", "fr", "es"].indexOf(seg) !== -1 ? seg : "de";
  })();

  var BANNER_TEXT = {
    de: 'Wir verwenden Cookies für Werbeanzeigen und Analyse (Google AdSense, Google Analytics), um vegan7.de kostenlos anbieten zu können. Details siehe <a href="/' + LANG + '/datenschutz.html" style="color:var(--mint)">Datenschutz</a>.',
    en: 'We use cookies for advertising and analytics (Google AdSense, Google Analytics) to offer vegan7 for free. See <a href="/' + LANG + '/datenschutz.html" style="color:var(--mint)">Privacy Policy</a> for details.',
    fr: 'Nous utilisons des cookies pour la publicité et l\'analyse (Google AdSense, Google Analytics) afin de proposer vegan7 gratuitement. Détails : <a href="/' + LANG + '/datenschutz.html" style="color:var(--mint)">Confidentialité</a>.',
    es: 'Utilizamos cookies para publicidad y análisis (Google AdSense, Google Analytics) para ofrecer vegan7 de forma gratuita. Más info: <a href="/' + LANG + '/datenschutz.html" style="color:var(--mint)">Privacidad</a>.'
  };

  var BUTTON_TEXT = {
    de: { accept: "Akzeptieren", decline: "Ablehnen" },
    en: { accept: "Accept", decline: "Decline" },
    fr: { accept: "Accepter", decline: "Refuser" },
    es: { accept: "Aceptar", decline: "Rechazar" }
  };

  function loadAdsense() {
    if (document.getElementById("adsbygoogle-script")) return;
    var script = document.createElement("script");
    script.id = "adsbygoogle-script";
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + ADSENSE_CLIENT;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }

  function loadGoogleAnalytics() {
    if (document.getElementById("ga4-script")) return;
    var script = document.createElement("script");
    script.id = "ga4-script";
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID);
  }

  function showBanner() {
    var t = BANNER_TEXT[LANG] || BANNER_TEXT.de;
    var b = BUTTON_TEXT[LANG] || BUTTON_TEXT.de;
    var banner = document.createElement("div");
    banner.id = "cookie-consent";
    banner.innerHTML =
      "<p>" + t + "</p>" +
      '<div class="actions">' +
      '<button id="cc-decline">' + b.decline + "</button>" +
      '<button id="cc-accept">' + b.accept + "</button>" +
      "</div>";
    document.body.appendChild(banner);

    document.getElementById("cc-accept").addEventListener("click", function () {
      localStorage.setItem(CONSENT_KEY, "granted");
      banner.remove();
      loadAdsense();
      loadGoogleAnalytics();
    });
    document.getElementById("cc-decline").addEventListener("click", function () {
      localStorage.setItem(CONSENT_KEY, "denied");
      banner.remove();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var consent = localStorage.getItem(CONSENT_KEY);
    if (consent === "granted") {
      loadAdsense();
      loadGoogleAnalytics();
    } else if (consent !== "denied") {
      showBanner();
    }
  });
})();
