const KEYS = {
  soundEnabled: "fatedQuiz.soundEnabled",
  skipCinematic: "fatedQuiz.skipCinematic",
};

/**
 * Controls persistence
 */

export function getBooleanPreference(key, fallback = false) {
  const value = localStorage.getItem(key);

  if (value === null) {
    return fallback;
  }

  return value === "true";
}

export function setBooleanPreference(key, value) {
  localStorage.setItem(key, String(Boolean(value)));
}

export function getSoundPreference(fallback = true) {
  return getBooleanPreference(KEYS.soundEnabled, fallback);
}

export function setSoundPreference(value) {
  setBooleanPreference(KEYS.soundEnabled, value);
}

export function getSkipCinematicPreference(fallback = false) {
  return getBooleanPreference(KEYS.skipCinematic, fallback);
}

export function setSkipCinematicPreference(value) {
  setBooleanPreference(KEYS.skipCinematic, value);
}
