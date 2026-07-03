const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class SceneRunner {
  constructor(context = {}) {
    this.context = context;
  }

  async run(scene = []) {
    for (const step of scene) {
      switch (step.type) {
        case "text":
          if (typeof this.context.onText === "function") {
            await this.context.onText(step.value);
          }
          break;

        case "textHide":
          if (typeof this.context.onTextHide === "function") {
            await this.context.onTextHide();
          }
          break;

        case "wait":
          await sleep(step.ms ?? 0);
          break;

        case "render":
          if (typeof this.context.onRender === "function") {
            await this.context.onRender(this.context);
          }
          break;

        case "revealCard":
          if (typeof this.context.onRevealCard === "function") {
            await this.context.onRevealCard(step.index, step.sound);
          }
          break;

        case "revealAll":
          if (typeof this.context.onRevealAll === "function") {
            await this.context.onRevealAll();
          }
          break;

        case "bars":
          if (typeof this.context.onBars === "function") {
            await this.context.onBars();
          }
          break;

        case "theme":
          if (typeof this.context.onTheme === "function") {
            await this.context.onTheme(step.color);
          }
          break;

        case "finalText":
          if (typeof this.context.onFinalText === "function") {
            await this.context.onFinalText(step.value);
          }
          break;

        case "hideOverlay":
          if (typeof this.context.onHideOverlay === "function") {
            await this.context.onHideOverlay();
          }
          break;

        case "action":
          if (typeof step.run === "function") {
            await step.run(this.context);
          }
          break;

        default:
          console.warn("Unknown VN step:", step.type);
      }
    }
  }
}
