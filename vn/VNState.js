export const VNState = {
  questions: [],
  personalities: [],
  answers: {},
  results: [],

  init({ questions, personalities }) {
    this.questions = questions;
    this.personalities = personalities;
    this.answers = {};
  },

  setAnswer(qIndex, value) {
    this.answers[qIndex] = value;
  },

  getResults() {
    return this.results;
  },

  setResults(results) {
    this.results = results;
  },
};
