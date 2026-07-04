export const fateScene = [
  /* =========================
     PHASE 1
     INTRO
  ========================= */

  {
    type: "text",
    value: "Analyzing your fate...",
  },

  {
    type: "wait",
    ms: 1200,
  },

  {
    type: "text",
    value: "Searching for your closest match...",
  },

  {
    type: "wait",
    ms: 1100,
  },

  {
    type: "text",
    value: "Your destiny is becoming clear...",
  },

  {
    type: "wait",
    ms: 900,
  },

  {
    type: "textHide",
  },

  /* =========================
     PHASE 2
     BUILD RESULTS
  ========================= */

  {
    type: "render",
  },

  {
    type: "wait",
    ms: 500,
  },

  /* =========================
     PHASE 3
     MAIN REVEAL
  ========================= */

  {
    type: "revealCard",
    index: 0,
  },

  {
    type: "wait",
    ms: 350,
  },

  /* =========================
     PHASE 4
     REMAINING CARDS
  ========================= */

  {
    type: "revealAll",
  },

  {
    type: "wait",
    ms: 400,
  },

  /* =========================
     PHASE 5
     PERCENT BARS
  ========================= */

  {
    type: "bars",
  },

  {
    type: "wait",
    ms: 700,
  },

  /* =========================
     PHASE 6
     CHARACTER THEME
  ========================= */

  {
    type: "theme",
    color: "var(--accent)",
  },

  /* =========================
     PHASE 7
     FINAL MESSAGE
  ========================= */

  {
    type: "finalText",
    value: "Your fate has been revealed.",
  },

  {
    type: "wait",
    ms: 1400,
  },

  /* =========================
     PHASE 8
     CLEAN EXIT
  ========================= */

  {
    type: "hideOverlay",
  },
];
