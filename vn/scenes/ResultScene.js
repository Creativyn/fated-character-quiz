import { initResultButtons } from "../../ui/resultActions.js";
import { renderResults } from "../../ui/renderResults.js";
import { VNState } from "../VNState.js";

export const ResultScene = {
  async run({ results, prepareOnly = false }) {
    const quizSection = document.getElementById("quiz-section");
    const resultsSection = document.getElementById("results-section");
    const overlay = document.getElementById("fate-overlay");
    const container = document.getElementById("results-container");

    if (!quizSection || !resultsSection || !container) {
      throw new Error("Missing required result DOM elements.");
    }

    // -----------------------------
    // Switch to results screen
    // -----------------------------
    quizSection.classList.remove("active");
    resultsSection.classList.add("active");

    // Always hide overlay at start
    overlay?.classList.add("hidden");

    // -----------------------------
    // IMPORTANT: render structure ALWAYS here
    // -----------------------------
    container.innerHTML = "";
    renderResults(results);

    // If only preparing (for engine safety), stop here
    if (prepareOnly) return;

    // -----------------------------
    // Buttons only AFTER cinematic
    // -----------------------------
    initResultButtons({
      onRetake() {
        VNState.reset();
        window.location.reload();
      },
    });
  },
};
