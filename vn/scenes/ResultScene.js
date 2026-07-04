import { initResultButtons } from "../../ui/resultActions.js";
import { VNState } from "../VNState.js";

export const ResultScene = {
  async run() {
    const overlay = document.getElementById("fate-overlay");

    // The cinematic already switched screens and rendered everything.
    // This scene only performs cleanup and enables the buttons.

    overlay?.classList.add("hidden");

    initResultButtons({
      onRetake() {
        VNState.reset();
        window.location.reload();
      },

      onHome() {
        window.location.href = "./";
      },

      onExplore() {
        window.location.href = "./characters";
      },
    });
  },
};
