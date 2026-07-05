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
            await this.context.onText?.(step.value);
            break;

          case "textHide":
            await this.context.onTextHide?.();
            break;

          case "wait":
            if (!this.context.isSkipped?.()) {
              await sleep(step.ms ?? 0);
            }
            break;

          case "render":
            await this.context.onRender?.();
            break;

          case "revealIdentity":
            await this.context.onRevealIdentity?.();
            break;

          case "revealCard":
            await this.context.onRevealCard?.(step.index, step.sound);
            break;

          case "revealAll":
            await this.context.onRevealAll?.();
            break;

          case "bars":
            await this.context.onBars?.();
            break;

          case "theme":
            await this.context.onTheme?.(step.color);
            break;

          case "finalText":
            await this.context.onFinalText?.(step.value);
            break;

          case "hideOverlay":
            await this.context.onHideOverlay?.();
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
