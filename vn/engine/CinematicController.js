import { renderResults } from "../../ui/renderResults.js";

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

    if (this.skipToggle) {
      this.skipToggle.addEventListener("change", () => {
        this.skipped = this.skipToggle.checked;
      });
    }
  }

  get topResult() {
    return this.context.results?.[0] ?? null;
  }

  async onText(message) {
    if (!this.overlay || !this.textElement) {
      return;
    }

    document.body.classList.add("cinematic-mode");

    this.overlay.classList.remove("hidden");

    this.textElement.textContent = message;
    this.textElement.classList.add("show");

    this.textElement.style.display = "block";
    this.textElement.style.visibility = "visible";
    this.textElement.style.opacity = "1";
    this.textElement.style.color = "#ffffff";

    // Start ambient the first time text appears.
    if (!this._ambientStarted) {
      this._ambientStarted = true;
      playAmbient(this.topResult);
    }

    if (!this.skipped) {
      await wait(900);
    }
  }

  async onTextHide() {
    if (!this.textElement) return;

    this.textElement.classList.remove("show");
    this.textElement.textContent = "";

    if (!this.skipped) {
      await wait(300);
    }
  }

  async onRender() {
    if (!this.context.results) {
      return;
    }

    renderResults(this.context.results);
  }

  async onRevealCard(index) {
    const cards = this.container.querySelectorAll(".result-card");

    const card = cards[index];

    if (!card) return;

    playReveal(this.topResult);

    card.classList.add("reveal");

    if (!this.skipped) {
      await wait(250);
    }
  }

  async onRevealAll() {
    const cards = this.container.querySelectorAll(".result-card");

    cards.forEach((card, i) => {
      setTimeout(
        () => {
          if (i > 0) {
            playTick(this.topResult);
          }

          card.classList.add("reveal");
        },
        i * (this.skipped ? 0 : 140),
      );
    });

    if (!this.skipped) {
      await wait(cards.length * 140 + 250);
    }
  }

  async onBars() {
    const bars = this.container.querySelectorAll(".bar-fill");

    bars.forEach((bar, i) => {
      const target = Number(bar.dataset.target || 0);

      setTimeout(
        () => {
          playTick(this.topResult);

          bar.style.width = `${target}%`;
        },
        i * (this.skipped ? 0 : 100),
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

    if (this.overlay) {
      this.overlay.classList.add("hidden");
    }

    document.body.classList.remove("cinematic-mode");

    if (this.textElement) {
      this.textElement.classList.remove("show");
      this.textElement.textContent = "";
    }
  }

  createSceneContext() {
    return {
      ...this.context,

      isSkipped: () => this.skipped,

      onText: this.onText.bind(this),
      onTextHide: this.onTextHide.bind(this),
      onRender: this.onRender.bind(this),
      onRevealCard: this.onRevealCard.bind(this),
      onRevealAll: this.onRevealAll.bind(this),
      onBars: this.onBars.bind(this),
      onTheme: this.onTheme.bind(this),
      onFinalText: this.onFinalText.bind(this),
      onHideOverlay: this.onHideOverlay.bind(this),
    };
  }
}
