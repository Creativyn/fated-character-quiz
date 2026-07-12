import { setRichText } from "../utils/richText.js";

const DEFAULT_COLOR = "#60a5fa";
const DEFAULT_ACCENT = "#b4aff3";

function getPersonalityColor(personality) {
  return personality?.color || personality?.accent || DEFAULT_COLOR;
}

function getPersonalityAccent(personality) {
  return personality?.accent || personality?.color || DEFAULT_ACCENT;
}

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

  /* ========================================================
     DOMINANT RESULT HERO
  ======================================================== */

  if (top) {
    const color = getPersonalityColor(top);
    const accent = getPersonalityAccent(top);

    const hero = document.createElement("section");

    hero.className = "result-hero";

    hero.style.setProperty("--personality-color", color);

    hero.style.setProperty("--personality-accent", accent);

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
      ? `
        <p class="result-hero-heading">
          ${top.heading}
        </p>
      `
      : "";

    const quoteMarkup = top.quote ? `<p class="result-hero-quote"></p>` : "";

    hero.innerHTML = `
      ${portraitMarkup}

      <div class="result-hero-copy">
        <p class="result-kicker">
          You are most like...
        </p>

        <h2 class="result-hero-name">
          ${top.name}
        </h2>

        ${headingMarkup}

        ${quoteMarkup}
      </div>
    `;

    const heroQuote = hero.querySelector(".result-hero-quote");

    if (top.quote && heroQuote) {
      setRichText(heroQuote, top.quote, {
        openingQuote: "“",
        closingQuote: "”",
      });
    }

    container.appendChild(hero);
  }

  /* ========================================================
     RESULT CARDS
  ======================================================== */

  results.forEach((personality, index) => {
    const card = document.createElement("article");

    const color = getPersonalityColor(personality);

    const accent = getPersonalityAccent(personality);

    const percent = Math.max(
      0,
      Math.min(100, Number(personality.percent ?? 0)),
    );

    card.className = "result-card";

    if (index === 0) {
      card.classList.add("top-result-card");
    }

    card.style.setProperty("--personality-color", color);

    card.style.setProperty("--personality-accent", accent);

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
          style="width: 0%;"
        ></div>
      </div>

      ${descriptionMarkup}
    `;

    if (index === 0 && personality.description) {
      const descriptionElement = card.querySelector(".result-description");

      if (descriptionElement) {
        setRichText(descriptionElement, personality.description);
      }
    }

    container.appendChild(card);
  });
}
