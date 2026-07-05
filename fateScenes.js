export const fateScene = [
  {
    type: "text",
    value: "Analyzing your fate...",
  },

  {
    type: "wait",
    ms: 1100,
  },

  {
    type: "text",
    value: "Searching every possibility...",
  },

  {
    type: "wait",
    ms: 1100,
  },

  {
    type: "text",
    value: "Calculating your strongest similarity...",
  },

  {
    type: "wait",
    ms: 1000,
  },

  {
    type: "textHide",
  },

  {
    type: "render",
  },

  {
    type: "wait",
    ms: 350,
  },

  {
    type: "revealIdentity",
  },

  {
    type: "wait",
    ms: 500,
  },

  {
    type: "revealCard",
    index: 0,
  },

  {
    type: "wait",
    ms: 350,
  },

  {
    type: "revealAll",
  },

  {
    type: "wait",
    ms: 400,
  },

  {
    type: "bars",
  },

  {
    type: "wait",
    ms: 900,
  },

  {
    type: "hideOverlay",
  },
];
