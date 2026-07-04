export const VNState = {
  questions: [],
  personalities: [],

  currentQuestion: 0,

  answers: [],

  results: null,

  /* =========================
     INIT
  ========================= */

  init({ questions, personalities }) {
    this.questions = Array.isArray(questions) ? questions : [];
    this.personalities = Array.isArray(personalities) ? personalities : [];

    this.currentQuestion = 0;
    this.answers = [];
    this.results = null;
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
    return this.answers[index];
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
    return this.results ?? [];
  },

  getTopResult() {
    return this.results?.[0] ?? null;
  },

  /* =========================
     RESET
  ========================= */

  reset() {
    this.currentQuestion = 0;
    this.answers = [];
    this.results = null;
  },

  /* =========================
     DEBUG HELPERS (SAFE)
  ========================= */

  debug() {
    return {
      questions: this.questions.length,
      personalities: this.personalities.length,
      answers: this.answers.length,
      hasResults: !!this.results,
    };
  },
};
