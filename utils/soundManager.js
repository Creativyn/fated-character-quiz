const audioCache = new Map();

/* =========================
   AUDIO LOADER
========================= */

function loadAudio(src) {
  if (!src) {
    console.warn("[Sound] No audio source provided.");
    return null;
  }

  if (!audioCache.has(src)) {
    const audio = new Audio(src);

    audio.preload = "auto";

    audio.addEventListener("error", () => {
      console.warn(`[Sound] Missing audio file: ${src}`);
    });

    audioCache.set(src, audio);
  }

  return audioCache.get(src).cloneNode(true);
}

/* =========================
   PLAY SOUND
========================= */

export function playLayeredSound({
  src,
  volume = 0.5,
  delay = 0,
  fadeIn = 0,
  loop = false,
} = {}) {
  const audio = loadAudio(src);

  if (!audio) {
    return null;
  }

  audio.volume = 0;
  audio.loop = loop;

  setTimeout(() => {
    audio.play().catch((err) => {
      console.warn("[Sound] Playback failed:", err);
    });

    if (fadeIn > 0) {
      const step = 0.05;
      const interval = Math.max(10, fadeIn / Math.max(1, volume / step));

      let current = 0;

      const fade = setInterval(() => {
        current += step;

        audio.volume = Math.min(volume, current);

        if (current >= volume) {
          clearInterval(fade);
        }
      }, interval);
    } else {
      audio.volume = volume;
    }
  }, delay);

  return audio;
}

/* =========================
   FADE OUT
========================= */

export function fadeOutSound(audio, duration = 500) {
  if (!audio) return;

  const startingVolume = audio.volume;

  if (startingVolume <= 0) {
    audio.pause();
    return;
  }

  const step = startingVolume / Math.max(1, duration / 50);

  const fade = setInterval(() => {
    audio.volume = Math.max(0, audio.volume - step);

    if (audio.volume <= 0) {
      clearInterval(fade);
      audio.pause();
      audio.currentTime = 0;
    }
  }, 50);
}

/* =========================
   STOP SOUND
========================= */

export function stopSound(audio) {
  if (!audio) return;

  audio.pause();
  audio.currentTime = 0;
}

/* =========================
   CLEAR CACHE
========================= */

export function clearAudioCache() {
  audioCache.clear();
}
