import { renderResults } from "../../ui/renderResults.js";
import { initResultButtons } from "../../ui/resultActions.js";
import { VNState } from "./VNState.js";

export const ResultScene = {
  async run({ results }) {
    const quizSection = document.getElementById("quiz-section");
    const resultsSection = document.getElementById("results-section");
    const overlay = document.getElementById("fate-overlay");

    if (!quizSection || !resultsSection) {
      throw new Error("Missing quiz or results section.");
    }

    // Switch screens
    quizSection.classList.remove("active");
    resultsSection.classList.add("active");

    // Make sure the cinematic overlay isn't left visible
    overlay?.classList.add("hidden");

    // Render results
    renderResults(results);

    // Animate percentage bars
    requestAnimationFrame(() => {
      document.querySelectorAll(".bar-fill").forEach((bar, index) => {
        const target = Number(bar.dataset.target || 0);

        setTimeout(() => {
          bar.style.width = `${target}%`;
        }, index * 120);
      });
    });

    // Hook up buttons
    initResultButtons({
      onRetake() {
        VNState.reset();

        resultsSection.classList.remove("active");
        quizSection.classList.add("active");

        document.getElementById("quiz")?.reset();

        document.getElementById("results-container").innerHTML = "";

        // Restart the engine by reloading for now.
        // Later we'll replace this with a true scene restart.
        window.location.reload();
      },
    });
  },
};
