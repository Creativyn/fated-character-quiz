import { renderResults } from "../../ui/renderResults.js";
import { playLayeredSound, fadeOutSound } from "../../utils/soundManager.js";
import { SOUND_THEMES } from "../../config/soundThemes.js";
import { shouldMuteAudio } from "../../utils/deviceAudio.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function runScene(scene, ctx) {
  const { results, container, overlay, resultsSection, skipToggle } = ctx;

  const top = results?.[0];
  if (!top) return;

  window.__TOP_PERSONALITY__ = top.id;

  const reduced = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  )?.matches;

  const skip = skipToggle?.checked;

  const text = overlay?.querySelector(".fate-text");

  if (reduced || skip) {
    renderResults(results);
    overlay?.classList.add("hidden");
    return;
  }

  resultsSection.classList.add("cinematic-mode");
  overlay.classList.remove("hidden");

  const theme = SOUND_THEMES?.[top.id] || SOUND_THEMES.prometheia;

  const mute = await shouldMuteAudio?.();
  let ambient;

  if (!mute && theme?.ambient) {
    ambient = playLayeredSound({
      src: theme.ambient,
      volume: 0.12,
      fadeIn: 2000,
      loop: true,
    });
  }

  for (const step of scene) {
    switch (step.type) {
      case "text":
        if (text) {
          text.textContent = step.value;
          text.classList.add("show");
        }
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
            src: step.sound,
            volume: 0.4,
          });

          card.classList.add("reveal");
        }
        break;
      }

      case "bars": {
        const bars = container.querySelectorAll(".bar-fill");

        bars.forEach((b, i) => {
          const v = b.dataset.target || "0";
          setTimeout(() => (b.style.width = `${v}%`), i * 120);
        });
        break;
      }

      case "theme":
        if (step.color) {
          document.documentElement.style.setProperty("--accent", step.color);
        }
        break;

      case "finalText":
        if (text) {
          text.textContent = step.value;
          text.classList.add("show");
        }
        break;

      case "hideOverlay":
        overlay.classList.add("hidden");
        break;
    }
  }

  if (ambient) fadeOutSound(ambient, 1200);

  resultsSection.classList.remove("cinematic-mode");
}
