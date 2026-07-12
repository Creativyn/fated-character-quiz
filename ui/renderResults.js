import { setRichText } from "../utils/richText.js";

export function renderResults(results) {
  const container = document.getElementById("results-container");

  if (!container) {
    console.warn("renderResults: missing results-container");
    return;
  }

  if (!Array.isArray(results) || results.length === 0) {
    console.warn("renderResults: no results supplied");
    container.replaceChildren();
    return;
  }

  container.replaceChildren();

  const top = results[0];

  if (top) {
    const hero = document.createElement("section");

    hero.className = "result-hero";
    hero.style.setProperty("--accent", top.accent || top.color || "#60a5fa");

    const portraitMarkup = top.portrait
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
      `;

    const headingMarkup = top.heading
      ? `<p class="result-hero-heading">${top.heading}</p>`
      : "";

    const quoteMarkup = top.quote ? `<p class="result-hero-quote"></p>` : "";

    hero.innerHTML = `
      ${portraitMarkup}

      <div class="result-hero-copy">
        <p class="result-kicker">You are most like...</p>

        <h2 class="result-hero-name">${top.name}</h2>

        ${headingMarkup}

        ${quoteMarkup}
      </div>
    `;

    if (top.quote) {
      const quoteElement = hero.querySelector(".result-hero-quote");

      setRichText(quoteElement, top.quote, {
        openingQuote: "“",
        closingQuote: "”",
      });
    }

    container.appendChild(hero);
  }

  results.forEach((personality, index) => {
    const card = document.createElement("article");

    card.className = "result-card";

    if (index === 0) {
      card.classList.add("top-result-card");
    }

    const accent = personality.accent || personality.color || "#60a5fa";

    console.log(personality.name, personality.accent, personality.color);

    const percent = Number(personality.percent ?? 0);

    card.style.setProperty("--accent", accent);

    const headingMarkup = personality.heading
      ? `
        <p class="result-card-heading">
          ${personality.heading}
        </p>
      `
      : "";

    const descriptionMarkup =
      index === 0 && personality.description
        ? `<p class="result-description"></p>`
        : "";

    card.innerHTML = `
      <div class="result-title">
        <span>${personality.name}</span>
        <span>${percent}%</span>
      </div>

      ${headingMarkup}

      <div class="bar">
        <div
          class="bar-fill"
          data-target="${percent}"
          style="width: 0%; background: ${accent};"
        ></div>
      </div>

      ${descriptionMarkup}
    `;

    if (index === 0 && personality.description) {
      const descriptionElement = card.querySelector(".result-description");

      setRichText(descriptionElement, personality.description);
    }

    container.appendChild(card);
  });
}
