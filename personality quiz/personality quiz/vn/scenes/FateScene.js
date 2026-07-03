import { runScene } from "../engine/SceneRunner.js";
import { fateScene } from "../scene/fateScenes.js";

export const FateScene = {
  async run(context) {
    const overlay = document.getElementById("fate-overlay");
    const container = document.getElementById("results-container");

    return runScene(fateScene, {
      ...context,
      overlay,
      container,
      resultsSection: document.getElementById("results-section"),
      skipToggle: document.getElementById("skip-cinematic"),
    });
  },
};
