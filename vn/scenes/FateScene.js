import { SceneRunner } from "../engine/SceneRunner.js";
import { CinematicController } from "../engine/CinematicController.js";
import { fateScene } from "../../fateScenes.js";

export const FateScene = {
  async run(context) {
    const quizSection = document.getElementById("quiz-section");
    const resultsSection = document.getElementById("results-section");

    const overlay = document.getElementById("fate-overlay");
    const container = document.getElementById("results-container");

    // Switch screens BEFORE the cinematic starts.
    // Otherwise the overlay and result cards are hidden.
    quizSection?.classList.remove("active");
    resultsSection?.classList.add("active");

    // Start with a clean container.
    container.innerHTML = "";

    // Ensure the overlay is visible for the intro.
    overlay?.classList.remove("hidden");

    const controller = new CinematicController({
      ...context,
      overlay,
      container,
      resultsSection,
      skipToggle: document.getElementById("skip-cinematic"),
    });

    const runner = new SceneRunner(controller.createSceneContext());

    await runner.run(fateScene);
  },
};
