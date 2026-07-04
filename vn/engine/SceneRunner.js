const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class SceneRunner {
  constructor(context = {}) {
    this.context = context;
  }

  async run(scene = []) {
    for (const step of scene) {
      try {
        switch (step.type) {
          case "text":
            if (this.context.onText) {
              await this.context.onText(step.value);
            }
            break;

          case "textHide":
            if (this.context.onTextHide) {
              await this.context.onTextHide();
            }
            break;

          case "wait":
            if (!this.context.isSkipped?.()) {
              await sleep(step.ms ?? 0);
            }
            break;

          case "render":
            if (this.context.onRender) {
              await this.context.onRender();
            }
            break;

          case "revealCard":
            if (this.context.onRevealCard) {
              await this.context.onRevealCard(step.index, step.sound);
            }
            break;

          case "revealAll":
            if (this.context.onRevealAll) {
              await this.context.onRevealAll();
            }
            break;

          case "bars":
            if (this.context.onBars) {
              await this.context.onBars();
            }
            break;

          case "theme":
            if (this.context.onTheme) {
              await this.context.onTheme(step.color);
            }
            break;

          case "finalText":
            if (this.context.onFinalText) {
              await this.context.onFinalText(step.value);
            }
            break;

          case "hideOverlay":
            if (this.context.onHideOverlay) {
              await this.context.onHideOverlay();
            }
            break;

          case "action":
            if (typeof step.run === "function") {
              await step.run(this.context);
            }
            break;

          default:
            console.warn("Unknown scene step:", step.type);
        }
      } catch (err) {
        console.error("SceneRunner step failed:", step, err);
      }
    }
  }
}
