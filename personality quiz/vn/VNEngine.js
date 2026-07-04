import { VNState } from "./VNState.js";
import { QuestionScene } from "./scenes/QuestionScene.js";
import { FateScene } from "./scenes/FateScene.js";
import { ResultScene } from "./scenes/ResultScene.js";

export class VNEngine {
  static async start({ questions, personalities }) {
    try {
      VNState.init({ questions, personalities });

      if (!VNState.questions.length) {
        throw new Error("No questions loaded");
      }

      if (!VNState.personalities.length) {
        throw new Error("No personalities loaded");
      }

      // 🔥 WAIT until QuestionScene resolves (THIS was broken before)
      await QuestionScene.run();

      const results = VNState.getResults();

      if (!results?.length) {
        throw new Error("No results generated after quiz");
      }

      // 🔥 IMPORTANT: ensure results screen is ready BEFORE cinematic starts
      await FateScene.run({ results });

      // 🔥 Final static results screen
      await ResultScene.run({ results });

      console.log("VN complete");
    } catch (err) {
      console.error("VNEngine crashed:", err);
    }
  }
}
