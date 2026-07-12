import { setRichText } from "../utils/richText.js";

const DEFAULT_HERO_COLOR = "#566fb8";
const DEFAULT_CARD_ACCENT = "#ffffff";

function getHeroColor(personality) {
  return (
    personality?.heroColor ||
    personality?.accent ||
    personality?.color ||
    DEFAULT_HERO_COLOR
  );
}

function getCardAccent(personality) {
  return (
    personality?.cardAccent ||
    personality?.accent ||
    personality?.color ||
    DEFAULT_CARD_ACCENT
  );
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
     DOMINANT PERSONALITY CARD
  ======================================================== */

  if (top) {
    const heroColor = getHeroColor(top);
    const hero = document.createElement("section");

    hero.className = "result-hero";

    hero.style.setProperty("--hero-color", heroColor);

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
     BLUE PERCENTAGE CARDS
  ======================================================== */

  results.forEach((personality, index) => {
    const card = document.createElement("article");

    const cardAccent = getCardAccent(personality);

    const percent = Math.max(
      0,
      Math.min(100, Number(personality.percent ?? 0)),
    );

    card.className = "result-card";

    if (index === 0) {
      card.classList.add("top-result-card");
    }

    card.style.setProperty("--card-accent", cardAccent);

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
