import { renderResults } from "../../ui/renderResults.js";

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

    if (this.skipToggle) {
      this.skipToggle.addEventListener("change", () => {
        this.skipped = this.skipToggle.checked;
      });
    }
  }

  // =========================
  // TEXT SEQUENCE
  // =========================

  async onText(message) {
    if (!this.overlay || !this.textElement) return;

    this.overlay.classList.remove("hidden");

    this.textElement.textContent = message;

    this.textElement.classList.remove("fade-out");
    this.textElement.classList.add("fade-in");

    if (!this.skipped) {
      await wait(800);
    }
  }

  async onTextHide() {
    if (!this.textElement) return;

    this.textElement.classList.remove("fade-in");
    this.textElement.classList.add("fade-out");

    if (!this.skipped) {
      await wait(350);
    }

    this.textElement.textContent = "";
  }

  // =========================
  // RENDER RESULTS BASE
  // =========================

  async onRender() {
    if (!this.context?.results?.length) return;
    renderResults(this.context.results);
  }

  // =========================
  // CARD REVEALS
  // =========================

  async onRevealCard(index, sound) {
    const cards = this.container.querySelectorAll(".result-card");

    const card = cards[index];
    if (!card) return;

    card.classList.add("revealed");

    if (sound) {
      try {
        const audio = new Audio(sound);
        audio.volume = 0.45;
        audio.play().catch(() => {});
      } catch (_) {}
    }

    if (!this.skipped) {
      await wait(300);
    }
  }

  async onRevealAll() {
    const cards = this.container.querySelectorAll(".result-card");

    const delay = this.skipped ? 0 : 140;

    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("revealed");
      }, index * delay);
    });

    if (!this.skipped) {
      await wait(Math.max(cards.length - 1, 0) * delay + 50);
    }
  }

  // =========================
  // BAR ANIMATION
  // =========================

  async onBars() {
    const bars = this.container.querySelectorAll(".bar-fill");

    const delay = this.skipped ? 0 : 120;

    bars.forEach((bar, index) => {
      const target = Number(bar.dataset.target) || 0;

      setTimeout(() => {
        bar.style.width = `${target}%`;
      }, index * delay);
    });

    if (!this.skipped) {
      await wait(Math.max(bars.length - 1, 0) * delay + 400);
    }
  }

  // =========================
  // THEME
  // =========================

  async onTheme(color) {
    if (!color) return;

    document.documentElement.style.setProperty("--cinematic-accent", color);
  }

  // =========================
  // FINAL TEXT
  // =========================

  async onFinalText(message) {
    if (!this.textElement) return;

    this.textElement.textContent = message;

    this.textElement.classList.remove("fade-out");
    this.textElement.classList.add("fade-in");

    if (!this.skipped) {
      await wait(900);
    }
  }

  // =========================
  // CLEAN EXIT
  // =========================

  async onHideOverlay() {
    if (!this.overlay) return;

    this.overlay.classList.add("fade-out");

    if (!this.skipped) {
      await wait(350);
    }

    this.overlay.classList.add("hidden");
    this.overlay.classList.remove("fade-out");

    if (this.textElement) {
      this.textElement.textContent = "";
      this.textElement.classList.remove("fade-in");
      this.textElement.classList.remove("fade-out");
    }
  }

  // =========================
  // SCENE CONTEXT BINDING
  // =========================

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
