import { SceneRunner } from "../engine/SceneRunner.js";
import { CinematicController } from "../engine/CinematicController.js";
import { fateScene } from "../../fateScenes.js";
import { renderResults } from "../../ui/renderResults.js";

export const FateScene = {
  async run(context) {
    const overlay = document.getElementById("fate-overlay");
    const container = document.getElementById("results-container");

    // 1. FORCE render FIRST (important fix)
    renderResults(context.results);

    const controller = new CinematicController({
      ...context,
      overlay,
      container,
      resultsSection: document.getElementById("results-section"),
      skipToggle: document.getElementById("skip-cinematic"),
    });

    const runner = new SceneRunner(controller.createSceneContext());

    return runner.run(fateScene);
  },
};
