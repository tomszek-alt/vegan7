(function () {
  var PROGRESS_KEY = "vegan7_progress";

  var CURRENT_LANG = (function () {
    var seg = window.location.pathname.split("/")[1];
    return ["de", "en", "fr", "es"].indexOf(seg) !== -1 ? seg : "de";
  })();
  var DATA_URL = "/data/rezepte." + CURRENT_LANG + ".json";

  var I18N = {
    de: {
      day: "Tag", min: "Min.",
      showRecipe: "Zutaten & Zubereitung anzeigen",
      markDone: "Als erledigt markieren", markOpen: "Als offen markieren",
      noRecipes: "Keine Rezepte gefunden.",
      sending: "Wird angemeldet …",
      success: "Fast geschafft — bitte bestätige deine Anmeldung per E-Mail.",
      genericError: "Anmeldung fehlgeschlagen. Bitte später erneut versuchen.",
      connError: "Verbindung fehlgeschlagen. Bitte später erneut versuchen.",
      daysDone: "Tage geschafft",
      quotes: [
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
      ]
    },
    en: {
      day: "Day", min: "min",
      showRecipe: "Show ingredients & steps",
      markDone: "Mark as done", markOpen: "Mark as open",
      noRecipes: "No recipes found.",
      sending: "Signing up …",
      success: "Almost there — please confirm your signup by email.",
      genericError: "Signup failed. Please try again later.",
      connError: "Connection failed. Please try again later.",
      daysDone: "days done",
      quotes: [
        { headline: "You don't get stronger by watching.", sub: "7 days. One plan. No more excuses." },
        { headline: "Your comeback starts today — not tomorrow.", sub: "Day 1 doesn't wait for the perfect mood." },
        { headline: "No motivation high required. Just a plan.", sub: "Structure beats willpower." },
        { headline: "Discipline tastes better than excuses.", sub: "7 days, 21 recipes, zero compromises." },
        { headline: "Champions cook their own vegetables.", sub: "Then mark the day as done." },
        { headline: "The ring doesn't fill itself.", sub: "One day at a time." },
        { headline: "Vegan isn't a sacrifice. It's a level-up.", sub: "Find out for yourself in 7 days." },
        { headline: "You're tougher than your excuse.", sub: "And breakfast is already sorted." },
        { headline: "Small steps. Big difference.", sub: "One more checkmark every day." },
        { headline: "No elite athlete was built on the couch.", sub: "The first step is a recipe." }
      ]
    },
    fr: {
      day: "Jour", min: "min",
      showRecipe: "Voir ingrédients & préparation",
      markDone: "Marquer comme fait", markOpen: "Marquer comme non fait",
      noRecipes: "Aucune recette trouvée.",
      sending: "Inscription en cours …",
      success: "Presque terminé — confirme ton inscription par e-mail.",
      genericError: "Échec de l'inscription. Réessaie plus tard.",
      connError: "Échec de la connexion. Réessaie plus tard.",
      daysDone: "jours réussis",
      quotes: [
        { headline: "On ne devient pas plus fort en regardant.", sub: "7 jours. Un plan. Plus d'excuses." },
        { headline: "Ton renouveau commence aujourd'hui, pas demain.", sub: "Le jour 1 n'attend pas la motivation parfaite." },
        { headline: "Pas besoin de motivation. Juste un plan.", sub: "La structure bat la volonté." },
        { headline: "La discipline a meilleur goût que les excuses.", sub: "7 jours, 21 recettes, zéro compromis." },
        { headline: "Les champions cuisinent leurs légumes eux-mêmes.", sub: "Puis cochent la journée comme terminée." },
        { headline: "L'anneau ne se remplit pas tout seul.", sub: "Un jour après l'autre." },
        { headline: "Le végétal n'est pas un sacrifice. C'est un niveau supérieur.", sub: "Découvre-le en 7 jours." },
        { headline: "Tu es plus fort que ton excuse.", sub: "Et le petit-déjeuner est déjà prêt." },
        { headline: "Petits pas. Grande différence.", sub: "Une case cochée de plus chaque jour." },
        { headline: "Aucun athlète n'est né sur le canapé.", sub: "Le premier pas, c'est une recette." }
      ]
    },
    es: {
      day: "Día", min: "min",
      showRecipe: "Ver ingredientes y preparación",
      markDone: "Marcar como hecho", markOpen: "Marcar como pendiente",
      noRecipes: "No se encontraron recetas.",
      sending: "Suscribiendo …",
      success: "Casi listo — confirma tu suscripción por correo.",
      genericError: "Error al suscribirse. Inténtalo más tarde.",
      connError: "Fallo de conexión. Inténtalo más tarde.",
      daysDone: "días completados",
      quotes: [
        { headline: "No te haces más fuerte mirando.", sub: "7 días. Un plan. Sin más excusas." },
        { headline: "Tu regreso empieza hoy, no mañana.", sub: "El día 1 no espera al ánimo perfecto." },
        { headline: "No hace falta motivación. Solo un plan.", sub: "La estructura vence a la fuerza de voluntad." },
        { headline: "La disciplina sabe mejor que las excusas.", sub: "7 días, 21 recetas, cero excusas." },
        { headline: "Los campeones cocinan sus propias verduras.", sub: "Y luego marcan el día como hecho." },
        { headline: "El anillo no se llena solo.", sub: "Un día a la vez." },
        { headline: "Vegano no es sacrificio. Es subir de nivel.", sub: "Descúbrelo tú mismo en 7 días." },
        { headline: "Eres más fuerte que tu excusa.", sub: "Y el desayuno ya está listo." },
        { headline: "Pasos pequeños. Gran diferencia.", sub: "Una marca más cada día." },
        { headline: "Ningún atleta se hizo en el sofá.", sub: "El primer paso es una receta." }
      ]
    }
  };

  var T = I18N[CURRENT_LANG] || I18N.de;

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
      if (!r.ok) throw new Error("Recipes could not be loaded");
      return r.json();
    });
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
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
      html += '<div class="dcard plan-card step-card" data-day="' + day + '" id="tag-' + day + '" onclick="this.classList.toggle(\'expanded\')">';
      html += '<div class="dcard-top"><div class="badge">' + day + "</div>";
      html += '<span class="check" style="display:' + (isDone ? "inline" : "none") + '">✓</span>';
      html += '<span class="step-chevron">▾</span></div>';
      html += "<h3>" + T.day + " " + day + "</h3>";
      meals.forEach(function (m) {
        html += "<p><strong>" + escapeHtml(m.mahlzeit) + ":</strong> " + escapeHtml(m.titel) + "</p>";
      });

      html += '<div class="step-detail plan-detail">';
      meals.forEach(function (m, idx) {
        html += '<div class="plan-meal-detail"' + (idx > 0 ? ' style="margin-top:14px;"' : "") + '>';
        html += '<div class="plan-meal-head"><strong>' + escapeHtml(m.mahlzeit) + ": " + escapeHtml(m.titel) + '</strong>';
        html += '<span class="tag-pill" style="margin-left:8px;">' + m.zeit + " " + T.min + "</span></div>";
        html += "<ul>";
        m.zutaten.forEach(function (z) {
          html += "<li>" + escapeHtml(z) + "</li>";
        });
        html += "</ul>";
        html += '<p class="zubereitung-inline">' + escapeHtml(m.zubereitung) + "</p>";
        html += "</div>";
      });
      html += "</div>";

      html +=
        '<button class="cta secondary" style="margin-top:12px;width:100%" onclick="event.stopPropagation(); toggleDay(' +
        day +
        ')">' +
        (isDone ? T.markOpen : T.markDone) +
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
        html += '<span class="tag-pill mint">' + T.day + " " + r.tag + "</span>";
        html += '<span class="tag-pill">' + escapeHtml(r.mahlzeit) + "</span>";
        html += '<span class="tag-pill">' + r.zeit + " " + T.min + "</span>";
        html += '<span class="tag-pill">' + escapeHtml(r.schwer) + "</span>";
        html += "</div>";
        html += "<h3>" + escapeHtml(r.titel) + "</h3>";
        html += "<details><summary>" + T.showRecipe + "</summary>";
        html += "<ul>";
        r.zutaten.forEach(function (z) {
          html += "<li>" + escapeHtml(z) + "</li>";
        });
        html += "</ul>";
        html += '<div class="zubereitung">' + escapeHtml(r.zubereitung) + "</div>";
        html += "</details></div>";
      });
      container.innerHTML = html || '<p style="color:var(--grey)">' + T.noRecipes + "</p>";
    }

    if (dayFilter) dayFilter.addEventListener("change", draw);
    if (mealFilter) mealFilter.addEventListener("change", draw);
    draw();
  }

  function renderFakeBanner() {
    var headlineEl = document.querySelector(".fb-headline");
    var subEl = document.querySelector(".fb-sub");
    if (!headlineEl || !subEl || !T.quotes || !T.quotes.length) return;
    var pick = T.quotes[Math.floor(Math.random() * T.quotes.length)];
    headlineEl.textContent = pick.headline;
    subEl.textContent = pick.sub;
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
        msgEl.textContent = T.sending;
        msgEl.className = "nform-msg";

        fetch("/subscribe.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, lang: CURRENT_LANG }),
        })
          .then(function (r) {
            return r.json().then(function (data) {
              return { ok: r.ok, data: data };
            });
          })
          .then(function (res) {
            button.disabled = false;
            if (res.ok) {
              msgEl.textContent = T.success;
              msgEl.className = "nform-msg ok";
              emailInput.value = "";
            } else {
              msgEl.textContent = res.data.error || T.genericError;
              msgEl.className = "nform-msg err";
            }
          })
          .catch(function () {
            button.disabled = false;
            msgEl.textContent = T.connError;
            msgEl.className = "nform-msg err";
          });
      });
    });
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
