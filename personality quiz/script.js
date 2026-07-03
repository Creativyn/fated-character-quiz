import { QUESTIONS } from "./data/questions.js";
import { PERSONALITIES } from "./config/personalities.js";
import { VNEngine } from "./vn/VNEngine.js";

async function bootApp() {
  await VNEngine.start({
    questions: QUESTIONS,
    personalities: PERSONALITIES,
  });

  console.log("VN Engine running");
}

bootApp();
