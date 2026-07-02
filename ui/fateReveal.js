import { renderResults } from "./renderResults.js";
import { playLayeredSound, fadeOutSound } from "../utils/soundManager.js";
import { SOUND_THEMES } from "../config/soundThemes.js";
import { shouldMuteAudio } from "../utils/deviceAudio.js";

/* =========================
   UTIL
========================= */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const prefersReducedMotion = window.matchMedia?.(
  "(prefers-reduced-motion: reduce)",
)?.matches;

/* =========================
   MAIN CINEMATIC REVEAL
========================= */

export async function fateReveal({
  results,
  resultsSection,
  container,
  overlay,
}) {
  const top = results?.[0];
  if (!top) return;

  const skipToggle = document.getElementById("skip-cinematic");

  window.__TOP_PERSONALITY__ = top.id;

  /* =========================
     SAFETY CHECKS
  ========================= */

  if (!resultsSection || !container || !overlay) {
    console.error("fateReveal: missing DOM elements");
    renderResults(results);
    return;
  }

  const text = overlay.querySelector(".fate-text");

  /* =========================
     CRITICAL FIX:
     NEVER BLOCK UI INTERACTION
  ========================= */

  // Overlay MUST NOT block clicks (fixes skip button issue)
  overlay.style.pointerEvents = "none";

  /* =========================
     HARD BYPASS (NO CINEMATIC)
  ========================= */

  const skipEnabled = skipToggle?.checked === true;
  const reducedMotion = prefersReducedMotion === true;

  if (skipEnabled || reducedMotion) {
    resultsSection.classList.remove("cinematic-mode");
    overlay.classList.add("hidden");

    renderResults(results);

    // ensure bars still render correctly
    requestAnimationFrame(() => {
      container.querySelectorAll(".bar-fill").forEach((bar) => {
        const value =
          bar.dataset.target || bar.getAttribute("data-value") || "0";
        bar.style.width = `${value}%`;
      });
    });

    return;
  }

  /* =========================
     ENTER CINEMATIC MODE
  ========================= */

  resultsSection.classList.add("cinematic-mode");
  overlay.classList.remove("hidden");

  /* =========================
     PHASE CONTROL SAFETY
  ========================= */

  let ambient = null;

  try {
    /* =========================
       AUDIO INIT (SAFE)
    ========================= */

    const muteAudio = await shouldMuteAudio?.();
    const theme = SOUND_THEMES?.[top.id] || SOUND_THEMES?.prometheia;

    if (!muteAudio && theme?.ambient) {
      ambient = playLayeredSound({
        src: theme.ambient,
        volume: 0.12,
        fadeIn: 2000,
        loop: true,
      });
    }

    /* =========================
       PHASE 1: INTRO
    ========================= */

    if (text) {
      text.textContent = "The system is analyzing your fate...";
      text.classList.add("show");
    }

    await sleep(1200);

    if (text) text.classList.remove("show");

    await sleep(300);

    if (text) {
      text.textContent = "Matching personality archetypes...";
      text.classList.add("show");
    }

    await sleep(1200);

    /* =========================
       PHASE 2: RENDER RESULTS
    ========================= */

    renderResults(results);

    const cards = Array.from(container.querySelectorAll(".result-card"));
    const bars = Array.from(container.querySelectorAll(".bar-fill"));

    cards.forEach((c) => {
      c.classList.remove("reveal");
      c.style.opacity = "0";
      c.style.transform = "translateY(10px)";
    });

    bars.forEach((b) => (b.style.width = "0%"));

    /* =========================
       PHASE 3: FIRST REVEAL
    ========================= */

    await sleep(600);

    if (cards[0]) {
      playLayeredSound?.({
        src: "./assets/sounds/reveal-soft.mp3",
        volume: 0.4,
        fadeIn: 100,
      });

      cards[0].classList.add("reveal");
      cards[0].style.opacity = "1";
      cards[0].style.transform = "translateY(0)";
    }

    /* =========================
       PHASE 4: STAGGER
    ========================= */

    for (let i = 1; i < cards.length; i++) {
      await sleep(250);

      playLayeredSound?.({
        src: "./assets/sounds/tick-soft.mp3",
        volume: 0.25,
      });

      cards[i].classList.add("reveal");
      cards[i].style.opacity = "1";
      cards[i].style.transform = "translateY(0)";
    }

    /* =========================
       PHASE 5: BAR ANIMATION
    ========================= */

    await sleep(400);

    bars.forEach((bar, index) => {
      const value = bar.dataset.target || bar.getAttribute("data-value") || "0";

      setTimeout(() => {
        bar.style.width = `${value}%`;
      }, index * 120);
    });

    /* =========================
       PHASE 6: FINAL IDENTITY
    ========================= */

    await sleep(900);

    if (text) {
      text.textContent = `You are: ${top.name}`;
      text.classList.add("show");
    }

    overlay.classList.remove("hidden");

    playLayeredSound?.({
      src: "./assets/sounds/fate-lock.mp3",
      volume: 0.5,
    });

    await sleep(1200);
  } catch (err) {
    console.error("fateReveal error:", err);
  } finally {
    /* =========================
       GUARANTEED CLEANUP (CRITICAL FIX)
    ========================= */

    if (ambient) {
      fadeOutSound?.(ambient, 1200);
    }

    overlay.classList.add("hidden");
    resultsSection.classList.remove("cinematic-mode");

    // restore interaction safety
    overlay.style.pointerEvents = "none";
  }
}
