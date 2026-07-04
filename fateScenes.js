export const fateScene = [
  /* =========================
     PHASE 1: INTRO
  ========================= */

  {
    type: "text",
    value: "Analyzing your fate...",
  },

  { type: "wait", ms: 1200 },

  {
    type: "text",
    value: "Matching similar personalities...",
  },

  { type: "wait", ms: 1200 },

  { type: "textHide" },

  /* =========================
     PHASE 2: RENDER BASE UI
  ========================= */

  { type: "wait", ms: 600 },

  /* =========================
     PHASE 3: REVEAL MAIN CARD
  ========================= */

  {
    type: "revealCard",
    index: 0,
    sound: "./assets/sounds/reveal-soft.mp3",
  },

  { type: "wait", ms: 400 },

  /* =========================
     PHASE 4: STAGGER REMAINING CARDS
     (IMPORTANT: smoother than instant bars)
  ========================= */

  {
    type: "revealAll",
  },

  { type: "wait", ms: 500 },

  /* =========================
     PHASE 5: BAR ANIMATION
  ========================= */

  {
    type: "bars",
  },

  /* CRITICAL FIX: allow bars to finish */
  { type: "wait", ms: 900 },

  /* =========================
     PHASE 6: THEME (FIXED)
  ========================= */

  {
    type: "theme",
    color: "var(--accent)", // or replace with dynamic personality color if available
  },

  /* =========================
     PHASE 7: FINAL MOMENT
  ========================= */

  {
    type: "finalText",
    value: "Your fate has been revealed!",
  },

  { type: "wait", ms: 1200 },

  /* =========================
     PHASE 8: CLEAN EXIT
  ========================= */

  { type: "hideOverlay" },
];
