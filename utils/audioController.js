import { getSoundTheme } from "../config/soundThemes.js";

import { playLayeredSound, fadeOutSound, stopSound } from "./soundManager.js";

import { shouldMuteAudio } from "./deviceAudio.js";

import { getSoundPreference, setSoundPreference } from "./preferenceManager.js";

let currentAudio = null;
let currentDescriptor = null;
let soundEnabled = true;

const DEFAULT_FADE_MS = 900;

/**
 * Initializes the user's saved music preference.
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
 * Changes the saved music preference.
 *
 * Enabling music does not automatically restart an old track.
 * The active page or cinematic must explicitly request the
 * appropriate music.
 */
export function setSoundEnabled(enabled) {
  soundEnabled = Boolean(enabled);
  setSoundPreference(soundEnabled);

  if (!soundEnabled) {
    stopCurrentMusic({
      clearDescriptor: false,
    });
  }
}

function stopAudioInstance(audio) {
  if (!audio) return;

  try {
    stopSound(audio);
  } catch (error) {
    console.warn("[Sound] Could not stop audio:", error);
  }
}

/**
 * Stops the currently tracked music immediately.
 */
export function stopCurrentMusic({ clearDescriptor = true } = {}) {
  const outgoingAudio = currentAudio;

  currentAudio = null;

  if (clearDescriptor) {
    currentDescriptor = null;
  }

  stopAudioInstance(outgoingAudio);
}

/**
 * Fades and stops the currently tracked music.
 */
export function fadeOutCurrentMusic(
  durationMs = DEFAULT_FADE_MS,
  { clearDescriptor = true } = {},
) {
  return new Promise((resolve) => {
    const outgoingAudio = currentAudio;

    currentAudio = null;

    if (clearDescriptor) {
      currentDescriptor = null;
    }

    if (!outgoingAudio) {
      resolve();
      return;
    }

    fadeOutSound(outgoingAudio, durationMs);

    window.setTimeout(() => {
      stopAudioInstance(outgoingAudio);
      resolve();
    }, durationMs + 75);
  });
}

function createDescriptor({
  type,
  src,
  volume,
  loop = true,
  fadeIn = 900,
  characterId = null,
}) {
  return {
    type,
    src,
    volume,
    loop,
    fadeIn,
    characterId,
  };
}

/**
 * Starts one track and makes it the only tracked music.
 */
function startDescriptor(descriptor) {
  if (!descriptor?.src) return null;

  currentDescriptor = descriptor;

  if (!soundEnabled) {
    return null;
  }

  /*
   * Stop the previous track before starting the replacement.
   * This prevents untracked duplicate Audio objects.
   */
  stopCurrentMusic({
    clearDescriptor: false,
  });

  currentDescriptor = descriptor;

  currentAudio = playLayeredSound({
    src: descriptor.src,
    volume: descriptor.volume,
    loop: descriptor.loop,
    fadeIn: descriptor.fadeIn,
  });

  return currentAudio;
}

/**
 * Crossfades to one new track.
 */
function crossfadeToDescriptor(descriptor, durationMs = DEFAULT_FADE_MS) {
  if (!descriptor?.src) return null;

  currentDescriptor = {
    ...descriptor,
    fadeIn: durationMs,
  };

  if (!soundEnabled) {
    stopCurrentMusic({
      clearDescriptor: false,
    });

    currentDescriptor = descriptor;
    return null;
  }

  const outgoingAudio = currentAudio;

  const incomingAudio = playLayeredSound({
    src: descriptor.src,
    volume: descriptor.volume,
    loop: descriptor.loop,
    fadeIn: durationMs,
  });

  currentAudio = incomingAudio;

  if (outgoingAudio && outgoingAudio !== incomingAudio) {
    fadeOutSound(outgoingAudio, durationMs);

    window.setTimeout(() => {
      stopAudioInstance(outgoingAudio);
    }, durationMs + 75);
  }

  return incomingAudio;
}

function getWorldTheme() {
  return getSoundTheme("world");
}

function getCharacterDescriptor(personality) {
  if (!personality) return null;

  const sounds = getSoundTheme(personality);

  const src =
    personality.themeMusic ??
    personality.music ??
    sounds?.characterTheme ??
    sounds?.theme ??
    null;

  if (!src) {
    console.warn(
      `No character music configured for ${
        personality.id ??
        personality.slug ??
        personality.key ??
        personality.name ??
        "unknown personality"
      }.`,
    );

    return null;
  }

  return createDescriptor({
    type: "character",
    src,
    volume: 0.42,
    loop: true,
    fadeIn: 1100,
    characterId:
      personality.id ??
      personality.slug ??
      personality.key ??
      personality.name ??
      "unknown",
  });
}

/**
 * Quiz-page ambience.
 */
export function playQuizMusic() {
  const sounds = getWorldTheme();

  if (!sounds?.quiz) {
    console.warn("No quiz music configured at SOUND_THEMES.world.quiz.");

    return null;
  }

  return startDescriptor(
    createDescriptor({
      type: "quiz",
      src: sounds.quiz,
      volume: 0.3,
      loop: true,
      fadeIn: 1000,
    }),
  );
}

/**
 * Cinematic ambience.
 */
export function playCinematicMusic() {
  const sounds = getWorldTheme();

  if (!sounds?.cinematic) {
    console.warn(
      "No cinematic music configured at " + "SOUND_THEMES.world.cinematic.",
    );

    return null;
  }

  return startDescriptor(
    createDescriptor({
      type: "cinematic",
      src: sounds.cinematic,
      volume: 0.38,
      loop: true,
      fadeIn: 900,
    }),
  );
}

export function crossfadeToCinematicMusic(durationMs = 1000) {
  const sounds = getWorldTheme();

  if (!sounds?.cinematic) {
    console.warn(
      "No cinematic music configured at " + "SOUND_THEMES.world.cinematic.",
    );

    return null;
  }

  return crossfadeToDescriptor(
    createDescriptor({
      type: "cinematic",
      src: sounds.cinematic,
      volume: 0.38,
      loop: true,
    }),
    durationMs,
  );
}

/**
 * Results-page character music.
 */
export function playCharacterTheme(personality) {
  const descriptor = getCharacterDescriptor(personality);

  if (!descriptor) return null;

  return startDescriptor(descriptor);
}

export function crossfadeToCharacterTheme(personality, durationMs = 1400) {
  const descriptor = getCharacterDescriptor(personality);

  if (!descriptor) return null;

  return crossfadeToDescriptor(descriptor, durationMs);
}

/**
 * Restarts the currently requested cinematic or character track.
 * Do not use this for the quiz page; request playQuizMusic() there.
 */
export function resumeCurrentMusic() {
  if (!soundEnabled || !currentDescriptor?.src) {
    return null;
  }

  if (currentAudio) {
    return currentAudio;
  }

  return startDescriptor(currentDescriptor);
}

export function getCurrentMusicType() {
  return currentDescriptor?.type ?? null;
}
