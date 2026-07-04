export const VNState = {
  questions: [],
  personalities: [],

  currentQuestion: 0,

  answers: [],

  results: [],

  init({ questions, personalities }) {
    this.questions = Array.isArray(questions) ? questions : [];
    this.personalities = Array.isArray(personalities) ? personalities : [];

    this.currentQuestion = 0;
    this.answers = [];
    this.results = [];
  },

  /* =========================
     QUESTIONS
  ========================= */

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

  /* =========================
     ANSWERS
  ========================= */

  setAnswer(index, value) {
    this.answers[index] = value;
  },

  getAnswer(index) {
    return this.answers[index] ?? null;
  },

  getAnswers() {
    return [...this.answers];
  },

  /* =========================
     RESULTS
  ========================= */

  setResults(results) {
    this.results = Array.isArray(results) ? results : [];
  },

  getResults() {
    return [...this.results];
  },

  getTopResult() {
    return this.results.length ? this.results[0] : null;
  },

  /* =========================
     RESET
  ========================= */

  reset() {
    this.currentQuestion = 0;
    this.answers = [];
    this.results = [];
  },
};
