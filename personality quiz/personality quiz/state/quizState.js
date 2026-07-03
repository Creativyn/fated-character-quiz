export const quizState = {
  topPersonality: null,
  results: [],
};

export function setResults(results) {
  quizState.results = results;
  quizState.topPersonality = results?.[0] || null;
}

export function resetState() {
  quizState.results = [];
  quizState.topPersonality = null;
}
