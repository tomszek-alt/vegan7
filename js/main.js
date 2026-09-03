(function () {
  var PROGRESS_KEY = "vegan7_progress"; // Array mit abgeschlossenen Tagen, z.B. [1,2,3]
  var DATA_URL = "/data/rezepte.json";

  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function setProgress(days) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(days));
  }

  function toggleDay(day) {
    var progress = getProgress();
    var idx = progress.indexOf(day);
    if (idx === -1) {
      progress.push(day);
    } else {
      progress.splice(idx, 1);
    }
    setProgress(progress);
    renderRing();
    renderDayCards();
  }
  window.toggleDay = toggleDay;

  function renderRing() {
    var ringEl = document.querySelector("[data-ring]");
    if (!ringEl) return;
    var progress = getProgress();
    var done = progress.length;
    var pct = Math.round((done / 7) * 360);
    ringEl.style.background =
      "conic-gradient(var(--mint) 0deg " + pct + "deg, rgba(255,255,255,0.08) " + pct + "deg 360deg)";
    var bigText = ringEl.querySelector(".big");
    if (bigText) bigText.textContent = done + "/7";
  }

  function renderDayCards() {
    var grid = document.querySelector("[data-day-grid]");
    if (!grid) return;
    var progress = getProgress();
    var cards = grid.querySelectorAll(".dcard");
    cards.forEach(function (card) {
      var day = parseInt(card.getAttribute("data-day"), 10);
      var checkEl = card.querySelector(".check");
      if (progress.indexOf(day) !== -1) {
        card.classList.remove("locked");
        if (checkEl) checkEl.style.display = "inline";
      } else if (checkEl) {
        checkEl.style.display = "none";
      }
    });
  }

  function fetchRecipes() {
    return fetch(DATA_URL).then(function (r) {
      if (!r.ok) throw new Error("Rezepte konnten nicht geladen werden");
      return r.json();
    });
  }

  function renderPlan(recipes) {
    var container = document.querySelector("[data-plan]");
    if (!container) return;
    var byDay = {};
    recipes.forEach(function (r) {
      byDay[r.tag] = byDay[r.tag] || [];
      byDay[r.tag].push(r);
    });
    var progress = getProgress();
    var html = "";
    for (var day = 1; day <= 7; day++) {
      var meals = byDay[day] || [];
      var isDone = progress.indexOf(day) !== -1;
      html += '<div class="dcard" data-day="' + day + '" id="tag-' + day + '">';
      html += '<div class="dcard-top"><div class="badge">' + day + "</div>";
      html += '<span class="check" style="display:' + (isDone ? "inline" : "none") + '">✓</span></div>';
      html += "<h3>Tag " + day + "</h3>";
      meals.forEach(function (m) {
        html += '<p><strong>' + escapeHtml(m.mahlzeit) + ":</strong> " + escapeHtml(m.titel) + "</p>";
      });
      html +=
        '<button class="cta secondary" style="margin-top:12px;width:100%" onclick="toggleDay(' +
        day +
        ')">' +
        (isDone ? "Als offen markieren" : "Als erledigt markieren") +
        "</button>";
      html += "</div>";
    }
    container.innerHTML = html;
  }

  function renderRecipeDatabase(recipes) {
    var container = document.querySelector("[data-recipes]");
    if (!container) return;

    var dayFilter = document.getElementById("filter-tag");
    var mealFilter = document.getElementById("filter-mahlzeit");

    function draw() {
      var dayVal = dayFilter ? dayFilter.value : "";
      var mealVal = mealFilter ? mealFilter.value : "";
      var filtered = recipes.filter(function (r) {
        return (!dayVal || String(r.tag) === dayVal) && (!mealVal || r.mahlzeit === mealVal);
      });
      var html = "";
      filtered.forEach(function (r) {
        html += '<div class="rcard" id="' + r.id + '">';
        html += '<div class="meta">';
        html += '<span class="tag-pill mint">Tag ' + r.tag + "</span>";
        html += '<span class="tag-pill">' + escapeHtml(r.mahlzeit) + "</span>";
        html += '<span class="tag-pill">' + r.zeit + " Min.</span>";
        html += '<span class="tag-pill">' + escapeHtml(r.schwer) + "</span>";
        html += "</div>";
        html += "<h3>" + escapeHtml(r.titel) + "</h3>";
        html += "<details><summary>Zutaten & Zubereitung anzeigen</summary>";
        html += "<ul>";
        r.zutaten.forEach(function (z) {
          html += "<li>" + escapeHtml(z) + "</li>";
        });
        html += "</ul>";
        html += '<div class="zubereitung">' + escapeHtml(r.zubereitung) + "</div>";
        html += "</details></div>";
      });
      container.innerHTML = html || '<p style="color:var(--grey)">Keine Rezepte gefunden.</p>';
    }

    if (dayFilter) dayFilter.addEventListener("change", draw);
    if (mealFilter) mealFilter.addEventListener("change", draw);
    draw();
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function initNewsletterForm() {
    var forms = document.querySelectorAll("[data-newsletter-form]");
    forms.forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var emailInput = form.querySelector('input[type="email"]');
        var msgEl = form.querySelector(".nform-msg");
        var button = form.querySelector("button");
        var email = emailInput.value.trim();

        if (!msgEl) {
          msgEl = document.createElement("div");
          msgEl.className = "nform-msg";
          form.appendChild(msgEl);
        }

        button.disabled = true;
        msgEl.textContent = "Wird angemeldet …";
        msgEl.className = "nform-msg";

        fetch("/subscribe.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        })
          .then(function (r) {
            return r.json().then(function (data) {
              return { ok: r.ok, data: data };
            });
          })
          .then(function (res) {
            button.disabled = false;
            if (res.ok) {
              msgEl.textContent = "Fast geschafft — bitte bestätige deine Anmeldung per E-Mail.";
              msgEl.className = "nform-msg ok";
              emailInput.value = "";
            } else {
              msgEl.textContent = res.data.error || "Anmeldung fehlgeschlagen. Bitte später erneut versuchen.";
              msgEl.className = "nform-msg err";
            }
          })
          .catch(function () {
            button.disabled = false;
            msgEl.textContent = "Verbindung fehlgeschlagen. Bitte später erneut versuchen.";
            msgEl.className = "nform-msg err";
          });
      });
    });
  }

  var FAKE_BANNER_QUOTES = [
    { headline: "Stärker wird man nicht durch Zusehen.", sub: "7 Tage. Ein Plan. Kein Ausreden mehr." },
    { headline: "Dein Comeback beginnt heute — nicht morgen.", sub: "Tag 1 wartet nicht auf die perfekte Stimmung." },
    { headline: "Kein Motivations-Hoch nötig. Nur ein Plan.", sub: "Struktur schlägt Willenskraft." },
    { headline: "Disziplin schmeckt besser als Ausreden.", sub: "7 Tage, 21 Rezepte, null Kompromisse." },
    { headline: "Champions kochen ihr Gemüse selbst.", sub: "Und markieren danach den Tag als erledigt." },
    { headline: "Der Ring füllt sich nicht von allein.", sub: "Ein Tag nach dem anderen." },
    { headline: "Vegan ist kein Verzicht. Es ist ein Level-up.", sub: "Finde es in 7 Tagen selbst heraus." },
    { headline: "Du bist härter als deine Ausrede.", sub: "Und das Frühstück steht schon bereit." },
    { headline: "Kleine Schritte. Großer Unterschied.", sub: "Jeden Tag ein Häkchen mehr." },
    { headline: "Kein Spitzensportler wurde am Sofa geboren.", sub: "Der erste Schritt ist ein Rezept." },
    { headline: "Kraft kommt aus Konsequenz, nicht aus Perfektion.", sub: "7 Tage reichen, um es zu spüren." },
    { headline: "Dein Körper merkt sich jeden geschafften Tag.", sub: "Fang mit Tag 1 an." },
    { headline: "Der Unterschied zwischen Wunsch und Ziel? Ein Plan.", sub: "Du hast ihn schon vor dir." },
    { headline: "Iss wie ein Athlet. Denk wie ein Anfänger.", sub: "Beides reicht für die ersten 7 Tage." },
    { headline: "Fortschritt ist lauter als Perfektion.", sub: "Ein Tag, ein Rezept, ein Häkchen." },
    { headline: "Die Challenge wartet nicht auf Montag.", sub: "Heute ist ein guter Tag 1." },
    { headline: "Nicht motiviert? Dann eben diszipliniert.", sub: "Der Plan denkt für dich mit." },
    { headline: "Sieben Tage können mehr verändern als du denkst.", sub: "Frag einfach jeden, der sie durchgezogen hat." },
    { headline: "Dein stärkstes Workout heute? Kochen statt bestellen.", sub: "Rezept für Rezept zum Ziel." },
    { headline: "Du brauchst keine Ausrüstung. Nur einen Teller.", sub: "Und sieben Tage Durchhaltevermögen." }
  ];

  function renderFakeBanner() {
    var headlineEl = document.querySelector(".fb-headline");
    var subEl = document.querySelector(".fb-sub");
    if (!headlineEl || !subEl) return;
    var pick = FAKE_BANNER_QUOTES[Math.floor(Math.random() * FAKE_BANNER_QUOTES.length)];
    headlineEl.textContent = pick.headline;
    subEl.textContent = pick.sub;
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderRing();
    renderDayCards();
    renderFakeBanner();
    initNewsletterForm();

    if (document.querySelector("[data-plan]") || document.querySelector("[data-recipes]")) {
      fetchRecipes()
        .then(function (recipes) {
          renderPlan(recipes);
          renderRecipeDatabase(recipes);
        })
        .catch(function (err) {
          console.error(err);
        });
    }
  });
})();
