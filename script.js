import { QUESTIONS } from "./data/questions.js";
import { PERSONALITIES } from "./config/personalities.js";
import { VNEngine } from "./vn/VNEngine.js";

import {
  initializeAudio,
  isSoundEnabled,
  setSoundEnabled,
  playQuizMusic,
} from "./utils/audioController.js";

import {
  getSkipCinematicPreference,
  setSkipCinematicPreference,
} from "./utils/preferenceManager.js";

/**
 * Controls application startup, quiz preferences,
 * and the shared music controls.
 */

let quizMusicStarted = false;

function bindQuizPreferences() {
  const skipToggle = document.getElementById("skip-cinematic");

  if (!skipToggle) return;

  skipToggle.checked = getSkipCinematicPreference(false);

  skipToggle.addEventListener("change", () => {
    setSkipCinematicPreference(skipToggle.checked);
  });
}

function updateMusicToggleButtons() {
  const enabled = isSoundEnabled();

  document.querySelectorAll(".music-toggle").forEach((button) => {
    button.setAttribute("aria-pressed", String(enabled));
    button.textContent = enabled ? "🔊 Music on" : "🔇 Music off";
  });
}

function isQuizScreenActive() {
  return Boolean(
    document.getElementById("quiz-section")?.classList.contains("active"),
  );
}

function bindMusicToggleButtons() {
  document.querySelectorAll(".music-toggle").forEach((button) => {
    button.addEventListener("click", async () => {
      const shouldEnable = !isSoundEnabled();

      setSoundEnabled(shouldEnable);
      updateMusicToggleButtons();

      if (!shouldEnable) {
        return;
      }

      /*
       * When music is turned back on while the quiz screen is active,
       * explicitly request the quiz ambience.
       *
       * This prevents the audio controller from remaining silent
       * after the user muted music on the results screen.
       */
      if (isQuizScreenActive()) {
        quizMusicStarted = true;

        try {
          await playQuizMusic();
          removeQuizMusicGestureListeners();
        } catch (error) {
          quizMusicStarted = false;
          console.warn("Quiz music could not restart:", error);
        }
      }
    });
  });

  updateMusicToggleButtons();
}

/**
 * Starts quiz music after the first user gesture.
 * This avoids browser autoplay restrictions.
 */
async function startQuizMusicFromUserGesture() {
  if (quizMusicStarted) return;

  quizMusicStarted = true;

  try {
    if (isSoundEnabled()) {
      await playQuizMusic();
    }

    removeQuizMusicGestureListeners();
  } catch (error) {
    quizMusicStarted = false;
    console.warn("Quiz music could not start:", error);
  }
}

function removeQuizMusicGestureListeners() {
  document.removeEventListener("pointerdown", startQuizMusicFromUserGesture);

  document.removeEventListener("keydown", startQuizMusicFromUserGesture);

  document.removeEventListener("touchstart", startQuizMusicFromUserGesture);
}

function bindQuizMusicStart() {
  document.addEventListener("pointerdown", startQuizMusicFromUserGesture);

  document.addEventListener("keydown", startQuizMusicFromUserGesture);

  document.addEventListener("touchstart", startQuizMusicFromUserGesture, {
    passive: true,
  });
}

async function bootApp() {
  bindQuizPreferences();

  await initializeAudio();

  bindMusicToggleButtons();
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
