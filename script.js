import { QUESTIONS } from "./data/questions.js";
import { PERSONALITIES } from "./config/personalities.js";
import { VNEngine } from "./vn/VNEngine.js";
import {
  getSkipCinematicPreference,
  setSkipCinematicPreference,
} from "./utils/preferenceManager.js";

/**
 * Controls the quiz screen,
 * including the cinematic reveal
 */

function bindQuizPreferences() {
  const skipToggle = document.getElementById("skip-cinematic");

  if (!skipToggle) return;

  const savedSkip = getSkipCinematicPreference(false);

  skipToggle.checked = savedSkip;

  skipToggle.addEventListener("change", () => {
    setSkipCinematicPreference(skipToggle.checked);
  });
}

async function bootApp() {
  bindQuizPreferences();

  await VNEngine.start({
    questions: QUESTIONS,
    personalities: PERSONALITIES,
  });

  console.log("VN Engine running");
}

bootApp();
