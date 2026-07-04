import { renderResults } from "../../ui/renderResults.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class CinematicController {
  constructor(context) {
    this.context = context;

    this.overlay = context.overlay;
    this.container = context.container;
    this.resultsSection = context.resultsSection;
    this.skipToggle = context.skipToggle;

    this.textElement = this.overlay?.querySelector(".fate-text") ?? null;

    this.skipped = false;

    document.body.classList.remove("cinematic-mode");

    if (this.skipToggle) {
      this.skipToggle.checked = false;

      this.skipToggle.addEventListener("change", () => {
        this.skipped = this.skipToggle.checked;
      });
    }
  }

  async onText(message) {
    if (!this.overlay || !this.textElement) {
      return;
    }

    document.body.classList.add("cinematic-mode");

    this.overlay.classList.remove("hidden");

    this.textElement.textContent = message;
    this.textElement.classList.add("show");

    if (!this.skipped) {
      await wait(900);
    }
  }

  async onTextHide() {
    if (!this.textElement) {
      return;
    }

    this.textElement.classList.remove("show");

    if (!this.skipped) {
      await wait(300);
    }

    this.textElement.textContent = "";
  }

  async onRender() {
    if (!this.context.results?.length) {
      console.warn("No results available to render.");
      return;
    }

    renderResults(this.context.results);
  }

  async onRevealCard(index, sound) {
    const cards = this.container.querySelectorAll(".result-card");

    const card = cards[index];

    if (!card) {
      return;
    }

    card.classList.add("reveal");

    if (sound) {
      try {
        const audio = new Audio(sound);
        audio.volume = 0.4;
        audio.play().catch(() => {});
      } catch (_) {}
    }

    if (!this.skipped) {
      await wait(300);
    }
  }

  async onRevealAll() {
    const cards = this.container.querySelectorAll(".result-card");

    cards.forEach((card, index) => {
      setTimeout(
        () => {
          card.classList.add("reveal");
        },
        this.skipped ? 0 : index * 140,
      );
    });

    if (!this.skipped) {
      await wait(cards.length * 140 + 200);
    }
  }

  async onBars() {
    const bars = this.container.querySelectorAll(".bar-fill");

    bars.forEach((bar, index) => {
      const target = Number(bar.dataset.target) || 0;

      setTimeout(
        () => {
          bar.style.width = `${target}%`;
        },
        this.skipped ? 0 : index * 120,
      );
    });

    if (!this.skipped) {
      await wait(bars.length * 120 + 300);
    }
  }

  // ===== Part 2 starts here =====
  async onTheme(color) {
    if (!color) {
      return;
    }

    document.documentElement.style.setProperty("--accent", color);
  }

  async onFinalText(message) {
    if (!this.textElement) {
      return;
    }

    this.textElement.textContent = message;
    this.textElement.classList.add("show");

    if (!this.skipped) {
      await wait(1000);
    }
  }

  async onHideOverlay() {
    if (!this.overlay) {
      return;
    }

    this.overlay.classList.add("hidden");

    document.body.classList.remove("cinematic-mode");

    if (this.textElement) {
      this.textElement.textContent = "";
      this.textElement.classList.remove("show");
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
