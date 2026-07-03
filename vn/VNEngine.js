import { QuizScene } from "./scenes/QuizScene.js";
import { FateScene } from "./scenes/FateScene.js";
import { ResultScene } from "./scenes/ResultScene.js";
import { VNState } from "./VNState.js";

export class VNEngine {
  static async start({ questions, personalities }) {
    try {
      VNState.init({ questions, personalities });

      await QuizScene.run();

      const results = VNState.getResults();

      await FateScene.run({ results });

      await ResultScene.run({ results });
    } catch (err) {
      console.error("VNEngine crashed:", err);

      // HARD FALLBACK
      const { renderResults } = await import("../ui/renderResults.js");
      renderResults(VNState.getResults());
    }
  }
}
