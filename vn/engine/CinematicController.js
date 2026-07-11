import { renderResults } from "../../ui/renderResults.js";
import { typewriterRichText } from "../../utils/richText.js";
import { crossfadeText } from "../effects/crossfadeText.js";

import {
  isSoundEnabled,
  crossfadeToCinematicMusic,
  crossfadeToCharacterTheme,
} from "../../utils/audioController.js";

import {
  getSkipCinematicPreference,
  setSkipCinematicPreference,
} from "../../utils/preferenceManager.js";

const wait = (ms) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

/**
 * Controls the cinematic reveal sequence.
 *
 * Music flow:
 *
 * Quiz:
 *   Loop the neutral World of Fated ambience.
 *
 * Cinematic:
 *   Fade out the quiz ambience and play the cinematic ambience.
 *
 * Results:
 *   Fade out the cinematic ambience and play the dominant
 *   personality's full character theme.
 */
export class CinematicController {
  constructor(context) {
    this.context = context;

    this.overlay = context.overlay;
    this.container = context.container;
    this.resultsSection = context.resultsSection;
    this.skipToggle = context.skipToggle;

    this.textElement = this.overlay?.querySelector(".fate-text") ?? null;

    this.skipped =
      this.skipToggle?.checked ?? getSkipCinematicPreference(false);

    this._cinematicMusicStarted = false;
    this._characterThemeStarted = false;
    this._soundToggle = null;

    document.body.classList.remove("cinematic-mode");

    this.ready = this.setupPreferences();
  }

  get topResult() {
    return this.context.results?.[0] ?? null;
  }

  /**
   * Initializes audio and connects the global sound toggle.
   */
  async setupPreferences() {
    if (this.skipToggle) {
      this.skipped = this.skipToggle.checked;

      this.skipToggle.addEventListener("change", () => {
        this.skipped = this.skipToggle.checked;
        setSkipCinematicPreference(this.skipped);
      });
    }
  }

  /**
   * Starts the reveal cinematic music once.
   *
   * The quiz ambience may be any length. It does not need to be cropped.
   * The audio controller fades out the currently playing quiz track before
   * beginning the cinematic track.
   */
  async startCinematicMusic() {
    await this.ready;

    if (this._cinematicMusicStarted) return;

    this._cinematicMusicStarted = true;
    this._characterThemeStarted = false;

    await crossfadeToCinematicMusic(1000);
  }

  /**
   * Starts the dominant personality's theme.
   */
  async startCharacterTheme() {
    const top = this.topResult;

    if (!top || !isSoundEnabled()) return;

    /*
     * Prefer the stable personality ID, but allow the full result object
     * so audioController can also read properties such as themeMusic.
     */
    await playCharacterTheme(top);
  }

  async onText(message) {
    await this.ready;

    if (!this.overlay || !this.textElement) return;

    document.body.classList.add("cinematic-mode");
    this.overlay.classList.remove("hidden");

    await this.startCinematicMusic();

    await crossfadeText(this.textElement, message, {
      skip: this.skipped,
      fadeMs: 300,
    });

    if (!this.skipped) {
      await wait(650);
    }
  }

  async onTextHide() {
    if (!this.textElement) return;

    this.textElement.classList.remove("show");

    if (!this.skipped) {
      await wait(300);
    }

    this.textElement.innerHTML = "";
  }

  async onRender() {
    if (!this.context.results?.length || !this.container) return;

    renderResults(this.context.results);
    this.applyResultTheme();

    this.container
      .querySelectorAll(".result-hero, .result-card")
      .forEach((element) => {
        element.classList.remove("reveal");
      });
  }

  async onRevealIdentity() {
    const top = this.topResult;

    if (!this.textElement || !top) return;

    this.textElement.classList.remove("show");
    this.textElement.innerHTML = "";

    if (!this.skipped) {
      await wait(250);
    }

    this.textElement.innerHTML = `
      <div class="identity-reveal">
        <p class="identity-kicker">You are most like...</p>

        <h2 class="identity-name">${top.name}</h2>

        ${top.heading ? `<p class="identity-heading">${top.heading}</p>` : ""}

        ${top.quote ? `<p class="identity-quote"></p>` : ""}

        ${
          top.portrait
            ? `
              <img
                class="identity-portrait"
                src="${top.portrait}"
                alt="${top.name}"
              />
            `
            : `
              <div
                class="identity-portrait identity-portrait-placeholder"
                aria-hidden="true"
              ></div>
            `
        }
      </div>
    `;

    const quoteElement = this.textElement.querySelector(".identity-quote");

    const portraitElement =
      this.textElement.querySelector(".identity-portrait");

    this.textElement.classList.add("show");

    /*
     * The former final reveal sound has been removed.
     * Cinematic ambience continues beneath the identity reveal.
     */

    if (top.quote && quoteElement) {
      await typewriterRichText(quoteElement, top.quote, {
        speed: 35,
        skip: this.skipped,
        openingQuote: "“",
        closingQuote: "”",
      });
    }

    portraitElement?.classList.add("pulse");

    if (!this.skipped) {
      await wait(900);
    }
  }

  async onRevealCard(index) {
    if (!this.container) return;

    const hero = this.container.querySelector(".result-hero");
    const cards = this.container.querySelectorAll(".result-card");
    const card = cards[index];

    /*
     * No reveal sting and no tick sound.
     */
    hero?.classList.add("reveal");
    card?.classList.add("reveal");

    if (!this.skipped) {
      await wait(500);
    }
  }

  async onRevealAll() {
    if (!this.container) return;

    const cards = this.container.querySelectorAll(".result-card");
    const interval = this.skipped ? 0 : 140;

    cards.forEach((card, index) => {
      window.setTimeout(() => {
        card.classList.add("reveal");
      }, index * interval);
    });

    if (!this.skipped) {
      await wait(cards.length * interval + 250);
    }
  }

  async onBars() {
    if (!this.container) return;

    const bars = this.container.querySelectorAll(".bar-fill");
    const interval = this.skipped ? 0 : 100;

    bars.forEach((bar, index) => {
      const target = Number(bar.dataset.target || 0);

      window.setTimeout(() => {
        bar.style.width = `${target}%`;
      }, index * interval);
    });

    if (!this.skipped) {
      await wait(bars.length * interval + 300);
    }
  }

  async onTheme(color) {
    if (!color) return;

    document.documentElement.style.setProperty("--accent", color);
  }

  /**
   * Ends the cinematic and begins the results-page character theme.
   */
  async onHideOverlay() {
    this.overlay?.classList.add("hidden");
    document.body.classList.remove("cinematic-mode");

    if (this.textElement) {
      this.textElement.classList.remove("show");
      this.textElement.innerHTML = "";
    }

    this._cinematicMusicStarted = false;
    this._characterThemeStarted = true;

    /*
     * The character theme begins while the cinematic track fades away.
     * This avoids the abrupt stop that occurred previously.
     */
    await crossfadeToCharacterTheme(this.topResult, 1400);
  }

  applyResultTheme() {
    const top = this.topResult;

    if (!top) return;

    document.documentElement.style.setProperty(
      "--accent",
      top.accent || top.color || "#60a5fa",
    );

    document.documentElement.style.setProperty(
      "--result-theme",
      top.color || "#566fb8",
    );
  }

  createSceneContext() {
    return {
      ...this.context,

      isSkipped: () => this.skipped,

      onText: this.onText.bind(this),
      onTextHide: this.onTextHide.bind(this),
      onRender: this.onRender.bind(this),
      onRevealIdentity: this.onRevealIdentity.bind(this),
      onRevealCard: this.onRevealCard.bind(this),
      onRevealAll: this.onRevealAll.bind(this),
      onBars: this.onBars.bind(this),
      onTheme: this.onTheme.bind(this),
      onHideOverlay: this.onHideOverlay.bind(this),
    };
  }
}
