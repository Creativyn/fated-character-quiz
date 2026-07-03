export const VNState = {
  questions: [],
  personalities: [],

  currentQuestion: 0,

  answers: [],

  results: [],

  init({ questions, personalities }) {
    this.questions = questions;
    this.personalities = personalities;

    this.currentQuestion = 0;
    this.answers = [];
    this.results = [];
  },

  getCurrentQuestion() {
    return this.questions[this.currentQuestion] ?? null;
  },

  getQuestionCount() {
    return this.questions.length;
  },

  getCurrentIndex() {
    return this.currentQuestion;
  },

  hasPrevious() {
    return this.currentQuestion > 0;
  },

  hasNext() {
    return this.currentQuestion < this.questions.length - 1;
  },

  nextQuestion() {
    if (this.hasNext()) {
      this.currentQuestion++;
    }
  },

  previousQuestion() {
    if (this.hasPrevious()) {
      this.currentQuestion--;
    }
  },

  setAnswer(index, value) {
    this.answers[index] = value;
  },

  getAnswer(index) {
    return this.answers[index];
  },

  getAnswers() {
    return [...this.answers];
  },

  setResults(results) {
    this.results = results;
  },

  getResults() {
    return this.results;
  },

  reset() {
    this.currentQuestion = 0;
    this.answers = [];
    this.results = [];
  },
};
