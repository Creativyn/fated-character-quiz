import { SceneRunner } from "../engine/SceneRunner.js";
import { fateScene } from "../../fateScenes.js";

export const FateScene = {
  async run(context) {
    const overlay = document.getElementById("fate-overlay");
    const container = document.getElementById("results-container");

    const runner = new SceneRunner({
      ...context,
      overlay,
      container,
      resultsSection: document.getElementById("results-section"),
      skipToggle: document.getElementById("skip-cinematic"),
    });

    return runner.run(fateScene);
  },
};
