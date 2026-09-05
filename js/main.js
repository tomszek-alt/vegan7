(function () {
  var PROGRESS_KEY = "vegan7_progress";

  var CURRENT_LANG = (function () {
    var seg = window.location.pathname.split("/")[1];
    return ["de", "en", "fr", "es"].indexOf(seg) !== -1 ? seg : "de";
  })();
  var DATA_URL = "/data/rezepte." + CURRENT_LANG + ".json";
  try {
    localStorage.setItem("vegan7_lang", CURRENT_LANG);
  } catch (e) {}

  var I18N = {
    de: {
      day: "Tag", min: "Min.",
      showRecipe: "Zutaten & Zubereitung anzeigen",
      markDone: "Als erledigt markieren", doneLabel: "Erledigt",
      confirmReset: "Wirklich zurücksetzen?",
      startCta: "Jetzt starten →", continueCta: "Weiter geht's →",
      noRecipes: "Keine Rezepte gefunden.",
      sending: "Wird angemeldet …",
      success: "Fast geschafft — bitte bestätige deine Anmeldung per E-Mail.",
      genericError: "Anmeldung fehlgeschlagen. Bitte später erneut versuchen.",
      connError: "Verbindung fehlgeschlagen. Bitte später erneut versuchen.",
      daysDone: "Tage geschafft",
      share: {
        title: "🎉 Tag {day} geschafft!",
        titleFinal: "🏆 Challenge komplett geschafft!",
        subtitle: "Teile deinen Fortschritt mit anderen.",
        subtitleFinal: "7 von 7 Tagen — das ist eine Leistung wert, sie zu teilen!",
        shareBtn: "Jetzt teilen",
        whatsapp: "Per WhatsApp teilen",
        copy: "Text kopieren",
        copied: "Kopiert!",
        close: "Schließen",
        text: "Ich habe Tag {day} von 7 der vegan7 Challenge geschafft! 💪🌱 Mach mit:",
        textFinal: "Ich habe die komplette 7-Tage-Vegan-Challenge geschafft! 🏆🌱 Mach mit:"
      },
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
      markDone: "Mark as done", doneLabel: "Done",
      confirmReset: "Really reset?",
      startCta: "Start now →", continueCta: "Continue →",
      noRecipes: "No recipes found.",
      sending: "Signing up …",
      success: "Almost there — please confirm your signup by email.",
      genericError: "Signup failed. Please try again later.",
      connError: "Connection failed. Please try again later.",
      daysDone: "days done",
      share: {
        title: "🎉 Day {day} done!",
        titleFinal: "🏆 Challenge complete!",
        subtitle: "Share your progress with others.",
        subtitleFinal: "7 out of 7 days — that's worth sharing!",
        shareBtn: "Share now",
        whatsapp: "Share via WhatsApp",
        copy: "Copy text",
        copied: "Copied!",
        close: "Close",
        text: "I just finished day {day} of 7 in the vegan7 challenge! 💪🌱 Join me:",
        textFinal: "I completed the entire 7-day vegan challenge! 🏆🌱 Join me:"
      },
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
      markDone: "Marquer comme fait", doneLabel: "Fait",
      confirmReset: "Vraiment réinitialiser ?",
      startCta: "Commencer →", continueCta: "Continuer →",
      noRecipes: "Aucune recette trouvée.",
      sending: "Inscription en cours …",
      success: "Presque terminé — confirme ton inscription par e-mail.",
      genericError: "Échec de l'inscription. Réessaie plus tard.",
      connError: "Échec de la connexion. Réessaie plus tard.",
      daysDone: "jours réussis",
      share: {
        title: "🎉 Jour {day} réussi !",
        titleFinal: "🏆 Défi terminé !",
        subtitle: "Partage ta progression avec les autres.",
        subtitleFinal: "7 jours sur 7 — ça mérite d'être partagé !",
        shareBtn: "Partager",
        whatsapp: "Partager via WhatsApp",
        copy: "Copier le texte",
        copied: "Copié !",
        close: "Fermer",
        text: "J'ai terminé le jour {day} sur 7 du défi vegan7 ! 💪🌱 Rejoins-moi :",
        textFinal: "J'ai terminé tout le défi vegan en 7 jours ! 🏆🌱 Rejoins-moi :"
      },
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
      markDone: "Marcar como hecho", doneLabel: "Hecho",
      confirmReset: "¿Reiniciar de verdad?",
      startCta: "Empezar →", continueCta: "Continuar →",
      noRecipes: "No se encontraron recetas.",
      sending: "Suscribiendo …",
      success: "Casi listo — confirma tu suscripción por correo.",
      genericError: "Error al suscribirse. Inténtalo más tarde.",
      connError: "Fallo de conexión. Inténtalo más tarde.",
      daysDone: "días completados",
      share: {
        title: "🎉 ¡Día {day} completado!",
        titleFinal: "🏆 ¡Reto completado!",
        subtitle: "Comparte tu progreso con otros.",
        subtitleFinal: "7 de 7 días — ¡eso merece compartirse!",
        shareBtn: "Compartir ahora",
        whatsapp: "Compartir por WhatsApp",
        copy: "Copiar texto",
        copied: "¡Copiado!",
        close: "Cerrar",
        text: "¡Acabo de completar el día {day} de 7 del reto vegan7! 💪🌱 Únete:",
        textFinal: "¡Completé todo el reto vegano de 7 días! 🏆🌱 Únete:"
      },
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

  var cachedRecipes = null;

  function toggleDay(day) {
    var progress = getProgress();
    var idx = progress.indexOf(day);
    var wasNotDone = idx === -1;
    if (idx === -1) {
      progress.push(day);
    } else {
      progress.splice(idx, 1);
    }
    setProgress(progress);
    renderRing();
    if (cachedRecipes && document.querySelector("[data-plan]")) {
      renderPlan(cachedRecipes);
    } else {
      renderDayCards();
    }
    if (wasNotDone) {
      openShareModal(day, day === 7);
    }
  }
  window.toggleDay = toggleDay;

  function buildShareText(day, isFinal) {
    var tmpl = isFinal ? T.share.textFinal : T.share.text.replace("{day}", day);
    var url = window.location.origin + "/" + CURRENT_LANG + "/";
    return tmpl + " " + url;
  }

  function openShareModal(day, isFinal) {
    var existing = document.getElementById("share-overlay");
    if (existing) existing.remove();

    var text = buildShareText(day, isFinal);
    var url = window.location.origin + "/" + CURRENT_LANG + "/";
    var title = isFinal ? T.share.titleFinal : T.share.title.replace("{day}", day);
    var subtitle = isFinal ? T.share.subtitleFinal : T.share.subtitle;

    var overlay = document.createElement("div");
    overlay.id = "share-overlay";
    overlay.className = "share-overlay" + (isFinal ? " share-final" : "");
    overlay.innerHTML =
      '<div class="share-modal">' +
      '<div class="share-emoji">' + (isFinal ? "🏆" : "🎉") + "</div>" +
      "<h3>" + title + "</h3>" +
      "<p>" + subtitle + "</p>" +
      '<button class="cta share-native-btn" style="width:100%;margin-top:16px;">' + T.share.shareBtn + "</button>" +
      '<a class="cta secondary share-whatsapp-btn" style="width:100%;margin-top:10px;display:block;text-align:center;text-decoration:none;">' + T.share.whatsapp + "</a>" +
      '<button class="cta secondary share-copy-btn" style="width:100%;margin-top:10px;">' + T.share.copy + "</button>" +
      '<button class="share-close-btn">' + T.share.close + "</button>" +
      "</div>";
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) overlay.remove();
    });
    overlay.querySelector(".share-close-btn").addEventListener("click", function () {
      overlay.remove();
    });

    overlay.querySelector(".share-native-btn").addEventListener("click", function () {
      if (navigator.share) {
        navigator.share({ text: text, url: url }).catch(function () {});
      } else {
        overlay.querySelector(".share-whatsapp-btn").scrollIntoView({ behavior: "smooth" });
      }
    });

    var waLink = overlay.querySelector(".share-whatsapp-btn");
    waLink.href = "https://wa.me/?text=" + encodeURIComponent(text);
    waLink.target = "_blank";
    waLink.rel = "noopener";

    overlay.querySelector(".share-copy-btn").addEventListener("click", function (e) {
      var btn = e.target;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = T.share.copied;
          setTimeout(function () {
            btn.textContent = T.share.copy;
          }, 1800);
        });
      }
    });
  }

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

    var dayOrder = [1, 2, 3, 4, 5, 6, 7].sort(function (a, b) {
      var aDone = progress.indexOf(a) !== -1;
      var bDone = progress.indexOf(b) !== -1;
      if (aDone === bDone) return a - b;
      return aDone ? 1 : -1;
    });

    var html = "";
    dayOrder.forEach(function (day) {
      var meals = byDay[day] || [];
      var isDone = progress.indexOf(day) !== -1;
      html += '<div class="dcard plan-card step-card' + (isDone ? " plan-card-done" : "") + '" data-day="' + day + '" id="tag-' + day + '" onclick="this.classList.toggle(\'expanded\')">';
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
        '<button class="cta ' + (isDone ? "" : "secondary") + ' toggle-day-btn" data-day="' +
        day + '" data-done="' + (isDone ? "1" : "0") + '" style="margin-top:12px;width:100%">' +
        (isDone ? "✓ " + T.doneLabel : T.markDone) +
        "</button>";
      html += "</div>";
    });
    container.innerHTML = html;
    attachPlanButtonHandlers(container);
  }

  function attachPlanButtonHandlers(container) {
    container.querySelectorAll(".toggle-day-btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var day = parseInt(btn.getAttribute("data-day"), 10);
        var isDoneState = btn.getAttribute("data-done") === "1";

        if (!isDoneState) {
          toggleDay(day);
          return;
        }

        if (btn._armed) {
          clearInterval(btn._armTimer);
          clearTimeout(btn._armTimeout);
          btn._armed = false;
          toggleDay(day);
          return;
        }

        btn._armed = true;
        var seconds = 5;
        var originalText = btn.textContent;
        var originalClass = btn.className;
        btn.textContent = T.confirmReset + " (" + seconds + ")";
        btn.classList.add("secondary");

        btn._armTimer = setInterval(function () {
          seconds--;
          if (seconds > 0) {
            btn.textContent = T.confirmReset + " (" + seconds + ")";
          }
        }, 1000);

        btn._armTimeout = setTimeout(function () {
          clearInterval(btn._armTimer);
          btn._armed = false;
          btn.textContent = originalText;
          btn.className = originalClass;
        }, 5000);
      });
    });
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

  function applyProgressAwareHomepage() {
    var onboardingEls = document.querySelectorAll(".onboarding-only");
    if (!onboardingEls.length) return;
    var progress = getProgress();
    var label = progress.length > 0 ? T.continueCta : T.startCta;

    if (progress.length > 0) {
      onboardingEls.forEach(function (el) {
        el.style.display = "none";
      });
    }

    document.querySelectorAll(".cta-dynamic-label").forEach(function (el) {
      el.textContent = label;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderRing();
    renderDayCards();
    renderFakeBanner();
    applyProgressAwareHomepage();
    initNewsletterForm();

    if (document.querySelector("[data-plan]") || document.querySelector("[data-recipes]")) {
      fetchRecipes()
        .then(function (recipes) {
          cachedRecipes = recipes;
          renderPlan(recipes);
          renderRecipeDatabase(recipes);
        })
        .catch(function (err) {
          console.error(err);
        });
    }
  });
})();
