import { getSoundTheme } from "../config/soundThemes.js";
import { playLayeredSound, fadeOutSound, stopSound } from "./soundManager.js";
import { shouldMuteAudio } from "./deviceAudio.js";
import { getSoundPreference, setSoundPreference } from "./preferenceManager.js";

let currentMusic = null;
let currentMusicType = null;
let currentCharacter = null;
let soundEnabled = true;

const DEFAULT_FADE_OUT_MS = 800;

/**
 * Initializes the saved sound preference.
 *
 * Audio may still require a user interaction before the browser
 * allows playback.
 */
export async function initializeAudio() {
  const shouldMute = await shouldMuteAudio();

  soundEnabled = getSoundPreference(!shouldMute);
  setSoundPreference(soundEnabled);
}

export function isSoundEnabled() {
  return soundEnabled;
}

/**
 * Enables or disables all background music.
 */
export function setSoundEnabled(enabled) {
  soundEnabled = Boolean(enabled);
  setSoundPreference(soundEnabled);

  if (!soundEnabled) {
    stopCurrentMusic();
  }
}

function theme(personality) {
  return getSoundTheme(personality);
}

/**
 * Stops the current music immediately.
 */
export function stopCurrentMusic() {
  if (!currentMusic) {
    currentMusicType = null;
    currentCharacter = null;
    return;
  }

  const audio = currentMusic;

  currentMusic = null;
  currentMusicType = null;
  currentCharacter = null;

  stopSound(audio);
}

/**
 * Fades out the current music, then stops it.
 */
export function fadeOutCurrentMusic(durationMs = DEFAULT_FADE_OUT_MS) {
  return new Promise((resolve) => {
    if (!currentMusic) {
      currentMusicType = null;
      currentCharacter = null;
      resolve();
      return;
    }

    const audio = currentMusic;

    /*
     * Clear the active reference immediately so another track can
     * safely begin after this promise resolves.
     */
    currentMusic = null;
    currentMusicType = null;
    currentCharacter = null;

    fadeOutSound(audio, durationMs);

    window.setTimeout(() => {
      stopSound(audio);
      resolve();
    }, durationMs + 50);
  });
}

/**
 * Internal helper for starting a music track.
 */
function startMusic({ src, volume, loop, fadeIn, type, characterId = null }) {
  if (!soundEnabled || !src) return null;

  stopCurrentMusic();

  currentMusic = playLayeredSound({
    src,
    volume,
    loop,
    fadeIn,
  });

  currentMusicType = type;
  currentCharacter = characterId;

  return currentMusic;
}

/**
 * Plays the looping World of Fated quiz ambience.
 *
 * This expects a world or quiz entry in soundThemes.js.
 */
export function playQuizMusic() {
  if (!soundEnabled) return null;

  const sounds = getSoundTheme("world");

  if (!sounds?.quiz) {
    console.warn("No quiz music configured at soundThemes.world.quiz.");
    return null;
  }

  if (currentMusic && currentMusicType === "quiz") {
    return currentMusic;
  }

  return startMusic({
    src: sounds.quiz,
    volume: 0.3,
    loop: true,
    fadeIn: 1200,
    type: "quiz",
  });
}

/**
 * Plays the dedicated fate-cinematic ambience.
 *
 * It may be longer than the cinematic. CinematicController fades it
 * out when the sequence ends.
 */
export function playCinematicMusic() {
  if (!soundEnabled) return null;

  const sounds = getSoundTheme("world");

  if (!sounds?.cinematic) {
    console.warn(
      "No cinematic music configured at " + "soundThemes.world.cinematic.",
    );
    return null;
  }

  if (currentMusic && currentMusicType === "cinematic") {
    return currentMusic;
  }

  return startMusic({
    src: sounds.cinematic,
    volume: 0.38,
    loop: true,
    fadeIn: 900,
    type: "cinematic",
  });
}

/**
 * Plays the dominant personality's full theme on the results page.
 *
 * The personality may provide themeMusic directly, or soundThemes.js
 * may define a characterTheme property for that personality.
 */
export function playCharacterTheme(personality) {
  if (!soundEnabled || !personality) return null;

  const sounds = theme(personality);

  const src =
    personality.themeMusic ??
    personality.music ??
    sounds?.characterTheme ??
    sounds?.theme ??
    null;

  if (!src) {
    console.warn(
      `No character theme configured for ${
        personality.id ?? personality.name ?? "unknown personality"
      }.`,
    );

    return null;
  }

  const characterId = personality.id ?? personality.name ?? "unknown";

  if (
    currentMusic &&
    currentMusicType === "character" &&
    currentCharacter === characterId
  ) {
    return currentMusic;
  }

  return startMusic({
    src,
    volume: 0.42,
    loop: true,
    fadeIn: 1000,
    type: "character",
    characterId,
  });
}

/**
 * Returns the current music phase.
 *
 * Useful when restoring audio after the user unmutes.
 */
export function getCurrentMusicType() {
  return currentMusicType;
}
