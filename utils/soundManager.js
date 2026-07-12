const audioCache = new Map();
const audioState = new WeakMap();

const PLAYABLE_READY_STATE = HTMLMediaElement.HAVE_FUTURE_DATA;

/* =========================
   INTERNAL STATE
========================= */

function getState(audio) {
  if (!audioState.has(audio)) {
    audioState.set(audio, {
      startTimer: null,
      fadeTimer: null,
      stopped: false,
    });
  }

  return audioState.get(audio);
}

function clearStartTimer(audio) {
  const state = getState(audio);

  if (state.startTimer !== null) {
    window.clearTimeout(state.startTimer);
    state.startTimer = null;
  }
}

function clearFadeTimer(audio) {
  const state = getState(audio);

  if (state.fadeTimer !== null) {
    window.clearInterval(state.fadeTimer);
    state.fadeTimer = null;
  }
}

function safelyReset(audio) {
  if (!audio) return;

  clearStartTimer(audio);
  clearFadeTimer(audio);

  try {
    audio.pause();
  } catch (error) {
    console.warn("[Sound] Could not pause audio:", error);
  }

  try {
    audio.currentTime = 0;
  } catch {
    // Some browsers reject currentTime changes before metadata loads.
  }
}

/* =========================
   AUDIO LOADER
========================= */

function createAudio(src) {
  const audio = new Audio();

  audio.preload = "auto";
  audio.src = src;
  audio.load();

  return audio;
}

function getCachedSource(src) {
  if (!src) {
    console.warn("[Sound] No audio source provided.");
    return null;
  }

  if (!audioCache.has(src)) {
    const template = createAudio(src);

    template.addEventListener("error", () => {
      const mediaError = template.error;

      console.warn("[Sound] Audio source failed to load:", {
        src,
        resolvedSrc: template.currentSrc || template.src,
        mediaErrorCode: mediaError?.code ?? null,
        networkState: template.networkState,
        readyState: template.readyState,
      });
    });

    audioCache.set(src, template);
  }

  return audioCache.get(src);
}

function createPlaybackInstance(src) {
  const template = getCachedSource(src);

  if (!template) return null;

  /*
   * Create a fresh Audio element from the resolved source rather than
   * cloning the template. cloneNode() can intermittently produce an
   * element whose media source is not yet usable.
   */
  const resolvedSrc = template.currentSrc || template.src || src;
  const audio = createAudio(resolvedSrc);

  getState(audio);

  return audio;
}

/* =========================
   READY / PLAY HELPERS
========================= */

function waitUntilPlayable(audio, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    if (!audio) {
      reject(new Error("No audio element supplied."));
      return;
    }

    if (audio.readyState >= PLAYABLE_READY_STATE) {
      resolve();
      return;
    }

    let settled = false;

    const cleanup = () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("loadeddata", handleCanPlay);
      audio.removeEventListener("error", handleError);
      window.clearTimeout(timeout);
    };

    const finish = (callback) => {
      if (settled) return;

      settled = true;
      cleanup();
      callback();
    };

    const handleCanPlay = () => {
      finish(resolve);
    };

    const handleError = () => {
      finish(() => {
        reject(
          new Error(
            `Audio could not be loaded: ${audio.currentSrc || audio.src}`,
          ),
        );
      });
    };

    const timeout = window.setTimeout(() => {
      finish(() => {
        reject(
          new Error(
            `Timed out while loading audio: ${audio.currentSrc || audio.src}`,
          ),
        );
      });
    }, timeoutMs);

    audio.addEventListener("canplay", handleCanPlay, {
      once: true,
    });

    audio.addEventListener("loadeddata", handleCanPlay, {
      once: true,
    });

    audio.addEventListener("error", handleError, {
      once: true,
    });

    audio.load();
  });
}

async function attemptPlayback(audio, retryCount = 1) {
  const state = getState(audio);

  if (state.stopped) return false;

  try {
    await waitUntilPlayable(audio);

    if (state.stopped) return false;

    await audio.play();
    return true;
  } catch (error) {
    if (state.stopped) return false;

    if (retryCount > 0) {
      /*
       * Reload the same source once. This helps with intermittent cache
       * and media-decoder failures without creating another untracked
       * audio element.
       */
      try {
        audio.load();
      } catch {
        // Continue to the retry regardless.
      }

      await new Promise((resolve) => {
        window.setTimeout(resolve, 250);
      });

      return attemptPlayback(audio, retryCount - 1);
    }

    console.warn("[Sound] Playback failed:", {
      src: audio.getAttribute("src"),
      resolvedSrc: audio.currentSrc || audio.src,
      error,
      networkState: audio.networkState,
      readyState: audio.readyState,
    });

    return false;
  }
}

/* =========================
   FADE HELPERS
========================= */

function fadeToVolume(audio, targetVolume, duration) {
  clearFadeTimer(audio);

  const state = getState(audio);

  if (duration <= 0) {
    audio.volume = targetVolume;
    return;
  }

  const startingVolume = audio.volume;
  const difference = targetVolume - startingVolume;
  const startedAt = performance.now();

  state.fadeTimer = window.setInterval(() => {
    if (state.stopped) {
      clearFadeTimer(audio);
      return;
    }

    const elapsed = performance.now() - startedAt;
    const progress = Math.min(1, elapsed / duration);

    audio.volume = Math.min(
      1,
      Math.max(0, startingVolume + difference * progress),
    );

    if (progress >= 1) {
      clearFadeTimer(audio);
    }
  }, 30);
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
  const audio = createPlaybackInstance(src);

  if (!audio) return null;

  const state = getState(audio);

  state.stopped = false;

  audio.loop = Boolean(loop);
  audio.volume = fadeIn > 0 ? 0 : Math.min(1, Math.max(0, volume));

  state.startTimer = window.setTimeout(
    async () => {
      state.startTimer = null;

      if (state.stopped) return;

      const started = await attemptPlayback(audio, 1);

      if (!started || state.stopped) return;

      if (fadeIn > 0) {
        fadeToVolume(audio, Math.min(1, Math.max(0, volume)), fadeIn);
      }
    },
    Math.max(0, delay),
  );

  return audio;
}

/* =========================
   FADE OUT
========================= */

export function fadeOutSound(audio, duration = 500) {
  if (!audio) return;

  const state = getState(audio);

  clearStartTimer(audio);
  clearFadeTimer(audio);

  /*
   * Mark it as stopped only after the fade completes. If playback is
   * still pending, stop immediately because there is nothing audible
   * to fade.
   */
  if (audio.paused || audio.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    state.stopped = true;
    safelyReset(audio);
    return;
  }

  const startingVolume = audio.volume;
  const startedAt = performance.now();

  if (startingVolume <= 0 || duration <= 0) {
    state.stopped = true;
    safelyReset(audio);
    return;
  }

  state.fadeTimer = window.setInterval(() => {
    const elapsed = performance.now() - startedAt;
    const progress = Math.min(1, elapsed / duration);

    audio.volume = Math.max(0, startingVolume * (1 - progress));

    if (progress >= 1) {
      clearFadeTimer(audio);
      state.stopped = true;
      safelyReset(audio);
    }
  }, 30);
}

/* =========================
   STOP SOUND
========================= */

export function stopSound(audio) {
  if (!audio) return;

  const state = getState(audio);

  state.stopped = true;
  safelyReset(audio);
}

/* =========================
   PRELOAD
========================= */

/**
 * Begins loading one or more audio files before they are needed.
 */
export function preloadSounds(sources = []) {
  const normalizedSources = Array.isArray(sources) ? sources : [sources];

  normalizedSources.filter(Boolean).forEach((src) => {
    getCachedSource(src);
  });
}

/* =========================
   CLEAR CACHE
========================= */

export function clearAudioCache() {
  audioCache.forEach((audio) => {
    safelyReset(audio);
    audio.removeAttribute("src");
    audio.load();
  });

  audioCache.clear();
}
