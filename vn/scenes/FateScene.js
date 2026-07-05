import { SceneRunner } from "../engine/SceneRunner.js";
import { CinematicController } from "../engine/CinematicController.js";
import { fateScene } from "../../fateScenes.js";

export const FateScene = {
  async run({ results }) {
    const quizSection = document.getElementById("quiz-section");
    const resultsSection = document.getElementById("results-section");

    const overlay = document.getElementById("fate-overlay");
    const container = document.getElementById("results-container");
    const skipToggle = document.getElementById("skip-cinematic");

    if (!overlay) {
      throw new Error("Missing #fate-overlay");
    }

    if (!container) {
      throw new Error("Missing #results-container");
    }

    // Show the results screen so the cards exist behind the overlay.
    quizSection?.classList.remove("active");
    resultsSection?.classList.add("active");
    document.querySelector(".quiz-preferences")?.classList.add("hidden");

    // Start fresh.
    container.innerHTML = "";

    // Show the overlay.
    overlay.classList.remove("hidden");

    const controller = new CinematicController({
      results,
      overlay,
      container,
      resultsSection,
      skipToggle,
    });

    const runner = new SceneRunner(controller.createSceneContext());

    await runner.run(fateScene);
  },
};
