import { VNState } from "./VNState.js";
import { QuestionScene } from "./scenes/QuestionScene.js";
import { FateScene } from "./scenes/FateScene.js";
import { ResultScene } from "./scenes/ResultScene.js";

export class VNEngine {
  static async start({ questions, personalities }) {
    try {
      // Initialize global state
      VNState.init({
        questions,
        personalities,
      });

      // Run the quiz one question at a time
      await QuestionScene.run();

      // Retrieve calculated results
      const results = VNState.getResults();

      // Cinematic reveal
      await FateScene.run({ results });

      // Final results screen
      await ResultScene.run({ results });

      console.log("VN complete.");
    } catch (err) {
      console.error("VNEngine crashed:", err);
    }
  }
}
