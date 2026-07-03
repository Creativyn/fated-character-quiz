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

        case "wait":
          await sleep(step.ms ?? 0);
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
