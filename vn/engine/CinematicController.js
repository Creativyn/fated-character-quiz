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

    document.body.classList.remove("cinematic-mode");

    if (this.skipToggle) {
      this.skipToggle.addEventListener("change", () => {
        this.skipped = this.skipToggle.checked;
      });
    }
  }

  async onText(message) {
    console.log("[Cinematic] onText:", message);
    console.log("[Cinematic] overlay:", this.overlay);
    console.log("[Cinematic] text:", this.textElement);

    if (!this.overlay || !this.textElement) {
      console.warn("[Cinematic] Missing overlay or fate-text.");
      return;
    }

    document.body.classList.add("cinematic-mode");

    this.overlay.classList.remove("hidden");

    this.textElement.textContent = message;
    this.textElement.classList.add("show");

    // Force visibility in case another rule overrides it.
    this.textElement.style.display = "block";
    this.textElement.style.visibility = "visible";
    this.textElement.style.opacity = "1";
    this.textElement.style.color = "#ffffff";

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
      console.warn("[Cinematic] Missing results.");
      return;
    }

    renderResults(this.context.results);
  }

  async onRevealCard(index, sound) {
    const cards = this.container.querySelectorAll(".result-card");
    const card = cards[index];

    if (!card) return;

    card.classList.add("reveal");

    // Ignore missing audio instead of throwing.
    if (sound) {
      try {
        const audio = new Audio(sound);
        audio.volume = 0.4;
        audio.play().catch(() => {});
      } catch (_) {}
    }

    if (!this.skipped) {
      await wait(250);
    }
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
      await wait(cards.length * 120 + 200);
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
    console.log("[Cinematic] finalText:", message);

    if (!this.textElement) return;

    this.textElement.textContent = message;
    this.textElement.classList.add("show");

    this.textElement.style.display = "block";
    this.textElement.style.visibility = "visible";
    this.textElement.style.opacity = "1";
    this.textElement.style.color = "#ffffff";

    if (!this.skipped) {
      await wait(900);
    }
  }

  async onHideOverlay() {
    if (!this.overlay) return;

    this.overlay.classList.add("hidden");

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
