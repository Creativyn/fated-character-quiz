export const fateScene = [
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

  { type: "render" },

  { type: "wait", ms: 500 },

  {
    type: "revealCard",
    index: 0,
    sound: "./assets/sounds/reveal-soft.mp3",
  },

  { type: "wait", ms: 400 },

  { type: "bars" },

  { type: "wait", ms: 900 },

  {
    type: "theme",
    color: null,
  },

  {
    type: "finalText",
    value: "Your fate has been revealed!",
  },

  { type: "wait", ms: 1200 },

  { type: "hideOverlay" },
];
