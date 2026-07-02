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
     HARD BYPASS CONDITIONS
  ========================= */

  const skipEnabled = skipToggle?.checked === true;
  const reducedMotion = prefersReducedMotion === true;

  if (skipEnabled || reducedMotion) {
    // HARD EXIT: no cinematic state at all
    resultsSection.classList.remove("cinematic-mode");
    overlay.classList.add("hidden");

    renderResults(results);

    // ensure bars animate normally even without cinematic system
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
     PHASE 1: INTRO TEXT
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
     PHASE 2: RENDER RESULTS (HIDDEN STATE FIRST)
  ========================= */

  renderResults(results);

  const cards = Array.from(container.querySelectorAll(".result-card"));
  const bars = Array.from(container.querySelectorAll(".bar-fill"));

  // reset all animation states
  cards.forEach((c) => {
    c.classList.remove("reveal");
    c.style.opacity = "0";
    c.style.transform = "translateY(10px)";
  });

  bars.forEach((b) => (b.style.width = "0%"));

  /* =========================
     PHASE 3: FIRST RESULT REVEAL
  ========================= */

  await sleep(600);

  if (cards[0]) {
    cards[0].classList.add("reveal");
    cards[0].style.opacity = "1";
    cards[0].style.transform = "translateY(0)";
  }

  /* =========================
     PHASE 4: STAGGER REMAINING CARDS
  ========================= */

  for (let i = 1; i < cards.length; i++) {
    await sleep(250);

    cards[i].classList.add("reveal");
    cards[i].style.opacity = "1";
    cards[i].style.transform = "translateY(0)";
  }

  /* =========================
     PHASE 5: BAR ANIMATION (SYNCED)
  ========================= */

  await sleep(400);

  bars.forEach((bar, index) => {
    const value = bar.dataset.target || bar.getAttribute("data-value") || "0";

    setTimeout(() => {
      bar.style.width = `${value}%`;
    }, index * 120);
  });

  /* =========================
     PHASE 6: FINAL REVEAL MOMENT
  ========================= */

  await sleep(900);

  if (text) {
    text.textContent = `You are: ${top.name}`;
    text.classList.add("show");
  }

  overlay.classList.remove("hidden");

  await sleep(1200);

  overlay.classList.add("hidden");
  resultsSection.classList.remove("cinematic-mode");
}
