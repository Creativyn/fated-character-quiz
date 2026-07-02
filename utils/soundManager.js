const audioCache = new Map();

function loadAudio(src) {
  if (!audioCache.has(src)) {
    const audio = new Audio(src);
    audio.preload = "auto";
    audioCache.set(src, audio);
  }
  return audioCache.get(src).cloneNode(true);
}

/* =========================
   CORE PLAY FUNCTION
========================= */

export function playLayeredSound({
  src,
  volume = 0.5,
  delay = 0,
  fadeIn = 0,
  loop = false,
}) {
  const audio = loadAudio(src);

  audio.volume = 0;
  audio.loop = loop;

  setTimeout(() => {
    audio.play().catch(() => {});

    // fade in
    if (fadeIn > 0) {
      const step = 0.05;
      const interval = fadeIn / (volume / step);

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

  const step = audio.volume / (duration / 50);

  const fade = setInterval(() => {
    audio.volume = Math.max(0, audio.volume - step);

    if (audio.volume <= 0) {
      clearInterval(fade);
      audio.pause();
    }
  }, 50);
}
