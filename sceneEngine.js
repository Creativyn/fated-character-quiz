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
   SCENE ENGINE
========================= */

export async function runScene(scene, context) {
  const { results, container, overlay, resultsSection, skipToggle } = context;

  const top = results?.[0];
  if (!top) return;

  window.__TOP_PERSONALITY__ = top.id;

  const reducedMotion = prefersReducedMotion;
  const skip = skipToggle?.checked;

  const text = overlay.querySelector(".fate-text");

  /* =========================
     HARD BYPASS
  ========================= */

  if (reducedMotion || skip) {
    resultsSection.classList.remove("cinematic-mode");
    overlay.classList.add("hidden");
    renderResults(results);
    return;
  }

  resultsSection.classList.add("cinematic-mode");
  overlay.classList.remove("hidden");

  const theme = SOUND_THEMES?.[top.id] || SOUND_THEMES?.prometheia;

  let ambient = null;

  const mute = await shouldMuteAudio?.();

  if (!mute && theme?.ambient) {
    ambient = playLayeredSound({
      src: theme.ambient,
      volume: 0.12,
      fadeIn: 2000,
      loop: true,
    });
  }

  /* =========================
     EXECUTOR
  ========================= */

  for (const step of scene) {
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
        const card = cards[step.index];

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

        cards.forEach((c, i) => {
          setTimeout(() => {
            c.classList.add("reveal");
            c.style.opacity = "1";
            c.style.transform = "translateY(0)";
          }, i * 200);
        });
        break;
      }

      case "bars": {
        const bars = container.querySelectorAll(".bar-fill");

        bars.forEach((bar, i) => {
          const value =
            bar.dataset.target || bar.getAttribute("data-value") || "0";

          setTimeout(() => {
            bar.style.width = `${value}%`;
          }, i * 120);
        });
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
     CLEANUP
  ========================= */

  if (ambient) {
    fadeOutSound?.(ambient, 1200);
  }

  resultsSection.classList.remove("cinematic-mode");
}
