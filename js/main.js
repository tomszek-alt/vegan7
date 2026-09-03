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

  document.addEventListener("DOMContentLoaded", function () {
    renderRing();
    renderDayCards();
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
