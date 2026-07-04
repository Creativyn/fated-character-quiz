import { SceneRunner } from "../engine/SceneRunner.js";
import { CinematicController } from "../engine/CinematicController.js";
import { fateScene } from "../../fateScenes.js";
import { renderResults } from "../../ui/renderResults.js";

export const FateScene = {
  async run(context) {
    const quizSection = document.getElementById("quiz-section");
    const resultsSection = document.getElementById("results-section");

    const overlay = document.getElementById("fate-overlay");
    const container = document.getElementById("results-container");

    /* =========================
       1. SWITCH SCREENS FIRST
    ========================= */

    quizSection?.classList.remove("active");
    resultsSection?.classList.add("active");

    /* =========================
       2. ALWAYS RENDER RESULTS FIRST
       (CRITICAL FIX)
    ========================= */

    if (!context.results || !context.results.length) {
      console.error("FateScene: missing results", context.results);
      return;
    }

    renderResults(context.results);

    /* =========================
       3. ENSURE CLEAN OVERLAY STATE
    ========================= */

    overlay?.classList.remove("hidden");

    /* DO NOT clear container anymore */
    // container.innerHTML = ""; ❌ REMOVED

    /* =========================
       4. CREATE CINEMATIC CONTROLLER
    ========================= */

    const controller = new CinematicController({
      ...context,
      overlay,
      container,
      resultsSection,
      skipToggle: document.getElementById("skip-cinematic"),
    });

    const runner = new SceneRunner(controller.createSceneContext());

    /* =========================
       5. RUN CINEMATIC
    ========================= */

    await runner.run(fateScene);

    /* =========================
       6. SAFETY CLEANUP
    ========================= */

    overlay?.classList.add("hidden");
  },
};
