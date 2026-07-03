export const VNState = {
  // Source data
  questions: [],
  personalities: [],

  // Runtime state
  currentQuestion: 0,
  answers: {},
  results: [],

  init({ questions, personalities }) {
    this.questions = [...questions];
    this.personalities = [...personalities];

    this.reset();
  },

  reset() {
    this.currentQuestion = 0;
    this.answers = {};
    this.results = [];
  },

  setAnswer(questionIndex, value) {
    this.answers[questionIndex] = value;
  },

  getAnswer(questionIndex) {
    return this.answers[questionIndex];
  },

  getAnswers() {
    return { ...this.answers };
  },

  nextQuestion() {
    if (this.currentQuestion < this.questions.length) {
      this.currentQuestion++;
    }
  },

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
    }
  },

  getCurrentQuestionIndex() {
    return this.currentQuestion;
  },

  getCurrentQuestion() {
    return this.questions[this.currentQuestion] ?? null;
  },

  hasMoreQuestions() {
    return this.currentQuestion < this.questions.length;
  },

  setResults(results) {
    this.results = [...results];
  },

  getResults() {
    return [...this.results];
  },

  getTopResult() {
    return this.results.length ? this.results[0] : null;
  },
};
