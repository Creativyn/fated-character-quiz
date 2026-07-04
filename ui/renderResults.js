export function renderResults(results) {
  const container = document.getElementById("results-container");

  if (!container) {
    console.warn("renderResults: missing results-container");
    return;
  }

  if (!Array.isArray(results) || results.length === 0) {
    console.warn("renderResults: no results supplied");
    return;
  }

  container.innerHTML = "";

  const top = results[0];

  if (top) {
    const hero = document.createElement("section");
    hero.className = "result-hero";
    hero.style.setProperty("--accent", top.accent || top.color || "#60a5fa");

    hero.innerHTML = `
      ${
        top.portrait
          ? `
            <img
              class="result-hero-portrait"
              src="${top.portrait}"
              alt="${top.name}"
            />
          `
          : `
            <div
              class="result-hero-portrait placeholder"
              aria-hidden="true"
            ></div>
          `
      }

      <div class="result-hero-copy">
        <p class="result-kicker">You are most like...</p>

        <h2 class="result-hero-name">${top.name}</h2>

        ${
          top.heading ? `<p class="result-hero-heading">${top.heading}</p>` : ""
        }

        ${top.quote ? `<p class="result-hero-quote">“${top.quote}”</p>` : ""}
      </div>
    `;

    container.appendChild(hero);
  }

  results.forEach((personality, index) => {
    const card = document.createElement("article");
    card.className = "result-card";

    if (index === 0) {
      card.classList.add("top-result-card");
    }

    const accent = personality.accent || personality.color || "#60a5fa";

    card.style.setProperty("--accent", accent);

    const percent = personality.percent ?? 0;

    card.innerHTML = `
      <div class="result-title">
        <span>${personality.name}</span>
        <span>${percent}%</span>
      </div>

      ${
        personality.heading
          ? `<p class="result-card-heading">${personality.heading}</p>`
          : ""
      }

      <div class="bar">
        <div
          class="bar-fill"
          data-target="${percent}"
          style="width:0%; background:${accent};"
        ></div>
      </div>

      ${
        index === 0 && personality.description
          ? `<p class="result-description">${personality.description}</p>`
          : ""
      }
    `;

    container.appendChild(card);
  });
}
