import { SceneRunner } from "../engine/SceneRunner.js";
import { CinematicController } from "../engine/CinematicController.js";
import { fateScene } from "../../fateScenes.js";

export const FateScene = {
  async run(context) {
    const controller = new CinematicController({
      ...context,

      overlay: document.getElementById("fate-overlay"),

      container: document.getElementById("results-container"),

      resultsSection: document.getElementById("results-section"),

      skipToggle: document.getElementById("skip-cinematic"),
    });

    const runner = new SceneRunner(controller.createSceneContext());

    return runner.run(fateScene);
  },
};
