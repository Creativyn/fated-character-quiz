import { renderResults } from "../../ui/renderResults.js";
import { typewriter } from "../effects/typewriter.js";
import { crossfadeText } from "../effects/crossfadeText.js";

import {
  initializeAudio,
  isSoundEnabled,
  setSoundEnabled,
  playAmbient,
  playReveal,
  playTick,
  playFinal,
  stopAmbient,
} from "../../utils/audioController.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class CinematicController {
  constructor(context) {
    this.context = context;

    this.overlay = context.overlay;
    this.container = context.container;
    this.resultsSection = context.resultsSection;
    this.skipToggle = context.skipToggle;

    this.textElement = this.overlay?.querySelector(".fate-text");

    this.skipped = false;
    this._ambientStarted = false;

    document.body.classList.remove("cinematic-mode");

    initializeAudio();

    const soundToggle = document.getElementById("sound-toggle");

    if (soundToggle) {
      soundToggle.checked = isSoundEnabled();

      soundToggle.addEventListener("change", () => {
        setSoundEnabled(soundToggle.checked);

        if (soundToggle.checked) {
          playAmbient(this.topResult);
        } else {
          stopAmbient();
        }
      });
    }

    const skipPref = localStorage.getItem("fatedQuiz.skipCinematic");

    if (this.skipToggle) {
      this.skipped = skipPref === "true";
      this.skipToggle.checked = this.skipped;

      this.skipToggle.addEventListener("change", () => {
        this.skipped = this.skipToggle.checked;

        localStorage.setItem("fatedQuiz.skipCinematic", String(this.skipped));
      });
    }
  }

  get topResult() {
    return this.context.results?.[0] ?? null;
  }

  async onText(message) {
    if (!this.overlay || !this.textElement) return;

    document.body.classList.add("cinematic-mode");
    this.overlay.classList.remove("hidden");

    if (!this._ambientStarted) {
      this._ambientStarted = true;
      playAmbient(this.topResult);
    }

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
    if (!this.context.results?.length) return;

    renderResults(this.context.results);
    this.applyResultTheme();

    this.container
      .querySelectorAll(".result-hero, .result-card")
      .forEach((el) => {
        el.classList.remove("reveal");
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

    playFinal(top);

    if (top.quote && quoteElement) {
      await typewriter(quoteElement, `“${top.quote}”`, {
        speed: 30,
        skip: this.skipped,
      });
    }

    portraitElement?.classList.add("pulse");

    if (!this.skipped) {
      await wait(900);
    }
  }

  async onRevealCard(index) {
    const top = this.topResult;

    const hero = this.container.querySelector(".result-hero");
    const cards = this.container.querySelectorAll(".result-card");
    const card = cards[index];

    playReveal(top);

    hero?.classList.add("reveal");
    card?.classList.add("reveal");

    if (!this.skipped) {
      await wait(500);
    }
  }

  async onRevealAll() {
    const cards = this.container.querySelectorAll(".result-card");

    cards.forEach((card, index) => {
      setTimeout(
        () => {
          if (index > 0) {
            playTick(this.topResult);
            card.classList.add("reveal");
          }
        },
        index * (this.skipped ? 0 : 140),
      );
    });

    if (!this.skipped) {
      await wait(cards.length * 140 + 250);
    }
  }

  async onBars() {
    const bars = this.container.querySelectorAll(".bar-fill");

    bars.forEach((bar, index) => {
      const target = Number(bar.dataset.target || 0);

      setTimeout(
        () => {
          playTick(this.topResult);
          bar.style.width = `${target}%`;
        },
        index * (this.skipped ? 0 : 100),
      );
    });

    if (!this.skipped) {
      await wait(bars.length * 100 + 300);
    }
  }

  async onTheme(color) {
    if (!color) return;

    document.documentElement.style.setProperty("--accent", color);
  }

  async onFinalText(message) {
    if (!this.textElement) return;

    playFinal(this.topResult);

    this.textElement.textContent = message;
    this.textElement.classList.add("show");

    if (!this.skipped) {
      await wait(900);
    }
  }

  async onHideOverlay() {
    if (isSoundEnabled()) {
      stopAmbient();
    }

    this.overlay?.classList.add("hidden");

    document.body.classList.remove("cinematic-mode");

    if (this.textElement) {
      this.textElement.classList.remove("show");
      this.textElement.innerHTML = "";
    }
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
      onFinalText: this.onFinalText.bind(this),
      onHideOverlay: this.onHideOverlay.bind(this),
    };
  }
}
