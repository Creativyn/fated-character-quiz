import { QUESTIONS } from "./data/questions.js";
import { PERSONALITIES } from "./config/personalities.js";
import { VNEngine } from "./vn/VNEngine.js";

import {
  initializeAudio,
  isSoundEnabled,
  playQuizMusic,
} from "./utils/audioController.js";

import {
  getSkipCinematicPreference,
  setSkipCinematicPreference,
} from "./utils/preferenceManager.js";

/**
 * Controls application startup and quiz-level preferences.
 */

let quizMusicStarted = false;

function bindQuizPreferences() {
  const skipToggle = document.getElementById("skip-cinematic");

  if (!skipToggle) return;

  const savedSkip = getSkipCinematicPreference(false);

  skipToggle.checked = savedSkip;

  skipToggle.addEventListener("change", () => {
    setSkipCinematicPreference(skipToggle.checked);
  });
}

/**
 * Starts the quiz music after the browser receives a user gesture.
 *
 * The listeners remove themselves after the first successful attempt,
 * so the music is not restarted on every click or keypress.
 */
async function startQuizMusicFromUserGesture() {
  if (quizMusicStarted) return;

  quizMusicStarted = true;

  try {
    if (isSoundEnabled()) {
      await playQuizMusic();
    }
  } catch (error) {
    /*
     * If playback fails, allow a later user gesture to try again.
     */
    quizMusicStarted = false;
    console.warn("Quiz music could not start:", error);
    return;
  }

  removeQuizMusicGestureListeners();
}

function removeQuizMusicGestureListeners() {
  document.removeEventListener("pointerdown", startQuizMusicFromUserGesture);

  document.removeEventListener("keydown", startQuizMusicFromUserGesture);

  document.removeEventListener("touchstart", startQuizMusicFromUserGesture);
}

function bindQuizMusicStart() {
  document.addEventListener("pointerdown", startQuizMusicFromUserGesture, {
    once: false,
  });

  document.addEventListener("keydown", startQuizMusicFromUserGesture, {
    once: false,
  });

  document.addEventListener("touchstart", startQuizMusicFromUserGesture, {
    once: false,
    passive: true,
  });
}

async function bootApp() {
  bindQuizPreferences();

  await initializeAudio();

  bindQuizMusicStart();

  await VNEngine.start({
    questions: QUESTIONS,
    personalities: PERSONALITIES,
  });

  console.log("VN Engine running");
}

bootApp().catch((error) => {
  console.error("Failed to start VN Engine:", error);
});
