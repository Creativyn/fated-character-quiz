import { initResultButtons } from "../../ui/resultActions.js";
import { VNState } from "../VNState.js";

export const ResultScene = {
  async run({ results }) {
    const quizSection = document.getElementById("quiz-section");
    const resultsSection = document.getElementById("results-section");
    const overlay = document.getElementById("fate-overlay");

    if (!quizSection || !resultsSection) {
      throw new Error("Missing quiz or results section.");
    }

    // Switch screens ONLY
    quizSection.classList.remove("active");
    resultsSection.classList.add("active");

    // Ensure overlay is hidden (cinematic already finished)
    overlay?.classList.add("hidden");

    // DO NOT re-render results (already done in FateScene)

    initResultButtons({
      onRetake() {
        VNState.reset();
        window.location.reload();
      },
    });
  },
};
