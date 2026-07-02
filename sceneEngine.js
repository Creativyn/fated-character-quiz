import { renderResults } from "./renderResults.js";
import { playLayeredSound, fadeOutSound } from "../utils/soundManager.js";
import { shouldMuteAudio } from "../utils/deviceAudio.js";
import { SOUND_THEMES } from "../config/soundThemes.js";

/* =========================
   UTIL
========================= */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const prefersReducedMotion = window.matchMedia?.(
  "(prefers-reduced-motion: reduce)",
)?.matches;

/* =========================
   SAFE SKIP STATE (LIVE)
========================= */

let skipRequested = false;

function watchSkip(skipToggle) {
  skipRequested = false;

  if (!skipToggle) return;

  skipToggle.addEventListener("change", () => {
    if (skipToggle.checked) {
      skipRequested = true;
    }
  });
}

/* =========================
   SAFE CHECK
========================= */

function shouldAbort() {
  return skipRequested || prefersReducedMotion;
}

/* =========================
   SCENE ENGINE (STABLE)
========================= */

export async function runScene(scene, context) {
  const { results, container, overlay, resultsSection, skipToggle } = context;

  if (!results?.length) return;

  const top = results[0];
  window.__TOP_PERSONALITY__ = top.id;

  const text = overlay?.querySelector?.(".fate-text");

  if (!overlay || !resultsSection || !container) {
    console.error("SceneEngine: missing critical DOM nodes");
    renderResults(results);
    return;
  }

  watchSkip(skipToggle);

  /* =========================
     HARD BYPASS
  ========================= */

  if (shouldAbort()) {
    resultsSection.classList.remove("cinematic-mode");
    overlay.classList.add("hidden");
    renderResults(results);
    return;
  }

  resultsSection.classList.add("cinematic-mode");
  overlay.classList.remove("hidden");

  /* =========================
     AUDIO THEME
  ========================= */

  const theme = SOUND_THEMES?.[top.id] || SOUND_THEMES?.prometheia;
  const mute = await shouldMuteAudio?.();

  let ambient = null;

  if (!mute && theme?.ambient) {
    ambient = playLayeredSound({
      src: theme.ambient,
      volume: 0.12,
      fadeIn: 2000,
      loop: true,
    });
  }

  /* =========================
     EXECUTION LOOP (INTERRUPT SAFE)
  ========================= */

  for (const step of scene) {
    if (shouldAbort()) break;

    switch (step.type) {
      case "text":
        if (text) {
          text.textContent = step.value;
          text.classList.add("show");
        }
        break;

      case "textHide":
        text?.classList.remove("show");
        break;

      case "wait":
        await sleep(step.ms);
        break;

      case "render":
        renderResults(results);
        break;

      case "revealCard": {
        const cards = container.querySelectorAll(".result-card");
        const card = cards?.[step.index];

        if (card) {
          playLayeredSound({
            src: step.sound || "./assets/sounds/reveal-soft.mp3",
            volume: 0.4,
          });

          card.classList.add("reveal");
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }
        break;
      }

      case "revealAll": {
        const cards = container.querySelectorAll(".result-card");

        for (let i = 0; i < cards.length; i++) {
          if (shouldAbort()) break;

          await sleep(200);

          const c = cards[i];
          c.classList.add("reveal");
          c.style.opacity = "1";
          c.style.transform = "translateY(0)";
        }
        break;
      }

      case "bars": {
        const bars = container.querySelectorAll(".bar-fill");

        for (let i = 0; i < bars.length; i++) {
          if (shouldAbort()) break;

          const bar = bars[i];
          const value =
            bar.dataset.target || bar.getAttribute("data-value") || "0";

          await sleep(120);

          bar.style.width = `${value}%`;
        }
        break;
      }

      case "sound":
        playLayeredSound({
          src: step.src,
          volume: step.volume ?? 0.3,
        });
        break;

      case "theme":
        if (step.color) {
          document.documentElement.style.setProperty("--accent", step.color);
        }
        break;

      case "finalText":
        if (text) {
          text.textContent = `You are: ${step.value}`;
          text.classList.add("show");
        }
        break;

      case "hideOverlay":
        overlay.classList.add("hidden");
        break;

      case "showOverlay":
        overlay.classList.remove("hidden");
        break;
    }
  }

  /* =========================
     CLEANUP (ALWAYS RUN)
  ========================= */

  if (ambient) {
    fadeOutSound?.(ambient, 1200);
  }

  overlay.classList.add("hidden");
  resultsSection.classList.remove("cinematic-mode");

  if (shouldAbort()) {
    renderResults(results);
  }
}
