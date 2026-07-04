export const fateScene = [
  // =========================
  // INTRO
  // =========================

  {
    type: "text",
    value: "Analyzing your fate...",
  },

  {
    type: "wait",
    ms: 1000,
  },

  {
    type: "text",
    value: "Searching for your closest match...",
  },

  {
    type: "wait",
    ms: 1000,
  },

  {
    type: "text",
    value: "Your destiny is becoming clear...",
  },

  {
    type: "wait",
    ms: 1000,
  },

  {
    type: "textHide",
  },

  // =========================
  // BUILD RESULTS
  // =========================

  {
    type: "render",
  },

  {
    type: "wait",
    ms: 300,
  },

  // =========================
  // REVEAL TOP RESULT
  // =========================

  {
    type: "revealCard",
    index: 0,
    sound: "./assets/sounds/reveal-soft.mp3",
  },

  {
    type: "wait",
    ms: 350,
  },

  // =========================
  // REVEAL REMAINING CARDS
  // =========================

  {
    type: "revealAll",
  },

  {
    type: "wait",
    ms: 450,
  },

  // =========================
  // ANIMATE BARS
  // =========================

  {
    type: "bars",
  },

  {
    type: "wait",
    ms: 700,
  },

  // =========================
  // APPLY THEME
  // =========================

  {
    type: "theme",
    color: "#60a5fa",
  },

  // =========================
  // FINAL MESSAGE
  // =========================

  {
    type: "finalText",
    value: "Your fate has been revealed.",
  },

  {
    type: "wait",
    ms: 1200,
  },

  // =========================
  // FINISH
  // =========================

  {
    type: "hideOverlay",
  },
];
