import { getSoundTheme } from "../config/soundThemes.js";
import { playLayeredSound, fadeOutSound, stopSound } from "./soundManager.js";
import { shouldMuteAudio } from "./deviceAudio.js";
import { getSoundPreference, setSoundPreference } from "./preferenceManager.js";

let ambientAudio = null;
let soundEnabled = true;

export async function initializeAudio() {
  const shouldMute = await shouldMuteAudio();

  soundEnabled = getSoundPreference(!shouldMute);

  setSoundPreference(soundEnabled);
}

export function isSoundEnabled() {
  return soundEnabled;
}

export function setSoundEnabled(enabled) {
  soundEnabled = Boolean(enabled);
  setSoundPreference(soundEnabled);

  if (!soundEnabled) {
    stopAmbient();
  }
}

function theme(personality) {
  return getSoundTheme(personality);
}

export function playAmbient(personality) {
  if (!soundEnabled) return;

  const sounds = theme(personality);

  if (!sounds.ambient) return;

  stopAmbient();

  ambientAudio = playLayeredSound({
    src: sounds.ambient,
    volume: 0.35,
    loop: true,
    fadeIn: 1200,
  });
}

export function stopAmbient() {
  if (!ambientAudio) return;

  const current = ambientAudio;
  ambientAudio = null;

  fadeOutSound(current, 800);

  setTimeout(() => {
    stopSound(current);
  }, 850);
}

export function playReveal(personality) {
  if (!soundEnabled) return;

  const sounds = theme(personality);

  if (sounds.reveal) {
    playLayeredSound({
      src: sounds.reveal,
      volume: 0.5,
    });
  }
}

export function playTick(personality) {
  if (!soundEnabled) return;

  const sounds = theme(personality);

  if (sounds.tick) {
    playLayeredSound({
      src: sounds.tick,
      volume: 0.32,
    });
  }
}

export function playFinal(personality) {
  if (!soundEnabled) return;

  const sounds = theme(personality);

  if (sounds.final) {
    playLayeredSound({
      src: sounds.final,
      volume: 0.6,
    });
  }
}
