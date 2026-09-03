(function () {
  var CONSENT_KEY = "vegan7_cookie_consent";
  var ADSENSE_CLIENT = "ca-pub-4937837635392557";

  function loadAdsense() {
    if (document.getElementById("adsbygoogle-script")) return;
    var script = document.createElement("script");
    script.id = "adsbygoogle-script";
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + ADSENSE_CLIENT;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }

  function showBanner() {
    var banner = document.createElement("div");
    banner.id = "cookie-consent";
    banner.innerHTML =
      '<p>Wir verwenden Cookies für Werbeanzeigen (Google AdSense), um vegan7.de kostenlos anbieten zu können. Details siehe <a href="/datenschutz.html" style="color:var(--mint)">Datenschutz</a>.</p>' +
      '<div class="actions">' +
      '<button id="cc-decline">Ablehnen</button>' +
      '<button id="cc-accept">Akzeptieren</button>' +
      "</div>";
    document.body.appendChild(banner);

    document.getElementById("cc-accept").addEventListener("click", function () {
      localStorage.setItem(CONSENT_KEY, "granted");
      banner.remove();
      loadAdsense();
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
    } else if (consent !== "denied") {
      showBanner();
    }
  });
})();
