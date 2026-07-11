import { getSoundTheme } from "../config/soundThemes.js";

import { playLayeredSound, fadeOutSound, stopSound } from "./soundManager.js";

import { shouldMuteAudio } from "./deviceAudio.js";

import { getSoundPreference, setSoundPreference } from "./preferenceManager.js";

let currentAudio = null;
let requestedMusic = null;
let soundEnabled = true;

const DEFAULT_FADE_MS = 900;

export async function initializeAudio() {
  const shouldMute = await shouldMuteAudio();

  soundEnabled = getSoundPreference(!shouldMute);
  setSoundPreference(soundEnabled);
}

export function isSoundEnabled() {
  return soundEnabled;
}

/**
 * Enables or disables music.
 *
 * Muting stops the audible track but preserves requestedMusic,
 * allowing the correct track to resume when unmuted.
 */
export function setSoundEnabled(enabled) {
  soundEnabled = Boolean(enabled);
  setSoundPreference(soundEnabled);

  if (!soundEnabled) {
    stopAudibleMusic();
    return;
  }

  resumeCurrentMusic();
}

function stopAudibleMusic() {
  if (!currentAudio) return;

  const audio = currentAudio;
  currentAudio = null;

  stopSound(audio);
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

function startRequestedMusic() {
  if (!soundEnabled || !requestedMusic?.src) {
    return null;
  }

  stopAudibleMusic();

  currentAudio = playLayeredSound({
    src: requestedMusic.src,
    volume: requestedMusic.volume,
    loop: requestedMusic.loop,
    fadeIn: requestedMusic.fadeIn,
  });

  return currentAudio;
}

function requestMusic(descriptor) {
  if (!descriptor?.src) return null;

  requestedMusic = descriptor;

  if (!soundEnabled) {
    return null;
  }

  return startRequestedMusic();
}

export function resumeCurrentMusic() {
  if (!soundEnabled || !requestedMusic?.src) {
    return null;
  }

  if (currentAudio) {
    return currentAudio;
  }

  return startRequestedMusic();
}

export function stopCurrentMusic({ clearRequestedMusic = true } = {}) {
  stopAudibleMusic();

  if (clearRequestedMusic) {
    requestedMusic = null;
  }
}

export function fadeOutCurrentMusic(
  durationMs = DEFAULT_FADE_MS,
  { clearRequestedMusic = true } = {},
) {
  return new Promise((resolve) => {
    if (!currentAudio) {
      if (clearRequestedMusic) {
        requestedMusic = null;
      }

      resolve();
      return;
    }

    const outgoingAudio = currentAudio;
    currentAudio = null;

    if (clearRequestedMusic) {
      requestedMusic = null;
    }

    fadeOutSound(outgoingAudio, durationMs);

    window.setTimeout(() => {
      stopSound(outgoingAudio);
      resolve();
    }, durationMs + 50);
  });
}

/**
 * Crossfades from the currently audible track to a new descriptor.
 */
function crossfadeTo(descriptor, durationMs = DEFAULT_FADE_MS) {
  if (!descriptor?.src) return null;

  requestedMusic = {
    ...descriptor,
    fadeIn: durationMs,
  };

  if (!soundEnabled) {
    stopAudibleMusic();
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
      stopSound(outgoingAudio);
    }, durationMs + 50);
  }

  return incomingAudio;
}

function getWorldMusic() {
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
      `No character theme configured for ${
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
    fadeIn: 1000,
    characterId:
      personality.id ??
      personality.slug ??
      personality.key ??
      personality.name ??
      "unknown",
  });
}

export function playQuizMusic() {
  const sounds = getWorldMusic();

  if (!sounds?.quiz) {
    console.warn("No quiz music configured at SOUND_THEMES.world.quiz.");

    return null;
  }

  return requestMusic(
    createDescriptor({
      type: "quiz",
      src: sounds.quiz,
      volume: 0.3,
      loop: true,
      fadeIn: 1200,
    }),
  );
}

export function playCinematicMusic() {
  const sounds = getWorldMusic();

  if (!sounds?.cinematic) {
    console.warn(
      "No cinematic music configured at " + "SOUND_THEMES.world.cinematic.",
    );

    return null;
  }

  return requestMusic(
    createDescriptor({
      type: "cinematic",
      src: sounds.cinematic,
      volume: 0.38,
      loop: true,
      fadeIn: 900,
    }),
  );
}

export function crossfadeToCinematicMusic(durationMs = DEFAULT_FADE_MS) {
  const sounds = getWorldMusic();

  if (!sounds?.cinematic) {
    console.warn(
      "No cinematic music configured at " + "SOUND_THEMES.world.cinematic.",
    );

    return null;
  }

  return crossfadeTo(
    createDescriptor({
      type: "cinematic",
      src: sounds.cinematic,
      volume: 0.38,
      loop: true,
    }),
    durationMs,
  );
}

export function playCharacterTheme(personality) {
  const descriptor = getCharacterDescriptor(personality);

  if (!descriptor) return null;

  return requestMusic(descriptor);
}

export function crossfadeToCharacterTheme(personality, durationMs = 1200) {
  const descriptor = getCharacterDescriptor(personality);

  if (!descriptor) return null;

  return crossfadeTo(descriptor, durationMs);
}

export function getCurrentMusicType() {
  return requestedMusic?.type ?? null;
}
