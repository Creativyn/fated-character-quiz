import { VNState } from "./VNState.js";
import { QuestionScene } from "./scenes/QuestionScene.js";
import { FateScene } from "./scenes/FateScene.js";
import { ResultScene } from "./scenes/ResultScene.js";

export class VNEngine {
  static async start({ questions, personalities }) {
    try {
      // Initialize application state
      VNState.init({
        questions,
        personalities,
      });

      // Sanity checks
      if (!VNState.questions.length) {
        throw new Error("VNState contains no questions.");
      }

      if (!VNState.personalities.length) {
        throw new Error("VNState contains no personalities.");
      }

      // Run the quiz. This should not resolve until the user
      // has answered the final question.
      await QuestionScene.run();

      const results = VNState.getResults();

      if (!results || results.length === 0) {
        throw new Error("QuestionScene finished without producing results.");
      }

      // Play the cinematic reveal
      await FateScene.run({ results });

      // Render the completed results screen
      await ResultScene.run({ results });

      console.log("VN complete.");
    } catch (err) {
      console.error("VNEngine crashed:", err);
    }
  }
}
