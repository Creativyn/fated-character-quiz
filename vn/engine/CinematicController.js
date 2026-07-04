import { renderResults } from "../../ui/renderResults.js";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export class CinematicController {
  constructor(context) {
    this.context = context;

    this.overlay = context.overlay;
    this.container = context.container;
    this.resultsSection = context.resultsSection;
    this.skipToggle = context.skipToggle;

    this.textElement = this.overlay?.querySelector(".fate-text");

    this.skipped = false;

    /* -------------------------
       HARD RESET (CRITICAL FIX)
    ------------------------- */
    document.body.classList.remove("cinematic-mode");

    if (this.overlay) {
      this.overlay.classList.add("hidden");
    }

    if (this.textElement) {
      this.textElement.classList.remove("fade-in", "fade-out");
      this.textElement.style.opacity = "";
      this.textElement.style.transform = "";
    }

    if (this.skipToggle) {
      this.skipToggle.checked = false;

      this.skipToggle.addEventListener("change", () => {
        this.skipped = this.skipToggle.checked;
      });
    }
  }

  async onText(message) {
    if (!this.overlay || !this.textElement) return;

    document.body.classList.add("cinematic-mode");
    this.overlay.classList.remove("hidden");

    /* let CSS handle animation instead of forcing styles */
    this.textElement.textContent = message;

    this.textElement.classList.remove("fade-out");
    this.textElement.classList.add("fade-in");

    if (!this.skipped) await wait(900);
  }

  async onTextHide() {
    if (!this.textElement) return;

    this.textElement.classList.remove("fade-in");
    this.textElement.classList.add("fade-out");

    if (!this.skipped) await wait(300);

    this.textElement.textContent = "";
  }

  async onRender() {
    if (!this.context.results) return;
    renderResults(this.context.results);
  }

  async onRevealCard(index, sound) {
    const cards = this.container.querySelectorAll(".result-card");
    const card = cards[index];

    if (!card) return;

    card.classList.add("reveal");

    if (sound) {
      try {
        const audio = new Audio(sound);
        audio.volume = 0.4;
        audio.play().catch(() => {});
      } catch {}
    }

    if (!this.skipped) await wait(250);
  }

  async onRevealAll() {
    const cards = this.container.querySelectorAll(".result-card");

    cards.forEach((card, i) => {
      setTimeout(
        () => {
          card.classList.add("reveal");
        },
        i * (this.skipped ? 0 : 120),
      );
    });

    if (!this.skipped) {
      await wait(cards.length * 120 + 250);
    }
  }

  async onBars() {
    const bars = this.container.querySelectorAll(".bar-fill");

    bars.forEach((bar, i) => {
      const target = Number(bar.dataset.target || 0);

      setTimeout(
        () => {
          bar.style.width = `${target}%`;
        },
        i * (this.skipped ? 0 : 100),
      );
    });

    if (!this.skipped) {
      await wait(bars.length * 100 + 250);
    }
  }

  async onTheme(color) {
    if (!color) return;
    document.documentElement.style.setProperty("--accent", color);
  }

  async onFinalText(message) {
    if (!this.textElement) return;

    this.textElement.textContent = message;

    this.textElement.classList.remove("fade-out");
    this.textElement.classList.add("fade-in");

    if (!this.skipped) await wait(900);
  }

  async onHideOverlay() {
    if (!this.overlay) return;

    this.overlay.classList.add("hidden");
    document.body.classList.remove("cinematic-mode");

    if (this.textElement) {
      this.textElement.textContent = "";
      this.textElement.classList.remove("fade-in", "fade-out");
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
