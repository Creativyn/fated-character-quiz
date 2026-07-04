export const VNState = {
  questions: [],
  personalities: [],

  currentQuestion: 0,
  answers: [],
  results: null,

  init({ questions, personalities }) {
    this.questions = questions || [];
    this.personalities = personalities || [];

    this.reset();
  },

  reset() {
    this.currentQuestion = 0;
    this.answers = [];
    this.results = null;
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

  hasNext() {
    return this.currentQuestion < this.questions.length - 1;
  },

  hasPrevious() {
    return this.currentQuestion > 0;
  },

  nextQuestion() {
    if (this.hasNext()) this.currentQuestion++;
  },

  previousQuestion() {
    if (this.hasPrevious()) this.currentQuestion--;
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
};
